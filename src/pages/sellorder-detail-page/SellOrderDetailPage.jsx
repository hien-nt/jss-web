import React, { useEffect, useState } from "react";
import { Form, Select, Typography, Modal, Steps, Row, Col, Card } from "antd";
import { Avatar, List } from "antd";
import { Button } from "antd";
import {
  DownloadOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
} from "@ant-design/icons";
import { useParams } from "react-router-dom";
import {
  getSellOrderBySellOrderId,
  updateSellOrderPromotionDiscount,
  updateSellOrderToPaid,
} from "../../services/SellOrder/SellOrderService";
import { SellOrderApi } from "../../axios/SellOrderApi";
import getUserInfor from "../../utils/getUserInfor";
const { Option } = Select;
const { Title, Text } = Typography;

const SellOrderDetailPage = () => {
  const { orderSellId } = useParams();
  const {user} = getUserInfor();
  const role = user.role
  const [sellOrderData, setSellOrderData] = useState([]);
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [discountPercent, setDiscountPercent] = useState([]);
  const [selectedPaymentType, setSelectedPaymentType] = useState(null);
  const [isModalUpdatePaidOrderOpen, setIsModalUpdatePaidOrderOpen] =
    useState(false);
  const [invoiceHtml, setInvoiceHtml] = useState("");
  const [isModalInvoiceVisible, setIsModalInvoiceVisible] = useState(false);

  const [isModalPromotionDiscountOpen, setIsModalPromotionDiscountOpen] =
    useState(false);
  const [selectedDiscountPercent, setSelectedDiscountPercent] = useState(null);

  useEffect(() => {
    getSellOrderBySellOrderId(orderSellId, setSellOrderData);
    setPaymentTypes([
      { paymentTypeId: 1, paymentTypeName: "Credit Card", status: "Active" },
      { paymentTypeId: 2, paymentTypeName: "Cash", status: "Active" },
      { paymentTypeId: 3, paymentTypeName: "Bank Transfer", status: "Active" },
      { paymentTypeId: 4, paymentTypeName: "Mobile Payment", status: "Active" },
      { paymentTypeId: 5, paymentTypeName: "PayPal", status: "Active" },
    ]);
    setDiscountPercent([
      { discountId: 1, discountPercent: 10 },
      { discountId: 2, discountPercent: 20 },
      { discountId: 3, discountPercent: 30 },
      { discountId: 4, discountPercent: 40 },
      { discountId: 5, discountPercent: 50 },
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

  const handleSelectChange = (value) => setSelectedPaymentType(value);

  const showModalUpdateOrderToPaid = () => {
    setIsModalUpdatePaidOrderOpen(true);
  };

  const handleCancelPaidOrderUpdate = () => {
    setIsModalUpdatePaidOrderOpen(false);
  };

  //discount-percent
  const showModalPromotionDiscount = () => {
    setIsModalPromotionDiscountOpen(true);
  };

  const handleCancelPromotionDiscount = () => {
    setIsModalPromotionDiscountOpen(false);
  };

  const handleUpdatePromotionDiscount = async () => {
    const payload = {
      individualPromotionDiscount: selectedDiscountPercent,
    };
    updateSellOrderPromotionDiscount(
      payload,
      orderSellId,
      setSellOrderData,
      setIsModalPromotionDiscountOpen
    );
  };

  const {
    customerName,
    customerPhone,
    sellerFirstName,
    sellerLastName,
    orderSellDetails,
    payments = [],
    totalAmount,
    invidualPromotionDiscount,
    memberShipDiscount,
    memberShipDiscountPercent,
    promotionReason,
    finalAmount,
    status,
  } = sellOrderData;

  const stepsWithoutPromotion = ["Processing", "Paid", "Delivered"];
  const stepsWithPromotion = ["Approval", "Approved", "Paid", "Delivered"];
  const stepStatus = promotionReason !== "string"
    ? stepsWithPromotion
    : stepsWithoutPromotion;
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
        {/*Order Status*/}
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

        {/*Customer information*/}
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

        {/*Order Detail*/}
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

        {/*Amount Informaton*/}
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

        {/*Promotion Informaton*/}
        {promotionReason !== "string" && (
          <Card
            title="Promotion Information"
            bordered={false}
            style={{ marginTop: "20px", marginBottom: "20px" }}
          >
            <Row>
              <Col span={12}>
                <Text strong>Promotion Reason:</Text>
              </Col>
              <Col span={12} style={{ textAlign: "right" }}>
                <Text strong>{promotionReason}</Text>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Text strong>Promotion Discount:</Text>
              </Col>
              <Col span={12} style={{ textAlign: "right" }}>
                {invidualPromotionDiscount === null
                  ? <Text strong>Chưa cập nhật</Text>
                  : <Text strong>-{formatCurrency(invidualPromotionDiscount)}</Text>}
              </Col>
            </Row>
          </Card>
        )}

        {/*Final amount, payment Detail*/}
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
              <Text strong>
                {" "}
                {payments.length > 0
                  ? payments[0].paymentTypeName
                  : "Chưa thanh toán"}
              </Text>
            </Col>
          </Row>
        </Card>

        {/*Button update order payment informaton*/}

        {(status === "Processing" || status === "Approved") && (
          <Button
            type="primary"
            size="large"
            onClick={showModalUpdateOrderToPaid}
            style={{ width: "100%", marginTop: "20px" }}
          >
            Cập nhật thanh toán
          </Button>
        )}

        {/*Button view, dowload invoice*/}
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

        {/*Button update promotion discount*/}
        {status === "Approval" && (
          <Button
            type="primary"
            size="large"
            onClick={showModalPromotionDiscount}
            style={{ width: "100%", marginTop: "20px" }}
          >
            Cập nhật khuyến mãi
          </Button>
        )}
      </div>

      {/*Modal update order paid*/}
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

      {/*Modal view, dowload invoice*/}
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

      <Modal
        title="Cập nhật khuyến mãi"
        visible={isModalPromotionDiscountOpen}
        onOk={handleUpdatePromotionDiscount}
        onCancel={handleCancelPromotionDiscount}
        okText="Cập nhật"
        cancelText="Hủy bỏ"
      >
        <Form layout="vertical">
          <Form.Item label="Chọn phần trăm khuyến mãi">
            <Select
              onChange={(value) => setSelectedDiscountPercent(value)}
              placeholder="Chọn phần trăm khuyến mãi"
            >
              {discountPercent.map((discount) => (
                <Option
                  key={discount.discountId}
                  value={discount.discountPercent}
                >
                  {discount.discountPercent}%
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default SellOrderDetailPage;
