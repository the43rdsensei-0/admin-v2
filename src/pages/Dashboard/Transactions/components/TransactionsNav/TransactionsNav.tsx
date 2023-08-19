import { useState } from "react";
import { useTransactionState } from "src/features/transactions/atom";
import CryptoTransactionsNav from "../CryptoTransactionsNav";
import styles from "./transactionsnav.module.css";

interface navItemsType {
    label:string, 
    path:''|'cryptocurrency'|'giftcard', 
    active:boolean
}

export default function TransactionsNav({navigateTo}:{navigateTo:Function}) {

    const [transactionState, setTransactionState] = useTransactionState();

    const [navItems] = useState<navItemsType[]>([
        {
            label: 'All Transactions',
            path: '',
            active: transactionState.activeCategory === '' ?true :false
        },
        {
            label: 'Cryptocurrency',
            path: 'cryptocurrency',
            active: transactionState.activeCategory === 'cryptocurrency' ?true :false
        },
        {
            label: 'Gift card',
            path: 'giftcard',
            active: transactionState.activeCategory === 'giftcard' ?true :false
        }
    ])

    const changeNav = (index:number)=> {
        setTransactionState(state => {
            return {
                ...state!,
                activeCategory: navItems[index].path
            }
        })

        navigateTo(navItems[index].path)
    }

    return (
        <div>
            <div className={styles.transactions_nav_container}>
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
            {   
                navItems[1].active
                ?   <CryptoTransactionsNav
                        navigateTo={(category:string)=> navigateTo(category)}
                    />
                :   null
            }
        </div>
    );
}