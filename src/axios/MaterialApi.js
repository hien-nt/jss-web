import axiosClient from "./client";

export const MaterialApi = {
  getMaterialsPrice: () => {
    return axiosClient.get("/MaterialPrices");
  },

};
