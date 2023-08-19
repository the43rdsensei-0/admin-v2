import styles from "./transactiondetails.module.css";
import { Suspense, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUserStateValue } from "src/features/user/atom";
import AssetImage from "../../../../components/AssetImage";
import PrimaryTextButton from "../../../../components/Buttons/PrimaryTextButton";
import Capsule from "../../../../components/Capsule";
import Card from "../../../../components/Cards/card";
import DataLoadingError from "../../../../components/DataLoadingError";
import FormContainer from "../../../../components/Form/FormContainer";
import InputField from "../../../../components/Form/InputField/inputfield";
import { formFieldProps, setFormFieldProps } from "../../../../components/Form/types";
import DashboardHeader from "../../../../components/Headers/Dashboard/dashboardheader";
import ComponentLoader from "../../../../components/Loaders/ComponentLoader";
import ViewImageGallery from "../../../../components/ViewImageGalery";
import { transactionInitState, useTransactionState } from "../../../../features/transactions/atom";
import convertCurrency from "../../../../utils/currencyConverter";
import formatDate from "../../../../utils/formatDate";
import formatTime from "src/utils/formatTime";
import TransactionUserInfo from "../components/TransactionUserInfo";
import formatTransaction, { transactionDetailsType } from "src/features/transactions/utils/formatTransaction";
import DeleteTextButton from "src/components/Buttons/DeleteTextButton";
import TextField from "src/components/Form/TextField";
import TransactionAttendantInfo from "../components/TransactionAttendantInfo";
import AmountToPayCard from "src/components/Cards/AmountToPayCard/AmountToPayCard";
import CircularRingLoader from "src/components/Loaders/CircularRingLoader";
import FormStateModal from "src/components/Modal/FormStateModal";
import socketConnection from "src/lib/socketConn"
import JSONToFormData from "src/utils/JSONToFormData";
import { rejectTransactionAction, reviewTransactionAction } from "src/features/transactions/actions";
import TransactionNoteCard from "./TransactionNoteCard";
import TransactionAttendantList from "../components/TransactionAttendantList";

