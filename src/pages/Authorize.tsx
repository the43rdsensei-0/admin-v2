
import { useUserStateValue } from "src/features/user/atom";
import Page404 from "./Page404/Page404";

export default function Authorize({child, roles}:{child:JSX.Element, roles:string[]}) {
    
    const userState  = useUserStateValue()

    if(!roles.includes(userState.userData.role)) return <Page404 />;
    return child
}