import { message } from "antd";
import { BuyBackOrderApi } from "../../axios/BuyBackOrderApi";

export const getAllBuyBackOrder = async (setBuyBackOrders) => {
  try {
    const result = await BuyBackOrderApi.getBuyBackOrders();
    console.log(result.data)
    // Ensure the data is an array before setting it
    if (Array.isArray(result.data)) {
      const sortedData = result.data.sort((a, b) => b.orderBuyBackId - a.orderBuyBackId);
      setBuyBackOrders(sortedData); // Set the fetched data to state
      //console.log(sortedData);
    } else {
      console.error("Fetched data is not an array:", result.data);
      setBuyBackOrders([]); // Default to an empty array if the data is not as expected
    }
  } catch (error) {
    console.error("Failed to fetch BuyBackOrder data:", error.response.data);
  }
};

export const getBuyBackOrderByBuyBackOrderId = async (orderBuyBackId, setBuyBackOrderData) => {
  try {
    const result = await BuyBackOrderApi.getBuyBackOrderById(orderBuyBackId);
    // console.log(result.data)
    // Ensure the data is an array before setting it
    if (result.data) {
      setBuyBackOrderData(result.data); // Set the fetched data to state
      //console.log(result.data);
    } else {
      console.error("Fetched BuyBackOrder by id:", result.data);
      setBuyBackOrderData(null); // Default to an empty array if the data is not as expected
    }
  } catch (error) {
    console.error("Failed to fetch BuyBackOrder by id data:", error.response.data);
  }
};

export const updateBuyBackOrderToPaid = async (payload, orderBuyBackId, setBuyBackOrderData, setIsModalUpdatePaidOrderOpen) => {
  console.log("payload post ne: " + JSON.stringify(payload));
  try {
    await BuyBackOrderApi.updateBuyBackOrderToPaid(payload);
    message.success("BuyBack Order update successfully");
    setIsModalUpdatePaidOrderOpen(false);
    getBuyBackOrderByBuyBackOrderId(orderBuyBackId, setBuyBackOrderData);
  } catch (error) {
    console.error("Failed to update BuyBack Order:", error.response.data);
    message.error(`Failed to update BuyBack Order: ${error.response.data}`);
  }
};

// export const updateBuyBackOrder = async (
//   BuyBackOrderId,
//   payload,
//   setBuyBackOrders,
//   setIsModalVisible
// ) => {
//   //console.log("payload put ne: " + JSON.stringify(payload));

//   try {
//     await BuyBackOrderApi.updateBuyBackOrderById(BuyBackOrderId, payload);
//     message.success("BuyBackOrder updated successfully");
//     setIsModalVisible(false);
//     getAllBuyBackOrder(setBuyBackOrders);
//   } catch (error) {
//     console.error("Failed to update BuyBackOrder:", error.response.data);
//     message.error(`Failed to update BuyBackOrder: ${error.response.data}`);
//   }
// };


