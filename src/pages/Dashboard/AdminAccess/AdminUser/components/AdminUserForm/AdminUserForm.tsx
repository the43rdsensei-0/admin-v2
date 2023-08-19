import styles from "./adminuserform.module.css";
import { useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import PrimaryTextButton from "src/components/Buttons/PrimaryTextButton";
import DropDownField from "src/components/Form/DropDownField/dropdownfield";
import { DropDownFormData, setDropDownFormData } from "src/components/Form/DropDownField/types";
import FormContainer from "src/components/Form/FormContainer";
import InputField from "src/components/Form/InputField/inputfield";
import PasswordField from "src/components/Form/PasswordField";
import { formFieldProps, setFormFieldProps } from "src/components/Form/types";
import CircularRingLoader from "src/components/Loaders/CircularRingLoader";
import IconCamera from "src/assets/icons/icon-camera.png";
import SizedBox from "src/components/SizedBox";
import ImageUploaderWrapper from "src/components/Upload/ImageUploaderWrapper";
import { emailExists, emailValid } from "src/utils/emailValidation";
import { containsDigit, containsLowerCaseLetter, containsUpperCaseLetter, is8CharLong } from "src/utils/passwordValidation";
import JSONToFormData from "src/utils/JSONToFormData";
import UserProfileImage from "src/components/User/UserProfileImage";
import RestoreTextButton from "src/components/Buttons/RestoreTextButton";
import DeleteTextButton from "src/components/Buttons/DeleteTextButton";

export default function AdminUserForm({ 
    userDetails, 
    submitting,
    updating,
    changingActivation,
    updateUserAction,
    toggleActivationAction,
    formAction 
}: {    
    userDetails?:{
        profileImageURL:string,
        fullname:string,
        phoneNumber:string,
        role:string,
        email:string,
        active:boolean
    }, 
    submitting?:boolean, 
    updating?:boolean,
    changingActivation?: boolean,
    updateUserAction?:Function,
    toggleActivationAction?:Function,
    formAction?:Function  
}) {

    const [userImage, setUserImage] = useState<formFieldProps>({
        label:'Profile picture',
        image: {
            default: userDetails?.profileImageURL!
        },
        error:'',
        validated: false
    })

    const [fullNameModel, setFullNameModel] = useState<formFieldProps>({
        type: 'text',
        label:'Full name',
        name: 'fullname',
        hint: 'eg. firstname lastname',
        value: userDetails?.fullname,
        error:'',
        validated: false
    })

    const rolesOptions = [
        {
            id:'1',
            label:'Administrator Organization',
            value:'admin_org'
        },
        {
            id:'2',
            label:'Administrator Operations',
            value:'admin_ops'
        },
        {
            id:'3',
            label:'Accountant',
            value:'admin_acct'
        },
        {
            id:'4',
            label:'Asset Manager',
            value:'admin_asset_man'
        },
        {
            id:'5',
            label:'Marketer',
            value:'admin_mktg'
        },
        {
            id:'6',
            label:'Customer Attendant',
            value:'admin_csa'
        }
    ]

    const subRoleOptions = [
        {
            id:'1',
            label:'Cryptocurrency',
            value:'crypto'
        },
        {
            id:'2',
            label:'Giftcard',
            value:'card'
        }
    ]

    const isCustAtt = userDetails?.role.includes('admin_csa');

    const selectedRoleOption = {
        index:  rolesOptions.findIndex(role => (isCustAtt) 
                    ?  role.value === 'admin_csa' 
                    :  role.value === userDetails?.role
                ) || 0, 
        value:  (isCustAtt) ?'admin_csa' :userDetails?.role || '',
        sub: {
            index: isCustAtt ?subRoleOptions.findIndex((subRole)=> subRole.value === userDetails?.role.split('_')[2]) :0 
        }
    }

    const [roleModel, setRoleModel] = useState<DropDownFormData>({
        label:'Role',
        options: rolesOptions,
        value: rolesOptions[selectedRoleOption.index],
        selected: selectedRoleOption.value ?true :false,
        selectedOptionIndex: selectedRoleOption.index,
        error: '',
        name:'role'
    })

    const [custAttendantModel, setCustAttendantModel] = useState<DropDownFormData>({
        label:'Subcategory',
        options: subRoleOptions,
        value: subRoleOptions[selectedRoleOption.sub.index || 0],
        selected: selectedRoleOption.value ?true :false,
        selectedOptionIndex: selectedRoleOption.sub.index || 0,
        error: '',
        name:'role'
    })

    const [emailModel, setEmailModel] = useState<formFieldProps>({
        type: 'text',
        label:'Email',
        name: 'email',
        value: userDetails?.email,
        error:'',
        validated: false
    })

    const [emailValIcon, setEmailValIcon] = useState<JSX.Element>()

    const [passwordModel, setPasswordModel] = useState<formFieldProps>({
        type: 'password',
        label:'Passsword',
        name: 'password',
        error:'',
        validated: false
    })

    const setInput = (inputValue:string, model:formFieldProps, setModel:setFormFieldProps)=> {
        model.value = inputValue;
        let newModel = {...model}

        if(model.name === 'email') {
            const email = newModel?.value?.toString()!;

            if(!emailValid(email)) {
                setEmailValIcon(<FaTimesCircle style={{color: 'red'}} />)
                newModel.error = 'Please input a valid email';
                newModel.validated = false;

                setModel({...newModel})

            } else {
                setEmailValIcon(<CircularRingLoader color="red" />)

                emailExists(email)
                .then(()=> {
                    setEmailValIcon(<FaCheckCircle style={{color: 'green'}} />)

                    newModel.error = '';
                    newModel.validated = true;

                    // if(newModel.value)
                    setModel({...newModel})
                })
                .catch(()=> {
                    setEmailValIcon(<FaTimesCircle style={{color: 'red'}} />)
                    newModel.error = 'Email has already been taken';
                    newModel.validated = false;
                    setModel({...newModel})
                })
            }

        } else {
            newModel = validateModel(model)
            setModel({...newModel})
        }
        enableButton();
    }

    const validateModel = (updatedModel:formFieldProps)=> {
        if(!updatedModel.value) {
            updatedModel.error = `${updatedModel.label} field cannot be empty`;
            updatedModel.validated = false;
            return updatedModel;
        }

        if(updatedModel.name === 'fullname') {
            const fullname = updatedModel.value.toString();

            if(fullname.split(' ').length < 2) {
                updatedModel.error = 'Please provide first and last name';
                updatedModel.validated = false;
                return updatedModel
            }
            if(fullname.split(' ').length > 2) {
                updatedModel.error = 'Only provide first and last name';
                updatedModel.validated = false;
                return updatedModel
            }
            if(fullname.split(' ')[0] === '') {
                updatedModel.error = 'Please provide first and last name';
                updatedModel.validated = false;
                return updatedModel
            }
            if(fullname.split(' ')[1] === '') {
                updatedModel.error = 'Please provide first and last name';
                updatedModel.validated = false;
                return updatedModel
            }
        }

        if(updatedModel.name === 'password') {
            const password = updatedModel.value.toString()
            
            if(!is8CharLong(password)) {
                updatedModel.error = 'Must be 8 characters long';
                updatedModel.validated = false;
                return updatedModel
            }
            if(!containsDigit(password)) {
                updatedModel.error = 'Must contain a number';
                updatedModel.validated = false;
                return updatedModel;
            }
            if(!containsLowerCaseLetter(password)) {
                updatedModel.error = 'Must contain a lower case letter';
                updatedModel.validated = false;
                return updatedModel
            }
            if(!containsUpperCaseLetter(password)) {
                updatedModel.error = 'Must contain an upper case letter';
                updatedModel.validated = false;
                return updatedModel
            }
        }
        
        updatedModel.error = "";
        updatedModel.validated = true;
        return updatedModel
    }

    const selectOption = (optionIndex:number, model:DropDownFormData, setModel:setDropDownFormData)=> {
        model.selectedOptionIndex = optionIndex;
        model.value = model.options[optionIndex];
        model.selected = true;

        setModel({...model});
        enableButton()
    }

    const setImage = (selectedImage:Blob|MediaSource)=> {
        setUserImage(state => {
            return {
                ...state,
                image: {
                    ...state.image!,
                    new: selectedImage
                },
                error:'',
                validated: true
            }
        })

        enableButton()
    }

    const [isFormValidated, setIsFormValidated] = useState(false)

    const validateForm = ()=> {
        if(!fullNameModel.validated) return false;
        // if(!phoneNumberModel.validated) return false;
        if(roleModel.selected ) {
            if(roleModel.value?.value === 'admin_csa') {
                if(!custAttendantModel.selected) return false; 
            }
        } else return false;
        if(!emailModel.validated) return false;
        if(!passwordModel.validated) return false;
        
        return true;
    }

    const enableButton = ()=> {
        if(validateForm()) setIsFormValidated(true)
        else setIsFormValidated(false)
    }
    
    const generatePayload = ()=> {
        if(isFormValidated) {
            const payload = {
                profileImage: userImage.image?.new,
                fullname: fullNameModel.value,
                email: emailModel.value,
                password: passwordModel.value,
                role: (roleModel.value?.value === 'admin_csa')
                        ? `admin_csa_${custAttendantModel.value?.value}`
                        : roleModel.value?.value,
                
            }
            
            JSONToFormData(payload)
            .then((formData:FormData)=> formAction?.(formData))
        }
    }

    const genUpdatePayload =()=> {
        let payload:any = {}

        if(fullNameModel.validated && fullNameModel.value !== userDetails?.fullname) {
            payload['fullname'] = fullNameModel.value;
        }
        if(roleModel.selected) {
            payload['role'] = roleModel.value?.value;
            if(payload['role'] === 'admin_csa') {
                payload['role'] = `${payload['role']}_${custAttendantModel.value?.value}`
            }

            console.log(payload)
        }
        if(emailModel.validated) {
            payload['email'] = emailModel.value;
        }
        if(passwordModel.validated) {
            payload['password'] =   passwordModel.value;
        }
        

        JSONToFormData(payload)
        .then(()=> updateUserAction?.(payload))
    }

    const genDeactivatePayload =()=> {
        let payload:any = {};

        payload['active'] = !userDetails?.active

        JSONToFormData(payload)
        .then(()=> toggleActivationAction?.(payload))
    }

    return(
        <div className={styles.admin_user_form}> 
            <FormContainer extraStyle={styles.new_admin_user}>

                <div className={styles.form_heading}>Add new admin user</div>

                <SizedBox height={20} />

                <ImageUploaderWrapper 
                    squareDimension={100} 
                    saveImage={(selectedImage:Blob|MediaSource)=> setImage(selectedImage)}
                >
                    {
                        userImage.image?.default
                        ?   <div className={styles.profile_picture_placeholder_wrapper}>
                                <img src={userImage.image?.default} alt="" className="image" />
                            </div>
                        :   fullNameModel.value
                            ? UserProfileImage(userImage.image?.default!, fullNameModel.value?.toString()!, 100, 50)
                            : <img src={IconCamera} alt="" className="image" />
                    }   
                </ImageUploaderWrapper>

                <div className={styles.twin_fields}>
                    <InputField
                        label={fullNameModel.label}
                        hint={fullNameModel.hint}
                        value={fullNameModel.value}
                        error={fullNameModel.error}
                        onInput={(inputValue:string)=> setInput(inputValue, fullNameModel, setFullNameModel)}
                    />

                    {/* <PhoneInputField
                        error={phoneNumberModel.error}
                        value={phoneNumberModel.value?.toString()!}
                        disableOTP={true}
                        onInput={(inputValue: string) => setInput(inputValue, phoneNumberModel, setPhoneNumberModel)} 
                    /> */}
                </div>
                
                <DropDownField 
                    label={roleModel.label} 
                    options={roleModel.options} 
                    selected={roleModel.selected} 
                    selectedOptionIndex={roleModel.selectedOptionIndex}
                    error={roleModel.error}
                    onSelect={(optionIndex:number)=> selectOption(optionIndex, roleModel, setRoleModel)} 
                />

                {
                    roleModel.value?.value === 'admin_csa'
                    ?   <DropDownField 
                            label={custAttendantModel.label} 
                            options={custAttendantModel.options} 
                            selected={custAttendantModel.selected} 
                            selectedOptionIndex={custAttendantModel.selectedOptionIndex}
                            error={custAttendantModel.error}
                            onSelect={(optionIndex:number)=> selectOption(optionIndex, custAttendantModel, setCustAttendantModel)} 
                        />
                    :   <div></div>
                }

                <SizedBox height={20} />

                <div className={styles.login_access_section}>
                    <div className={styles.form_heading}>Login access</div>
                    
                    <InputField
                        label={emailModel.label}
                        type={emailModel.type!}
                        value={emailModel.value}
                        suffixIcon={emailValIcon}
                        error={emailModel.error}
                        onInput={(inputValue:string)=> setInput(inputValue, emailModel, setEmailModel)}
                    />

                    <PasswordField
                        label={passwordModel.label}
                        value={passwordModel.value?.toString()!}
                        error={passwordModel.error}
                        onInput={(inputValue:string)=> setInput(inputValue, passwordModel, setPasswordModel)}
                    />
                </div>

                <SizedBox height={20} />

                {
                    userDetails
                    ?   <div className={styles.twin_buttons}>
                            {
                                userDetails?.active
                                ?   <DeleteTextButton 
                                        label={"Deactivate"} 
                                        isLoading={changingActivation}
                                        action={()=> genDeactivatePayload()}
                                    />

                                :   <RestoreTextButton 
                                        label={"Activate"}
                                        isLoading={changingActivation}
                                        action={()=> genDeactivatePayload()}
                                    />
                            }

                            <div className={styles.submit_button}>
                                <PrimaryTextButton
                                    label="Update"
                                    isLoading={updating}
                                    action={()=> genUpdatePayload()}
                                />
                            </div>
                        </div>
                    :   <div className={styles.submit_button}>
                            <PrimaryTextButton
                                label="Create new user" 
                                isLoading={submitting}
                                disabled={!isFormValidated}
                                action={()=> generatePayload()}
                            />
                        </div>
                }


                <SizedBox height={20} />
            </FormContainer>
        </div>
    )
}