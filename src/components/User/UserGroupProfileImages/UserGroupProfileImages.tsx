import UserProfileImage from "../UserProfileImage";
import styles from "./usergroupprofileimages.module.css";

export default function UserGroupProfileImages({ users, max }:{users:{fullname:string, profileImageURL:string}[], max:number}) {
    return (
        <div className={styles.user_group_profile_images_container}>
            {
                users.map((user, index)=> {
                    return  index <= max-1 
                            ?   <div 
                                    key={user.profileImageURL||user.fullname} 
                                    className={styles.circle_wrapper}
                                >
                                    { UserProfileImage(user.profileImageURL, user.fullname) }
                                </div>
                            :   null
                })
            }
        </div>
    );
}