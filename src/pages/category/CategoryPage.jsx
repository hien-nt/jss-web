import React, { useState, useEffect } from "react";
import { Table, Tag, Button, Input, Dropdown, Menu } from "antd";
import { DownOutlined } from "@ant-design/icons";
import {
  getCategorys,
  createCategory,
  updateCategory,
  getCategoryTypes,
} from "../../services/Category/CategoryServices";
import styled from "styled-components";
import CategoryForm from "./components/CategoryForm";

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;
const columns = (showModalForEdit) => [
  {
    title: "Category ID",
    dataIndex: "categoryId",
    key: "categoryId",
  },
  {
    title: "Category Name",
    dataIndex: "categoryName",
    key: "categoryName",
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

const CategoryPage = () => {
  const [category, setCategory] = useState([]);
  const [categoryType, setCategoryType] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleFormCancel = (form) => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const showModalForEdit = (categoryData) => {
    console.log(categoryData);
    setCurrentCategory({ ...categoryData }); // Set the Account data to prefill the form
    setIsEditing(true); // We are editing an existing Account
    setIsModalVisible(true);
  };

  const showModalForNew = () => {
    setCurrentCategory(null); // No data to prefill the form
    setIsEditing(false); // We are creating a new Account
    setIsModalVisible(true);
  };
  const handleFormSubmit = async (values, form) => {
    const payload = {
      categoryName: values.categoryName,
      discountRate: values.discountRate,
      categoryTypeId: values.categoryTypeId,
    };
    console.log(payload);
    if (isEditing) {
      const categoryId = currentCategory.categoryId;
      const updatePayload = {
        categoryId: categoryId,
        categoryName: values.categoryName,
        discountRate: values.discountRate,
        categoryTypeId: values.categoryTypeId,
      };

      await updateCategory(categoryId, updatePayload, setIsModalVisible, setCategory);
    } else {
      await createCategory(payload, setIsModalVisible, setCategory);
    }
  };

  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategory = category.filter((categoryType) =>
    categoryType.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  useEffect(() => {
    getCategorys(setCategory);
    getCategoryTypes(setCategoryType)
  }, []);

  return (
    <>
      <FlexContainer>
        <Input
          placeholder="Search by category name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 200 }} // Removed marginBottom as it's now handled by FlexContainer
        />
        <Button onClick={showModalForNew} type="primary">
          New Category
        </Button>
      </FlexContainer>

      <Table
        columns={columns(showModalForEdit)}
        dataSource={filteredCategory}
        pagination={{
          pageSizeOptions: ["5", "10", "15"],
          defaultPageSize: 5,
          showSizeChanger: true,
        }}
      />

      <CategoryForm
        isVisible={isModalVisible}
        handleSubmit={handleFormSubmit}
        handleCancel={handleFormCancel}
        initialData={currentCategory}
        isEditing={isEditing}
        categoryTypes={categoryType}
      />
    </>
  );
};

export default CategoryPage;
