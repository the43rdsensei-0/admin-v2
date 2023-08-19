import { deleteFetch, getFetch, patchFetch, postFetch } from "../../../lib/fetch";

export function createCryptoAssetAction(payload:any) {
    return new Promise((resolve, reject)=> {
        return postFetch('/admin/assets/crypto/new', payload)
        .then((responseData:any)=> resolve(responseData.data.asset))
        .catch((error)=> reject(error))
    });
}

export function fetchCryptoAssetsAction() {
    return new Promise((resolve, reject)=> {
        return getFetch('/assets/cryptos')
        .then((responseData:any)=> resolve(responseData.data.assets))
        .catch((error)=> reject(error))
    })
}

export function fetchCryptoAssetByIdAction(cryptoId?:string) {
    return new Promise((resolve, reject)=> {
        getFetch(`/assets/crypto/id/${cryptoId}`)
        .then((response:any)=> resolve(response.data.asset))
        .catch((error)=> reject(error.response));
    });
}

export function updateCryptoAssetAction(id:string, payload:{}) {
    return new Promise((resolve, reject)=> {
        return patchFetch(`/admin/assets/crypto/${id}`, payload)
        .then((responseData:any)=> resolve(responseData.data.assets))
        .catch((error)=> reject(error))
    })
}

export function createCryptoAssetChannelAction(id:string, payload:{}) {
    return new Promise((resolve, reject)=> {
        return postFetch(`/admin/assets/crypto/${id}/channel`, payload)
        .then((responseData:any)=> resolve(responseData.data.assets))
        .catch((error)=> reject(error))
    })
}

export function deleteCryptoChannelAssetAction(assetId:string, channelId:string) {
    return new Promise((resolve, reject)=> {
        return deleteFetch(`/admin/assets/crypto/${assetId}/channel/${channelId}`)
        .then((responseData:any)=> resolve(responseData.data.assets))
        .catch((error)=> reject(error))
    })
}
