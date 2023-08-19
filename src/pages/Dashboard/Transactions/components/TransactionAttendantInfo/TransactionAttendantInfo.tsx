import styles from "./transactionattendantinfo.module.css";
import { useEffect, useState } from "react";
import { useFetchAdminUser } from "src/features/admin-users/selectors";
import DataLoadingError from "../../../../../components/DataLoadingError";
import Capitalize from "../../../../../utils/capitalize";
import TransactionDeferButton from "./TransactionDeferButton";
import { useUserStateValue } from "src/features/user/atom";
import { useTransactionStateValue } from "src/features/transactions/atom";
import UserProfileImage from "src/components/User/UserProfileImage";
import formatTime from "src/utils/formatTime";

export default function TransactionAttendantInfo({ transactionId, attendantId, extraStyle }: { transactionId: string, attendantId: string, extraStyle?: string }) {

    const userState = useUserStateValue();
    const transactionState = useTransactionStateValue();

    const response = useFetchAdminUser(attendantId);    
    const [loadingError, setLoadingError] = useState({
        status: false,
        message: ''
    })
    const [attendantInfo, setAttendantInfo] = useState({
        _id: '',
        email: '',
        phoneNumber: '',
        fullname: '',
        profileImageURL: '',
    })

    useEffect(() => {
        if (response) {
            if (response.status === 500) setLoadingError({ status: true, message: 'Attendant not found' })
            else {
                setLoadingError({ status: false, message: '' })
                setAttendantInfo(response)
            }

        } else setLoadingError({ status: true, message: 'Attendant not found' })

    }, [response])
    

    if (loadingError.status) return <DataLoadingError message={loadingError.message} />
    return (
        <div className={styles.attendant_info_container}>
            <div className={styles.heading}>
                <div className={styles.label}>Attendant</div>
            </div>

            <div className={styles.body}>
                {
                    <div className={styles.attendant_details}>
                        { UserProfileImage(attendantInfo?.profileImageURL, attendantInfo?.fullname, 40, 20) }

                        <div className={styles.personal_details}>
                            <div className={styles.fullname}>{Capitalize(attendantInfo?.fullname)}</div>
                            <div className={styles.detail}>{attendantInfo?.email}</div>
                            <div className={styles.detail}>{attendantInfo?.phoneNumber}</div>
                        </div>

                        {
                            attendantInfo?._id === userState.userData.id
                            ?   transactionState.details.deferred.status
                                ?   <div className={styles.deffered_frame}>
                                        <div className={styles.deffered}>Deferred</div>
                                        <div className={styles.deffered_time}>{ formatTime(transactionState.details.deferred.date_deferred) }</div>
                                    </div>
                                :   <TransactionDeferButton transactionId={transactionId} />
                            :   null
                        }
                    </div>
                }
            </div>
        </div>
    );
}