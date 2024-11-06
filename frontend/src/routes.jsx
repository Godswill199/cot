// import React from 'react';
// import { Routes, Route } from 'react-router-dom';
// import { PublicRoute, UserProtectedRoute, AdminProtectedRoute } from './components/ProtectedRoutes';

// // Import your components
// import Home from './components/Home';
// import Login from './components/login';
// import Register from './components/register';
// import AdminLogin from './components/AdminLogin';
// import Dashboard from './components/dashboard';
// import AdminDashboard from './components/AdminDashboard';
// import AdminMarketplace from './components/AdminMarketplace';
// import PendingWithdrawals from './components/admin/PendingWithdrawals';
// import TipHistory from './components/admin/TipHistory';
// import ViewAdmins from './components/admin/ViewAdmins';
// import UserMessages from './components/admin/UserMessages';
// import AccountOverview from './components/admin/AccountOverview';
// import TipsterAI from './components/admin/TipsterAI';

// const AppRoutes = () => {
//   return (
//     <Routes>
//       {/* Public Routes */}
//       <Route path="/" element={<Home />} />
//       <Route path="/login" element={
//         <PublicRoute>
//           <Login />
//         </PublicRoute>
//       } />
//       <Route path="/register" element={
//         <PublicRoute>
//           <Register />
//         </PublicRoute>
//       } />
//       <Route path="/admin/login" element={
//         <PublicRoute>
//           <AdminLogin />
//         </PublicRoute>
//       } />

//       {/* Protected User Routes */}
//       <Route path="/dashboard" element={
//         <UserProtectedRoute>
//           <Dashboard />
//         </UserProtectedRoute>
//       } />

//       {/* Protected Admin Routes */}
//       <Route path="/admin/dashboard" element={
//         <AdminProtectedRoute>
//           <AdminDashboard />
//         </AdminProtectedRoute>
//       } />
//       <Route path="/admin/marketplace" element={
//         <AdminProtectedRoute>
//           <AdminMarketplace />
//         </AdminProtectedRoute>
//       } />
//       <Route path="/admin/withdrawals" element={
//         <AdminProtectedRoute>
//           <PendingWithdrawals />
//         </AdminProtectedRoute>
//       } />
//       <Route path="/admin/tip-history" element={
//         <AdminProtectedRoute>
//           <TipHistory />
//         </AdminProtectedRoute>
//       } />
//       <Route path="/admin/view-admins" element={
//         <AdminProtectedRoute>
//           <ViewAdmins />
//         </AdminProtectedRoute>
//       } />
//       <Route path="/admin/messages" element={
//         <AdminProtectedRoute>
//           <UserMessages />
//         </AdminProtectedRoute>
//       } />
//       <Route path="/admin/account" element={
//         <AdminProtectedRoute>
//           <AccountOverview />
//         </AdminProtectedRoute>
//       } />
//       <Route path="/admin/tipster-ai" element={
//         <AdminProtectedRoute>
//           <TipsterAI />
//         </AdminProtectedRoute>
//       } />

//       {/* Catch-all route for 404 */}
//       <Route path="*" element={<div>404 Not Found</div>} />
//     </Routes>
//   );
// };

// export default AppRoutes; 