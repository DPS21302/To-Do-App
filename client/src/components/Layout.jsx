import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogOut, Home, CheckSquare, Archive, LayoutDashboard, Users, Kanban, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const userLinks = [
    { path: '/tasks', label: 'All Tasks', icon: Home },
    { path: '/tasks/today', label: 'Today', icon: CheckSquare },
    { path: '/tasks/kanban', label: 'Kanban', icon: Kanban },
    { path: '/tasks/archive', label: 'Archive', icon: Archive }
  ];

  const adminLinks = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/users', label: 'Users', icon: Users },
    { path: '/admin/tasks', label: 'All Tasks', icon: CheckSquare }
  ];

  const links = user?.role === 'admin' ? adminLinks : userLinks;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Left side - Logo and Desktop Nav */}
            <div className="flex items-center space-x-4 lg:space-x-8">
              <h1 className="text-xl sm:text-2xl font-bold text-blue-600">To-Do App</h1>

              {/* Desktop Navigation */}
              <div className="hidden md:flex space-x-1">
                {links.map(({ path, label, icon: IconComponent }) => (
                  <Link
                    key={path}
                    to={path}
                    className={`flex items-center space-x-2 px-3 lg:px-4 py-2 rounded-lg transition duration-150 ${
                      isActive(path)
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-blue-50'
                    }`}
                  >
                    <IconComponent size={18} />
                    <span className="font-medium text-sm lg:text-base">{label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Right side - User info and Logout (Desktop) */}
            <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
                <div className="flex flex-col items-end">
    <span className="font-semibold text-gray-700 text-sm lg:text-sm truncate max-w-[150px]">
      {user?.name}
    </span>
    <span className="text-[10px] mt-1 px-2 lg:px-2  text-gray-700 rounded-md font-semibold">
      {user?.role}
    </span>
  </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 lg:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150"
              >
                <LogOut size={18} />
                <span className="hidden lg:inline">Logout</span>
              </motion.button>
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-gray-200 bg-white"
            >
              <div className="px-4 py-4 space-y-2">
                {/* Mobile Nav Links */}
                {links.map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition duration-150 ${
                      isActive(path)
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-blue-50'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{label}</span>
                  </Link>
                ))}

                {/* Mobile User Info */}
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <div className="flex items-center justify-between px-4">
                    <span className="font-semibold text-gray-700">{user?.name}</span>
                    <span className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
                      {user?.role}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
