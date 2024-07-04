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

const CounterForm = ({
  isVisible,
  handleSubmit,
  handleCancel,
  initialData,
  isEditing,
  sellers,
}) => {
  const [form] = Form.useForm();
  const [formType, setFormType] = useState("Create");

  useEffect(() => {
    if (isEditing && initialData) {
      setFormType("Update");

      console.log(initialData);
      // Set form initialData if we're editing an existing Account
      form.setFieldsValue({
        counterId: initialData.counterId,
        counterName: initialData.counterName,
        accountId: initialData.accountId,
        // ...set other fields
      });
    } else {
      // Reset form initialData if we're creating a new Account
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
        <Form.Item name="counterId" label="Counter ID">
          <Input disabled />
        </Form.Item>
      )}
        <Row gutter={16}>
          <Col span={12}>
            <InputFormItem
              itemName="counterName"
              itemLabel="Tên Quầy"
              required="true"
              message="Please fill counter name!"
            />
          </Col>
        </Row>

        <Form.Item
          name="accountId"
          label="Phụ Trách"
          rules={[
            { required: true, message: "Please select a seller for counter!" },
          ]}
        >
          <Select placeholder="Select seller for counter">
            {sellers.map((seller) => (
              <Option key={seller.accountId} value={seller.accountId}>
                {seller.username}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CounterForm;
