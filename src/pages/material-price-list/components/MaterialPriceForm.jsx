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
import moment from "moment";

import InputFormItem from "../../../common/FormItem/InputFormItem";

const MaterialPriceForm = ({
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
        materialPriceId: initialData.materialPriceId,
        materialName: initialData.materialName,
        buyPrice: initialData.buyPrice,
        sellPrice: initialData.sellPrice,
        effDate: moment(initialData.effDate),
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
          <Form.Item name="materialPriceId" label="Material Price ID">
            <Input disabled />
          </Form.Item>
        )}

        <Form.Item name="materialName" label="Material Name">
          <Input disabled />
        </Form.Item>

        <Form.Item
          name="buyPrice"
          label="Giá mua của chất liệu này (VND)"
          rules={[{ required: true, message: "Please input a buy price!" }]}
        >
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item
          name="sellPrice"
          label="Giá bán của chất liệu này (VND)"
          rules={[{ required: true, message: "Please input a sell price!" }]}
        >
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item
          name="effDate"
          label="Effective Date"
          rules={[
            { required: true, message: "Please select a effetive date!" },
          ]}
        >
          <DatePicker
            defaultValue={
              initialData?.effDate ? moment(initialData.effDate) : null
            }
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MaterialPriceForm;
