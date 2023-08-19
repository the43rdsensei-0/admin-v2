import { useEffect, useRef } from "react";

export default function useClickOutside(closeDropDown:Function) {
    
    let dropDownRef = useRef<any>();

    useEffect(()=> {
        const maybeCloseDropDown = (event:any)=> {
            if(!dropDownRef?.current?.contains(event.target)) {
                closeDropDown(false);
            }
        }
        document.addEventListener('click', maybeCloseDropDown);
        return ()=> document.removeEventListener('click', maybeCloseDropDown);
    }, [closeDropDown]);

    return dropDownRef;

}