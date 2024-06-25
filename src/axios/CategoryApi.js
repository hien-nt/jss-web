import axiosClient from "./client";

export const CategoryApi = {
  getCategoryType: () => {
    return axiosClient.get("/CategoryTypes/category-types");
  },

  getCategory: () => {
    return axiosClient.get("/CategoryTypes/category");
  },

  createCategoryType: (payload) => {
    return axiosClient.post("/CategoryTypes/create", payload);
  },

  updateCategoryType: (categoryTypeId, payload) => {
    return axiosClient.put(`/CategoryTypes/update/${categoryTypeId}`, payload);
  },

  createCategory: (payload) => {
    return axiosClient.post("/Category/create", payload);
  },

  updateCategory: (categoryId, payload) => {
    return axiosClient.put(`/Category/update/${categoryId}`, payload);
  },
};
