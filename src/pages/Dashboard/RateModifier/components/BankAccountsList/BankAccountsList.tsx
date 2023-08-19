import styles from "./bankaccountslist.module.css";
import { useEffect, useState } from "react";
import { fetchBankAccountsAction } from "src/features/assets/bankAccounts/action";
import { useBankAccountState } from "src/features/assets/bankAccounts/atom";
import BankAccountCard from "./BankAccountCard";
import { FaPlus } from "react-icons/fa";
import formatBankAccountList from "src/features/assets/bankAccounts/utils/formatBankAccountList";
import AddBankAccount from "./AddBankAccount";

export default function BankAccountsList() {

    const [bankAccountState, setBankAccountState] = useBankAccountState()

    const [isModalOpen, setIsModalOpen] = useState(false)
    
    useEffect(()=> {
        fetchBankAccountsAction()
        .then((response:any)=> {
            setBankAccountState(state => {
                return {
                    ...state,
                    assets: formatBankAccountList(response.accounts)
                }
            })
        })
        .catch((error)=> {
            console.log(error)
        })

    }, [setBankAccountState])

    return (
        <div className={styles.bank_account_list}>
            <div className={styles.add_bank_account} onClick={()=> setIsModalOpen(true)}>
                <div className={styles.plus}><FaPlus /></div>
                <div className={styles.label}>Add Bank Account</div>
            </div>

            {
                bankAccountState.assets.map(asset=> {
                    return  <BankAccountCard 
                                key={asset.nuban}
                                active={asset.active}
                                name={asset.name}
                                shortCode={asset.shortCode}
                                acctName={asset.acctName}
                                nuban={asset.nuban}
                            />
                })
            }

            {   
                isModalOpen
                ?   <AddBankAccount close={()=> setIsModalOpen(false)} />
                :   null
            }
        </div>
    )
}