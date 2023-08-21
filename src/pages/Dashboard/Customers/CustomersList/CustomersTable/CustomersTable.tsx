import styles from "./customerstable.module.css";
import { useEffect, useState } from "react";
import Capsule from "src/components/Capsule";
import Table from "src/components/Table/table";
import UserProfileImage from "src/components/User/UserProfileImage";
import Capitalize from "src/utils/capitalize";
import sortByDate from "src/utils/sortByDate";
import ExternalSearchBarField from "src/components/Form/SearchBarField/ExternalSearchBarField";
import {
  fetchAllCustomersAction,
  searchCustomerAction,
  sortCustomerByTotalAmountAction,
} from "src/features/customers/actions";
import formatCustomersList, {
  CustomerType,
} from "src/features/customers/utils/formatCustomersList";
import { useCustomerState } from "src/features/customers/atom";
import PageComponentLoader from "src/components/Loaders/PageComponentLoader";
import CustomListButton from "src/components/Buttons/CustomListButton";
import ExportCSVButton from "src/components/Buttons/ExportCSVButton";
import { ExportToCsv } from "export-to-csv";
import formatDate from "src/utils/formatDate";
import formatTime from "src/utils/formatTime";
import getTodayDate from "src/utils/getTodayDate";

export default function CustomersTable({
  customers,
  currentPageNumber,
  totalPagesNumber,
  paginate,
}: {
  customers: any[];
  currentPageNumber: number;
  totalPagesNumber: number;
  paginate: Function;
}) {
  const [customerState, setCustomerState] = useCustomerState();

  const tableHead = [
    "Customers Name",
    "Customers Name",
    "Phone Number & Email",
    "Total Amount Traded",
    "Status",
  ];
  const [tableBody, setTableBody] = useState<any[][]>([]);

  const [searchResult, setSearchResult] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const customerToDisplay: any = customerState.searchKeyword
      ? searchResult
      : customers;
    setTableBody(formatCustomersTableBody(sortByDate(customerToDisplay)!));
    setIsLoading(false);
  }, [customers, customerState.searchKeyword, searchResult]);

  const formatCustomersTableBody = (newList: any[]) => {
    return newList.map((customer: any) => {
      return [
        {
          rowKey: customer.id,
          actionEvent: "row_click",
          target: "new_page",
        },
        UserProfileImage(customer.profileImageURL, customer.fullname, 50),
        <div className={styles.fullname}>{Capitalize(customer.fullname)}</div>,
        <div>
          <div>{customer.phoneNumber}</div>
          <div className={styles.email}>{customer.email}</div>
        </div>,
        <div>{customer.totalTransactionAmount}</div>,
        Capsule(customer.verified ? "SUCCESS" : "PENDING"),
      ];
    });
  };

  const searchCustomers = (value: string, page: number) => {
    const searchKeyword: string = value.trim() || " ";

    setIsLoading(true);

    searchCustomerAction(searchKeyword, page)
      .then((response: any) => {
        const formatted: CustomerType[] = formatCustomersList(
          response.customers
        );
        setCustomerState((state) => {
          return {
            ...state,
            list: sortByDate(formatted)!,
            totalPages: response.totalCustomersPage,
            currentPage: parseInt(response.currentPage),
            searchKeyword: searchKeyword,
          };
        });

        setSearchResult(formatted);
        setIsLoading(false);
      })
      .catch(() => {
        setCustomerState((state) => {
          return {
            ...state,
            error: true,
            status: "failed",
            message: "There was an error searching transactions",
          };
        });

        setIsLoading(false);
      })
      .finally(() => {
        setTimeout(() => {
          setCustomerState((state) => {
            return {
              ...state,
              error: true,
              status: "failed",
              message: "There was an error searching transactions",
            };
          });
        }, 3000);
      });
  };

  const paginateSearchResult = (newPageNumber: number) => {
    searchCustomers(customerState.searchKeyword, newPageNumber);
  };

  const sortCustomers = (sortType: string, newPageNumber: number) => {
    if (sortType === "total-amount") {
      setIsLoading(true);

      sortCustomerByTotalAmountAction(newPageNumber)
        .then((response: any) => {
          const formatted: CustomerType[] = formatCustomersList(
            response.customers
          );
          setCustomerState((state) => {
            return {
              ...state,
              list: sortByDate(formatted)!,
              totalPages: response.totalCustomersPage,
              currentPage: parseInt(response.currentPage),
              sortType: sortType,
            };
          });

          setSearchResult(formatted);
          setIsLoading(false);
        })
        .catch(() => {
          setCustomerState((state) => {
            return {
              ...state,
              error: true,
              status: "failed",
              message: "There was an error searching customers",
            };
          });

          setIsLoading(false);
        })
        .finally(() => {
          setTimeout(() => {
            setCustomerState((state) => {
              return {
                ...state,
                error: true,
                status: "failed",
                message: "There was an error searching customers",
              };
            });
          }, 3000);
        });
    }
  };

  const paginateSortResult = (newPageNumber: number) => {
    sortCustomers(customerState.sortType, newPageNumber);
  };

  const [isCSVExporting, setIsCSVExporting] = useState(false);

  const downloadCSV = () => {
    setIsCSVExporting(true);

    fetchAllCustomersAction()
      .then((response: any) => {
        const formatted: any[] = formatCustomersCSVList(
          sortByDate(response.customers)!
        );

        const csvTableHead = [
          "Name",
          "Email",
          "Phone number",
          "Amount traded",
          "Registered",
          "Last seen",
        ];

        const options = {
          filename: `TSECustomers-(${getTodayDate()})`,
          fieldSeparator: ",",
          quoteStrings: '"',
          decimalSeparator: ".",
          showLabels: true,
          useTextFile: false,
          headers: csvTableHead,
        };

        const csvExporter = new ExportToCsv({ ...options });
        csvExporter.generateCsv(formatted);

        setIsCSVExporting(false);
      })
      .catch(() => {
        setCustomerState((state) => {
          return {
            ...state,
            error: true,
            status: "failed",
            message: "There was an error searching transactions",
          };
        });

        setIsCSVExporting(false);
      })
      .finally(() => {
        setTimeout(() => {
          setCustomerState((state) => {
            return {
              ...state,
              error: true,
              status: "failed",
              message: "There was an error searching transactions",
            };
          });
        }, 3000);
      });
  };

  const formatCustomersCSVList = (allCustomers: any[]) => {
    if (!allCustomers.length) return [];
    return allCustomers.map((customer: any) => {
      const phone =
        customer.phoneNumber.toString().substr(0, 3) === "234"
          ? customer.phoneNumber
              .toString()
              .substr(3, customer.phoneNumber.length)
          : customer.phoneNumber;
      return {
        fullname: customer.fullname,
        email: customer.email,
        phoneNumber: `234${phone.toString()}`,
        totalTransactionAmount: customer.totalTransactionAmount,
        date: formatDate(customer.createdAt),
        time: formatTime(customer.createdAt),
      };
    });
  };

  return (
    <div className={styles.customers_table_container}>
      <div className={styles.custom_list_section}>
        <ExternalSearchBarField
          label="Search by id, name, email or phone"
          action={(value: string) => searchCustomers(value, 1)}
        />

        <div className={styles.button_actions}>
          <CustomListButton
            action={(sortType: string) => sortCustomers(sortType, 1)}
          />

          <ExportCSVButton
            isLoading={isCSVExporting}
            action={() => downloadCSV()}
          />
        </div>
      </div>

      {isLoading ? (
        <PageComponentLoader />
      ) : (
        <Table
          extraStyle={styles}
          head={tableHead}
          body={tableBody}
          currentPage={currentPageNumber}
          totalPages={totalPagesNumber}
          goToPage={(newPageNumber: number) =>
            customerState.searchKeyword
              ? paginateSearchResult(newPageNumber)
              : customerState.sortType
              ? paginateSortResult(newPageNumber)
              : paginate(newPageNumber)
          }
          emptyListMessage={"Customers will appear here when they register"}
        />
      )}
    </div>
  );
}
