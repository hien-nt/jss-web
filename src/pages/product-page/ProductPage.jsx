import React, { useState, useEffect } from "react";
import { Space, Table, Button, Tag, Input, Drawer } from "antd";
import { getAllProduct } from "../../services/Product/ProductService";
import CreateProductForm from "./CreateProductForm"; // Adjust the path according to your file structure
import styled from "styled-components";

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
      <img
        src={image}
        alt="Product"
        style={{ width: "40px", height: "40px", borderRadius: "50%" }}
      />
    ),
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
    render: (price) => formatCurrency(price), // Use formatCurrency to render price
  },
  {
    title: "Buy Price",
    dataIndex: "buyBackPrice",
    key: "buyBackPrice",
    render: (price) => formatCurrency(price), // Use formatCurrency to render buy back price
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

const ProductPage = () => {
  const [product, setProduct] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [drawerVisible, setDrawerVisible] = useState(false);

  const filteredProduct = product.filter((product) =>
    product.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    getAllProduct(setProduct);
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
          placeholder="Search by product name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 200 }}
        />

        <Button onClick={showDrawerForNew} type="primary">
          New Product
        </Button>
      </FlexContainer>
      <Table
        columns={columns}
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
        <CreateProductForm onFinish={handleFormSubmit} />
      </Drawer>
    </>
  );
};

export default ProductPage;
