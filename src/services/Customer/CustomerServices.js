import { CustomerApi } from "../../axios/CustomerApi";

export const getCustomers = async (setCustomers) => {
  try {
    const result = await CustomerApi.getCustomers();
    console.log(result.data);
    // Ensure the data is an array before processing it
    if (Array.isArray(result.data)) {
      setCustomers(result.data); // Set the fetched data to state
    } else {
      console.error("Fetched data is not an array:", result.data);
      setCustomers([]); // Default to an empty array if the data is not as expected
    }
  } catch (error) {
    console.error("Failed to fetch customer data:", error.response?.data || error.message);
  }
};
