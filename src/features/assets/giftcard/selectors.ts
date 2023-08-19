import { selector, useRecoilValue } from "recoil";
import { fetchGiftcardAssetsAction } from "./actions";
import formatMultipleGiftcardAssets from "./utils/formatMultipleGiftcardAssets";


const fetchGiftcardAssets = selector({
    key:'fetchgiftcardassets',
    get: async ()=> {
        return await fetchGiftcardAssetsAction()
        .then((giftcardAssets:any)=> {
            return formatMultipleGiftcardAssets(giftcardAssets);
        })
        .catch((error)=> {
            console.log(error);
            return error;
        })
    }
});

export const useFetchGiftcardAssets = ()=> useRecoilValue(fetchGiftcardAssets);