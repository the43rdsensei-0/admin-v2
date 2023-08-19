import { useEffect, useState } from "react";
import { useTransactionStateValue } from "src/features/transactions/atom";
import DataLoadingError from "../../../../../components/DataLoadingError";
import { useCustomerDetailsValue } from "../../../../../features/customers/selectors";
import { ReactComponent as IconCopyFile } from "src/assets/icons/icon-copy-file.svg";
import styles from "./transactionuserinfo.module.css";
import SizedBox from "src/components/SizedBox";
import ComponentLoader from "src/components/Loaders/ComponentLoader";
import { FaCheckCircle } from "react-icons/fa";

export default function TransactionUserInfo({userId, extraStyle}:{userId:string, extraStyle?:string}) {

    const transactionState = useTransactionStateValue()

    const transactionUserResponse = useCustomerDetailsValue(userId);
    const [loadingError, setLoadingError] = useState({
        status: false,
        message: ''
    })
    const [customerInfo, setCustomerInfo] = useState({
        fullname:'',
        bank: {
            name:'',
            accountName:'',
            accountNumber:''
        }
    })

    useEffect(()=> {
        if(transactionUserResponse.code === 200) {
            setLoadingError({ status: false, message: '' })
            setCustomerInfo(transactionUserResponse.customer)

        } else {
            setLoadingError({ status: true, message: 'Customer not found' })
        }

    }, [transactionUserResponse])

    const [isAccountCopying, setIsAccountNumberCopying] = useState(false)
    const [isCopied, setIsCopied] = useState(false)

    const copyWalletAddress =()=> {
        setIsAccountNumberCopying(true);

        navigator.clipboard.writeText(transactionState.details.walletAddress!)
        
        setIsAccountNumberCopying(false);
        setIsCopied(true)
    }

    if(loadingError.status) return <DataLoadingError message={loadingError.message} />
    return (
        <div className={styles.customer_details}>
            <div className={styles.heading}>
                <div className={styles.container_label}>Customer</div>
            </div>
            
            <div className={styles.fullname}>{ customerInfo?.fullname }</div>

            <SizedBox height={20} />
            {
                transactionState.details.txnType === 'BUY'
                ?   <div className={styles.wallet_details}>
                        <div className={styles.heading}>
                            <div className={styles.title}>Wallet Address</div>
                            <div className={styles.copy_capsule} onClick={()=> copyWalletAddress()}>
                            {
                                isAccountCopying
                                ?  <ComponentLoader />
                                :   isCopied
                                    ?   <FaCheckCircle />
                                    :   <IconCopyFile className={styles.copy_icon} />
                            }
                                <div className={styles.text}>{isCopied ?"Copied" :"Copy"}</div>
                            </div>
                        </div>
                        <div className={styles.address}>{transactionState.details.walletAddress}</div>
                    </div>

                :   <div className={styles.bank_details}>
                        <div className={styles.title}>Bank Details</div>
                        <div className={styles.section}>
                            <div className={styles.label}>Account name</div>
                            <div className={styles.content_details}>{ customerInfo?.bank?.accountName }</div>
                        </div>
                        <div className={styles.section}>
                            <div className={styles.label}>Bank name</div>
                            <div className={styles.content_details}>{ customerInfo?.bank?.name }</div>
                        </div>
                        <div className={styles.section}>
                            <div className={styles.label}>Account number</div>
                            <div className={styles.content_details}>{ customerInfo?.bank?.accountNumber }</div>
                        </div>
                    </div>
            }
        </div>
    );
}