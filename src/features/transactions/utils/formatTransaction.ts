import { TransactionImage } from "src/components/ViewImageGalery/ViewImageGallery";
import Capitalize from "../../../utils/capitalize";

export interface transactionDetailsType {
  id: string;
  reviewed: boolean;
  paidout: boolean;
  rejected: boolean;
  note: {
    message: string;
    images: string[];
  };
  txnType?: "BUY" | "SELL";
  txnName: string;
  assetImageURL: string;
  assetCategory: string;
  assetSubcategory: string;
  amountSent: {
    inCrypto?: number;
    inDollar: number;
    inNaira: number;
  };
  amountReceived: number;
  amountToPay: number;
  rate: {
    sent: number;
    confirmed: number;
  };
  bankUsed?: {
    name: string;
    number: string;
  };
  walletAddress?: string;
  status: string;
  images: TransactionImage[];
  user: string;
  customerAttendant: string;
  attendants: string[];
  reassigned: boolean;
  deferred: {
    status: Boolean;
    date_deferred: string;
  };
  date: string;
}

export default function formatTransaction(transaction: any, userRole: string) {
  return new Promise<transactionDetailsType>(async (resolve, reject) => {
    if (transaction.content.name === "cryptocurrency") {
      if (
        !["admin_csa_crypto", "admin_acct", "admin_org", "admin_ops"].includes(
          userRole
        )
      )
        reject();

      resolve({
        id: transaction._id,
        reviewed: transaction.reviewed,
        paidout: transaction.paidout,
        rejected: transaction.rejected,
        note: {
          message: transaction.note.message,
          images: transaction.note.images,
        },
        txnType: transaction.content.transactionType,
        txnName: transaction.content.name,
        assetImageURL: transaction.content.asset.imageURL,
        assetCategory: Capitalize(transaction.content.asset.name),
        assetSubcategory: transaction.content.wallet,
        amountSent: {
          inCrypto: transaction.content.amount.sent.inCrypto,
          inDollar: transaction.content.amount.sent.inDollar,
          inNaira: transaction.content.amount.sent.inNaira,
        },
        amountReceived:
          transaction.content.amount.received?.inDollar ||
          transaction.content.amount.received?.value,
        amountToPay: transaction.content.amount.paid,
        rate: {
          sent: transaction.content.rate.sent,
          confirmed: transaction.content.rate.confirmed,
        },
        bankUsed: {
          name: transaction.content.bankUsed?.name,
          number: transaction.content.bankUsed?.accountNumber,
        },
        walletAddress: transaction.content?.walletAddress,
        status: transaction.status,
        images: transaction.content.images.map((image: any) => {
          return { id: image._id, ...image };
        }),
        user: transaction.user,
        customerAttendant: transaction.customerAttendant,
        reassigned: transaction.reassigned,
        deferred: {
          status: transaction.deferred.status,
          date_deferred: transaction.deferred.date_deferred,
        },
        attendants: transaction.attendants,
        date: transaction.createdAt,
      });
    }

    if (transaction.content.name === "giftcard") {
      if (
        !["admin_csa_card", "admin_acct", "admin_org", "admin_ops"].includes(
          userRole
        )
      )
        reject();

      let subCategory: string = transaction.content.asset?.regions.filter(
        (region: any) => region._id === transaction.content.subCategory
      )[0]?.abbr;
      subCategory = subCategory + " - " + transaction.content.subCategory.value;

      if (!subCategory) {
        subCategory = transaction.content.asset?.subCategories.filter(
          (subcat: any) => subcat._id === transaction.content.subCategory
        )[0]?.name;
      }

      resolve({
        id: transaction._id,
        reviewed: transaction.reviewed,
        paidout: transaction.paidout,
        rejected: transaction.rejected,
        note: transaction.note,
        txnType: transaction.content.transactionType,
        txnName: transaction.content.name,
        assetImageURL: transaction.content.asset.imageURL,
        assetCategory: Capitalize(transaction.content.asset.name),
        assetSubcategory: subCategory.toUpperCase(),
        amountSent: {
          inDollar: transaction.content.amount.sent.inDollar,
          inNaira: transaction.content.amount.sent.inNaira,
        },
        amountReceived:
          transaction.content.amount.received?.inDollar ||
          transaction.content.amount.received?.value,
        amountToPay: transaction.content.amount.paid,
        rate:
          typeof transaction.content.rate === "object"
            ? {
                sent: transaction.content.rate.sent,
                confirmed: transaction.content.rate.confirmed,
              }
            : {
                sent: transaction.content.rate,
                confirmed: transaction.content.asset.region.filter(
                  (subcat: any) =>
                    subcat._id === transaction.content.subCategory
                )[0].rate.inNaira,
              },
        status: transaction.status,
        images: transaction.content.images.map((image: any) => {
          return { id: image._id, ...image };
        }),
        user: transaction.user,
        customerAttendant: transaction.customerAttendant,
        reassigned: transaction.reassigned,
        deferred: {
          status: transaction.deferred.status,
          date_deferred: transaction.deferred.date_deferred,
        },
        attendants: transaction.attendants,
        date: transaction.createdAt,
      });
    }
  });
}
