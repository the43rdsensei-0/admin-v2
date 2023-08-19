import { selector, useRecoilValue } from "recoil";
import { fetchCryptoAssetsAction } from "./actions";
import formatAllCryptoAssets from "./utils/formatAllCryptoAssets";


const fetchCryptoAssets = selector({
    key:'fetchcryptoassets',
    get: async ()=> {
        return await fetchCryptoAssetsAction()
        .then((cryptoAssets:any)=> {
            return formatAllCryptoAssets(cryptoAssets);
        })
        .catch((error)=> {
            console.log(error);
            return error;
        })
    }
});


export const useFetchCryptoAssets = ()=> useRecoilValue(fetchCryptoAssets);