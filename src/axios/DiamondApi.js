import axiosClient from "./client";

export const DiamondApi = {
  getDiamondsPrice: () => {
    return axiosClient.get("/DiamondPrices");
  },

  getDiamonds: () => {
    return axiosClient.get("/Diamonds");
  },
  createDiamondWithPrice: (payload) => {
    return axiosClient.post("/Diamonds/CreateDiamondWithPrice", payload);
  },
  updateDiamondPrice: (diamondPriceId, payload) => {
    return axiosClient.put(`/DiamondPrices/${diamondPriceId}`, payload);
  },


};
