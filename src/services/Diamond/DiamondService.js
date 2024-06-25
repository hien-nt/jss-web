import { DiamondApi } from "../../axios/DiamondApi";
import { message } from "antd";

export const getDiamondPrices = async (setDiamondPrices) => {
  try {
    const result = await DiamondApi.getDiamondsPrice();
    console.log(result.data);
    // Ensure the data is an array before processing it
    if (Array.isArray(result.data)) {
      setDiamondPrices(result.data); // Set the fetched data to state
    } else {
      console.error("Fetched data is not an array:", result.data);
      setDiamondPrices([]); // Default to an empty array if the data is not as expected
    }
  } catch (error) {
    console.error("Failed to fetch diamond data:", error.response?.data || error.message);
  }
};

export const updateDiamondPrice = async (
  diamondPriceId,
  payload,
  setIsModalVisible,
  setDiamondPrices
) => {
  //console.log("payload put ne: " + JSON.stringify(payload));
  try {
    await DiamondApi.updateDiamondPrice(diamondPriceId, payload);
    message.success("Material Price updated successfully");
    setIsModalVisible(false);
    getDiamondPrices(setDiamondPrices);
  } catch (error) {
    console.error("Failed to update price:", error.response.data);
    message.error(`Failed to update price: ${error.response.data}`);
  }
};
