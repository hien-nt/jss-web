import React from "react";
import { Form, Input } from "antd";
const renderRules = (rule, required, message) => {
  if (rule) {
    return rule;
  } else {
    return [{ required: required, message: message }];
  }
};
const InputFormItem = ({
  itemName,
  itemLabel,
  required,
  message,
  rule,
  disabled,
}) => {
  return (
    <Form.Item
      name={itemName}
      label={itemLabel}
      rules={renderRules(rule, required, message)}
    >
      <Input disabled={disabled} />
    </Form.Item>
  );
};
export default InputFormItem;
