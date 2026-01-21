
import React, { useState } from 'react';
import { User, Phone, Crown, Edit2, Languages, Mail, MessageSquare, CreditCard, Clock, HelpCircle, AlertOctagon, FileText, Shield, ChevronRight, X, CheckCircle2, Zap, ArrowRight, LogOut, Heart, ShoppingBag, MapPin, Star } from 'lucide-react';
import { UserService, DataService } from '../services/mockData';
import { User as UserType } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

interface ProfileProps {
    onLogout?: () => void;
}

const Profile: React.FC<ProfileProps> = ({ onLogout }) => {
  const [user, setUser] = useState<UserType>(UserService.getCurrentUser());
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const toggleLanguage = () => {
      setLanguage(language === 'en' ? 'bn' : 'en');
  };

  // --- Modals Renderers ---
  const renderEditProfile = () => (
      <EditProfileModal user={user} onClose={() => setActiveModal(null)} onSave={(u) => { setUser(u); setActiveModal(null); }} />
  );
  
  const renderSubscription = () => (
      <SubscriptionModal user={user} onClose={() => setActiveModal(null)} onUpdate={(u) => { setUser(u); setActiveModal(null); }} />
  );

  const renderBuySMS = () => (
      <BuySMSModal user={user} onClose={() => setActiveModal(null)} onUpdate={(u) => { setUser(u); setActiveModal(null); }} />
  );

  const renderTerms = () => (
      <LegalModal title="Terms & Conditions" content="These are the terms and conditions..." onClose={() => setActiveModal(null)} />
  );

  const renderPrivacy = () => (
      <LegalModal title="Privacy Policy" content="This is the privacy policy..." onClose={() => setActiveModal(null)} />
  );

  const renderWishlist = () => (
      <WishlistModal onClose={() => setActiveModal(null)} />
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
        {/* Top Card - User Identity */}
        <div className="bg-white p-6 pb-8 pt-10 rounded-b-[2.5rem] shadow-sm relative overflow-hidden border-b border-gray-100">
            <div className="flex items-center gap-5 relative z-10">
                <div className="w-20 h-20 rounded-full bg-gray-100 p-1 border-2 border-[#ff4b9a]/20 shrink-0 shadow-sm">
                    <img src={user.avatar || 'https://i.pravatar.cc/150'} alt="Profile" className="w-full h-full rounded-full object-cover"/>
                </div>
                <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-gray-900 truncate">{user.name}</h2>
                    <p className="text-sm text-gray-500 mb-3">{user.phone}</p>
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                        user.plan === 'Elite' ? 'bg-purple-100 text-purple-700' : 
                        user.plan === 'Pro' ? 'bg-[#ff4b9a]/10 text-[#ff4b9a]' : 'bg-gray-100 text-gray-600'
                    }`}>
                        {user.plan === 'Pro' || user.plan === 'Elite' ? <Crown size={12} fill="currentColor"/> : null}
                        {user.plan} Plan
                    </div>
                </div>
            </div>
        </div>

        <div className="p-5 space-y-6">
            {/* General Section */}
            <section>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-2">Account</h3>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <MenuItem icon={Edit2} label={t('profile_edit')} onClick={() => setActiveModal('edit')} />
                    <MenuItem icon={Heart} label="Saved Items" onClick={() => setActiveModal('wishlist')} />
                    <MenuItem icon={Languages} label={t('profile_lang')} value={language === 'bn' ? 'বাংলা' : 'English'} onClick={toggleLanguage} highlight />
                    <MenuItem icon={Mail} label={t('profile_contact')} onClick={() => window.open('mailto:support@bhara.online')} isLast />
                </div>
            </section>

            {/* Payments Section */}
            <section>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-2">Subscription & Credits</h3>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <MenuItem icon={MessageSquare} label="Buy SMS Credits" value={`${user.smsBalance} left`} onClick={() => setActiveModal('sms')} />
                    <MenuItem icon={Crown} label="Manage Subscription" value={user.plan} highlight onClick={() => setActiveModal('sub')} />
                    <MenuItem icon={CreditCard} label="Payment Methods" onClick={() => {}} />
                    <MenuItem icon={Clock} label="Billing History" onClick={() => {}} isLast />
                </div>
            </section>

            {/* Support Section */}
            <section>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-2">Support & Legal</h3>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <MenuItem icon={HelpCircle} label="Help Center" onClick={() => {}} />
                    <MenuItem icon={AlertOctagon} label="Report a Problem" onClick={() => {}} />
                    <MenuItem icon={FileText} label="Terms of Service" onClick={() => setActiveModal('terms')} />
                    <MenuItem icon={Shield} label="Privacy Policy" onClick={() => setActiveModal('privacy')} isLast />
                </div>
            </section>
            
            {onLogout && (
                <button 
                    onClick={onLogout}
                    className="w-full bg-red-50 text-red-600 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
                >
                    <LogOut size={18} />
                    Log Out
                </button>
            )}

            <div className="text-center pt-2">
                <p className="text-[10px] text-gray-400 font-bold">Version 1.0.0 • Bhara.online</p>
            </div>
        </div>

        {/* Modals */}
        {activeModal === 'edit' && renderEditProfile()}
        {activeModal === 'sub' && renderSubscription()}
        {activeModal === 'sms' && renderBuySMS()}
        {activeModal === 'terms' && renderTerms()}
        {activeModal === 'privacy' && renderPrivacy()}
        {activeModal === 'wishlist' && renderWishlist()}
    </div>
  );
};

// --- Reusable Menu Item ---
const MenuItem: React.FC<{ icon: any, label: string, value?: string, onClick: () => void, isLast?: boolean, highlight?: boolean }> = ({ icon: Icon, label, value, onClick, isLast, highlight }) => (
    <div onClick={onClick} className={`flex items-center justify-between p-4 active:bg-gray-50 transition-colors cursor-pointer ${!isLast ? 'border-b border-gray-50' : ''}`}>
        <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${highlight ? 'bg-[#ff4b9a]/10 text-[#ff4b9a]' : 'bg-gray-50 text-gray-600'}`}>
                <Icon size={18} />
            </div>
            <span className="text-sm font-bold text-gray-900">{label}</span>
        </div>
        <div className="flex items-center gap-2">
            {value && <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{value}</span>}
            <ChevronRight size={16} className="text-gray-300" />
        </div>
    </div>
);

