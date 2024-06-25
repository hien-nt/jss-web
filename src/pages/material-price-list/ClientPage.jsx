import React, { useState, useEffect } from "react";
import { Table, Input, Tabs } from "antd";
import ClientGoldPricePage from "./ClientGoldPricePage";
import ClientSliverPricePage from "./ClientSliverPrice";
import ClientDiamondPricePage from "./ClientDiamondPricePage";
import styled from "styled-components";

const { TabPane } = Tabs;
const Title = styled.h2`
  text-align: center;
  color: #262626;
  font-size: 24px;
`;
const ClientPage = () => {
  return (
    <>
      <div style={{ margin: "20px" }}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Giá Vàng" key="1">
            <ClientGoldPricePage />
          </TabPane>
          <TabPane tab="Giá Bạc" key="2">
            <ClientSliverPricePage />
          </TabPane>
          <TabPane tab="Giá Kim Cương" key="3">
            <Title>Bảng giá kim cương tự nhiên - Excellent Cut</Title>
            <ClientDiamondPricePage />
          </TabPane>
        </Tabs>
      </div>
    </>
  );
};

export default ClientPage;
