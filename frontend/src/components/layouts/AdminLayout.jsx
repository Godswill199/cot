import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  MdDashboard,
  MdPerson,
  MdMessage,
  MdNotifications,
  MdPayment,
  MdSmartToy,
  MdEmail,
  MdStorefront,
  MdSportsScore,
  MdAccountBalance,
  MdSupervisorAccount,
  MdLock,
  MdGroup,
  MdLogout
} from 'react-icons/md';

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const menuItems = [
    { icon: <MdDashboard />, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: <MdPerson />, label: 'Account Overview', path: '/admin/account' },
    { icon: <MdMessage />, label: 'User Messages', path: '/admin/messages' },
    { icon: <MdNotifications />, label: 'Send Notification', path: '/admin/notifications' },
    { icon: <MdPayment />, label: 'Pending Withdrawal', path: '/admin/withdrawals' },
    { icon: <MdSmartToy />, label: 'Tipster AI', path: '/admin/tipster' },
    { icon: <MdEmail />, label: 'Email Users', path: '/admin/email' },
    { icon: <MdStorefront />, label: 'Marketplace', path: '/admin/marketplace' },
    { icon: <MdSportsScore />, label: 'Upload Tips', path: '/admin/tips' },
    { icon: <MdAccountBalance />, label: 'Top Up User Account', path: '/admin/topup-user' },
    { icon: <MdSupervisorAccount />, label: 'Top Up Sub Admin', path: '/admin/topup-admin' },
    { icon: <MdGroup />, label: 'Add Sub Admin', path: '/admin/add-admin' },
    { icon: <MdLock />, label: 'Update Password', path: '/admin/password' },
    { icon: <MdGroup />, label: 'View Admin', path: '/admin/view-admins' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (window.innerWidth < 768) {
        const sidebar = document.querySelector('.sidebar');
        if (isMenuOpen && sidebar && !sidebar.contains(event.target)) {
          setIsMenuOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-[#1f1f1f] flex">
      {/* Sidebar */}
      <div 
        className={`fixed h-full bg-[#282828] transition-all duration-300 ${
          isMenuOpen ? 'w-64' : 'w-20'
        } shadow-xl z-50`}
      >
        {/* Logo and toggle section */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <img
            src="/src/assets/logo.png"
            alt="Logo"
            className={`transition-all duration-300 ${isMenuOpen ? 'w-32' : 'w-12'}`}
          />
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white hover:text-[#fece00] transition-colors duration-200"
          >
            {isMenuOpen ? '←' : '→'}
          </button>
        </div>

        {/* Menu Items */}
        <div className="py-4 px-3 flex flex-col h-[calc(100vh-80px)]">
          {/* Main menu items in a scrollable container */}
          <div className="flex-1 space-y-2 overflow-y-auto pr-1">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  navigate(item.path);
                  if (window.innerWidth < 768) {
                    setIsMenuOpen(false);
                  }
                }}
                className={`
                  w-full flex items-center px-4 py-2.5 rounded-lg
                  text-gray-300 hover:bg-[#fece00] hover:text-black
                  transition-all duration-200 ease-in-out text-sm
                  ${isMenuOpen ? 'justify-start' : 'justify-center'}
                `}
              >
                <span className="text-lg flex-shrink-0">{item.icon}</span>
                {isMenuOpen && (
                  <span className="ml-3 whitespace-nowrap font-medium">
                    {item.label}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Logout button in a fixed position at bottom */}
          <div className="pt-4 mt-2 border-t border-gray-700">
            <button
              onClick={handleLogout}
              className={`
                w-full flex items-center px-4 py-3 rounded-lg
                bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white
                transition-all duration-200 ease-in-out text-sm font-medium
                ${isMenuOpen ? 'justify-start' : 'justify-center'}
              `}
            >
              <span className="text-lg flex-shrink-0"><MdLogout /></span>
              {isMenuOpen && <span className="ml-3">Logout</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMenuOpen && window.innerWidth < 768 && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isMenuOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Top Bar */}
        <div className="bg-[#282828] h-16 flex items-center justify-end px-6 shadow-md">
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-white">{user?.firstName} {user?.lastName}</div>
              <div className="text-gray-400 text-sm">Administrator</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#fad026] flex items-center justify-center text-black font-bold">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout; 