// --- Responsive Modal Wrapper ---
const ModalWrapper: React.FC<{ children: React.ReactNode, onClose: () => void, title: string, height?: string }> = ({ children, onClose, title, height = "h-[80vh]" }) => (
    <div className="fixed inset-0 bg-black/60 z-[60] flex flex-col justify-end sm:justify-center items-center backdrop-blur-sm p-0 sm:p-4">
        <div className={`bg-white w-full sm:max-w-md rounded-t-[2rem] sm:rounded-[2rem] ${height} sm:h-auto sm:max-h-[85vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300 shadow-2xl`}>
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
                <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                <button onClick={onClose} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors"><X size={20}/></button>
            </div>
            {children}
        </div>
    </div>
);

// --- Wishlist Modal ---
const WishlistModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const navigate = useNavigate();
    const [wishlistIds, setWishlistIds] = useState(UserService.getWishlist());
    const allItems = DataService.getMarketplaceItems();
    const wishlistedItems = allItems.filter(item => wishlistIds.includes(item.id));

    const handleRemove = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        const newList = UserService.toggleWishlist(id);
        setWishlistIds([...newList]);
    };

    return (
        <ModalWrapper title="Saved Items" onClose={onClose} height="h-[90vh]">
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-gray-50">
                {wishlistedItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <ShoppingBag size={48} className="text-gray-300 mb-3"/>
                        <p className="text-gray-500 font-medium text-sm">No saved items yet.</p>
                        <button onClick={() => { onClose(); navigate('/marketplace'); }} className="mt-4 text-[#ff4b9a] font-bold text-sm">Browse Marketplace</button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {wishlistedItems.map(item => (
                            <div 
                                key={item.id} 
                                onClick={() => { onClose(); navigate(`/marketplace/item/${item.id}`); }}
                                className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex gap-3 cursor-pointer active:scale-[0.98] transition-transform"
                            >
                                <img src={item.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa'} className="w-20 h-20 rounded-xl object-cover bg-gray-100" />
                                <div className="flex-1 flex flex-col justify-center">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{item.name}</h4>
                                        <button onClick={(e) => handleRemove(e, item.id)} className="text-red-500 p-1 hover:bg-red-50 rounded-full"><Heart size={16} fill="currentColor"/></button>
                                    </div>
                                    <p className="text-[10px] text-gray-500 flex items-center gap-1 mt-1"><MapPin size={10}/> {item.location}</p>
                                    <div className="mt-auto flex items-baseline gap-1">
                                        <span className="font-extrabold text-gray-900 text-sm">{item.displayPrice}</span>
                                        <span className="text-[10px] text-gray-400 font-medium">{item.period}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </ModalWrapper>
    );
};

// --- Edit Profile Modal ---
const EditProfileModal: React.FC<{ user: UserType, onClose: () => void, onSave: (u: UserType) => void }> = ({ user, onClose, onSave }) => {
    const [formData, setFormData] = useState({ name: user.name, phone: user.phone || '', address: user.address || '', businessName: user.businessName || '' });
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const updated = UserService.updateUser(formData);
        onSave(updated);
    };

    return (
        <ModalWrapper title="Edit Profile" onClose={onClose}>
            <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
                <div><label className="block text-xs font-bold text-gray-900 mb-2">Full Name</label><input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-5 py-4 rounded-2xl border border-gray-200 font-bold text-gray-900 focus:outline-none focus:border-[#ff4b9a]" /></div>
                <div><label className="block text-xs font-bold text-gray-900 mb-2">Phone</label><input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-5 py-4 rounded-2xl border border-gray-200 font-bold text-gray-900 focus:outline-none focus:border-[#ff4b9a]" /></div>
                <div><label className="block text-xs font-bold text-gray-900 mb-2">Address</label><input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-5 py-4 rounded-2xl border border-gray-200 font-bold text-gray-900 focus:outline-none focus:border-[#ff4b9a]" /></div>
                <div><label className="block text-xs font-bold text-gray-900 mb-2">Business Name (Optional)</label><input type="text" value={formData.businessName} onChange={e => setFormData({...formData, businessName: e.target.value})} className="w-full px-5 py-4 rounded-2xl border border-gray-200 font-bold text-gray-900 focus:outline-none focus:border-[#ff4b9a]" /></div>
            </div>
            <div className="p-5 border-t border-gray-100 safe-bottom">
                <button onClick={handleSubmit} className="w-full py-4 bg-[#ff4b9a] text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-transform">Save Changes</button>
            </div>
        </ModalWrapper>
    );
};

// --- Subscription Modal ---
const SubscriptionModal: React.FC<{ user: UserType, onClose: () => void, onUpdate: (u: UserType) => void }> = ({ user, onClose, onUpdate }) => {
    const [cycle, setCycle] = useState<'Monthly' | 'Yearly'>('Yearly');
    
    const plans = [
        { name: 'Free', price: 0, features: ['3 Assets Limit', '10 SMS/mo', 'Basic Dashboard'], color: 'bg-gray-100', btn: 'bg-gray-900', text: 'text-gray-900' },
        { name: 'Pro', price: cycle === 'Monthly' ? 99 : 999, features: ['Unlimited Assets', '100 SMS/mo', 'Automation', 'Priority Support'], color: 'bg-[#ff4b9a]/10', btn: 'bg-[#ff4b9a]', text: 'text-[#ff4b9a]', popular: true },
        { name: 'Elite', price: cycle === 'Monthly' ? 499 : 4999, features: ['Multi-Team', '500 SMS/mo', 'Business Tools', 'Bulk Actions'], color: 'bg-purple-50', btn: 'bg-purple-600', text: 'text-purple-600' }
    ];

    const handleSelect = (planName: string) => {
        const updated = UserService.updatePlan(planName as any, cycle);
        onUpdate(updated);
    }

    return (
        <ModalWrapper title="Upgrade Plan" onClose={onClose} height="h-[90vh]">
            <div className="flex-1 overflow-y-auto custom-scrollbar p-5 pb-10">
                {/* Toggle */}
                <div className="flex justify-center mb-8">
                    <div className="bg-gray-100 p-1 rounded-full flex relative">
                        <button onClick={() => setCycle('Monthly')} className={`px-6 py-2 rounded-full text-xs font-bold transition-all relative z-10 ${cycle === 'Monthly' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>Monthly</button>
                        <button onClick={() => setCycle('Yearly')} className={`px-6 py-2 rounded-full text-xs font-bold transition-all relative z-10 ${cycle === 'Yearly' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>Yearly <span className="text-[9px] text-green-600 ml-1">-17%</span></button>
                    </div>
                </div>

                <div className="space-y-4">
                    {plans.map((plan) => (
                        <div key={plan.name} className={`rounded-3xl p-6 border-2 relative overflow-hidden transition-all ${user.plan === plan.name ? 'border-gray-900 ring-4 ring-gray-100' : 'border-transparent'} ${plan.color}`}>
                            {plan.popular && <div className="absolute top-0 right-0 bg-[#ff4b9a] text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">POPULAR</div>}
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className={`text-lg font-bold ${plan.text}`}>{plan.name}</h4>
                                    <div className="flex items-baseline gap-1 mt-1">
                                        <span className="text-3xl font-extrabold text-gray-900">৳{plan.price}</span>
                                        <span className="text-xs text-gray-500 font-bold">/{cycle === 'Monthly' ? 'mo' : 'yr'}</span>
                                    </div>
                                </div>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${plan.btn} text-white`}>
                                    {user.plan === plan.name ? <CheckCircle2 size={20}/> : <ArrowRight size={20}/>}
                                </div>
                            </div>
                            <ul className="space-y-2 mb-4">
                                {plan.features.map(f => (
                                    <li key={f} className="flex items-center gap-2 text-xs font-bold text-gray-600">
                                        <CheckCircle2 size={14} className="text-green-500"/> {f}
                                    </li>
                                ))}
                            </ul>
                            <button 
                                onClick={() => handleSelect(plan.name)}
                                disabled={user.plan === plan.name}
                                className={`w-full py-3 rounded-xl text-xs font-bold text-white shadow-lg active:scale-95 transition-transform ${user.plan === plan.name ? 'bg-gray-400 cursor-default' : plan.btn}`}
                            >
                                {user.plan === plan.name ? 'Current Plan' : `Switch to ${plan.name}`}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </ModalWrapper>
    );
};

// --- Buy SMS Modal ---
const BuySMSModal: React.FC<{ user: UserType, onClose: () => void, onUpdate: (u: UserType) => void }> = ({ user, onClose, onUpdate }) => {
    const packs = [
        { count: 50, price: 25 },
        { count: 100, price: 45 },
        { count: 250, price: 100 },
        { count: 500, price: 180 },
    ];

    const handleBuy = (amount: number) => {
        if(confirm(`Buy ${amount} SMS?`)) {
            const updated = UserService.topUpSMS(amount);
            onUpdate(updated);
        }
    };

    return (
        <ModalWrapper title="Top Up SMS" onClose={onClose} height="h-[60vh]">
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                <div className="mb-6">
                    <p className="text-xs text-gray-500">Current Balance: <span className="font-bold text-[#ff4b9a] text-lg ml-1">{user.smsBalance} SMS</span></p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    {packs.map(pack => (
                        <button key={pack.count} onClick={() => handleBuy(pack.count)} className="bg-white border border-gray-200 rounded-2xl p-4 text-left hover:border-[#ff4b9a] hover:shadow-md transition-all group active:scale-95">
                            <h4 className="text-xl font-extrabold text-gray-900 mb-1">{pack.count} SMS</h4>
                            <p className="text-sm font-bold text-gray-500 group-hover:text-[#ff4b9a]">৳ {pack.price}</p>
                        </button>
                    ))}
                </div>
            </div>
        </ModalWrapper>
    );
};

// --- Simple Legal Modal ---
const LegalModal: React.FC<{ title: string, content: string, onClose: () => void }> = ({ title, content, onClose }) => (
    <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-6 backdrop-blur-sm">
        <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
            <div className="h-64 overflow-y-auto custom-scrollbar bg-gray-50 p-4 rounded-xl text-xs text-gray-600 leading-relaxed mb-4">
                {content}
                <p className="mt-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                <p className="mt-2">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            </div>
            <button onClick={onClose} className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl active:scale-95 transition-transform">Close</button>
        </div>
    </div>
);

export default Profile;
