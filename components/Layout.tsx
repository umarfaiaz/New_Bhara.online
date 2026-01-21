
import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Home, ShoppingBag, LayoutDashboard, Mail, User, LogOut } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Logo } from './Logo';

interface LayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const navItems = [
    { label: t('nav_home'), path: '/home', icon: Home },
    { label: t('nav_marketplace'), path: '/marketplace', icon: ShoppingBag },
    { label: t('nav_myspace'), path: '/myspace/overview', icon: LayoutDashboard },
    { label: t('nav_inbox'), path: '/inbox', icon: Mail },
    { label: t('nav_profile'), path: '/profile', icon: User },
  ];

  const getIsActive = (itemPath: string, currentPath: string) => {
      if (itemPath.includes('myspace')) {
          return currentPath.startsWith('/myspace');
      }
      if (itemPath === '/home') return currentPath === '/home';
      return currentPath.startsWith(itemPath);
  };

  const hideNavPaths = [
    '/marketplace/item',
    '/marketplace/post',
    '/inbox/chat',
    '/inbox/group', 
    '/myspace/inventory/config',
    '/myspace/inventory/select-type',
    '/myspace/inventory/manage-flats'
  ];

  const shouldHideNavMobile = hideNavPaths.some(path => location.pathname.includes(path));
  const isHomePage = location.pathname === '/home';

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#f8f9fa] overflow-hidden selection:bg-[#ff4b9a]/20 font-sans">
      
      {/* Desktop Header - Fixed Glassmorphism (Height 80px) */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 h-[80px] items-center justify-between px-8 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 z-[100] transition-all duration-300">
        <div className="flex items-center gap-12 h-full max-w-7xl mx-auto w-full">
            <div className="cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0" onClick={() => navigate('/home')}>
                <Logo size="md" />
            </div>
            
            <nav className="flex items-center gap-2 h-full">
            {navItems.map((item) => {
                const isActive = getIsActive(item.path, location.pathname);
                return (
                <NavLink
                    key={item.path}
                    to={item.path}
                    className={`relative flex items-center gap-2.5 px-5 py-2.5 rounded-full transition-all duration-300 group overflow-hidden ${
                    isActive 
                        ? 'text-[#ff4b9a] font-bold bg-[#ff4b9a]/5' 
                        : 'text-gray-500 font-medium hover:text-gray-900 hover:bg-gray-50'
                    }`}
                >
                    <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                    <span className="text-sm tracking-wide">
                    {item.label}
                    </span>
                    {isActive && <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#ff4b9a] rounded-t-full mx-6"></div>}
                </NavLink>
                );
            })}
            </nav>

            <div className="ml-auto">
                <button 
                    onClick={onLogout}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full text-red-600 hover:bg-red-50 transition-all font-bold text-sm border border-transparent hover:border-red-100 group"
                >
                    <LogOut size={18} className="transition-transform group-hover:-translate-x-1"/>
                    <span>{t('profile_logout')}</span>
                </button>
            </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative pt-0 md:pt-[80px]">
        <main className={`flex-1 overflow-y-auto custom-scrollbar w-full ${shouldHideNavMobile ? 'pb-safe-bottom' : 'pb-32 md:pb-10'}`}>
          <div className="w-full min-h-full">
            {children}
          </div>
        </main>

        {/* Mobile Bottom Nav - Floating Modern Pill */}
        {!shouldHideNavMobile && (
          <div className="md:hidden fixed bottom-5 left-4 right-4 z-50 pointer-events-none animate-in slide-in-from-bottom-4 duration-700 ease-out">
            <nav className="w-full max-w-[400px] mx-auto bg-[#1a1a1a]/90 backdrop-blur-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] border border-white/10 rounded-[2rem] flex justify-between items-center h-[70px] px-6 pointer-events-auto">
              {navItems.map((item) => {
                const isActive = getIsActive(item.path, location.pathname);
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className="relative flex items-center justify-center w-12 h-12 group"
                  >
                    {isActive && (
                        <div className="absolute inset-0 bg-[#ff4b9a] rounded-full shadow-[0_0_15px_rgba(255,75,154,0.5)] animate-in zoom-in duration-300"></div>
                    )}
                    <div className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                        <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                    </div>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default Layout;
