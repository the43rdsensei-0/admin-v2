export default function filterArrayList(filterValue:string, list:any[][]) {
    return list.filter((option)=> {
        return  option
                .join(' ')
                .toString()
                .toLowerCase()
                .search(filterValue.toLowerCase()) !== -1
    })
}