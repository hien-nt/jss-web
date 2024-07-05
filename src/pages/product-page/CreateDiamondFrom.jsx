import React, { useState, useEffect, useCallback } from "react";
import { Form, Input, Select, Button, message } from "antd";
import { debounce } from "lodash";
import { checkDiamondPrice } from "../../services/Diamond/DiamondService";

const { Option } = Select;

const CreateDiamondForm = ({ onFinish }) => {
  const [form] = Form.useForm();
  const [prices, setPrices] = useState({ sellPrice: 0, buyPrice: 0 });
  const [showPriceInputs, setShowPriceInputs] = useState(false);

  const updatePrices = useCallback(
    debounce(async () => {
      const values = form.getFieldsValue(["origin", "caratWeightFrom", "caratWeightTo", "color", "clarity", "cut"]);
      const { origin, caratWeightFrom, caratWeightTo, color, clarity, cut } = values;

      // Check if all required fields are filled
      if (origin && caratWeightFrom && caratWeightTo && color && clarity && cut) {
        try {
          const priceResponse = await checkDiamondPrice(values);

          setPrices({
            sellPrice: priceResponse.sellPrice,
            buyPrice: priceResponse.buyPrice,
          });

          setShowPriceInputs(priceResponse.sellPrice === 0 || priceResponse.buyPrice === 0);
        } catch (error) {
          console.error("Failed to check diamond price:", error);
          message.error("Failed to check diamond price");
        }
      }
    }, 500),
    [form]
  ); // Debounce with 500ms delay

  const handleSubmit = async (values) => {
    if (showPriceInputs) {
      if (values.sellPrice === 0 || values.buyPrice === 0) {
        message.info("Please input valid prices.");
        return;
      }
    } else {
      values.sellPrice = prices.sellPrice;
      values.buyPrice = prices.buyPrice;
    }

    onFinish(values);
    form.resetFields();
    setPrices({ sellPrice: 0, buyPrice: 0 });
    setShowPriceInputs(false);
  };

  useEffect(() => {
    updatePrices();
  }, [form]);

  const numberValidator = (rule, value, callback) => {
    if (value === undefined || value === null) {
      callback("Please enter a value");
    } else if (isNaN(value)) {
      callback("Value must be a number");
    } else if (value <= 0) {
      callback("Value must be > 0");
    } else {
      callback();
    }
  };

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      layout="vertical"
      onValuesChange={updatePrices}
    >
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
          { required: true, validator: numberValidator },
        ]}
      >
        <Input type="number" />
      </Form.Item>
      <Form.Item
        name="caratWeightTo"
        label="Carat Weight To"
        rules={[
          { required: true, message: "Please input the carat weight to!" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || value > getFieldValue('caratWeightFrom')) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Carat weight to must be greater than carat weight from!'));
            },
          }),
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
          {/* <Option value="Brought">Brought</Option> */}
        </Select>
      </Form.Item>
      {!showPriceInputs ? (
        <>
          <Form.Item
            label="Sell Price"
            name="sellPrice"
          >
            <span>{prices.sellPrice}</span>
          </Form.Item>
          <Form.Item
            label="Buy Price"
            name="buyPrice"
          >
            <span>{prices.buyPrice}</span>
          </Form.Item>
        </>
      ) : (
        <>
          <Form.Item
            name="sellPrice"
            label="Sell Price"
            rules={[
              { required: true, validator: numberValidator },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="buyPrice"
            label="Buy Price"
            rules={[
              { required: true, validator: numberValidator },
            ]}
          >
            <Input type="number" />
          </Form.Item>
        </>
      )}
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Create Diamond
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateDiamondForm;
