export default function timePassed(dateTime:string) {
    const startTime:Date = new Date(dateTime), 
          endTime:Date = new Date();

    const timeDiff:number = (endTime.getTime() - startTime.getTime()); //in ms

    // get seconds 
    const seconds = Math.round(timeDiff/1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);
    const weeks = Math.round(days / 7);
    const months = Math.round(weeks / 4);
    const years = Math.round(months / 12);
    
    if(seconds < 60) return `${seconds} sec${(seconds > 1) ? 's': ''} ago`
    if(minutes < 60) return `${minutes} min${(minutes > 1) ? 's': ''} ago`
    if(hours < 24) return `${hours} hr${(hours > 1) ? 's': ''} ago`
    if(days < 7) return `${days} day${(days > 1) ? 's': ''} ago`
    if(weeks < 4) return `${weeks} week${(weeks > 1) ? 's': ''} ago`
    if(months < 12) return `${months} month${(months > 1) ? 's': ''} ago`
    if(years < 12) return `${years} year${(years > 1) ? 's': ''} ago`
}