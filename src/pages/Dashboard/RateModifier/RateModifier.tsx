import { Suspense, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Outlet } from "react-router-dom";
import PrimaryIconButton from "../../../components/Buttons/PrimaryIconButton";
import { SearchBarField } from "../../../components/Form/SearchBarField";
import DashboardHeader from "../../../components/Headers/Dashboard/dashboardheader";
import ComponentLoader from "../../../components/Loaders/ComponentLoader";
import SizedBox from "../../../components/SizedBox";
import BankAccountsList from "./components/BankAccountsList";
import CreateNewAsset from "./components/CreateNewAsset";
import RateModifierNav from "./components/RateModifierNav";
import styles from "./ratemodifier.module.css";

export default function RateModifier() {
    
    const [newAssetState, setNewAssetState] = useState({
        isOpen: false
    });

    const showCreateNewAssetForm = ()=> {
        setNewAssetState({
            isOpen: true
        });
    };

    return (
        <div className={styles.rate_modifier_container}>
            <DashboardHeader 
                pageTitle="Assets Management"
            />  

            <div className={styles.main}>

                <div className={`flex-display-row-space-between ${styles.assets_action}`}>
                    <SearchBarField 
                        listToSearch={[]}
                        onSearch={()=> {}}
                    />
                    
                    <PrimaryIconButton
                        extraStyle={styles.create_asset_btn}
                        prefixIcon={<FaPlus />}
                        label="Create new asset"
                        disabled={false}
                        isLoading={false}
                        action={()=> showCreateNewAssetForm()}
                    />
                </div>

                <div className={styles.bank_account}>
                    <BankAccountsList />
                </div>

                <SizedBox height={50} />

                <RateModifierNav />

                <SizedBox height={20} />

                <div className={styles.content}>
                    <Suspense fallback={<ComponentLoader />} >
                        <Outlet />
                    </Suspense>
                </div>
            </div>

            {
                (newAssetState.isOpen)
                ? <CreateNewAsset close={()=> setNewAssetState({isOpen: false})} />
                : null
            }
        </div>
    );
}