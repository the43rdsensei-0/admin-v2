import { selector, useRecoilValue } from "recoil";
import { fetchUserProfile } from "./actions";

const fetchUserSelector = selector({
    key: 'fetchuser',
    get: async ()=> {
        return fetchUserProfile()
        .then((data:any)=> {
            return data;
        })
        .catch((error)=> {
            return error
        })
    }
});

export const useUserValue = ()=> useRecoilValue(fetchUserSelector);