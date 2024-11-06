import React from 'react'
import Navbar from './components/Navbar'
import Banner from './components/Banner'
import About from './components/about'
import Marketplace from './components/marketplace'
import PricingPlans from './components/Tipstar'
import Register from './components/register'
import Login from './components/login'
import LoggedMarketplace from './components/loggedmarketplace'
import InvestmentSimulator from './components/InvestmentSimulator'
import Dashboard from './components/dashboard'
import DepositComponent from './components/deposit'
import TransactionTable from './components/transactions'
import { AdminProtectedRoute, UserProtectedRoute, PublicRoute } from './components/ProtectedRoutes';
import SubscriptionProcess from './components/SubscriptionProcess';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './components/context/AuthContext';
import LoadingSpinner from './components/LoadingSpinner';
import AdminMarketplace from './components/AdminMarketplace';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import AdminRegister from './components/AdminRegister';
import AdminLayout from './components/layouts/AdminLayout';
import ViewAdmins from './components/admin/ViewAdmins';
import UpdatePassword from './components/admin/UpdatePassword';
import AddSubAdmin from './components/admin/AddSubAdmin';
import TopUpUser from './components/admin/TopUpUser';
import TopUpSubAdmin from './components/admin/TopUpSubAdmin';
import EmailUsers from './components/admin/EmailUsers';
import SendNotification from './components/admin/SendNotification';
import UserMessages from './components/admin/UserMessages';
import PendingWithdrawals from './components/admin/PendingWithdrawals';
import AccountOverview from './components/admin/AccountOverview';
import TipsterAI from './components/admin/TipsterAI';
import DepositManagement from './components/admin/DepositManagement';

// Layout for public pages
const PublicLayout = ({ children }) => {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

// Layout for authenticated pages
const DashboardLayout = ({ children }) => {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Navbar />
      <div className="pt-16 min-h-screen bg-[#1e1e1e]">
        {children}
      </div>
    </>
  );
};

// HomePage without Navbar (since it will be added by PublicLayout)
const HomePage = () => (
  <>
    <div className="h-screen">
      <Banner />
    </div>
    <About />
    <Marketplace />
    <PricingPlans />
  </>
);

const App = () => {
  return (
    <GoogleOAuthProvider clientId="934302054018-nrv0l4nv5ssabfjeseesf9d4kqiu7a4t.apps.googleusercontent.com">
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={
              <PublicLayout>
                <HomePage />
              </PublicLayout>
            } />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/admin/login" element={<PublicRoute><AdminLogin /></PublicRoute>} />

            {/* Protected Admin Routes */}
            <Route path="/admin/*" element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <Routes>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="marketplace" element={<AdminMarketplace />} />
                    <Route path="view-admins" element={<ViewAdmins />} />
                    <Route path="password" element={<UpdatePassword />} />
                    <Route path="add-admin" element={<AddSubAdmin />} />
                    <Route path="topup-user" element={<TopUpUser />} />
                    <Route path="topup-admin" element={<TopUpSubAdmin />} />
                    <Route path="email" element={<EmailUsers />} />
                    <Route path="notifications" element={<SendNotification />} />
                    <Route path="messages" element={<UserMessages />} />
                    <Route path="withdrawals" element={<PendingWithdrawals />} />
                    <Route path="account" element={<AccountOverview />} />
                    <Route path="tipster" element={<TipsterAI />} />
                    <Route path="deposits" element={<DepositManagement />} />
                    {/* Add other admin routes here */}
                  </Routes>
                </AdminLayout>
              </AdminProtectedRoute>
            } />

            {/* Protected User Routes */}
            <Route path="/dashboard" element={
              <UserProtectedRoute>
                <Dashboard />
              </UserProtectedRoute>
            } />
            <Route path="/market" element={
              <UserProtectedRoute>
                <DashboardLayout>
                  <LoggedMarketplace />
                </DashboardLayout>
              </UserProtectedRoute>
            } />
            <Route path="/tips" element={
              <UserProtectedRoute>
                <DashboardLayout>
                  <InvestmentSimulator />
                </DashboardLayout>
              </UserProtectedRoute>
            } />
            <Route path="/deposit" element={
              <UserProtectedRoute>
                <DashboardLayout>
                  <DepositComponent />
                </DashboardLayout>
              </UserProtectedRoute>
            } />
            <Route path="/transactions" element={
              <UserProtectedRoute>
                <DashboardLayout>
                  <TransactionTable />
                </DashboardLayout>
              </UserProtectedRoute>
            } />
            <Route path="/subscribe" element={
              <UserProtectedRoute>
                <DashboardLayout>
                  <SubscriptionProcess />
                </DashboardLayout>
              </UserProtectedRoute>
            } />

            {/* Catch all route - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

export default App;