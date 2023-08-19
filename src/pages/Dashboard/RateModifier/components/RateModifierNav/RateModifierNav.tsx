import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./ratemodifiernav.module.css";

interface navItemsType {
    label:string, 
    path:string, 
    active:boolean
}

export default function RateModifierNav() {

    const location = useLocation();
    
    const [navItems, setNavItems] = useState([
        {
            label: 'Cryptocurrencies',
            path: 'crypto',
            active: ['/dashboard/rate-modifier', '/dashboard/rate-modifier/crypto'].includes(location.pathname)
        },
        {
            label: 'Gift Cards',
            path: 'giftcards',
            active: ['/dashboard/rate-modifier/giftcards'].includes(location.pathname)
        }
    ])

    const navigate = useNavigate();

    const changeNav = (index:number)=> {
        navItems.forEach(navItem => navItem.active = false);
        navItems[index].active = true;
        
        try {
            setNavItems([...navItems]);
        }
        finally {
            navigate({pathname: navItems[index].path});
        }
    }

    return (
        <div className={styles.rate_modifier_nav_container}>
            {
                navItems.map((navItem:navItemsType, index:number)=> {
                    return  <div 
                                key={navItem.label}
                                className={`
                                    ${styles.nav_item}
                                    ${navItem.active ?styles.active :null}
                                `}
                                onClick={()=> changeNav(index)}
                            >
                                { navItem.label }
                            </div>
                })
            }
        </div>
    );
}