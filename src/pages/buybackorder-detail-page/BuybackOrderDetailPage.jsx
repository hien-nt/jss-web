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
  UserOutlined,
  DownloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CloseCircleFilled,
  CheckCircleFilled,
} from "@ant-design/icons";
import InfiniteScroll from "react-infinite-scroll-component";
import { useParams } from "react-router-dom";
import {
  getBuyBackOrderByBuyBackOrderId,
  updateBuyBackOrderToPaid,
} from "../../services/BuyBackOrder/BuyBackOrderService";
import { BuyBackOrderApi } from "../../axios/BuyBackOrderApi";
const { Option } = Select;
const { Title, Text } = Typography;

const BuyBackOrderDetailPage = () => {
  const { orderBuyBackId } = useParams();
  const [BuyBackOrderData, setBuyBackOrderData] = useState([]);
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [selectedPaymentType, setSelectedPaymentType] = useState(null);
  const [isModalUpdatePaidOrderOpen, setIsModalUpdatePaidOrderOpen] =
    useState(false);
  const [invoiceHtml, setInvoiceHtml] = useState("");
  const [isModalInvoiceVisible, setIsModalInvoiceVisible] = useState(false);

  useEffect(() => {
    getBuyBackOrderByBuyBackOrderId(orderBuyBackId, setBuyBackOrderData);
    setPaymentTypes([
      { paymentTypeId: 2, paymentTypeName: "Tiền mặt", status: "Active" },
      {
        paymentTypeId: 3,
        paymentTypeName: "Thanh toán chuyển khoản",
        status: "Active",
      },
    ]);
  }, [orderBuyBackId]);
  // console.log(BuyBackOrderData);

  const fetchInvoice = async () => {
    try {
      const response = await BuyBackOrderApi.viewOrderBuyBackInvoice(
        orderBuyBackId
      );
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
      const response = await BuyBackOrderApi.exportOrderBuyBackInvoice(
        orderBuyBackId
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Invoice_OrderBuyBack_${orderBuyBackId}.pdf`
      ); // Dynamic filename
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
      orderBuyBackId: BuyBackOrderData.orderBuyBackId,
      payments: [
        {
          paymentTypeId: selectedPaymentType,
          createDate: new Date().toISOString(),
        },
      ],
    };
    updateBuyBackOrderToPaid(
      payload,
      orderBuyBackId,
      setBuyBackOrderData,
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

  const {
    customerName,
    customerPhone,
    orderBuyBackDetails,
    payments = [],
    totalAmount,
    finalAmount,
    status,
  } = BuyBackOrderData;

  const stepStatus = ["Processing", "Paid"];
  const currentStep = stepStatus.indexOf(status);
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };
  return (
    <>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <Card title="Trạng thái đơn hàng" bordered={false}>
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
              <CloseCircleFilled /> Đơn đã hủy
            </Title>
          )}
        </Card>

        <Card
          title="Thông tin khách hàng"
          bordered={false}
          style={{ marginTop: "20px" }}
        >
          <Row>
            <Col span={12}>
              <Text style={{ fontSize: "16px" }}>Tên: </Text>{" "}
              <Text strong style={{ fontSize: "14px" }}>
                {customerName}
              </Text>
            </Col>
            <Col span={12} style={{ textAlign: "right" }}>
              <Text style={{ fontSize: "16px" }}>Số điện thoại: </Text>{" "}
              <Text strong style={{ fontSize: "14px" }}>
                {customerPhone}
              </Text>
            </Col>
          </Row>
        </Card>

        <Card
          title={`Order #${orderBuyBackId} Details`}
          bordered={false}
          style={{ marginTop: "20px" }}
        >
          <List
            itemLayout="horizontal"
            dataSource={orderBuyBackDetails}
            renderItem={(item) => (
              <List.Item key={item.orderBuyBackDetailId}>
                <Row style={{ width: "100%" }} align="middle">
                  {/* <Col span={6}>
                    <Avatar src={item.productImage} shape="square" size={64} />
                  </Col> */}
                  <Col
                    span={14}
                    style={{
                      paddingLeft: "10px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Text strong>{item.productName}</Text>
                  </Col>
                  <Col
                    span={6}
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
          title="Thông tin thanh toán"
          bordered={false}
          style={{ marginTop: "20px", marginBottom: "20px" }}
        >
          <Row>
            <Col span={12}>
              <Text strong>Tổng tiền hàng:</Text>
            </Col>
            <Col span={12} style={{ textAlign: "right" }}>
              <Text strong>{formatCurrency(totalAmount)}</Text>
            </Col>
          </Row>
        </Card>

        <Card title="Giá tiền cần thanh toán">
          <Row>
            <Col span={12}>
              <Text strong>Tổng tiền:</Text>
            </Col>
            <Col span={12} style={{ textAlign: "right" }}>
              <Text strong style={{ color: "#ff4d4f", fontSize: "20px" }}>
                {formatCurrency(finalAmount)}
              </Text>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Text strong>Phương thức thanh toán:</Text>
            </Col>
            <Col span={12} style={{ textAlign: "right" }}>
              <Text strong>
                {" "}
                {payments.length > 0
                  ? payments[0].paymentTypeName
                  : "Chưa thanh toán"}
              </Text>
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
            Xác nhận thanh toán cho khách hàng
          </Button>
        )}

        {status === "Paid" && (
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
          <Form.Item label="Xác nhận hình thức thanh toán cho khách hàng">
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

export default BuyBackOrderDetailPage;
