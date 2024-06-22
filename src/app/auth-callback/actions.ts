'use server'

import { db } from "@/db"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"

export const getAuthStatus= async ()=>{
    const {getUser} = getKindeServerSession()
    const user = await getUser()

    //if no data present on Kinde Auth db
    if(!user?.id || !user.email){
        throw new Error("Invalid user data")
    }

    // if user present then show user.id
    const existingUser = await db.user.findFirst({
        where:{id: user.id},
    })

    // if no tpresent then create user
    if(!existingUser){
        await db.user.create({
            data:{
                id: user.id,
                email:user.email
            }
        })
    }
    return {success: true}
}
