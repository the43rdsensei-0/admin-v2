import { postFetch } from "../../lib/fetch";

export function LoginAction(payload:{email:string, password:string}) {
    return new Promise((resolve, reject)=> {
        return postFetch('/admin/auth/signin', payload)
        .then((data:any)=> {
            localStorage.setItem('sid.set', 'true');
            resolve(data)
        })
        .catch((error)=> reject(error))
    });
}

export function LogoutAction() {
    return new Promise((resolve, reject)=> {
        return postFetch('/auth/signout', {})
        .then((data:any)=> {
            localStorage.removeItem('sid.set');
            resolve(data)
        })
        .catch((error)=> reject(error))
    });
}