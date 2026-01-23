
import React, { useState, useRef } from 'react';
import { Download, CheckCircle2, Clock, ChevronRight, X, FileText, AlertTriangle, MessageCircle, Phone, ArrowRight, TrendingUp, Zap, Fingerprint, RefreshCcw, ArrowLeft } from 'lucide-react';
import { DataService } from '../../services/mockData';
import { Bill } from '../../types';
import { Logo } from '../../components/Logo';
import { useNavigate } from 'react-router-dom';

const RenterPayments: React.FC = () => {
    const navigate = useNavigate();
    const [bills, setBills] = useState<Bill[]>(DataService.getBills().filter(b => b.tenant_id === 't1'));
    const [viewReceipt, setViewReceipt] = useState<Bill | null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState<Bill | null>(null);

    const paidBills = bills.filter(b => b.status === 'paid');
    const unpaidBills = bills.filter(b => b.status !== 'paid');
    
    // Calculate total due (exclude those pending approval)
    const totalDue = unpaidBills.filter(b => b.status !== 'pending_approval').reduce((acc, curr) => acc + curr.total, 0);

    const handlePaymentComplete = (billId: string) => {
        // Change: Set status to pending_approval instead of paid
        DataService.updateBill(billId, { status: 'pending_approval', paid_date: new Date().toISOString() });
        setBills(DataService.getBills().filter(b => b.tenant_id === 't1'));
        if(viewReceipt?.id === billId) setViewReceipt(null);
        setShowConfirmModal(null);
        alert("Payment marked! Owner needs to approve.");
    };

    const handleAcceptChanges = (billId: string) => {
        DataService.updateBill(billId, { status: 'unpaid' }); // Or whatever status means accepted
        setBills(DataService.getBills().filter(b => b.tenant_id === 't1'));
        alert("Changes accepted.");
    };

    const HoldToPayButton = ({ onComplete }: { onComplete: () => void }) => {
        const [progress, setProgress] = useState(0);
        const intervalRef = useRef<any>(null);
        const [completed, setCompleted] = useState(false);

        const start = () => {
            if(completed) return;
            intervalRef.current = setInterval(() => {
            setProgress(p => {
                if (p >= 100) {
                clearInterval(intervalRef.current);
                setCompleted(true);
                onComplete();
                return 100;
                }
                return p + 4; // Speed
            });
            }, 20);
        };

        const stop = () => {
            if(completed) return;
            clearInterval(intervalRef.current);
            setProgress(0);
        };

        return (
            <button
            onMouseDown={start} onMouseUp={stop} onMouseLeave={stop}
            onTouchStart={start} onTouchEnd={stop}
            className="relative w-full h-16 bg-pink-50 rounded-2xl overflow-hidden select-none group active:scale-95 transition-transform shadow-inner mt-4"
            style={{ WebkitTapHighlightColor: 'transparent' }}
            >
            <div className="absolute inset-0 bg-[#ff4b9a] transition-all duration-75 ease-linear" style={{ width: `${progress}%` }}></div>
            <span className={`relative z-10 font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 ${progress > 50 ? 'text-white' : 'text-[#ff4b9a]'}`}>
                {completed ? <CheckCircle2 size={24} className="animate-bounce"/> : <Fingerprint size={24} className={progress > 0 ? 'animate-pulse' : ''}/>} 
                {completed ? 'Sent' : 'Hold to Pay'}
            </span>
            </button>
        )
    };

    const PaymentConfirmModal = () => {
        if (!showConfirmModal) return null;
        return (
            <div className="fixed inset-0 bg-black/80 z-[90] flex flex-col items-center justify-center p-4 backdrop-blur-md">
                <div className="bg-white w-full max-w-sm rounded-[2rem] p-6 shadow-2xl animate-in zoom-in-95 text-center">
                    <div className="w-16 h-16 bg-pink-50 text-[#ff4b9a] rounded-full flex items-center justify-center mx-auto mb-4">
                        <Zap size={32} fill="currentColor"/>
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-1">Confirm Payment</h3>
                    <p className="text-gray-500 text-sm mb-6">You are marking <span className="font-bold text-gray-900">৳{showConfirmModal.total.toLocaleString()}</span> as paid for {showConfirmModal.asset_name}.</p>
                    
                    <HoldToPayButton onComplete={() => handlePaymentComplete(showConfirmModal.id)} />
                    
                    <button onClick={() => setShowConfirmModal(null)} className="mt-4 text-sm font-bold text-gray-400 hover:text-gray-600">Cancel</button>
                </div>
            </div>
        );
    };

    const ReceiptModal = () => {
        if (!viewReceipt) return null;
        
        const isChangesPending = viewReceipt.status === 'changes_pending';
        
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
                             <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase mt-2 ${viewReceipt.status === 'paid' ? 'bg-green-100 text-green-700' : viewReceipt.status === 'pending_approval' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-50 text-red-600'}`}>
                                 {viewReceipt.status === 'paid' ? (
                                    <><CheckCircle2 size={12}/> Paid</>
                                 ) : viewReceipt.status === 'pending_approval' ? (
                                    <><Clock size={12}/> Pending Approval</>
                                 ) : (
                                    <><AlertTriangle size={12}/> Payment Due</>
                                 )}
                             </div>
                         </div>
                         
                         {isChangesPending && (
                             <div className="bg-orange-50 p-3 rounded-xl border border-orange-100 mb-4 text-xs text-orange-800 font-bold flex items-start gap-2">
                                 <RefreshCcw size={16} className="shrink-0 mt-0.5"/>
                                 Owner updated this bill. Please review and accept the new total.
                             </div>
                         )}
                         
                         <div className="space-y-3 mb-6 border-t border-b border-gray-100 py-4">
                             <div className="flex justify-between text-sm"><span className="text-gray-500">Rent</span><span className="font-bold">৳ {viewReceipt.rent_amount}</span></div>
                             {viewReceipt.service_charge > 0 && <div className="flex justify-between text-sm"><span className="text-gray-500">Service</span><span className="font-bold">৳ {viewReceipt.service_charge}</span></div>}
                             {viewReceipt.electricity_bill! > 0 && <div className="flex justify-between text-sm"><span className="text-gray-500">Electricity</span><span className="font-bold">৳ {viewReceipt.electricity_bill}</span></div>}
                             {(viewReceipt.gas_bill > 0 || viewReceipt.water_bill > 0) && <div className="flex justify-between text-sm"><span className="text-gray-500">Utility</span><span className="font-bold">৳ {viewReceipt.gas_bill + viewReceipt.water_bill}</span></div>}
                             {viewReceipt.extra_charges?.map((c, i) => (
                                 <div key={i} className="flex justify-between text-sm bg-gray-50 px-2 py-1 rounded"><span className="text-gray-600">{c.name}</span><span className="font-bold">৳ {c.amount}</span></div>
                             ))}
                         </div>

                         {viewReceipt.status === 'paid' ? (
                             <button className="w-full py-3 bg-[#2d1b4e] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg"><Download size={16}/> Download PDF</button>
                         ) : isChangesPending ? (
                             <button onClick={() => handleAcceptChanges(viewReceipt.id)} className="w-full py-3 bg-orange-600 text-white rounded-xl font-bold text-sm shadow-lg">Accept Changes</button>
                         ) : viewReceipt.status === 'pending_approval' ? (
                             <button disabled className="w-full py-3 bg-gray-100 text-gray-400 rounded-xl font-bold text-sm cursor-not-allowed">Waiting for Approval</button>
                         ) : (
                             <div className="flex gap-3">
                                 <button onClick={() => navigate('/inbox')} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold text-xs flex items-center justify-center gap-2"><MessageCircle size={16}/> Contact</button>
                                 <button onClick={() => setShowConfirmModal(viewReceipt)} className="flex-1 py-3 bg-[#ff4b9a] text-white rounded-xl font-bold text-sm shadow-lg hover:bg-[#e63f85]">Pay Now</button>
                             </div>
                         )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex h-screen bg-gray-50 relative flex-col">
            
            {/* Header - Fixed to match Owner Layout */}
            <div className="bg-white border-b border-gray-200 px-6 py-5 shrink-0">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate('/myspace/overview')} className="p-2 -ml-2 rounded-full hover:bg-gray-100 md:hidden"><ArrowLeft size={20}/></button>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Payments</h1>
                    </div>
                </div>
                <div className={`rounded-2xl p-5 text-white relative overflow-hidden shadow-lg transition-all ${totalDue > 0 ? 'bg-[#ff4b9a]' : 'bg-emerald-600'}`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                    <div className="relative z-10">
                        <p className="text-white/80 text-xs font-bold uppercase tracking-wider mb-2">Total Due</p>
                        <h1 className="text-4xl font-black mb-0 tracking-tight flex items-baseline gap-1"><span className="text-xl opacity-80">৳</span>{totalDue.toLocaleString()}</h1>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-6 pt-4 space-y-4">
                {unpaidBills.length > 0 && <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider px-2">Unpaid & Pending</h3>}
                {unpaidBills.map(bill => (
                    <div key={bill.id} onClick={() => setViewReceipt(bill)} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm relative group hover:shadow-md transition-all cursor-pointer">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="font-bold text-gray-900 text-lg">{bill.asset_name}</h4>
                                <p className="text-xs text-gray-500">{new Date(bill.month).toLocaleDateString('en-US', {month: 'long', year: 'numeric'})}</p>
                                {bill.status === 'pending_approval' && <span className="text-[10px] font-bold text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded mt-2 inline-block">Waiting Approval</span>}
                                {bill.status === 'changes_pending' && <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded mt-2 inline-block">Changes Made</span>}
                            </div>
                            <div className="text-right">
                                <h4 className="font-extrabold text-gray-900 text-xl">৳ {bill.total.toLocaleString()}</h4>
                                {bill.status !== 'pending_approval' && bill.status !== 'changes_pending' && <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded uppercase mt-1 inline-block">Due</span>}
                            </div>
                        </div>
                        <div className="flex gap-3 pt-4 border-t border-gray-50">
                            {bill.status === 'changes_pending' ? (
                                <button className="flex-1 py-3 text-sm bg-orange-500 text-white rounded-xl font-bold shadow-lg">Review Changes</button>
                            ) : bill.status === 'pending_approval' ? (
                                <button disabled className="flex-1 py-3 text-sm bg-gray-100 text-gray-400 rounded-xl font-bold">Pending Approval</button>
                            ) : (
                                <button onClick={(e) => { e.stopPropagation(); setShowConfirmModal(bill); }} className="flex-1 py-3 text-sm bg-[#ff4b9a] text-white rounded-xl font-bold shadow-lg shadow-pink-200 active:scale-95 transition-all flex items-center justify-center gap-1 hover:bg-[#e63f85]"><Zap size={16} fill="currentColor"/> Pay Now</button>
                            )}
                        </div>
                    </div>
                ))}

                <div className="pt-4">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">History</h3>
                    {paidBills.map((bill, i) => (
                        <div key={bill.id} onClick={() => setViewReceipt(bill)} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between mb-3 cursor-pointer hover:bg-gray-50">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center border border-green-100"><FileText size={18}/></div>
                                <div><h4 className="font-bold text-sm text-gray-900">{new Date(bill.month).toLocaleDateString('en-US', {month: 'long', year: 'numeric'})}</h4><p className="text-[10px] text-gray-400">Paid {new Date(bill.paid_date!).toLocaleDateString()}</p></div>
                            </div>
                            <div className="text-right"><p className="font-bold text-sm text-gray-900">৳ {bill.total.toLocaleString()}</p><button className="text-[10px] font-bold text-[#ff4b9a] hover:underline mt-1 flex items-center justify-end gap-1"><Download size={10}/> Receipt</button></div>
                        </div>
                    ))}
                </div>
            </div>

            {viewReceipt && <ReceiptModal />}
            {showConfirmModal && <PaymentConfirmModal />}
        </div>
    );
};

export default RenterPayments;
