export default function getTodayDate () {
    const date:Date = new Date(),
    day = date.getDate(),
    month = date.getUTCMonth()+1,
    year = date.getUTCFullYear();

    return `${day}-${month}-${year}`
}