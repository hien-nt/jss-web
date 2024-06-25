import React from "react";
import { Form, Input } from "antd";

const PhoneNumberInputItem = ({
  itemName,
  itemLabel,
  required,
  message,
  validatePhone,
}) => {
  // Define a regular expression for phone number validation
  const phoneRegex = /^(?:\+84|0)\d{9,10}$/;

  const rules = [{ required: required, message: message }];

  // Add phone number validation rule if validatePhone is true
  if (validatePhone) {
    rules.push({
      pattern: phoneRegex,
      message:
        "Invalid phone number format. Example: +84912345678 or 0912345678",
    });
  }

  return (
    <Form.Item name={itemName} label={itemLabel} rules={rules}>
      <Input />
    </Form.Item>
  );
};

export default PhoneNumberInputItem;
