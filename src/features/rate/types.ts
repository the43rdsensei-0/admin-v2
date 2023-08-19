import { initStateType } from "../types";

export interface rateStateType extends initStateType {
    rate: {
        sell: {
            inNaira:number
        },
        buy: {
            inNaira:number
        }
    },
}