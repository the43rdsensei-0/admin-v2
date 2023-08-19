import Card from "src/components/Cards/card";
import styles from "./usersmetriccard.module.css";
import UserGroupProfileImages from "src/components/User/UserGroupProfileImages";
import SizedBox from "src/components/SizedBox";

export default function UsersMetricCard({ 
    users, 
    usersCount,
    label 
}:{ 
    users:{
        fullname:string, 
        profileImageURL:string
    }[],
    usersCount:number,
    label:string 
}) {

    return (
        <Card extraStyle={styles.users_metric_card_container}>
            <div className={styles.top}>
                <div className={styles.digit}> {` ${usersCount} Account${users.length>1 ?'s':''} `} </div>
                <UserGroupProfileImages users={users} max={3} />
            </div>
            
            <SizedBox height={10} />

            <div className={styles.label}>
                { label }
            </div>
        </Card>
    );
}