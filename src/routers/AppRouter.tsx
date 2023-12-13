import { Routes, Route, HashRouter } from "react-router-dom";
import RequireAuth from "./RequireAuth";
import MainLayout from "../layouts/mainLayout";
import AuthPage from "../pages/AuthPage";
import Logout from "./Logout";
import AuthLayout from "../layouts/authLayout";
import LoadingPage from "../pages/LoadingPage";
import DashboardPage from "../pages/DashboardPage";
import TreatmentPage from "../pages/TreatmentPage";
import CalendarPage from "../pages/CalendarPage";
import CustomerListPage from "../pages/CustomerListPage";
import CustomerServicePage from "../pages/CustomerServicePage";
import StaffListPage from "../pages/StaffListPage";
import IncomePage from "../pages/IncomePage";
import PayPage from "../pages/PayPage";
import IncomePayPage from "../pages/IncomePayPage";
import ServicePage from "../pages/ServicePage";
import NewPostPage from "../pages/NewPostPage";
import IncomingEventPage from "../pages/IncomingEventPage";
import ServiceListPage from "../pages/ServiceListPage";
import GoodsPage from "../pages/GoodsPage";
import InvoicePage from "../pages/InvoicePage";
import TopCustomer from "../pages/TopCustomer";
import ServedService from "../pages/ServedService";

export default function AppRouter() {
  const protectedLayout = (
    <RequireAuth>
      <MainLayout />
    </RequireAuth>
  );

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<AuthLayout />}>
          <Route index element={<LoadingPage />} />
        </Route>
        <Route path="/home" element={protectedLayout}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="treatments" element={<TreatmentPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="service-list" element={<ServiceListPage />} />
          <Route path="goods" element={<GoodsPage />} />
          <Route path="invoice" element={<InvoicePage />} />
          <Route path="customers" element={<CustomerListPage />} />
          <Route path="customer-service" element={<CustomerServicePage />} />
          <Route path="top-customer" element={<TopCustomer />} />
          <Route path="served-service" element={<ServedService />} />
          <Route path="staffs" element={<StaffListPage />} />
          <Route path="finance">
            <Route path="income" element={<IncomePage />} />
            <Route path="pay" element={<PayPage />} />
          </Route>
          <Route path="reports">
            <Route path="income-pay" element={<IncomePayPage />} />
            <Route path="services" element={<ServicePage />} />
          </Route>
          <Route path="posts">
            <Route path="new-post" element={<NewPostPage />} />
            <Route path="incoming-event" element={<IncomingEventPage />} />
          </Route>
        </Route>
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<AuthPage />} />
          {/* <Route path="sign-up" element={<SignUpPage />} />
          <Route
            path="lock"
            element={
              <RequireAuth>
                <LockPage />
              </RequireAuth>
            }
          /> */}
          {/* <Route path="forgot-password" element={<ForgotPasswordPage />} /> */}
          {/* <Route path="security-code" element={<SecurityCodePage />} /> */}
          {/* <Route path="new-password" element={<NewPasswordPage />} /> */}
        </Route>
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </HashRouter>
  );
}
