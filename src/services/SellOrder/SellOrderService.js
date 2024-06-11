import { message } from "antd";
import { SellOrderApi } from "../../axios/SellOrderApi";

export const getAllSellOrder = async (setSellOrders) => {
  try {
    const result = await SellOrderApi.getSellOrders();
    console.log(result.data)
    // Ensure the data is an array before setting it
    if (Array.isArray(result.data)) {
      const sortedData = result.data.sort((a, b) => b.orderSellId - a.orderSellId);
      setSellOrders(sortedData); // Set the fetched data to state
      //console.log(sortedData);
    } else {
      console.error("Fetched data is not an array:", result.data);
      setSellOrders([]); // Default to an empty array if the data is not as expected
    }
  } catch (error) {
    console.error("Failed to fetch SellOrder data:", error.response.data);
  }
};

export const getSellOrderBySellOrderId = async (orderSellId, setSellOrderData) => {
  try {
    const result = await SellOrderApi.getSellOrderById(orderSellId);
    // console.log(result.data)
    // Ensure the data is an array before setting it
    if (result.data) {
      setSellOrderData(result.data); // Set the fetched data to state
      //console.log(result.data);
    } else {
      console.error("Fetched SellOrder by id:", result.data);
      setSellOrderData(null); // Default to an empty array if the data is not as expected
    }
  } catch (error) {
    console.error("Failed to fetch SellOrder by id data:", error.response.data);
  }
};

export const updateSellOrderToPaid = async (payload, orderSellId, setSellOrderData, setIsModalUpdatePaidOrderOpen) => {
  console.log("payload post ne: " + JSON.stringify(payload));
  try {
    await SellOrderApi.updateSellOrderToPaid(payload);
    message.success("Sell Order update successfully");
    setIsModalUpdatePaidOrderOpen(false);
    getSellOrderBySellOrderId(orderSellId, setSellOrderData);
  } catch (error) {
    console.error("Failed to update Sell Order:", error.response.data);
    message.error(`Failed to update Sell Order: ${error.response.data}`);
  }
};

// export const updateSellOrder = async (
//   SellOrderId,
//   payload,
//   setSellOrders,
//   setIsModalVisible
// ) => {
//   //console.log("payload put ne: " + JSON.stringify(payload));

//   try {
//     await SellOrderApi.updateSellOrderById(SellOrderId, payload);
//     message.success("SellOrder updated successfully");
//     setIsModalVisible(false);
//     getAllSellOrder(setSellOrders);
//   } catch (error) {
//     console.error("Failed to update SellOrder:", error.response.data);
//     message.error(`Failed to update SellOrder: ${error.response.data}`);
//   }
// };


