import React, { useState, useEffect } from "react";
import { Table, Input } from "antd";
import styled from "styled-components";
import { getMaterialPrice } from "../../services/Material/MaterialService";

const { Search } = Input;

const StyledTable = styled(Table)`
  .ant-table-thead > tr > th {
    background-color: #262626;
    color: white;
    font-weight: bold;
  }

  .ant-table-tbody > tr > td:first-child {
    text-align: left;
    font-weight: bold;
  }
`;

const Title = styled.h2`
  text-align: center;
  color: #262626;
  font-size: 24px;
`;

const columns = [
  {
    title: "Loại vàng | ĐVT: 1.000đ/Chỉ",
    dataIndex: "materialName",
    key: "materialName",
  },
  {
    title: "Giá mua",
    dataIndex: "buyPrice",
    key: "buyPrice",
    render: (price) =>
      new Intl.NumberFormat("vi-VN", {
        style: "decimal",
      }).format(price),
  },
  {
    title: "Giá bán",
    dataIndex: "sellPrice",
    key: "sellPrice",
    render: (price) =>
      new Intl.NumberFormat("vi-VN", {
        style: "decimal",
      }).format(price),
  },
];

const ClientGoldPricePage = () => {
  const [materialsPrice, setMaterialsPrice] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getMaterialPrice(1, setMaterialsPrice);
  },[]);

  const filteredMaterialPrice = materialsPrice.filter((materialPrice) =>
    materialPrice.materialName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
    <Title>Bảng giá vàng</Title>
    
      <Search
        placeholder="Tìm kiếm loại vàng"
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: 300, marginBottom: 16 }}
      />

      <StyledTable
        columns={columns}
        dataSource={filteredMaterialPrice}
        pagination={{
          pageSizeOptions: ["5", "10", "15"],
          defaultPageSize: 10,
          showSizeChanger: true,
        }}
        rowKey="materialId"
      />
    </>
  );
};

export default ClientGoldPricePage;
