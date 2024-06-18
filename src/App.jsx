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
