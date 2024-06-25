import React, { useState, useEffect } from "react";
import { Form, Input, Select, Button } from "antd";
import axios from "axios";
import { CategoryApi } from "../../axios/CategoryApi";
import { MaterialApi } from "../../axios/MaterialApi";
import { DiamondApi } from "../../axios/DiamondApi";
import { ProductApi } from "../../axios/ProductApi";

const { Option } = Select;

const fetchCategories = async (setCategories) => {
  try {
    const response = await CategoryApi.getCategory() // Update with your API endpoint
    setCategories(response.data);
  } catch (error) {
    console.error("Failed to fetch categories:", error);
  }
};

const fetchMaterials = async (setMaterials) => {
  try {
    const response = await MaterialApi.getMaterials() // Update with your API endpoint
    setMaterials(response.data);
  } catch (error) {
    console.error("Failed to fetch materials:", error);
  }
};

const fetchDiamonds = async (setDiamonds) => {
  try {
    const response = await DiamondApi.getDiamonds() // Update with your API endpoint
    setDiamonds(response.data);
  } catch (error) {
    console.error("Failed to fetch diamonds:", error);
  }
};

const CreateProductForm = () => {
  const [categories, setCategories] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [diamonds, setDiamonds] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [filteredDiamonds, setFilteredDiamonds] = useState([]);

  useEffect(() => {
    fetchCategories(setCategories);
    fetchMaterials(setMaterials);
    fetchDiamonds(setDiamonds);
  }, []);

  const handleCategoryChange = (categoryId) => {
    const selectedCategory = categories.find(
      (cat) => cat.categoryId === categoryId
    );
    if (selectedCategory) {
      const { categoryTypeId } = selectedCategory;

      // Filter materials
      if (
        categoryTypeId === 1 ||
        categoryTypeId === 2 ||
        categoryTypeId === 4
      ) {
        const filtered = materials.flatMap((materialType) =>
          materialType.materials.filter(
            (material) =>
              materialType.materialTypeId === categoryTypeId ||
              categoryTypeId === 4
          )
        );
        setFilteredMaterials(filtered);
      } else {
        setFilteredMaterials([]);
      }

      // Filter diamonds
      if (categoryTypeId === 3 || categoryTypeId === 4) {
        setFilteredDiamonds(diamonds);
      } else {
        setFilteredDiamonds([]);
      }
    }
  };

  const onFinish = async (values) => {
    console.log(values)
    const payload = {
      ...values,
      materials: values.materials?.materialId ? [values.materials] : [],
      diamonds: Array.isArray(values.diamonds) ? values.diamonds.map(code => ({ diamondCode: code })) : []
    };
    try {
      await ProductApi.createProduct(payload); // Update with your API endpoint
      console.log("Product created successfully:", payload);
    } catch (error) {
      console.error("Failed to create product:", error);
    }
  };

  return (
    <Form onFinish={onFinish} layout="vertical">
      <Form.Item
        name="productName"
        label="Product Name"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="size" label="Size" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="img" label="Image URL" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item
        name="counterId"
        label="Counter ID"
        rules={[{ required: true }]}
      >
        <Input type="number" />
      </Form.Item>
      <Form.Item
        name="categoryId"
        label="Category"
        rules={[{ required: true }]}
      >
        <Select onChange={handleCategoryChange}>
          {categories.map((category) => (
            <Option key={category.categoryId} value={category.categoryId}>
              {category.categoryName}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="materialCost"
        label="Material Cost"
        rules={[{ required: true }]}
      >
        <Input type="number" />
      </Form.Item>


      <Form.Item
        name="diamondCost"
        label="Diamond Cost"
        rules={[{ required: true }]}
      >
        <Input type="number" />
      </Form.Item>
      <Form.Item
        name="productionCost"
        label="Production Cost"
        rules={[{ required: true }]}
      >
        <Input type="number" />
      </Form.Item>
      <Form.Item
        name="priceRate"
        label="Price Rate"
        rules={[{ required: true }]}
      >
        <Input type="number" />
      </Form.Item>

      <Form.Item name={["materials", "materialId"]} label="Material">
        <Select allowClear>
          {filteredMaterials.map(material => (
            <Option key={material.materialId} value={material.materialId}>
              {material.materialName}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name={["materials", "weight"]} label="Weight" rules={[{ required: filteredMaterials.length > 0 }]}>
        <Input type="number" />
      </Form.Item>
      <Form.Item name="diamonds" label="Diamonds">
        <Select allowClear>
          {filteredDiamonds.map((diamond) => (
            <Option key={diamond.diamondCode} value={diamond.diamondCode}>
              {diamond.diamondName}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Create Product
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateProductForm;
