import React, { useEffect, useState } from "react";
import { Card, Descriptions, Avatar, Divider, Button, Row, Col } from "antd";
import { UserOutlined, EditOutlined } from "@ant-design/icons";
import { getCurrentAccount } from "../../services/Account/AccountServices";
const Profile = () => {
  const [currentAccount, setCurrentAccount] = useState(null);

  useEffect(() => {
    getCurrentAccount(setCurrentAccount);
  }, []);

  return (
    <>
      <Card
        bordered={false}
        style={{
          borderRadius: "8px",
          boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
          maxWidth: "45%",
          margin: "auto",
          marginTop: "20px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <Avatar size={64} src={currentAccount?.imageUrl}/>
          <h2 style={{ marginTop: "10px" }}>
            {currentAccount?.firstName} {currentAccount?.lastName}
          </h2>
          {/* <p>Role: {currentAccount?.role}</p> */}
        </div>
        <Divider />
        <Descriptions title="User Profile" column={1} size="large" bordered>
          <Descriptions.Item label="Username">
            {currentAccount?.username}
          </Descriptions.Item>
          {/* {currentAccount?.role === "Manager" && (
            <Descriptions.Item label="Farm">
              {currentFarm?.farmName}
            </Descriptions.Item>
          )} */}
          

          <Descriptions.Item label="Phone">
            {currentAccount?.phoneNumber}
          </Descriptions.Item>
          <Descriptions.Item label="Address">
            {currentAccount?.address}{currentAccount?.city}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </>
  );
};

export default Profile;
