import { message } from "antd";
import { MaterialApi } from "../../axios/MaterialApi";

export const getMaterialPrice = async (materialTypeId, setMaterialsPrice) => {
  try {
    const result = await MaterialApi.getMaterialsPrice();
    console.log(result.data);
    // Ensure the data is an array before processing it
    if (Array.isArray(result.data)) {
      const materialType = result.data.find(
        (mt) => mt.materialTypeId === materialTypeId
      );
      if (materialType && materialType.materials.length) {
        const materialsPrices = materialType.materials.map((material) => {
          // Assume we want the latest price object (last in the array)
          const latestPrice =
            material.materialPrices[material.materialPrices.length - 1];
          return {
            materialId: material.materialId,
            materialName: material.materialName,
            materialPriceId: latestPrice.materialPriceId,
            buyPrice: latestPrice.buyPrice,
            sellPrice: latestPrice.sellPrice,
            effDate: latestPrice.effDate,
          };
        });
        setMaterialsPrice(materialsPrices);
      } else {
        console.error("No materials found for type ID:", materialTypeId);
        setMaterialsPrice([]); // Default to an empty array if no materials found
      }
    } else {
      console.error("Fetched data is not an array:", result.data);
      setMaterialsPrice([]); // Default to an empty array if the data is not as expected
    }
  } catch (error) {
    console.error(
      "Failed to fetch material data:",
      error.response?.data || error.message
    );
  }
};

export const createMaterial = async (
  payload,
  setIsModalVisible,
  materialTypeId,
  setMaterials
) => {
  console.log("payload ne: " + JSON.stringify(payload));
  try {
    await MaterialApi.createMaterial(payload);
    message.success("Material created successfully");
    setIsModalVisible(false);
    getMaterials(setMaterials);
    // Call onSuccess callback to perform any additional actions
  } catch (error) {
    console.error("Failed to create material:", error.response.data);
    message.error(`Failed to create material: ${error.response.data}`);
  }
};
export const updateMaterialPrice = async (
  materialPriceId,
  payload,
  setIsModalVisible,
  materialTypeId,
  setMaterialsPrice
) => {
  //console.log("payload put ne: " + JSON.stringify(payload));

  try {
    await MaterialApi.updateMaterialsPrice(materialPriceId, payload);
    message.success("Material Price updated successfully");
    setIsModalVisible(false);
    getMaterialPrice(materialTypeId, setMaterialsPrice);
  } catch (error) {
    console.error("Failed to update price:", error.response.data);
    message.error(`Failed to update price: ${error.response.data}`);
  }
};

export const getMaterials = async (setMaterials) => {
  try {
    const result = await MaterialApi.getMaterials();
    console.log(result.data);
    // Ensure the data is an array before processing it
    if (Array.isArray(result.data)) {
      // Flatten the data structure
      const materials = result.data.flatMap((materialType) =>
        materialType.materials.map((material) => ({
          materialTypeId: materialType.materialTypeId,
          materialTypeName: materialType.materialTypeName,
          materialId: material.materialId,
          materialName: material.materialName,
        }))
      );
      setMaterials(materials); // Set the processed data to state
    } else {
      console.error("Fetched data is not an array:", result.data);
      setMaterials([]); // Default to an empty array if the data is not as expected
    }
  } catch (error) {
    console.error(
      "Failed to fetch material data:",
      error.response?.data || error.message
    );
    setMaterials([]); // Default to an empty array in case of error
  }
};
