import { DashboardApi } from "../../axios/DashboardApi";
import {AccountApi} from "../../axios/AccountApi"

export const getSumRevenueAndByCate = async (setSumAndByCateRevenueData) => {
  try {
    const result = await DashboardApi.getSumRevenueAndByCate();
    console.log(result.data);
    // Ensure the data is an array before processing it
    if (result.data) {
        setSumAndByCateRevenueData(result.data); // Set the fetched data to state
    } else {
      console.error("Fetched data is not an array:", result.data);
      setSumAndByCateRevenueData([]); // Default to an empty array if the data is not as expected
    }
  } catch (error) {
    console.error(
      "Failed to fetch Dashboard data:",
      error.response?.data || error.message
    );
  }
};

export const getProductSaleData = async (setProductSaleData) => {
  try {
    const result = await DashboardApi.getSaleDataByTime();
    console.log(result.data);
    // Ensure the data is valid before processing it
    if (result.data) {
      setProductSaleData(result.data); // Set the fetched data to state
    } else {
      console.error("Fetched data is invalid:", result.data);
      setProductSaleData({ dailySales: [], weeklySales: [], monthlySales: [], yearlySales: [] });
    }
  } catch (error) {
    console.error("Failed to fetch product sale data:", error.response?.data || error.message);
    setProductSaleData({ dailySales: [], weeklySales: [], monthlySales: [], yearlySales: [] });
  }
};


export const getOrderAndCusCount = async (setCountData) => {
  try {
    const result = await DashboardApi.getOrderAndCusCount();
    console.log(result.data);
    // Ensure the data is an array before processing it
    if (result.data) {
      setCountData(result.data); // Set the fetched data to state
    } else {
      console.error("Fetched data is not an array:", result.data);
      setCountData([]); // Default to an empty array if the data is not as expected
    }
  } catch (error) {
    console.error(
      "Failed to fetch Dashboard data:",
      error.response?.data || error.message
    );
  }
};

export const getBestSeller = async (setBestSellers) => {
    try {
      const result = await AccountApi.getAccount();
      console.log(result.data);
      // Ensure the data is an array before processing it
      if (Array.isArray(result.data)) {
        const sellers = result.data.filter(account => account.role === 'Seller');
        const topSellers = sellers.sort((a, b) => b.revenue - a.revenue).slice(0, 3);
        setBestSellers(topSellers); // Set the top 5 sellers to state
      } else {
        console.error("Fetched data is not an array:", result.data);
        setBestSellers([]); // Default to an empty array if the data is not as expected
      }
    } catch (error) {
      console.error("Failed to fetch account data:", error.response?.data || error.message);
    }
  };
  