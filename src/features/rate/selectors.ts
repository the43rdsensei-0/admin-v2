import { selector, useRecoilValue } from "recoil";
import { fetchCryptoAssetRateAction } from "./actions";

const fetchCryptoAssetRateSelector = selector({
    key:'fetchcryptoassetrate',
    get: async ()=> {
        return await fetchCryptoAssetRateAction()
        .then((data:any)=> data.rate)
        .catch((error:any)=> error)
    }
})

export const useFetchCryptoAssetRate = ()=> useRecoilValue(fetchCryptoAssetRateSelector); 