import { MaterialApi } from "../../axios/MaterialApi";

export const getMaterialPrice = async (materialTypeId, setMaterialsPrice) => {
    try {
      const result = await MaterialApi.getMaterialsPrice();
      console.log(result.data);
      // Ensure the data is an array before processing it
      if (Array.isArray(result.data)) {
        const materialType = result.data.find(mt => mt.materialTypeId === materialTypeId);
        if (materialType && materialType.materials.length) {
          const materialsPrices = materialType.materials.map(material => {
            // Assume we want the latest price object (last in the array)
            const latestPrice = material.materialPrices[material.materialPrices.length - 1];
            return {
              materialId: material.materialId,
              materialName: material.materialName,
              buyPrice: latestPrice.buyPrice,
              sellPrice: latestPrice.sellPrice,
              effectiveDate: latestPrice.effDate
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
      console.error("Failed to fetch material data:", error.response?.data || error.message);
    }
  };