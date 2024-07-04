import axiosClient from "./client";

export const DashboardApi = {
  getSumRevenueAndByCate: () => {
    return axiosClient.get("/Dashboard");
  },

  getSaleDataByTime: () => {
    return axiosClient.get("/Dashboard/ProductSaleData");
  },

  getOrderAndCusCount: () => {
    return axiosClient.get("/Dashboard/counts");
  },
};
