export default function phoneValid(phone:string) {
    if(phone.length !== 10) return false;

    const first2Digits = phone.substring(0, 2)
    if(first2Digits === '70') return true;
    if(first2Digits === '71') return true;

    if(first2Digits === '80') return true;
    if(first2Digits === '81') return true;
    
    if(first2Digits === '90') return true;
    if(first2Digits === '91') return true;

    return false;
}