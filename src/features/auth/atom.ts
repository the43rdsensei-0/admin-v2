import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { authStateType } from "./types";

export const authInitState:authStateType = {
    isSignedIn: localStorage.getItem('sid.set') ?true :false,
    status: 'idle',
    error: false,
    message:''
}

const AuthAtom = atom({
    key: 'authState',
    default: authInitState
})

export const useAuthState = ()=> useRecoilState(AuthAtom);
export const useAuthStateValue = ()=> useRecoilValue(AuthAtom);
export const useSetAuthState = ()=> useSetRecoilState(AuthAtom);
