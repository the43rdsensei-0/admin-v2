import { IGiftcardAssetListItem } from "../types";

export interface IGiftcardDocument {
    id:string;
    active:boolean;
    name:string;
    imageURL:string;
    regions:Array<{
      id:string;
      active:boolean;
      flagImageURL:string;
      name:string;
      abbr:string;
      values:Array<{
        id:string;
        active:boolean;
        amount:number;
        rate:{
          inNaira:number;
          inDollars:number;
        }
      }>
    }>
  }


export default function formatGiftcardAsset(assets:IGiftcardDocument[]):Array<IGiftcardAssetListItem> {
    if(!assets.length) return []
    return  assets.map((asset)=> ({
                id: asset.id,
                active: asset.active,
                name:   asset.name,
                imageURL:   asset.imageURL,
                regions: asset.regions.map((region) => ({
                    id: region.id,
                    active: region.active,
                    name: region.name,
                    abbr: region.abbr.toUpperCase(),
                    flagImageURL: region.flagImageURL,
                    values: region.values.map((value)=> {
                        return {
                            id: value.id,
                            active: value.active,
                            amount: value.amount,
                            rate: {
                                inNaira: value.rate.inNaira,
                                inDollars: value.rate.inDollars
                            }
                        }
                    })
                }))
            }))
}