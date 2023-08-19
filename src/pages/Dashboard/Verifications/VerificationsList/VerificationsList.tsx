import styles from "./verificationslist.module.css";
import { useEffect, useState } from "react";
import socketConn from "src/lib/socketConn";
import { useUserStateValue } from "src/features/user/atom";
import DashboardHeader from "src/components/Headers/Dashboard/dashboardheader";
import { useIdentityState } from "src/features/identity/atom";
import formatVerifications, { verificationListItemType } from "src/features/identity/utils/formatVerifications";
import VerificationsTable from "./VerificationsTable";
import sortByDate from "src/utils/sortByDate";
import ComponentLoader from "src/components/Loaders/ComponentLoader";

export default function VerificationsList() {

    const userState = useUserStateValue();
    const [pageNumber, setPageNumber] = useState(1)

    const [isListLoading, setIsListLoading] = useState(true)

    const [identityState, setIdentityState] = useIdentityState()

    useEffect(()=> {
        socketConn.emit('fetch_verifications', { userId: userState.userData.id, pageNumber })
        .on('verifications', (response)=> {
            if(response.code === 200) {
                formatVerifications(response.data?.verifications)
                .then((formattedVerificationList:verificationListItemType[])=> {
                    setIdentityState(state => {
                        return {
                            ...state,
                            verificationList: sortByDate(formattedVerificationList)!,
                            totalPages: response.data.totalVerificationPages,
                            currentPage: response.data.currentVerificationPage
                        }
                    })
                })
                .catch(()=> {
                    setIdentityState(state => {
                        return {
                            ...state,
                            error: true,
                            message:'There was an error formatting verifications, please contact support'
                        }
                    })
                })
                .finally(()=> {
                    setIsListLoading(false)
                })
            }
        })

    }, [pageNumber, setIdentityState, userState.userData.id])

    const paginate = (pageNumber:number)=> {
        setIsListLoading(true)
        setPageNumber(pageNumber)
    }

    return (
        <div className={styles.verifications_list_container}>
            <DashboardHeader 
                pageTitle="Identity verification"
            />

            {
                isListLoading
                ?   <ComponentLoader />
                :   <VerificationsTable
                        verifications={identityState.verificationList}
                        currentPage={identityState.currentPage} 
                        totalPages={identityState.totalPages}
                        goToPage={(pageNumber:number)=> paginate(pageNumber)}  
                    />
            }
        </div>
    )
}