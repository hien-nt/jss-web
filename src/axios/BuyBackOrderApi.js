import axiosClient from "./client";

export const BuyBackOrderApi = {
  getBuyBackOrders: () => {
    return axiosClient.get("/OrderBuyBacks");
  },

  getBuyBackOrderById: (orderBuyBackId) => {
    return axiosClient.get(`/OrderBuyBacks/${orderBuyBackId}`);
  },

  updateBuyBackOrderToPaid: (payload) => {
    return axiosClient.post(`/OrderBuyBacks/pay`, payload);
  },

  viewOrderBuyBackInvoice: (orderBuyBackId) =>{
    return axiosClient.get(`/OrderBuyBacks/view/${orderBuyBackId}`);
  },

  exportOrderBuyBackInvoice: (orderBuyBackId) =>{
    return axiosClient.get(`/OrderBuyBacks/export/${orderBuyBackId}`,{
      responseType: 'blob'
    });
  }

};
