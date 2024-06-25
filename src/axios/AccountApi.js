import axiosClient from "./client";

export const AccountApi = {
  login: (username, password) => {
    return axiosClient.post("/Accounts/login", username, password);
  },
  createAccount: (payload) => {
    return axiosClient.post("/Accounts/signup", payload);
  },

  updateAccount: (accountId, payload) => {
    return axiosClient.put(`/Accounts/${accountId}`, payload);
  },

  getSellerAccount: () => {
    return axiosClient.get("/Accounts/sellers");
  },

  getAccount: () => {
    return axiosClient.get("/Accounts/allAccount");
  },
  // getStaffAccountByFarm: () => {
  //   return axiosClient.get("/Accounts/staffs/farm");
  // },
  // deinactiveAccount: (accountId) => {
  //   return axiosClient.put(`/Accounts/status/${accountId}`);
  // },
  // getCurrentAccount: () => {
  //   return axiosClient.get("/Accounts");
  // }
};
