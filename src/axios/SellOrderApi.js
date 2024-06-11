import axiosClient from "./client";

export const SellOrderApi = {
  getSellOrders: () => {
    return axiosClient.get("/OrderSells");
  },

  getSellOrderById: (orderSellId) => {
    return axiosClient.get(`/OrderSells/${orderSellId}`);
  },

//   createSellOrder: (payload) => {
//     return axiosClient.post("/SellOrders", payload);
//   },

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

//   deinactiveSellOrder: (SellOrderId)=> {
//     return axiosClient.put(`/SellOrders/status/${SellOrderId}`);
//   }
};
