import styles from "./transactionslist.module.css";
import { useEffect, useState } from "react";
import DashboardHeader from "../../../../components/Headers/Dashboard/dashboardheader";
import TransactionsMetrics from "../components/TransactionsMetrics";
import SizedBox from "../../../../components/SizedBox";
import sortByDate from "src/utils/sortByDate";
import formatTransactions, {
  TransactionTableItem,
} from "src/features/transactions/utils/formatTransactions";
import { useTransactionState } from "src/features/transactions/atom";
import socketConnection from "src/lib/socketConn";
import PageComponentLoader from "src/components/Loaders/PageComponentLoader";
import TransactionsTable from "../components/TransactionsTable/TransactionsTable";
import { useUserStateValue } from "src/features/user/atom";
import ComponentLoader from "src/components/Loaders/ComponentLoader";
import FormStateModal from "src/components/Modal/FormStateModal";
import { FilterOptionsType } from "src/components/Buttons/FilterButton/FilterButton";

export default function TransactionsList() {
  const userState = useUserStateValue();

  const [transactionState, setTransactionState] = useTransactionState();

  const [isPageLoading, setIsPageLoading] = useState(false);

  const [isTransactionLoading, setIsTransactionLoading] = useState(
    transactionState.list.length ? false : true
  );

  useEffect(() => {
    if (!transactionState.searchKeyword && !transactionState.activeCategory) {
      socketConnection.emit(`fetch_all_transactions`, {
        pageNumber: transactionState.currentPageNumber,
        userId: userState.userData.id,
      });
    }

    if (
      !transactionState.searchKeyword &&
      transactionState.activeCategory === "cryptocurrency"
    ) {
      if (transactionState.activeCSACryptoCategory === "sell") {
        socketConnection.emit("leave_buy_crypto_transactions_room", {
          userId: userState.userData.id,
        });
        socketConnection.emit("fetch_sell_crypto_transactions", {
          pageNumber: transactionState.currentPageNumber,
          userId: userState.userData.id,
        });
      }

      if (transactionState.activeCSACryptoCategory === "buy") {
        socketConnection.emit("leave_sell_crypto_transactions_room", {
          userId: userState.userData.id,
        });
        socketConnection.emit("fetch_buy_crypto_transactions", {
          pageNumber: transactionState.currentPageNumber,
          userId: userState.userData.id,
        });
      }
    }

    socketConnection.on("transactions", (response) => {
      if (
        response.data?.currentTransactionPage ===
          transactionState.currentPageNumber &&
        (transactionState.activeCategory === response.data?.category ||
          transactionState.activeCSACryptoCategory === response.data?.category)
      ) {
        formatTransactions(response.data?.transactions)
          .then((formattedResponse: TransactionTableItem[]) => {
            setTransactionState((state) => {
              return {
                ...state,
                list: sortByDate([...formattedResponse])!,
                totalPages: response.data?.totalTransactionPages,
                currentPageNumber: response.data?.currentTransactionPage,
              };
            });
            setIsPageLoading(false);
            setIsTransactionLoading(false);
          })
          .catch((error) => {
            setTransactionState((state) => {
              return {
                ...state,
                status: "failed",
                error: true,
                message:
                  "There was an error fetching transactions, please try again. If issue persists, contact support.",
              };
            });
          });
      }
    });
  }, [
    setTransactionState,
    transactionState.activeCSACryptoCategory,
    transactionState.activeCategory,
    transactionState.currentPageNumber,
    transactionState.searchKeyword,
    userState.userData.id,
  ]);

  const paginate = (pageNumber: number) => {
    setTransactionState((state) => {
      return {
        ...state,
        currentPageNumber: pageNumber,
      };
    });
    setIsTransactionLoading(true);
  };

  const fetchCatTransactions = (category: string) => {
    setIsTransactionLoading(true);
    socketConnection.emit(category, {
      pageNumber: 1,
      userId: userState.userData.id,
    });
  };

  const filterTransactions = (filterOptions: FilterOptionsType) => {
    socketConnection.emit("update_transactions_filter", {
      filterOptions,
      userId: userState.userData.id,
      pageNumber: 1,
      currentCategory: transactionState.activeCategory,
      currentCSACryptoCategory: transactionState.activeCSACryptoCategory,
    });
  };

  return (
    <div className={styles.container}>
      <FormStateModal state={transactionState} setState={setTransactionState} />

      <DashboardHeader pageTitle="Transactions Management" />

      {isPageLoading ? (
        <PageComponentLoader />
      ) : (
        <div>
          <TransactionsMetrics />

          <SizedBox height={50} />

          {isTransactionLoading ? (
            <ComponentLoader />
          ) : (
            <TransactionsTable
              transactions={transactionState.list}
              currentPage={transactionState.currentPageNumber}
              totalPages={transactionState.totalPages}
              goToPage={(pageNumber: number) => paginate(pageNumber)}
              fetchCategorizedTransactions={(category: string) =>
                fetchCatTransactions(category)
              }
              updateFilter={(filterOptions: FilterOptionsType) =>
                filterTransactions(filterOptions)
              }
            />
          )}
        </div>
      )}
    </div>
  );
}
