export default function JSONToFormData(jsonObject:any) {
    return new Promise<FormData>((resolve)=> {
        const formData = new FormData();
        const allKeys:any = Object.keys(jsonObject);

        try {
            for(var index=0; index < allKeys.length; index++) {
                const key = allKeys[index], value = jsonObject[allKeys[index]];

                if(Array.isArray(value)) {
                    value.forEach(val => formData.append(key, val))
                } 
                else if(
                        typeof value === 'object' 
                        && !['image/webp', 'image/png', 'image/jpg', 'image/jpeg', 'svg'].includes(value.type)
                ) {
                    const objKeys = Object.keys(value);
                    for(var i=0; i<objKeys.length; i++) {
                        formData.append(key+[objKeys[i]], value[objKeys[i]]);
                    }
                } 
                else formData.append(key, value);

            }
        } 
        finally {
            resolve(formData);
        }
    });    
}