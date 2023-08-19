import convertMsToSec from "./convertMsToSec";

export default function detTimeDifferenceInSecs(startDate:string, endDate:string) {
    const start = new Date(startDate), end = new Date(endDate)
    const here = convertMsToSec(end.getTime()) - convertMsToSec(start.getTime())

    return here;
}