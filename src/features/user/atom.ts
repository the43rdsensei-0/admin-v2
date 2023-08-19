import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { UserStateTypes } from "./types";

export const userInitState:UserStateTypes = {
    userData: {
        id:'',
        email: '',
        phoneNumber: '',
        role: '',
        fullname: '',
        firstname:'',
        profileImageURL: '',
        newProfileImage: '',
        bank:{
            name:'',
            accountName:'',
            accountNumber:''
        },
        adminProperties: {
            transactionFilterOptions: {
                status: 'ALL',
                startDate:'',
                endDate:''
            }
        }
    },
    status: 'idle',
    error: false,
    message: ''
}

export const userAtom = atom({
    key: 'userState',
    default: userInitState  
});

export const useUserStateValue = ()=> useRecoilValue(userAtom);
export const useUserState = ()=> useRecoilState(userAtom);
export const useSetUserState = ()=> useSetRecoilState(userAtom);