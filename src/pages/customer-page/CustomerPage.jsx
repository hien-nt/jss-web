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
  {
    title: "Customer ID",
    dataIndex: "customerId",
    key: "customerId",
  },
  {
    title: "Tier Name",
    dataIndex: "tierName",
    key: "tierName",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Phone",
    dataIndex: "phone",
    key: "phone",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
    render: (address) => (address ? address : "N/A"),
  },
  {
    title: "Loyalty Points",
    dataIndex: "loyaltyPoints",
    key: "loyaltyPoints",
  },
  {
    title: "Discount Percent",
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
