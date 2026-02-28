import { useEffect, useState } from 'react';
import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import { Coffee, Package, Grid3X3, LogOut, Home, Menu, X, LayoutDashboard, Settings } from 'lucide-react';
import { isAuthenticated, logout } from '@/store/authStore';

export function AdminLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Gösterge Paneli', end: true },
    { to: '/admin/products', icon: Package, label: 'Ürünler', end: false },
    { to: '/admin/categories', icon: Grid3X3, label: 'Kategoriler', end: false },
    { to: '/admin/settings', icon: Settings, label: 'Ayarlar', end: false },
  ];

  const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8 px-1">
        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
          <Coffee className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-slate-900 text-sm">DAFFY DARK</h1>
          <p className="text-slate-500 text-xs">Yönetici Paneli</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`
            }
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="border-t border-slate-200 pt-4 space-y-1">
        <a href="/#/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all">
          <Home className="w-4 h-4" />
          Menüye Dön
        </a>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all">
          <LogOut className="w-4 h-4" />
          Çıkış Yap
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="text-slate-900">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <Coffee className="w-5 h-5 text-amber-600" />
            <span className="font-bold text-slate-900">Yönetici</span>
          </div>
        </div>
        <button onClick={handleLogout} className="text-slate-500 hover:text-red-400 transition-colors">
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-200 p-4 flex flex-col animate-slide-in-left">
            <div className="flex items-center justify-end mb-2">
              <button onClick={() => setSidebarOpen(false)} className="text-slate-600 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <SidebarContent onNavigate={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-200 p-4">
          <SidebarContent />
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8 min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
