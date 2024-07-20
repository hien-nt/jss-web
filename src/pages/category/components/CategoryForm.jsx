import React, { useEffect, useState } from "react";
import {
  Form,
  Select,
  Modal,
  Input,
  Button,
  Upload,
  message,
  Row,
  Col,
  InputNumber
} from "antd";
import InputFormItem from "../../../common/FormItem/InputFormItem";

const CategoryForm = ({
  isVisible,
  handleSubmit,
  handleCancel,
  initialData,
  isEditing,
  categoryTypes,
}) => {
  const [form] = Form.useForm();
  const [formType, setFormType] = useState("Create");

  useEffect(() => {
    if (isEditing && initialData) {
      setFormType("Update");
      console.log(initialData);
      form.setFieldsValue({
        categoryId: initialData.categoryId,
        categoryName: initialData.categoryName,
        discountRate: initialData.discountRate,
        categoryTypeId: initialData.categoryTypeId,
      });
    } else {
      setFormType("Create");
      form.resetFields();
    }
  }, [form, isEditing, initialData, setFormType]);

  return (
    <Modal
      title={formType}
      open={isVisible}
      onOk={() => form.submit()}
      onCancel={() => handleCancel(form)}
      okText={formType}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {isEditing && (
          <Form.Item name="categoryId" label="Category ID">
            <Input disabled />
          </Form.Item>
        )}
        <Row gutter={16}>
          <Col span={12}>
            <InputFormItem
              itemName="categoryName"
              itemLabel="Loại sản phẩm"
              required="true"
              message="Please fill category name!"
            />
          </Col>
        </Row>

        <Form.Item
          name="discountRate"
          label="Discount cho loại sản phẩm này (%)"
          rules={[{ required: true, message: "Please input a discount rate!" }]}
        >
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item
          name="categoryTypeId"
          label="Phân loại"
          rules={[
            { required: true, message: "Please select a category type!" },
          ]}
        >
          <Select placeholder="Select category type">
            {categoryTypes.map((categoryType) => (
              <Option
                key={categoryType.categoryTypeId}
                value={categoryType.categoryTypeId}
              >
                {categoryType.categoryTypeName}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CategoryForm;
