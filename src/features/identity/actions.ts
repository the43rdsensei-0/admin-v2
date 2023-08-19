import { getFetch } from "src/lib/fetch"

export function fetchIdentityAction(identityId:string) {
    return new Promise((resolve, reject)=> {
        getFetch(`/admin/identity/${identityId}`)
        .then((response:any)=> resolve(response))
        .catch((error)=> reject(error))
    })
}

export function rejectVerificationAction(identityId:string) {
    return new Promise((resolve, reject)=> {
        getFetch(`/admin/identity/${identityId}/reject`)
        .then((response:any)=> resolve(response))
        .catch((error)=> reject(error))
    })
}

export function approveVerificationAction(identityId:string) {
    return new Promise((resolve, reject)=> {
        getFetch(`/admin/identity/${identityId}/approve`)
        .then((response:any)=> resolve(response))
        .catch((error)=> reject(error))
    })
}
