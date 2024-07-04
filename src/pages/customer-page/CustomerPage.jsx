import React, { useState, useEffect } from "react";
import { Table, Input } from "antd";
import { getCustomers } from "../../services/Customer/CustomerServices";
import styled from "styled-components";

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;
const columns = [
  // {
  //   title: "Customer ID",
  //   dataIndex: "customerId",
  //   key: "customerId",
  // },
  {
    title: "Tên",
    dataIndex: "name",
    key: "name",
  },
  
  
  {
    title: "Số điện thoại",
    dataIndex: "phone",
    key: "phone",
  },
  {
    title: "Địa chỉ",
    dataIndex: "address",
    key: "address",
    render: (address) => (address ? address : "N/A"),
  },
  {
    title: "Hạng",
    dataIndex: "tierName",
    key: "tierName",
    filters: [
      { text: "Hạng Đồng", value: "Hạng Đồng" },
      { text: "Hạng Bạc", value: "Hạng Bạc" },
      { text: "Hạng Vàng", value: "Hạng Vàng" },
      { text: "Hạng Kim Cương", value: "Hạng Kim Cương" },
    ],
    onFilter: (value, record) => record.tierName.indexOf(value) === 0,
  },
  {
    title: "Điểm tích lũy",
    dataIndex: "loyaltyPoints",
    key: "loyaltyPoints",
  },
  {
    title: "Discount",
    dataIndex: "discountPercent",
    key: "discountPercent",
    render: (discountPercent) => `${discountPercent}%`,
  },
];

const CustomerPage = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    getCustomers(setCustomers);
  }, []);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <FlexContainer>
        <Input
          placeholder="Search by customer name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 200 }} // Removed marginBottom as it's now handled by FlexContainer
        />
       
      </FlexContainer>
    

      
     <Table
      columns={columns}
      dataSource={filteredCustomers}
      pagination={{
        pageSizeOptions: ["5", "10", "15"],
        defaultPageSize: 5,
        showSizeChanger: true,
      }}
    />
    </>
   
  );
};

export default CustomerPage;
