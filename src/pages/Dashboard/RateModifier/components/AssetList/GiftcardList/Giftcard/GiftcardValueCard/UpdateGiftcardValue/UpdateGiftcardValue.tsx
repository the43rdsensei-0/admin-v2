import { useState } from "react";
import DeleteTextButton from "../../../../../../../../../components/Buttons/DeleteTextButton";
import PrimaryTextButton from "../../../../../../../../../components/Buttons/PrimaryTextButton";
import RestoreTextButton from "../../../../../../../../../components/Buttons/RestoreTextButton";
import FormContainer from "../../../../../../../../../components/Form/FormContainer";
import InputField from "../../../../../../../../../components/Form/InputField/inputfield";
import {
  formFieldProps,
  setFormFieldProps,
} from "../../../../../../../../../components/Form/types";
import FormSuccessModal from "../../../../../../../../../components/Modal/FormSuccess";
import ModalContainer from "../../../../../../../../../components/Modal/ModalContainer";
import SizedBox from "../../../../../../../../../components/SizedBox";
import { updateGiftcardValueAction } from "../../../../../../../../../features/assets/giftcard/actions";
import { useGiftcardAssetState } from "../../../../../../../../../features/assets/giftcard/atom";
import formatGiftcardAsset from "../../../../../../../../../features/assets/giftcard/utils/formatGiftcardAsset";
import Capitalize from "../../../../../../../../../utils/capitalize";
import FormStateModal from "src/components/Modal/FormStateModal";
import formatMultipleGiftcardAssets from "src/features/assets/giftcard/utils/formatMultipleGiftcardAssets";

interface UpdateGiftcardValueProps {
  active: boolean;
  cardId: string;
  cardName: string;
  regionName: string;
  regionId: string;
  valueId: string;
  abbr: string;
  amount: number;
  rateInNaira: number;
  close: Function;
}

