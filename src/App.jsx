import { useState, useEffect, useRef } from "react";
import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import ProtectedLayout from "./auth/ProtectedLayout";
import { ProtectedRoute } from "./hoc/ProtectedRoute";
import { message } from "antd";
import { OrderPage } from "./pages/sell-orders-page/SellOrderPage";
import LoginPage from "./pages/login-page/LoginPage";
import Unauthorized from "./pages/unauthorized-page/Unauthorized";
import CashierDashboardPage from "./pages/cashier-dashboard/CashierDashboardPage";
import ManagerDashboardPage from "./pages/manager-dashboard/ManagerDashboardPage";
import PromotionSellOrderPage from "./pages/promotion-sell-order-page/PromotionSellOrderPage";
import { BuyBackOrderPage } from "./pages/buyback-order-page/BuybackOrderPage";
import BuybackOrderDetailPage from "./pages/buybackorder-detail-page/BuybackOrderDetailPage";
import SellOrderDetailPage from "./pages/sellorder-detail-page/SellOrderDetailPage";
import ApprovalOrderPage from "./pages/approval-order-page/ApprovalOrderPage";
import GoldPriceListPage from "./pages/material-price-list/GoldPriceListPage";
import { ApprovedOrderPage } from "./pages/approved-order-page/AprovedOrderPage";
import { ProductPage } from "./pages/product-page/ProductPage";
import SliverPricePage from "./pages/material-price-list/SliverPriceListPage";
import DiamondPricePage from "./pages/material-price-list/DiamondPriceListPage";
import CounterPage from "./pages/counter-page/CounterPage";
import SellerPage from "./pages/seller-page/SellersPage";
import CustomerPage from "./pages/customer-page/CustomerPage";
import CategoryTypePage from "./pages/category/CategoryTypePage";
import CategoryPage from "./pages/category/CategoryPage";
import MaterialPage from "./pages/material-price-list/MaterialPage";
import CreateProductForm from "./pages/product-page/CreateProductForm";
import ClientGoldPricePage from "./pages/material-price-list/ClientGoldPricePage";
import ClientSliverPricePage from "./pages/material-price-list/ClientSliverPrice";
import ClientPage from "./pages/material-price-list/ClientPage";

function App() {
  const DashboardRoute = () => {
    const { user } = useAuth();
    switch (user?.role) {
      case "Cashier":
        return <OrderPage />;
      case "Manager":
        return <ManagerDashboardPage />;
      default:
        // Redirect or show an unauthorized message for users with no role or unrecognized roles
        return <Unauthorized />;
    }
  };
  const LoginRoute = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const messageShownRef = useRef(false);

    useEffect(() => {
      // Check if user exists and the message has not yet been shown
      if (user && !messageShownRef.current) {
        message.error("User already logged in, cannot access the login page.");
        messageShownRef.current = true; // Mark message as shown
        navigate("/", { replace: true }); // Navigate away replacing the current route
      }
    }, [user, navigate]);

    // Avoid rendering Login if the user is already logged in
    if (user) return null;

    return <LoginPage />;
  };
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginRoute />} />
        <Route path="/gold-price-client" element={<ClientGoldPricePage />} />
        <Route path="/sliver-price-client" element={<ClientSliverPricePage />} />
        <Route path="/client-price" element={<ClientPage />} />



        <Route element={<ProtectedLayout />}>
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={["Cashier", "Manager"]}>
                <DashboardRoute />
              </ProtectedRoute>
            }
          />

          <Route path="/sell-order" element={<OrderPage />} />
          <Route path="/purchase-order" element={<BuyBackOrderPage />} />
          <Route path="/approval-order" element={<ApprovalOrderPage />} />
          <Route path="/approved-order" element={<ApprovedOrderPage />} />

          <Route path="/gold-price" element={<GoldPriceListPage />} />
          <Route path="/sliver-price" element={<SliverPricePage />} />
          <Route path="/diamond-price" element={<DiamondPricePage />} />

          <Route path="/products" element={<ProductPage />} />
          <Route path="/counters" element={<CounterPage />} />
          <Route path="/accounts" element={<SellerPage />} />
          <Route path="/customers" element={<CustomerPage />} />

          <Route path="/category-types" element={<CategoryTypePage />} />
          <Route path="/category" element={<CategoryPage />} />

          <Route path="/materials" element={<MaterialPage />} />
          <Route path="/create-product" element={<CreateProductForm />} />

          <Route
            path="/promotion-sell-order"
            element={<PromotionSellOrderPage />}
          />

          <Route
            path="/sell-order/detail/:orderSellId"
            element={
              <ProtectedRoute allowedRoles={["Cashier"]}>
                <SellOrderDetailPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/buyback-order/detail/:orderBuyBackId"
            element={
              <ProtectedRoute allowedRoles={["Cashier"]}>
                <BuybackOrderDetailPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/approval-order/detail/:orderSellId"
            element={
              <ProtectedRoute allowedRoles={["Manager"]}>
                <SellOrderDetailPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
