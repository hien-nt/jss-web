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
    title: "Loại bạc | ĐVT: gram",
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

const ClientSliverPricePage = () => {
  const [materialsPrice, setMaterialsPrice] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getMaterialPrice(2, setMaterialsPrice);
  },[]);

  const filteredMaterialPrice = materialsPrice.filter((materialPrice) =>
    materialPrice.materialName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Title>Bảng giá bạc</Title>

      <Search
        placeholder="Tìm kiếm loại bạc"
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

export default ClientSliverPricePage;
