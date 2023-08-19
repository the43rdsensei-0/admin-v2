import { atom, useRecoilState } from "recoil";
import { activitesStateType } from "./types";

const activitiesInitState:activitesStateType = {
    activities:[],
    status:'idle',
    error:false,
    message:''
}

const activitiesAtom = atom({
    key: 'activitiesstate',
    default: activitiesInitState
});

export const useActivitiesState = ()=> useRecoilState(activitiesAtom)