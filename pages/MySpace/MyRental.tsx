import React, { useState } from 'react';
import { MapPin, Calendar, FileText, Download, Phone, User, Zap, Droplets, ChevronLeft, ShieldCheck, Car, Home, Wallet, MessageCircle, Wrench, Clock, CreditCard, Receipt, FileSignature } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DataService, ChatService } from '../../services/mockData';
import { Tenant } from '../../types';

const MyRental: React.FC = () => {
    const navigate = useNavigate();
    const rentals = DataService.getMyRentals();
    const [selectedRental, setSelectedRental] = useState<Tenant | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'financials' | 'owner' | 'agreement'>('overview');

    // --- LIST VIEW ---
    if (!selectedRental) {
        return (
            <div className="min-h-screen bg-gray-50 pb-32 p-4 sm:p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-black text-gray-900">My Rentals</h1>
                    <span className="bg-white px-3 py-1 rounded-full text-xs font-bold shadow-sm text-gray-500">{rentals.length} Active</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {rentals.map(rental => (
                        <div 
                            key={rental.id} 
                            onClick={() => setSelectedRental(rental as unknown as Tenant)}
                            className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer flex gap-4 group"
                        >
                            <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden shrink-0 relative">
                                <img 
                                    src={rental.asset_type === 'Vehicle' ? 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=300' : 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=300'} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute top-1 right-1 bg-green-500 w-2.5 h-2.5 rounded-full border-2 border-white"></div>
                            </div>
                            <div className="flex-1 flex flex-col justify-center">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-gray-900 text-lg leading-tight">{rental.asset_info?.name}</h3>
                                    <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded font-bold uppercase text-gray-500">{rental.asset_type}</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><MapPin size={12}/> {rental.asset_info?.sub_text}</p>
                                <div className="mt-3 flex items-center gap-2 text-xs font-bold text-[#ff4b9a]">
                                    <Clock size={12}/> Due: 5th Oct
                                </div>
                            </div>
                        </div>
                    ))}
                    {rentals.length === 0 && (
                        <div className="col-span-full py-20 text-center text-gray-400">
                            <Home size={48} className="mx-auto mb-3 opacity-20"/>
                            <p>No active rentals found.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // --- DETAIL VIEW ---
    
    // Mock Asset Data Fetching based on rental
    const asset = selectedRental.asset_type === 'Residential' ? DataService.getFlats().find(f => f.id === selectedRental.asset_id) : DataService.getVehicles().find(v => v.id === selectedRental.asset_id);
    const startDate = new Date(selectedRental.start_date);
    const today = new Date();
    const activeDays = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 3600 * 24));

    return (
        <div className="min-h-screen bg-gray-50 pb-32 animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="bg-white sticky top-0 z-20 shadow-sm">
                <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                    <button onClick={() => setSelectedRental(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ChevronLeft size={20}/>
                    </button>
                    <h2 className="font-bold text-lg">{selectedRental.asset_info?.name}</h2>
                </div>
                {/* Tabs */}
                <div className="flex overflow-x-auto scrollbar-hide px-4 pt-2">
                    {[
                        { id: 'overview', label: 'Overview', icon: FileText },
                        { id: 'financials', label: 'Financials', icon: CreditCard },
                        { id: 'owner', label: 'Owner', icon: User },
                        { id: 'agreement', label: 'Agreement', icon: FileSignature },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold text-xs transition-all whitespace-nowrap ${activeTab === tab.id ? 'border-[#ff4b9a] text-[#ff4b9a]' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                        >
                            <tab.icon size={14}/> {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-6 max-w-3xl mx-auto space-y-6">
                
                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && (
                    <div className="space-y-6 animate-in fade-in">
                        <div className="relative h-48 rounded-2xl overflow-hidden shadow-sm group">
                            <img 
                                src={selectedRental.asset_type === 'Vehicle' ? 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800' : 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800'} 
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <div className="absolute bottom-4 left-4 text-white">
                                <span className="px-2 py-1 bg-white/20 backdrop-blur-md rounded text-[10px] font-bold uppercase mb-1 inline-block border border-white/20">{selectedRental.asset_type}</span>
                                <p className="text-sm opacity-90"><MapPin size={12} className="inline mr-1"/> {selectedRental.asset_info?.sub_text}</p>
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-gray-900 text-sm">Lease Details</h3>
                                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">Active</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><p className="text-[10px] text-gray-400 font-bold uppercase">Start Date</p><p className="font-medium text-sm text-gray-900">{new Date(selectedRental.start_date).toLocaleDateString()}</p></div>
                                <div><p className="text-[10px] text-gray-400 font-bold uppercase">Duration</p><p className="font-medium text-sm text-gray-900">{activeDays} Days</p></div>
                                <div><p className="text-[10px] text-gray-400 font-bold uppercase">Security Deposit</p><p className="font-medium text-sm text-gray-900">৳ {selectedRental.security_deposit?.toLocaleString()}</p></div>
                                <div><p className="text-[10px] text-gray-400 font-bold uppercase">Notice Period</p><p className="font-medium text-sm text-gray-900">1 Month</p></div>
                            </div>
                        </div>

                        {/* Specs (if available) */}
                        {asset && (
                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                                <h3 className="font-bold text-gray-900 text-sm mb-4">Specifications</h3>
                                <div className="space-y-3">
                                    {selectedRental.asset_type === 'Residential' && (
                                        <>
                                            <div className="flex justify-between text-sm border-b border-gray-50 pb-2"><span className="text-gray-500">Size</span><span className="font-bold">{(asset as any).sizeSqft} Sq Ft</span></div>
                                            <div className="flex justify-between text-sm border-b border-gray-50 pb-2"><span className="text-gray-500">Bedrooms</span><span className="font-bold">{(asset as any).bedrooms}</span></div>
                                            <div className="flex justify-between text-sm"><span className="text-gray-500">Floor</span><span className="font-bold">{(asset as any).floorNumber}</span></div>
                                        </>
                                    )}
                                    {selectedRental.asset_type === 'Vehicle' && (
                                        <>
                                            <div className="flex justify-between text-sm border-b border-gray-50 pb-2"><span className="text-gray-500">Model Year</span><span className="font-bold">{(asset as any).modelYear}</span></div>
                                            <div className="flex justify-between text-sm border-b border-gray-50 pb-2"><span className="text-gray-500">License</span><span className="font-bold">{(asset as any).licensePlate}</span></div>
                                            <div className="flex justify-between text-sm"><span className="text-gray-500">Fuel</span><span className="font-bold">{(asset as any).specifications?.fuelType}</span></div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* FINANCIALS TAB */}
                {activeTab === 'financials' && (
                    <div className="space-y-6 animate-in fade-in">
                        <div className="bg-[#2d1b4e] text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                            <div className="relative z-10">
                                <p className="text-xs font-bold opacity-70 uppercase mb-1">Monthly Rent</p>
                                <h2 className="text-4xl font-black mb-4">৳ {(asset as any)?.rentConfig?.rates?.Monthly?.toLocaleString() || 25000}</h2>
                                <div className="flex gap-2">
                                    <button onClick={() => navigate('/myspace/payments')} className="bg-white text-[#2d1b4e] px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors">Pay Now</button>
                                    <button onClick={() => navigate('/myspace/payments')} className="bg-white/10 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-white/20 transition-colors">History</button>
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-8 -mt-8"></div>
                        </div>

                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-900 text-sm mb-4">Included Utilities</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {['Water', 'Service Charge'].map(u => (
                                    <div key={u} className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                        <CheckCircle2 size={16} className="text-green-500"/>
                                        <span className="text-xs font-bold text-gray-700">{u}</span>
                                    </div>
                                ))}
                                {['Gas', 'Electricity'].map(u => (
                                    <div key={u} className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                        <X size={16} className="text-red-400"/>
                                        <span className="text-xs font-bold text-gray-500">{u} (Meter)</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* OWNER TAB */}
                {activeTab === 'owner' && (
                    <div className="space-y-6 animate-in fade-in">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                            <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl border-4 border-gray-50">
                                👨‍💼
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Rafiqul Islam</h3>
                            <p className="text-sm text-gray-500 mb-6">Property Owner</p>
                            
                            <div className="flex justify-center gap-4">
                                <button onClick={() => window.open('tel:01700000000')} className="flex items-center gap-2 px-5 py-2.5 bg-green-50 text-green-700 rounded-xl text-xs font-bold hover:bg-green-100 transition-colors">
                                    <Phone size={16}/> Call
                                </button>
                                <button onClick={() => { ChatService.startChat('u1', ''); navigate('/inbox'); }} className="flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors">
                                    <MessageCircle size={16}/> Message
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* AGREEMENT TAB */}
                {activeTab === 'agreement' && (
                    <div className="space-y-6 animate-in fade-in">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[400px]">
                            {selectedRental.agreement_text ? (
                                <div className="prose prose-sm max-w-none text-gray-700">
                                    <div dangerouslySetInnerHTML={{ __html: selectedRental.agreement_text }} />
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                                    <FileSignature size={48} className="mb-3 opacity-20"/>
                                    <p className="text-sm font-medium">No digital agreement found.</p>
                                </div>
                            )}
                        </div>
                        {selectedRental.agreement_text && (
                            <button className="w-full py-3 bg-[#2d1b4e] text-white rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2">
                                <Download size={16}/> Download PDF
                            </button>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
};

// Helper Icon for utilities check
const CheckCircle2 = ({size, className}: any) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>;
const X = ({size, className}: any) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>;

export default MyRental;