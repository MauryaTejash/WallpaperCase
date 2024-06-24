'use server'
import { BASE_PRICE, PRODUCT_PRICES } from "@/config/products"
import { db } from "@/db"
import { stripe } from "@/lib/stripe"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { Order } from "@prisma/client"

// setting the typescript values
export const createCheckoutSession = async({configId,}:{configId:string})=>{
    const configuration = await db.configuration.findUnique({
        where : {id:configId},
    })

    if(!configuration){
        throw new Error("No such data found")
    }
    // finding the logged in user
    const {getUser} = getKindeServerSession()
    const user = await getUser()

    if(!user){
        throw new Error('Need to be logged in')
    }

    const {finish, material} = configuration

    // for the amount to be paid
    let price = BASE_PRICE
    if(material === 'polycarbonate'){
        price += PRODUCT_PRICES.material.polycarbonate
    }
    if(finish === 'textured'){
        price += PRODUCT_PRICES.finish.textured
    }

    // if same order already exits
    let order: Order | undefined = undefined

    const existingOrder = await db.order.findFirst({
        where:{
            userId: user.id,
            configurationId:configuration.id
        }
    })

       console.log("user id: ", user.id, "config id:", configuration.id)
    // if order exists the place same order
    if(existingOrder){
        order = existingOrder
    }
    else{
        // if not then create new order for the user id
        order = await db.order.create({
            data: {
              amount: price / 100,
              userId: user.id,
              configurationId: configuration.id,
            }
        })
    }

    //creation of stripe payment for product
    const product = await stripe.products.create({
        name:"Custome iphone Case",
        images: [configuration.imageUrl],
        default_price_data: {
            currency: "USD",
            unit_amount:price,
        },
    })

    // stripe session for payment
    const stripeSession = await stripe.checkout.sessions.create({
        success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
        cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/configure/preview?id=${configuration.id}`,
        payment_method_types: ['card'],
        mode: "payment",
        shipping_address_collection: { allowed_countries: ['IN','US','BL'] },
        metadata:{
            userId: user.id,
            orderId: order.id
        },
        line_items: [{
            price:product.default_price as string,quantity: 1
        }]
    })
    return {url:stripeSession.url}
}



