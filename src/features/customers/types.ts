import { initStateType } from "../types"
import { CustomerType } from "./utils/formatCustomersList"

export interface customerStateType extends initStateType {
    list: CustomerType[],
    totalPages: number,
    currentPage: number,
    searchKeyword: string,
    sortType: string
}