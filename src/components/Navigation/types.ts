export interface NavOptionsType {
    label: string,
    path: string,    
    icon: any,
    activeIcon: any,
    active: boolean,
    roles: string[]
}


export interface sideBarNavOptionsType {
    navOptions: NavOptionsType[],
    navigateTo: Function
}