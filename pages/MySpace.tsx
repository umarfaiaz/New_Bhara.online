
import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useLocation, useNavigate } from 'react-router-dom';
import Overview from './MySpace/Overview';
import Renters from './MySpace/Renters';
import Payments from './MySpace/Payments';
import Inventory from './MySpace/Inventory';
import Listings from './MySpace/Listings';
import RenterOverview from './MySpace/RenterOverview';
import Maintenance from './MySpace/Maintenance';
import MyRental from './MySpace/MyRental';
import RenterPayments from './MySpace/RenterPayments';
import { Logo } from '../components/Logo';
import { LayoutDashboard, Users, Receipt, Warehouse, Home, Wrench, Wallet, Globe } from 'lucide-react';

const MySpace: React.FC = () => {
  const [role, setRole] = useState<'lender' | 'renter'>(() => {
      return (localStorage.getItem('bhara_role') as 'lender' | 'renter') || 'lender';
  });
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('bhara_role', role);
    if (!location.pathname.startsWith('/myspace')) {
        navigate('/myspace/overview');
    }
  }, [role]);

  const lenderTabs = [
    { label: 'Overview', path: '/myspace/overview', icon: LayoutDashboard },
    { label: 'Listings', path: '/myspace/listings', icon: Globe },
    { label: 'Renters', path: '/myspace/renters', icon: Users },
    { label: 'Payments', path: '/myspace/payments', icon: Receipt },
    { label: 'Inventory', path: '/myspace/inventory', icon: Warehouse },
  ];

  const renterTabs = [
      { label: 'Dashboard', path: '/myspace/overview', icon: LayoutDashboard },
      { label: 'My Rental', path: '/myspace/my-rental', icon: Home },
      { label: 'Payments', path: '/myspace/payments', icon: Wallet },
      { label: 'Issues', path: '/myspace/issues', icon: Wrench },
  ];

  const currentTabs = role === 'lender' ? lenderTabs : renterTabs;

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* 
          Sub-Header Configuration:
          - Sticky top-0
          - Enhanced spacing and alignment
      */}
      <header className="bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-sm border-b border-gray-200 transition-all duration-300">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 pb-0">
                
                {/* Top Row: Logo/Title + Role Switcher */}
                <div className="flex items-center justify-between w-full md:w-auto pb-2 md:pb-4">
                    <div className="flex items-center gap-3">
                        <div className="md:hidden">
                            <Logo size="sm" />
                        </div>
                        <h1 className="text-xl font-bold text-gray-900 tracking-tight hidden md:block">My Space</h1>
                    </div>

                    {/* Role Toggle - Modern Segmented Control */}
                    <div className="bg-gray-100/80 p-1 rounded-xl flex gap-1 shadow-inner border border-gray-200/50 md:ml-6">
                        <button 
                            onClick={() => setRole('lender')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${role === 'lender' ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Owner
                        </button>
                        <button 
                            onClick={() => setRole('renter')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${role === 'renter' ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Renter
                        </button>
                    </div>
                </div>

                {/* Bottom Row: Navigation Tabs */}
                <div className="w-full md:w-auto overflow-x-auto scrollbar-hide">
                    <div className="flex items-center md:gap-8 gap-6 min-w-max">
                        {currentTabs.map((tab) => {
                            const isActive = location.pathname.startsWith(tab.path);
                            return (
                            <NavLink
                                key={tab.label}
                                to={tab.path}
                                className={`group flex items-center gap-2 pb-3 md:pb-4 border-b-[3px] transition-all px-1 ${
                                isActive 
                                    ? 'border-[#ff4b9a] text-[#ff4b9a]' 
                                    : 'border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-200'
                                }`}
                            >
                                <tab.icon 
                                    size={18} 
                                    className={`transition-transform duration-300 ${isActive ? 'scale-110 stroke-[2.5px]' : 'group-hover:scale-110'}`} 
                                />
                                <span className={`text-sm font-bold tracking-wide ${isActive ? '' : ''}`}>
                                    {tab.label}
                                </span>
                            </NavLink>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1">
        <div className="max-w-7xl mx-auto w-full">
            <Routes>
            {role === 'lender' ? (
                <>
                    <Route path="overview" element={<Overview />} />
                    <Route path="listings" element={<Listings />} />
                    <Route path="renters/*" element={<Renters />} />
                    <Route path="payments" element={<Payments />} />
                    <Route path="inventory/*" element={<Inventory />} />
                </>
            ) : (
                <>
                    <Route path="overview" element={<RenterOverview />} />
                    <Route path="my-rental" element={<MyRental />} />
                    <Route path="payments" element={<RenterPayments />} />
                    <Route path="issues" element={<Maintenance />} />
                </>
            )}
            </Routes>
        </div>
      </div>
    </div>
  );
};

export default MySpace;
