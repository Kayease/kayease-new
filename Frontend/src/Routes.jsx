import React from "react";
import {
  BrowserRouter,
  Routes as RouterRoutes,
  Route,
  useLocation,
} from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";

//Public Pages
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

//Admin Pages
import Dashboard from "pages/admin/Dashboard";
import ProjectManagement from "pages/admin/ProjectManagement";
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
import UserManagement from "pages/admin/UserManagement";

// Employee Pages
import EmployeeDashboard from "pages/admin/EmployeeDashboard";
import EmployeeProjects from "pages/admin/EmployeeProjects";
import EmployeeTasks from "pages/admin/EmployeeTasks";
import EmployeeAttendance from "pages/admin/EmployeeAttendance";
import EmployeePayslips from "pages/admin/EmployeePayslips";
import EmployeeCalendar from "pages/admin/EmployeeCalendar";

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
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "HR", "WEBSITE MANAGER", "EMPLOYEE"]}>
              <AdminWrapper>
                <Dashboard />
              </AdminWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminWrapper>
                <UserManagement />
              </AdminWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/projects"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "WEBSITE MANAGER"]}>
              <AdminWrapper>
                <ProjectManagement />
              </AdminWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/api-test"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminWrapper>
                <ApiTest />
              </AdminWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/blogs"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "WEBSITE MANAGER"]}>
              <AdminWrapper>
                <BlogManagement />
              </AdminWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/blogs/create"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "WEBSITE MANAGER"]}>
              <AdminWrapper>
                <BlogForm />
              </AdminWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/blogs/edit/:id"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "WEBSITE MANAGER"]}>
              <AdminWrapper>
                <BlogForm />
              </AdminWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/careers"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "HR"]}>
              <AdminWrapper>
                <CareerManagement />
              </AdminWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/careers/create"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "HR"]}>
              <AdminWrapper>
                <CareerForm />
              </AdminWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/careers/edit/:id"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "HR"]}>
              <AdminWrapper>
                <CareerForm />
              </AdminWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/applications"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "HR"]}>
              <AdminWrapper>
                <JobApplicationsPage />
              </AdminWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/portfolio"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "WEBSITE MANAGER"]}>
              <AdminWrapper>
                <PortfolioManagement />
              </AdminWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/portfolio/new"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "WEBSITE MANAGER"]}>
              <AdminWrapper>
                <PortfolioForm />
              </AdminWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/portfolio/edit/:id"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "WEBSITE MANAGER"]}>
              <AdminWrapper>
                <PortfolioForm />
              </AdminWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/clients"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "WEBSITE MANAGER"]}>
              <AdminWrapper>
                <ClientList />
              </AdminWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/clients/new"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "WEBSITE MANAGER"]}>
              <AdminWrapper>
                <ClientForm />
              </AdminWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/clients/:id/edit"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "WEBSITE MANAGER"]}>
              <AdminWrapper>
                <ClientForm />
              </AdminWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/contacts"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "WEBSITE MANAGER"]}>
              <AdminWrapper>
                <ContactManagement />
              </AdminWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/team"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "HR"]}>
              <AdminWrapper>
                <TeamManagement />
              </AdminWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/team/create"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "HR"]}>
              <AdminWrapper>
                <TeamForm />
              </AdminWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/team/edit/:id"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "HR"]}>
              <AdminWrapper>
                <TeamForm />
              </AdminWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/callback-requests"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "WEBSITE MANAGER"]}>
              <AdminWrapper>
                <CallbackRequests />
              </AdminWrapper>
            </ProtectedRoute>
          }
        />

        {/* Employee Routes */}
        <Route
          path="/admin/employee"
          element={
            <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
              <AdminWrapper>
                <EmployeeDashboard />
              </AdminWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/employee/projects"
          element={
            <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
              <AdminWrapper>
                <EmployeeProjects />
              </AdminWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/employee/tasks"
          element={
            <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
              <AdminWrapper>
                <EmployeeTasks />
              </AdminWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/employee/attendance"
          element={
            <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
              <AdminWrapper>
                <EmployeeAttendance />
              </AdminWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/employee/payslips"
          element={
            <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
              <AdminWrapper>
                <EmployeePayslips />
              </AdminWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/employee/calendar"
          element={
            <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
              <AdminWrapper>
                <EmployeeCalendar />
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
