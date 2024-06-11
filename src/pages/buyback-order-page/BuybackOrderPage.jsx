import React, { useState, useEffect } from "react";
import { Space, Table, Button, Tag } from "antd";
import { Link } from "react-router-dom";
import { getAllBuyBackOrder } from "../../services/BuyBackOrder/BuyBackOrderService";
const statusColors = {
  Paid: "#ff7875",
  Processing: "#69b1ff", // Darker blue
  Delivered: "#95de64",
  Cancelled: "#595959", // Very light gray or alternative color for visual distinction
};

const columns = [
  {
    title: "ID",
    dataIndex: "orderBuyBackId",
    key: "orderBuyBackId",
  },
  {
    title: "Ngày tạo",
    dataIndex: "dateBuyBack",
    key: "dateBuyBack",
    render: (text) => (text ? text.split("T")[0] : "Not Defined"),
  },
  {
    title: "Khách hàng",
    dataIndex: "customerName",
    key: "customerName",
  },

  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    render: (status) => (
      <Tag color={statusColors[status]}>{status.toUpperCase()}</Tag>
    ),
  },
  {
    title: "Cập nhật",
    key: "update",
    render: (text, record) => (
      <Link to={`/BuyBack-order/detail/${record.orderBuyBackId}`}>
        Chi tiết đơn hàng
      </Link>
    ),
  },

  // {
  //   title: "Xem hóa đơn",
  //   key: "viewInvoice",
  //   render: (_, record) => (
  //     <Space size="middle">
  //       <Button onClick={() => alert(`Viewing invoice for ${record.id}`)}>
  //         Xem hóa đơn
  //       </Button>
  //     </Space>
  //   ),
  // },
];

export const BuyBackOrderPage = () => {
  const [BuyBackOrders, setBuyBackOrders] = useState([]);
  useEffect(() => {
    getAllBuyBackOrder(setBuyBackOrders);
  }, []);

  return (
    <Table
      columns={columns}
      dataSource={BuyBackOrders}
      pagination={{
        // current: currentPage,
        pageSizeOptions: ["5", "7", "10"],
        defaultPageSize: 5,
        showSizeChanger: true,
      }}
    />
  );
};
