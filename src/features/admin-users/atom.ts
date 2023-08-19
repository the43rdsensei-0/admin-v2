import { atom, useRecoilState } from "recoil";
import { adminUsersInitStateType } from "./types";

const adminUsersInitState:adminUsersInitStateType = {
    users: [],
    status:'idle',
    error:false,
    message:''
}

const adminUsersState = atom({
    key:'admin-users-state',
    default: adminUsersInitState
});

export const useAdminUsersState = ()=> useRecoilState(adminUsersState)