import { useEffect, useState } from 'react';
import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import { Coffee, Package, Grid3X3, LogOut, Home, Menu, X, LayoutDashboard } from 'lucide-react';
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
  ];

  const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8 px-1">
        <div className="w-10 h-10 bg-gradient-to-br from-[#f97316] to-[#ea580c] rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
          <Coffee className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-[#f5e6d3] text-sm">DAFFY DARK</h1>
          <p className="text-[#8b6f47] text-xs">Yönetici Paneli</p>
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
                  ? 'bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white shadow-lg shadow-orange-500/20'
                  : 'text-[#d4c4a8] hover:bg-[#8b6f47]/15 hover:text-[#f5e6d3]'
              }`
            }
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="border-t border-[#8b6f47]/20 pt-4 space-y-1">
        <a href="/#/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#d4c4a8] hover:bg-[#8b6f47]/15 hover:text-[#f5e6d3] transition-all">
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
    <div className="min-h-screen bg-gradient-to-b from-[#3d2914] to-[#2a1a0a]">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-50 bg-[#5d4037]/95 backdrop-blur-md border-b border-[#8b6f47]/30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="text-[#f5e6d3]">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <Coffee className="w-5 h-5 text-[#f97316]" />
            <span className="font-bold text-[#f5e6d3]">Yönetici</span>
          </div>
        </div>
        <button onClick={handleLogout} className="text-[#8b6f47] hover:text-red-400 transition-colors">
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-gradient-to-b from-[#5d4037] to-[#4a3328] border-r border-[#8b6f47]/20 p-4 flex flex-col animate-slide-in-left">
            <div className="flex items-center justify-end mb-2">
              <button onClick={() => setSidebarOpen(false)} className="text-[#d4c4a8] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <SidebarContent onNavigate={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-gradient-to-b from-[#5d4037] to-[#4a3328] border-r border-[#8b6f47]/20 p-4">
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
