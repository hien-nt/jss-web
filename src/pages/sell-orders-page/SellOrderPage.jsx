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
  // {
  //   title: "Quầy",
  //   dataIndex: "counter",
  //   key: "counter",
  // },
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

const data = [
  {
    key: "1",
    id: "1",
    creationDate: "2024-01-01",
    customer: "John Brown",
    employee: "Jane Doe",
    counter: "Counter 1",
    status: "Processing",
  },
  {
    key: "2",
    id: "2",
    creationDate: "2024-01-02",
    customer: "Jim Green",
    employee: "Jake Black",
    counter: "Counter 2",
    status: "Paid",
  },
  {
    key: "3",
    id: "3",
    creationDate: "2024-01-03",
    customer: "Joe Black",
    employee: "Jill White",
    counter: "Counter 3",
    status: "Delivered",
  },
  {
    key: "4",
    id: "4",
    creationDate: "2024-01-03",
    customer: "Joe Black",
    employee: "Jill White",
    counter: "Counter 4",
    status: "Cancelled",
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
