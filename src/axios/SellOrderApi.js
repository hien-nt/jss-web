import axiosClient from "./client";

export const SellOrderApi = {
  getSellOrders: () => {
    return axiosClient.get("/OrderSells");
  },

  getApprovalSellOrders: () => {
    return axiosClient.get("/OrderSells/allOrderSellApproval");
  },

  getApprovedSellOrders: () => {
    return axiosClient.get("/OrderSells/allOrderSellApproved");
  },

  getSellOrderById: (orderSellId) => {
    return axiosClient.get(`/OrderSells/${orderSellId}`);
  },
  
  updateSellOrderToPaid: (payload) => {
    return axiosClient.post(`/OrderSells/paid`, payload);
  },

  updateSellOrderPromotionDiscount: (orderSellId, payload) => {
    return axiosClient.put(`/OrderSells/update-discount/${orderSellId}`, payload);
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
