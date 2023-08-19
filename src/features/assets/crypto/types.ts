import { initStateType } from "../../types"

export interface cryptoAssetStateType extends initStateType {
    assets:{
        id:string,
        name:string,
        shortCode:string,
        imageURL:string,
        channels:{
            id:string,
            name:string,
            category:string,
            walletAddress:string,
            walletQrImage:string
        }[]
    }[]
}