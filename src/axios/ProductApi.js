import axiosClient from "./client";

export const ProductApi = {
  getProducts: () => {
    return axiosClient.get("/Products/allProducts");
  },

  createProduct: (payload) => {
    return axiosClient.post("/Products/create", payload);
  },



};
