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
  InputNumber,
} from "antd";
import InputFormItem from "../../../common/FormItem/InputFormItem";

const MaterialForm = ({
  isVisible,
  handleSubmit,
  handleCancel,
  initialData,
  isEditing,
  materialTypes,
}) => {
  const [form] = Form.useForm();
  const [formType, setFormType] = useState("Create");

  useEffect(() => {
    if (isEditing && initialData) {
      setFormType("Update");
      console.log(initialData);
      form.setFieldsValue({
        materialId: initialData.materialId,
        materialName: initialData.materialName,
        buyPrice: initialData.buyPrice,
        sellPrice: initialData.sellPrice,
        materialTypeId: initialData.materialTypeId,
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
          <Form.Item name="materialId" label="Material ID">
            <Input disabled />
          </Form.Item>
        )}

        <Form.Item
          name="materialTypeId"
          label="Material Type"
          rules={[
            { required: true, message: "Please select a material type!" },
          ]}
        >
          <Select placeholder="Select material type">
            {materialTypes.map((materialType) => (
              <Option
                key={materialType.materialTypeId}
                value={materialType.materialTypeId}
              >
                {materialType.materialTypeName}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <InputFormItem
              itemName="materialName"
              itemLabel="material Name"
              required="true"
              message="Please fill material name!"
            />
          </Col>
        </Row>

        <Form.Item
          name="buyprice"
          label="Buy price for this material"
          rules={[{ required: true, message: "Please input a buy price!" }]}
        >
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item
          name="sellprice"
          label="Sell price for this material"
          rules={[{ required: true, message: "Please input a sell price!" }]}
        >
          <InputNumber min={0} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MaterialForm;
