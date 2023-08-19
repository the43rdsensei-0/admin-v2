export default function cryptoJSONToFormData(jsonObject:any) {
    return new Promise((resolve)=> {
        
        const formData = new FormData();
        
        if(typeof(jsonObject) === 'object') {
            const allKeys:any = Object.keys(jsonObject);

            try {
                for(var index=0; index < allKeys.length; index++) {
                    const key = allKeys[index], value = jsonObject[allKeys[index]];

                    if(Array.isArray(value)) {
                        value.forEach((val, index2) => {
                            if(typeof val === 'object') {
                                const valObjKeys:string[] = Object.keys(val); 
                                
                                valObjKeys.forEach(key2=> {
                                    // console.log(key, key2);
                                    // console.log(jsonObject[key][index2][key2]);
                                    
                                    formData.append(`${key}[${index2}][${key2}]`, jsonObject[key][index2][key2])
                                    
                                    // const nestedKey = key[index2][key2]

                                    // if(key2 === "walletQrImage") {
                                    //     formData.append(key2, val[key2])

                                    // } 

                                })
                            }
                        })
                    } 
                    else formData.append(key, value);

                }
            } 
            finally {
                resolve(formData);
            }
        }
    });    
}