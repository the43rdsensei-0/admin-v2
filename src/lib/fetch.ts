import axios from "axios";

export const getFetch = (url: string, params?: object) => {
  return new Promise((resolve, reject) => {
    fetch(url, "GET", params)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const postFetch = (url: string, body: object) => {
  return new Promise((resolve, reject) => {
    fetch(url, "POST", body)
      .then((response) => resolve(response.data))
      .catch((error) => {
        if (typeof error.response.data === "object") {
          reject({
            code: error.response.data.code?.toString(),
            message: error.response.data.message?.toString(),
          });
        }
        if (typeof error.response.data === "string") {
          // if(error.response.status === 401 && error.response.statusText === "Unauthorized")
          // localStorage.clear();
          // window.location.pathname = '/login'

          reject({
            message:
              "Hmm.. this request is not recognized, make sure you are accessing a valid url",
          });
        }
        reject({ message: error.response.message });
      });
  });
};

export const patchFetch = (url: string, body: object) => {
  return new Promise((resolve, reject) => {
    fetch(url, "PATCH", body)
      .then((response) => resolve(response.data))
      .catch((error) => {
        if (typeof error.response.data === "object") {
          reject({
            code: error.response.data.code?.toString(),
            message: error.response.data.message?.toString(),
          });
        }
        if (typeof error.response.data === "string") {
          reject({
            message:
              "Hmm.. this request is not recognized, make sure you are accessing a valid url",
          });
        }
        reject({ message: error.response.message });
      });
  });
};

export const deleteFetch = (url: string, body?: object) => {
  return new Promise((resolve, reject) => {
    fetch(url, "DELETE", body)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error.response));
  });
};

const fetch = (
  url: string,
  method: "GET" | "POST" | "PATCH" | "DELETE",
  data?: object
) => {
  return axios({
    url,
    method,
    baseURL: process.env.VITE_BASE_URL,
    data,
    withCredentials: true,
  });
};
