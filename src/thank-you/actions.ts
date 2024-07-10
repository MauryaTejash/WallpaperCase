// // 'use server'

// // import { db } from "@/db"
// // import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"

// // export const getPaymentStatus= async({orderId}:{orderId: string})=>{
// //     //to know the user is log in or not
// //     const {getUser} = getKindeServerSession()
// //     const user = await getUser()

// //     if(!user?.id || !user.email){
// //         throw new Error("Please login to view this page")
// //     }

// //     // if login then getting the order id from db
// //     const order = await db.order.findFirst({
// //         where: {
// //             id: orderId, userId: user.id
// //         },
// //         include: {
// //             billingAddress: true,
// //             configuration: true, 
// //             shippingAddress: true,
// //             user: true
// //         },
// //     })
// //     if(!order){
// //         throw new Error('This order does not exist.')
// //     }
// //     if(order.isPaid){
// //         return order
// //     }else{
// //         return false
// //     }
// // }

// 'use server'

// import { db } from '@/db'
// import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'

// export const getPaymentStatus = async ({ orderId }: { orderId: string }) => {
//   const { getUser } = getKindeServerSession()
//   const user = await getUser()

//   if (!user?.id || !user.email) {
//     throw new Error('You need to be logged in to view this page.')
//   }

//   const order = await db.order.findFirst({
//     where: { id: orderId, userId: user.id },
//     include: {
//       billingAddress: true,
//       configuration: true,
//       shippingAddress: true,
//       user: true,
//     },
//   })

//   if (!order) throw new Error('This order does not exist.')

//   if (order.isPaid) {
//     return order
//   } else {
//     return false
//   }
// }


'use server'

import { db } from '@/db'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'

export const getPaymentStatus = async ({ orderId }: { orderId: string }) => {
  const { getUser } = getKindeServerSession()
  const user = await getUser()

  if (!user?.id || !user.email) {
    throw new Error('You need to be logged in to view this page.')
  }

  const order = await db.order.findFirst({
    where: { id: orderId, userId: user.id },
    include: {
      billingAddress: true,
      configuration: true,
      shippingAddress: true,
      user: true,
    },
  })

  if (!order) throw new Error('This order does not exist.')

  if (order.isPaid) {
    return order
  } else {
    return false
  }
}