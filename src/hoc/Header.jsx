import React from "react";
import { UserOutlined } from "@ant-design/icons";
import { Menu, Avatar, Space, Dropdown } from "antd";
import { useAuth } from "../hooks/useAuth";
import getUserInfor from "../utils/getUserInfor";
import { Link } from "react-router-dom";

function CustomHeader({ headerTitle }) {
  const { logout } = useAuth();
  const user = getUserInfor();

  const handleLogout = () => {
    logout();
  };

  const menu = (
     <Menu>
      <Menu.Item key="0">
        {/* Link is used directly here */}
        <Link to="/profile">My Account</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="1" onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <h2>{headerTitle}</h2>

      <Dropdown overlay={menu} trigger={["click"]}>
        <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
          <Avatar icon={<UserOutlined />} /> {user.firstName} {user.lastName}
        </a>
      </Dropdown>
    </div>
  );
}

export default CustomHeader;
