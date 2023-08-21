import webSocketConn from "src/lib/socketConn";
import { deleteFetch, getFetch, patchFetch } from "../../lib/fetch";
import { FilterOptionsType } from "src/components/Buttons/FilterButton/FilterButton";

// export function fetchAllTransactionsAction(pageNumber:number) {
//     return new Promise( (resolve, reject)=> {
//         //     return getFetch(`/admin/transactions/${pageNumber}`)
//         //     .then((response:any)=> resolve(response.data))
//         //     .catch((error:any)=> reject(error.response))
//         webSocketConn.emit(`fetch_all_transactions`, {pageNumber: pageNumber, message: 'FROM CLIENT TO SERVER'})
//         .on('transactions', (response)=> {
//             resolve(response.data)
//         })
//     })
// }

// export function fetchTransactionAction(transactionId:string) {
//     return new Promise( (resolve, reject)=> {
//         webSocketConn.emit(`fetch_transaction`, {transactionId: transactionId, message: 'FROM CLIENT TO SERVER'})
//         .on('fetch_transaction', (response)=> {
//             resolve(response.data)
//         })
//     })
// }

export function reviewTransactionAction(
  transactionId: string,
  payload: object
) {
  return new Promise((resolve, reject) => {
    return patchFetch(`/admin/transactions/${transactionId}/review`, payload)
      .then((response: any) => resolve(response.data))
      .catch((error: any) => reject(error.response));
  });
}

// export function rejectReviewedTransactionAction(transactionId:string) {
//     return new Promise( (resolve, reject)=> {
//         webSocketConn.emit(`reject_reviewed_transaction`, {transactionId})
//         .on('reject_reviewed_transaction', (response)=> {
//             resolve(response.data)
//         })
//     })
// }

export function completeTransactionAction(transactionId: string) {
  return new Promise((resolve) => {
    webSocketConn
      .emit(`complete_transaction`, { transactionId })
      .on("complete_transaction", (response) => {
        resolve(response.data);
      });
  });
}

// export function rejectCompletedTransactionAction(transactionId:string) {
//     return new Promise( (resolve, reject)=> {
//         return patchFetch(`/admin/transactions/${transactionId}/reject-complete`, {})
//         .then((response:any)=> resolve(response.data))
//         .catch((error:any)=> reject(error.response))
//     })
// }

export function rejectTransactionAction(
  transactionId: string,
  payload: object
) {
  return new Promise((resolve, reject) => {
    return patchFetch(`/admin/transactions/${transactionId}/reject`, payload)
      .then((response: any) => resolve(response.data))
      .catch((error: any) => reject(error.response));
  });
}

export function flagTransactionImageAction(
  transactionId: string,
  payload: { imageId: string; flagged: boolean }
) {
  return new Promise((resolve, reject) => {
    return patchFetch(
      `/admin/transactions/${transactionId}/flag-toggle`,
      payload
    )
      .then((response: any) => resolve(response.data))
      .catch((error: any) => reject(error.response));
  });
}

export function deleteTransactionNoteImageAction(
  transactionId: string,
  payload: { imageUrl: string }
) {
  return new Promise((resolve, reject) => {
    return deleteFetch(
      `/admin/transactions/${transactionId}/note/images`,
      payload
    )
      .then((response: any) => resolve(response.data))
      .catch((error: any) => reject(error.response));
  });
}

export function searchTransactionsAction(keyword: string) {
  return new Promise((resolve, reject) => {
    return getFetch(`/admin/transactions/search/${keyword}`)
      .then((response: any) => resolve(response.data))
      .catch((error: any) => reject(error.response));
  });
}

export function deferTransactionAction(transactionId: string) {
  return new Promise((resolve, reject) => {
    return patchFetch(`/admin/transactions/${transactionId}/defer`, {})
      .then((response: any) => resolve(response.data))
      .catch((error: any) => reject(error.response));
  });
}

export function fetchTransactionAttendants(transactionId: string) {
  return new Promise((resolve, reject) => {
    return getFetch(`/admin/transactions/${transactionId}/attendants`)
      .then((response: any) => resolve(response.data))
      .catch((error: any) => reject(error.response));
  });
}

export function updateTransactionFilterAction(payload: FilterOptionsType) {
  return new Promise((resolve, reject) => {
    return patchFetch(`/admin/user/transactions/filter`, payload)
      .then((response: any) => resolve(response.data))
      .catch((error: any) => reject(error.response));
  });
}
