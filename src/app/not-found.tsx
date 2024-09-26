import style from "./not-found.module.css"
import error from "../assets/images/error-404.png"
import Image from "next/image"
import Link from "next/link"

export default function NotFound(){
    return(
        <div className={style.notFoundContainer}>
            <div className={style.notFoundBody}>
                <Image src={error} alt="" className={style.errorImage}/>
                <h1>Page not found</h1>
            </div>
            <Link href="/" className={style.goBackLink}>Go back to home page</Link>
        </div>
    )
}