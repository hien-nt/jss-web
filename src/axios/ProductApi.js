import axiosClient from "./client";

export const ProductApi = {
  getProducts: () => {
    return axiosClient.get("/Products/allProducts");
  },

  getProductById: (productId) => {
    return axiosClient.get(`/Products/${productId}`);
  },

  createProduct: (payload) => {
    return axiosClient.post("/Products/create", payload);
  },

  updateProduct: (productId, payload) => {
    return axiosClient.put(`/Products/${productId}`, payload);

  },



};
