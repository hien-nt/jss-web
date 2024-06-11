import axiosClient from "./client";

export const SellOrderApi = {
  getSellOrders: () => {
    return axiosClient.get("/OrderSells");
  },

  getSellOrderById: (orderSellId) => {
    return axiosClient.get(`/OrderSells/${orderSellId}`);
  },

  updateSellOrderToPaid: (payload) => {
    return axiosClient.post(`/OrderSells/paid`, payload);
  },

  viewOrderSellInvoice: (orderSellId) =>{
    return axiosClient.get(`/OrderSells/view/${orderSellId}`);
  },

  exportOrderSellInvoice: (orderSellId) =>{
    return axiosClient.get(`/OrderSells/export/${orderSellId}`,{
      responseType: 'blob'
    });
  }

};
