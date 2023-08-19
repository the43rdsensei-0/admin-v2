export interface ExchangeCalculatorProps {
    rate:{ inDollar:number, inNaira:number },
    amount:number,
    currency:'₦'|'$'
}