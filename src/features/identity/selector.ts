import { selector, useRecoilValue } from "recoil";

const fetchVerificationListSelector = selector({
    key:'fetchverificationlistseletor',
    get: ()=> {
        
    }
})


export const useFetchVerificationList = ()=> useRecoilValue(fetchVerificationListSelector)