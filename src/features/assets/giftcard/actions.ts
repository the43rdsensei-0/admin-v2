import { ISuccessResponseType } from "src/features/types";
import { getFetch, postFetch, patchFetch } from "../../../lib/fetch";
import { IGiftcardDocument } from "./utils/formatGiftcardAsset";

export function fetchGiftcardAssetsAction() {
  return new Promise((resolve, reject) => {
    return getFetch("/assets/giftcards")
      .then((response: any) => resolve(response.data.assets))
      .catch((error) => reject(error));
  });
}

export function fetchGiftcardAssetByIdAction(cryptoId?: string) {
  return new Promise((resolve, reject) => {
    getFetch(`/assets/giftcard/${cryptoId}`)
      .then((response: any) => resolve(response.data.asset))
      .catch((error) => reject(error.response));
  });
}

export function createGiftcardAssetAction(payload: any) {
  return new Promise((resolve, reject) => {
    return postFetch("/admin/assets/giftcard/new", payload)
      .then((response: any) => resolve(response.data))
      .catch((error) => reject(error));
  });
}

export function updateGiftcardAction(id: string, payload: any) {
  return new Promise((resolve, reject) => {
    return patchFetch(`/admin/assets/giftcard/${id}`, payload)
      .then((response: any) => resolve(response.data))
      .catch((error) => reject(error));
  });
}

export function deactivateGiftcardAction(
  id: string,
  payload: { active: boolean }
) {
  return new Promise((resolve, reject) => {
    return patchFetch(`/admin/assets/giftcard/${id}`, payload)
      .then((response: any) => resolve(response.data))
      .catch((error) => reject(error));
  });
}

export function createGiftcardRegionAction(cardId: string, payload: FormData) {
  return new Promise((resolve, reject) => {
    return postFetch(`/admin/assets/giftcard/${cardId}/region`, payload)
      .then((response: any) => resolve(response.data))
      .catch((error) => reject(error));
  });
}

export interface ICreateRegionValueResponse extends ISuccessResponseType {
  data: { giftcards: IGiftcardDocument[] };
}

export function createGiftcardRegionValueAction(
  cardId: string,
  regionId: string,
  payload: { amount: number; rateInNaira: number }
) {
  return new Promise<ICreateRegionValueResponse>((resolve, reject) => {
    return postFetch(
      `/admin/assets/giftcard/${cardId}/region/${regionId}/values`,
      payload
    )
      .then((response: any) => resolve(response.data))
      .catch((error) => reject(error));
  });
}

export function updateGiftcardValueAction(
  cardId: string,
  regionId: string,
  valueId: string,
  payload: { 
    valueAmount?: number; 
    rateInNaira?: number;
    active?: boolean
  },
) {
  return new Promise<{asset: IGiftcardDocument}>((resolve, reject) => {
    return patchFetch(
      `/admin/assets/giftcard/${cardId}/region/${regionId}/values/${valueId}`,
      payload
    )
      .then((response: any) => resolve(response.data))
      .catch((error) => reject(error));
  });
}