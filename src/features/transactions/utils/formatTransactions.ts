import { fetchCryptoAssetByIdAction } from "src/features/assets/crypto/actions";
import { fetchGiftcardAssetByIdAction } from "src/features/assets/giftcard/actions";
import Capitalize from "../../../utils/capitalize";

export interface TransactionTableItem {
  id: string;
  reviewed: boolean;
  paidout: boolean;
  txnType: boolean;
  name: string;
  imageURL: string;
  amountSentInNaira: number;
  status: string;
  date: string;
}

export default function formatTransactions(transactions: any[]) {
  return new Promise<TransactionTableItem[]>((resolve, reject) => {
    if (!transactions?.length) resolve(transactions);

    let formatted: any = [];
    transactions.forEach(async (transaction: any) => {
      const transactionValue = transaction.paidout
        ? transaction.content.amount.paid
        : transaction.content.amount.sent.inNaira;

      if (Object.keys(transaction.content?.asset || {}).length) {
        let assetName: string = "";

        if (transaction.content?.name === "cryptocurrency") {
          assetName = Capitalize(transaction.content.asset.name);
        }
        if (transaction.content?.name === "giftcard") {
          let subCategory = transaction.content.asset?.regions.filter(
            (region: any) => region._id === transaction.content.subCategory
          )[0]?.abbr;
          subCategory = subCategory + " - " + transaction.content.value;

          if (!subCategory) {
            subCategory = transaction.content.asset?.subCategories.filter(
              (subcat: any) => subcat._id === transaction.content.subCategory
            )[0]?.name;
          }

          assetName = subCategory;
        }

        formatted.unshift({
          id: transaction._id,
          reviewed: transaction.reviewed,
          paidout: transaction.paidout,
          txnType: transaction.content.name,
          imageURL: transaction.content.asset.imageURL,
          name: assetName,
          amountSentInNaira: transactionValue,
          status: transaction.status,
          date: transaction.createdAt,
        });
      } else {
        if (transaction.content?.name === "cryptocurrency") {
          await fetchCryptoAssetByIdAction(transaction.content.category).then(
            (cryptoAsset: any) => {
              formatted.unshift({
                id: transaction._id,
                reviewed: transaction.reviewed,
                paidout: transaction.paidout,
                txnType: transaction.content.name,
                name: Capitalize(cryptoAsset.name),
                imageURL: cryptoAsset.imageURL,
                amountSentInNaira: transactionValue,
                status: transaction.status,
                date: transaction.createdAt,
              });
            }
          );
        }

        if (transaction.content?.name === "giftcard") {
          await fetchGiftcardAssetByIdAction(transaction.content.category).then(
            (giftcardAsset: any) => {
              formatted.unshift({
                id: transaction._id,
                reviewed: transaction.reviewed,
                paidout: transaction.paidout,
                txnType: transaction.content.name,
                imageURL: giftcardAsset.imageURL,
                name: Capitalize(
                  giftcardAsset.subCategories.filter(
                    (subcat: any) =>
                      subcat._id === transaction.content.subCategory
                  )[0].name
                ),
                amountSentInNaira: transactionValue,
                status: transaction.status,
                date: transaction.createdAt,
              });
            }
          );
        }
      }

      if (transactions.length === formatted.length) resolve(formatted);
    });
  });
}
