import React, { useState, useEffect } from "react";
import { Table, Tag, Button, Input, Dropdown, Menu } from "antd";
import { DownOutlined } from "@ant-design/icons";
import {
  getDiamondPrices,
  updateDiamondPrice,
} from "../../services/Diamond/DiamondService";
import styled from "styled-components";
import DiamondPriceForm from "./components/DiamondPriceForm";
const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const columns = (showModalForEdit, diamondPrices) => [
  // {
  //   title: "Diamond ID",
  //   dataIndex: "diamondPriceId",
  //   key: "diamondPriceId",
  // },
  {
    title: "Origin",
    dataIndex: "origin",
    key: "origin",
    filters: [
      { text: "Natural", value: "Natural" },
    ],
    onFilter: (value, record) => record.origin.indexOf(value) === 0,
  },
  {
    title: "Carat Weight",
    dataIndex: "caratWeightFrom",
    key: "caratWeightFrom",
    render: (text, record) => (
      <div>{`${record.caratWeightFrom} - ${record.caratWeightTo}`}</div>
    ),
  },

  {
    title: "Color",
    dataIndex: "color",
    key: "color",
    filters: [
      { text: "D", value: "D" },
      { text: "E", value: "E" },
      { text: "F", value: "F" },
      { text: "J", value: "J" },
    ],
    onFilter: (value, record) => record.color.indexOf(value) === 0,
  },
  {
    title: "Clarity",
    dataIndex: "clarity",
    key: "clarity",
    filters: [
      { text: "IF", value: "IF" },
      { text: "VVS1", value: "VVS1" },
      { text: "VVS2", value: "VVS2" },
      { text: "VS1", value: "VVS1" },
      { text: "VS2", value: "VVS2" },

    ],
    onFilter: (value, record) => record.clarity.indexOf(value) === 0,
  },
  {
    title: "Cut",
    dataIndex: "cut",
    key: "cut",
    filters: [
      { text: "Excellent", value: "Excellent" },
    ],
    onFilter: (value, record) => record.cut.indexOf(value) === 0,
    
  },
  {
    title: "Sell Price",
    dataIndex: "sellPrice",
    key: "sellPrice",
    render: (price) => formatCurrency(price),
  },
  {
    title: "Buy Price",
    dataIndex: "buyPrice",
    key: "buyPrice",
    render: (price) => formatCurrency(price),
  },
  {
    title: "Effective Date",
    dataIndex: "effDate",
    key: "effDate",
    render: (text) => (text ? text.split("T")[0] : "Not Defined"),

  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Dropdown
        overlay={
          <Menu>
            <Menu.Item key="1" onClick={() => showModalForEdit(record)}>
              Edit
            </Menu.Item>
          </Menu>
        }
      >
        <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
          Actions <DownOutlined />
        </a>
      </Dropdown>
    ),
  },
];

const DiamondPricePage = () => {
  const [diamondPrices, setDiamondPrices] = useState([]);
  const [currentDiamondPrice, setCurrentDiamondPrice] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleFormCancel = (form) => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const showModalForEdit = (diamondPriceData) => {
    console.log(diamondPriceData);
    setCurrentDiamondPrice({ ...diamondPriceData }); // Set the Account data to prefill the form
    setIsEditing(true); // We are editing an existing Account
    setIsModalVisible(true);
  };

  const showModalForNew = () => {
    setCurrentDiamondPrice(null); // No data to prefill the form
    setIsEditing(false); // We are creating a new Account
    setIsModalVisible(true);
  };

  const handleFormSubmit = async (values, form) => {
    const payload = {
      materialName: values.materialName,
      buyprice: values.buyprice,
      sellprice: values.sellprice,
      materialTypeId: values.materialTypeId,
    };
    console.log(payload);
    if (isEditing) {
      const diamondPriceId = currentDiamondPrice.diamondPriceId;
      const updatePayload = {
        diamondPriceId: diamondPriceId,
        buyPrice: values.buyPrice,
        sellPrice: values.sellPrice,
      };

      await updateDiamondPrice(
        diamondPriceId,
        updatePayload,
        setIsModalVisible,
        setDiamondPrices
      );
    } else {
      await createMaterial(payload, setIsModalVisible, setMaterialsPrice);
    }
  };

  useEffect(() => {
    getDiamondPrices(setDiamondPrices);
  }, []);

  return (
    <>
    

    <Table
      columns={columns(showModalForEdit, diamondPrices)}
      dataSource={diamondPrices}
      pagination={{
        pageSizeOptions: ["5", "10", "15"],
        defaultPageSize: 5,
        showSizeChanger: true,
      }}
    />

    <DiamondPriceForm
      isVisible={isModalVisible}
      handleSubmit={handleFormSubmit}
      handleCancel={handleFormCancel}
      initialData={currentDiamondPrice}
      isEditing={isEditing}
    />
  </>
  );
};

export default DiamondPricePage;
