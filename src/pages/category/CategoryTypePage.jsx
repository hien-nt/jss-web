import React, { useState, useEffect } from "react";
import { Table, Tag, Button, Input, Dropdown, Menu } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { getCategoryTypes, createCategoryType, updateCategoryType, createCategory } from "../../services/Category/CategoryServices";
import styled from "styled-components";
import CategoryTypeForm from "./components/CategoryTypeForm";

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const columns = (showModalForEdit) => [
  {
    title: "Category Type ID",
    dataIndex: "categoryTypeId",
    key: "categoryTypeId",
  },
  {
    title: "Category Type Name",
    dataIndex: "categoryTypeName",
    key: "categoryTypeName",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
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

const CategoryTypePage = () => {
  const [categoryType, setCategoryType] = useState([]);
  const [currentCategoryType, setCurrentCategoryType] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleFormCancel = (form) => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const showModalForEdit = (categoryTypeData) => {
    console.log(categoryTypeData);
    setCurrentCategoryType({ ...categoryTypeData }); // Set the Account data to prefill the form
    setIsEditing(true); // We are editing an existing Account
    setIsModalVisible(true);
  };

  const showModalForNew = () => {
    setCurrentCategoryType(null); // No data to prefill the form
    setIsEditing(false); // We are creating a new Account
    setIsModalVisible(true);
  };
  const handleFormSubmit = async (values, form) => {
    const payload = {
      // categoryTypeId: values.categoryTypeId,
      categoryTypeName: values.categoryTypeName,
    };
    console.log(payload);
    if (isEditing) {
      const categoryTypeId = currentCategoryType.categoryTypeId;
      const updatePayload = {
        // categoryTypeId: categoryTypeId,
        categoryTypeName: values.categoryTypeName,
      };

      await updateCategoryType(categoryTypeId, updatePayload, setIsModalVisible, setCategoryType);
    } else {
      await createCategoryType(payload, setIsModalVisible, setCategoryType);
    }
  };

  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategoryType = categoryType.filter((categoryType) =>
    categoryType.categoryTypeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    getCategoryTypes(setCategoryType);
  }, []);

  return (
    <>
      <FlexContainer>
        <Input
          placeholder="Search by category type name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 200 }} // Removed marginBottom as it's now handled by FlexContainer
        />
        <Button onClick={showModalForNew} type="primary">
          New Category Type
        </Button>
      </FlexContainer>
      <Table
        columns={columns(showModalForEdit)}
        dataSource={filteredCategoryType}
        pagination={{
          pageSizeOptions: ["5", "10", "15"],
          defaultPageSize: 5,
          showSizeChanger: true,
        }}
      />

      <CategoryTypeForm
        isVisible={isModalVisible}
        handleSubmit={handleFormSubmit}
        handleCancel={handleFormCancel}
        initialData={currentCategoryType}
        isEditing={isEditing}
      />
    </>
  );
};

export default CategoryTypePage;
