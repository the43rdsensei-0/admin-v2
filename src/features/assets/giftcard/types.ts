import { initStateType } from "../../types";

export interface giftcardAssetStateType extends initStateType {
  giftcards: Array<IGiftcardAssetListItem>;
  details: IGiftcardDetails;
}

export interface IGiftcardAssetListItem {
  id: string;
  active: boolean;
  name: string;
  imageURL: string;
  regions: Array<{
    id: string;
    active: boolean;
    flagImageURL: string;
    name: string;
    abbr: string;
    values: Array<{
      id: string;
      active: boolean;
      amount: number;
      rate: {
        inNaira: number;
        inDollars: number;
      };
    }>;
  }>;
}

export interface IGiftcardDetails {
  id: string;
  name: string;
  region: {
    id: string;
    name: string;
    abbr: string;
  };
  value: {
    id: string;
    active: boolean;
    amount: number;
    rateInNaira: number;
  };
}
