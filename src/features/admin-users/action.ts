import { getFetch, patchFetch, postFetch } from "src/lib/fetch"

export function fetchAdminUsersAction(pageNumber:number) {
    return new Promise((resolve, reject)=> {
        getFetch(`/admin/access/${pageNumber}`)
        .then((response:any)=> resolve(response.data))
        .catch((error:any)=> reject(error.response))
    })
}

export function fetchAdminUsersMetricAction() {
    return new Promise((resolve, reject)=> {
        getFetch('/admin/access/metrics')
        .then((response:any)=> resolve(response.data))
        .catch((error:any)=> reject(error.response))
    })
}

export function fetchAdminUserAction(userId:string) {
    return new Promise((resolve, reject)=> {
        getFetch(`/admin/access/profile/${userId}`)
        .then((response:any)=> resolve(response.data))
        .catch((error:any)=> reject(error.response))
    })
}

export function updateAdminUserAction(userId:string, payload:{}) {
    return new Promise((resolve, reject)=> {
        patchFetch(`/admin/access/${userId}`, payload)
        .then((response:any)=> resolve(response.data))
        .catch((error:any)=> reject(error))
    })
}

export function createAdminUserAction(payload:any) {
    return new Promise((resolve, reject)=> {
        postFetch('/admin/access/register', payload)
        .then((data:any)=> resolve(data.user))
        .catch((error:any)=> reject(error))
    })
}
