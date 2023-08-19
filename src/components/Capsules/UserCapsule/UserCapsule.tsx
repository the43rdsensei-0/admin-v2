import styles from "./usercapsule.module.css";
import { useState } from "react";
import { FaAngleDown, FaClock } from "react-icons/fa";
import LogoutButton from "src/components/Buttons/LogoutButton";
import { useUserStateValue } from "src/features/user/atom";
import { Link } from "react-router-dom";

export default function UserCapsule() {

    const userState = useUserStateValue();
    const [toggleMenu, setToggleMenu] = useState(false);

    return(
        <div className={styles.container}>
            <div className={styles.profile_options} onClick={()=> setToggleMenu(!toggleMenu)}>
                <div className={styles.profile_name}> { userState.userData.fullname } </div>
                <FaAngleDown className={styles.fn_icon} />
            </div>

            {   
                toggleMenu
                ?   <div className={styles.options}>
                        <Link to={"/dashboard/profile/history"} className={styles.option}>
                            <FaClock height={30} width={30} color="black" />
                            <div className={styles.label}>History</div>
                        </Link>

                        <LogoutButton
                            extraStyle={`${styles.option} ${styles.logout}`}
                        />
                    </div>
                :   null
            }
        </div>
    );
}