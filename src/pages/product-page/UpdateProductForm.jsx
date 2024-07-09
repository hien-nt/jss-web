import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Drawer,
  Row,
  Col,
  message,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { CategoryApi } from "../../axios/CategoryApi";
import { MaterialApi } from "../../axios/MaterialApi";
import { DiamondApi } from "../../axios/DiamondApi";
import { ProductApi } from "../../axios/ProductApi";
import { getCounters } from "../../services/Counter/CounterServices";
import SelectFormItem from "../../common/FormItem/SelectFormItem";
import { checkDiamondPrice } from "../../services/Diamond/DiamondService";
import { debounce } from "lodash";
import CreateDiamondForm from "./CreateDiamondFrom";

const { Option } = Select;

const UpdateProductForm = ({ productId, onClose, onUpdate, customRequest }) => {
  const [form] = Form.useForm();
  const [counters, setCounters] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [diamonds, setDiamonds] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [filteredDiamonds, setFilteredDiamonds] = useState([]);
  const [categoryTypeId, setCategoryTypeId] = useState(null);
  const [diamondDrawerVisible, setDiamondDrawerVisible] = useState(false);
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryRes, materialRes, diamondRes] = await Promise.all([
          CategoryApi.getCategory(),
          MaterialApi.getMaterials(),
          DiamondApi.getDiamonds(),
        ]);

        setCategories(categoryRes.data);
        setMaterials(materialRes.data);
        setDiamonds(diamondRes.data);

        await fetchProductData(productId); // Fetch product data after loading categories, materials, and diamonds
        getCounters(setCounters);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, [productId]);

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

  const fetchProductData = async (productId) => {
    try {
      const response = await ProductApi.getProductById(productId);
      const productData = response.data;
      console.log(productData);
      setInitialValues(productData);
      form.setFieldsValue({
        ...productData,
        materialId: productData.materialId,
        weight: productData.materialWeight,
        diamonds:
          productData.diamondCode === "No DiamondCode"
            ? []
            : [productData.diamondCode],
      });
      // const selectedCategory = categories.find(
      //   (cat) => cat.categoryId === productData.categoryId
      // );
      // if (selectedCategory) {
      //   setCategoryTypeId(selectedCategory.categoryTypeId);
      // }
      console.log("categoryTypeId - " + categoryTypeId);
      const selectedCategory = categories.find(
        (cat) => cat.categoryId === productData.categoryId
      );
      if (selectedCategory) {
        setCategoryTypeId(selectedCategory.categoryTypeId);

        handleCategoryChange(productData.categoryId, productData.materialId); // Call handleCategoryChange with materialId
      }
      // handleCategoryChange(productData.categoryId);
    } catch (error) {
      console.error("Failed to fetch product data:", error);
    }
  };

  const handleCategoryChange = (categoryId, materialId) => {
    const selectedCategory = categories.find(
      (cat) => cat.categoryId === categoryId
    );
    if (selectedCategory) {
      const { categoryTypeId } = selectedCategory;
      setCategoryTypeId(categoryTypeId);

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

      if (categoryTypeId === 3 || categoryTypeId === 4) {
        setFilteredDiamonds(diamonds);
      } else {
        setFilteredDiamonds([]);
      }

      // Set the materialId and weight after updating filteredMaterials
      form.setFieldsValue({
        materialId: materialId,
        weight: form.getFieldValue("materialWeight"),
      });
    }
  };
  const handleDiamondSubmit = async (diamondValues) => {
    try {
      const response = await DiamondApi.createDiamondWithPrice(diamondValues);
      const newDiamond = response.data;
      await fetchDiamonds(setDiamonds);
      form.setFieldsValue({
        diamonds: [
          ...(form.getFieldValue("diamonds") || []),
          newDiamond.diamondCode,
        ],
      });
      setDiamondDrawerVisible(false);
    } catch (error) {
      console.error("Failed to create diamond:", error);
    }
  };

  const handleProductSubmit = async (values) => {
    const payload = {
      ...values,
      materials: values.materialId
        ? [{ materialId: values.materialId, weight: values.materialWeight }]
        : [],
      diamonds: Array.isArray(values.diamonds)
        ? values.diamonds.map((code) => ({ diamondCode: code }))
        : values.diamonds
        ? [{ diamondCode: values.diamonds }]
        : [],
    };
    console.log("payload update product: " + JSON.stringify(payload));
    console.log("product id - " + productId);

    try {
      await ProductApi.updateProduct(productId, payload);
      message.success("Product updated successfully");
      form.resetFields();
      onUpdate(); // Refresh the product list after updating
      onClose(); // Close the drawer after successful form submission
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  const handleUploadChange = ({ file, fileList }, form) => {
    const { status, response } = file;
    if (status === "done" && response && response.imageUrl) {
      form.setFieldsValue({ img: response.imageUrl });
      message.success(`${file.name} file uploaded successfully.`);
    } else if (status === "error") {
      message.error(`${file.name} file upload failed.`);
    }
    const newFileList = fileList.slice(-1).map((file) => ({
      ...file,
      url: file.response ? file.response.imageUrl : file.url,
    }));
    setFileList(newFileList);
  };

  const numberValidator = (rule, value, callback) => {
    if (value === undefined || value === null) {
      callback("Please enter a value");
    } else if (isNaN(value)) {
      callback("Value must be a number");
    } else if (value < 0) {
      callback("Value must be ≥ 0");
    } else {
      callback();
    }
  };

  return (
    <>
      <Form
        form={form}
        onFinish={handleProductSubmit}
        layout="vertical"
        initialValues={initialValues}
      >
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
        <Form.Item name="img" label="Image URL">
          <Upload
            name="imageFile"
            listType="picture-card"
            fileList={fileList}
            onChange={(info) => handleUploadChange(info, form)}
            customRequest={customRequest}
            accept="image/*"
          >
            {fileList.length < 1 && (
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            )}
          </Upload>
        </Form.Item>
        <SelectFormItem
          itemName="counterId"
          itemLabel="Quầy"
          required="true"
          message="Please fill counter seller belong to!"
          placeholder="Select counter for product"
          options={counters}
          valueProp="counterId"
          labelProp="counterName"
        />
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
              rules={[{ required: true, validator: numberValidator }]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="diamondCost"
              label="Diamond Cost"
              rules={[{ required: true, validator: numberValidator }]}
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
              rules={[{ required: true, validator: numberValidator }]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="priceRate"
              label="Price Rate"
              rules={[{ required: true, validator: numberValidator }]}
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
              name="materialWeight"
              label="Weight"
              rules={[
                { required: filteredMaterials.length > 0 },
                { required: true, validator: numberValidator },
              ]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>
        </Row>
         )} 
        {(categoryTypeId === 3 || categoryTypeId === 4) &&
          categoryTypeId !== null && (
            <>
              <Form.Item label="Diamonds">
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="diamonds">
                      <Select allowClear>
                        {filteredDiamonds.map((diamond) => (
                          <Option
                            key={diamond.diamondCode}
                            value={diamond.diamondCode}
                          >
                            {diamond.diamondName}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Button
                      type="dashed"
                      onClick={() => setDiamondDrawerVisible(true)}
                    >
                      Create New Diamond
                    </Button>
                  </Col>
                </Row>
              </Form.Item>
            </>
          )}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Update Product
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

export default UpdateProductForm;
