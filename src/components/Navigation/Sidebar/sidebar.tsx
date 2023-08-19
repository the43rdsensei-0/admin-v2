import logo from "../../../assets/images/tse-logo-3-with-name-no-bg.png";
import { Link } from "react-router-dom";
import styles from "./sidebar.module.css";
import {sideBarNavOptionsType} from "../types";
import { useUserStateValue } from "src/features/user/atom";

export default function Sidebar({ navOptions, navigateTo }: sideBarNavOptionsType) {

    const userState = useUserStateValue();

    return (
        <div className={styles.container}>
            <div className={styles.logo_wrapper}>
                <img src={ logo } alt="" />
            </div>

            <div className={styles.navigation_section}>
                <div className={styles.navigation_bar}>
                    {
                        navOptions.map((navOption, index)=> 
                            (navOption.roles.includes(userState.userData.role))
                            ?   <Link 
                                    key={index}
                                    to={navOption.path!}
                                    className={`${styles.navigation_item} ${(navOption.active) ?styles.active :null}`}
                                    onClick={()=> navigateTo(index)}
                                >
                                    {
                                        (navOption.active) 
                                        ?   <navOption.icon className={styles.nav_icon} /> 
                                        :   <navOption.activeIcon className={styles.nav_icon} />
                                    }
                                    
                                    <div className={styles.nav_label}> <span>{ navOption.label }</span> </div>
                                </Link>
                            :   null
                        )
                    }
                </div> 
            </div>
        </div>
    );
}