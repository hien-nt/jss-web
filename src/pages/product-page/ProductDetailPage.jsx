import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ProductApi } from "../../axios/ProductApi";
import { Card, Row, Col, Image, Typography, Divider, Tag, Space, Button } from "antd";
import { ShoppingCartOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const ProductDetailPage = () => {
  const [productData, setProductData] = useState(null);
  const { productId } = useParams();
  const statusColors = {
    "Còn hàng": "#95de64",
    "Hết hàng": "#595959",
  };
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await ProductApi.getProductById(productId);
        const productData = response.data;
        setProductData(productData);
      } catch (error) {
        console.error("Failed to fetch product data:", error);
      }
    };

    fetchProductData();
  }, [productId]);

  if (!productData) {
    return <div>Loading...</div>;
  }

  const {
    productName,
    size,
    img,
    counterName,
    materialName,
    materialWeight,
    categoryName,
    productMaterialCost,
    productDiamondCost,
    productionCost,
    productPrice,
    buyBackPrice,
    discountRate,
    priceRate,
    status
  } = productData;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  return (
    <Card style={{ width: '80%', margin: 'auto', marginTop: '20px', padding: '20px' }}>
      <Row gutter={32}>
        <Col span={10}>
          <Image src={img} alt={productName} style={{ width: '100%', marginBottom: '20px' }} />
         
        </Col>
        <Col span={14}>
          <Title level={2}>{productName}</Title>
          <Space size="large">
            <Tag color="blue">{counterName.toUpperCase()}</Tag>
            <Tag color={statusColors[status]}>{status.toUpperCase()}</Tag>
          </Space>
          <Divider />
          <Row gutter={16}>
            <Col span={12}>
              <div style={{ marginBottom: '20px' }}>
                <Title level={4}>Chi tiết sản phẩm</Title>
                <Text><strong>Mã sản phẩm:</strong> {productId}</Text><br />
                <Text><strong>Kích thước:</strong> {size}</Text><br />
                <Text><strong>Vật liệu:</strong> {materialName} ({materialWeight} gram)</Text><br />
                <Text><strong>Danh mục:</strong> {categoryName}</Text><br />
              </div>
            </Col>
            <Col span={12}>
              <div style={{ marginBottom: '20px' }}>
                <Title level={4}>Chi phí</Title>
                <Text><strong>Chi phí vật liệu:</strong> {formatCurrency(productMaterialCost)}</Text><br />
                <Text><strong>Chi phí kim cương:</strong> {formatCurrency(productDiamondCost)}</Text><br />
                <Text><strong>Chi phí sản xuất:</strong> {formatCurrency(productionCost)}</Text><br />
                <Text><strong>Tỉ lệ giảm giá:</strong> {discountRate}%</Text><br />
                <Text><strong>Tỉ lệ áp giá:</strong> {priceRate}%</Text><br />
              </div>
            </Col>
          </Row>
          <Divider />
          <div style={{ marginBottom: '20px' }}>
            <Title level={4}>Giá cả</Title>
            <Text><strong>Giá bán:</strong> {formatCurrency(productPrice)}</Text><br />
            <Text><strong>Giá mua lại:</strong> {formatCurrency(buyBackPrice)}</Text><br />
          </div>
         
        </Col>
      </Row>
    </Card>
  );
};

export default ProductDetailPage;
