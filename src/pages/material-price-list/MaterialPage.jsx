import React, { useState, useEffect } from "react";
import { Table, Tag, Button, Input, Dropdown, Menu } from "antd";
import { DownOutlined } from "@ant-design/icons";
import {
  getMaterials,
  createMaterial,
} from "../../services/Material/MaterialService";
import styled from "styled-components";
import MateriaLForm from "./components/MaterialForm";
const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;
const columns = (materialTypes) => [
  // {
  //   title: "Material Type ID",
  //   dataIndex: "materialTypeId",
  //   key: "materialTypeId",
  // },
  {
    title: "Chất Liệu",
    dataIndex: "materialName",
    key: "materialName",
    // filters: materials((material) => ({
    //   text: `${material.materialName}`,
    //   value: material.materialName,
    // })),
    // onFilter: (value, record) => record.materialName === value,
  },
  {
    title: "Phân Loại",
    dataIndex: "materialTypeName",
    key: "materialTypeName",
    filters: [
      { text: "Vàng", value: "Vàng" },
      { text: "Bạc", value: "Bạc" },
    ],
    onFilter: (value, record) => record.materialTypeName.indexOf(value) === 0,
  },
  // {
  //   title: "Material ID",
  //   dataIndex: "materialId",
  //   key: "materialId",
  // },
];

const MaterialPage = () => {
  const [materials, setMaterials] = useState([]);
  const [materialTypes, setMaterialTypes] = useState([]);
  const [currentMaterial, setCurrentMaterial] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleFormCancel = (form) => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const showModalForEdit = (materialData) => {
    console.log(materialData);
    setCurrentMaterial({ ...materialData }); // Set the Account data to prefill the form
    setIsEditing(true); // We are editing an existing Account
    setIsModalVisible(true);
  };

  const showModalForNew = () => {
    setCurrentMaterial(null); // No data to prefill the form
    setIsEditing(false); // We are creating a new Account
    setIsModalVisible(true);
  };
  const handleFormSubmit = async (values, form) => {
    const payload = {
      materialName: values.materialName,
      buyprice: values.buyprice,
      sellprice: values.sellprice,
      materialTypeId: values.materialTypeId,
    };
    console.log(payload);
    if (isEditing) {
      const materialId = currentmaterial.materialId;
      const updatePayload = {
        materialId: materialId,
        materialName: values.materialName,
        buyprice: values.buyprice,
        sellprice: values.sellprice,
        materialTypeId: values.materialTypeId,
      };

      // await updatematerial(materialId, updatePayload, setIsModalVisible, setmaterial);
    } else {
      createMaterial(payload, setIsModalVisible, setMaterials);
    }
  };

  const [searchTerm, setSearchTerm] = useState("");

  const filteredMaterial = materials.filter((material) =>
    material.materialName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    getMaterials(setMaterials);
    setMaterialTypes([
      { materialTypeId: 1, materialTypeName: "Vàng" },
      { materialTypeId: 2, materialTypeName: "Bạc" },
    ]);
  }, []);

  return (
    <>
      <FlexContainer>
        <Input
          placeholder="Search by material name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 200 }} // Removed marginBottom as it's now handled by FlexContainer
        />
        <Button onClick={showModalForNew} type="primary">
          New Material
        </Button>
      </FlexContainer>

      <Table
        columns={columns(showModalForEdit, materialTypes)}
        dataSource={filteredMaterial}
        pagination={{
          pageSizeOptions: ["5", "10", "15"],
          defaultPageSize: 5,
          showSizeChanger: true,
        }}
      />

      <MateriaLForm
        isVisible={isModalVisible}
        handleSubmit={handleFormSubmit}
        handleCancel={handleFormCancel}
        initialData={currentMaterial}
        isEditing={isEditing}
        materialTypes={materialTypes}
      />
    </>
  );
};

export default MaterialPage;
