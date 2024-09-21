import style from "./navbar.module.css";
import Image from "next/image";
import logo from "../../assets/images/keyboard.png";
import friends from "../../assets/images/laugh.png";
import notification from "../../assets/images/notification.png";
import user from "../../assets/images/notification.png";

export default function Navbar() {
  return (
    <div className={style.navbarContainer}>
      <div className={style.logo}>
        <Image src={logo} alt="" />
        <h1>Typist</h1>
      </div>
      <div className={style.moreOptions}>
        <div className={style.navOption}>
          <Image src={friends} alt="" />
        </div>
        <div className={style.navOption}>
          <Image src={notification} alt="" />
        </div>
        <div className={style.navOption}>
          <Image src={user} alt="" />
        </div>
      </div>
    </div>
  );
}
