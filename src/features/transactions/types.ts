import { initStateType } from "../types";
import { transactionDetailsType } from "./utils/formatTransaction";
import { TransactionTableItem } from "./utils/formatTransactions";


export interface transactionStateType extends initStateType {
    details: transactionDetailsType,
    list: TransactionTableItem[],
    activeCategory?:''|'cryptocurrency'|'giftcard',
    activeCSACryptoCategory?:'buy'|'sell',
    history: TransactionTableItem[],
    totalHistoryPages: number,
    currentPageNumber: number,
    totalPages: number,
    metrics: {
        total: number,
        success: number,
        failed: number,
        pending: number
    },
    searchKeyword: string,
}

export interface transactionSearchStateType extends initStateType {
    searchKeyword: string,
}