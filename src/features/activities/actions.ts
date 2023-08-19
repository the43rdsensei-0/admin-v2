import { getFetch } from "src/lib/fetch";

export function fetchAllActivitesAction (pageNumber:number) {
    return new Promise((resolve, reject)=> {
        getFetch(`/admin/activities/${pageNumber}`)
        .then((response:any)=> resolve(response.data))
        .catch((error)=> reject(error.response))
    });
}