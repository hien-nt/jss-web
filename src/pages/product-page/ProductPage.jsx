import React, { useState, useEffect } from "react";
import { Space, Table, Button, Tag, Input, Drawer } from "antd";
import { getAllProduct } from "../../services/Product/ProductService";
import { FileAPI } from "../../axios/FileApi";
import CreateProductForm from "./CreateProductForm"; // Adjust the path according to your file structure
import styled from "styled-components";
import { getCounters } from "../../services/Counter/CounterServices";

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const statusColors = {
  "Còn hàng": "#95de64",
  "Hết hàng": "#595959",
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const columns = (counters) => [
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
      <img
        src={image}
        alt="Product"
        style={{ width: "40px", height: "40px", borderRadius: "50%" }}
      />
    ),
  },
  {
    title: "Tên sản phẩm",
    dataIndex: "productName",
    key: "productName",
  },
  {
    title: "Quầy",
    dataIndex: "counterName",
    key: "counterName",
    filters: counters.map((counter) => ({
      text: `${counter.counterName}`,
      value: counter.counterName,
    })),
    onFilter: (value, record) => record.counterName === value,
  },
  {
    title: "Giá bán",
    dataIndex: "productPrice",
    key: "productPrice",
    render: (price) => formatCurrency(price), // Use formatCurrency to render price
  },
  {
    title: "Giá mua",
    dataIndex: "buyBackPrice",
    key: "buyBackPrice",
    render: (price) => formatCurrency(price), // Use formatCurrency to render buy back price
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    filters: [
      { text: "Còn hàng", value: "Còn hàng" },
      { text: "Hết hàng", value: "Hết hàng" },
    ],
    onFilter: (value, record) => record.status.indexOf(value) === 0,
    render: (status) => (
      <Tag color={statusColors[status]}>{status.toUpperCase()}</Tag>
    ),
  },
];

const ProductPage = () => {
  const [product, setProduct] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [counters, setCounters]= useState([]);

  const customRequest = async (options) => {
    const { onSuccess, onError, file } = options;

    try {
      const response = await FileAPI.uploadFile(file);
      onSuccess(response.data, file);
    } catch (error) {
      console.error("Upload error:", error);
      onError(error);
    }
  };

  const filteredProduct = product.filter(
    (product) =>
      product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.productId.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    getAllProduct(setProduct);
    getCounters(setCounters);
  }, []);

  const showDrawerForNew = () => {
    setDrawerVisible(true);
  };

  const handleDrawerClose = () => {
    setDrawerVisible(false);
  };

  const handleFormSubmit = () => {
    setDrawerVisible(false);
    getAllProduct(setProduct); // Refresh the product list after adding a new product
  };

  return (
    <>
      <FlexContainer>
        <Input
          placeholder="Search by product name or product id"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 200 }}
        />

        <Button onClick={showDrawerForNew} type="primary">
          New Product
        </Button>
      </FlexContainer>
      <Table
        columns={columns(counters)}
        dataSource={filteredProduct}
        pagination={{
          pageSizeOptions: ["5", "7", "10"],
          defaultPageSize: 5,
          showSizeChanger: true,
        }}
      />
      <Drawer
        title="Create New Product"
        width={720}
        onClose={handleDrawerClose}
        visible={drawerVisible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <CreateProductForm onFinish={handleFormSubmit} customRequest={customRequest}
 />
      </Drawer>
    </>
  );
};

export default ProductPage;
