
import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useLocation, useNavigate, Navigate } from 'react-router-dom';
import Overview from './MySpace/Overview';
import Renters from './MySpace/Renters';
import Payments from './MySpace/Payments';
import Inventory from './MySpace/Inventory';
import RenterOverview from './MySpace/RenterOverview';
import Maintenance from './MySpace/Maintenance';
import MyRental from './MySpace/MyRental';
import RenterPayments from './MySpace/RenterPayments';
import { Logo } from '../components/Logo';
import { LayoutDashboard, Users, Receipt, Box, Home, Wrench, Wallet, AlertCircle, Building2, Package } from 'lucide-react';
import { UserService } from '../services/mockData';

// --- Consolidated Management View for Owners ---
const RentalsManagement: React.FC = () => {
    const [view, setView] = useState<'inventory' | 'bookings'>('inventory');
    
    return (
        <div className="flex flex-col h-full">
            {/* Modern Toggle Switcher */}
            <div className="px-4 sm:px-6 py-4 bg-white border-b border-gray-100 flex justify-center sticky top-0 z-20">
                <div className="relative flex bg-gray-100/80 p-1.5 rounded-2xl w-full max-w-sm shadow-inner">
                    {/* Sliding Background */}
                    <div 
                        className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all duration-300 ease-out ${view === 'inventory' ? 'left-1.5' : 'left-[calc(50%+3px)]'}`}
                    ></div>
                    
                    <button 
                        onClick={() => setView('inventory')}
                        className={`relative flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-colors z-10 ${view === 'inventory' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Package size={16} className={view === 'inventory' ? 'text-[#ff4b9a]' : 'text-gray-400'}/> 
                        Inventory
                    </button>
                    <button 
                        onClick={() => setView('bookings')}
                        className={`relative flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-colors z-10 ${view === 'bookings' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Users size={16} className={view === 'bookings' ? 'text-[#ff4b9a]' : 'text-gray-400'}/> 
                        Bookings
                    </button>
                </div>
            </div>
            
            <div className="flex-1">
                {view === 'inventory' ? <Inventory /> : <Renters />}
            </div>
        </div>
    );
};

const MySpace: React.FC = () => {
  const [role, setRole] = useState<'lender' | 'renter'>(() => {
      return (localStorage.getItem('bhara_role') as 'lender' | 'renter') || 'lender';
  });
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Sync role changes
    localStorage.setItem('bhara_role', role);
    UserService.switchRole(role); 
    
    // Always reset to overview when switching roles to prevent empty states
    navigate('/myspace/overview');
  }, [role]);

  const lenderTabs = [
    { label: 'Overview', path: '/myspace/overview', icon: LayoutDashboard },
    { label: 'Rentals', path: '/myspace/rentals', icon: Home }, // Consolidated
    { label: 'Payments', path: '/myspace/payments', icon: Receipt },
    { label: 'Issues', path: '/myspace/issues', icon: AlertCircle },
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
      {/* Sub-Header Configuration */}
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
                            className={`px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-200 ${role === 'lender' ? 'bg-white text-[#2d1b4e] shadow-sm ring-1 ring-black/5' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            Owner
                        </button>
                        <button 
                            onClick={() => setRole('renter')}
                            className={`px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-200 ${role === 'renter' ? 'bg-white text-[#2d1b4e] shadow-sm ring-1 ring-black/5' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            Renter
                        </button>
                    </div>
                </div>

                {/* Bottom Row: Navigation Tabs */}
                <div className="w-full md:w-auto overflow-x-auto scrollbar-hide">
                    <div className="flex items-center justify-around md:justify-start md:gap-10 gap-2 min-w-max">
                        {currentTabs.map((tab) => {
                            const isActive = location.pathname.startsWith(tab.path);
                            return (
                            <NavLink
                                key={tab.label}
                                to={tab.path}
                                className={`group flex flex-col md:flex-row items-center md:gap-2 gap-1 pb-2 md:pb-4 border-b-[3px] transition-all px-3 md:px-1 ${
                                isActive 
                                    ? 'border-[#ff4b9a] text-[#ff4b9a]' 
                                    : 'border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-200'
                                }`}
                            >
                                <tab.icon 
                                    size={20} 
                                    className={`transition-transform duration-300 ${isActive ? 'scale-110 stroke-[2.5px]' : 'group-hover:scale-110'}`} 
                                />
                                <span className={`text-[10px] md:text-sm font-bold tracking-wide`}>
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
                    {/* Consolidated Routes */}
                    <Route path="rentals/*" element={<RentalsManagement />} />
                    
                    {/* Legacy redirects for safety */}
                    <Route path="assets/*" element={<Navigate to="/myspace/rentals" />} />
                    <Route path="renters/*" element={<Navigate to="/myspace/rentals" />} />
                    <Route path="inventory/*" element={<Navigate to="/myspace/rentals" />} />
                    
                    <Route path="payments" element={<Payments />} />
                    <Route path="issues" element={<Maintenance />} /> 
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
