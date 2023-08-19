import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { customerStateType } from "./types";

export const customerInitState:customerStateType = {
    list: [],
    totalPages: 0,
    currentPage: 0,
    searchKeyword: '',
    sortType: '', 
    status: 'idle',
    error: false,
    message:''
}

const CustomerAtom = atom({
    key: 'customerState',
    default: customerInitState
})

export const useCustomerState = ()=> useRecoilState(CustomerAtom);
export const useCustomerStateValue = ()=> useRecoilValue(CustomerAtom);
export const useCustomerSetState = ()=> useSetRecoilState(CustomerAtom);
