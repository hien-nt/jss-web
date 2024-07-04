import React from "react";
import { Form, Input, Select, Button } from "antd";

const { Option } = Select;

const CreateDiamondForm = ({ onFinish }) => {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    onFinish(values);
    form.resetFields();
  };

  return (
    <Form form={form} onFinish={handleSubmit} layout="vertical">
      <Form.Item
        name="origin"
        label="Origin"
        rules={[{ required: true, message: "Please input the origin!" }]}
      >
        <Select>
          <Option value="Nature">Nature (tự nhiên)</Option>
          <Option value="Lab">Lab (nhân tạo)</Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="caratWeightFrom"
        label="Carat Weight From"
        rules={[
          { required: true, message: "Please input the carat weight from!" },
        ]}
      >
        <Input type="number" />
      </Form.Item>
      <Form.Item
        name="caratWeightTo"
        label="Carat Weight To"
        rules={[
          { required: true, message: "Please input the carat weight to!" },
        ]}
      >
        <Input type="number" />
      </Form.Item>
      <Form.Item
        name="color"
        label="Color"
        rules={[{ required: true, message: "Please select the color!" }]}
      >
        <Select>
          <Option value="D">D</Option>
          <Option value="E">E</Option>
          <Option value="F">F</Option>
          <Option value="J">J</Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="clarity"
        label="Clarity"
        rules={[{ required: true, message: "Please select the clarity!" }]}
      >
        <Select>
          <Option value="IF">IF</Option>
          <Option value="VVS1">VVS1</Option>
          <Option value="VVS2">VVS2</Option>
          <Option value="VS1">VS1</Option>
          <Option value="VS2">VS2</Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="cut"
        label="Cut"
        rules={[{ required: true, message: "Please select the cut!" }]}
      >
        <Select>
          <Option value="Excellent">Excellent</Option>
          <Option value="Brought">Brought</Option>
        </Select>
      </Form.Item>
      {/* <Form.Item
        name="sellPrice"
        label="Sell Price"
        rules={[
          { required: true, message: "Please input the sell price!" },
          { type: "number", min: 1000000, message: "Minimum value is 1,000,000" },
        ]}
      >
        <Input type="number" />
      </Form.Item>
      <Form.Item
        name="buyPrice"
        label="Buy Price"
        rules={[
          { required: true, message: "Please input the buy price!" },
          { type: "number", min: 1000000, message: "Minimum value is 1,000,000" },
        ]}
      >
        <Input type="number" />
      </Form.Item> */}
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Create Diamond
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateDiamondForm;
