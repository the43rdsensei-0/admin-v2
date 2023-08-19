import { atom, useRecoilState } from "recoil";
import { cryptoAssetStateType } from "./types";

const cryptoAssetInitState:cryptoAssetStateType = {
    assets:[],
    status:'idle',
    error: false,
    message: ''
}

const cryptoAssetState = atom({
    key:'cyptoassetstate',
    default: cryptoAssetInitState
});

export const useCryptoAssetState = ()=> useRecoilState(cryptoAssetState)