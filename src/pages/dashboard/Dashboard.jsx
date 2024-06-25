import React, { useState, useEffect } from "react";
import { Card, Col, Row, Statistic, Table } from "antd";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import styled from "styled-components";

const DashboardContainer = styled.div`
  padding: 24px;
  background: #f0f2f5;
`;

const SummaryCard = styled(Card)`
  margin-bottom: 24px;
`;

const Dashboard = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [categoryRevenueData, setCategoryRevenueData] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [customerIncomeData, setCustomerIncomeData] = useState([]);
  const [bestSellersData, setBestSellersData] = useState([]);

  useEffect(() => {
    // Fetch data from API and update state
    // For demo purposes, we're using static data
    setRevenueData([
      { month: "Jan", revenue: 40000 },
      { month: "Feb", revenue: 30000 },
      { month: "Mar", revenue: 20000 },
      { month: "Apr", revenue: 27800 },
      { month: "May", revenue: 18900 },
      { month: "Jun", revenue: 23900 },
    ]);
    setCategoryRevenueData([
      { category: "Rings", revenue: 40000 },
      { category: "Necklaces", revenue: 30000 },
      { category: "Bracelets", revenue: 20000 },
      { category: "Earrings", revenue: 27800 },
    ]);
    setOrdersData([
      { key: '1',  customer: 'My Tam', total: 54000 },
      { key: '2',  customer: 'Nhu', total: 44000 },
      // Add more orders as needed
    ]);
    setCustomerIncomeData([
      { name: 'Tiep Em', income: 50000 },
      // Add more customer incomes as needed
    ]);
    setBestSellersData([
      { key: '1', name: 'Tiep Em', totalSales: 60000 },
      { key: '2', name: 'Hoang Nguyen', totalSales: 55000 },
      // Add more best sellers as needed
    ]);
  }, []);

  const columnsOrders = [
   
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total) => `$${total.toLocaleString()}`,
    },
   
  ];

  const columnsBestSellers = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Total Sales',
      dataIndex: 'totalSales',
      key: 'totalSales',
      render: (totalSales) => `$${totalSales.toLocaleString()}`,
    },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <DashboardContainer>
      <Row gutter={16}>
        <Col span={6}>
          <SummaryCard>
            <Statistic
              title="Total Revenue"
              value={11893}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix="$"
              suffix="VND"
            />
          </SummaryCard>
        </Col>
        <Col span={6}>
          <SummaryCard>
            <Statistic
              title="Total Sell Orders"
              value={1128}
              precision={0}
              valueStyle={{ color: '#3f8600' }}
            />
          </SummaryCard>
        </Col>

        <Col span={6}>
          <SummaryCard>
            <Statistic
              title="Total Purchase Orders"
              value={1128}
              precision={0}
              valueStyle={{ color: '#3f8600' }}
            />
          </SummaryCard>
        </Col>
        <Col span={6}>
          <SummaryCard>
            <Statistic
              title="Total Customers"
              value={93}
              precision={0}
              valueStyle={{ color: '#3f8600' }}
            />
          </SummaryCard>
        </Col>
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
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="revenue"
                >
                  {categoryRevenueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </SummaryCard>
        </Col>
        <Col span={12}>
          <SummaryCard title="Revenue By Month">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={revenueData}
                margin={{
                  top: 5, right: 30, left: 20, bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </SummaryCard>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <SummaryCard title="Loyal Customer">
            <Table dataSource={ordersData} columns={columnsOrders} pagination={false} />
          </SummaryCard>
        </Col>
        <Col span={12}>
          <SummaryCard title="Best Sellers">
            <Table dataSource={bestSellersData} columns={columnsBestSellers} pagination={false} />
          </SummaryCard>
        </Col>
      </Row>
    </DashboardContainer>
  );
};

export default Dashboard;
