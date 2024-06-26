import React, { useState, useEffect } from "react";
import { Form, Input, Select, Button, Drawer, Row, Col, message } from "antd";
import { CategoryApi } from "../../axios/CategoryApi";
import { MaterialApi } from "../../axios/MaterialApi";
import { DiamondApi } from "../../axios/DiamondApi";
import { ProductApi } from "../../axios/ProductApi";
import CreateDiamondForm from "./CreateDiamondFrom";

const { Option } = Select;

const CreateProductForm = ({ onFinish }) => {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [diamonds, setDiamonds] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [filteredDiamonds, setFilteredDiamonds] = useState([]);
  const [categoryTypeId, setCategoryTypeId] = useState(null);
  const [diamondDrawerVisible, setDiamondDrawerVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await fetchCategories(setCategories);
      await fetchMaterials(setMaterials);
      await fetchDiamonds(setDiamonds);
    };
    fetchData();
  }, []);

  const fetchCategories = async (setCategories) => {
    try {
      const response = await CategoryApi.getCategory();
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchMaterials = async (setMaterials) => {
    try {
      const response = await MaterialApi.getMaterials();
      setMaterials(response.data);
    } catch (error) {
      console.error("Failed to fetch materials:", error);
    }
  };

  const fetchDiamonds = async (setDiamonds) => {
    try {
      const response = await DiamondApi.getDiamonds();
      setDiamonds(response.data);
    } catch (error) {
      console.error("Failed to fetch diamonds:", error);
    }
  };

  const handleCategoryChange = (categoryId) => {
    const selectedCategory = categories.find(
      (cat) => cat.categoryId === categoryId
    );
    if (selectedCategory) {
      const { categoryTypeId } = selectedCategory;
      setCategoryTypeId(categoryTypeId);

      if (categoryTypeId === 1 || categoryTypeId === 2 || categoryTypeId === 4) {
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

      if (categoryTypeId === 3 || categoryTypeId === 4) {
        setFilteredDiamonds(diamonds);
      } else {
        setFilteredDiamonds([]);
      }
    }
    form.resetFields(["materialId", "weight", "diamonds"]);
  };

  const handleDiamondSubmit = async (diamondValues) => {
    try {
      const response = await DiamondApi.createDiamondWithPrice(diamondValues); // Your API call to create a diamond
      const newDiamond = response.data;
      setDiamonds([...diamonds, newDiamond]);
      form.setFieldsValue({
        diamonds: [...(form.getFieldValue("diamonds") || []), newDiamond.diamondCode],
      });
      setDiamondDrawerVisible(false);
    } catch (error) {
      console.error("Failed to create diamond:", error);
    }
  };

  const handleProductSubmit = async (values) => {
    const payload = {
      ...values,
      materials: values.materialId ? [{ materialId: values.materialId, weight: values.weight }] : [],
      diamonds: Array.isArray(values.diamonds)
        ? values.diamonds.map((code) => ({ diamondCode: code }))
        : [],
    };
    try {
      await ProductApi.createProduct(payload);
      console.log("Product created successfully:", payload);
      message.success("Product created successfully")
      form.resetFields();
      onFinish(); // Close the drawer after successful form submission
    } catch (error) {
      console.error("Failed to create product:", error);
    }
  };

  return (
    <>
      <Form form={form} onFinish={handleProductSubmit} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="productName"
              label="Product Name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="size" label="Size" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
        </Row>
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
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="materialCost"
              label="Material Cost"
              rules={[{ required: true }]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="diamondCost"
              label="Diamond Cost"
              rules={[{ required: true }]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="productionCost"
              label="Production Cost"
              rules={[{ required: true }]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="priceRate"
              label="Price Rate"
              rules={[{ required: true }]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>
        </Row>
        {categoryTypeId !== 3 && categoryTypeId !== null && (
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="materialId"
                label="Material"
                rules={[{ required: filteredMaterials.length > 0 }]}
              >
                <Select allowClear>
                  {filteredMaterials.map((material) => (
                    <Option key={material.materialId} value={material.materialId}>
                      {material.materialName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="weight"
                label="Weight"
                rules={[{ required: filteredMaterials.length > 0 }]}
              >
                <Input type="number" />
              </Form.Item>
            </Col>
          </Row>
        )}
        {(categoryTypeId === 3 || categoryTypeId === 4) && categoryTypeId !== null && (
          <>
            <Form.Item label="Diamonds">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="diamonds">
                    <Select allowClear>
                      {filteredDiamonds.map((diamond) => (
                        <Option key={diamond.diamondCode} value={diamond.diamondCode}>
                          {diamond.diamondName}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Button type="dashed" onClick={() => setDiamondDrawerVisible(true)}>
                    Create New Diamond
                  </Button>
                </Col>
              </Row>
            </Form.Item>
          </>
        )}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Create Product
          </Button>
        </Form.Item>
      </Form>
      <Drawer
        title="Create New Diamond"
        width={720}
        onClose={() => setDiamondDrawerVisible(false)}
        visible={diamondDrawerVisible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <CreateDiamondForm onFinish={handleDiamondSubmit} />
      </Drawer>
    </>
  );
};

export default CreateProductForm;
