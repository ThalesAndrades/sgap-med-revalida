import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { 
  LayoutDashboard, 
  Stethoscope, 
  BookOpen, 
  Activity, 
  LogOut, 
  User,
  Menu,
  X
} from 'lucide-react';
import clsx from 'clsx';

const Layout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/treinamento', label: 'Treinamento', icon: Stethoscope },
    { to: '/aprendizagem', label: 'Aprendizagem', icon: BookOpen },
    { to: '/simulacao', label: 'Simulação Real', icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-clinical-bg flex">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-inep-primary text-white shadow-xl z-20">
        <div className="p-6 border-b border-inep-secondary flex items-center space-x-3">
          <div className="bg-white/10 p-2 rounded-full">
            <Stethoscope className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">SGAP-MED</h1>
            <p className="text-xs text-blue-200">Revalida Trainer</p>
          </div>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                clsx(
                  'flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all duration-200 group',
                  isActive
                    ? 'bg-white text-inep-primary shadow-sm'
                    : 'text-blue-100 hover:bg-inep-secondary hover:text-white'
                )
              }
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-inep-secondary bg-inep-secondary/50">
          <div className="flex items-center mb-4">
            <div className="bg-white/20 p-2 rounded-full">
              <User className="h-5 w-5" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{user?.name || 'Membro Beta'}</p>
              <p className="text-xs text-blue-300">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600/80 hover:bg-red-700 focus:outline-none transition-colors"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed w-full bg-inep-primary z-30 flex items-center justify-between p-4 shadow-md">
        <div className="flex items-center space-x-2 text-white">
           <Stethoscope className="h-6 w-6" />
           <span className="font-bold">SGAP-MED</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-20 bg-black/50 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="absolute right-0 top-0 h-full w-64 bg-inep-primary p-4 pt-20" onClick={e => e.stopPropagation()}>
             <nav className="space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all duration-200',
                      isActive
                        ? 'bg-white text-inep-primary'
                        : 'text-blue-100 hover:bg-inep-secondary'
                    )
                  }
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.label}
                </NavLink>
              ))}
              <button
                onClick={handleLogout}
                className="w-full mt-8 flex items-center px-4 py-3 text-sm font-medium text-red-200 hover:bg-red-900/20 rounded-md"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Sair
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto pt-16 md:pt-0">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
