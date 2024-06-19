import { ProductApi } from "../../axios/ProductApi";

export const getAllProduct = async (setProducts) => {
    try {
      const result = await ProductApi.getProducts();
      console.log(result.data)
      // Ensure the data is an array before setting it
      if (Array.isArray(result.data)) {
        const sortedData = result.data.sort((a, b) => b.orderSellId - a.orderSellId);
        setProducts(sortedData); // Set the fetched data to state
        //console.log(sortedData);
      } else {
        console.error("Fetched data is not an array:", result.data);
        setProducts([]); // Default to an empty array if the data is not as expected
      }
    } catch (error) {
      console.error("Failed to fetch Product data:", error.response.data);
    }
  };