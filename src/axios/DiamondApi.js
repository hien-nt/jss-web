import axiosClient from "./client";

export const DiamondApi = {
  getDiamondsPrice: () => {
    return axiosClient.get("/DiamondPrices");
  },

};
