import Stripe from 'stripe'

// geeting value of api of stripe
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '',{
    apiVersion: "2024-04-10",
    typescript: true
})