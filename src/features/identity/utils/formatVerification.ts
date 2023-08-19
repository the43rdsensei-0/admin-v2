
export interface verificationType {
    id:string,
    bvn:string,
    faceId:{
        url:string,
        placeholder:string
    },
    govId:{
        category:string,
        image:{
            url:string,
            placeholder:string
        }
    }
}

export default function formatVerification(verifications:any[]) {
    return new Promise<verificationType[]>((resolve, reject)=> {
        if(!verifications.length) resolve([])
        
        resolve(verifications.map(verification => {
            return {
                id:verification._id,
                bvn:verification.bvn.value, 
                faceId: {
                    url: verification.faceId.image.url,
                    placeholder: verification.faceId.image.placeholder
                },
                govId: {
                    category: verification.govId.category,
                    image: {
                        url: verification.govId.image.url,
                        placeholder: verification.govId.image.placeholder
                    }
                }
            }
        }))
    })
}