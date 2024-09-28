import style from "./login.module.css"

export default function Login(){
    return(
        <div className={style.loginContainer}>
            <h1>Sign in</h1>
            <button></button>
            <button></button>
            <p>or</p>
            <form className={style.emailPasswordContainer}>
                <input type="email" />
                <input type="password" />
                <button type="submit">Log in</button>
            </form>
        </div>
    )
}