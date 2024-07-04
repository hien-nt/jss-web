import React, { useState, useEffect } from "react";
import { Table, Button, Input, Dropdown, Menu } from "antd";
import { DownOutlined } from "@ant-design/icons";
import {
  getCounters,
  createCounter,
  updateCounter,
} from "../../services/Counter/CounterServices";
import { getSellers } from "../../services/Account/AccountServices";
import CounterForm from "./components/CounterForm";
import styled from "styled-components";

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const columns = (showModalForEdit, sellers) => [
  // {
  //   title: "Counter ID",
  //   dataIndex: "counterId",
  //   key: "counterId",
  // },
  {
    title: "Tên Quầy",
    dataIndex: "counterName",
    key: "counterName",
  },
  {
    title: "Phụ Trách",
    dataIndex: "accountId",
    key: "accountId",
    filters: sellers.map((seller) => ({
      text: `${seller.firstName} ${seller.lastName}`,
      value: seller.accountId,
    })),
    onFilter: (value, record) => record.accountId === value,
    render: (text, record) => (
      <div>{record.firstName} {record.lastName}</div>
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

const CounterPage = () => {
  const [counters, setCounters] = useState([]);
  const [sellers, setSellers] = useState([]);

  const [currentCounter, setCurrentCounter] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleFormCancel = (form) => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const showModalForEdit = (record) => {
    setCurrentCounter({ ...record }); // Set the Counter data to prefill the form
    setIsEditing(true); // We are editing an existing Counter
    setIsModalVisible(true);
  };

  const showModalForNew = () => {
    setCurrentCounter(null); // No data to prefill the form
    setIsEditing(false); // We are creating a new Counter
    setIsModalVisible(true);
  };

  const handleFormSubmit = async (values) => {
    const payload = {
      counterName: values.counterName,
      accountId: values.accountId,
    };
    console.log(payload);
    if (isEditing) {
      const counterId = currentCounter.counterId;
      updateCounter(counterId, payload, setIsModalVisible, setCounters);
    } else {
      createCounter(payload, setIsModalVisible, setCounters);
    }
  };

  const [searchTerm, setSearchTerm] = useState("");

  const filteredCounters = counters.filter((counter) =>
    counter.counterName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    getCounters(setCounters);
    getSellers(setSellers);
  }, []);

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
          New Counter
        </Button>
      </FlexContainer>

      <Table
        columns={columns(showModalForEdit, sellers)}
        dataSource={filteredCounters}
        pagination={{
          pageSizeOptions: ["5", "10", "15"],
          defaultPageSize: 5,
          showSizeChanger: true,
        }}
      />

      <CounterForm
        isVisible={isModalVisible}
        handleSubmit={handleFormSubmit}
        handleCancel={handleFormCancel}
        initialData={currentCounter}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        sellers={sellers}
      />
    </>
  );
};

export default CounterPage;
