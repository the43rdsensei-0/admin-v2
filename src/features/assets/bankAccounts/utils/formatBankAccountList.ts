import { bankAccountType } from "../atom";

export default function formatBankAccountList(accounts:any[]):bankAccountType[] {
    if(!accounts.length) return accounts;
    return accounts.map(account => {
        return {
            ...account,
            id: account._id,
            acctName: account.accountName
        }
    })
}