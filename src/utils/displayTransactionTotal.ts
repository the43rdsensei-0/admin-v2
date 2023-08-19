import calcTransactionTotal from "./calTransactionTotal";
import convertCurrency from "./currencyConverter";

export default function displayTransactionTotal(rate:number, amount:number, sigFigures:number):string {
    return convertCurrency(calcTransactionTotal(rate, amount), '₦', sigFigures)
}