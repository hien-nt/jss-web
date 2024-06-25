import axiosClient from "./client";

export const CounterApi = {
  getCounters: () => {
    return axiosClient.get("/Counters");
  },

  createCounter: (payload) => {
    return axiosClient.post("/Counters/create", payload);
  },

  updateCounterById: (counterId, payload) => {
    return axiosClient.put(`/Counters/update/${counterId}`, payload);
  },


};