export default function TransactionDetails() {

    const userState = useUserStateValue()

    const [transactionState, setTransactionState] = useTransactionState();
    const [rejectTransactionState, setRejectTransactionState] = useState(transactionState);

    const { transactionId } = useParams();
    const [loadingError, setLoadingError] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(()=> {
        socketConnection.emit(`fetch_transaction`, {transactionId: transactionId, userId: userState.userData.id})
        .on('transaction_details', (response:any)=> {
            if(response.data?.transaction) {
                formatTransaction(response.data?.transaction, userState.userData.role)
                .then((formattedTransaction:transactionDetailsType)=> {
                    setTransactionState(state => {
                        return {
                            ...state,
                            details: formattedTransaction
                        }
                    })
                    
                    setLoadingError(false)
                    setIsLoading(false)
                    setRejectTransactionState(state=> {
                        return {
                            ...state,
                            status:'idle',
                            error:false,
                            message:''
                        }
                    })
                }).catch((error)=> {
                    console.log('Error formatting transaction details', error)
                })
            } else {
                console.log('FAILEDED')
            }
        })

        return ()=> {
            setTransactionState(state => {
                return {
                    ...state,
                    details: transactionInitState.details
                }
            })
            
            socketConnection.emit('leave_transaction_room', { transactionId, userId: userState.userData.id })
        }
    }, [transactionId, userState.userData.role, userState.userData.id, setTransactionState])

    const [confirmedRateModel, setconfirmedRateModel] = useState<formFieldProps>({
        type:'number',
        name:'confirmed-rate',
        label:'Confirmed rate',
        value: transactionState.details.rate.confirmed,
        error:'',
        validated: false
    })

    const [amountReceivedModel, setAmountReceivedModel] = useState<formFieldProps>({
        type:'number',
        name:'amount-received',
        label:'Amount received',
        value: transactionState.details.txnType === 'BUY'
        ?   transactionState.details.amountSent.inNaira : transactionState.details.amountSent.inDollar,
        error:'',
        validated: false
    });
    
    const [amountToPayModel, setAmountToPayModel] = useState<formFieldProps>({
        type:'number',
        label:'Amount to pay',
        value: transactionState.details.txnType ==='BUY' ?transactionState.details.amountSent.inDollar :transactionState.details.amountSent.inNaira,
        error:'',
        validated: false
    });

    const [noteToCustomerModel, setNoteToCustomerModel] = useState<formFieldProps>({
        type:'text',
        name:'note-to-customer',
        label:'Note to customer',
        hint: "eg. the attached image is unclear and blurry, please create a new transaction with better image",
        defaultValue: transactionState.details?.note?.message || '',
        error:'',
        validated: false
    });

    const setNoteAttachmentImages =(attachmentImages:[])=> {
        noteToCustomerModel.images = attachmentImages;
        setNoteToCustomerModel(noteToCustomerModel)
    }

    const setInput = (inputVal:string, model:formFieldProps, setModel:setFormFieldProps)=> {
        model.value = inputVal;
        validateModel(model);
        setModel({...model})

        if(model.name === 'confirmed-rate') {         
            setTransactionState(state => {
                return {
                    ...state,
                    details: {
                        ...state.details,
                        rate: {
                            sent: state.details.rate.sent,
                            confirmed: parseFloat(confirmedRateModel.value?.toString()!)
                        }
                    }
                }
            })
            
            const amountToUse = (amountReceivedModel.validated) ?amountReceivedModel.value :transactionState.details.amountSent.inDollar
            calculateAmountToPay(model.value, amountToUse!)
        }

        if(model.name === 'amount-received') {
            const rateToUse = (confirmedRateModel.validated) ?transactionState.details.rate.confirmed : transactionState.details.rate.sent
            calculateAmountToPay(rateToUse, model.value!)
        }

        if(model.name === "note-to-customer") {
            if(model.validated) setNoteEmpty(false);
            else setNoteEmpty(true);
        }

        enableButton();
    }
    
    const validateModel = (updatedModel:formFieldProps)=> {
        if(!updatedModel.value) {
            updatedModel.error = 'Field cannot be empty';
            updatedModel.validated = false;
            return false;
        }

        updatedModel.error = '';
        updatedModel.validated = true;
        return true;
    }

    const enableButton = ()=> {
        if(validateForm()) setFormIsValidated(true)
        else setFormIsValidated(false); 
    }

    const calculateAmountToPay =(confirmedRate:number|string, amountConfirmed:string|number)=> {
        let amountToPayResult = 0;
        if(transactionState.details.txnType === 'BUY') {
            amountToPayResult = parseFloat(amountConfirmed?.toString()!) / parseFloat(confirmedRate.toString());
        } else {
            amountToPayResult = parseFloat(amountConfirmed?.toString()!) * parseFloat(confirmedRate.toString());
        }


        amountToPayModel.value = amountToPayResult;
        amountToPayModel.validated = true;
        setAmountToPayModel({...amountToPayModel})
    }

    const [isFormValidated, setFormIsValidated] = useState(false);
    const validateForm = ()=> {
        if(!amountReceivedModel.validated) return false;
        if(!amountToPayModel.validated) return false;
        
        return true;
    }

    const [noteEmpty, setNoteEmpty] = useState(true);

    const reviewTransaction = ()=> {    
        if(validateForm()) {
            const payload = {
                confirmedRate: parseFloat(confirmedRateModel.value?.toString()!) || parseFloat(transactionState.details.rate.sent.toString()),
                amountReceived: parseFloat(amountReceivedModel.value?.toString()!),
                amountToPay: parseFloat(amountToPayModel.value?.toString()!),
                noteMessage: noteToCustomerModel.value || ''
            }

            console.log(payload)

            setTransactionState(state => {
                return {
                    ...state,
                    status:'loading',
                    error:false,
                    message:''
                }
            })

            reviewTransactionAction(transactionState.details.id, payload)
            .then((responseData:any)=> {
                setTransactionState(state => {
                    return {
                        ...state,
                        status:'succeeded',
                        error:false,
                        message:'Transaction reviewed successfully',
                    }
                })
            })
            .catch((error)=> {
                setTransactionState(state => {
                    return {
                        ...state,
                        status:'failed',
                        error:true,
                        message:'There was an error reviewing transaction',
                    }
                })
            })
            .finally(()=> {
                setTimeout(()=> {
                    setTransactionState(state => {
                        return {
                            ...state,
                            status:'idle',
                            error: false,
                            message:''
                        }
                    })
                }, 3000)
            })
            

            // socketConnection.emit(`review_transaction`, {transactionId, ...payload, user: userState.userData.id})
            // .on('review_transaction', (response)=> {
            //     setTransactionState(state => {
            //         return {
            //             ...state,
            //             status:'succeeded',
            //             error:false,
            //             message:'Transaction reviewed successfully',
            //         }
            //     })

            //     setTimeout(()=> {
            //         setTransactionState(state => {
            //             return {
            //                 ...state,
            //                 status:'idle',
            //                 error: false,
            //                 message:''
            //             }
            //         })
            //     }, 3000)
            // })
        }
    }

    const rejectReviewed = ()=> {
        setRejectTransactionState(state => {
            return {
                ...state,
                error: false,
                message: '',
                status:'loading'
            }
        })

        socketConnection.emit(`reject_reviewed_transaction`, {transactionId, userId: userState.userData.id})
        .on('reject_reviewed_transaction', (response)=> {
            setTransactionState(state => {
                return {
                    ...state,
                    status:'succeeded',
                    error:false,
                    message:'Transaction review rejected successfully',
                }
            })
        })

        setTimeout(()=> {
            setTransactionState(state => {
                return {
                    ...state,
                    status:'idle',
                    error: false,
                    message:''
                }
            })
        }, 3000)
    }

    const completeTransaction = ()=> {
        if(transactionState.details?.reviewed) {
            setTransactionState(state => {
                return {
                    ...state,
                    status:'loading',
                    error:false,
                    message:''
                }
            })
            
            socketConnection.emit(`complete_transaction`, {transactionId, userId: userState.userData.id})
            .on('complete_transaction', ()=> {
                setTransactionState(state => {
                    return {
                        ...state,
                        status:'succeeded',
                        error:false,
                        message:'Transaction paid out and completed successfully',
                    }
                })

                setTimeout(()=> {
                    setTransactionState(state => {
                        return {
                            ...state,
                            status:'idle',
                            error: false,
                            message:''
                        }
                    })
                }, 3000)
            })
        }
    }

    const rejectTransaction = ()=> {
        if(!noteEmpty) {
            const payload = {
                noteMessage: noteToCustomerModel.value,
                noteImages: noteToCustomerModel.images
            }

            JSONToFormData(payload)
            .then((formData)=> {
                rejectTransactionAction(transactionState.details.id, formData)
                .then((response:any)=> {
                    setRejectTransactionState(state => {
                        return {
                            ...state,
                            status: 'succeeded',
                            error: false,
                            message: 'Transaction review rejected successfully',
                        }
                    })

                    setTransactionState(state => {
                        return {
                            ...state,
                            status:'succeeded',
                            error:false,
                            message:'Transaction rejected successfully'
                        }
                    })
                })
                .catch((error:any)=> {
                    setRejectTransactionState(state => {
                        return {
                            ...state,
                            status: 'failed',
                            error: true,
                            message: "There was an error rejecting transaction, try again. If issue persists, contact support.",
                        }
                    })
                })
                .finally(()=> {
                    setTimeout(()=> {
                        setRejectTransactionState(state => {
                            return {
                                ...state,
                                status: 'idle',
                                error: false,
                                message:''
                            }
                        })
                    }, 3000)
                })
            })
            .catch((error)=> {

            })

            // socketConnection.emit(`reject_transaction`, {transactionId, ...payload, user: userState.userData.id})
            // .on('reject_transaction', (response)=> {
                    
            //     setRejectTransactionState(state => {
            //         return {
            //             ...state,
            //             status: 'succeeded'
            //         }
            //     })

            //     setTransactionState(state => {
            //         return {
            //             ...state,
            //             status:'succeeded',
            //             error:false,
            //             message:'Transaction rejected successfully',
                        
            //         }
            //     })

            //     setTimeout(()=> {
            //         setTransactionState(state => {
            //             return {
            //                 ...state,
            //                 status: 'idle',
            //                 error: false,
            //                 message: '',
            //             }
            //         })
            //     }, 3000)
            
            // })
        }
    }


    return (
        <div className={styles.transaction_details_container}>

            <FormStateModal state={transactionState} setState={setTransactionState} />

            <DashboardHeader goBackPath="/dashboard/transactions" />

            { 
                isLoading
                ?   <div className={styles.loader_container}>
                        <CircularRingLoader color={"var(--loader-orange-color)"} size={50} />
                    </div>
                :   (loadingError)
                    ?   <DataLoadingError message={"Error loading data"} />
                        
                    :   <div className={styles.content_wrapper}>

                            { Capsule(transactionState.details?.status || '', { height: "50px" }) }
                                
                            <div className={styles.content}>
                                <div className={styles.page_title}>Transaction details</div>
                                    
                                {/* Transaction ID */}
                                <div className={styles.content_section}>
                                    <div className={styles.label}>Transaction ID</div>
                                    <div className={`${styles.content_details} ${styles.txn_id}`}>#{ transactionState.details?.id }</div>
                                </div>

                                {/* Asset Name */}
                                <div className={styles.content_section}>
                                    <div className={styles.label}>Asset</div>
                                    <div className={`${styles.content_details} ${styles.asset_info}`}>
                                        { AssetImage(transactionState.details?.assetImageURL, 40) }
                                        <div className={styles.text}>
                                            <div className={styles.name}>{ transactionState.details?.assetCategory }</div>
                                            <div className={styles.subcategory}>{ transactionState.details?.assetSubcategory }</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Transaction Date */}
                                <div className={styles.content_section}>
                                    <div className={styles.label}>Issued date</div>
                                    <div className={styles.content_details}>
                                        <div className={styles.txn_date}>{formatDate(transactionState.details?.date)}</div>
                                        <div className={styles.time}>{formatTime(transactionState.details?.date)}</div>
                                    </div>
                                </div>
                                    
                                {/* Amount sent by customer */}
                                {
                                    transactionState.details?.reviewed
                                    ?   <div className={styles.amount_group}>
                                            <div className={styles.content_section}>
                                                <div className={styles.label}>Amount sent</div>
                                                <div className={styles.content_details}>
                                                    <div className={styles.amount_sent}>
                                                        { 
                                                            transactionState.details?.txnType === 'BUY'
                                                            ?   convertCurrency(transactionState.details?.amountSent?.inNaira || 0, '₦', 2) 
                                                            :   convertCurrency(transactionState.details?.amountSent?.inDollar || 0, '$', 2) 
                                                        }
                                                    </div>
                                                    {
                                                        transactionState.details?.txnName === 'cryptocurrency'
                                                        ?   <div className={styles.rate}>rate: { convertCurrency(transactionState.details?.rate.sent || 0, '₦', 2) }/$</div>
                                                        :   <div className={styles.rate}>
                                                                <div>Sent rate: { convertCurrency(transactionState.details?.rate.sent || 0, '₦', 2) }/$</div>
                                                            </div>

                                                    }
                                                </div>
                                            </div>

                                            <div className={styles.content_section}>
                                                <div className={styles.label}>Amount confirmed</div>
                                                <div className={`${styles.content_details}`}>
                                                    <div className={styles.amount_sent}>
                                                        {   
                                                            convertCurrency(
                                                                transactionState.details?.amountReceived || 0,
                                                                transactionState.details?.txnType === 'BUY' ? '₦' :'$', 
                                                                2
                                                            ) 
                                                        }
                                                    </div>
                                                    <div className={styles.rate}>
                                                        <div>Confirmed rate: { convertCurrency(transactionState.details?.rate.confirmed || 0, '₦', 2) }/$</div>
                                                    </div>
                                                </div>
                                            </div>  
                                        </div>
                                        
                                    :   transactionState.details?.txnName === 'cryptocurrency'
                                        ?   <div className={styles.amount_group}>
                                                {   
                                                    transactionState.details?.txnType === 'BUY'
                                                    ?   <div className={styles.content_section}>
                                                            <div className={styles.label}>In Naira</div>
                                                            <div className={styles.content_details}>
                                                                <div className={styles.amount_sent}>{ convertCurrency(transactionState.details?.amountSent?.inNaira || 0, '₦', 2) }</div>
                                                                <div className={styles.rate}>rate: { convertCurrency(transactionState.details?.rate.sent || 0, '₦', 2) }/$</div>
                                                            </div>
                                                        </div>
                                                    :   <div className={styles.content_section}>
                                                            <div className={styles.label}>Value in { transactionState.details?.assetCategory }</div>
                                                            <div className={styles.content_details}>
                                                                <div className={styles.amount_sent_in_crypto}>{ transactionState.details?.amountSent?.inCrypto }</div>
                                                                <div className={styles.rate}>rate: { convertCurrency(transactionState.details?.rate.sent || 0, '₦', 2) }/$</div>
                                                            </div>
                                                        </div>
                                                }
                                                <div className={styles.content_section}>
                                                    <div className={styles.label}>In Dollar</div>
                                                    <div className={styles.content_details}>
                                                        <div className={styles.amount_sent}>{ convertCurrency(transactionState.details?.amountSent?.inDollar || 0, '$', 2) }</div>
                                                    </div>
                                                </div>
                                            </div>
                                        :   <div>
                                                <div className={styles.content_section}>
                                                    <div className={styles.label}>Value</div>
                                                    <div className={styles.content_details}>
                                                        <div className={styles.amount_sent}>{ convertCurrency(transactionState.details?.amountSent?.inDollar || 0, '$', 2) }</div>
                                                        <div className={styles.rate}>rate: { convertCurrency(transactionState.details?.rate.sent || 0, '₦', 2) }/$</div>
                                                    </div>
                                                </div>
                                            </div>
                                }

                                {/* Bank account sent to for buy crypto */}
                                {
                                    transactionState.details.txnType === 'BUY'
                                    ?   <div className={styles.content_section}>
                                            <div className={styles.label}>Account used</div>
                                            <div className={styles.bank_card}>
                                                <div className={styles.name}>{transactionState.details.bankUsed?.name}</div>
                                                <div className={styles.account_number_capsule}>{transactionState.details.bankUsed?.number}</div>
                                            </div>
                                        </div>
                                    :   null
                                }
                                    
                                {/* Images */}
                                <div className={styles.content_section}>
                                    <div className={styles.label}>Uploads</div>
                                    <ViewImageGallery images={transactionState.details?.images} />
                                </div>


                                {
                                    (transactionState.details.attendants.includes(userState.userData.id) || ['admin_org', 'admin_ops', 'admin_acct'].includes(userState.userData.role))
                                    ?   transactionState.details.reviewed
                                        ?   <div className={styles.buttons}> 
                                                {
                                                    transactionState.details.paidout
                                                    ?   null
                                                    :   <div className={styles.post_review_buttons}>
                                                            {
                                                                ['admin_org', 'admin_ops', 'admin_acct'].includes(userState.userData.role)
                                                                ?   <PrimaryTextButton
                                                                        label="Complete payout"
                                                                        isLoading={transactionState.status === 'loading'}
                                                                        action={()=> completeTransaction()}
                                                                    />
                                                                :   null
                                                            }

                                                            <DeleteTextButton
                                                                label="Reject review"
                                                                isLoading={rejectTransactionState.status === 'loading'}
                                                                action={()=> rejectReviewed()}
                                                            />
                                                        </div>
                                                }
                                            </div>
                                            
                                        :   ['admin_org', 'admin_ops', 'admin_csa_crypto', 'admin_csa_card'].includes(userState.userData.role)
                                            ?   <FormContainer extraStyle={styles.transaction_details}> 
                                                    {
                                                        transactionState.details.txnName === "giftcard"
                                                        ?   <InputField
                                                                type={confirmedRateModel.type}
                                                                label={confirmedRateModel.label}
                                                                prefixIcon={"N"}
                                                                value={transactionState.details.rate.confirmed || confirmedRateModel.value}
                                                                error={confirmedRateModel.error}
                                                                onInput={(inputVal:string)=> setInput(inputVal, confirmedRateModel, setconfirmedRateModel)}
                                                            />
                                                        :   <div></div>
                                                    }
                                                    
                                                    <InputField 
                                                        type={amountReceivedModel.type}
                                                        label={amountReceivedModel.label}
                                                        prefixIcon={transactionState.details.txnType === 'BUY' ?"₦" :"$"}
                                                        value={
                                                            transactionState.details.txnType === 'BUY'
                                                            ?   transactionState.details.amountSent.inNaira
                                                            :   amountReceivedModel.value || transactionState.details.amountSent.inDollar.toFixed(2)
                                                        }
                                                        error={amountReceivedModel.error}
                                                        onInput={(inputVal:string)=> setInput(inputVal, amountReceivedModel, setAmountReceivedModel)}
                                                    />  
                                                    
                                                    <AmountToPayCard 
                                                        currency={transactionState.details.txnType === 'BUY' ?"$" :"₦"}
                                                        amount={
                                                            transactionState.details.txnType === 'BUY'
                                                            ?   parseFloat(amountToPayModel.value?.toString()!) ||transactionState.details.amountSent.inDollar
                                                            :   parseFloat(amountToPayModel.value?.toString()!) ||transactionState.details.amountSent.inNaira
                                                        }
                                                    />

                                                    <PrimaryTextButton
                                                        label="Complete review"
                                                        isLoading={transactionState.status === 'loading'}
                                                        disabled={!isFormValidated}
                                                        action={()=> reviewTransaction()}
                                                    />

                                                    <DeleteTextButton 
                                                        label="Reject transaction"
                                                        isLoading={rejectTransactionState.status === 'loading'}
                                                        disabled={noteEmpty}
                                                        action={()=> rejectTransaction()}
                                                    />
                                                    
                                                    <TextField 
                                                        label={noteToCustomerModel.label}
                                                        hint={noteToCustomerModel.hint}
                                                        defaultValue={noteToCustomerModel.defaultValue?.toString()! || transactionState.details?.note?.message}
                                                        onInput={(textValue:string)=> setInput(textValue, noteToCustomerModel, setNoteToCustomerModel)}
                                                        onAttach={(attachmentImages:[])=> setNoteAttachmentImages(attachmentImages)}
                                                        allowAttachments={true}
                                                    />
                                        
                                                </FormContainer>
                                            :   null
                                    :   transactionState.details?.note?.message && transactionState.details.customerAttendant !== userState.userData.id
                                        ?   <TransactionNoteCard 
                                                message={transactionState.details.note.message}
                                                images={transactionState.details.note.images}
                                            />
                                        :   null
                                }

                                <div className={styles.people_section}>
                                    <Card extraStyle={styles.attendant_details_card}>
                                        <Suspense fallback={<ComponentLoader />}>
                                            {
                                                transactionState.details.reassigned || transactionState.details.deferred.status
                                                ?   <TransactionAttendantList transactionId={transactionId!} />
                                                :   <TransactionAttendantInfo 
                                                        transactionId={transactionState.details?.id}
                                                        attendantId={transactionState.details?.customerAttendant} 
                                                    />
                                            }
                                        </Suspense>
                                    </Card>

                                    <Card 
                                        extraStyle={`
                                            ${styles.customer_details_card}
                                            ${transactionState.details?.reviewed ?styles.include_amount_to_pay :null}
                                        `}
                                    >
                                        <Suspense fallback={<ComponentLoader />}>
                                            <TransactionUserInfo 
                                                userId={transactionState.details?.user}
                                            />

                                            
                                            {
                                                transactionState.details.reviewed
                                                ?   <div className={styles.amount_to_pay}>
                                                        <div className={styles.label}>
                                                            { 
                                                                transactionState.details.paidout
                                                                ?   "Amount paid"
                                                                :   "Amount to pay"
                                                            }
                                                        </div>
                                                        <div className={styles.value}>
                                                            { convertCurrency(transactionState.details?.amountToPay||0, '₦', 2) }  
                                                        </div>
                                                    </div>
                                                :   null
                                            }
                                        </Suspense>
                                    </Card>
                                </div>
                            </div>
                        </div>
                }
        </div>
    )
}
