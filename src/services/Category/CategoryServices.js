import { message } from "antd";
import { CategoryApi } from "../../axios/CategoryApi";
export const getCategoryTypes = async (setCategoryType) => {
  try {
    const result = await CategoryApi.getCategoryType();
    console.log(result.data);
    // Ensure the data is an array before processing it
    if (Array.isArray(result.data)) {
      // const categories = result.data.flatMap(categoryType =>
      //   categoryType.categories.map(category => ({
      //     categoryTypeId: categoryType.categoryTypeId,
      //     categoryTypeName: categoryType.categoryTypeName,
      //     ...category,
      //   }))
      // );
      setCategoryType(result.data); // Set the processed data to state
    } else {
      console.error("Fetched data is not an array:", result.data);
      setCategoryType([]); // Default to an empty array if the data is not as expected
    }
  } catch (error) {
    console.error(
      "Failed to fetch category data:",
      error.response?.data || error.message
    );
  }
};

export const getCategorys = async (setCategory) => {
  try {
    const result = await CategoryApi.getCategory();
    console.log(result.data);
    // Ensure the data is an array before processing it
    if (Array.isArray(result.data)) {
      setCategory(result.data); // Set the processed data to state
    } else {
      console.error("Fetched data is not an array:", result.data);
      setCategory([]); // Default to an empty array if the data is not as expected
    }
  } catch (error) {
    console.error(
      "Failed to fetch category data:",
      error.response?.data || error.message
    );
  }
};

export const createCategoryType = async (
  payload,
  setIsModalVisible,
  setCategoryType
) => {
  console.log("payload ne: " + JSON.stringify(payload));
  try {
    await CategoryApi.createCategoryType(payload);
    message.success("Counter created successfully");
    setIsModalVisible(false);
    getCategoryTypes(setCategoryType);
    // Call onSuccess callback to perform any additional actions
  } catch (error) {
    console.error("Failed to create category type:", error.response.data);
    message.error(`Failed to create category type: ${error.response.data}`);
  }
};

export const updateCategoryType = async (
  categoryTypeId,
  updatePayload,
  setIsModalVisible,
  setCategoryType
) => {
  console.log("payload ne: " + JSON.stringify(updatePayload));
  try {
    await CategoryApi.updateCategoryType(categoryTypeId, updatePayload);
    message.success("Counter updated successfully");
    setIsModalVisible(false);
    getCategoryTypes(setCategoryType);
  } catch (error) {
    console.error("Failed to update category type:", error.response.data);
    message.error(`Failed to update category type: ${error.response.data}`);
  }
};

export const createCategory = async (
  payload,
  setIsModalVisible,
  setCategory
) => {
  console.log("payload ne: " + JSON.stringify(payload));
  try {
    await CategoryApi.createCategory(payload);
    message.success("Counter created successfully");
    setIsModalVisible(false);
    getCategorys(setCategory);
    // Call onSuccess callback to perform any additional actions
  } catch (error) {
    console.error("Failed to create category type:", error.response.data);
    message.error(`Failed to create category type: ${error.response.data}`);
  }
};

export const updateCategory = async (
  categoryId,
  payload,
  setIsModalVisible,
  setCategory
) => {
  console.log("payload ne: " + JSON.stringify(payload));
  try {
    await CategoryApi.updateCategory(categoryId, payload);
    message.success("Counter updated successfully");
    setIsModalVisible(false);
    getCategorys(setCategory);
  } catch (error) {
    console.error("Failed to update category type:", error.response.data);
    message.error(`Failed to update category type: ${error.response.data}`);
  }
};
