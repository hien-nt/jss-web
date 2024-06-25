import React from "react";
import { Form, Select } from "antd";

const { Option } = Select;

/**
 * Generic form item for selection inputs with flexible option properties.
 *
 * @param {object} props - The props for the component.
 * @param {string} props.name - The name of the form item.
 * @param {string} props.label - The label of the form item.
 * @param {string} props.placeholder - The placeholder text for the select input.
 * @param {Array} props.options - The options for the select input.
 * @param {string} props.errorMessage - The error message when validation fails.
 * @param {string} props.valueProp - The property name for the option's value.
 * @param {string} props.labelProp - The property name for the option's label.
 * @returns A form item with a select input.
 */
const SelectFormItem = ({
  itemName,
  itemLabel,
  required,
  placeholder,
  options,
  message,
  valueProp,
  labelProp,
  disabled = false,
}) => (
  <Form.Item
    name={itemName}
    label={itemLabel}
    rules={[{ required: required, message: message }]}
  >
    <Select placeholder={placeholder} allowClear disabled={disabled}>
      {options.map((option) => (
        <Option key={option[valueProp]} value={option[valueProp]}>
          {option[labelProp]}
        </Option>
      ))}
    </Select>
  </Form.Item>
);

export default SelectFormItem;
