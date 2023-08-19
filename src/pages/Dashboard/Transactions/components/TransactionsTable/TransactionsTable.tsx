import { useEffect, useState } from "react";
import AssetImage from "src/components/AssetImage";
import FilterButton from "src/components/Buttons/FilterButton";
import Capsule from "src/components/Capsule";
import ExternalSearchBarField from "src/components/Form/SearchBarField/ExternalSearchBarField";
import ComponentLoader from "src/components/Loaders/ComponentLoader";
import FormStateModal from "src/components/Modal/FormStateModal";
import Table from "src/components/Table/table";
import { searchTransactionsAction } from "src/features/transactions/actions";
import { useTransactionState } from "src/features/transactions/atom";
import formatTransactions, { TransactionTableItem } from "src/features/transactions/utils/formatTransactions";
import { useUserStateValue } from "src/features/user/atom";
import convertCurrency from "src/utils/currencyConverter";
import formatDate from "src/utils/formatDate";
import formatTime from "src/utils/formatTime";
import sortByDate from "src/utils/sortByDate";
import CryptoTransactionsNav from "../CryptoTransactionsNav";
import TransactionAction from "../TransactionAction";
import TransactionsNav from "../TransactionsNav";
import styles from "./transactionstable.module.css";
import { FilterOptionsType } from "src/components/Buttons/FilterButton/FilterButton";

export default function TransactionsTable({
    transactions,
    currentPage,
    totalPages,
    goToPage,
    fetchCategorizedTransactions,
    updateFilter
}:{
    transactions:TransactionTableItem[],
    currentPage:number,
    totalPages:number,
    goToPage:Function,
    fetchCategorizedTransactions?:Function,
    updateFilter?:Function
}) {

    const userState = useUserStateValue()
    
    const [transactionState, setTransactionState] = useTransactionState();

    const [searchResult, setSearchResult] = useState<any[]>([]);
    
    const [isLoading, setIsLoading] = useState(true);
    const [tableBody, setTableBody] = useState<any[]>([]);
    const tableHead = [
        'Token name',
        'Token name',
        'Date & Time',
        'Value',
        'Status',
        '',
    ]

    // const [formattedTransactions, setFormattedTransactions] = useState<any[]>([]);

    const formatTransactionsTable = (transactions:any[])=> {
        return transactions.map((transaction:any)=> {
            return  [
                {
                    rowKey: transaction.id,
                    actionEvent: 'action_button_click',
                    actionButtonPosition: 6
                },
                AssetImage(transaction.imageURL, 30),
                <div className={styles.asset_name}>{transaction.name}</div>,
                <div>
                    <div>{formatDate(transaction.date)}</div>
                    <div>{formatTime(transaction.date)}</div>
                </div>,
                <div className={styles.currency}>{convertCurrency(transaction.amountSentInNaira||0, '₦', 2)}</div>,
                Capsule(transaction.status, {height: "40px"}),
                <TransactionAction 
                    id={transaction.id}
                    reviewed={transaction.reviewed} 
                    paid={transaction.paidout} 
                />
            ]
        });
    }

    useEffect(()=> {
        setIsLoading(true)
        const txn:any = (transactionState.searchKeyword ?[...searchResult] :transactions)
        const newTransactions = formatTransactionsTable(sortByDate([...txn])!);
        setTableBody(newTransactions)
        setIsLoading(false)
    }, [transactions, transactionState.searchKeyword, searchResult])

    const searchTransactions = (value:string)=> {

        const searchKeyword = value.trim();

        setIsLoading(true)

        searchTransactionsAction(searchKeyword)
        .then((response:any)=> { 
            formatTransactions(response.transactions)
            .then((formatted:any)=> {
                setTransactionState(state => {
                    return {
                        ...state,
                        list: sortByDate([...formatted])!,
                        searchKeyword: searchKeyword
                    }
                })

                setSearchResult([...formatted])
                setIsLoading(false)
            })
        })
        .catch(()=> {
            setTimeout(()=> {
                setTransactionState(state => {
                    return {
                        ...state,
                        error: true,
                        status: 'failed',
                        message: 'There was an error searching transactions'
                    }
                })
            }, 3000)
        })
        
    }

    const paginateAction = (pageNumber:number)=> {
        setIsLoading(true);
        goToPage(pageNumber)
    }

    const fetchCatTransaction = (category:string)=> {
        let eventName:string = "";
        if(category === 'cryptocurrency') {
            if(transactionState.activeCSACryptoCategory === 'sell') eventName = "fetch_sell_crypto_transactions";
            if(transactionState.activeCSACryptoCategory === 'buy') eventName = "fetch_buy_crypto_transactions";
        }
        if(category === 'giftcard') eventName = "fetch_card_transactions";
        if(category === '') eventName = "fetch_all_transactions";
        if(category === 'sell') eventName = "fetch_sell_crypto_transactions";
        if(category === 'buy') eventName = "fetch_buy_crypto_transactions";

        fetchCategorizedTransactions?.(eventName)
    }

    const triggerFilter =(filterOptions:FilterOptionsType)=> {
        setIsLoading(true)
        updateFilter?.(filterOptions)
    }

    return (
        <div className={styles.transaction_table}>
            
            <FormStateModal 
                state={transactionState}
                setState={setTransactionState}
            />

            {
                ['admin_org', 'admin_ops', 'admin_acct'].includes(userState.userData.role)
                ?   <TransactionsNav
                        navigateTo={(category:string)=> fetchCatTransaction(category)}
                    />
                :   null
            }

            {
                ['admin_csa_crypto'].includes(userState.userData.role)
                ?   <CryptoTransactionsNav
                        navigateTo={(category:string)=> fetchCatTransaction(category)}
                    />
                :   null
            }
            
            <div className={styles.filter}>
                <ExternalSearchBarField
                    action={(value:string)=> searchTransactions(value)}
                />

                <FilterButton 
                    onFilter={(filterOptions:FilterOptionsType)=> triggerFilter(filterOptions)}
                />
            </div>

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
                        emptyListMessage={"Transactions made by customers will show here"}
                    />
            }
        </div>
    )
}