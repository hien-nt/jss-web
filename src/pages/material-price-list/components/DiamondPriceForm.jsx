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
  DatePicker,
} from "antd";

const DiamondPriceForm = ({
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
        diamondPriceId: initialData.diamondPriceId,
        buyPrice: initialData.buyPrice,
        sellPrice: initialData.sellPrice,
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
          <Form.Item name="diamondPriceId" label="Diamond Price ID">
            <Input disabled />
          </Form.Item>
        )}

        <Form.Item
          name="buyPrice"
          label="Giá mua của kim cương (VND)"
          rules={[{ required: true, message: "Please input a buy price!" }]}
        >
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item
          name="sellPrice"
          label="Giá bán của kim cương (VND)"
          rules={[{ required: true, message: "Please input a sell price!" }]}
        >
          <InputNumber min={0} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DiamondPriceForm;
