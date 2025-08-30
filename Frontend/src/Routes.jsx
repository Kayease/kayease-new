import React from "react";
import {
  BrowserRouter,
  Routes as RouterRoutes,
  Route,
  useLocation,
} from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import Homepage from "pages/homepage";
import Blog from "pages/blog";
import BlogDetail from "pages/blog/BlogDetail";
import Contact from "pages/contact";
import Portfolio from "pages/portfolio";
import Services from "pages/services";
import About from "pages/about";
import Careers from "pages/careers";
import Login from "pages/auth/Login";
import Register from "pages/auth/Register";
import Dashboard from "pages/admin/Dashboard";
import EmployeeDashboard from "pages/employee/Dashboard";
import HRDashboard from "pages/hr/Dashboard";
import ManagerDashboard from "pages/manager/Dashboard";
import WebsiteManagerDashboard from "pages/websiteManager/Dashboard";
import UserManagement from "pages/admin/UserManagement";
import ApiTest from "pages/admin/ApiTest";
import BlogManagement from "pages/admin/BlogManagement";
import BlogForm from "pages/admin/BlogForm";
import CareerManagement from "pages/admin/CareerManagement";
import CareerForm from "pages/admin/CareerForm";
import JobApplicationsPage from "pages/admin/JobManager";
import PortfolioManagement from "pages/admin/Portfolio";
import PortfolioForm from "pages/admin/PortfolioForm";
import PortfolioDetail from "pages/portfolio/PortfolioDetail";
import ClientForm from "pages/admin/ClientForm";
import ClientList from "pages/admin/ClientList";
import ContactManagement from "pages/admin/ContactManagement";
import TeamManagement from "pages/admin/TeamManagement";
import TeamForm from "pages/admin/TeamForm";
import CallbackRequests from "pages/admin/CallbackRequests";
import NotFound from "pages/NotFound";
import PrivacyPolicy from "pages/legal/PrivacyPolicy";
import TermsOfService from "pages/legal/TermsOfService";
import CookiePolicy from "pages/legal/CookiePolicy";
import Header from "components/ui/Header";
import Footer from "components/ui/Footer";
import ProtectedRoute from "components/ProtectedRoute";
import AdminWrapper from "components/admin/AdminWrapper";
import { PendingCountsProvider } from "contexts/PendingCountsContext";
import FloatingButtons from "components/FloatingButtons";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AppLayout = () => {
  const location = useLocation();
  const isAuthPage = ["/login", "/register"].includes(location.pathname);
  const isAdminPage = location.pathname.startsWith("/admin") || location.pathname.startsWith("/employee") || location.pathname.startsWith("/hr") || location.pathname.startsWith("/manager") || location.pathname.startsWith("/website-manager");

  return (
    <ErrorBoundary>
      <ScrollToTop />
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {!isAuthPage && !isAdminPage && (
        <PendingCountsProvider>
          <Header />
        </PendingCountsProvider>
      )}
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<Homepage />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blogs/:id" element={<BlogDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/portfolio/:slug" element={<PortfolioDetail />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Legal Pages */}
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/cookies" element={<CookiePolicy />} />

        {/* Protected Admin Routes */}
        {/* Employee Dashboard (copy of admin) */}
        <Route
          path="/employee"
          element={
            <ProtectedRoute>
              <AdminWrapper>
                <EmployeeDashboard />
              </AdminWrapper>
            </ProtectedRoute>
          }
        />
        {/* HR Dashboard */}
        <Route
          path="/hr"
          element={
            <ProtectedRoute>
              <AdminWrapper>
                <HRDashboard />
              </AdminWrapper>
            </ProtectedRoute>
          }
        />
        {/* Manager Dashboard */}
        <Route
          path="/manager"
          element={
            <ProtectedRoute>
              <AdminWrapper>
                <ManagerDashboard />
              </AdminWrapper>
            </ProtectedRoute>
          }
        />
        {/* Website Manager Dashboard */}
        <Route
          path="/website-manager"
          element={
            <ProtectedRoute>
              <AdminWrapper>
                <WebsiteManagerDashboard />
              </AdminWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminWrapper>
                <Dashboard />
              </AdminWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminWrapper>
                <UserManagement />
              </AdminWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/api-test"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminWrapper>
                <ApiTest />
              </AdminWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/blogs"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminWrapper>
                <BlogManagement />
              </AdminWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/blogs/create"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminWrapper>
                <BlogForm />
              </AdminWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/blogs/edit/:id"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminWrapper>
                <BlogForm />
              </AdminWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/careers"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminWrapper>
                <CareerManagement />
              </AdminWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/careers/create"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminWrapper>
                <CareerForm />
              </AdminWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/careers/edit/:id"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminWrapper>
                <CareerForm />
              </AdminWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/applications"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminWrapper>
                <JobApplicationsPage />
              </AdminWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/portfolio"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminWrapper>
                <PortfolioManagement />
              </AdminWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/portfolio/new"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminWrapper>
                <PortfolioForm />
              </AdminWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/portfolio/edit/:id"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminWrapper>
                <PortfolioForm />
              </AdminWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/clients"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminWrapper>
                <ClientList />
              </AdminWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/clients/new"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminWrapper>
                <ClientForm />
              </AdminWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/clients/:id/edit"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminWrapper>
                <ClientForm />
              </AdminWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/contacts"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminWrapper>
                <ContactManagement />
              </AdminWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/team"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminWrapper>
                <TeamManagement />
              </AdminWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/team/create"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminWrapper>
                <TeamForm />
              </AdminWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/team/edit/:id"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminWrapper>
                <TeamForm />
              </AdminWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/callback-requests"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminWrapper>
                <CallbackRequests />
              </AdminWrapper>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      {!isAuthPage && !isAdminPage && <Footer />}
      <FloatingButtons />
    </ErrorBoundary>
  );
};

const Routes = () => {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
};

export default Routes;
