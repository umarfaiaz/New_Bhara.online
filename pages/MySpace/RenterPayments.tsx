
import React, { useState } from 'react';
import { Download, CheckCircle2, Clock, ChevronRight, X, FileText, AlertTriangle, MessageCircle, Phone, ArrowRight, TrendingUp } from 'lucide-react';
import { DataService } from '../../services/mockData';
import { Bill } from '../../types';
import { Logo } from '../../components/Logo';
import { useNavigate } from 'react-router-dom';

const RenterPayments: React.FC = () => {
    const navigate = useNavigate();
    // Filter bills for logged in tenant 't1'
    const [bills] = useState<Bill[]>(DataService.getBills().filter(b => b.tenant_id === 't1'));
    const [viewReceipt, setViewReceipt] = useState<Bill | null>(null);

    const paidBills = bills.filter(b => b.status === 'paid');
    const unpaidBills = bills.filter(b => b.status !== 'paid');
    
    const totalDue = unpaidBills.reduce((acc, curr) => acc + curr.total, 0);

    const handleMarkPaid = (billId: string) => {
        if(confirm("Mark this invoice as paid? The owner will verify it.")) {
             // In a real app, this would set status to 'pending_verification'
            DataService.updateBill(billId, { status: 'paid', paid_date: new Date().toISOString() });
            window.location.reload(); 
        }
    };

    const ReceiptModal = () => {
        if (!viewReceipt) return null;
        return (
            <div className="fixed inset-0 bg-black/80 z-[80] flex flex-col items-center justify-center p-4 backdrop-blur-md">
                <div className="bg-white w-full max-w-sm rounded-[1.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
                    <div className="bg-[#2d1b4e] p-6 text-white text-center relative">
                        <button onClick={() => setViewReceipt(null)} className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20"><X size={20}/></button>
                        <div className="mb-3 flex justify-center scale-90"><Logo light size="sm"/></div>
                        <h2 className="text-xl font-bold mb-1">{viewReceipt.status === 'paid' ? 'Payment Receipt' : 'Invoice Details'}</h2>
                        <p className="text-xs opacity-70">#{viewReceipt.id.slice(-6).toUpperCase()}</p>
                    </div>
                    
                    <div className="p-6">
                         <div className="text-center mb-6 mt-2">
                             <h3 className="text-2xl font-extrabold text-gray-900">৳ {viewReceipt.total.toLocaleString()}</h3>
                             <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase mt-2 ${viewReceipt.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-600'}`}>
                                 {viewReceipt.status === 'paid' ? (
                                    <><CheckCircle2 size={12}/> Paid on {new Date(viewReceipt.paid_date!).toLocaleDateString()}</>
                                 ) : (
                                    <><AlertTriangle size={12}/> Payment Due</>
                                 )}
                             </div>
                         </div>
                         
                         <div className="space-y-3 mb-6 border-t border-b border-gray-100 py-4">
                             <div className="flex justify-between text-sm"><span className="text-gray-500">Rent</span><span className="font-bold">৳ {viewReceipt.rent_amount}</span></div>
                             {viewReceipt.service_charge > 0 && <div className="flex justify-between text-sm"><span className="text-gray-500">Service</span><span className="font-bold">৳ {viewReceipt.service_charge}</span></div>}
                             {viewReceipt.electricity_bill! > 0 && <div className="flex justify-between text-sm"><span className="text-gray-500">Electricity</span><span className="font-bold">৳ {viewReceipt.electricity_bill}</span></div>}
                             {(viewReceipt.gas_bill > 0 || viewReceipt.water_bill > 0) && <div className="flex justify-between text-sm"><span className="text-gray-500">Utility</span><span className="font-bold">৳ {viewReceipt.gas_bill + viewReceipt.water_bill}</span></div>}
                             
                             {/* Extra Charges */}
                             {viewReceipt.extra_charges?.map((c, i) => (
                                 <div key={i} className="flex justify-between text-sm bg-gray-50 px-2 py-1 rounded"><span className="text-gray-600">{c.name}</span><span className="font-bold">৳ {c.amount}</span></div>
                             ))}
                         </div>

                         {viewReceipt.status === 'paid' ? (
                             <button className="w-full py-3 bg-[#2d1b4e] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg"><Download size={16}/> Download PDF</button>
                         ) : (
                             <div className="grid grid-cols-2 gap-3">
                                 <button onClick={() => navigate('/inbox')} className="py-3 bg-gray-100 text-gray-700 rounded-xl font-bold text-xs flex items-center justify-center gap-2"><MessageCircle size={16}/> Contact</button>
                                 <button onClick={() => handleMarkPaid(viewReceipt.id)} className="py-3 bg-[#ff4b9a] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg">Mark Paid</button>
                             </div>
                         )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="p-6 pb-32 min-h-screen bg-gray-50 max-w-2xl mx-auto">
            
            {/* 1. Total Due Dashboard */}
            <div className={`rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl mb-8 flex flex-col justify-between transition-all ${totalDue > 0 ? 'bg-[#ff4b9a]' : 'bg-emerald-600'}`}>
                <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-10 rounded-full -mr-12 -mt-12 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-black opacity-10 rounded-full -ml-8 -mb-8 blur-2xl"></div>
                
                <div className="relative z-10">
                    <p className="text-white/80 text-xs font-bold uppercase tracking-wider mb-2">Total Outstanding</p>
                    <h1 className="text-5xl font-black mb-6 tracking-tight flex items-baseline gap-1">
                        <span className="text-2xl opacity-80">৳</span>
                        {totalDue.toLocaleString()}
                    </h1>
                    
                    {totalDue > 0 ? (
                        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                            <div className="flex items-center gap-2 mb-1">
                                <AlertTriangle size={16} className="text-yellow-300"/> 
                                <span className="font-bold text-sm">Action Required</span>
                            </div>
                            <p className="text-xs text-white/90">You have {unpaidBills.length} pending invoices. Pay now to avoid interruption.</p>
                        </div>
                    ) : (
                         <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center gap-3">
                             <CheckCircle2 size={24} className="text-white"/>
                             <div>
                                 <p className="font-bold text-sm">All Clear!</p>
                                 <p className="text-xs text-white/80">No pending payments.</p>
                             </div>
                         </div>
                    )}
                </div>
            </div>

            {/* 2. Pending Invoices */}
            {unpaidBills.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">Pending Invoices</h3>
                    <div className="space-y-4">
                        {unpaidBills.map(bill => (
                            <div key={bill.id} className="bg-white p-5 rounded-3xl border border-red-100 shadow-sm relative group hover:shadow-md transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-lg">{bill.asset_name}</h4>
                                        <p className="text-xs text-gray-500">{new Date(bill.month).toLocaleDateString('en-US', {month: 'long', year: 'numeric'})}</p>
                                    </div>
                                    <div className="text-right">
                                        <h4 className="font-extrabold text-gray-900 text-xl">৳ {bill.total.toLocaleString()}</h4>
                                        <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded uppercase mt-1 inline-block">Due</span>
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-4 border-t border-gray-50">
                                    <button onClick={() => setViewReceipt(bill)} className="flex-1 py-3 bg-gray-50 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-100 transition-colors">View Invoice</button>
                                    <button onClick={() => handleMarkPaid(bill.id)} className="flex-1 py-3 bg-[#ff4b9a] text-white rounded-xl text-xs font-bold shadow-lg shadow-pink-200 active:scale-95 transition-transform">Mark as Paid</button>
                                    <button onClick={() => navigate('/inbox')} className="w-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100"><MessageCircle size={18}/></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 3. Payment History */}
            <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">History</h3>
                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                    {paidBills.map((bill, i) => (
                        <div 
                            key={bill.id} 
                            onClick={() => setViewReceipt(bill)} 
                            className={`p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors ${i !== paidBills.length - 1 ? 'border-b border-gray-50' : ''}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center border border-green-100">
                                    <FileText size={18}/>
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-gray-900">{new Date(bill.month).toLocaleDateString('en-US', {month: 'long', year: 'numeric'})}</h4>
                                    <p className="text-[10px] text-gray-400">Paid {new Date(bill.paid_date!).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-sm text-gray-900">৳ {bill.total.toLocaleString()}</p>
                                <ChevronRight size={16} className="text-gray-300 inline-block ml-1"/>
                            </div>
                        </div>
                    ))}
                    {paidBills.length === 0 && <p className="text-sm text-gray-400 text-center py-8">No payment history available.</p>}
                </div>
            </div>

            {viewReceipt && <ReceiptModal />}
        </div>
    );
};

export default RenterPayments;
