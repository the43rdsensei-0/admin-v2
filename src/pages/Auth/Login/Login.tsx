import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../../../components/Form/InputField/inputfield";
import FormErrorModal from "../../../components/Modal/FormError/FormErrorModal";
import PasswordField from "../../../components/Form/PasswordField";
import logo from "../../../assets/images/tse-logo-3-with-name-no-bg.png";
import logoMobile from "../../../assets/images/tse-logo-1.png";
import banner from "../../../assets/images/login_banner.png";
import { useAuthState } from "../../../features/auth/atom";
import { LoginAction } from "../../../features/auth/actions";
import { actionError } from "../../../features/auth/types";
import styles from "./login.module.css";
import PrimaryTextButton from "../../../components/Buttons/PrimaryTextButton";
import FormContainer from "../../../components/Form/FormContainer";
import { useUserStateValue } from "src/features/user/atom";

export default function Login() {
  const [authState, setAuthState] = useAuthState();

  const userState = useUserStateValue();

  const navigate = useNavigate();

  const [PasswordModel, setPasswordModel] = useState({
    label: "Password",
    value: "",
    error: "",
    validated: false,
  });

  const [EmailModel, setEmailModel] = useState({
    type: "text",
    label: "Email",
    value: "",
    error: "",
    validated: false,
  });

  const validateModel = (updatedModel: any) => {
    if (updatedModel.value === "") {
      updatedModel.error = "Field cannot be empty";
      updatedModel.validated = false;
      return false;
    }

    updatedModel.error = "";
    updatedModel.validated = true;
    return true;
  };

  const setInput = (inputValue: string, model: any, setModel: any) => {
    model.value = inputValue;
    validateModel(model);
    setModel({ ...model });

    enableButton();
  };

  const [isFormValidated, setIsFormValidated] = useState(false);

  const validateForm = () => {
    // validate email and password
    if (!EmailModel.validated) return;
    if (!PasswordModel.validated) return;

    return true;
  };

  const enableButton = () => {
    if (validateForm()) setIsFormValidated(true);
    else setIsFormValidated(false);
  };

  const LoginAuth = async () => {
    if (validateForm()) {
      const payload = {
        email: EmailModel.value,
        password: PasswordModel.value,
      };

      setAuthState(() => {
        return {
          error: false,
          message: "",
          status: "loading",
          isSignedIn: false,
        };
      });

      await LoginAction(payload)
        .then((response: any) => {
          setAuthState(() => {
            return {
              error: false,
              message: "",
              status: "succeeded",
              isSignedIn: true,
            };
          });

          if (
            ["admin_acct", "admin_csa_crypto", "admin_csa_card"].includes(
              response?.data?.user?.role
            )
          )
            navigate({ pathname: "/dashboard/transactions" });
          else navigate({ pathname: "/dashboard" });
        })
        .catch((error: actionError) => {
          setAuthState(() => {
            return {
              error: true,
              message: error.message,
              status: "loading",
              isSignedIn: false,
            };
          });
        })
        .finally(() => {
          setAuthState((state) => {
            return {
              ...state,
              status: "idle",
            };
          });
        });
    }
  };

  useEffect(() => {
    if (authState.isSignedIn && userState.userData.id) {
      if (
        ["admin_acct", "admin_csa_crypto", "admin_csa_card"].includes(
          userState.userData.role
        )
      )
        navigate({ pathname: "/dashboard/transactions" });
      else navigate({ pathname: "/dashboard" });
    }
  });

  return (
    <div className={styles.body}>
      <FormErrorModal errorState={authState} setErrorState={setAuthState} />

      <div className={styles.form_container}>
        <div className={styles.logo_img_wrapper}>
          <img src={logo} alt="" />
        </div>

        <div className={styles.mobile_logo_img_wrapper}>
          <img src={logoMobile} alt="" />
        </div>

        <FormContainer
          formHeading="Login To Admin"
          extraStyle={styles.form_wrapper}
        >
          <InputField
            label={EmailModel.label}
            type={EmailModel.type}
            onInput={(inputVal: string) =>
              setInput(inputVal, EmailModel, setEmailModel)
            }
            error={EmailModel.error}
          />

          <PasswordField
            label={PasswordModel.label}
            error={PasswordModel.error}
            onInput={(inputVal: string) =>
              setInput(inputVal, PasswordModel, setPasswordModel)
            }
          />

          <PrimaryTextButton
            label="LOGIN"
            isLoading={authState.status === "loading"}
            action={() => LoginAuth()}
            disabled={!isFormValidated}
          />
        </FormContainer>
      </div>

      <div className={styles.banner_image_wrapper}>
        <img src={banner} alt="" />
      </div>
    </div>
  );
}
