import { Suspense, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RestoreTextButton from "src/components/Buttons/RestoreTextButton";
import DataLoadingError from "src/components/DataLoadingError";
import DashboardHeader from "src/components/Headers/Dashboard/dashboardheader";
import ComponentLoader from "src/components/Loaders/ComponentLoader";
import FormStateModal from "src/components/Modal/FormStateModal";
import UserProfileImage from "src/components/User/UserProfileImage";
import { toggleAccountActivationAction } from "src/features/customers/actions";
import { useCustomerStateValue } from "src/features/customers/atom";
import DeleteTextButton from "../../../../components/Buttons/DeleteTextButton";
import PrimaryTextButton from "../../../../components/Buttons/PrimaryTextButton";
import FormContainer from "../../../../components/Form/FormContainer";
import InputField from "../../../../components/Form/InputField/inputfield";
import PhoneInputField from "../../../../components/Form/PhoneInputField/phoneinputfield";
import SizedBox from "../../../../components/SizedBox";
import TextHeading from "../../../../components/TextHeading";
import { useCustomerDetailsValue } from "../../../../features/customers/selectors";
import Capitalize from "../../../../utils/capitalize";
import CustomerTransactionsList from "../components/CustomerTransactionsList";
import ActiveStatus from "./ActiveStatus";
import styles from "./customerdetails.module.css";

export default function CustomerDetails() {

    const customerState = useCustomerStateValue();
    const [activationState, setActivationState] = useState(customerState);

    const params = useParams();
    const customerDetailsResponse = useCustomerDetailsValue(params.customerId!);

    const [loadingError, setLoadingError] = useState({
        status: false,
        message: ""
    })
    const [customerDetails, setCustomerDetails] = useState<any>({
        _id:'',
        fullname:'',
        email: '',
        phoneNumber: '',
        active:false,
        bank: {
            name: '',
            accountName: '',
            accountNumber: ''
        },
        profileImageURL: ''
    })

    useEffect(()=> {
        if(customerDetailsResponse?.code === 200) {
            setCustomerDetails(customerDetailsResponse.customer)
            setLoadingError({
                status: false,
                message: ""
            })
        } else {
            setLoadingError({
                status: true,
                message: "Error fetching customer, contact support."
            })
        }

    }, [customerDetailsResponse])

    const toggleAcctActivation = ()=> {
        const payload = {
            active: !customerDetails.active
        }

        setActivationState(state => {
            return {
                ...state,
                status: 'loading',
                error: false,
                message: ''
            }
        })

        toggleAccountActivationAction(customerDetails._id, payload)
        .then((response:any)=> {
            setActivationState(state => {
                return {
                    ...state,
                    status: 'succeeded',
                    error: false,
                    message: "Customer's account deactivated successfully."
                }
            })
        
            setCustomerDetails(()=> {
                return {
                    _id: response?.customer?._id,
                    fullname: response?.customer?.fullname,
                    email: response?.customer?.email,
                    phoneNumber: response?.customer?.phoneNumber,
                    active: response?.customer?.active,
                    bank: {
                        ...response.customer.bank
                    }
                }
            });

        })
        .catch(()=> {
            setActivationState(state => {
                return {
                    ...state,
                    status: 'failed',
                    error: true,
                    message: "There was an error deactivating customer's account."
                }
            })
        })
    }
    
    return (
        <div className={styles.customer_details_container}>

            <DashboardHeader 
                goBackPath="/dashboard/customers"
            />

            {
                loadingError.status
                ?   <DataLoadingError message={loadingError.message} />
                :   <div>
                        <div className={styles.customer_details_wrapper}>
                            <TextHeading heading="Customer profile information" />
                            
                            <SizedBox height={50} />
                            <ActiveStatus status={customerDetails?.active} />

                            <FormContainer formHeading="" extraStyle={styles.customer_profile_form}>

                                <FormStateModal 
                                    state={activationState}
                                    setState={setActivationState}
                                />

                                { UserProfileImage(customerDetails?.profileImageURL, customerDetails?.fullname, 120, 60) }

                                <InputField
                                    type="string"
                                    label="Full name"
                                    value={Capitalize(customerDetails?.fullname)}
                                    readOnly={true} 
                                    onInput={()=> {}}
                                />
                                <InputField
                                    type="string"
                                    label="Email address"
                                    value={customerDetails?.email}
                                    readOnly={true} 
                                    onInput={()=> {}}
                                />
                                <PhoneInputField
                                    value={customerDetails?.phoneNumber}
                                    disabled={true} 
                                    disableOTP={true}
                                    onInput={()=> {}}
                                />
                                
                                <SizedBox height={40} />
                                
                                <TextHeading heading={"Saved Banks"} />

                                <InputField
                                    type="string"
                                    label="Account name"
                                    value={customerDetails?.bank?.accountName}
                                    readOnly={true} 
                                    onInput={()=> {}}
                                />
                                <InputField
                                    type="string"
                                    label="Account number"
                                    value={customerDetails?.bank?.accountNumber}
                                    readOnly={true} 
                                    onInput={()=> {}}
                                />
                                <InputField
                                    type="string"
                                    label="Bank name"
                                    value={customerDetails?.bank?.name}
                                    readOnly={true} 
                                    onInput={()=> {}}
                                />

                                <div className={styles.twin_buttons}>
                                    {
                                        customerDetails?.active
                                        ?   <DeleteTextButton
                                                label={"Deactivate"}
                                                isLoading={activationState.status === 'loading'}
                                                action={() => toggleAcctActivation() } 
                                            />
                                        :   <RestoreTextButton 
                                                label={"Activate"}
                                                isLoading={activationState.status === 'loading'}
                                                action={() => toggleAcctActivation() } 
                                            />
                                    }


                                    <PrimaryTextButton
                                        label={"Update"}
                                        disabled={true}
                                        action={() => { } } 
                                    />
                                </div>

                            </FormContainer>
                        </div>

                        <SizedBox height={50} />

                        <div className={styles.customer_details_wrapper}>
                            <TextHeading heading="Transactions" />
                            <Suspense fallback={<ComponentLoader />}>
                                <CustomerTransactionsList />
                            </Suspense>
                        </div>
                    </div>
            }
        </div>
    )
}