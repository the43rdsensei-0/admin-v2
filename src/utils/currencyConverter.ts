export default function convertCurrency (amount:number, currency:'₦'|'$', sigFigures: number): string {
    return `${currency}${amount.toFixed(sigFigures).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
}