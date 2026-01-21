
import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChevronLeft, ChevronRight, CheckCircle2, X, Plus, Home, Car, Camera, Briefcase, 
  Bell, Check, FileText, Download, Share2, Calendar, Square, CheckSquare, 
  Edit2, RefreshCcw, AlertCircle, Search, Send, Clock, Filter, ArrowUpRight, 
  Wallet, PieChart, MoreHorizontal, Printer, Zap, Trash2, ListChecks, Undo2,
  CircleDashed, Percent, CalendarDays, Share, TrendingUp
} from 'lucide-react';
import { DataService } from '../../services/mockData';
import { Bill, AssetType, BillCharge } from '../../types';
import { Logo } from '../../components/Logo';

const Payments: React.FC = () => {
  // Filter State
  const [dateFilter, setDateFilter] = useState<'All' | 'This Month' | 'Last Month'>('All');
  
  // Other Filters
  const [statusTab, setStatusTab] = useState<'All' | 'Unpaid' | 'Paid' | 'Partial' | 'Overdue'>('All');
  const [assetFilter, setAssetFilter] = useState<'All' | AssetType>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [bills, setBills] = useState<Bill[]>([]);
  const [stats, setStats] = useState({ collected: 0, pending: 0, total: 0, count: 0, overdue: 0 });
  
  // Selection
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Modals
  const [showAddChargeModal, setShowAddChargeModal] = useState<boolean>(false);
  const [showStatusModal, setShowStatusModal] = useState<boolean>(false);
  const [targetBillIds, setTargetBillIds] = useState<string[]>([]); 
  
  const [showConfirmModal, setShowConfirmModal] = useState<Bill | null>(null);
  const [viewInvoice, setViewInvoice] = useState<Bill | null>(null);

  // --- Logic Helpers ---

  const isBillOverdue = (bill: Bill) => {
      if (bill.status === 'paid') return false;
      const dueDate = new Date(bill.month);
      dueDate.setDate(10); 
      return new Date() > dueDate;
  };

  const refreshData = () => {
    // Get ALL bills by default (simulate history)
    const allBills = DataService.getBills();
    
    // Sort by Date Descending
    const sortedBills = allBills.sort((a, b) => new Date(b.month).getTime() - new Date(a.month).getTime());

    setBills(sortedBills);
    
    // Calculate Stats (Current view context stats)
    // For simplicity, stats will reflect the *filtered* view in production, 
    // but here let's show total outstanding across all time to catch attention
    const pending = sortedBills.filter(b => b.status !== 'paid').reduce((acc, curr) => acc + (curr.total - (curr.paid_amount || 0)), 0);
    const collected = sortedBills.reduce((acc, curr) => acc + (curr.paid_amount || (curr.status === 'paid' ? curr.total : 0)), 0);
    const total = pending + collected;
    
    setStats({
        collected,
        pending,
        total,
        count: sortedBills.length,
        overdue: sortedBills.filter(b => isBillOverdue(b)).length
    });
  };

  useEffect(() => {
    refreshData();
  }, [showConfirmModal, showAddChargeModal, showStatusModal, viewInvoice]);

  // Derived List
  const filteredBills = useMemo(() => {
      return bills.filter(b => {
          // 1. Date Filter
          const billDate = new Date(b.month);
          const now = new Date();
          let dateMatch = true;
          
          if (dateFilter === 'This Month') {
              dateMatch = billDate.getMonth() === now.getMonth() && billDate.getFullYear() === now.getFullYear();
          } else if (dateFilter === 'Last Month') {
              const lastMonth = new Date();
              lastMonth.setMonth(now.getMonth() - 1);
              // Handle year wrap for Jan -> Dec
              if (now.getMonth() === 0) lastMonth.setFullYear(now.getFullYear() - 1);
              
              dateMatch = billDate.getMonth() === lastMonth.getMonth() && billDate.getFullYear() === lastMonth.getFullYear();
          }

          // 2. Status & Search
          const matchesStatus = 
              statusTab === 'All' ? true :
              statusTab === 'Unpaid' ? (b.status === 'unpaid') :
              statusTab === 'Partial' ? (b.status === 'partial') :
              statusTab === 'Paid' ? b.status === 'paid' :
              statusTab === 'Overdue' ? isBillOverdue(b) : true;
          
          const matchesAsset = assetFilter === 'All' || b.asset_type === assetFilter;
          const matchesSearch = b.tenant_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                b.asset_name?.toLowerCase().includes(searchQuery.toLowerCase());

          return dateMatch && matchesStatus && matchesAsset && matchesSearch;
      });
  }, [bills, dateFilter, statusTab, assetFilter, searchQuery]);

  // Actions
  const toggleSelection = (id: string) => {
      const newSet = new Set(selectedIds);
      if(newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      setSelectedIds(newSet);
  };

  const selectAll = () => {
      if (selectedIds.size === filteredBills.length) setSelectedIds(new Set());
      else setSelectedIds(new Set(filteredBills.map(b => b.id)));
  };

  const handleBulkReminder = () => {
      const count = selectedIds.size;
      if (count === 0) return;
      alert(`Reminders sent to ${count} tenants via SMS & Email.`);
      setIsSelectionMode(false);
      setSelectedIds(new Set());
  };

  const handleBulkAddCharge = () => {
      if (selectedIds.size === 0) return;
      setTargetBillIds(Array.from(selectedIds));
      setShowAddChargeModal(true);
  };

  const handleBulkStatusChange = () => {
      if (selectedIds.size === 0) return;
      setTargetBillIds(Array.from(selectedIds));
      setShowStatusModal(true);
  };

  const handleSingleStatusChange = (id: string) => {
      setTargetBillIds([id]);
      setShowStatusModal(true);
  };

  const handleSingleAddCharge = (id: string) => {
      setTargetBillIds([id]);
      setShowAddChargeModal(true);
  };

  const handleShareBill = (e: React.MouseEvent, bill: Bill) => {
      e.stopPropagation();
      const text = `Invoice for ${bill.asset_name}\nMonth: ${new Date(bill.month).toLocaleDateString('en-US', {month:'long', year:'numeric'})}\nAmount Due: ৳${bill.total - (bill.paid_amount || 0)}\nStatus: ${bill.status.toUpperCase()}\n\nPay securely at: bhara.online/pay/${bill.id}`;
      
      if (navigator.share) {
          navigator.share({
              title: `Bill for ${bill.tenant_name}`,
              text: text,
              url: `https://bhara.online/pay/${bill.id}`
          }).catch(console.error);
      } else {
          navigator.clipboard.writeText(text);
          alert("Bill details copied to clipboard!");
      }
  };

  const handleDownloadPdf = (e: React.MouseEvent) => {
      e.stopPropagation();
      alert("Downloading PDF Invoice...");
  };

  const getAssetIcon = (type: AssetType) => {
      switch(type) {
          case 'Vehicle': return <Car size={18} />;
          case 'Gadget': return <Camera size={18} />;
          case 'Residential': return <Home size={18} />;
          default: return <Briefcase size={18} />;
      }
  };

  // --- Modals ---

  const AddChargeModal = () => {
      if(!showAddChargeModal) return null;
      
      // Get target details for display
      const targets = bills.filter(b => targetBillIds.includes(b.id));

      const [charges, setCharges] = useState<{name: string, amount: string, type: string}[]>([
          { name: 'Utility Bill', amount: '', type: 'Utility' }
      ]);

      const addNewLine = () => setCharges([...charges, { name: 'Late Fee', amount: '', type: 'Fine' }]);
      const removeLine = (idx: number) => setCharges(charges.filter((_, i) => i !== idx));
      const updateLine = (idx: number, field: string, val: string) => {
          const newCharges = [...charges];
          (newCharges[idx] as any)[field] = val;
          setCharges(newCharges);
      };

      const handleSave = () => {
          const validCharges = charges.filter(c => c.amount && parseFloat(c.amount) > 0);
          if (validCharges.length === 0) return;

          targetBillIds.forEach(id => {
              const bill = bills.find(b => b.id === id);
              if (bill) {
                  const currentExtras = bill.extra_charges || [];
                  const newExtras = validCharges.map(c => ({
                      name: c.name,
                      amount: parseFloat(c.amount),
                      note: 'Added manually',
                      type: 'One-time'
                  }));
                  
                  const addedAmount = newExtras.reduce((sum, c) => sum + c.amount, 0);
                  const newTotal = bill.total + addedAmount;
                  const paid = bill.paid_amount || 0;
                  
                  let newStatus = bill.status;
                  if (paid < newTotal) {
                      newStatus = paid > 0 ? 'partial' : 'unpaid';
                  }

                  DataService.updateBill(id, { 
                      extra_charges: [...currentExtras, ...newExtras],
                      status: newStatus
                  });
              }
          });

          refreshData();
          setShowAddChargeModal(false);
          setIsSelectionMode(false);
          setSelectedIds(new Set());
      };

      return (
          <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
              <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95 max-h-[90vh] flex flex-col">
                  <div className="flex justify-between items-center mb-4 shrink-0">
                      <h3 className="font-bold text-gray-900">Add Charges</h3>
                      <button onClick={() => setShowAddChargeModal(false)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100"><X size={20}/></button>
                  </div>
                  
                  {/* Target List */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-xl border border-gray-100 shrink-0 max-h-32 overflow-y-auto custom-scrollbar">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Applying to {targets.length} Bill(s)</p>
                      <div className="space-y-1">
                          {targets.map(t => (
                              <div key={t.id} className="text-xs text-gray-700 truncate flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                                  <span className="font-bold">{t.tenant_name}</span> 
                                  <span className="text-gray-400">({t.asset_name})</span>
                              </div>
                          ))}
                      </div>
                  </div>

                  <div className="space-y-3 overflow-y-auto custom-scrollbar pr-1 flex-1">
                      {charges.map((charge, idx) => (
                          <div key={idx} className="bg-white p-3 rounded-xl border border-gray-200 flex gap-2 items-start shadow-sm">
                              <div className="flex-1 space-y-2">
                                  <select 
                                    value={charge.type} 
                                    onChange={e => updateLine(idx, 'type', e.target.value)}
                                    className="w-full p-2 text-xs font-bold rounded-lg border border-gray-100 bg-gray-50 outline-none"
                                  >
                                      <option>Utility</option><option>Fine</option><option>Damage</option><option>Other</option>
                                  </select>
                                  <input 
                                    type="text" 
                                    value={charge.name} 
                                    onChange={e => updateLine(idx, 'name', e.target.value)}
                                    placeholder="Description"
                                    className="w-full p-2 text-xs font-medium rounded-lg border border-gray-100 bg-gray-50 outline-none"
                                  />
                              </div>
                              <div className="w-20">
                                  <input 
                                    type="number" 
                                    value={charge.amount}
                                    onChange={e => updateLine(idx, 'amount', e.target.value)}
                                    placeholder="৳"
                                    className="w-full p-2 text-xs font-bold rounded-lg border border-gray-100 bg-gray-50 outline-none h-[68px]"
                                  />
                              </div>
                              {charges.length > 1 && (
                                  <button onClick={() => removeLine(idx)} className="p-1 text-red-400 hover:text-red-600 mt-6"><Trash2 size={16}/></button>
                              )}
                          </div>
                      ))}
                  </div>
                  <button onClick={addNewLine} className="text-xs font-bold text-[#ff4b9a] flex items-center gap-1 mt-3 hover:underline shrink-0"><Plus size={14}/> Add another item</button>
                  <button onClick={handleSave} className="w-full py-3.5 bg-[#2d1b4e] text-white font-bold rounded-xl shadow-lg mt-6 hover:opacity-90 shrink-0">Apply to All</button>
              </div>
          </div>
      );
  };

  const UpdateStatusModal = () => {
      if(!showStatusModal) return null;
      const [status, setStatus] = useState<'paid' | 'unpaid' | 'partial'>('paid');
      const [partialAmount, setPartialAmount] = useState('');
      const [partialType, setPartialType] = useState<'fixed' | 'percent'>('fixed');

      const handleUpdate = () => {
          targetBillIds.forEach(id => {
              const bill = bills.find(b => b.id === id);
              if(!bill) return;

              let updates: Partial<Bill> = {};
              
              if(status === 'paid') {
                  // Mark as fully paid even if previously partial
                  updates = { status: 'paid', paid_amount: bill.total, paid_date: new Date().toISOString() };
              } else if (status === 'unpaid') {
                  updates = { status: 'unpaid', paid_amount: 0, paid_date: undefined };
              } else if (status === 'partial') {
                  let amount = 0;
                  if (partialType === 'fixed') {
                      amount = parseFloat(partialAmount) || 0;
                  } else {
                      const pct = parseFloat(partialAmount) || 0;
                      amount = Math.round((bill.total * pct) / 100);
                  }
                  // Allow overpayment here? Usually 'partial' means less, but lets clamp it for safety in this specific bulk tool
                  // The ConfirmPaymentModal handles excess better.
                  if (amount > bill.total) amount = bill.total; 
                  updates = { status: 'partial', paid_amount: amount, paid_date: new Date().toISOString() };
              }
              DataService.updateBill(id, updates);
          });
          refreshData();
          setShowStatusModal(false);
          setIsSelectionMode(false);
          setSelectedIds(new Set());
      };

      return (
          <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
              <div className="bg-white rounded-3xl w-full max-w-xs p-6 shadow-2xl animate-in zoom-in-95">
                  <h3 className="font-bold text-gray-900 mb-4">Change Payment Status</h3>
                  <div className="space-y-3 mb-6">
                      <button onClick={() => setStatus('paid')} className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all ${status === 'paid' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-gray-200 text-gray-600'}`}>
                          <span className="font-bold text-sm">Mark as Fully Paid</span>
                          {status === 'paid' && <CheckCircle2 size={18}/>}
                      </button>
                      <button onClick={() => setStatus('partial')} className={`w-full p-3 rounded-xl border flex flex-col items-start transition-all ${status === 'partial' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-600'}`}>
                          <div className="flex items-center justify-between w-full">
                              <span className="font-bold text-sm">Mark as Partial</span>
                              {status === 'partial' && <CircleDashed size={18}/>}
                          </div>
                          {status === 'partial' && (
                              <div className="mt-3 w-full animate-in slide-in-from-top-2">
                                  <div className="flex gap-2 mb-2">
                                      <button onClick={(e) => {e.stopPropagation(); setPartialType('fixed')}} className={`flex-1 py-1 text-[10px] font-bold rounded ${partialType === 'fixed' ? 'bg-blue-600 text-white' : 'bg-white border text-gray-500'}`}>Fixed</button>
                                      <button onClick={(e) => {e.stopPropagation(); setPartialType('percent')}} className={`flex-1 py-1 text-[10px] font-bold rounded ${partialType === 'percent' ? 'bg-blue-600 text-white' : 'bg-white border text-gray-500'}`}>%</button>
                                  </div>
                                  <input 
                                    type="number" 
                                    value={partialAmount}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={(e) => setPartialAmount(e.target.value)}
                                    placeholder={partialType === 'fixed' ? "Amount (৳)" : "Percentage (%)"}
                                    className="w-full p-2 bg-white rounded-lg border border-blue-200 text-sm font-bold outline-none focus:ring-1 focus:ring-blue-500"
                                  />
                              </div>
                          )}
                      </button>
                      <button onClick={() => setStatus('unpaid')} className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all ${status === 'unpaid' ? 'bg-gray-100 border-gray-300 text-gray-900' : 'bg-white border-gray-200 text-gray-600'}`}>
                          <span className="font-bold text-sm">Mark as Unpaid</span>
                          {status === 'unpaid' && <RefreshCcw size={18}/>}
                      </button>
                  </div>
                  <div className="flex gap-2">
                      <button onClick={() => setShowStatusModal(false)} className="flex-1 py-3 text-gray-500 font-bold text-xs bg-gray-50 rounded-xl hover:bg-gray-100">Cancel</button>
                      <button onClick={handleUpdate} className="flex-1 py-3 bg-[#2d1b4e] text-white font-bold text-xs rounded-xl shadow-lg hover:opacity-90">Update {targetBillIds.length} Bills</button>
                  </div>
              </div>
          </div>
      );
  };

  const ConfirmPaymentModal = () => {
      if(!showConfirmModal) return null;
      const dueAmount = showConfirmModal.total - (showConfirmModal.paid_amount || 0);
      const isOverpaid = dueAmount < 0;
      
      const [method, setMethod] = useState('Cash');
      const [amount, setAmount] = useState(dueAmount > 0 ? dueAmount.toString() : '0');
      const [note, setNote] = useState('');

      const handleConfirm = () => {
          const paid = parseFloat(amount) || 0;
          const previousPaid = showConfirmModal.paid_amount || 0;
          const newTotalPaid = previousPaid + paid;
          
          // Logic: Even if overpaid, status is 'paid'.
          // 'partial' only if strictly less than total.
          let newStatus: Bill['status'] = 'paid';
          if (newTotalPaid < showConfirmModal.total) newStatus = 'partial';

          DataService.updateBill(showConfirmModal.id, { 
              status: newStatus, 
              paid_amount: newTotalPaid,
              paid_date: new Date().toISOString(),
              paid_method: method,
              paid_note: note
          });
          refreshData();
          setShowConfirmModal(null);
      };

      return (
          <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
              <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-gray-900">Record Payment</h3>
                      <button onClick={() => setShowConfirmModal(null)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100"><X size={20}/></button>
                  </div>
                  
                  {isOverpaid ? (
                      <div className="bg-purple-50 p-4 rounded-2xl mb-6 text-center border border-purple-100">
                          <p className="text-xs text-purple-600 font-bold uppercase tracking-wider">Current Credit</p>
                          <h2 className="text-3xl font-black text-purple-700 mt-1">৳ {Math.abs(dueAmount).toLocaleString()}</h2>
                          <p className="text-[10px] text-purple-500 mt-1">This bill is overpaid.</p>
                      </div>
                  ) : (
                      <div className="bg-emerald-50 p-4 rounded-2xl mb-6 text-center border border-emerald-100">
                          <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider">Outstanding Amount</p>
                          <h2 className="text-3xl font-black text-emerald-700 mt-1">৳ {dueAmount.toLocaleString()}</h2>
                      </div>
                  )}

                  <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Payment Method</label>
                        <div className="grid grid-cols-3 gap-2">
                            {['Cash', 'Bank', 'Mobile'].map(m => (
                                <button key={m} onClick={() => setMethod(m)} className={`py-2 rounded-xl text-xs font-bold border transition-all ${method === m ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-500 border-gray-200'}`}>{m}</button>
                            ))}
                        </div>
                      </div>
                      <div>
                          <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Amount Received (Current)</label>
                          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl font-bold text-gray-900 border border-gray-200 outline-none focus:border-green-500 text-lg" />
                          <p className="text-[10px] text-gray-400 mt-1">You can enter more than the due amount to record an advance.</p>
                      </div>
                      <button onClick={handleConfirm} className="w-full py-3.5 bg-green-600 text-white font-bold rounded-xl shadow-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2"><Check size={18}/> Confirm Payment</button>
                  </div>
              </div>
          </div>
      );
  };

  const InvoiceDetailsModal = () => {
    if(!viewInvoice) return null;
    const paidAmount = viewInvoice.paid_amount || 0;
    const dueAmount = viewInvoice.total - paidAmount;
    const isPaid = viewInvoice.status === 'paid';
    const isOverpaid = paidAmount > viewInvoice.total;

    return (
        <div className="fixed inset-0 bg-black/80 z-[80] flex flex-col items-center justify-center p-4 backdrop-blur-md">
            <div className="bg-white w-full max-w-md rounded-[2rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300 flex flex-col max-h-[90vh]">
                <div className="bg-[#2d1b4e] p-6 text-white relative shrink-0">
                    <button onClick={() => setViewInvoice(null)} className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20"><X size={20}/></button>
                    <div className="flex justify-between items-start pr-10">
                        <div>
                            <div className="mb-2 scale-90 origin-left"><Logo light size="sm"/></div>
                            <h2 className="text-xl font-bold">Invoice Details</h2>
                        </div>
                        <div className="text-right">
                             <p className="text-xs opacity-60 uppercase tracking-widest">Date</p>
                             <p className="font-bold text-sm">{new Date(viewInvoice.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-white">
                     <div className={`flex items-center justify-between p-4 rounded-2xl mb-6 ${isPaid ? 'bg-green-50 text-green-700' : viewInvoice.status === 'partial' ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'}`}>
                         <div>
                             <p className="text-xs font-bold uppercase opacity-70">Status</p>
                             <p className="font-bold text-lg capitalize flex items-center gap-2">
                                 {viewInvoice.status === 'unpaid' ? 'Payment Due' : viewInvoice.status}
                                 {isOverpaid && <span className="bg-purple-100 text-purple-700 text-[10px] px-2 py-0.5 rounded-full">Advance</span>}
                             </p>
                         </div>
                         <div className="text-right">
                             <p className="text-xs font-bold uppercase opacity-70">{dueAmount <= 0 ? 'Settled' : 'Amount Due'}</p>
                             <p className="font-black text-xl">{dueAmount <= 0 ? 'Done' : `৳ ${dueAmount.toLocaleString()}`}</p>
                         </div>
                     </div>

                     <div className="bg-gray-50 rounded-2xl p-4 space-y-2 mb-6 border border-gray-100">
                         {/* ... Bill Details ... */}
                         <div className="flex justify-between text-xs text-gray-600"><span>Base Rent</span><span>৳ {viewInvoice.rent_amount}</span></div>
                         {viewInvoice.service_charge > 0 && <div className="flex justify-between text-xs text-gray-600"><span>Service Charge</span><span>৳ {viewInvoice.service_charge}</span></div>}
                         {(viewInvoice.gas_bill + viewInvoice.water_bill + (viewInvoice.electricity_bill || 0)) > 0 && (
                             <div className="flex justify-between text-xs text-gray-600"><span>Utilities</span><span>৳ {viewInvoice.gas_bill + viewInvoice.water_bill + (viewInvoice.electricity_bill || 0)}</span></div>
                         )}
                         {viewInvoice.extra_charges?.map((c, i) => (
                             <div key={i} className="flex justify-between text-xs text-blue-600 font-bold bg-blue-50/50 p-1 rounded"><span>{c.name}</span><span>+ ৳ {c.amount}</span></div>
                         ))}
                         <div className="border-t border-gray-200 my-2 pt-2 flex justify-between font-bold text-sm text-gray-900">
                             <span>Total Amount</span><span>৳ {viewInvoice.total.toLocaleString()}</span>
                         </div>
                         {paidAmount > 0 && (
                             <div className="flex justify-between text-xs text-green-600 font-bold">
                                 <span>Paid Amount</span><span>- ৳ {paidAmount.toLocaleString()}</span>
                             </div>
                         )}
                         {isOverpaid && (
                             <div className="flex justify-between text-xs text-purple-600 font-bold bg-purple-50 p-1.5 rounded mt-1">
                                 <span>Credit / Advance</span><span>+ ৳ {(paidAmount - viewInvoice.total).toLocaleString()}</span>
                             </div>
                         )}
                     </div>
                </div>

                <div className="p-4 border-t border-gray-100 bg-gray-50 flex flex-col gap-3 shrink-0">
                    <div className="flex gap-2">
                        <button onClick={(e) => handleShareBill(e, viewInvoice)} className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold text-xs hover:bg-gray-100 flex items-center justify-center gap-2">
                            <Share size={16}/> Share
                        </button>
                        <button onClick={handleDownloadPdf} className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold text-xs hover:bg-gray-100 flex items-center justify-center gap-2">
                            <Download size={16}/> PDF
                        </button>
                    </div>
                    
                    <div className="flex gap-2">
                        <button onClick={() => { setViewInvoice(null); handleSingleStatusChange(viewInvoice.id); }} className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold text-xs hover:bg-gray-100 flex items-center justify-center gap-1">Change Status</button>
                        
                        {/* Allow Record Payment even if paid, to add more/advance */}
                        <button onClick={() => { setViewInvoice(null); setShowConfirmModal(viewInvoice); }} className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold text-xs shadow-md hover:bg-green-700">Record Payment</button>
                    </div>
                </div>
            </div>
        </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto pb-32">
      
      {/* 1. Header & Date Filter */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm transition-all">
          <div className="px-4 py-3 flex items-center justify-between gap-3">
              {/* DATE FILTER DROP DOWN */}
              <div className="relative group">
                  <button className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-200 transition-colors">
                      <CalendarDays size={16}/>
                      {dateFilter}
                      <span className="ml-1 text-[10px] text-gray-400">▼</span>
                  </button>
                  <div className="absolute top-full left-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden hidden group-focus-within:block group-hover:block">
                      {['All', 'This Month', 'Last Month'].map(opt => (
                          <button 
                            key={opt} 
                            onClick={() => setDateFilter(opt as any)}
                            className={`w-full text-left px-4 py-3 text-xs font-bold hover:bg-gray-50 ${dateFilter === opt ? 'text-[#ff4b9a] bg-pink-50' : 'text-gray-600'}`}
                          >
                              {opt}
                          </button>
                      ))}
                  </div>
              </div>
              
              {/* Mini Stats */}
              <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-lg ml-auto">
                  <div className="text-right">
                      <p className="text-[9px] font-bold text-gray-400 uppercase">Coll.</p>
                      <p className="text-xs font-extrabold text-green-600">৳{(stats.collected/1000).toFixed(1)}k</p>
                  </div>
                  <div className="w-px h-6 bg-gray-200"></div>
                  <div className="text-right">
                      <p className="text-[9px] font-bold text-gray-400 uppercase">Due</p>
                      <p className="text-xs font-extrabold text-red-500">৳{(stats.pending/1000).toFixed(1)}k</p>
                  </div>
              </div>
          </div>

          {/* Search & Filters */}
          <div className="px-4 pb-3 flex flex-col gap-2">
              <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tenant, unit or date..." 
                    className="w-full pl-9 pr-4 py-2 bg-gray-100 rounded-lg text-xs font-bold outline-none focus:ring-1 focus:ring-[#ff4b9a]"
                  />
              </div>
              <div className="flex gap-2 overflow-x-auto scrollbar-hide items-center">
                  <button onClick={() => setIsSelectionMode(!isSelectionMode)} className={`p-2 rounded-lg border shrink-0 ${isSelectionMode ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-gray-200'}`}>
                      <ListChecks size={16}/>
                  </button>
                  {isSelectionMode && (
                      <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left">
                          <button onClick={selectAll} className="text-[10px] bg-gray-100 px-2 py-1.5 rounded font-bold hover:bg-gray-200 whitespace-nowrap">Select All</button>
                          <button onClick={handleBulkStatusChange} className="text-[10px] bg-black text-white px-2 py-1.5 rounded font-bold hover:bg-gray-800 flex items-center gap-1 whitespace-nowrap"><Edit2 size={12}/> Status</button>
                          <button onClick={handleBulkAddCharge} className="text-[10px] bg-[#ff4b9a] text-white px-2 py-1.5 rounded font-bold hover:bg-pink-600 flex items-center gap-1 whitespace-nowrap"><Plus size={12}/> Charge</button>
                          <button onClick={handleBulkReminder} className="text-[10px] bg-blue-600 text-white px-2 py-1.5 rounded font-bold hover:bg-blue-700 flex items-center gap-1 whitespace-nowrap"><Send size={12}/> Remind</button>
                      </div>
                  )}
                  {!isSelectionMode && ['All', 'Unpaid', 'Partial', 'Paid', 'Overdue'].map(tab => (
                      <button 
                          key={tab} 
                          onClick={() => setStatusTab(tab as any)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap border transition-all ${statusTab === tab ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-500 border-gray-200'}`}
                      >
                          {tab}
                      </button>
                  ))}
              </div>
          </div>
      </div>

      {/* 2. Bills List */}
      <div className="p-4 space-y-3">
          {filteredBills.map(bill => {
              const isOverdue = isBillOverdue(bill);
              const paidAmount = bill.paid_amount || 0;
              const percentPaid = bill.total > 0 ? (paidAmount / bill.total) * 100 : 0;
              const isOverpaid = paidAmount > bill.total;
              const billDate = new Date(bill.month);
              
              return (
                  <div 
                    key={bill.id}
                    onClick={() => { if(isSelectionMode) toggleSelection(bill.id); else setViewInvoice(bill); }}
                    className={`bg-white rounded-xl border transition-all relative overflow-hidden cursor-pointer ${isSelectionMode && selectedIds.has(bill.id) ? 'border-[#ff4b9a] bg-pink-50/10' : 'border-gray-100 shadow-sm'}`}
                  >
                      {/* DATE BADGE */}
                      <div className="absolute top-0 right-0 bg-gray-100 px-2 py-1 rounded-bl-xl border-b border-l border-gray-50 text-[9px] font-bold text-gray-500">
                          {billDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
                      </div>

                      <div className="p-3 flex items-center gap-3">
                          {isSelectionMode ? (
                              <div className={`w-5 h-5 rounded border flex items-center justify-center ${selectedIds.has(bill.id) ? 'bg-[#ff4b9a] border-[#ff4b9a]' : 'border-gray-300'}`}>
                                  {selectedIds.has(bill.id) && <Check size={12} className="text-white"/>}
                              </div>
                          ) : (
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-gray-500 bg-gray-50 border border-gray-100`}>
                                  {getAssetIcon(bill.asset_type)}
                              </div>
                          )}

                          <div className="flex-1 min-w-0 pt-1">
                              <div className="flex justify-between items-center mb-1">
                                  <h4 className="font-bold text-gray-900 truncate text-sm">{bill.tenant_name}</h4>
                                  <span className="font-extrabold text-gray-900 text-sm mr-12">৳ {bill.total.toLocaleString()}</span>
                              </div>
                              
                              <div className="flex justify-between items-end">
                                  <div className="text-xs text-gray-500">
                                      <p>{bill.asset_name}</p>
                                      <div className="flex gap-2 mt-1">
                                          {isOverpaid ? (
                                              <span className="text-[9px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded flex items-center gap-1"><TrendingUp size={10}/> Credit: ৳{(paidAmount - bill.total).toLocaleString()}</span>
                                          ) : bill.status === 'partial' ? (
                                              <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">Pending Partial</span>
                                          ) : bill.status === 'paid' ? (
                                              <span className="text-[9px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded flex items-center gap-1"><CheckCircle2 size={10}/> Paid</span>
                                          ) : isOverdue ? (
                                              <span className="text-[9px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">Overdue</span>
                                          ) : (
                                              <span className="text-[9px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">Unpaid</span>
                                          )}
                                      </div>
                                  </div>

                                  {!isSelectionMode && (
                                      <div className="flex gap-2">
                                          {/* QUICK ACTIONS */}
                                          <button onClick={(e) => handleShareBill(e, bill)} className="p-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-500"><Share2 size={14}/></button>
                                          <button onClick={handleDownloadPdf} className="p-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-500"><Download size={14}/></button>
                                          
                                          {/* Always allow Record to add more funds/overpay */}
                                          <button onClick={(e) => { e.stopPropagation(); setShowConfirmModal(bill); }} className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-[10px] font-bold shadow-sm hover:bg-green-700 ml-1">Record</button>
                                      </div>
                                  )}
                              </div>
                              {/* Progress */}
                              {bill.status !== 'paid' && !isOverpaid && (
                                  <div className="mt-2 w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                                      {paidAmount > 0 && <div className="h-full bg-blue-500" style={{ width: `${percentPaid}%` }}></div>}
                                  </div>
                              )}
                          </div>
                      </div>
                  </div>
              );
          })}
          
          {filteredBills.length === 0 && (
              <div className="text-center py-12">
                  <p className="text-gray-400 font-medium text-sm">No invoices found for this period.</p>
                  <button onClick={() => setDateFilter('All')} className="text-xs font-bold text-[#ff4b9a] mt-2 hover:underline">View All History</button>
              </div>
          )}
      </div>

      {/* Render Modals */}
      {showAddChargeModal && <AddChargeModal />}
      {showConfirmModal && <ConfirmPaymentModal />}
      {viewInvoice && <InvoiceDetailsModal />}
      {showStatusModal && <UpdateStatusModal />}

    </div>
  );
};

export default Payments;
