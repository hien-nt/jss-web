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
import ProductPage from "./pages/product-page/ProductPage";
import SliverPricePage from "./pages/material-price-list/SliverPriceListPage";
import DiamondPricePage from "./pages/material-price-list/DiamondPriceListPage";
import CounterPage from "./pages/counter-page/CounterPage";
// import SellerPage from "./pages/seller-page/AccountPage";
import CustomerPage from "./pages/customer-page/CustomerPage";
import CategoryTypePage from "./pages/category/CategoryTypePage";
import CategoryPage from "./pages/category/CategoryPage";
import MaterialPage from "./pages/material-price-list/MaterialPage";
import CreateProductForm from "./pages/product-page/CreateProductForm";
import ClientGoldPricePage from "./pages/material-price-list/ClientGoldPricePage";
import ClientSliverPricePage from "./pages/material-price-list/ClientSliverPrice";
import ClientPage from "./pages/material-price-list/ClientPage";
import Dashboard from "./pages/dashboard/Dashboard";
import ProductDetailPage from "./pages/product-page/ProductDetailPage";
import AccountPage from "./pages/account-page/AccountPage";
import Profile from "./pages/profile-page/Profile";
function App() {
  const ProductRoute = () => {
    const { user } = useAuth();
    switch (user?.role) {
      case "Cashier":
        return <OrderPage />;
      case "Manager":
        return <Unauthorized />;
      default:
        // Redirect or show an unauthorized message for users with no role or unrecognized roles
        return <Unauthorized />;
    }
  };

  const DashboardRoute = () => {
    const { user } = useAuth();
    switch (user?.role) {
      case "Cashier":
        return <OrderPage />;
      case "Manager":
        return <Dashboard />;
      default:
        // Redirect or show an unauthorized message for users with no role or unrecognized roles
        return <Unauthorized />;
    }
  };
  const LoginRoute = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const messageShownRef = useRef(false);

    useEffect(() => {
      // logout()
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
        <Route path="/client-pricelist" element={<ClientPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route element={<ProtectedLayout />}>
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={["Cashier", "Manager"]}>
                <DashboardRoute />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={["Cashier", "Manager"]}>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/sell-order"
            element={
              <ProtectedRoute allowedRoles={["Cashier"]}>
                <OrderPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/purchase-order"
            element={
              <ProtectedRoute allowedRoles={["Cashier"]}>
                <BuyBackOrderPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/approval-order"
            element={
              <ProtectedRoute allowedRoles={["Manager"]}>
                <ApprovalOrderPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/approved-order"
            element={
              <ProtectedRoute allowedRoles={["Cashier"]}>
                <ApprovedOrderPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/gold-price"
            element={
              <ProtectedRoute allowedRoles={["Manager"]}>
                <GoldPriceListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sliver-price"
            element={
              <ProtectedRoute allowedRoles={["Manager"]}>
                <SliverPricePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/diamond-price"
            element={
              <ProtectedRoute allowedRoles={["Manager"]}>
                <DiamondPricePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/products"
            element={
              <ProtectedRoute allowedRoles={["Manager"]}>
                <ProductPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/counters"
            element={
              <ProtectedRoute allowedRoles={["Manager"]}>
                <CounterPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/accounts"
            element={
              <ProtectedRoute allowedRoles={["Manager"]}>
                <AccountPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customers"
            element={
              <ProtectedRoute allowedRoles={["Manager"]}>
                <CustomerPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/category-types"
            element={
              <ProtectedRoute allowedRoles={["Manager"]}>
                <CategoryTypePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/category"
            element={
              <ProtectedRoute allowedRoles={["Manager"]}>
                <CategoryPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/materials"
            element={
              <ProtectedRoute allowedRoles={["Manager"]}>
                <MaterialPage />
              </ProtectedRoute>
            }
          />
          {/* <Route path="/create-product" element={<CreateProductForm />} /> */}

          {/* <Route
            path="/promotion-sell-order"
            element={<PromotionSellOrderPage />}
          /> */}

          <Route
            path="/product/detail/:productId"
            element={
              <ProtectedRoute allowedRoles={["Manager"]}>
                <ProductDetailPage />
              </ProtectedRoute>
            }
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
