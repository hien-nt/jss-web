import { message } from "antd";
import { AccountApi } from "../../axios/AccountApi";

export const getAccount = async (setAccounts) => {
  try {
    const result = await AccountApi.getAccount();
    console.log(result.data);
    // Ensure the data is an array before processing it
    if (Array.isArray(result.data)) {
      setAccounts(result.data); // Set the fetched data to state
    } else {
      console.error("Fetched data is not an array:", result.data);
      setAccounts([]); // Default to an empty array if the data is not as expected
    }
  } catch (error) {
    console.error(
      "Failed to fetch account data:",
      error.response?.data || error.message
    );
  }
};
export const getSellers = async (setSellers) => {
  try {
    const result = await AccountApi.getSellerAccount();
    console.log(result.data);
    // Ensure the data is an array before processing it
    if (Array.isArray(result.data)) {
      setSellers(result.data); // Set the fetched data to state
    } else {
      console.error("Fetched data is not an array:", result.data);
      setSellers([]); // Default to an empty array if the data is not as expected
    }
  } catch (error) {
    console.error(
      "Failed to fetch account data:",
      error.response?.data || error.message
    );
  }
};

export const createAccount = async (
  payload,
  setIsModalVisible,
  setAccounts
) => {
  console.log("payload ne: " + JSON.stringify(payload));
  try {
    await AccountApi.createAccount(payload);
    message.success("Account created successfully");
    setIsModalVisible(false);
    getAccount(setAccounts);

    // getAllAccount(setAccounts);
    // Call onSuccess callback to perform any additional actions
  } catch (error) {
    console.error("Failed to create Account:", error.response.data);
    message.error(`Failed to create Account: ${error.response.data}`);
  }
};

export const updateAccount = async (
  accountId,
  payload,
  setIsModalVisible,
  setAccounts
) => {
  //console.log(accountId)
  try {
    await AccountApi.updateAccount(accountId, payload);
    message.success("Account updated successfully");
    setIsModalVisible(false);
    getAccount(setAccounts);
  } catch (error) {
    console.error("Failed to update Account:", error.response.data);
    message.error(`Failed to update Account: ${error.response.data}`);
  }
};

export const getCurrentAccount = async (setCurrentAccount) => {
  try {
    const result = await AccountApi.getCurrentAccount();
    // Ensure the data is an array before setting it
    if (result.data) {
      setCurrentAccount(result.data); // Set the fetched data to state
      //console.log(result.data);
    } else {
      // console.error("Fetched data is not an array:", result.data);
      setCurrentAccount(null); // Default to an empty array if the data is not as expected
    }
  } catch (error) {
    console.error("Failed to fetch current account: ", error.response.data);
  }
};
