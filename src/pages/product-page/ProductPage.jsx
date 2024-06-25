import React, { useState, useEffect } from "react";
import { Space, Table, Button, Tag } from "antd";
import { Link } from "react-router-dom";
import { getAllProduct } from "../../services/Product/ProductService";
const statusColors = {
  'Còn hàng': "#95de64",
  'Hết hàng': "#595959",
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const columns = [
  {
    title: "Product ID",
    dataIndex: "productId",
    key: "productId",
  },
  {
    title: "Image",
    dataIndex: "img",
    key: "img",
    render: (image) => (
      <img src={image} alt="Product" style={{ width: "40px", height: "40px", borderRadius: "50%" }} />
    )
  },
  {
    title: "Product Name",
    dataIndex: "productName",
    key: "productName",
  },
  {
    title: "Counter Name",
    dataIndex: "counterName",
    key: "counterName",
  },
  {
    title: "Sell Price",
    dataIndex: "productPrice",
    key: "productPrice",
    render: (price) => formatCurrency(price),  // Use formatCurrency to render price
  },
  {
    title: "Buy Price",
    dataIndex: "buyBackPrice",
    key: "buyBackPrice",
    render: (price) => formatCurrency(price),  // Use formatCurrency to render buy back price
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status) => (
      <Tag color={statusColors[status]}>{status.toUpperCase()}</Tag>
    ),
  },
];

export const ProductPage = () => {
  const [product, setProduct] = useState([]);

  useEffect(() => {
    getAllProduct(setProduct);
  }, []);

  return <Table columns={columns} dataSource={product} pagination={{
    pageSizeOptions: ["5", "7", "10"],
    defaultPageSize: 5,
    showSizeChanger: true,
  }}/>;
};
