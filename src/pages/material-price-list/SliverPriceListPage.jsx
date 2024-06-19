import React, { useState, useEffect } from "react";
import { Table, Tag } from "antd";
import { getMaterialPrice } from "../../services/Material/MaterialService";

const columns = [
  {
    title: "Material ID",
    dataIndex: "materialId",
    key: "materialId",
  },
  {
    title: "Material Name",
    dataIndex: "materialName",
    key: "materialName",
  },
  {
    title: "Buy Price",
    dataIndex: "buyPrice",
    key: "buyPrice",
    render: (price) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price),
  },
  {
    title: "Sell Price",
    dataIndex: "sellPrice",
    key: "sellPrice",
    render: (price) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price),
  },
  {
    title: "Effective Date",
    dataIndex: "effectiveDate",
    key: "effectiveDate",
  },
];

const SliverPricePage = ({ materialTypeId }) => {
  const [materialsPrice, setMaterialsPrice] = useState([]);

  useEffect(() => {
    getMaterialPrice(2, setMaterialsPrice);
  }, [materialTypeId]);

  return (
    <Table
      columns={columns}
      dataSource={materialsPrice}
      pagination={{
        pageSizeOptions: ["5", "10", "15"],
        defaultPageSize: 5,
        showSizeChanger: true,
      }}
    />
  );
};

export default SliverPricePage;
