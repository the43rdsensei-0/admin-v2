import { atom, useRecoilState, useRecoilValue } from "recoil"
import { rateStateType } from "./types";

const rateInitState:rateStateType = {
    rate: {
        sell: {
            inNaira: 0
        },
        buy: {
            inNaira: 0
        }
    },
    status: 'idle',
    error: false,
    message: ''
}

export const rateState = atom({
    key: 'ratestate',
    default: rateInitState
})

export const useRateState = ()=> useRecoilState(rateState);
export const useRateStateValue = ()=> useRecoilValue(rateState);