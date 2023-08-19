import React from "react";
import { ReactComponent as IconEdit } from "../../../../../../../../assets/icons/icon-edit.svg";
import convertCurrency from "../../../../../../../../utils/currencyConverter";
import styles from "./giftcardvaluecard.module.css";

export interface GiftcardValueProps {
  id: string;
  active: boolean;
  abbr: string;
  amount: number;
  rateInNaira: number;
  editAction: () => void;
}

export default function GiftcardValueCard({
  id,
  active,
  abbr,
  amount,
  rateInNaira,
  editAction,
}: GiftcardValueProps) {
  return (
    <React.Fragment>
      <div
        className={`
                ${styles.gift_card_subcategory_card}
                ${active ? null : styles.inactive}
            `}
      >
        <div
          className={styles.edit_button}
          children={<IconEdit />}
          onClick={() => editAction()}
        />
        <div className={styles.subcategory_name}>{`${abbr} - ${amount}`}</div>
        <div className={styles.subcategory_rate}>
          @{convertCurrency(rateInNaira, "₦", 2)}
        </div>
      </div>
    </React.Fragment>
  );
}
