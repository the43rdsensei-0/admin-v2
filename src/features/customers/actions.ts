import { getFetch, patchFetch } from "../../lib/fetch";

export function fetchCustomersAction(pageNumber:number) {
    return new Promise((resolve, reject)=> {
        return getFetch(`/admin/customers/${pageNumber}`)
        .then((responseData:any)=> resolve(responseData.data))
        .catch((error)=> reject(error))
    });
}

export function fetchCustomerAction(customerId:string) {
    return new Promise((resolve, reject)=> {
        return getFetch(`/admin/customers/profile/${customerId}`)
        .then((responseData:any)=> resolve(responseData.data))
        .catch((error)=> reject(error))
    });
}

export function fetchCustomerTransactionsAction(customerId:string, pageNumber:number) {
    return new Promise((resolve, reject)=> {
        return getFetch(`/admin/customers/transactions/${customerId}/${pageNumber}`)
        .then((responseData:any)=> resolve(responseData.data))
        .catch((error)=> reject(error))
    });
}

export function toggleAccountActivationAction(customerId:string, payload:{active:boolean}) {
    return new Promise((resolve, reject)=> {
        return patchFetch(`/admin/customers/profile/${customerId}`, payload)
        .then((responseData:any)=> resolve(responseData.data))
        .catch((error)=> reject(error))
    })
}

export function searchCustomerAction(keyword:string, pageNumber:number) {
    return new Promise((resolve, reject)=> {
        return getFetch(`/admin/customers/search/${keyword}/${pageNumber}`)
        .then((responseData:any)=> resolve(responseData.data))
        .catch((error)=> reject(error))
    })
}

export function sortCustomerByTotalAmountAction(pageNumber:number) {
    return new Promise((resolve, reject)=> {
        return getFetch(`/admin/customers/sort/total-amount/${pageNumber}`)
        .then((responseData:any)=> resolve(responseData.data))
        .catch((error)=> reject(error))
    })
}

export function fetchAllCustomersAction() {
    return new Promise((resolve, reject)=> {
        return getFetch(`/admin/customers/all`)
        .then((responseData:any)=> resolve(responseData.data))
        .catch((error)=> reject(error))
    })
}