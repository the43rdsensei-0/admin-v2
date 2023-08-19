import { initStateType } from "../types";
import { verificationListItemType } from "./utils/formatVerifications";

export interface identityStateTypes extends initStateType {
    verificationList: verificationListItemType[],
    verificationDetails?: any,
    totalPages: number,
    currentPage: number
}