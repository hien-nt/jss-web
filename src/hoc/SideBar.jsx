import React from "react";
import { Flex, Menu } from "antd";
import { FireOutlined, HomeOutlined } from "@ant-design/icons";
import {
  TwitterOutlined,
  BankOutlined,
  DingdingOutlined,
  LogoutOutlined,
  TeamOutlined,
  GoldOutlined,
  LineChartOutlined, 
  BranchesOutlined 
} from "@ant-design/icons";
import { Button, Layout } from "antd";
import { useState, useEffect } from "react";
import "../App.css";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import CustomHeader from "./Header";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import logo from "../assets/jss_logo.jpg";
// import getUserInfor from "../utils/getUserInfor";
import { useAuth } from "../hooks/useAuth";

const { Sider, Header, Content } = Layout;
function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
// const ManagerItems = [
//   getItem("Dashboard", "/", <LineChartOutlined />),
//   getItem("Area", "/area", <GoldOutlined />),
//   getItem("Cage", "/cage", <BankOutlined />),
//   getItem("Breeding Management", "/breeding", <HomeOutlined />),
//   getItem("Bird Information", "sub", <TwitterOutlined />, [
//     getItem("Bird", "/bird"),
//     // getItem("Type", "/type"),
//     getItem("Species", "/specie"),
//   ]),
//   getItem("Staff", "/staff", <TeamOutlined />),
// ];

function Sidebar({ chooseHeader }) {
  const { user } = useAuth();
  const role = user.role;
  // console.log(role);
  const items =
    role === "Manager"
      ? [
          getItem("Dashboard", "/",  <LineChartOutlined />),
          getItem("Farm", "/farm", <GoldOutlined />),
          getItem("Area", "/area", <BankOutlined />),
          getItem("Species", "/species", <BranchesOutlined /> ),
          getItem("Account", "/account", <TeamOutlined />),
        ]
      : [
          getItem("Dashboard", "/",  <LineChartOutlined />),
          getItem("Sell Order", "/sell-order",  <LineChartOutlined />),
          getItem("Purchase Order", "/purchase-order", <GoldOutlined />),
          getItem("Sell Promotion Order ", "/promotion-sell-order", <BankOutlined />),
          // getItem("Breeding", "/breeding", <HomeOutlined />),
        ];

  const findSelectedItemLabel = (key, items) => {
    // Find item at the top level.
    let selectedItem = items.find((item) => item.key === key);
    if (selectedItem) {
      return selectedItem.label;
    }

    for (const item of items) {
      if (item.children) {
        const foundChild = item.children.find((child) => child.key === key);
        if (foundChild) {
          return foundChild.label;
        }
      }
    }

    return null;
  };
  const navigate = useNavigate();

  return (
    <>
      <Flex align="center" justify="center">
        <div
          className="logo"
          style={{
            backgroundImage: `url(${logo})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            height: "110px",
            width: "120px",
          }}
        >
          {/* The content of this div can remain empty if you just want to show the logo */}
        </div>
      </Flex>
      <Menu
        mode="vertical"
        defaultSelectedKeys={[1]}
        className="menu-bar"
        onClick={({ key }) => {
          const selectedItem = items.find((item) => item.key === key);
          if (key === "signout") {
            // logout();
          } else {
            const label = findSelectedItemLabel(key, items);
            if (label) {
              navigate(key);
              chooseHeader(label);
            }
          }
        }}
        items={items}
      />
    </>
  );
}

function MenuBar() {
  const [collapsed, setCollapsed] = useState(false);
  const chooseHeader = (header) => {
    sessionStorage.setItem('headerTitle', header); // Save to session storage
    setHeaderTitle(header);  // Update local state
  };
  
  const [headerTitle, setHeaderTitle] = useState(() => {
    return sessionStorage.getItem('headerTitle') || 'Dashboard';
  });
  return (
    <Layout>
      <Sider
        theme="light"
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="sider"
      >
        <Sidebar chooseHeader={chooseHeader} />
        <Button
          type="text"
          icon={collapsed ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          className="triger-btn"
        />
      </Sider>
      <Layout>
        <Header className="header">
          <CustomHeader headerTitle={headerTitle} />
        </Header>
        <Content className="content">
          {/* contenthere */}
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default MenuBar;
