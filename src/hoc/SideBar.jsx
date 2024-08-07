import React from "react";
import { Flex, Menu } from "antd";
import {
  BankOutlined,
  TeamOutlined,
  GoldOutlined,
  LineChartOutlined,
  BranchesOutlined,
  ContainerOutlined,
  FileSyncOutlined,
  BookOutlined,
  UserOutlined,
  UsergroupAddOutlined,
  UnorderedListOutlined ,
  SketchOutlined 
  
} from "@ant-design/icons";
import { Button, Layout } from "antd";
import { useState, useEffect } from "react";
import "../App.css";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import CustomHeader from "./Header";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import logo from "../assets/jss_logo.jpg";
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

function Sidebar({ chooseHeader }) {
  const { user } = useAuth();
  const role = user.role;
  // console.log(role);
  const items =
    role === "Manager"
      ? [
          getItem("Thống Kê", "/", <LineChartOutlined />),
          getItem("Quầy Hàng", "/counters", <BankOutlined />),
          getItem("Tài Khoản", "/accounts",  <UserOutlined />),
          getItem("Khách Hàng", "/customers", <UsergroupAddOutlined />),

          getItem("Đơn Khuyến Mãi", "/approval-order", <BookOutlined />),
          getItem("Sản Phẩm", "/products", <SketchOutlined />),
          getItem("Phân Loại", "sub2", <BranchesOutlined />, [
            getItem("Phân Loại Sản Phẩm", "/category-types"),
            getItem("Loại Sản Phẩm", "/category"),
          ]),
          getItem("Chất Liệu", "/materials", <GoldOutlined />),

        


          getItem("Bảng Giá", "sub", <UnorderedListOutlined />, [
            getItem("Giá Vàng", "/gold-price"),
            getItem("Giá Bạc", "/sliver-price"),
            getItem("Giá Kim Cương", "/diamond-price"),
          ]),

          // getItem("Gold Price", "/gold-price", <GoldOutlined />),
          // getItem("Sliver Price", "/sliver-price", <BranchesOutlined />),
          // getItem("Diamond Price", "/diamond-price", <BranchesOutlined />),

          // getItem("Account", "/account", <TeamOutlined />),
        ]
      : [
          // getItem("Dashboard", "/",  <LineChartOutlined />),
          getItem("Đơn Bán", "/sell-order", <ContainerOutlined />),
          getItem("Đơn Mua", "/purchase-order", <FileSyncOutlined />),
          getItem("Đơn khuyến mãi", "/approved-order", <BookOutlined />),
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
            height: "80px",
            width: "100px",
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
        items={items.map((item) => ({
          ...item,
          className: "small-menu-item",
        }))}
      />
    </>
  );
}

function MenuBar() {
  const [collapsed, setCollapsed] = useState(false);
  const chooseHeader = (header) => {
    sessionStorage.setItem("headerTitle", header); // Save to session storage
    setHeaderTitle(header); // Update local state
  };

  const [headerTitle, setHeaderTitle] = useState(() => {
    return sessionStorage.getItem("headerTitle") || "JSS";
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
