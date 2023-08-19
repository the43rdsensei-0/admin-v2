import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { transactionStateType } from "./types";

export const transactionInitState:transactionStateType = {
    details: {
        id: '',
        customerAttendant: '',
        attendants:[],
        reassigned: false,
        deferred: {
            status: false,
            date_deferred: ''
        },
        reviewed: false,
        paidout: false,
        rejected: false,
        note: {
            message: '',
            images:[]
        },
        txnName: '',
        assetImageURL: '',
        assetCategory: '',
        assetSubcategory: '',
        amountSent: {
            inDollar: 0,
            inNaira: 0,
        },
        amountReceived: 0,
        amountToPay: 0,
        rate: {
            sent: 0,
            confirmed: 0
        },
        status: '',
        images: [],
        user: '',
        date: '',
    },
    list: [],
    activeCategory: '',
    activeCSACryptoCategory: 'sell',
    history: [],
    totalHistoryPages: 0,
    currentPageNumber: 1,
    totalPages: 0,
    metrics: {
        total: 0, 
        success: 0,
        failed: 0,
        pending: 0
    },
    searchKeyword: '',
    status: 'idle',
    error: false,
    message: ''
}

const transactionState = atom({
    key:'transactionstate',
    default: transactionInitState
});

export const useTransactionState = ()=> useRecoilState(transactionState);
export const useTransactionSetState = ()=> useSetRecoilState(transactionState)
export const useTransactionStateValue = ()=> useRecoilValue(transactionState)
