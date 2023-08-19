import { useEffect, useState } from "react";
import DataLoadingError from "src/components/DataLoadingError";
import SizedBox from "src/components/SizedBox";
import UserProfileImage from "src/components/User/UserProfileImage";
import { fetchTransactionAttendants } from "src/features/transactions/actions";
import { useTransactionState } from "src/features/transactions/atom";
import { useUserStateValue } from "src/features/user/atom";
import Capitalize from "src/utils/capitalize";
import formatTime from "src/utils/formatTime";
import TransactionDeferButton from "../TransactionAttendantInfo/TransactionDeferButton";
import styles from "./transactionattendantlist.module.css";

export default function TransactionAttendantList({transactionId}:{transactionId:string}) {
    const userState = useUserStateValue();
    const [transactionState] = useTransactionState()

    const [attendantsList, setAttendantsList] = useState<{
        id:string,
        profileImageURL:string,
        position:number,
        email:string,
        phoneNumber:string
    }[]>([])

    const [loadingError, setLoadingError] = useState({
        status: false,
        message: ''
    })

    useEffect(()=> {
        fetchTransactionAttendants(transactionId)
        .then((data:any)=> {
            setAttendantsList(data.attendants)
        })
        .catch((error)=> {
            setLoadingError({
                status: true,
                message: error.message
            })
        })
        
    }, [transactionId, transactionState.details.reassigned])

    if(loadingError.status) return <DataLoadingError message={loadingError.message} />
    return(
        <div className={styles.attendants_list_container}>
            <div className={styles.heading}>   
                <div className={styles.label}>Attendant</div>
            </div>
            <SizedBox height={20} />
            <div className={styles.attendants_list}>
                {
                    attendantsList.map((attendantInfo:any, index:number) => {
                        return  <div
                                    key={attendantInfo?.id + index}
                                    className={styles.attendant_details}
                                >
                                    { UserProfileImage(attendantInfo.profileImageURL, attendantInfo.fullname, 40, 20) }
        
                                    <div className={styles.personal_details}>
                                        <div className={styles.fullname}>{ Capitalize(attendantInfo?.fullname) }</div>
                                        <div className={styles.detail}>{ attendantInfo?.email }</div>
                                        <div className={styles.detail}>{ attendantInfo?.phoneNumber }</div>
                                    </div>

                                    {
                                        index === 0
                                        ?   !transactionState.details.deferred.status
                                            ?   attendantsList[0]?.id === userState.userData.id && !transactionState.details.reassigned
                                                ?   <TransactionDeferButton transactionId={transactionId} />
                                                :   <div className={styles.deffered_frame}>
                                                        <div className={styles.deffered}>Deferred</div>
                                                        <div className={styles.deffered_time}>{ formatTime(transactionState.details.deferred?.date_deferred) }</div>
                                                    </div>
                                            :   <div className={styles.deffered_frame}>
                                                    <div className={styles.deffered}>Deferred</div>
                                                    <div className={styles.deffered_time}>{ formatTime(transactionState.details.deferred?.date_deferred) }</div>
                                                </div>
                                        : null
                                    }
                                </div>
                    })
                }
            </div>
        </div>
    )
}