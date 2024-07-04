import React, { useState, useEffect } from "react";
import { Table, Tag, Button, Input, Dropdown, Menu } from "antd";
import { DownOutlined } from "@ant-design/icons";
import {
  getMaterialPrice,
  updateMaterialPrice,
} from "../../services/Material/MaterialService";
import styled from "styled-components";
import MaterialPriceForm from "./components/MaterialPriceForm";
const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;
const columns = (showModalForEdit, materialsPrice) => [
  // {
  //   title: "Material ID",
  //   dataIndex: "materialId",
  //   key: "materialId",
  // },
  {
    title: "Material Name",
    dataIndex: "materialName",
    key: "materialName",
     filters: materialsPrice.map((materialsPrice) => ({
      text: `${materialsPrice.materialName}`,
      value: materialsPrice.materialName,
    })),
    onFilter: (value, record) => record.materialName === value,
  },
  {
    title: "Buy Price",
    dataIndex: "buyPrice",
    key: "buyPrice",
    render: (price) =>
      new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(price),
  },
  {
    title: "Sell Price",
    dataIndex: "sellPrice",
    key: "sellPrice",
    render: (price) =>
      new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(price),
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

const SliverPricePage = ({ materialTypeId }) => {
  const [materialsPrice, setMaterialsPrice] = useState([]);
  const [currentMaterialPrice, setCurrentMaterialPrice] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleFormCancel = (form) => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const showModalForEdit = (materialPriceData) => {
    console.log(materialPriceData);
    setCurrentMaterialPrice({ ...materialPriceData }); // Set the Account data to prefill the form
    setIsEditing(true); // We are editing an existing Account
    setIsModalVisible(true);
  };

  const showModalForNew = () => {
    setCurrentMaterialPrice(null); // No data to prefill the form
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
      const materialPriceId = currentMaterialPrice.materialPriceId;
      const updatePayload = {
        materialPriceId: materialPriceId,
        buyPrice: values.buyPrice,
        sellPrice: values.sellPrice,
        effDate: values.effDate,
      };

      await updateMaterialPrice(
        materialPriceId,
        updatePayload,
        setIsModalVisible,
        2,
        setMaterialsPrice
      );
    } else {
      await createMaterial(payload, setIsModalVisible, setMaterialsPrice);
    }
  };

  const [searchTerm, setSearchTerm] = useState("");

  const filteredMaterialPrice = materialsPrice.filter((materialPrice) =>
    materialPrice.materialName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    getMaterialPrice(2, setMaterialsPrice);
  }, [materialTypeId]);

  return (
    <>
      <FlexContainer>
        <Input
          placeholder="Search by material name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 200 }} // Removed marginBottom as it's now handled by FlexContainer
        />
      </FlexContainer>

      <Table
        columns={columns(showModalForEdit, materialsPrice)}
        dataSource={filteredMaterialPrice}
        pagination={{
          pageSizeOptions: ["5", "10", "15"],
          defaultPageSize: 5,
          showSizeChanger: true,
        }}
      />

      <MaterialPriceForm
        isVisible={isModalVisible}
        handleSubmit={handleFormSubmit}
        handleCancel={handleFormCancel}
        initialData={currentMaterialPrice}
        isEditing={isEditing}
      />
    </>
  );
};

export default SliverPricePage;