export default function UpdateGiftcardValue({
  active,
  cardId,
  cardName,
  regionName,
  regionId,
  valueId,
  abbr,
  amount,
  rateInNaira,
  close,
}: UpdateGiftcardValueProps) {
  const [giftcardState, setGiftcardState] = useGiftcardAssetState();
  const [updateSubcategoryState, setUpdateSubcategoryState] =
    useState(giftcardState);
  const [deactivateSubcategoryState, setDeactivateSubcategoryState] =
    useState(giftcardState);

  const [isCardActive, setIsCardActive] = useState(active);

  const cardNameModel: formFieldProps = {
    type: "text",
    name: "card-name",
    label: "Card Name",
    value: Capitalize(cardName),
    error: "",
    validated: false,
    readOnly: true,
  };

  const regionNameModel: formFieldProps = {
    type: "text",
    name: "region-name",
    label: "Region Name",
    value: Capitalize(regionName),
    error: "",
    validated: false,
    readOnly: true,
  };

  const abbrModel: formFieldProps = {
    type: "text",
    name: "currency",
    label: "Currency",
    value: abbr.toUpperCase(),
    error: "",
    validated: false,
    readOnly: true,
  };

  const [amountModel, setAmountModel] = useState<formFieldProps>({
    type: "number",
    name: "amount",
    label: "Amount",
    value: amount,
    error: "",
    validated: false,
  });

  const [rateInNairaModel, setRateInNairaModel] = useState<formFieldProps>({
    type: "number",
    name: "rate-in-naira",
    label: "Rate in Naira",
    value: rateInNaira,
    error: "",
    validated: false,
  });

  const setInput = (newValue: string, model: formFieldProps, setModel: setFormFieldProps) => {
    if (model.type === "number") model.value = parseFloat(newValue);
    else model.value = newValue;

    validateModel(model);
    setModel({ ...model });

    enableFormButton();
  };

  const validateModel = (updatedModel: formFieldProps) => {
    if (!updatedModel.value) {
      updatedModel.validated = false;
      updatedModel.error = "Field cannot be empty";
      return false;
    }

    if (updatedModel.name === "amount") {
      if (updatedModel.value === amount) {
        updatedModel.validated = false;
        updatedModel.error = "";
        return false;
      }
    }

    if (updatedModel.name === "rate-in-naira") {
      if (updatedModel.value === rateInNaira) {
        updatedModel.validated = false;
        updatedModel.error = "";
        return false;
      }
    }

    updatedModel.validated = true;
    updatedModel.error = "";
    return true;
  };

  const enableFormButton = () => {
    if (validateForm()) setIsFormValidated(true);
    else setIsFormValidated(false);
  };

  const [isFormValidated, setIsFormValidated] = useState(false);
  const validateForm = () => {
    if (!amountModel.validated && !rateInNairaModel.validated) return false;

    return true;
  };

  const submitForm = () => {
    if (validateForm()) {
      const payload:any = {};
      
      if(amountModel.validated) {
        payload["valueAmount"] = parseInt(amountModel.value?.toString()!);
      }

      if(rateInNairaModel.validated) {
        payload["rateInNaira"] = parseFloat(rateInNairaModel.value?.toString()!);
      }

      setUpdateSubcategoryState((state) => {
        return {
          ...state,
          status: "loading",
          error: false,
          message: "",
        };
      });

      updateGiftcardValueAction(cardId, regionId, valueId, payload)
        .then((data) => {

          setUpdateSubcategoryState((state) => {
            return {
              ...state,
              status: "succeeded",
              error: false,
              message: "Giftcard subcategory has been updated successfully",
            };
          });

          const updatedGiftcards = giftcardState.giftcards.map((giftcard) => {
            if (giftcard.id === data.asset.id) return formatGiftcardAsset(data.asset);
            return giftcard;
          });

          setGiftcardState((state) => {
            return {
              ...state,
              giftcards: formatMultipleGiftcardAssets(updatedGiftcards),
            };
          });
        })
        .catch((error: any) => {
          setUpdateSubcategoryState((state) => {
            return {
              ...state,
              status: "failed",
              error: true,
              message: error.message,
            };
          });
        });
    }
  };

  const deactivateSubcategory = () => {
    setDeactivateSubcategoryState((state) => {
      return {
        ...state,
        status: "loading",
        error: false,
        message: "",
      };
    });

    updateGiftcardValueAction(cardId, regionId, valueId, { active: !isCardActive })
    .then((data) => {


      setDeactivateSubcategoryState((state) => {
        return {
          ...state,
          status: "succeeded",
          error: false,
          message: "Giftcard subcategory successfully deactivated",
        };
      });

      const updatedGiftcards = giftcardState.giftcards.map((giftcard) => {
        if (giftcard.id === data.asset.id) return formatGiftcardAsset(data.asset);
        return giftcard;
      });

      setIsCardActive(!isCardActive)

      setGiftcardState((state) => {
        return {
          ...state,
          giftcards: formatMultipleGiftcardAssets(updatedGiftcards),
        };
      });
    })
    .catch((error) => {
      setDeactivateSubcategoryState((state) => {
        return {
          ...state,
          status: "failed",
          error: true,
          message: error.message,
        };
      });
    });
  };

  return (
    <ModalContainer close={() => close()}>
      <FormContainer formHeading="Update Value">
        <FormSuccessModal
          errorState={updateSubcategoryState}
          setErrorState={setUpdateSubcategoryState}
        />

        <FormStateModal 
          state={{
            status: deactivateSubcategoryState.status,
            message: deactivateSubcategoryState.message
          }} 
          setState={setDeactivateSubcategoryState} 
        />

        <InputField
          type="text"
          label="Asset type"
          value="Giftcard"
          readOnly={true}
          onInput={() => {}}
        />

        <InputField
          type={cardNameModel.type}
          label={cardNameModel.label}
          value={cardNameModel.value}
          readOnly={cardNameModel.readOnly}
          onInput={() => {}}
        />

        <InputField
          type={regionNameModel.type}
          label={regionNameModel.label}
          value={regionNameModel.value}
          readOnly={regionNameModel.readOnly}
          onInput={() => {}}
        />

        <InputField
          type={abbrModel.type}
          label={abbrModel.label}
          value={abbrModel.value}
          readOnly={abbrModel.readOnly}
          onInput={() => {}}
        />

        <InputField
          type="number"
          prefixIcon={"$"}
          label={amountModel.label}
          value={amountModel.value?.toString()}
          error={amountModel.error}
          onInput={(inputValue: string) => setInput(inputValue, amountModel, setAmountModel)}
        />

        <InputField
          type="number"
          prefixIcon={"N"}
          label={rateInNairaModel.label}
          value={rateInNairaModel.value?.toString()}
          error={rateInNairaModel.error}
          onInput={(inputValue: string) => setInput(inputValue, rateInNairaModel, setRateInNairaModel)}
        />

        <SizedBox height={10} />

        <div className={"twin_buttons"}>
          <PrimaryTextButton
            label="Update rate"
            isLoading={updateSubcategoryState.status === "loading"}
            disabled={!isFormValidated}
            action={() => submitForm()}
          />

          {isCardActive ? (
            <DeleteTextButton
              label="Deactivate"
              isLoading={deactivateSubcategoryState.status === "loading"}
              action={() => deactivateSubcategory()}
            />
          ) : (
            <RestoreTextButton
              label="Activate"
              isLoading={deactivateSubcategoryState.status === "loading"}
              action={() => deactivateSubcategory()}
            />
          )}
        </div>
      </FormContainer>
    </ModalContainer>
  );
}
