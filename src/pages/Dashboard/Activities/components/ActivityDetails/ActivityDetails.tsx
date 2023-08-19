import { FaExternalLinkAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import ModalContainer from "src/components/Modal/ModalContainer";
import Capitalize from "src/utils/capitalize";
import formatDate from "src/utils/formatDate";
import formatTime from "src/utils/formatTime";
import styles from "./activitydetails.module.css";

export default function ActivityDetails({ activity, closeDetails }:{
    activity:{
        id:string,
        adminUser: {
            fullname:string,
            email:string,
            imageURL:string,
            phoneNumber:string
        },
        category:string,
        title:string,
        description:string,
        link:string,
        date: string
    }, 
    closeDetails:Function
}) {

    return (
        <ModalContainer close={closeDetails}>
            <div className={styles.activity_details}>
                <div className={styles.modal_title}>Activity Details</div>

                <div className={styles.top_section}>
                    <div className={styles.category_section}>
                        <div className={styles.label}>Category</div>
                        <div className={styles.content}>{ activity.category }</div>
                        <div className={styles.title}>{ Capitalize(activity.title) }</div>
                    </div>
                    <div className={styles.date_section}>
                        <div className={styles.label}>Date</div>
                        <div className={styles.date_time}>
                            <div className={styles.date}>{ formatDate(activity.date) }</div>
                            <div className={styles.time}>{ formatTime(activity.date) }</div>
                        </div>
                    </div>
                </div>

                <div className={styles.description}>
                    <div className={styles.label}>Description</div>
                    <div className={styles.content}> { activity.description } </div>
                    {
                        activity.link
                        ?   <Link to={activity.link} className={styles.link}> Open <FaExternalLinkAlt /> </Link>
                        :   null
                    }
                </div>

                <div className={styles.assignee}>
                    <div className={styles.label}>Carried out by</div>

                    <div className={styles.assignee_card}>
                        <div className={styles.user_image}>
                            <img src={activity.adminUser.imageURL} alt="" />
                        </div>
                        <div className={styles.user_details}>
                            <div className={`${styles.content} ${styles.fullname}`}>{ activity.adminUser.fullname }</div>
                            <div className={styles.content}>{ activity.adminUser.email }</div>
                            <div className={styles.content}>{ activity.adminUser.phoneNumber }</div>
                        </div>
                    </div>
                </div>
            </div>
        </ModalContainer>
    );
}