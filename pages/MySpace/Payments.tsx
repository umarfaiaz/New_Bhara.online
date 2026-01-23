
import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Plus, Filter, Download, Share2, MoreVertical, 
  CheckCircle2, X, ChevronRight, ArrowUpRight, DollarSign, 
  FileText, Calendar, Wallet, Send, Trash2, Edit3, 
  AlertCircle, ChevronDown, Printer, Copy, Check, Car, Home, Camera, Briefcase, Phone, MessageCircle, ArrowLeft, Flame, Droplets, Zap, Wrench, Fingerprint, ShieldCheck, CheckCheck
} from 'lucide-react';
import { DataService } from '../../services/mockData';
import { Bill, AssetType, BillCharge } from '../../types';
import { Logo } from '../../components/Logo';
import { useNavigate } from 'react-router-dom';

// --- Types & Constants ---

const CHARGE_CATEGORIES: Record<string, string[]> = {
    'Residential': ['Water Bill', 'Gas Bill', 'Electricity', 'Service Charge', 'Late Fee', 'Maintenance', 'Internet'],
    'Commercial': ['Service Charge', 'Utility', 'Tax', 'Maintenance', 'Signage Fee'],
    'Vehicle': ['Fuel', 'Driver Allowance', 'Toll', 'Fine/Ticket', 'Parking', 'Wash/Cleaning'],
    'Gadget': ['Late Return', 'Damage', 'Accessory Missing'],
    'General': ['Discount', 'Adjustment', 'Other']
};

const CATEGORY_ICONS: Record<string, any> = {
    'Water Bill': Droplets,
    'Gas Bill': Flame,
    'Electricity': Zap,
    'Service Charge': ShieldCheck,
    'Maintenance': Wrench,
    'Fuel': Flame,
    'Other': FileText
};

const PAYMENT_METHODS = ['Cash', 'Bank Transfer', 'bKash', 'Nagad', 'Cheque'];

// --- Helper Functions ---

const formatCurrency = (amount: number) => `৳${amount.toLocaleString()}`;

const getStatusColor = (status: string) => {
    switch(status) {
        case 'paid': return 'bg-green-100 text-green-700 border-green-200';
        case 'partial': return 'bg-blue-50 text-blue-700 border-blue-200';
        case 'unpaid': return 'bg-red-50 text-red-700 border-red-200';
        case 'pending_approval': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        case 'changes_pending': return 'bg-orange-100 text-orange-700 border-orange-200';
        default: return 'bg-gray-100 text-gray-700';
    }
};

const getStatusLabel = (status: string) => {
    switch(status) {
        case 'pending_approval': return 'Review Payment';
        case 'changes_pending': return 'Waiting Accept';
        default: return status;
    }
}

const getAssetIcon = (type: AssetType) => {
    switch(type) {
        case 'Vehicle': return <Car size={16} />;
        case 'Residential': return <Home size={16} />;
        case 'Gadget': return <Camera size={16} />;
        default: return <Briefcase size={16} />;
    }
};

// --- HOLD BUTTON COMPONENT ---
const HoldButton = ({ onComplete, label = "Hold to Confirm", color = "bg-[#2d1b4e]" }: { onComplete: () => void, label?: string, color?: string }) => {
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
        return p + 4; // Fill speed
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
      className="relative w-full h-16 bg-gray-100 rounded-2xl overflow-hidden select-none group active:scale-95 transition-transform shadow-inner"
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <div className={`absolute inset-0 ${color} transition-all duration-75 ease-linear`} style={{ width: `${progress}%` }}></div>
      <span className={`relative z-10 font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 ${progress > 50 ? 'text-white' : 'text-gray-500'}`}>
        {completed ? <CheckCircle2 size={24} className="animate-bounce"/> : <Fingerprint size={24} className={progress > 0 ? 'animate-pulse' : ''}/>} 
        {completed ? 'Confirmed' : label}
      </span>
    </button>
  )
};

// --- Main Component ---

