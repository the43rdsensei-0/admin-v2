import { getFetch, postFetch } from "src/lib/fetch";

export function fetchBankAccountsAction() {
    return new Promise((resolve, reject)=> {
        getFetch('/assets/bank/accounts')
        .then((response:any)=> resolve(response.data))
        .catch((error)=> reject(error))
    })
}

export function createBankAccountAction(payload:any) {
    return new Promise((resolve, reject)=> {
        postFetch('/admin/assets/bank/accounts', payload)
        .then((response:any)=> resolve(response.data))
        .catch((error:any)=> reject(error))
    })
}