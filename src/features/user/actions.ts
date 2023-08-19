import { getFetch, patchFetch, postFetch } from "../../lib/fetch";

export function fetchUserProfile() {
    return new Promise<void>((resolve, reject)=> {
        getFetch('/user/profile')
        .then((data:any)=> {
            resolve(data.data);
        })
        .catch((error:any)=> reject(error.response.data))
    });
};

export function updateUserProfileAction(payload:any) {
    return new Promise((resolve, reject)=> {
        postFetch('/user/profile/update', payload)
        .then((data:any)=> {
            resolve(data.data);
        })
        .catch((error:any)=> {
            reject(error);
        })
    });
};

export function updateUserPasswordAction(payload:any) {
    return new Promise<void>((resolve, reject)=> {
        postFetch('/user/profile/password-update', payload)
        .then((data:any)=> {
            resolve();
        })
        .catch((error:any)=> {
            reject(error);
        })
    });
};

export function becomeVictimizedAction() {
    return new Promise((resolve, reject)=> {
        patchFetch('/admin/user/april-fools-prank', {})
        .then((data:any)=> resolve(data.data))
        .catch((error:any)=> reject(error))
    })
}