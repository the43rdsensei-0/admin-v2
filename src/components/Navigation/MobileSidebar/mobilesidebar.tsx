import styles from "./mobilesidebar.module.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import mobileLogo from "src/assets/images/tse-logo-1.png"
import { ReactComponent as IconMenu } from "src/assets/icons/icon-menu.svg";
import { ReactComponent as IconClose } from "src/assets/icons/icon-times.svg";
import LogoutButton from "src/components/Buttons/LogoutButton";

export default function MobileSidebar(props:{
    extraStyle?:string,
    navOptions:{
        label:string,
        path:string,
        icon?:any,
        activeIcon?:any,
        active:boolean|undefined
    }[],    
    isHashLink?:boolean,
    navigateTo?:Function
}) {

    const [IsDrawerOpen, setIsDrawerOpen] = useState(false);

    const initNav = (navOptionPos:any)=> {
        setIsDrawerOpen(false)
        props.navigateTo!(navOptionPos);
    }


    return (
        <div className={styles.container}>
            <div className={`${props.extraStyle!} ${styles.header}`}>
                <Link to={"/"}>
                    <div className={styles.mobile_logo_img_wrapper}>
                        <img src={mobileLogo} alt="" />
                    </div>
                </Link>

                {
                    IsDrawerOpen
                    ? <IconClose className={styles.fn_icon} onClick={()=> setIsDrawerOpen(false)} />
                    : <IconMenu className={styles.fn_icon} onClick={()=> setIsDrawerOpen(true)} />
                }
            </div>

            <div className={`
                ${styles.navigation_section}
                ${  
                    IsDrawerOpen
                    ? styles.drawer_open
                    : styles.drawer_close
                }
            `}>
                <div className={styles.navigation_bar}>
                    {
                        props.navOptions.map((navOption, index)=> {
                            return  <Link 
                                        key={index}
                                        to={navOption.path}
                                        className={`${styles.navigation_item} ${(navOption.active) ?styles.active :null}`}
                                        onClick={()=> initNav(index)}
                                    >  
                                        {
                                            (navOption?.icon) 
                                            ?   (navOption.active) ? <navOption.icon className={styles.nav_icon} /> :<navOption.activeIcon className={styles.nav_icon} />
                                            :   null
                                        }
                                        <div className={styles.nav_label}> { navOption.label } </div>
                                    </Link>
                        })
                    }

                    <LogoutButton 
                        extraStyle={styles.logout_btn}
                    />
                </div> 
            </div>
        </div>
    );
}