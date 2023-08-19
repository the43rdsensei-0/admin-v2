export default function prefixDigit(digit:string) {
    return parseInt(digit) < 10 ?`0${digit}` :digit;
}