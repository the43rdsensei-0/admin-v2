import Table from "src/components/Table/table";
import UserProfileImage from "src/components/User/UserProfileImage";
import { useUserStateValue } from "src/features/user/atom";
import Capitalize from "src/utils/capitalize";
import timePassed from "src/utils/timePassed";
import UserRole from "./components/UserRole";
import styles from "./userstable.module.css";

export default function UsersTable({ users, currentPage, totalPages, goToPage }:{ users:any[], currentPage:number, totalPages:number, goToPage:Function }) {
    
    const userStateValue = useUserStateValue();

    const formatUserTable = (users:any[])=> {
        return users.map(user => {
            return [
                {
                    rowKey: `user/${user._id}`,
                    actionEvent: 'row_click',
                    target: 'new_page',
                },
                UserProfileImage(user.profileImage, user.fullname, 35, 20),
                <div className={styles.fullname}>{ Capitalize(user.fullname) }{ userStateValue.userData.fullname === user.fullname ?"(Me)" :"" }</div>,
                <div className={styles.email}>{ user.email }</div>,
                <UserRole role={user.role} />,
                timePassed(user.lastSeen)

            ]
        })
    }
    
    const tableBody = formatUserTable(users);
    const tableHead = [
        'Account',
        'Account',
        'Email',
        'Role',
        'Last seen'
    ];
    

    return (
        <div className={styles.users_table_container}>
            <Table 
                head={tableHead}
                body={tableBody}
                currentPage={currentPage}
                totalPages={totalPages}
                goToPage={(pageNumber:number)=> goToPage(pageNumber)}
                emptyListMessage={"Users created by admin will be will be shown here"}
            />
        </div>
    );
}