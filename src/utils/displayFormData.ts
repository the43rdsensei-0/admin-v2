export default function displayFormData(formData:any) {
    for(let pair of formData.entries()) {
        console.log(pair[0] + '-' + pair[1])
    }
}