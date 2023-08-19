import { useEffect, useState } from "react";
import AssetImage from "src/components/AssetImage";
import Capsule from "src/components/Capsule";
import { SearchBarField } from "src/components/Form/SearchBarField";
import Table from "src/components/Table/table";
import convertCurrency from "src/utils/currencyConverter";
import formatDate from "src/utils/formatDate";
import sortByDate from "src/utils/sortByDate";
import styles from "./customertransactionstable.module.css";

export default function CustomerTransactionsTable({
    customerTransactions,
    currentPageNumber,
    totalPagesNumber,
    paginate

}:{customerTransactions:any[], currentPageNumber:number, totalPagesNumber:number, paginate:Function}) {

    const tableHead = ['Token name', 'Token name', 'Date', 'Value', 'Status'];
    const [tableBody, setTableBody] = useState<any[][]>([])

    useEffect(()=> {
        setTableBody(formatCustomerTranscationsTableBody(sortByDate(customerTransactions)!));
    }, [customerTransactions])

    const formatCustomerTranscationsTableBody = (newList:any[])=> {
        return newList.map((transaction:any)=> {
            return [
                {
                    rowKey: `/dashboard/transactions/${transaction.id}`,
                    actionEvent: 'row_click',
                    target: "new_page"
                },
                AssetImage(transaction.imageURL, 30),
                transaction.name,
                formatDate(transaction.date),
                convertCurrency(transaction.amountSentInNaira||0, '₦', 2),
                Capsule(transaction.status),
            ]
        })
    }

    return(
        <div className={styles.customer_transactions_table_container}>
            <SearchBarField
                extraStyle={styles.search_bar}
                listToSearch={customerTransactions}
                onSearch={(newList:any)=> setTableBody(formatCustomerTranscationsTableBody(sortByDate(newList)!))}
            />
            
            <Table
                extraStyle={styles} 
                head={tableHead}
                body={tableBody}
                currentPage={currentPageNumber}
                totalPages={totalPagesNumber}
                goToPage={(newPageNumber:number)=> paginate(newPageNumber) }
                emptyListMessage={"Customers transactions will appear here when they register"}
            />
        </div>
    )
}