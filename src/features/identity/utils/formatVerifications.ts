
export interface verificationListItemType {
    id:string,
    user: {
        name:string,
        email:string,
        profileImageURL:string
    },
    status:'PENDING'|'SUCCESS'|'FAILED',
    date:string
}

export default function formatVerificationList(verifications:any[]) {
    return new Promise<verificationListItemType[]>((resolve, reject)=> {
        if(!verifications.length) resolve([])
        
        resolve(verifications.map(verification => {
            return {
                id:verification?._id,
                user: {
                    name: verification?.user?.name,
                    email: verification?.user?.email,
                    profileImageURL: verification?.user?.profileImageURL
                },
                status: verification?.status,
                date: verification?.dateCreated
            }
        }))
    })
}