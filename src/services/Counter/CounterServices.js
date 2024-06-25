import { CounterApi } from "../../axios/CounterApi";
import { message } from "antd";

export const getCounters = async (setCounters) => {
  try {
    const result = await CounterApi.getCounters();
    console.log(result.data);
    // Ensure the data is an array before processing it
    if (Array.isArray(result.data)) {
      setCounters(result.data); // Set the fetched data to state
    } else {
      console.error("Fetched data is not an array:", result.data);
      setCounters([]); // Default to an empty array if the data is not as expected
    }
  } catch (error) {
    console.error(
      "Failed to fetch counter data:",
      error.response?.data || error.message
    );
  }
};

export const createCounter = async (
  payload,
  setIsModalVisible,
  setCounters
) => {
  console.log("payload ne: " + JSON.stringify(payload));
  try {
    await CounterApi.createCounter(payload);
    message.success("Counter created successfully");
    setIsModalVisible(false);
    getCounters(setCounters);
    // Call onSuccess callback to perform any additional actions
  } catch (error) {
    console.error("Failed to create Counter:", error.response.data);
    message.error(`Failed to create Counter: ${error.response.data}`);
  }
};

export const updateCounter = async (
  counterId,
  payload,
  setIsModalVisible,
  setCounters
) => {
  console.log("payload ne: " + JSON.stringify(payload));
  try {
    await CounterApi.updateCounterById(counterId, payload);
    message.success("Counter updated successfully");
    setIsModalVisible(false);
    getCounters(setCounters);
  } catch (error) {
    console.error("Failed to update Counter:", error.response.data);

    message.error(`Failed to update Counter: ${error.response.data}`);
  }
};
