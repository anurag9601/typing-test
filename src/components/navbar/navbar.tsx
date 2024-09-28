"use client";
import style from "./navbar.module.css";
import Image from "next/image";
import logo from "../../assets/images/keyboard.png";
import friends from "../../assets/images/laugh.png";
import notification from "../../assets/images/notification.png";
import userImage from "../../assets/images/user.png";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

export default function Navbar() {
  const router = useRouter();

  const dispatch = useDispatch();
  const user: null | object = useSelector((state: any) => state.userInfo.user);

  return (
    <div className={style.navbarContainer}>
      <div className={style.logoContainer} onClick={() => router.push("/")}>
        <Image src={logo} alt="" className={style.logo} />
        <h1>Typist</h1>
      </div>
      <div className={style.moreOptions}>
        <div className={style.navOption}>
          <Image
            src={friends}
            alt=""
            className={style.option}
            onClick={() => router.push("/friends")}
          />
        </div>
        <div className={style.navOption}>
          <Image src={notification} alt="" className={style.option} />
        </div>
        {user ? (
          <div className={style.navOption}>
            <Image src={userImage} alt="" className={style.option} />
          </div>
        ) : (
          <div className={style.signin} onClick={() => router.push("/login")}>
            <button>Sign in</button>
          </div>
        )}
      </div>
    </div>
  );
}
