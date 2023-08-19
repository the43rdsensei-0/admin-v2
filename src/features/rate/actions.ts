import { getFetch, postFetch } from "../../lib/fetch"

export function fetchCryptoAssetRateAction() {
    return new Promise((resolve, reject)=> {
        getFetch('/assets/cryptos/rates')
        .then((response:any)=> resolve(response.data))
        .catch((error)=> reject(error.response))
    })
}

export function createCryptoRateAction(payload:any) {
    return new Promise((resolve, reject)=> {
        postFetch('/admin/assets/crypto/rate', payload)
        .then((response:any)=> resolve(response.data))
        .catch((error)=> reject(error))
    })
}