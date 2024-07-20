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
import CreateDiamondForm from "./CreateDiamondFrom";
import { getCounters } from "../../services/Counter/CounterServices";
import SelectFormItem from "../../common/FormItem/SelectFormItem";
const { Option } = Select;

const CreateProductForm = ({ onFinish, customRequest }) => {
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

  useEffect(() => {
    const fetchData = async () => {
      await fetchCategories(setCategories);
      await fetchMaterials(setMaterials);
      await fetchDiamonds(setDiamonds);
      getCounters(setCounters);
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
    }
    form.resetFields(["materialId", "weight", "diamonds"]);
  };

  const handleDiamondSubmit = async (diamondValues) => {
    console.log("payload post product: " + JSON.stringify(diamondValues));

    try {
      const response = await DiamondApi.createDiamondWithPrice(diamondValues);
      const newDiamond = response.data;
      await fetchDiamonds(setDiamonds);

      // setDiamonds([...diamonds, newDiamond]);
      form.setFieldsValue({
        diamonds: [
          ...(form.getFieldValue("diamonds") || []),
          newDiamond.diamondCode,
        ],
      });

      // form.setFieldsValue({
      //   diamonds: { name: newDiamond.diamondName, code: newDiamond.diamondCode },
      // });
      setDiamondDrawerVisible(false);
    } catch (error) {
      console.error("Failed to create diamond:", error);
    }
  };

  const handleProductSubmit = async (values) => {
    const payload = {
      ...values,
      materials: values.materialId
        ? [{ materialId: values.materialId, weight: values.weight }]
        : [],
      diamonds: Array.isArray(values.diamonds)
        ? values.diamonds.map((code) => ({ diamondCode: code }))
        : values.diamonds
        ? [{ diamondCode: values.diamonds }]
        : [],

      // diamonds: values.diamonds ? [{ diamondCode: values.diamond.code }] : [],
    };
    console.log("payload post product: " + JSON.stringify(payload));

    try {
      await ProductApi.createProduct(payload);
      console.log("Product created successfully:", payload);
      message.success("Product created successfully")
      setFileList([]);
      form.resetFields();
      onFinish(); // Close the drawer after successful form submission
    } catch (error) {
      console.error("Failed to create product:", error);
    }
  };

  const handleUploadChange = ({ file, fileList }, form) => {
    const { status, response } = file;

    // Use the Ant Design form API to set the value of the image field
    if (status === "done" && response && response.imageUrl) {
      form.setFieldsValue({ img: response.imageUrl });
      message.success(`${file.name} file uploaded successfully.`);
    } else if (status === "error") {
      message.error(`${file.name} file upload failed.`);
    }

    // Only show the last uploaded file to replace the existing file
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

  const renderDiamondOption = (diamond) => (
    <Option key={diamond.code} value={JSON.stringify(diamond)}>
      {diamond.name}
    </Option>
  );
  return (
    <>
      <Form
        form={form}
        onFinish={handleProductSubmit}
        layout="vertical"
        initialValues={{
          materialCost: 0,
          diamondCost: 0,
          productionCost: 0,
          priceRate: 0,
          weight: 0,
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="productName"
              label="Tên sản phẩm"
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
          valueProp="counterId" // Use 'key' for the value property
          labelProp="counterName" // Use 'value' for the label property
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
              label="Price Rate (%)"
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
                label="Chất liệu"
                rules={[{ required: filteredMaterials.length > 0 }]}
              >
                <Select allowClear>
                  {filteredMaterials.map((material) => (
                    <Option
                      key={material.materialId}
                      value={material.materialId}
                    >
                      {material.materialName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="weight"
                label="Trọng lượng (gram)"
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
                        {/* {filteredDiamonds.map(diamond => renderDiamondOption({ code: diamond.diamondCode, name: diamond.diamondName }))} */}
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
