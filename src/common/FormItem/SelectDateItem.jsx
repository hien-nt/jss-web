import React from "react";
import { Form, Select } from "antd";

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
const SelectDateItem = ({ name, label, require, errorMessage }) => (
  <Form.Item
    name={name}
    label={label}
    rules={[{ required: require, message: errorMessage }]}
  >
    <DatePicker />
  </Form.Item>
);

export default SelectDateItem;
