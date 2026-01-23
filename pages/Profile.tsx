
import React, { useState } from 'react';
import { User, Phone, Crown, Edit, Languages, Mail, MessageSquare, CreditCard, Clock, HelpCircle, AlertOctagon, FileText, Shield, ChevronRight, X, CheckCircle2, Zap, ArrowRight, LogOut, Heart, ShoppingBag, MapPin, Star, ShieldAlert, Info, AlertTriangle } from 'lucide-react';
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
      <LegalModal title={t('legal_terms_title')} content={t('legal_terms_content')} onClose={() => setActiveModal(null)} />
  );

  const renderPrivacy = () => (
      <LegalModal title={t('legal_privacy_title')} content={t('legal_privacy_content')} onClose={() => setActiveModal(null)} />
  );

  const renderSafety = () => (
      <LegalModal title={t('legal_safety_title')} content={t('legal_safety_content')} onClose={() => setActiveModal(null)} isWarning />
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
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-2">{t('profile_account')}</h3>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <MenuItem icon={Edit} label={t('profile_edit')} onClick={() => setActiveModal('edit')} />
                    <MenuItem icon={Heart} label="Saved Items" onClick={() => setActiveModal('wishlist')} />
                    <MenuItem icon={Languages} label={t('profile_lang')} value={language === 'bn' ? 'বাংলা' : 'English'} onClick={toggleLanguage} highlight />
                    <MenuItem icon={Mail} label={t('profile_contact')} onClick={() => window.open('mailto:allbhara.online@gmail.com')} isLast />
                </div>
            </section>

            {/* Payments Section - HIDDEN FOR NOW */}
            {/* 
            <section>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-2">{t('profile_sub')}</h3>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <MenuItem icon={MessageSquare} label="Buy SMS Credits" value={`${user.smsBalance} left`} onClick={() => setActiveModal('sms')} />
                    <MenuItem icon={Crown} label="Manage Subscription" value={user.plan} highlight onClick={() => setActiveModal('sub')} />
                    <MenuItem icon={CreditCard} label="Payment Methods" onClick={() => {}} />
                    <MenuItem icon={Clock} label="Billing History" onClick={() => {}} isLast />
                </div>
            </section> 
            */}

            {/* Support Section */}
            <section>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-2">Support & Legal</h3>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <MenuItem icon={ShieldAlert} label={t('legal_safety_title')} onClick={() => setActiveModal('safety')} highlightWarning />
                    <MenuItem icon={HelpCircle} label="Help Center" onClick={() => {}} />
                    <MenuItem icon={FileText} label={t('legal_terms_title')} onClick={() => setActiveModal('terms')} />
                    <MenuItem icon={Shield} label={t('legal_privacy_title')} onClick={() => setActiveModal('privacy')} isLast />
                </div>
            </section>

            {/* Disclaimer Banner */}
            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex gap-3 items-start">
                <AlertOctagon size={20} className="text-orange-500 shrink-0 mt-0.5"/>
                <div>
                    <h4 className="text-xs font-bold text-orange-800 uppercase mb-1">{t('legal_platform_disclaimer_title')}</h4>
                    <p className="text-xs text-orange-700 leading-relaxed">
                        {t('legal_platform_disclaimer_text')}
                    </p>
                </div>
            </div>
            
            {onLogout && (
                <button 
                    onClick={onLogout}
                    className="w-full bg-red-50 text-red-600 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
                >
                    <LogOut size={18} />
                    {t('profile_logout')}
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
        {activeModal === 'safety' && renderSafety()}
        {activeModal === 'wishlist' && renderWishlist()}
    </div>
  );
};

// ... Reusable Menu Item (unchanged) ...
const MenuItem: React.FC<{ icon: any, label: string, value?: string, onClick: () => void, isLast?: boolean, highlight?: boolean, highlightWarning?: boolean }> = ({ icon: Icon, label, value, onClick, isLast, highlight, highlightWarning }) => (
    <div onClick={onClick} className={`flex items-center justify-between p-4 active:bg-gray-50 transition-colors cursor-pointer ${!isLast ? 'border-b border-gray-50' : ''}`}>
        <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${highlightWarning ? 'bg-orange-50 text-orange-500' : highlight ? 'bg-[#ff4b9a]/10 text-[#ff4b9a]' : 'bg-gray-50 text-gray-600'}`}>
                <Icon size={18} />
            </div>
            <span className={`text-sm font-bold ${highlightWarning ? 'text-orange-600' : 'text-gray-900'}`}>{label}</span>
        </div>
        <div className="flex items-center gap-2">
            {value && <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{value}</span>}
            <ChevronRight size={16} className="text-gray-300" />
        </div>
    </div>
);

// ... Responsive Modal Wrapper, Legal Modal, Subscription Modal, etc. (unchanged) ...
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

const LegalModal: React.FC<{ title: string, content: string, onClose: () => void, isWarning?: boolean }> = ({ title, content, onClose, isWarning }) => (
    <ModalWrapper title={title} onClose={onClose} height="h-[75vh]">
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-white">
            {isWarning && (
                <div className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-100 rounded-xl mb-6">
                    <AlertTriangle size={24} className="text-orange-500 shrink-0"/>
                    <p className="text-xs font-bold text-orange-800">Please read this advisory carefully before proceeding with any transaction.</p>
                </div>
            )}
            <div className="prose prose-sm text-gray-600 whitespace-pre-wrap">
                {content}
            </div>
            <button onClick={onClose} className="w-full mt-8 py-3 bg-gray-100 text-gray-800 font-bold rounded-xl hover:bg-gray-200 transition-colors">
                I Understand
            </button>
        </div>
    </ModalWrapper>
);

const SubscriptionModal: React.FC<{ user: UserType, onClose: () => void, onUpdate: (u: UserType) => void }> = ({ user, onClose, onUpdate }) => {
    const plans = [
        { name: 'Free', price: '৳0', features: ['2 Listings', 'Basic Analytics', 'Manual SMS'] },
        { name: 'Pro', price: '৳499', features: ['10 Listings', 'Advanced Stats', '50 SMS/mo'], recommended: true },
        { name: 'Elite', price: '৳1499', features: ['Unlimited', 'Priority Support', '200 SMS/mo'] }
    ];

    const handleUpgrade = (planName: any) => {
        const updated = UserService.updatePlan(planName, 'Monthly');
        onUpdate(updated);
    };

    return (
        <ModalWrapper title="Plans" onClose={onClose}>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-gray-50">
                {plans.map(p => (
                    <div key={p.name} className={`relative p-5 rounded-2xl border transition-all ${user.plan === p.name ? 'bg-[#ff4b9a]/5 border-[#ff4b9a] ring-1 ring-[#ff4b9a]' : 'bg-white border-gray-200'}`}>
                        {p.recommended && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#ff4b9a] text-white text-[10px] font-bold px-3 py-1 rounded-full">RECOMMENDED</div>}
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h4 className="font-bold text-gray-900 text-lg">{p.name}</h4>
                                <p className="text-sm text-gray-500 font-medium">{p.price}<span className="text-xs">/mo</span></p>
                            </div>
                            {user.plan === p.name ? (
                                <span className="bg-green-100 text-green-700 p-1.5 rounded-full"><CheckCircle2 size={20}/></span>
                            ) : (
                                <button onClick={() => handleUpgrade(p.name)} className="px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-black">Upgrade</button>
                            )}
                        </div>
                        <ul className="space-y-2">
                            {p.features.map(f => (
                                <li key={f} className="text-xs text-gray-600 flex items-center gap-2"><CheckCircle2 size={12} className="text-[#ff4b9a]"/> {f}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </ModalWrapper>
    );
};

const BuySMSModal: React.FC<{ user: UserType, onClose: () => void, onUpdate: (u: UserType) => void }> = ({ user, onClose, onUpdate }) => {
    const handleBuy = (amount: number) => {
        const updated = UserService.topUpSMS(amount);
        onUpdate(updated);
    };

    return (
        <ModalWrapper title="Buy SMS Credits" onClose={onClose} height="h-auto">
            <div className="p-6 bg-gray-50">
                <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <span className="text-sm font-bold text-gray-500">Current Balance</span>
                    <span className="text-xl font-black text-[#ff4b9a]">{user.smsBalance} SMS</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { amount: 50, price: 100 },
                        { amount: 100, price: 180 },
                        { amount: 500, price: 800 },
                        { amount: 1000, price: 1500 },
                    ].map(pkg => (
                        <button key={pkg.amount} onClick={() => handleBuy(pkg.amount)} className="p-4 bg-white border border-gray-200 rounded-xl hover:border-[#ff4b9a] hover:shadow-md transition-all text-center">
                            <p className="font-black text-gray-900 text-lg">{pkg.amount}</p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase">Credits</p>
                            <div className="mt-3 bg-gray-100 text-gray-900 text-xs font-bold py-1.5 rounded-lg">৳ {pkg.price}</div>
                        </button>
                    ))}
                </div>
            </div>
        </ModalWrapper>
    );
};

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
                                    <p className="text-[10px] text-gray-500 flex items-center gap-1 mt-1">
                                        <MapPin size={10}/> 
                                        {typeof item.location === 'string' ? item.location : `${item.location?.area || ''}, ${item.location?.district || 'Bangladesh'}`}
                                    </p>
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
                <button onClick={handleSubmit} className="w-full py-4 bg-[#2d1b4e] text-white font-bold rounded-2xl shadow-xl hover:bg-[#3a2366] active:scale-95 transition-all">Save Changes</button>
            </div>
        </ModalWrapper>
    );
};

export default Profile;
