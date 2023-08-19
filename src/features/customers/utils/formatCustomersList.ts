export interface CustomerType {
    id: string,
    profileImageURL: string,
    active: boolean,
    email: string,
    fullname: string,
    phoneNumber: string,
    totalTransactionAmount: number,
    verified: boolean,
    date: string
}

export default function formatCustomersList(customersList:[]):CustomerType[] {
    if(!customersList.length) return []
    return customersList.map((customer:any) => {
        return {
            id: customer._id,
            profileImageURL: customer.profileImageURL,
            active: customer.active,
            email: customer.email,
            fullname: customer.fullname,
            phoneNumber: customer.phoneNumber,
            totalTransactionAmount: customer.totalTransactionAmount,
            verified: customer.verified,
            date: customer.createdAt
        }
    })
}