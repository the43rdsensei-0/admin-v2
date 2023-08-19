export default function sortByDate(list:any[]) {
    if(!list.length) return []
    
    list = [...list];
    for (let i=0; i<list.length; i++) {
        for(let j=0; j<list.length-1; j++) {
            let currentListItem = list[i];
            let nextListItem = list[j];

            let currentListItemDate = new Date(currentListItem.date).getTime();
            let nextListItemDate = new Date(nextListItem.date).getTime();

            if(nextListItemDate > currentListItemDate) {
                let holdCurrentListItem = currentListItem;
                list[i] = nextListItem
                list[j] = holdCurrentListItem
            }
        }

        if(list.length-1 === i) return list.reverse();
    }
}