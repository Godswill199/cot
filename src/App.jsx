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
import { UserProtectedRoute } from './components/ProtectedRoutes';
import SubscriptionProcess from './components/SubscriptionProcess';


import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './components/context/AuthContext';

const HomePage = () => (
  <div>
    <Navbar />
    <div className="h-screen">
      <Banner />
    </div>
    <About />
    <Marketplace />
    <PricingPlans />
  </div>
);

// const ProtectedRoute = ({ children }) => {
//   const { isUserLoggedIn, loading } = useAuth();

//   if (loading) {
//     return <div className="flex items-center justify-center h-screen">
//       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
//     </div>;
//   }

//   if (!isUserLoggedIn) {
//     return <Navigate to="/login" />;
//   }

//   return children;
// };

const publicRoutes = [
  { path: '/', element: <HomePage /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> }
];



const protectedRoutes = [
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/market', element: <LoggedMarketplace /> },
  { path: '/tips', element: <InvestmentSimulator /> },
  { path: '/deposit', element: <DepositComponent /> },
  { path: '/transactions', element: <TransactionTable /> },
  { path: '/subscribe', element: <SubscriptionProcess /> }
];

const App = () => {
  return (
<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Router>
          <Routes>
            {publicRoutes.map(route => (
              <Route 
                key={route.path} 
                path={route.path} 
                element={route.element} 
              />
            ))}

            {protectedRoutes.map(route => (
              <Route 
                key={route.path} 
                path={route.path} 
                element={<UserProtectedRoute>{route.element}</UserProtectedRoute>} 
              />
            ))}
          </Routes>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

export default App;