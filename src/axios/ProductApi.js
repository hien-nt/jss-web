import axiosClient from "./client";

export const ProductApi = {
  getProducts: () => {
    return axiosClient.get("/Products/allProducts");
  },

};
