import axiosClient from "./client";

export const AccountApi = {
  login: (username, password) => {
    return axiosClient.post("/Accounts/login", username, password);
  },
  createAccount: (payload) => {
    return axiosClient.post("/Accounts/signup", payload);
  },


  // updateAccount: (accountId, payload) => {
  //   return axiosClient.put(`/Accounts/${accountId}`, payload);
  // },
  // updateAdminAccount: (payload) => {
  //   return axiosClient.put(`/Accounts/UpdateProfileAdmin`, payload);
  // },
  // getManagerAccount: () => {
  //   return axiosClient.get("/Accounts/managers");
  // },
  // getStaffAccount: () => {
  //   return axiosClient.get("/Accounts/staffs");
  // },
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
