import styles from "./dashboardheader.module.css";
import {ReactComponent as IconNotifications } from "../../../assets/icons/icon-notifications.svg";
import {ReactComponent as IconArrowLeftCircle } from "../../../assets/icons/icon-arrow-left-circle.svg";
import IconButton from "../../Buttons/IconButton/iconbutton";
import { useLocation, useNavigate } from "react-router-dom";
import UserCapsule from "../../Capsules/UserCapsule";

export default function DashboardHeader (props:{
    pageTitle?:string,
    pageSubtitle?:string,
    pageTitlePrefixIcon?:any
    pageTitleSuffixIcon?:any,
    goBackPath?:string,
    backIsHere?:Function
}) {

    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className={styles.heading}>

            {
                props.goBackPath
                ?   <div className={styles.back_btn_wrapper}>
                        <IconButton     
                            label="Go back" 
                            prefixIcon={<IconArrowLeftCircle stroke={"var(--teal-accent-300)"} />}
                            isLoading={false}  
                            disabled={false}
                            onClick={()=> {
                                if(location.pathname !== props.goBackPath) navigate(props.goBackPath!)
                                else {
                                    props.backIsHere?.();
                                }
                            }}
                        />
                    </div>

                :   <div className={styles.section_title}>
                        <div className={styles.title}>
                            {props.pageTitlePrefixIcon} 
                            {props.pageTitle} 
                            {props.pageTitleSuffixIcon}
                        </div>
                        <div className={styles.subtitle}>{props.pageSubtitle}</div>
                    </div>

            }

            <div className={styles.nav_extra}>
                <div className={styles.notif_icon_wrapper}>
                    <IconNotifications className={styles.notif_icon} />
                </div>
                
                <UserCapsule />
            </div>
        </div>
    );
}