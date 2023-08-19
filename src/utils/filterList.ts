export default function filterList (filterValue:string, list:any[]) {
    const newList = list.filter((option:any)=>option.label.toString().toLowerCase().search(filterValue.toLowerCase()) !== -1);

    return newList;
                
}