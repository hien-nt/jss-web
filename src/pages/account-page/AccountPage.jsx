import React, { useState, useEffect } from "react";
import { Table, Tag, Button, Input, Dropdown, Menu } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { getCounters } from "../../services/Counter/CounterServices";
import {
  getSellers,
  getAccount,
  createAccount,
  updateAccount,
} from "../../services/Account/AccountServices";
import AccountForm from "./components/AccountForm";
import styled from "styled-components";
import { FileAPI } from "../../axios/FileApi";

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const columns = (showModalForEdit) => [
  {
    title: "Image",
    dataIndex: "imageUrl",
    key: "imageUrl",
    render: (imageUrl) => (
      <img
        src={imageUrl}
        alt="Profile"
        style={{ width: "50px", height: "50px", borderRadius: "50%" }}
      />
    ),
  },
  {
    title: "Tài khoản",
    dataIndex: "username",
    key: "username",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Số  điện thoại",
    dataIndex: "phone",
    key: "phone",
  },

  {
    title: "Địa Chỉ",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Vị trí",
    dataIndex: "role",
    key: "role",
    filters: [
      { text: "Seller", value: "Seller" },
      { text: "Cashier", value: "Cashier" },
    ],
    onFilter: (value, record) => record.role.indexOf(value) === 0,
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    filters: [
      { text: "Active", value: "Active" },
      { text: "Inactive", value: "Inactive" },
    ],
    onFilter: (value, record) => record.status.indexOf(value) === 0,
    render: (status) => (
      <Tag color={status === "Active" ? "green" : "red"}>{status}</Tag>
    ),
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Dropdown
        overlay={
          <Menu>
            <Menu.Item key="1" onClick={() => showModalForEdit(record)}>
              Edit
            </Menu.Item>
            {/* <Menu.Item key="2">Delete</Menu.Item> */}
          </Menu>
        }
      >
        <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
          Actions <DownOutlined />
        </a>
      </Dropdown>
    ),
  },
];

const AccountPage = () => {
  const [sellers, setSellers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [counters, setCounters] = useState([]);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

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

  const handleFormCancel = (form) => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const showModalForEdit = (AccountData) => {
    console.log(AccountData);
    setCurrentAccount({ ...AccountData }); // Set the Account data to prefill the form
    setIsEditing(true); // We are editing an existing Account
    setIsModalVisible(true);
  };

  const showModalForNew = () => {
    setCurrentAccount(null); // No data to prefill the form
    setIsEditing(false); // We are creating a new Account
    setIsModalVisible(true);
  };
  const handleFormSubmit = async (values, form) => {
    const payload = {
      username: values.username,
      password: values.password,
      firstName: values.firstName,
      lastName: values.lastName,
      imageUrl: values.imageUrl,
      phone: values.phone,
      email: values.email,
      address: values.address,
      role: values.role,
      counterId: values.counterId,
    };
    console.log(payload);
    if (isEditing) {
      const accountId = currentAccount.accountId;
      const updatePayload = {
        accountId: accountId,
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
        email: values.email,
        address: values.address,
        imageUrl: values.imageUrl,
        role: values.role,
        counterId: values.counterId,
      };

      await updateAccount(
        accountId,
        updatePayload,
        setIsModalVisible,
        setAccounts
      );
    } else {
      await createAccount(payload, setIsModalVisible, setAccounts);
    }
  };
  useEffect(() => {
    getSellers(setSellers);
    getAccount(setAccounts);
    getCounters(setCounters);
  }, []);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredAccounts = accounts.filter((account) =>
    account.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <FlexContainer>
        <Input
          placeholder="Search by counter name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 200 }} // Removed marginBottom as it's now handled by FlexContainer
        />
        <Button onClick={showModalForNew} type="primary">
          New Account
        </Button>
      </FlexContainer>
      <Table
        columns={columns(showModalForEdit)}
        dataSource={filteredAccounts}
        pagination={{
          pageSizeOptions: ["5", "10", "15"],
          defaultPageSize: 5,
          showSizeChanger: true,
        }}
      />

      <AccountForm
        isVisible={isModalVisible}
        handleSubmit={handleFormSubmit}
        handleCancel={handleFormCancel}
        initialData={currentAccount}
        isEditing={isEditing}
        counters={counters}
        customRequest={customRequest}
      />
    </>
  );
};

export default AccountPage;
