import { atom, useRecoilState } from "recoil";
import { initStateType } from "src/features/types";

interface bankAccountStateType extends initStateType {
    assets:bankAccountType[]
}

export interface bankAccountType {
    active:boolean,
    name:string,
    shortCode:string,
    acctName:string,
    nuban:string
}

const bankAccountAssetInitState:bankAccountStateType = {
    assets:[],
    status:'idle',
    error: false,
    message: ''
}

const bankAccountAssetState = atom({
    key:'bankaccountstate',
    default: bankAccountAssetInitState
});

export const useBankAccountState = ()=> useRecoilState(bankAccountAssetState)