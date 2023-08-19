import { initStateType } from "../types";

export interface UserStateTypes extends initStateType {
    userData: {
        id:'',
        email: string,
        phoneNumber: string,
        role: string,
        fullname: string,
        firstname:string,
        profileImageURL: string, 
        newProfileImage: Blob|MediaSource|string|undefined,
        bank: {
            name:string,
            accountName:string,
            accountNumber:string
        },
        adminProperties?: {
            transactionFilterOptions: {
                status: 'ALL' | 'PENDING' | 'SUCCESS' | 'FAILED',
                startDate:string,
                endDate:string
            }
        }
    }
}