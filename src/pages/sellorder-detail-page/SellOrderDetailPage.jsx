import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Select,
  Table,
  Typography,
  Modal,
  Steps,
  Descriptions,
  Row,
  Col,
  Card,
} from "antd";
import { Avatar, Divider, List, Skeleton } from "antd";
import { Button, Flex } from "antd";
import {
  DownloadOutlined,
  CheckCircleFilled,
  CloseCircleFilled
} from "@ant-design/icons";
import InfiniteScroll from "react-infinite-scroll-component";
import { useParams } from "react-router-dom";
import {
  getSellOrderBySellOrderId,
  updateSellOrderToPaid,
} from "../../services/SellOrder/SellOrderService";
import { SellOrderApi } from "../../axios/SellOrderApi";
const { Option } = Select;
const { Title, Text } = Typography;

const SellOrderDetailPage = () => {
  const { orderSellId } = useParams();
  const [sellOrderData, setSellOrderData] = useState([]);
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [selectedPaymentType, setSelectedPaymentType] = useState(null);
  const [isModalUpdatePaidOrderOpen, setIsModalUpdatePaidOrderOpen] =
    useState(false);
  const [invoiceHtml, setInvoiceHtml] = useState("");
  const [isModalInvoiceVisible, setIsModalInvoiceVisible] = useState(false);

  useEffect(() => {
    getSellOrderBySellOrderId(orderSellId, setSellOrderData);
    setPaymentTypes([
      { paymentTypeId: 1, paymentTypeName: "Credit Card", status: "Active" },
      { paymentTypeId: 2, paymentTypeName: "Cash", status: "Active" },
      { paymentTypeId: 3, paymentTypeName: "Bank Transfer", status: "Active" },
      { paymentTypeId: 4, paymentTypeName: "Mobile Payment", status: "Active" },
      { paymentTypeId: 5, paymentTypeName: "PayPal", status: "Active" },
    ]);
  }, [orderSellId]);
  // console.log(sellOrderData);

  const fetchInvoice = async () => {
    try {
      const response = await SellOrderApi.viewOrderSellInvoice(orderSellId);
      console.log(response);
      const htmlContent = await response.data; // Assuming the API returns HTML directly
      setInvoiceHtml(htmlContent);
      setIsModalInvoiceVisible(true);
    } catch (error) {
      console.error("Failed to fetch invoice:", error);
    }
  };

  const handleOpenInvoice = () => {
    fetchInvoice();
  };

  const handleDownload = async () => {
    try {
      const response = await SellOrderApi.exportOrderSellInvoice(orderSellId);

      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Invoice_OrderSell_${orderSellId}.pdf`); // Dynamic filename
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading the file", error);
    }
  };

  const handleCancelInvoice = () => {
    setIsModalInvoiceVisible(false);
  };

  const handleUpdateStatus = async () => {
    const payload = {
      orderSellId: sellOrderData.orderSellId,
      payments: [
        {
          paymentTypeId: selectedPaymentType,
          createDate: new Date().toISOString(),
        },
      ],
    };
    updateSellOrderToPaid(
      payload,
      orderSellId,
      setSellOrderData,
      setIsModalUpdatePaidOrderOpen
    );
  };

  // const showModal = () => setIsModalOpen(true);
  // const handleCancel = () => setIsModalOpen(false);
  const handleSelectChange = (value) => setSelectedPaymentType(value);

  // const [isModalOpen, setIsModalOpen] = useState(false);
  const showModalUpdateOrderToPaid = () => {
    setIsModalUpdatePaidOrderOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancelPaidOrderUpdate = () => {
    setIsModalUpdatePaidOrderOpen(false);
  };
  const columns = [
    {
      title: "Items",
      dataIndex: "item",
      key: "item",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
  ];

  const dataProduct = [
    {
      key: "1",
      item: "Dây chuyền vàng 24k",
      type: "Vàng 24k",
      quantity: "1",
      price: "2.500.000 VND",
    },
    {
      key: "2",
      item: "Nhẫn kim cương đính hạt ruby",
      type: "Vàng 24k",
      quantity: "1",
      price: "5.500.000 VND",
    },
    {
      key: "3",
      item: "Nhẫn bạc đính hạt ruby",
      type: "Vàng 24k",
      quantity: "1",
      price: "2.500.000 VND",
    },
    {
      key: "3",
      item: "Nhẫn bạc đính hạt ruby",
      type: "Vàng 24k",
      quantity: "1",
      price: "2.500.000 VND",
    },
    {
      key: "3",
      item: "Nhẫn bạc đính hạt ruby",
      type: "Vàng 24k",
      quantity: "1",
      price: "2.500.000 VND",
    },
    {
      key: "3",
      item: "Nhẫn bạc đính hạt ruby",
      type: "Vàng 24k",
      quantity: "1",
      price: "2.500.000 VND",
    },
  ];

  const description = "This is a description.";

  const items = [
    {
      key: "1",
      label: "Name",
      children: "Zhou Maomao",
    },
    {
      key: "2",
      label: "Telephone",
      children: "1810000000",
    },
    {
      key: "3",
      label: "Order Date",
      children: "31/05/2024",
    },
  ];

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const loadMoreData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    fetch(
      "https://randomuser.me/api/?results=10&inc=name,gender,email,nat,picture&noinfo"
    )
      .then((res) => res.json())
      .then((body) => {
        setData([...data, ...body.results]);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadMoreData();
  }, []);
  const {
    customerName,
    customerPhone,
    sellerFirstName,
    sellerLastName,
    orderSellDetails,
    payments=[],
    totalAmount,
    memberShipDiscount,
    memberShipDiscountPercent,
    finalAmount,
    status,
  } = sellOrderData;

  const stepStatus = ["Processing", "Paid", "Delivered"];
  const currentStep = stepStatus.indexOf(status);
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };
  return (
    // <div style={{ maxWidth: 600, margin: "0 auto" }}>
    //
    //   {sellOrderData && (
    //     <>
    //       <Descriptions title="Order Info">
    //         <Descriptions.Item label="Status">
    //           {sellOrderData.status}
    //         </Descriptions.Item>
    //       </Descriptions>

    //       <Button type="primary" onClick={showModal}>
    //         Update Payment and Status
    //       </Button>

    //     </>
    //   )}

    //   <Button type="primary" onClick={handleOpenInvoice}>
    //     View Invoice
    //   </Button>

    // </div>

    <>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <Card title="Order Status" bordered={false}>
        {status !== "Cancelled" && (
             <Steps current={currentStep}>
             {stepStatus.map((step, index) => (
               <Steps.Step
                 key={index}
                 title={step}
                 icon={index <= currentStep ? <CheckCircleFilled /> : null}
               />
             ))}
           </Steps>
          )}
        

          {status === "Cancelled" && (
            <Title level={4} type="danger">
              <CloseCircleFilled /> Order Cancelled
            </Title>
          )}
        </Card>

        <Card
          title="Customer Information"
          bordered={false}
          style={{ marginTop: "20px" }}
        >
          <Row>
            <Col span={12}>
              <Text style={{ fontSize: "16px" }}>Name: </Text>{" "}
              <Text strong style={{ fontSize: "14px" }}>
                {customerName}
              </Text>
            </Col>
            <Col span={12} style={{ textAlign: "right" }}>
              <Text style={{ fontSize: "16px" }}>Phone: </Text>{" "}
              <Text strong style={{ fontSize: "14px" }}>
                {customerPhone}
              </Text>
            </Col>
          </Row>
        </Card>

        <Card
          title={`Order #${orderSellId} Details`}
          bordered={false}
          style={{ marginTop: "20px" }}
        >
          <List
            itemLayout="horizontal"
            dataSource={orderSellDetails}
            renderItem={(item) => (
              <List.Item key={item.orderSellDetailId}>
                <Row style={{ width: "100%" }} align="middle">
                  <Col span={6}>
                    <Avatar src={item.productImage} shape="square" size={64} />
                  </Col>
                  <Col
                    span={10}
                    style={{
                      paddingLeft: "10px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Text strong>{item.productName}</Text>
                  </Col>
                  <Col
                    span={4}
                    style={{
                      textAlign: "center",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Text strong>x{item.quantity}</Text>
                  </Col>
                  <Col span={4} style={{ textAlign: "right" }}>
                    <Text strong>{formatCurrency(item.price)}</Text>
                  </Col>
                </Row>
              </List.Item>
            )}
          />
        </Card>

        <Card
          title="Payment Information"
          bordered={false}
          style={{ marginTop: "20px", marginBottom: "20px" }}
        >
          <Row>
            <Col span={12}>
              <Text strong>Total Amount:</Text>
            </Col>
            <Col span={12} style={{ textAlign: "right" }}>
              <Text strong>{formatCurrency(totalAmount)}</Text>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Text strong>
                Membership Discount ({memberShipDiscountPercent}%):
              </Text>
            </Col>
            <Col span={12} style={{ textAlign: "right" }}>
              <Text strong>-{formatCurrency(memberShipDiscount)}</Text>
            </Col>
          </Row>
        </Card>

        <Card title="Final Amount">
          <Row>
            <Col span={12}>
              <Text strong>Final Amount:</Text>
            </Col>
            <Col span={12} style={{ textAlign: "right" }}>
              <Text strong style={{ color: "#ff4d4f", fontSize: "20px" }}>
                {formatCurrency(finalAmount)}
              </Text>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Text strong>Payment Method:</Text>
            </Col>
            <Col span={12} style={{ textAlign: "right" }}>
              <Text strong> {payments.length > 0 ? payments[0].paymentTypeName : "Chưa thanh toán"}</Text>
            </Col>
          </Row>
        </Card>

        {status === "Processing" && (
          <Button
            type="primary"
            size="large"
            onClick={showModalUpdateOrderToPaid}
            style={{ width: "100%", marginTop: "20px" }}
          >
            Cập nhật thanh toán
          </Button>
        )}

        {(status === "Paid" || status === "Delivered") && (
          <Button
            type="primary"
            size="large"
            onClick={handleOpenInvoice}
            style={{ width: "100%", marginTop: "20px" }}
          >
            Xem hóa đơn
          </Button>
        )}
      </div>

      <Modal
        title="Update Order Status"
        visible={isModalUpdatePaidOrderOpen}
        onOk={handleUpdateStatus}
        onCancel={handleCancelPaidOrderUpdate}
        okText="Submit"
        cancelText="Cancel"
      >
        <Form layout="vertical">
          <Form.Item label="Chọn hình thức thanh toán">
            <Select
              onChange={handleSelectChange}
              placeholder="Select a payment type"
            >
              {paymentTypes.map((pt) => (
                <Option key={pt.paymentTypeId} value={pt.paymentTypeId}>
                  {pt.paymentTypeName}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Invoice"
        visible={isModalInvoiceVisible}
        onCancel={handleCancelInvoice}
        footer={null}
        width={900}
      >
        <div
          dangerouslySetInnerHTML={{ __html: invoiceHtml }}
          style={{ overflowY: "auto", maxHeight: 500 }}
        />
        <Row justify="end" style={{ marginTop: 20 }}>
          <Col>
            <Button
              type="primary"
              onClick={handleDownload}
              style={{ marginTop: 20 }}
            >
              <DownloadOutlined />
              Download PDF
            </Button>
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default SellOrderDetailPage;
