import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCustomerTransactionsValue } from "../../../../../features/customers/selectors";
import styles from "./customertransactionslist.module.css";
import DataLoadingError from "src/components/DataLoadingError";
import CustomerTransactionsTable from "./CustomerTransactionsTable";

export default function CustomerTransactionsList() {

    const { customerId } = useParams();
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1); 
    const customerTransactionsResponse = useCustomerTransactionsValue({ customerId: customerId!, pageNumber: pageNumber });

    const [loadingError, setLoadingError] = useState({
        status: false,
        message: ""
    })

    useEffect(()=> {
        if(customerTransactionsResponse.code === 200) {
            setCustomerTransactions(customerTransactionsResponse?.transactions);
            setTotalPages(customerTransactionsResponse?.totalPages)
            setLoadingError({
                status: false,
                message:""
            })

        } else {
            setLoadingError({
                status: true,
                message:"Error loading customer transactions, contact support"
            })
        }

    }, [customerTransactionsResponse])

    const [customerTransactions, setCustomerTransactions] = useState([])

    const paginate = (newPageNumber:number)=> {
        setPageNumber(newPageNumber)
    }

    return(
        <div className={styles.customer_transactions_list}>

            {
                loadingError.status
                ?   <DataLoadingError message={loadingError.message} />
                :   <CustomerTransactionsTable 
                        customerTransactions={customerTransactions} 
                        currentPageNumber={pageNumber} 
                        totalPagesNumber={totalPages} 
                        paginate={paginate}
                    />
            }
        </div>
    );
}