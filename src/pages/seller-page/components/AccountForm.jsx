import React, { useEffect, useState } from "react";
import { Form, Modal, Input, Button, Upload, message, Row, Col } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import InputFormItem from "../../../common/FormItem/InputFormItem";
import PhoneNumberInputItem from "../../../common/FormItem/PhoneNumberInputItem";
import SelectFormItem from "../../../common/FormItem/SelectFormItem";

const AccountRole = [
  {
    key: 1,
    value: "Seller",
  },
  {
    key: 2,
    value: "Cashier",
  },
];

const usernameRules = [
  { required: true, message: "Please fill username!" },
  { min: 8, message: "Username must be between 8 and 80 characters long" },
  { max: 80, message: "Username must be between 8 and 80 characters long" },
];
const passwordRules = [
  {
    required: true,
    message: "Please fill password!",
  },
  {
    min: 8,
    message: "Password must be at least 8 characters long.",
  },
  {
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
    message:
      "Password must contain at least one uppercase letter, one lowercase letter, one digit, and be at least 8 characters long.",
  },
];

const AccountForm = ({
  isVisible,
  handleSubmit,
  handleCancel,
  initialData,
  isEditing,
  counters,
}) => {
  const [form] = Form.useForm();
  const [formType, setFormType] = useState("Create");

  useEffect(() => {
    if (isEditing && initialData) {
      setFormType("Update");

      console.log(initialData);
      // Set form initialData if we're editing an existing Account
      form.setFieldsValue({
        accountId: initialData.accountId,
        username: initialData.username,
        password: initialData.password,
        email: initialData.email,
        // firstName: initialData.firstName,
        // lastName: initialData.lastName,
        phone: initialData.phone,
        imageUrl: initialData.imageUrl,
        address: initialData.address,
        counterId: initialData.counterId,
        role: initialData.role,
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
        {!isEditing && (
          <Row gutter={16}>
            <Col span={12}>
              <InputFormItem
                itemName="username"
                itemLabel="Username"
                rule={usernameRules}
              />
            </Col>
            <Col span={12}>
              <InputFormItem
                itemName="password"
                itemLabel="Password"
                rule={passwordRules}
                // message="Please fill password!"
              />
            </Col>
          </Row>
        )}

        {/* <Row gutter={16}>
          <Col span={12}>
            <InputFormItem
              itemName="firstName"
              itemLabel="First Name"
              required="true"
              message="Please fill first name!"
            />
          </Col>
          <Col span={12}>
            <InputFormItem
              itemName="lastName"
              itemLabel="Last Name"
              required="true"
              message="Please fill last name!"
            />
          </Col>
        </Row> */}

        <Row gutter={16}>
          <Col span={12}>
            <InputFormItem
              itemName="address"
              itemLabel="Address"
              required="true"
              message="Please fill address!"
            />
          </Col>
          <Col span={12}>
            <InputFormItem
              itemName="email"
              itemLabel="Email"
              required="true"
              message="Please fill email!"
            />
          </Col>
        </Row>

        <PhoneNumberInputItem
          itemName="phone"
          itemLabel="Phone Number"
          required="true"
          message="Please fill Account phone number!"
          validatePhone={true}
        />

        {!isEditing && (
          <Row gutter={16}>
            <Col span={12}>
              <SelectFormItem
                itemName="counterId"
                itemLabel="Counter"
                required="true"
                message="Please fill counter seller belong to!"
                placeholder="Select counter for seller"
                options={counters}
                valueProp="counterId" // Use 'key' for the value property
                labelProp="counterName" // Use 'value' for the label property
              />
            </Col>
            <Col span={12}>
              <SelectFormItem
                itemName="role"
                itemLabel="Role"
                required="true"
                message="Please select role for account!"
                placeholder="Select role for account"
                options={AccountRole}
                valueProp="value" // Use 'key' for the value property
                labelProp="value" // Use 'value' for the label property
              />
            </Col>
          </Row>
        )}
      </Form>
    </Modal>
  );
};

export default AccountForm;
