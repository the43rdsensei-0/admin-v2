import { atom, useRecoilState, useSetRecoilState } from "recoil";
import { giftcardAssetStateType } from "./types";

const giftcardAssetInitState: giftcardAssetStateType = {
  giftcards: [],
  status: "idle",
  error: false,
  message: "",
  details: {
    id: "",
    name: "",
    region: {
      id: "",
      name: "",
      abbr: "",
    },
    value: {
      rateInNaira: 0,
      amount: 0,
      active: true,
      id: "",
    },
  },
};

const giftcardAssetState = atom({
  key: "giftcardassetstate",
  default: giftcardAssetInitState,
});

export const useGiftcardAssetState = () => useRecoilState(giftcardAssetState);
export const useGiftcardSetState = () => useSetRecoilState(giftcardAssetState);
