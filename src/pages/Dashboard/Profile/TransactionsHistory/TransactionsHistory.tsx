import { useEffect, useState } from "react";
import DashboardHeader from "src/components/Headers/Dashboard/dashboardheader";
import PageComponentLoader from "src/components/Loaders/PageComponentLoader";
import { useTransactionState } from "src/features/transactions/atom";
import TransactionsTable from "../../Transactions/components/TransactionsTable";
import styles from "./transactionshistory.module.css";
import socketConnection from "src/lib/socketConn"
import formatTransactions, { TransactionTableItem } from "src/features/transactions/utils/formatTransactions";
import sortByDate from "src/utils/sortByDate";
import { useUserStateValue } from "src/features/user/atom";

export default function TransactionsHistory() {

    const userState = useUserStateValue();

    const [transactionState, setTransactionState] = useTransactionState()

    const [pageNumber, setPageNumber] = useState<number>(1);

    const [isPageLoading, setIsPageLoading] = useState(false);

    useEffect(()=> {
        if(!transactionState.searchKeyword) {
            socketConnection.emit(`fetch_transactions_history`, { pageNumber: pageNumber, userId: userState.userData.id })
        }
        
        socketConnection.on('transactions_history', (response)=> {
            if(response.data?.currentTransactionPage === pageNumber) {
                formatTransactions(response.data?.transactions)
                .then((formattedResponse:TransactionTableItem[])=> {
                    setTransactionState(state => {
                        return {
                            ...state,
                            history: sortByDate([...formattedResponse])!,
                            totalHistoryPages: response.data?.totalTransactionPages
                        }
                    })
                    setIsPageLoading(false)
                })
                .catch((error)=> {
                    console.log('Error formatting transaction list')
                    console.log(error)
                })
            }
        })
    }, [pageNumber, setTransactionState, transactionState.searchKeyword, userState.userData.id])

    const paginate = (pageNumber:number)=> {
        setPageNumber(pageNumber)
    }

    return (
        <div className={styles.container}>
            <DashboardHeader 
                pageTitle="Transactions History"
            />

            {
                isPageLoading
                ?   <PageComponentLoader />
                :   <div>
                        <TransactionsTable 
                            transactions={transactionState.history}
                            currentPage={pageNumber}
                            totalPages={transactionState.totalHistoryPages}
                            goToPage={(pageNumber: number) => paginate(pageNumber)}
                        />
                    </div>
                }
        </div>
    )
}