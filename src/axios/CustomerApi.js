import axiosClient from "./client";

export const CustomerApi = {
  getCustomers: () => {
    return axiosClient.get("/Customers");
  },

};
