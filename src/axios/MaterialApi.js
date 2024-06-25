import axiosClient from "./client";

export const MaterialApi = {


  getMaterialsPrice: () => {
    return axiosClient.get("/MaterialPrices");
  },

  updateMaterialsPrice:(materialPriceId, payload) => {
    return axiosClient.put(`/MaterialPrices/${materialPriceId}`, payload);
  },

  getMaterials: () => {
    return axiosClient.get("/Materials");
  },

  createMaterial:(payload) => {
    return axiosClient.post("/Materials/create-material-with-price", payload);
  },

};
