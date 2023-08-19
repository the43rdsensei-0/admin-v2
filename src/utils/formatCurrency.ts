export default function formatCurrency (amount: number, currency:'₦'|'$'): string {
    return `${currency} ${amount.toString().replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
}
