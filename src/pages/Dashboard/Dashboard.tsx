import styles from "./dashboard.module.css";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import MobileSidebar from "../../components/Navigation/MobileSidebar/mobilesidebar";
import Sidebar from "../../components/Navigation/Sidebar/sidebar";
import {ReactComponent as iconDashboard} from "../../assets/icons/icon-transactions.svg";
import {ReactComponent as iconRateModifier} from "../../assets/icons/icon-rate.svg";
import {ReactComponent as iconTransactionsList} from "../../assets/icons/icon-sheet.svg";
import {ReactComponent as iconCustomers} from "../../assets/icons/icon-group.svg";
import {ReactComponent as iconUserSettings} from "../../assets/icons/icon-user-settings.svg";
import {ReactComponent as iconActivities} from "../../assets/icons/icon-history.svg";
import {ReactComponent as iconVerification} from "src/assets/icons/icon-id-verification.svg";
import { NavOptionsType } from "../../components/Navigation/types";
import { useAuthStateValue } from "src/features/auth/atom";

export default function Dashboard() {

    const authState = useAuthStateValue()

    const navigate = useNavigate()

    const location = useLocation();

    const isCurrentNav = (path:string[])=> {
        const allDir = location.pathname.substring(1, location.pathname.length).split('/');
        const firstTwoDirMax = (allDir.length > 1) ? `/${allDir[0]}/${allDir[1]}` :`/${allDir[0]}`

        if(path.includes(firstTwoDirMax)) return true;
        else return false;
    }

    const [NavOptions, setNavOptions] = useState<NavOptionsType[]>([
        {
            label: "dashboard",
            path: "/dashboard",
            icon: iconDashboard,
            activeIcon: iconDashboard,
            active: isCurrentNav(['/dashboard', '/dashboard/']),
            roles: ['admin_org', 'admin_ops', 'admin_mktg']
        },
        {
            label: "Assets",
            path: "/dashboard/assets",
            icon: iconRateModifier,
            activeIcon: iconRateModifier,
            active: isCurrentNav(['/dashboard/assets']),
            roles: ['admin_org', 'admin_ops', 'admin_acct', 'admin_asset_man']
        },
        {
            label: "transactions",
            path: "/dashboard/transactions",
            icon: iconTransactionsList,
            activeIcon: iconTransactionsList,
            active: isCurrentNav(['/dashboard/transactions']),
            roles: ['admin_org', 'admin_ops', 'admin_acct', 'admin_csa_crypto',  'admin_csa_card']
        },
        {
            label: "customers",
            path: "/dashboard/customers",
            icon: iconCustomers,
            activeIcon: iconCustomers,
            active: isCurrentNav(['/dashboard/customers']),
            roles: ['admin_org', 'admin_ops', 'admin_mktg']
        },
        {
            label: "admin access",
            path: "/dashboard/admin-access",
            icon: iconUserSettings,
            activeIcon: iconUserSettings,
            active: isCurrentNav(['/dashboard/admin-access']),
            roles: ['admin_org', 'admin_ops']
        },
        {
            label: "activities",
            path: "/dashboard/activities",    
            icon: iconActivities,
            activeIcon: iconActivities,
            active: isCurrentNav(['/dashboard/activities']),
            roles: ['admin_org', 'admin_ops']
        },
        {
            label: "verification",
            path: "/dashboard/verifications",
            icon: iconVerification,
            activeIcon: iconVerification,
            active: isCurrentNav(['/dashboard/verifications']),
            roles: ['admin_org', 'admin_ops']
        }
    ]);

    const [activeNavPosition, setActiveNavPosition] = useState(0);

    useEffect(()=> {
        const setActiveNav = (optionPosition:number)=> {
            setNavOptions((navOptions:any)=> {
                return [...navOptions.map((navOption:NavOptionsType, index:number)=> {
                    return (optionPosition)
                    ?   (index === optionPosition)
                        ? { ...navOption, active: true }
                        : { ...navOption, active:false }

                    :   (
                            [navOption.path, `${navOption.path}/`].includes(location.pathname)
                            || navOption.path === `/${location.pathname.split('/')[1]}/${location.pathname.split('/')[2]}`
                        )
                        ? { ...navOption, active: true }
                        : { ...navOption, active:false }

                })
            ]
            });
        }

        setActiveNav(activeNavPosition)

    }, [activeNavPosition, authState.isSignedIn, location, navigate])

    return (
        <div className={styles.body}>
            <div className={styles.sidebar_wrapper}>
                <Sidebar navOptions={NavOptions} navigateTo={setActiveNavPosition} />
            </div>
            
            <div className={styles.mobile_sidebar_wrapper}>
                <MobileSidebar navOptions={NavOptions} navigateTo={setActiveNavPosition} />
            </div>
            
            <div className={styles.main}>
                <Outlet />
            </div>
        </div>
    )
}