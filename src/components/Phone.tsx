import { cn } from "@/lib/utils"
import { HTMLAttributes } from "react"
interface PhoneProps extends HTMLAttributes<HTMLDivElement>{
    imgSrc: string
    dark?: boolean
}

// this is custom components class which is used multiples times
const Phone =({imgSrc,className,dark= false, ...props}:PhoneProps)=>{
    return(
        <div className={cn('relative pointer-events-none z-50 overflow-hidden',className)}{...props}>
            <img src={
                dark ? '/phone-dark-edge.png' : '/phone-white-edge.png'
            } 
            className="pointer-event-none z-50 select-none" alt="Phone Image"/>

            <div className="absolute -z-10 inset-0">
                <img src={imgSrc} alt="Phone Cover" className="object-cover min-w-full min-h-full" />
            </div>
        </div>
    )
}

export default Phone