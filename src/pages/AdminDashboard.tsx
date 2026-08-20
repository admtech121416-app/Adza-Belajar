import { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { LayoutDashboard, Layers, Settings, LogOut, Package } from 'lucide-react';
import { api } from '../services/api';
import { SettingsData } from '../types';

// Admin Views
import DashboardStats from './admin/DashboardStats';
import AppsManagement from './admin/AppsManagement';
import CategoriesManagement from './admin/CategoriesManagement';
import SettingsManagement from './admin/SettingsManagement';

export default function AdminDashboard({ settings }: { settings: SettingsData | null }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      if (api.isAuthenticated()) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = () => {
    api.logout();
    navigate('/admin/login');
  };

  if (isAuthenticated === null) return null;
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Aplikasi', href: '/admin/apps', icon: Package },
    { name: 'Kategori', href: '/admin/categories', icon: Layers },
    { name: 'Pengaturan', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 shrink-0 md:h-screen sticky top-0 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-200 gap-3">
          <img src={settings?.logoUrl || '/logo.png'} alt="Logo" className="w-8 h-8 object-contain rounded" />
          <span className="font-bold text-slate-800 tracking-tight">Admin Panel</span>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap md:whitespace-normal ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <item.icon className={`w-5 h-5 mr-3 shrink-0 ${isActive ? 'text-blue-700' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-slate-200 mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        <Routes>
          <Route path="/" element={<DashboardStats />} />
          <Route path="/apps" element={<AppsManagement />} />
          <Route path="/categories" element={<CategoriesManagement />} />
          <Route path="/settings" element={<SettingsManagement settings={settings} />} />
        </Routes>
      </main>
    </div>
  );
}
