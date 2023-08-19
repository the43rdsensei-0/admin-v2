import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DeleteTextButton from "src/components/Buttons/DeleteTextButton";
import PrimaryTextButton from "src/components/Buttons/PrimaryTextButton";
import Capsule from "src/components/Capsule";
import DashboardHeader from "src/components/Headers/Dashboard/dashboardheader";
import ImageFrame from "src/components/ImageFrame";
import FormStateModal from "src/components/Modal/FormStateModal";
import { approveVerificationAction, fetchIdentityAction, rejectVerificationAction } from "src/features/identity/actions";
import { useIdentityState } from "src/features/identity/atom";
import styles from "./verificationdetails.module.css";

export default function VerificationDetails() {

    const { identityId } = useParams();
    const [identityState, setidentityState] = useIdentityState();
    const [rejectVerificationState, setRejectVerificationState] = useState(identityState);
    const [approveVerificationState, setApproveVerificationState] = useState(identityState);

    useEffect(()=> {
        fetchIdentityAction(identityId!)
        .then((response:any)=> {
            if(response.code === 200) {
                setidentityState(state => {
                    return {
                        ...state,
                        verificationDetails: response.data.identity
                    }
                })
            }
        })
        .catch((error)=> {
            console.log(error)
        })
        
    }, [identityId, setidentityState])

    const rejectVerification =()=> {
        setRejectVerificationState(state => {
            return {
                ...state,
                status: 'loading'
            }
        })

        rejectVerificationAction(identityId!)
        .then((response:any)=> {
            setRejectVerificationState(state => {
                return {
                    ...state,
                    status: 'succeeded',
                    error: false,
                    message: 'Identity verification rejected successfully',
                }
            })

            setidentityState(state => {
                return {
                    ...state,
                    status: 'idle',
                    error: false,
                    message: '',
                    verificationDetails: response.data.identity
                }
            })
        })
        .catch((error)=> {
            setRejectVerificationState(state => {
                return {
                    ...state,
                    status: 'failed',
                    error: true,
                    message:'There was an error rejecting identity verification'
                }
            })
        })
    }

    const approveVerification =()=> {
        setApproveVerificationState(state => {
            return {
                ...state,
                status: 'loading'
            }
        })

        approveVerificationAction(identityId!)
        .then((response:any)=> {
            setApproveVerificationState(state => {
                return {
                    ...state,
                    status: 'succeeded',
                    error: false,
                    message: 'Identity verification approved successfully',
                }
            })

            setidentityState(state => {
                return {
                    ...state,
                    status: 'idle',
                    error: false,
                    message: '',
                    verificationDetails: response.data.identity
                }
            })
        })
        .catch((error)=> {
            setApproveVerificationState(state => {
                return {
                    ...state,
                    status: 'failed',
                    error: true,
                    message:'There was an error rejecting identity verification'
                }
            })
        })
    }

    return(
        <div className={styles.verification_details}>

            <FormStateModal 
                state={rejectVerificationState}
                setState={setRejectVerificationState}
            />

            <FormStateModal 
                state={approveVerificationState}
                setState={setApproveVerificationState}
            />


            <DashboardHeader 
                goBackPath={"/dashboard/verifications"}
            />

            <div className={styles.content}>
                <div className={styles.personal_info_wrapper}>
                    <div className={styles.bvn}>
                        <div className={styles.bvn_content}>
                            <div className={styles.label}>Bank Verification Number</div>
                            <div className={styles.digit}>{identityState.verificationDetails?.bvn.value}</div>
                        </div>

                        <div className={styles.verified_capsule}>
                            { Capsule(identityState.verificationDetails?.status || '') }
                        </div>
                    </div>
                </div>
                
                <div className={styles.images}>
                    <div className={styles.image_wrapper}>
                        <div className={styles.label}>Image on BVN</div>
                        <ImageFrame
                            id="bvn"
                            url={identityState.verificationDetails?.bvn.imageURL}
                            placeholder={identityState.verificationDetails?.bvn.imageURL}
                        />
                    </div>
                    <div className={styles.image_wrapper}>
                        <div className={styles.label}>Selfie Image</div>
                        <ImageFrame
                            id="selfie"
                            url={identityState.verificationDetails?.faceId.image.url}
                            placeholder={identityState.verificationDetails?.faceId.image.placeholder}
                        />
                    </div>
                    <div className={styles.image_wrapper}>
                        <div className={styles.label}>Uploaded ID ({identityState.verificationDetails?.govId.category})</div>
                        <ImageFrame
                            id="govid"
                            url={identityState.verificationDetails?.govId.image.url}
                            placeholder={identityState.verificationDetails?.govId.image.placeholder}
                        />
                    </div>
                </div>

                <div className={styles.buttons}>
                    <DeleteTextButton
                        label="Reject Verification"
                        isLoading={rejectVerificationState.status === 'loading'}
                        action={()=> rejectVerification()}
                    />

                    <PrimaryTextButton 
                        label={"Approve Verification"} 
                        isLoading={approveVerificationState.status === 'loading'}
                        action={()=> approveVerification()}
                    />
                </div>
            </div>
        </div>
    )
}