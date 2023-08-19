import GridList from "src/components/Lists/GridList";
import styles from "./giftcardregioncard.module.css";
import GiftcardValueCard from "../GiftcardValueCard";
import { FaPlus } from "react-icons/fa";
import { useState } from "react";
import NewGiftcardValue from "../NewGiftcardValue";
import { useGiftcardAssetState } from "src/features/assets/giftcard/atom";
import UpdateGiftcardValue from "../GiftcardValueCard/UpdateGiftcardValue";

interface GiftcardRegionCardProps {
  cardId: string;
  cardName: string;
  regionId: string;
  active: boolean;
  flagImageURL: string;
  name: string;
  abbr: string;
  values: Array<{
    id: string;
    active: boolean;
    amount: number;
    rate: {
      inNaira: number;
      inDollars: number;
    };
  }>;
}

export default function GiftcardRegionCard(props: GiftcardRegionCardProps) {
  const [giftcardAssetState, setGiftcardAssetState] = useGiftcardAssetState();

  const [showNewRegionValueForm, setShowNewRegionValueForm] = useState(false);

  function addNewGiftcardValueModal() {
    setGiftcardAssetState((state) => ({
      ...state,
      details: {
        ...state.details,
        id: props.cardId,
        name: props.cardName,
        region: {
          id: props.regionId,
          name: `${props.name} (${props.abbr})`.toUpperCase(),
          abbr: props.abbr,
        },
      },
    }));

    setShowNewRegionValueForm(true);
  }

  const [showUpdateValueModal, setshowUpdateValueModal] = useState(false);

  function displayUpdateValueModal(valueId:string, isActive:boolean, valueAmount: number, rateInNaira: number) {
    setGiftcardAssetState((state) => ({
      ...state,
      details: {
        ...state.details,
        id: props.cardId,
        name: props.cardName,
        region: {
          id: props.regionId,
          name: `${props.name} (${props.abbr})`.toUpperCase(),
          abbr: props.abbr,
        },
        value: {
          id: valueId,
          active: isActive,
          rateInNaira: rateInNaira,
          amount: valueAmount,
        },
      },
    }));

    setshowUpdateValueModal(true);
  }

  return (
    <div className={styles.region_card}>
      <div className={styles.region_details}>
        <img
          src={props.flagImageURL}
          alt=""
          className={styles.gift_card_region_image}
        />

        <div className={styles.sep_dot}></div>

        <div className={styles.region_title}>{props.name}</div>

        <div className={styles.sep_dot}></div>

        <div className={styles.region_title_abbr}>{props.abbr}</div>
      </div>

      <div className={styles.giftcard_region_value_list}>
        <GridList columns={4}>
          {props.values.map((value, index) => (
            <GiftcardValueCard
              key={value.id ?? index}
              id={value.id}
              active={value.active}
              abbr={props.abbr}
              amount={value.amount}
              rateInNaira={value.rate.inNaira}
              editAction={() =>
                displayUpdateValueModal(value.id, value.active, value.amount, value.rate.inNaira)
              }
            />
          ))}

          <div
            className={styles.add_new_region_value}
            onClick={() => addNewGiftcardValueModal()}
          >
            <FaPlus />
            <div className={styles.label}>Add new value</div>
          </div>
        </GridList>
      </div>

      {showNewRegionValueForm ? (
        <NewGiftcardValue close={() => setShowNewRegionValueForm(false)} />
      ) : null}

      {showUpdateValueModal ? (
        <UpdateGiftcardValue
          valueId={giftcardAssetState.details.value.id}
          active={giftcardAssetState.details.value.active}
          cardId={giftcardAssetState.details.id}
          cardName={giftcardAssetState.details.name}
          regionName={giftcardAssetState.details.region.name}
          regionId={giftcardAssetState.details.region.id}
          abbr={giftcardAssetState.details.region.abbr}
          amount={giftcardAssetState.details.value.amount}
          rateInNaira={giftcardAssetState.details.value.rateInNaira}
          close={() => setshowUpdateValueModal(false)}
        />
      ) : null}
    </div>
  );
}
