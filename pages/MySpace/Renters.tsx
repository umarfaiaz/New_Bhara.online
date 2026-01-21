
import React, { useState, useEffect } from 'react';
import { Search, Plus, MoreVertical, MessageCircle, Phone, Eye, ArrowLeft, Trash2, Edit2, X, AlertTriangle, Building2, ChevronRight, Car, Camera, Home, User, CreditCard, Users, Briefcase, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DataService } from '../../services/mockData';
import { Tenant, Flat, Building, Vehicle, Gadget, AssetType } from '../../types';

// ... (Existing Renters List Component - kept identical for brevity, focus on AddTenantForm)
const Renters: React.FC = () => {
  const navigate = useNavigate();
  const [subTab, setSubTab] = useState<'active' | 'past'>('active');
  const [search, setSearch] = useState('');
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  
  // Add Renter Flow State
  const [showAddModal, setShowAddModal] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [selectedAssetType, setSelectedAssetType] = useState<AssetType>('Residential');
  
  // Asset Lists
  const [vacantFlats, setVacantFlats] = useState<Flat[]>([]);
  const [availableVehicles, setAvailableVehicles] = useState<Vehicle[]>([]);
  const [availableGadgets, setAvailableGadgets] = useState<Gadget[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);

  useEffect(() => {
    const loadData = () => {
        setTenants(DataService.getTenants());
        setBuildings(DataService.getBuildings());
        setVacantFlats(DataService.getFlats().filter(f => f.is_vacant));
        setAvailableVehicles(DataService.getVehicles().filter(v => v.status === 'active'));
        setAvailableGadgets(DataService.getGadgets().filter(g => g.status === 'active'));
    };
    loadData();
    const interval = setInterval(loadData, 1000);
    return () => clearInterval(interval);
  }, []);

  const activeTenants = tenants.filter(t => t.status === 'active' && t.full_name.toLowerCase().includes(search.toLowerCase()));
  const pastTenants = tenants.filter(t => t.status === 'past' && t.full_name.toLowerCase().includes(search.toLowerCase()));

  const handleOpenAddModal = () => {
      setStep(1);
      setSelectedAssetId(null);
      setVacantFlats(DataService.getFlats().filter(f => f.is_vacant));
      setAvailableVehicles(DataService.getVehicles().filter(v => v.status === 'active'));
      setAvailableGadgets(DataService.getGadgets().filter(g => g.status === 'active'));
      setShowAddModal(true);
  };

  if (selectedTenant) {
    return (
      <div className="animate-in slide-in-from-right duration-300 min-h-screen bg-gray-50">
        <div className="p-5 flex items-center gap-4 bg-white border-b sticky top-0 z-10">
          <button onClick={() => setSelectedTenant(null)} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-lg font-bold text-gray-900">Renter Profile</h2>
        </div>
        <div className="p-5 space-y-6">
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="w-28 h-28 bg-gray-200 rounded-full flex items-center justify-center text-4xl border-4 border-white shadow-sm overflow-hidden">
                {selectedTenant.profile_image ? <img src={selectedTenant.profile_image} className="w-full h-full object-cover"/> : '👤'}
            </div>
            <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900">{selectedTenant.full_name}</h3>
                <p className="text-sm text-gray-500">{selectedTenant.profession || 'Renter'}</p>
            </div>
            <span className="px-4 py-1.5 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wider">{selectedTenant.status}</span>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-6">
            <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-wider">Lease Information</h4>
                <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                    <div><p className="text-[10px] text-gray-400 font-bold uppercase">Asset</p><p className="font-bold text-gray-900">{selectedTenant.asset_info?.name}</p></div>
                    <div><p className="text-[10px] text-gray-400 font-bold uppercase">Location</p><p className="font-bold text-gray-900 truncate">{selectedTenant.asset_info?.sub_text}</p></div>
                    <div><p className="text-[10px] text-gray-400 font-bold uppercase">Start Date</p><p className="font-medium text-gray-900">{selectedTenant.start_date}</p></div>
                    <div><p className="text-[10px] text-gray-400 font-bold uppercase">Deposit</p><p className="font-medium text-gray-900">৳ {selectedTenant.security_deposit?.toLocaleString()}</p></div>
                </div>
            </div>
            
            <div className="h-[1px] bg-gray-100"></div>

            <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-wider">Personal & Contact</h4>
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"><Phone size={14}/></div>
                        <div><p className="text-[10px] text-gray-400">Phone</p><p className="font-bold text-gray-900">{selectedTenant.phone}</p></div>
                    </div>
                    {selectedTenant.emergency_phone && (
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center"><AlertTriangle size={14}/></div>
                            <div><p className="text-[10px] text-gray-400">Emergency ({selectedTenant.emergency_relation})</p><p className="font-bold text-gray-900">{selectedTenant.emergency_phone}</p></div>
                        </div>
                    )}
                    {selectedTenant.permanent_address && (
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center"><Home size={14}/></div>
                            <div><p className="text-[10px] text-gray-400">Permanent Address</p><p className="font-medium text-sm text-gray-900">{selectedTenant.permanent_address}</p></div>
                        </div>
                    )}
                </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 space-y-5">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Renter" 
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ff4b9a]/20"
        />
      </div>

      {/* Toggle */}
      <div className="flex bg-gray-100 p-1 rounded-2xl">
        <button onClick={() => setSubTab('active')} className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${subTab === 'active' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}>Active</button>
        <button onClick={() => setSubTab('past')} className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${subTab === 'past' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}>Past</button>
      </div>

      {/* Add Banner */}
      <div onClick={handleOpenAddModal} className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 rounded-2xl text-white flex justify-between items-center shadow-lg cursor-pointer active:scale-[0.98] transition-transform">
        <div>
          <h4 className="text-sm font-bold mb-0.5">Add New Renter</h4>
          <p className="text-[10px] opacity-80">Assign a unit, vehicle, or gadget.</p>
        </div>
        <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30"><Plus size={24} /></button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {(subTab === 'active' ? activeTenants : pastTenants).map((tenant) => (
          <div key={tenant.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl overflow-hidden border border-gray-200">
                    {tenant.profile_image ? <img src={tenant.profile_image} className="w-full h-full object-cover"/> : '👤'}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{tenant.full_name}</h4>
                  <p className="text-[11px] text-gray-400 flex items-center gap-1">
                      {tenant.asset_type === 'Vehicle' ? <Car size={10}/> : tenant.asset_type === 'Gadget' ? <Camera size={10}/> : <Home size={10}/>}
                      {tenant.asset_info?.name} <span className="text-gray-300">•</span> {tenant.asset_info?.sub_text}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedTenant(tenant)} className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-[#ff4b9a]"><Eye size={16} /></button>
            </div>
          </div>
        ))}
        {(subTab === 'active' ? activeTenants : pastTenants).length === 0 && (
          <div className="text-center py-10 text-gray-400 italic text-sm">No renters found.</div>
        )}
      </div>

      {/* Responsive Modal for Adding Renter */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex flex-col justify-end sm:justify-center items-center backdrop-blur-sm p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-md rounded-t-[2rem] sm:rounded-[2rem] h-[90vh] sm:h-auto sm:max-h-[90vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300 shadow-2xl">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center shrink-0">
               <h3 className="text-lg font-bold text-gray-900">{step === 1 ? 'Select Asset to Rent' : 'Digital Application Form'}</h3>
               <button onClick={() => setShowAddModal(false)} className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors"><X size={20} /></button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-5">
                {step === 1 && (
                    <div className="space-y-4">
                        {/* Category Selector */}
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {['Residential', 'Vehicle', 'Gadget'].map((type) => (
                                <button 
                                    key={type}
                                    onClick={() => setSelectedAssetType(type as AssetType)}
                                    className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${selectedAssetType === type ? 'bg-[#ff4b9a] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-3">
                            {selectedAssetType === 'Residential' && vacantFlats.map(flat => {
                                const building = buildings.find(b => b.id === flat.building_id);
                                return (
                                    <button key={flat.id} onClick={() => { setSelectedAssetId(flat.id); setStep(2); }} className="w-full text-left bg-white border border-gray-100 p-4 rounded-2xl shadow-sm hover:border-[#ff4b9a] flex justify-between items-center group transition-all">
                                        <div>
                                            <h5 className="font-bold text-gray-800">Flat {flat.flat_no}</h5>
                                            <p className="text-[10px] text-gray-400">{building?.name} <span className="mx-1">•</span> ৳ {flat.monthly_rent.toLocaleString()}</p>
                                        </div>
                                        <ChevronRight size={16} className="text-gray-300 group-hover:text-[#ff4b9a]"/>
                                    </button>
                                )
                            })}
                            {selectedAssetType === 'Vehicle' && availableVehicles.map(v => (
                                <button key={v.id} onClick={() => { setSelectedAssetId(v.id); setStep(2); }} className="w-full text-left bg-white border border-gray-100 p-4 rounded-2xl shadow-sm hover:border-[#ff4b9a] flex justify-between items-center group transition-all">
                                    <div><h5 className="font-bold text-gray-800">{v.name}</h5><p className="text-[10px] text-gray-400">{v.license_plate}</p></div>
                                    <ChevronRight size={16} className="text-gray-300 group-hover:text-[#ff4b9a]"/>
                                </button>
                            ))}
                            {/* ... Gadget Mapping ... */}
                            
                            {/* Empty States */}
                            {selectedAssetType === 'Residential' && vacantFlats.length === 0 && <p className="text-center text-gray-400 text-sm py-10">No vacant flats.</p>}
                        </div>
                    </div>
                )}

                {step === 2 && selectedAssetId && (
                    <AddTenantForm 
                        assetId={selectedAssetId}
                        assetType={selectedAssetType}
                        onBack={() => setStep(1)}
                        onSuccess={() => setShowAddModal(false)}
                    />
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AddTenantForm: React.FC<{ assetId: string, assetType: AssetType, onBack: () => void, onSuccess: () => void }> = ({ assetId, assetType, onBack, onSuccess }) => {
    const [formData, setFormData] = useState<Partial<Tenant>>({
        full_name: '',
        phone: '',
        start_date: new Date().toISOString().slice(0, 10),
        security_deposit: 0,
        members_adults: 1,
        members_children: 0
    });

    const updateField = (field: keyof Tenant, value: any) => setFormData(prev => ({...prev, [field]: value}));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(formData.full_name && formData.phone) {
            DataService.assignTenant(assetId, { ...formData, asset_type: assetType });
            onSuccess();
        } else {
            alert("Please fill full name and phone number.");
        }
    };

    const SectionTitle = ({ title }: { title: string }) => (
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 mt-1">{title}</h4>
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-300 pb-10">
             <div onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 mb-6 cursor-pointer font-medium hover:text-gray-900 transition-colors">
                <ArrowLeft size={16} /> Back to Selection
             </div>
             
             {/* Profile Photo Upload Placeholder */}
             <div className="flex justify-center mb-6">
                 <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50 hover:border-[#ff4b9a] transition-all">
                     <Camera size={24} className="mb-1"/>
                     <span className="text-[9px] font-bold uppercase">Add Photo</span>
                 </div>
             </div>

             <div>
                <SectionTitle title="Identity & Personal" />
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-900 mb-2">Full Name <span className="text-red-500">*</span></label>
                        <input type="text" value={formData.full_name} onChange={e => updateField('full_name', e.target.value)} className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-white text-gray-900 font-bold focus:outline-none focus:border-[#ff4b9a]" placeholder="Name as per NID" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-900 mb-2">Father's Name</label>
                            <input type="text" value={formData.father_name || ''} onChange={e => updateField('father_name', e.target.value)} className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-white text-gray-900 font-bold focus:outline-none focus:border-[#ff4b9a]" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-900 mb-2">Date of Birth</label>
                            <input type="date" value={formData.dob || ''} onChange={e => updateField('dob', e.target.value)} className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-white text-gray-900 font-bold focus:outline-none focus:border-[#ff4b9a]" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-900 mb-2">National ID (NID)</label>
                        <input type="text" value={formData.nid_number || ''} onChange={e => updateField('nid_number', e.target.value)} className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-white text-gray-900 font-bold focus:outline-none focus:border-[#ff4b9a]" placeholder="NID Number" />
                    </div>
                    {/* NID Image Placeholders */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="h-24 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 bg-gray-50 cursor-pointer hover:border-[#ff4b9a]">
                            <ImageIcon size={20} />
                            <span className="text-[9px] mt-1 font-bold">Front Side</span>
                        </div>
                        <div className="h-24 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 bg-gray-50 cursor-pointer hover:border-[#ff4b9a]">
                            <ImageIcon size={20} />
                            <span className="text-[9px] mt-1 font-bold">Back Side</span>
                        </div>
                    </div>
                </div>
             </div>

             <div>
                <SectionTitle title="Contact Information" />
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-900 mb-2">Mobile Number <span className="text-red-500">*</span></label>
                        <input type="tel" value={formData.phone} onChange={e => updateField('phone', e.target.value)} className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-white text-gray-900 font-bold focus:outline-none focus:border-[#ff4b9a]" placeholder="01..." />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-900 mb-2">Permanent Address</label>
                        <textarea value={formData.permanent_address || ''} onChange={e => updateField('permanent_address', e.target.value)} className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-white text-gray-900 font-bold focus:outline-none focus:border-[#ff4b9a]" rows={3} placeholder="Village, Post Office, District..." />
                    </div>
                </div>
             </div>

             <div>
                <SectionTitle title="Background & Family" />
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-900 mb-2">Profession</label>
                            <input type="text" value={formData.profession || ''} onChange={e => updateField('profession', e.target.value)} className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-white text-gray-900 font-bold focus:outline-none focus:border-[#ff4b9a]" placeholder="e.g. Banker" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-900 mb-2">Members</label>
                            <div className="flex gap-2">
                                <div className="flex-1 bg-gray-50 rounded-xl p-3 border border-gray-200 text-center">
                                    <span className="block text-[9px] text-gray-400 font-bold uppercase">Adults</span>
                                    <input type="number" className="w-full bg-transparent text-center font-bold text-gray-900 outline-none" value={formData.members_adults} onChange={e => updateField('members_adults', parseInt(e.target.value))} />
                                </div>
                                <div className="flex-1 bg-gray-50 rounded-xl p-3 border border-gray-200 text-center">
                                    <span className="block text-[9px] text-gray-400 font-bold uppercase">Kids</span>
                                    <input type="number" className="w-full bg-transparent text-center font-bold text-gray-900 outline-none" value={formData.members_children} onChange={e => updateField('members_children', parseInt(e.target.value))} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
             </div>

             <div>
                <SectionTitle title="Emergency Contact" />
                <div className="bg-red-50 p-4 rounded-2xl border border-red-100 space-y-4">
                    <input type="text" value={formData.emergency_name || ''} onChange={e => updateField('emergency_name', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-red-200 bg-white text-gray-900 font-bold focus:outline-none focus:border-red-400" placeholder="Contact Name" />
                    <div className="grid grid-cols-2 gap-4">
                        <input type="tel" value={formData.emergency_phone || ''} onChange={e => updateField('emergency_phone', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-red-200 bg-white text-gray-900 font-bold focus:outline-none focus:border-red-400" placeholder="Phone" />
                        <input type="text" value={formData.emergency_relation || ''} onChange={e => updateField('emergency_relation', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-red-200 bg-white text-gray-900 font-bold focus:outline-none focus:border-red-400" placeholder="Relation" />
                    </div>
                </div>
             </div>

             <div>
                <SectionTitle title="Lease Terms" />
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-900 mb-2">Start Date</label>
                        <input type="date" value={formData.start_date} onChange={e => updateField('start_date', e.target.value)} className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-white text-gray-900 font-bold focus:outline-none focus:border-[#ff4b9a]" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-900 mb-2">Advance / Deposit</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">৳</span>
                            <input type="number" value={formData.security_deposit} onChange={e => updateField('security_deposit', parseInt(e.target.value))} className="w-full pl-8 pr-4 py-4 rounded-2xl border border-gray-200 bg-white text-gray-900 font-bold focus:outline-none focus:border-[#ff4b9a]" />
                        </div>
                    </div>
                </div>
             </div>
              
              <div className="pt-4">
                <button type="submit" className="w-full py-4 bg-[#ff4b9a] text-white font-bold rounded-2xl shadow-xl shadow-pink-200 active:scale-95 transition-transform flex items-center justify-center gap-2">
                    <CheckCircle2 size={20}/> Submit Application
                </button>
              </div>
        </form>
    );
};

export default Renters;
