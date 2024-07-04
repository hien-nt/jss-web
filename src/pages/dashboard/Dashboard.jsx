import React, { useState, useEffect } from "react";
import { Card, Col, Row, Statistic, Table } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import styled from "styled-components";
import {
  getSumRevenueAndByCate,
  getOrderAndCusCount,
  getBestSeller,
  getProductSaleData
} from "../../services/Dashboard/DashboardService";
import { getCustomers } from "../../services/Customer/CustomerServices";
// import { getSellers } from "../../services/Account/AccountServices";
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};
const DashboardContainer = styled.div`
  padding: 24px;
  background: #f0f2f5;
`;

const StyledBarChart = styled(BarChart)`
  .recharts-surface {
    width: 105% !important;
    height: 100%;
  }`;


const SummaryCard = styled(Card)`
  margin-bottom: 24px;
`;

const Dashboard = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [countData, setCountData] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [productSaleData, setProductSaleData] = useState({
    dailySales: [],
    weeklySales: [],
    monthlySales: [],
    yearlySales: [],
  });

  const [saleData, setSaleData] = useState([]);

  useEffect(() => {
    // Fetch data from API and update state
    // For demo purposes, we're using static data

    getSumRevenueAndByCate(setRevenueData);
    getOrderAndCusCount(setCountData);
    getCustomers(setCustomers);
    getBestSeller(setBestSellers);
    getProductSaleData(setProductSaleData);
    setSaleData([
      { month: "Jan", revenue: 40000 },
      { month: "Feb", revenue: 30000 },
      { month: "Mar", revenue: 20000 },
      { month: "Apr", revenue: 27800 },
      { month: "May", revenue: 18900 },
      { month: "Jun", revenue: 23900 },
    ]);
  }, []);
  const totalRevenue = revenueData.totalRevenue || 0;
  const threshold = 0.02; // Define a threshold for small categories
  const categoryRevenueData = (revenueData.revenueByCategory || []).reduce(
    (acc, category) => {
      if (category.revenue / totalRevenue < threshold) {
        const otherCategory = acc.find((cat) => cat.name === "Other");
        if (otherCategory) {
          otherCategory.value += category.revenue;
        } else {
          acc.push({ name: "Other", value: category.revenue });
        }
      } else {
        acc.push({ name: category.categoryName, value: category.revenue });
      }
      return acc;
    },
    []
  );
  const columnsCustomers = [
    {
      title: "Customer Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Loyalty Points",
      dataIndex: "loyaltyPoints",
      key: "loyaltyPoints",
      render: (total) => `${total.toLocaleString()}`,
    },
  ];

  const columnsBestSellers = [
    {
      title: "Name",
      dataIndex: "firstName",
      key: "firstName",
      render: (text, record) => (
        <div>
          {text} {record.lastName}
        </div>
      ),
    },
    {
      title: "Total Sales",
      dataIndex: "revenue",
      key: "revenue",
      render: (revenue) => `${(revenue || 0).toLocaleString()} VND`,
    },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  const sortedCustomers = [...customers]
    .sort((a, b) => b.loyaltyPoints - a.loyaltyPoints)
    .slice(0, 3);

  return (
    <DashboardContainer>
      <Row gutter={16}>
        <Col span={8}>
          <SummaryCard>
            <Statistic
              title="Total Revenue"
              value={`${(revenueData.totalRevenue || 0).toLocaleString()} VND`}
              // `${(revenue || 0).toLocaleString()} VND`
              precision={2}
              valueStyle={{ color: "#3f8600" }}
              // suffix="VND"
            />
          </SummaryCard>
        </Col>
        <Col span={8}>
          <SummaryCard>
            <Statistic
              title="Total Sell Orders"
              value={countData.orderSellCount}
              precision={0}
              valueStyle={{ color: "#3f8600" }}
            />
          </SummaryCard>
        </Col>

        <Col span={8}>
          <SummaryCard>
            <Statistic
              title="Total Purchase Orders"
              value={countData.orderBuyBackCount}
              precision={0}
              valueStyle={{ color: "#3f8600" }}
            />
          </SummaryCard>
        </Col>
        {/* <Col span={6}>
          <SummaryCard>
            <Statistic
              title="Total Customers"
              value={countData.customerCount}
              precision={0}
              valueStyle={{ color: "#3f8600" }}
            />
          </SummaryCard>
        </Col> */}
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <SummaryCard title="Revenue by Product Category">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryRevenueData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryRevenueData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </SummaryCard>
        </Col>

        <Col span={12}>
          <SummaryCard title="Monthly Sales">
            <ResponsiveContainer width="100%" height={300}>
              <StyledBarChart data={productSaleData.monthlySales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="totalRevenue" fill="#82ca9d" />
              </StyledBarChart>
            </ResponsiveContainer>
          </SummaryCard>
        </Col>
      </Row>
      
      {/* <Row gutter={16}>
        <Col span={12}>
          <SummaryCard title="Weekly Sales">
            <ResponsiveContainer width="100%" height={300}>
              <StyledBarChart data={productSaleData?.weeklySales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalRevenue" fill="#82ca9d" />
              </StyledBarChart>
            </ResponsiveContainer>
          </SummaryCard>
        </Col> */}
        {/* <Col span={12}>
         <SummaryCard title="Daily Sales">
            <ResponsiveContainer width="100%" height={300} >
              <StyledBarChart data={productSaleData.dailySales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalRevenue" fill="#82ca9d" />
              </StyledBarChart>
            </ResponsiveContainer>
          </SummaryCard>
        </Col> */}
      {/* </Row> */}
      {/* <Row gutter={16}>
        <Col span={12}>
          <SummaryCard title="Yearly Sales">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productSaleData.yearlySales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalRevenue" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </SummaryCard>
        </Col>
      </Row> */}
      <Row gutter={16}>
        <Col span={12}>
          <SummaryCard title="Loyal Customer">
            <Table
              dataSource={sortedCustomers}
              columns={columnsCustomers}
              pagination={false}
            />
          </SummaryCard>
        </Col>
        <Col span={12}>
          <SummaryCard title="Best Sellers">
            <Table
              dataSource={bestSellers}
              columns={columnsBestSellers}
              pagination={false}
            />
          </SummaryCard>
        </Col>
      </Row>
    </DashboardContainer>
  );
};

export default Dashboard;
