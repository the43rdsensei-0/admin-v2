import { selector, selectorFamily, useRecoilValue } from "recoil";
import { fetchAdminUserAction, fetchAdminUsersAction, fetchAdminUsersMetricAction } from "./action";

const fetchUsersSelector = selectorFamily({
    key: 'fetchusers',
    get: (pageNumber:number)=> async ()=> {
        return await fetchAdminUsersAction(pageNumber)
        .then((data:any)=> {
            return {
                users: data.users,
                totalPages: data.totalUsersPages
            }
        })
        .catch((error:any)=> {
            console.log(error);
            return error
        })      
    }
});

export const useFetchAdminUsers = (pageNumber:number)=> useRecoilValue(fetchUsersSelector(pageNumber));

const fetchUsersMetricSelector = selector({
    key:'fetchusersmetric',
    get: async ()=> {
        return await fetchAdminUsersMetricAction()
        .then((data:any)=> {
            return {
                ...data,
                code: 200
            }
        })
        .catch((error)=> error.data)
    }
})

export const useFetchAdminUsersMetric = ()=> useRecoilValue(fetchUsersMetricSelector)

const fetchUser = selectorFamily({
    key: 'fetchuser',
    get: (userId:string)=> async ()=> {
        if(!userId) return null;
        
        return await fetchAdminUserAction(userId)
        .then((data:any)=> data.user)  
        .catch((error)=> error)  
    },
})

export const useFetchAdminUser = (userId:string)=> useRecoilValue(fetchUser(userId));

