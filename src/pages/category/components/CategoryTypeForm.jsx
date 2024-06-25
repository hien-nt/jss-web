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
} from "antd";
import InputFormItem from "../../../common/FormItem/InputFormItem";

const CategoryTypeForm = ({
  isVisible,
  handleSubmit,
  handleCancel,
  initialData,
  isEditing,
}) => {
  const [form] = Form.useForm();
  const [formType, setFormType] = useState("Create");

  useEffect(() => {
    if (isEditing && initialData) {
      setFormType("Update");
      console.log(initialData);
      form.setFieldsValue({
        categoryTypeId: initialData.categoryTypeId,
        categoryTypeName: initialData.categoryTypeName,
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
        <Form.Item name="categoryTypeId" label="Category Type ID">
          <Input disabled />
        </Form.Item>
      )}
        <Row gutter={16}>
          <Col span={12}>
            <InputFormItem
              itemName="categoryTypeName"
              itemLabel="Category Type Name"
              required="true"
              message="Please fill category type name!"
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default CategoryTypeForm;
