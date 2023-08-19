import { atom, useRecoilState } from "recoil";
import { assetStateType } from "./types";

const assetInitState:assetStateType = {
    status:'idle',
    error: false,
    message: ''
}

const AssetState = atom({
    key:'assetstate',
    default: assetInitState
});

export const useAssetState = ()=> useRecoilState(AssetState)