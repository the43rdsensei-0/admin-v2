import { selectorFamily, useRecoilValue } from "recoil";
import formatTransactions from "../transactions/utils/formatTransactions";
import { fetchCustomerAction, fetchCustomersAction, fetchCustomerTransactionsAction } from "./actions";
import formatCustomersList from "./utils/formatCustomersList";

const fetchCustomersSelector = selectorFamily({
    key: 'fetchcustomers',
    get: (pageNumber:number)=> async ()=> {
        return await fetchCustomersAction(pageNumber)
        .then((data:any)=> {
            return {
                code: 200,
                customers: formatCustomersList(data.customers),
                totalPages: data.totalCustomersPages
            };
        })  
        .catch((error)=> {
            return {
                ...error,
                code: 500
            }
        })      
    }
});

export const useCustomersListValue = (pageNumber:number)=> useRecoilValue(fetchCustomersSelector(pageNumber));

const fetchCustomer = selectorFamily({
    key: 'fetchcustomer',
    get: (customerId:string)=> async ()=> {
        if(!customerId) return null;
        
        return await fetchCustomerAction(customerId)
        .then((data:any)=> {
            return {
                code: 200,
                customer: data.customer
            };
        })  
        .catch((error)=> {
            return error
        })  
    }
})

export const useCustomerDetailsValue = (customerId:string)=> useRecoilValue(fetchCustomer(customerId));

const fetchCustomerTransactions = selectorFamily({
    key: 'fetchcustomertransactions',
    get: (payload: {customerId:string, pageNumber:number})=> async ()=> {
        return await fetchCustomerTransactionsAction(payload.customerId, payload.pageNumber)
        .then(async (data:any)=> {
            return await formatTransactions(data.transactions)
            .then((formattedTransactions:any)=> {
                return { 
                    code: 200,
                    transactions: formattedTransactions, 
                    totalPages: data.totalTransactionsPages,
                }
            })
            .catch(()=> {
                return {
                    code: 500,
                    transactions: [], 
                    totalPages: 0,
                }
            })
        })  
        .catch(()=> {
            return {
                code: 500,
                transactions: [], 
                totalPages: 0,
            }
        })  
    }
})

export const useCustomerTransactionsValue = (payload: {customerId:string, pageNumber:number})=> useRecoilValue(fetchCustomerTransactions(payload));