const Payments: React.FC = () => {
    const navigate = useNavigate();
    // Data State
    const [bills, setBills] = useState<Bill[]>([]);
    const [stats, setStats] = useState({ collected: 0, pending: 0, overdue: 0 });
    
    // UI State
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState<'All'|'Paid'|'Unpaid'|'Partial'|'Review'>('All');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [activeBill, setActiveBill] = useState<Bill | null>(null); // For Slide-Over
    
    // Modals State
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showChargeModal, setShowChargeModal] = useState(false);
    const [isBulkCharge, setIsBulkCharge] = useState(false);

    // Initial Load
    useEffect(() => {
        refreshData();
    }, []);

    const refreshData = () => {
        const allBills = DataService.getBills().sort((a, b) => new Date(b.month).getTime() - new Date(a.month).getTime());
        setBills(allBills);
        
        // Calculate Stats
        let collected = 0, pending = 0, overdue = 0;
        allBills.forEach(b => {
            if(b.status === 'paid') collected += b.total; // Count full total as collected if paid
            else if (b.status === 'partial') collected += (b.paid_amount || 0);
            
            if(b.status !== 'paid') {
                pending += (b.total - (b.paid_amount || 0));
                if(new Date(b.month) < new Date(Date.now() - 30*24*60*60*1000)) overdue++;
            }
        });
        setStats({ collected, pending, overdue });

        // Update active bill if open
        if (activeBill) {
            const updated = allBills.find(b => b.id === activeBill.id);
            if (updated) setActiveBill(updated);
        }
    };

    // --- Actions ---

    const handleSelect = (id: string) => {
        const newSet = new Set(selectedIds);
        if(newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedIds(newSet);
    };

    const handleBulkAction = (action: 'remind' | 'charge') => {
        if(action === 'charge') {
            setIsBulkCharge(true);
            setShowChargeModal(true);
        } else {
            alert(`Sent payment reminders to ${selectedIds.size} tenants.`);
            setSelectedIds(new Set());
        }
    };

    const quickAction = (e: React.MouseEvent, type: 'call' | 'share' | 'pay' | 'add_charge' | 'review', bill: Bill) => {
        e.stopPropagation();
        if(type === 'call') window.open('tel:01700000000');
        if(type === 'share') {
            const balance = bill.total - (bill.paid_amount || 0);
            const text = `Invoice for ${bill.asset_name}. Due: ৳${balance}. Please pay via bKash.`;
            navigator.clipboard.writeText(text);
            alert("Invoice summary copied!");
        }
        if(type === 'pay' || type === 'review') {
            setActiveBill(bill);
            setShowPaymentModal(true);
        }
        if(type === 'add_charge') {
            setActiveBill(bill);
            setIsBulkCharge(false);
            setShowChargeModal(true);
        }
    };

    // --- Renderers ---

    const filteredBills = bills.filter(b => {
        const matchesSearch = b.tenant_name?.toLowerCase().includes(search.toLowerCase()) || b.asset_name?.toLowerCase().includes(search.toLowerCase());
        let matchesStatus = true;
        
        if (filterStatus === 'Paid') matchesStatus = b.status === 'paid';
        if (filterStatus === 'Unpaid') matchesStatus = b.status === 'unpaid';
        if (filterStatus === 'Partial') matchesStatus = b.status === 'partial';
        if (filterStatus === 'Review') matchesStatus = b.status === 'pending_approval';

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden relative">
            {/* LEFT COLUMN: LIST */}
            <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${activeBill ? 'hidden md:flex md:w-1/2 lg:w-3/5' : 'w-full'}`}>
                
                {/* Header Stats */}
                <div className="bg-white border-b border-gray-200 px-6 py-5">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <button onClick={() => navigate('/myspace/overview')} className="p-2 -ml-2 rounded-full hover:bg-gray-100 md:hidden"><ArrowLeft size={20}/></button>
                            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Payments</h1>
                        </div>
                        <button className="bg-[#2d1b4e] text-white w-10 h-10 rounded-xl flex items-center justify-center hover:scale-105 transition-transform shadow-lg">
                            <Plus size={20}/>
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
                            <p className="text-[10px] font-bold text-green-600 uppercase tracking-wider mb-1">Collected</p>
                            <p className="text-2xl font-black text-green-700">{formatCurrency(stats.collected)}</p>
                        </div>
                        <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
                            <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider mb-1">Pending</p>
                            <p className="text-2xl font-black text-red-700">{formatCurrency(stats.pending)}</p>
                        </div>
                    </div>
                </div>

                {/* Filters & Bulk Bar */}
                <div className="px-6 py-4 flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                            <input 
                                type="text" 
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search..." 
                                className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:border-[#ff4b9a]"
                            />
                        </div>
                        <div className="flex bg-gray-200 p-1 rounded-xl overflow-x-auto scrollbar-hide">
                            {['All', 'Unpaid', 'Review'].map(s => (
                                <button 
                                    key={s} 
                                    onClick={() => setFilterStatus(s as any)}
                                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${filterStatus === s ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
                                >
                                    {s === 'Review' ? 'Approvals' : s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Bulk Action Bar */}
                    {selectedIds.size > 0 && (
                        <div className="bg-[#2d1b4e] text-white p-3 rounded-xl flex items-center justify-between shadow-lg animate-in slide-in-from-top-2">
                            <div className="flex items-center gap-3 px-2">
                                <span className="font-bold text-sm">{selectedIds.size} Selected</span>
                                <button onClick={() => setSelectedIds(new Set())} className="text-white/60 hover:text-white"><X size={14}/></button>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleBulkAction('charge')} className="bg-white/20 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-white/30 flex items-center gap-1"><Plus size={12}/> Charge</button>
                                <button onClick={() => handleBulkAction('remind')} className="bg-white/20 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-white/30 flex items-center gap-1"><Send size={12}/> Remind</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* List - Improved Design */}
                <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-20 space-y-4">
                    {filteredBills.map(bill => {
                        const balance = bill.total - (bill.paid_amount || 0);
                        const isSelected = selectedIds.has(bill.id);
                        const isReviewNeeded = bill.status === 'pending_approval';
                        
                        return (
                            <div 
                                key={bill.id}
                                onClick={() => setActiveBill(bill)}
                                onLongPress={() => handleSelect(bill.id)} 
                                className={`group relative bg-white rounded-3xl border transition-all cursor-pointer hover:shadow-lg ${activeBill?.id === bill.id ? 'border-[#ff4b9a] ring-1 ring-[#ff4b9a] bg-pink-50/10' : 'border-gray-100'} ${isSelected ? 'bg-[#2d1b4e]/5 border-[#2d1b4e]' : ''}`}
                            >
                                <div className="p-5">
                                    <div className="flex items-start justify-between">
                                        <div className="flex gap-4">
                                            {/* Selection Circle */}
                                            <div 
                                                onClick={(e) => { e.stopPropagation(); handleSelect(bill.id); }}
                                                className={`w-6 h-6 rounded-full border-2 mt-1 flex items-center justify-center transition-colors ${isSelected ? 'bg-[#2d1b4e] border-[#2d1b4e]' : 'border-gray-200 hover:border-gray-400'}`}
                                            >
                                                {isSelected && <Check size={14} className="text-white"/>}
                                            </div>
                                            
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-base">{bill.tenant_name}</h4>
                                                <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5">
                                                    {getAssetIcon(bill.asset_type)} {bill.asset_name}
                                                    <span className="w-1 h-1 rounded-full bg-gray-300"></span> 
                                                    {new Date(bill.month).toLocaleDateString('en-US', {month:'short'})}
                                                </p>
                                                
                                                {isReviewNeeded && (
                                                    <div className="mt-2 inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-1 rounded-full animate-pulse">
                                                        <AlertCircle size={12}/> Needs Approval
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <span className="font-black text-gray-900 text-lg block">{formatCurrency(bill.total)}</span>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border inline-block mt-1 ${getStatusColor(bill.status)}`}>
                                                {getStatusLabel(bill.status)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Footer */}
                                    <div className="mt-4 pt-4 border-t border-gray-50 flex gap-2">
                                        {isReviewNeeded ? (
                                            <button onClick={(e) => quickAction(e, 'review', bill)} className="flex-1 py-2 bg-[#2d1b4e] text-white rounded-xl text-xs font-bold shadow hover:bg-[#3a2366] transition-colors">
                                                Review Payment
                                            </button>
                                        ) : bill.status !== 'paid' ? (
                                            <>
                                                <button onClick={(e) => quickAction(e, 'pay', bill)} className="flex-1 py-2 bg-[#2d1b4e] text-white rounded-xl text-xs font-bold hover:bg-[#3a2366] transition-colors shadow-sm">Record Pay</button>
                                                <button onClick={(e) => quickAction(e, 'add_charge', bill)} className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors">Add Charge</button>
                                                <button onClick={(e) => quickAction(e, 'share', bill)} className="px-3 py-2 bg-gray-50 text-gray-500 rounded-xl hover:bg-gray-100"><Share2 size={16}/></button>
                                            </>
                                        ) : (
                                            <button onClick={(e) => quickAction(e, 'share', bill)} className="flex-1 py-2 bg-green-50 text-green-700 rounded-xl text-xs font-bold hover:bg-green-100 flex items-center justify-center gap-2">
                                                <CheckCheck size={14}/> Receipt Sent
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* RIGHT COLUMN: SLIDE-OVER INVOICE */}
            {activeBill && (
                <InvoiceDrawer 
                    bill={activeBill} 
                    onClose={() => setActiveBill(null)}
                    onAddCharge={() => { setIsBulkCharge(false); setShowChargeModal(true); }}
                    onPay={() => setShowPaymentModal(true)}
                    onUpdate={(updated) => { 
                        DataService.updateBill(activeBill.id, updated); 
                        refreshData(); 
                    }}
                />
            )}

            {/* --- MODALS --- */}

            {/* 1. Add Charge Modal */}
            {showChargeModal && (
                <AddChargeModal 
                    onClose={() => setShowChargeModal(false)}
                    onSubmit={(charge) => {
                        const targetIds = isBulkCharge ? Array.from(selectedIds) : activeBill ? [activeBill.id] : [];
                        targetIds.forEach(id => {
                            const b = bills.find(x => x.id === id);
                            if(b) {
                                const newTotal = b.total + charge.amount;
                                const newExtras = [...(b.extra_charges || []), charge];
                                // If adding charge to a paid/pending bill, status changes to 'changes_pending'
                                const newStatus = b.status === 'paid' || b.status === 'pending_approval' ? 'changes_pending' : b.status;
                                DataService.updateBill(id, { total: newTotal, extra_charges: newExtras, status: newStatus });
                            }
                        });
                        refreshData();
                        setShowChargeModal(false);
                        setSelectedIds(new Set());
                    }}
                    assetType={activeBill?.asset_type || 'Residential'} // Default if bulk
                />
            )}

            {/* 2. Payment Modal */}
            {showPaymentModal && activeBill && (
                <PaymentModal 
                    bill={activeBill}
                    onClose={() => setShowPaymentModal(false)}
                    onSubmit={(amount, method, note) => {
                        const currentPaid = activeBill.paid_amount || 0;
                        let newPaid = currentPaid;
                        let newStatus: Bill['status'] = activeBill.status;

                        // Case: Owner approving a pending payment
                        if (activeBill.status === 'pending_approval') {
                            newStatus = 'paid';
                            // Logic: If user said paid full, we trust amount matches total
                            newPaid = activeBill.total; 
                        } else {
                            // Case: Owner recording new payment manually
                            newPaid = currentPaid + amount;
                            newStatus = newPaid >= activeBill.total ? 'paid' : 'partial';
                        }
                        
                        // Case: Reverting from Paid to Unpaid/Partial (if editing)
                        if (activeBill.status === 'paid' && newStatus !== 'paid') {
                            newStatus = 'changes_pending'; // Renter needs to accept this reversion
                        }

                        DataService.updateBill(activeBill.id, {
                            paid_amount: newPaid,
                            status: newStatus,
                            paid_date: new Date().toISOString(),
                            paid_method: method,
                            paid_note: note
                        });
                        refreshData();
                        setShowPaymentModal(false);
                    }}
                />
            )}

        </div>
    );
};

// ... Sub Components ...
const InvoiceDrawer: React.FC<{ 
    bill: Bill, 
    onClose: () => void, 
    onAddCharge: () => void, 
    onPay: () => void,
    onUpdate: (data: Partial<Bill>) => void
}> = ({ bill, onClose, onAddCharge, onPay, onUpdate }) => {
    // ... existing drawer logic ...
    const balance = bill.total - (bill.paid_amount || 0);
    const handleShare = () => {
        const text = `Invoice for ${bill.asset_name}\nMonth: ${new Date(bill.month).toLocaleDateString('en-US', {month:'long', year:'numeric'})}\nTotal Due: ৳${bill.total}\nPaid: ৳${bill.paid_amount||0}\nBalance: ৳${balance}\nPlease pay via bKash to 01700000000.`;
        navigator.clipboard.writeText(text);
        alert("Invoice copied to clipboard!");
    };

    const isPendingApproval = bill.status === 'pending_approval';

    return (
        <div className="fixed inset-0 z-50 md:relative md:inset-auto md:w-1/2 lg:w-2/5 bg-white shadow-2xl md:border-l border-gray-200 flex flex-col animate-in slide-in-from-right duration-300">
            <div className={`text-white p-6 shrink-0 relative transition-colors ${isPendingApproval ? 'bg-yellow-600' : 'bg-[#2d1b4e]'}`}>
                <button onClick={onClose} className="absolute top-4 left-4 p-2 bg-white/10 rounded-full hover:bg-white/20 flex items-center gap-1 pr-3">
                    <ArrowLeft size={18}/> <span className="text-xs font-bold md:hidden">Back</span>
                </button>
                <div className="flex justify-between items-start mt-8">
                    <div>
                        <div className="flex items-center gap-2 mb-1 opacity-80">
                            <span className="text-xs font-bold uppercase tracking-widest">Invoice</span>
                            <span className="text-[10px] bg-white/20 px-1.5 rounded">#{bill.id.slice(-4)}</span>
                        </div>
                        <h2 className="text-4xl font-black tracking-tight">৳ {bill.total.toLocaleString()}</h2>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border border-white/20 ${bill.status === 'paid' ? 'bg-green-500' : bill.status === 'partial' ? 'bg-blue-500' : 'bg-white/10'}`}>
                        {getStatusLabel(bill.status)}
                    </div>
                </div>
                {isPendingApproval ? (
                    <div className="mt-4 bg-black/20 p-2 rounded-lg text-xs font-bold flex items-center gap-2">
                        <AlertCircle size={14}/> Renter marked as Paid. Please confirm.
                    </div>
                ) : bill.paid_amount! > 0 && (
                    <div className="mt-4 flex gap-4 text-xs font-medium opacity-80 bg-white/10 p-2 rounded-lg inline-flex">
                        <span>Paid: ৳{bill.paid_amount?.toLocaleString()}</span>
                        <span className="w-px h-full bg-white/20"></span>
                        <span>Balance: ৳{balance.toLocaleString()}</span>
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar bg-gray-50 p-6 space-y-6">
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-3">
                    <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-xs text-gray-500 font-bold">Tenant</span><span className="text-sm font-bold text-gray-900">{bill.tenant_name}</span></div>
                    <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-xs text-gray-500 font-bold">Asset</span><span className="text-sm font-bold text-gray-900">{bill.asset_name}</span></div>
                    <div className="flex justify-between pt-1"><span className="text-xs text-gray-500 font-bold">Billing Month</span><span className="text-sm font-bold text-gray-900">{new Date(bill.month).toLocaleDateString('en-US', {month:'long', year:'numeric'})}</span></div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-wider">Breakdown</h4>
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm"><span className="text-gray-600">Base Rent</span><span className="font-bold text-gray-900">৳ {bill.rent_amount}</span></div>
                        {bill.service_charge > 0 && <div className="flex justify-between text-sm"><span className="text-gray-600">Service Charge</span><span className="font-bold text-gray-900">৳ {bill.service_charge}</span></div>}
                        {bill.gas_bill > 0 && <div className="flex justify-between text-sm"><span className="text-gray-600">Gas</span><span className="font-bold text-gray-900">৳ {bill.gas_bill}</span></div>}
                        {bill.water_bill > 0 && <div className="flex justify-between text-sm"><span className="text-gray-600">Water</span><span className="font-bold text-gray-900">৳ {bill.water_bill}</span></div>}
                        {bill.electricity_bill! > 0 && <div className="flex justify-between text-sm"><span className="text-gray-600">Electricity</span><span className="font-bold text-gray-900">৳ {bill.electricity_bill}</span></div>}
                        
                        {bill.extra_charges?.map((c, i) => (
                            <div key={i} className="flex justify-between text-sm bg-gray-50 -mx-2 px-2 py-1.5 rounded items-center">
                                <span className="text-gray-700 font-medium flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-[#ff4b9a]"></div>{c.name}</span>
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-gray-900">৳ {c.amount}</span>
                                    <button onClick={() => { 
                                        const newExtras = bill.extra_charges?.filter((_, idx) => idx !== i); 
                                        const newTotal = bill.total - c.amount; 
                                        const newStatus = bill.status === 'paid' ? 'changes_pending' : bill.status;
                                        onUpdate({ extra_charges: newExtras, total: newTotal, status: newStatus }); 
                                    }} className="text-gray-300 hover:text-red-500"><Trash2 size={12}/></button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button onClick={onAddCharge} className="mt-4 w-full py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-xs font-bold text-gray-500 hover:border-[#ff4b9a] hover:text-[#ff4b9a] transition-all flex items-center justify-center gap-2"><Plus size={14}/> Add Charge or Fee</button>
                </div>

                {bill.paid_date && (
                    <div className="bg-green-50 rounded-2xl p-4 border border-green-100 flex items-start gap-3">
                        <CheckCircle2 size={18} className="text-green-600 mt-0.5"/>
                        <div><p className="text-xs font-bold text-green-800">Last Payment Activity</p><p className="text-[10px] text-green-600 mt-0.5">{new Date(bill.paid_date).toLocaleDateString()} via {bill.paid_method || 'Cash'}</p></div>
                    </div>
                )}
            </div>

            <div className="p-5 border-t border-gray-200 bg-white safe-bottom">
                <div className="grid grid-cols-2 gap-3 mb-3">
                    <button onClick={handleShare} className="py-3 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2"><Copy size={14}/> Copy Details</button>
                    <button className="py-3 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2"><Printer size={14}/> PDF</button>
                </div>
                {isPendingApproval ? (
                    <div className="flex gap-3">
                        <button onClick={() => onUpdate({ status: 'unpaid' })} className="flex-1 py-4 bg-red-50 text-red-600 font-bold rounded-2xl text-sm">Reject</button>
                        <button onClick={() => onUpdate({ status: 'paid', paid_amount: bill.total, paid_date: new Date().toISOString() })} className="flex-[2] py-4 bg-green-600 text-white font-bold rounded-2xl text-sm shadow-lg flex items-center justify-center gap-2">Approve & Mark Paid</button>
                    </div>
                ) : balance > 0 ? (
                    <button onClick={onPay} className="w-full py-4 bg-[#2d1b4e] text-white rounded-2xl font-bold text-sm shadow-lg hover:bg-[#3a2366] active:scale-95 transition-all flex items-center justify-center gap-2"><Wallet size={18}/> Record Payment</button>
                ) : (
                    <button onClick={onPay} className="w-full py-4 bg-green-100 text-green-700 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-green-200"><Check size={18}/> Paid in Full (Edit)</button>
                )}
            </div>
        </div>
    );
};

// ... AddChargeModal and PaymentModal remain largely the same, ensuring PaymentModal uses state. ...
const AddChargeModal: React.FC<{ onClose: () => void, onSubmit: (c: BillCharge) => void, assetType: AssetType }> = ({ onClose, onSubmit, assetType }) => {
    const [category, setCategory] = useState('');
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const suggestions = [...(CHARGE_CATEGORIES[assetType] || []), ...CHARGE_CATEGORIES['General']];

    return (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white w-full max-w-sm rounded-[2rem] p-6 shadow-2xl animate-in zoom-in-95">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Add Extra Charge</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X size={20}/></button>
                </div>
                
                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Select Category</label>
                        <div className="grid grid-cols-3 gap-3">
                            {suggestions.slice(0, 6).map(cat => {
                                const Icon = CATEGORY_ICONS[cat] || FileText;
                                const isSelected = category === cat;
                                return (
                                    <button 
                                        key={cat} 
                                        onClick={() => setCategory(cat)} 
                                        className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${isSelected ? 'border-[#ff4b9a] bg-pink-50 text-[#ff4b9a] shadow-sm' : 'border-gray-100 bg-white text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        <Icon size={20} />
                                        <span className="text-[10px] font-bold text-center leading-tight">{cat}</span>
                                    </button>
                                )
                            })}
                        </div>
                        {/* Custom Input fallback */}
                        <div className="mt-3 relative">
                             <input type="text" value={category} onChange={e => setCategory(e.target.value)} placeholder="Or type custom charge..." className="w-full p-3 pl-10 bg-gray-50 rounded-xl text-sm font-bold border-transparent focus:bg-white focus:border-[#ff4b9a] focus:ring-2 focus:ring-pink-50 outline-none transition-all"/>
                             <Edit3 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Amount</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-400">৳</span>
                                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0" className="w-full pl-7 pr-3 py-3 bg-gray-50 rounded-xl text-lg font-bold border-transparent focus:bg-white focus:border-[#ff4b9a] outline-none"/>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Note</label>
                            <input type="text" value={note} onChange={e => setNote(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl text-sm font-medium border-transparent focus:bg-white focus:border-[#ff4b9a] outline-none" placeholder="Optional"/>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={() => { if(category && amount) onSubmit({ name: category, amount: parseFloat(amount), note }); }}
                    disabled={!category || !amount}
                    className="w-full mt-8 py-4 bg-[#2d1b4e] text-white font-bold rounded-xl shadow-lg disabled:opacity-50 disabled:shadow-none hover:bg-[#3a2366] active:scale-95 transition-all"
                >
                    Add Charge
                </button>
            </div>
        </div>
    );
};

const PaymentModal: React.FC<{ bill: Bill, onClose: () => void, onSubmit: (amount: number, method: string, note: string) => void }> = ({ bill, onClose, onSubmit }) => {
    const isApproval = bill.status === 'pending_approval';
    const due = bill.total - (bill.paid_amount || 0);
    const [amount, setAmount] = useState(due > 0 ? due.toString() : bill.total.toString());
    const [method, setMethod] = useState('Cash');
    const [note, setNote] = useState('');

    return (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white w-full max-w-sm rounded-[2rem] p-6 shadow-2xl animate-in zoom-in-95">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900">{isApproval ? 'Approve Payment' : 'Update Payment Status'}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X size={20}/></button>
                </div>

                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6 flex justify-between items-center">
                    <span className="text-xs font-bold text-blue-600 uppercase">Total Invoice</span>
                    <span className="text-xl font-black text-blue-700">৳ {bill.total.toLocaleString()}</span>
                </div>
                
                <div className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Total Paid Amount</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">৳</span>
                            <input 
                                type="number" 
                                value={amount} 
                                onChange={e => setAmount(e.target.value)} 
                                className="w-full pl-8 pr-4 py-4 bg-gray-50 rounded-xl text-2xl font-black border border-transparent focus:bg-white focus:border-[#ff4b9a] outline-none"
                            />
                        </div>
                        {parseFloat(amount) < bill.total && (
                            <p className="text-[10px] font-bold text-orange-500 mt-2 flex items-center gap-1"><AlertCircle size={10}/> Status will be Partial</p>
                        )}
                        {parseFloat(amount) >= bill.total && (
                            <p className="text-[10px] font-bold text-green-500 mt-2 flex items-center gap-1"><Check size={10}/> Status will be Paid</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Payment Method</label>
                        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                            {PAYMENT_METHODS.map(m => (
                                <button key={m} onClick={() => setMethod(m)} className={`px-4 py-2 rounded-lg text-[10px] font-bold border whitespace-nowrap transition-all ${method === m ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200'}`}>
                                    {m}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Note</label>
                        <textarea rows={2} value={note} onChange={e => setNote(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl text-sm font-medium border border-transparent focus:bg-white focus:border-[#ff4b9a] outline-none" placeholder="e.g. Received via driver..."></textarea>
                    </div>
                </div>

                <div className="mt-8">
                    <HoldButton 
                        onComplete={() => onSubmit(parseFloat(amount), method, note)} 
                        label={isApproval ? "Hold to Approve" : "Hold to Update Status"}
                        color={isApproval ? "bg-green-600" : "bg-[#2d1b4e]"}
                    />
                    <p className="text-center text-[10px] text-gray-400 mt-3 font-medium">Press and hold to confirm transaction</p>
                </div>
            </div>
        </div>
    );
};

export default Payments;
