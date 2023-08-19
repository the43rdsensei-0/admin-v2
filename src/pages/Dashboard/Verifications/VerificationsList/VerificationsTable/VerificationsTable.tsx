import { useEffect, useState } from "react";
import Capsule from "src/components/Capsule";
import ComponentLoader from "src/components/Loaders/ComponentLoader";
import Table from "src/components/Table/table";
import UserProfileImage from "src/components/User/UserProfileImage";
import { verificationListItemType } from "src/features/identity/utils/formatVerifications";
import TransactionAction from "src/pages/Dashboard/Transactions/components/TransactionAction";
import timePassed from "src/utils/timePassed";
import styles from "./verificationstable.module.css";

export default function VerificationsTable({
    verifications,
    currentPage,
    totalPages,
    goToPage,
}:{
    verifications:verificationListItemType[],
    currentPage:number,
    totalPages:number,
    goToPage:Function
}) {
    
    const [isLoading, setIsLoading] = useState(true);
    const [tableBody, setTableBody] = useState<any[]>([]);
    const tableHead = [
        'User name',
        'User name',
        'Time lapsed',
        'Status',
        '',
    ]

    const formatVerificationTable = (verifications:any[])=> {
        return verifications.map((verification:any)=> {
            return  [
                {
                    rowKey: verification.id,
                    actionEvent: 'action_button_click',
                    actionButtonPosition: 6
                },
                UserProfileImage(verification.user.profileImageURL, verification.user.name, 50),
                <div className={styles.user_name}>{verification.user.name}</div>,
                <div className={styles.time_lapsed}>{timePassed(verification.date)}</div>,
                Capsule(verification.status),
                <TransactionAction 
                    id={verification.id}
                    reviewed={false} 
                    paid={true} 
                />
            ]
        });
    }

    useEffect(()=> {
        setIsLoading(true)
        const newVerifications = formatVerificationTable([...verifications]);
        setTableBody(newVerifications)
        setIsLoading(false)

    }, [verifications])

    const paginateAction = (pageNumber:number)=> {
        setIsLoading(true);
        goToPage(pageNumber)
    }
    
    return (
        <div className={styles.verification_table}>
            {
                isLoading
                ?   <ComponentLoader />
                :   <Table 
                        head={tableHead}
                        body={tableBody}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        goToPage={(pageNumber:number)=> paginateAction(pageNumber)}
                        extraStyle={styles}
                        emptyListMessage={"Verifications submitted by customers will show here"}
                    />
            }
        </div>
    )
}