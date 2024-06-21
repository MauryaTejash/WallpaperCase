import { db } from "@/db"
import { stripe } from "@/lib/stripe"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import Stripe from "stripe"
import {Resend} from "resend"
import OredrRecievedEmail from "@/components/emails/OrderRecievedEmail"

// use of Resend lib to send the email to the users
const resend = new Resend(process.env.RESEND_API_KEY)
// webHook from the stripe which will call its own api for the succesfull payment
export async function POST(req:Request) {
    try {
        // this will give the details of body of webhook from strip
        const body = await req.text() 
        // stripe send the 'signature' to webhook
        const signature = headers().get('stripe-signature')

        if(!signature){
            return new Response('Invalid Signature',{status: 400})
        }
        // connection of webhook of stripe for succesfull payments
        const event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
            )

            if(event.type === "checkout.session.completed"){
                if(!event.data.object.customer_details?.email){
                    throw new Error('Missing email')
                }

                // creation of session 
                const session = event.data.object as Stripe.Checkout.Session

                // getting the meta data which is creted in stripe session of payment
                const {userId,orderId} = session.metadata || {
                    userId : null,
                    orderId: null
                }

                if(!userId || !orderId){
                    throw new Error('Invalid meta data')
                }
                // taking shipping and billing address for user to provide
                const billingAddress = session.customer_details!.address
                const shippingAddress = session.shipping_details!.address

                // updating the order details
                const updatedOrder = await db.order.update({
                    where:{
                        id: orderId,
                    },
                    data:{
                        isPaid: true,
                        shippingAddress: {
                            create:{
                                name: session.customer_details?.name!,
                                city: shippingAddress?.city!,
                                country: shippingAddress?.country!,
                                postalCode: shippingAddress?.postal_code!,
                                street: shippingAddress?.line1!,
                                state: shippingAddress?.state
                            }
                        },
                        billingAddress: {
                            create:{
                                name: session.customer_details?.name!,
                                city: billingAddress?.city!,
                                country: billingAddress?.country!,
                                postalCode: billingAddress?.postal_code!,
                                street: shippingAddress?.line1!,
                                state: billingAddress?.state
                            }
                        }
                    }
                })
                // all this details will be send to the user via email
                await resend.emails.send({
                    from: "WallpaperCase<devikush563@gmail.com>",
                    to: [event.data.object.customer_details.email],
                    subject: "Thanks you for believing in us",
                    react: OredrRecievedEmail({
                        orderId,
                        orderDate: updatedOrder.createdAt.toLocaleDateString(),
                        // @ts-ignore
                        shippingAddress: {
                                    name: session.customer_details!.name!,
                                    city: shippingAddress!.city!,
                                    country: shippingAddress!.country!,
                                    postalCode: shippingAddress!.postal_code!,
                                    street: shippingAddress!.line1!,
                                    state: shippingAddress!.state,
                            }
                    })
                })
            }
            return NextResponse.json({Result: event, ok: true})
    } catch (error) {
        console.error(error);
        
        return NextResponse.json(
            {message: 'Something went wrong', ok: true},
            { status: 500}
        )
    }
}