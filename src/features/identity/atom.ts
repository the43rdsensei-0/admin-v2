import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { identityStateTypes } from "./types";

export const identityInitState:identityStateTypes = {
    verificationList:[],
    totalPages: 0,
    currentPage: 0,
    status: 'idle',
    error: false,
    message: ''
}

export const identityAtom = atom({
    key: 'identity',
    default: identityInitState
});

export const useIdentityState = ()=> useRecoilState(identityAtom);
export const useIdentityStateValue = ()=> useRecoilValue(identityAtom);
export const useIdentitySetState = ()=> useSetRecoilState(identityAtom);