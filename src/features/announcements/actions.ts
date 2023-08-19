import { getFetch, postFetch } from "src/lib/fetch";

export function uploadAnnouncementBannerAction(payload:FormData) {
    return new Promise((resolve, reject)=> {
        return postFetch('/admin/banners/announcement', payload)
        .then((responseData:any)=> resolve(responseData.data))
        .catch((error)=> reject(error))
    });
}

export function fetchAnnouncementBannerAction() {
    return new Promise((resolve, reject)=> {
        return getFetch('/banners/announcement')
        .then((responseData:any)=> resolve(responseData.data.announcementBanner))
        .catch((error)=> reject(error))
    });
}

export function uploadAdvertismentBannerAction(payload:FormData) {
    return new Promise((resolve, reject)=> {
        return postFetch('/admin/banners/advertisment', payload)
        .then((responseData:any)=> resolve(responseData.data.asset))
        .catch((error)=> reject(error))
    });
}

export function fetchAdvertismentBannerAction() {
    return new Promise((resolve, reject)=> {
        return getFetch('/banners/advertisment')
        .then((responseData:any)=> resolve(responseData.data.advertismentBanner))
        .catch((error)=> reject(error))
    });
}

export function createAnnouncementMessageAction(payload:{}) {
    return new Promise((resolve, reject)=> {
        return postFetch(`/admin/announcements`, payload)
        .then((responseData:any)=> resolve(responseData.data.announcement))
        .catch((error)=> reject(error))
    })
}