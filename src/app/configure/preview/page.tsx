import { db } from "@/db"
import { notFound } from "next/navigation"
import DesignPreview from "./DesignPreview"

interface PageProps{
    // to get the id value for the preview of case
    searchParams:{
        [key: string]: string | string[] |undefined
    }
}
// server side
const Page = async ({searchParams}:PageProps)=>{
    const {id} = searchParams
    // check if no id found or type of id is not string
    if(!id || typeof id!=='string'){
        return notFound
    }
    // checking from the db
    const configuration = await db.configuration.findUnique({
        where: {id},
    })

    if(!configuration){
        return notFound()
    }
    return <DesignPreview configuration={configuration} />
}

export default Page