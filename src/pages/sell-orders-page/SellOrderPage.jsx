import React,{useState, useEffect} from "react";
import { Space, Table, Button, Tag } from "antd";
import { Link } from "react-router-dom";
import { getAllSellOrder } from "../../services/SellOrder/SellOrderService";
const statusColors = {
  Paid: "#ff7875",
  Processing: "#69b1ff", // Darker blue
  Delivered: "#95de64",
  Cancelled: "#595959", // Very light gray or alternative color for visual distinction
};

const columns = [
  {
    title: "ID",
    dataIndex: "orderSellId",
    key: "orderSellId",
  },
  {
    title: "Ngày tạo",
    dataIndex: "orderDate",
    key: "orderDate",
    render: (text) => (text ? text.split("T")[0] : "Not Defined"),

  },
  {
    title: "Khách hàng",
    dataIndex: "customerName",
    key: "customerName",
  },
  {
    title: "Nhân viên",
    dataIndex: "sellerLastName",
    key: "sellerLastName",
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    render: (status) => (
      <Tag color={statusColors[status]}>{status.toUpperCase()}</Tag>
    )
  },
  {
    title: "Cập nhật",
    key: "update",
      render: (text, record) => (
        <Link to={`/sell-order/detail/${record.orderSellId}`}>
         Chi tiết đơn hàng
        </Link>
      ),
  },
  {
    title: "Xem hóa đơn",
    key: "viewInvoice",
    render: (_, record) => (
      <Space size="middle">
        <Button onClick={() => alert(`Viewing invoice for ${record.id}`)}>
          Xem hóa đơn
        </Button>
      </Space>
    ),
  },
];



export const OrderPage = () => {
  const [SellOrders, setSellOrders] = useState([]);
  useEffect(() => {
    getAllSellOrder(setSellOrders);
  }, []);

  return <Table columns={columns} dataSource={SellOrders}  pagination={{
    // current: currentPage,
    pageSizeOptions: ["5", "7", "10"],
    defaultPageSize: 5,
    showSizeChanger: true,
  }}/>;
};
