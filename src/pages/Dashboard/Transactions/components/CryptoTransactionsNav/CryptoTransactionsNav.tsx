import { useState } from "react";
import { useTransactionState } from "src/features/transactions/atom";
import styles from "./cryptotransactionsnav.module.css";

interface navItemsType {
    label:string, 
    path:'buy'|'sell',
    active:boolean
}

export default function CryptoTransactionsNav({navigateTo}:{navigateTo:Function}) {

    const [transactionState, setTransactionState] = useTransactionState();

    const [navItems] = useState<navItemsType[]>([
        {
            label: 'Sell cryptocurrency',
            path: 'sell',
            active: transactionState.activeCSACryptoCategory === 'sell' ?true :false
        },
        {
            label: 'Buy cryptocurrency',
            path: 'buy',
            active: transactionState.activeCSACryptoCategory === 'buy' ?true :false
        }
    ])

    const changeNav = (index:number)=> {
        setTransactionState(state => {
            return {
                ...state!,
                activeCategory: "cryptocurrency",
                activeCSACryptoCategory: navItems[index].path
            }
        })

        navigateTo(navItems[index].path)
    }

    return (
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
    );
}