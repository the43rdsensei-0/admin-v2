import { useNavigate } from "react-router-dom";
import { LogoutAction } from "src/features/auth/actions";
import { authInitState, useAuthState } from "src/features/auth/atom";
import { userInitState, useSetUserState } from "src/features/user/atom";
import TextButton from "../TextButton/textbutton";
import styles from "./logoutbutton.module.css";

export default function LogoutButton({
    extraStyle
}:{extraStyle:string}) {

    const [authState, setAuthState] = useAuthState()

    const setUserState = useSetUserState();
    const navigate = useNavigate();

    const logUserOut = ()=> {
        setAuthState(state => {
            return {
                ...state,
                status: 'loading'
            }
        })
        
        LogoutAction()
        .then(()=> {
            localStorage.removeItem('sid.set')            
            setUserState(() => userInitState);
            setAuthState(() => authInitState);
        })
        .catch(()=> {
            localStorage.removeItem('sid.set')            
            setUserState(() => userInitState);
            setAuthState(() => authInitState);
        })
        .finally(()=> {
            navigate({pathname: '/'})
        })
    }

    return (
        <TextButton
            className={`${extraStyle} ${styles.logout_button}`} 
            isLoading={authState.status === 'loading'}
            label={"Logout"} 
            onClick={()=> logUserOut()}        
        />
    );
}