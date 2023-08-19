import { atom, useRecoilState } from "recoil";
import { annoncementStateType } from "./types";

const announcementInitState:annoncementStateType = {
    status:'idle',
    error: false,
    message: ''
}

const AnnouncementState = atom({
    key:'announcementstate',
    default: announcementInitState
});

export const useAnnouncementState = ()=> useRecoilState(AnnouncementState)