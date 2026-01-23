
import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Eye, ArrowLeft, X, ChevronRight, Car, Camera, Home, Briefcase, User, Calendar, MapPin, Phone, ShieldCheck, Users, Upload, FileText, CheckCircle2, PenTool, Bold, Italic, List, Save, FileSignature } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DataService, UserService } from '../../services/mockData';
import { Tenant, Flat, Building, Vehicle, Gadget, ServiceAsset, AssetType, User as UserType } from '../../types';

// --- RICH TEXT EDITOR COMPONENT ---
const RichTextEditor: React.FC<{ initialValue: string, onSave: (val: string) => void, onClose: () => void }> = ({ initialValue, onSave, onClose }) => {
    const editorRef = useRef<HTMLDivElement>(null);

    const execCmd = (command: string, value: string | undefined = undefined) => {
        document.execCommand(command, false, value);
        if(editorRef.current) editorRef.current.focus();
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl rounded-[1.5rem] shadow-2xl flex flex-col h-[80vh] animate-in zoom-in-95 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2"><FileSignature size={18} className="text-[#ff4b9a]"/> Edit Agreement</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full"><X size={20}/></button>
                </div>
                
                {/* Toolbar */}
                <div className="flex items-center gap-1 p-2 border-b border-gray-200 bg-white">
                    <button onClick={() => execCmd('bold')} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600" title="Bold"><Bold size={16}/></button>
                    <button onClick={() => execCmd('italic')} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600" title="Italic"><Italic size={16}/></button>
                    <div className="w-px h-6 bg-gray-200 mx-1"></div>
                    <button onClick={() => execCmd('insertUnorderedList')} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600" title="Bullet List"><List size={16}/></button>
                    <button onClick={() => execCmd('formatBlock', 'H3')} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 font-bold text-xs" title="Heading">H3</button>
                </div>

                {/* Editor Area */}
                <div 
                    ref={editorRef}
                    className="flex-1 p-6 overflow-y-auto outline-none prose prose-sm max-w-none focus:bg-gray-50/30 transition-colors"
                    contentEditable
                    dangerouslySetInnerHTML={{ __html: initialValue || '<p>Start typing the agreement terms...</p>' }}
                />

                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                    <button onClick={onClose} className="px-5 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-200 transition-colors">Cancel</button>
                    <button 
                        onClick={() => { if(editorRef.current) onSave(editorRef.current.innerHTML); }}
                        className="px-6 py-2.5 bg-[#2d1b4e] text-white rounded-xl font-bold shadow-md hover:bg-[#3a2366] transition-all flex items-center gap-2"
                    >
                        <Save size={16}/> Save Agreement
                    </button>
                </div>
            </div>
        </div>
    );
};

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
  const [selectedAssetType, setSelectedAssetType] = useState<AssetType | 'Service'>('Residential');
  
  // Editor State
  const [showEditor, setShowEditor] = useState(false);

  // Asset Lists
  const [vacantFlats, setVacantFlats] = useState<Flat[]>([]);
  const [availableVehicles, setAvailableVehicles] = useState<Vehicle[]>([]);
  const [availableGadgets, setAvailableGadgets] = useState<Gadget[]>([]);
  const [availableServices, setAvailableServices] = useState<ServiceAsset[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);

  // Trigger data refresh
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const loadData = () => {
        setTenants(DataService.getTenants());
        setBuildings(DataService.getBuildings());
        setVacantFlats(DataService.getFlats().filter(f => f.availability === 'Available'));
        setAvailableVehicles(DataService.getVehicles().filter(v => v.status === 'Active'));
        setAvailableGadgets(DataService.getGadgets().filter(g => g.status === 'Active'));
        setAvailableServices(DataService.getServices().filter(s => s.status === 'Active'));
    };
    loadData();
  }, [refreshKey, showAddModal]);

  const activeTenants = tenants.filter(t => t.status === 'active' && t.full_name.toLowerCase().includes(search.toLowerCase()));
  const pastTenants = tenants.filter(t => t.status === 'past' && t.full_name.toLowerCase().includes(search.toLowerCase()));

  const handleOpenAddModal = () => {
      setStep(1);
      setSelectedAssetId(null);
      setRefreshKey(prev => prev + 1);
      setShowAddModal(true);
  };

  const handleTenantAdded = () => {
      setShowAddModal(false);
      setRefreshKey(prev => prev + 1);
  };

  const handleSaveAgreement = (html: string) => {
      if (selectedTenant) {
          DataService.updateTenant(selectedTenant.id, { agreement_text: html });
          setSelectedTenant({ ...selectedTenant, agreement_text: html });
          setRefreshKey(prev => prev + 1); // Refresh list
          setShowEditor(false);
      }
  };

  const getAssetIcon = (type: AssetType | 'Service') => {
      if (type === 'Vehicle') return <Car size={10}/>;
      if (type === 'Gadget') return <Camera size={10}/>;
      if (type === 'Service' || type === 'Event' || type === 'Skill') return <Briefcase size={10}/>;
      return <Home size={10}/>;
  };

  if (selectedTenant) {
    return (
      <div className="animate-in slide-in-from-right duration-300 min-h-screen bg-gray-50">
        <div className="p-5 flex items-center gap-4 bg-white border-b sticky top-0 z-10">
          <button onClick={() => setSelectedTenant(null)} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-lg font-bold text-gray-900">Booking Profile</h2>
        </div>
        <div className="p-5 space-y-6">
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="w-28 h-28 bg-gray-200 rounded-full flex items-center justify-center text-4xl border-4 border-white shadow-sm overflow-hidden">
                {selectedTenant.profile_image ? <img src={selectedTenant.profile_image} className="w-full h-full object-cover"/> : '👤'}
            </div>
            <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900">{selectedTenant.full_name}</h3>
                <p className="text-sm text-gray-500">{selectedTenant.profession || 'Client'}</p>
            </div>
            <span className="px-4 py-1.5 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wider">{selectedTenant.status}</span>
          </div>
          
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-6">
            <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-wider">Booking Details</h4>
                <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                    <div><p className="text-[10px] text-gray-400 font-bold uppercase">Asset</p><p className="font-bold text-gray-900">{selectedTenant.asset_info?.name}</p></div>
                    <div><p className="text-[10px] text-gray-400 font-bold uppercase">Details</p><p className="font-bold text-gray-900 truncate">{selectedTenant.asset_info?.sub_text}</p></div>
                    <div><p className="text-[10px] text-gray-400 font-bold uppercase">Start Date</p><p className="font-medium text-gray-900">{selectedTenant.start_date}</p></div>
                    <div><p className="text-[10px] text-gray-400 font-bold uppercase">Deposit</p><p className="font-medium text-gray-900">৳ {selectedTenant.security_deposit?.toLocaleString()}</p></div>
                </div>
            </div>
            {/* Show extra details if available */}
            {selectedTenant.nid_number && (
                <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-wider border-t border-gray-50 pt-4">Identity</h4>
                    <div><p className="text-[10px] text-gray-400 font-bold uppercase">NID Number</p><p className="font-medium text-gray-900 font-mono">{selectedTenant.nid_number}</p></div>
                </div>
            )}
          </div>

          {/* AGREEMENT SECTION */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Rental Agreement</h4>
                  <button onClick={() => setShowEditor(true)} className="flex items-center gap-1 text-xs font-bold text-[#ff4b9a] hover:underline">
                      <PenTool size={12}/> {selectedTenant.agreement_text ? 'Edit' : 'Create'}
                  </button>
              </div>
              
              {selectedTenant.agreement_text ? (
                  <div className="prose prose-sm max-w-none text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100 max-h-60 overflow-y-auto custom-scrollbar">
                      <div dangerouslySetInnerHTML={{ __html: selectedTenant.agreement_text }} />
                  </div>
              ) : (
                  <div onClick={() => setShowEditor(true)} className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-[#ff4b9a] hover:text-[#ff4b9a] transition-all group">
                      <FileText size={32} className="mb-2 opacity-50 group-hover:opacity-100"/>
                      <p className="text-sm font-medium">No agreement added.</p>
                      <p className="text-xs opacity-70">Tap to write terms & conditions.</p>
                  </div>
              )}
          </div>

        </div>

        {/* Editor Modal */}
        {showEditor && (
            <RichTextEditor 
                initialValue={selectedTenant.agreement_text || ''} 
                onSave={handleSaveAgreement} 
                onClose={() => setShowEditor(false)} 
            />
        )}
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
          placeholder="Search Clients..." 
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ff4b9a]/20"
        />
      </div>

      {/* Toggle */}
      <div className="flex bg-gray-100 p-1 rounded-2xl">
        <button onClick={() => setSubTab('active')} className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${subTab === 'active' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}>Active</button>
        <button onClick={() => setSubTab('past')} className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${subTab === 'past' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}>History</button>
      </div>

      {/* Add Banner */}
      <div onClick={handleOpenAddModal} className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 rounded-2xl text-white flex justify-between items-center shadow-lg cursor-pointer active:scale-[0.98] transition-transform">
        <div>
          <h4 className="text-sm font-bold mb-0.5">New Booking</h4>
          <p className="text-[10px] opacity-80">Add Renter or Client for any asset.</p>
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
                      {getAssetIcon(tenant.asset_type)}
                      {tenant.asset_info?.name} <span className="text-gray-300">•</span> {tenant.asset_info?.sub_text}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedTenant(tenant)} className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-[#ff4b9a]"><Eye size={16} /></button>
            </div>
          </div>
        ))}
        {(subTab === 'active' ? activeTenants : pastTenants).length === 0 && (
          <div className="text-center py-10 text-gray-400 italic text-sm">No bookings found.</div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex flex-col justify-end sm:justify-center items-center backdrop-blur-sm p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-xl rounded-t-[2rem] sm:rounded-[2rem] h-[95vh] sm:h-[85vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300 shadow-2xl">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center shrink-0">
               <h3 className="text-lg font-bold text-gray-900">{step === 1 ? 'Select Asset' : 'Client Registration'}</h3>
               <button onClick={() => setShowAddModal(false)} className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors"><X size={20} /></button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-5">
                {step === 1 && (
                    <div className="space-y-4">
                        {/* Category Selector */}
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {['Residential', 'Vehicle', 'Gadget', 'Service'].map((type) => (
                                <button 
                                    key={type}
                                    onClick={() => setSelectedAssetType(type as any)}
                                    className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${selectedAssetType === type ? 'bg-[#ff4b9a] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-3">
                            {/* FLAT LIST */}
                            {selectedAssetType === 'Residential' && vacantFlats.map(flat => {
                                const building = buildings.find(b => b.id === flat.parentId);
                                return (
                                    <AssetItem key={flat.id} id={flat.id} title={`Flat ${flat.unitNumber}`} subtitle={`${building?.name || 'Building'} • ৳${Object.values(flat.rentConfig.rates)[0] || 0}`} onSelect={() => { setSelectedAssetId(flat.id); setStep(2); }} />
                                )
                            })}
                            {/* VEHICLE LIST */}
                            {selectedAssetType === 'Vehicle' && availableVehicles.map(v => (
                                <AssetItem key={v.id} id={v.id} title={v.name} subtitle={`${v.licensePlate} • ৳${v.rentConfig.rates['Daily'] || 0}/day`} onSelect={() => { setSelectedAssetId(v.id); setStep(2); }} />
                            ))}
                            {/* GADGET LIST */}
                            {selectedAssetType === 'Gadget' && availableGadgets.map(g => (
                                <AssetItem key={g.id} id={g.id} title={g.name} subtitle={`${g.model} • ৳${g.rentConfig.rates['Daily'] || 0}/day`} onSelect={() => { setSelectedAssetId(g.id); setStep(2); }} />
                            ))}
                            {/* SERVICE LIST */}
                            {selectedAssetType === 'Service' && availableServices.map(s => (
                                <AssetItem key={s.id} id={s.id} title={s.name} subtitle={`${s.category} • ৳${Object.values(s.rentConfig.rates)[0] || 0}/unit`} onSelect={() => { setSelectedAssetId(s.id); setStep(2); }} />
                            ))}

                            {/* Empty States */}
                            {((selectedAssetType === 'Residential' && vacantFlats.length === 0) ||
                              (selectedAssetType === 'Vehicle' && availableVehicles.length === 0) ||
                              (selectedAssetType === 'Gadget' && availableGadgets.length === 0) ||
                              (selectedAssetType === 'Service' && availableServices.length === 0)) && 
                              <p className="text-center text-gray-400 text-sm py-10">No available items in this category.</p>
                            }
                        </div>
                    </div>
                )}

                {step === 2 && selectedAssetId && (
                    <AddTenantForm 
                        assetId={selectedAssetId}
                        assetType={selectedAssetType as AssetType}
                        onBack={() => setStep(1)}
                        onSuccess={handleTenantAdded}
                    />
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AssetItem = ({ id, title, subtitle, onSelect }: any) => (
    <button onClick={onSelect} className="w-full text-left bg-white border border-gray-100 p-4 rounded-2xl shadow-sm hover:border-[#ff4b9a] flex justify-between items-center group transition-all">
        <div>
            <h5 className="font-bold text-gray-800 text-sm">{title}</h5>
            <p className="text-[10px] text-gray-400">{subtitle}</p>
        </div>
        <ChevronRight size={16} className="text-gray-300 group-hover:text-[#ff4b9a]"/>
    </button>
);

// --- COMPREHENSIVE ADD TENANT FORM ---
const AddTenantForm: React.FC<{ assetId: string, assetType: AssetType, onBack: () => void, onSuccess: () => void }> = ({ assetId, assetType, onBack, onSuccess }) => {
    const [formData, setFormData] = useState<Partial<Tenant>>({
        full_name: '',
        phone: '',
        start_date: new Date().toISOString().slice(0, 10),
        security_deposit: 0,
        members_adults: 1,
        members_children: 0,
        profession: '',
        organization_name: '',
        nid_number: '',
        permanent_address: '',
        emergency_contact: { name: '', phone: '', relation: '' }
    });

    const [foundUser, setFoundUser] = useState<UserType | null>(null);
    const [isSearching, setIsSearching] = useState(false);

    const updateField = (field: keyof Tenant, value: any) => setFormData(prev => ({...prev, [field]: value}));
    const updateEmergency = (field: string, value: string) => setFormData(prev => ({
        ...prev, 
        emergency_contact: { ...(prev.emergency_contact || {name:'', phone:'', relation:''}), [field]: value }
    }));

    const handlePhoneBlur = () => {
        if(formData.phone && formData.phone.length > 10) {
            setIsSearching(true);
            // Simulate network request
            setTimeout(() => {
                const user = UserService.findUserByPhone(formData.phone!);
                if (user) {
                    setFoundUser(user);
                    // Only autofill public/safe info
                    setFormData(prev => ({
                        ...prev,
                        full_name: user.name, // Public info
                        is_registered_user: true,
                        linked_user_id: user.id
                    }));
                } else {
                    setFoundUser(null);
                }
                setIsSearching(false);
            }, 500);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(formData.full_name && formData.phone) {
            DataService.assignTenant(assetId, { 
                ...formData, 
                asset_type: assetType,
                profile_image: foundUser?.avatar // Use avatar if found
            });
            onSuccess();
        } else {
            alert("Please fill full name and phone number.");
        }
    };

    const SectionTitle = ({ icon: Icon, title }: { icon: any, title: string }) => (
        <h4 className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 mt-6 border-b border-gray-100 pb-2">
            <Icon size={14} className="text-[#ff4b9a]"/> {title}
        </h4>
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in duration-300 pb-10">
             <div onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 mb-2 cursor-pointer font-medium hover:text-gray-900 transition-colors">
                <ArrowLeft size={16} /> Back
             </div>
             
             {/* 1. Identity Section with Phone Lookup */}
             <div>
                <SectionTitle icon={User} title="Identity & Contact" />
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-900 mb-2">Mobile Number <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
                            <input 
                                type="tel" 
                                value={formData.phone} 
                                onChange={e => updateField('phone', e.target.value)} 
                                onBlur={handlePhoneBlur}
                                className="w-full pl-11 pr-4 py-4 rounded-2xl border border-gray-200 bg-white text-gray-900 font-bold focus:outline-none focus:border-[#ff4b9a] transition-all" 
                                placeholder="01..." 
                            />
                            {isSearching && <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-[#ff4b9a] border-t-transparent rounded-full animate-spin"></div>}
                        </div>
                        {foundUser && (
                            <div className="mt-2 p-3 bg-green-50 rounded-xl flex items-center gap-3 border border-green-100 animate-in slide-in-from-top-2">
                                <img src={foundUser.avatar} className="w-8 h-8 rounded-full bg-white"/>
                                <div>
                                    <p className="text-xs font-bold text-green-800 flex items-center gap-1">{foundUser.name} <CheckCircle2 size={12} fill="currentColor" className="text-green-500"/></p>
                                    <p className="text-[10px] text-green-600">Bhara.online User</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-900 mb-2">Full Name / Client <span className="text-red-500">*</span></label>
                        <input type="text" value={formData.full_name} onChange={e => updateField('full_name', e.target.value)} className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-white text-gray-900 font-bold focus:outline-none focus:border-[#ff4b9a]" placeholder="Name as per ID" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-900 mb-2">{assetType === 'Vehicle' ? 'Driving License' : 'NID / Passport'}</label>
                            <input type="text" value={formData.nid_number} onChange={e => updateField('nid_number', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-[#ff4b9a]" placeholder="ID Number" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-900 mb-2">Date of Birth</label>
                            <input type="date" value={formData.dob} onChange={e => updateField('dob', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-[#ff4b9a]" />
                        </div>
                    </div>
                </div>
             </div>

             {/* 2. Professional Info */}
             <div>
                <SectionTitle icon={Briefcase} title="Professional Info" />
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-900 mb-2">Occupation</label>
                        <input type="text" value={formData.profession} onChange={e => updateField('profession', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-[#ff4b9a]" placeholder="Job Title" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-900 mb-2">Organization</label>
                        <input type="text" value={formData.organization_name} onChange={e => updateField('organization_name', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-[#ff4b9a]" placeholder="Company Name" />
                    </div>
                </div>
             </div>

             {/* 3. Category Specifics */}
             {assetType === 'Residential' && (
                 <div>
                    <SectionTitle icon={Users} title="Family Members" />
                    <div className="flex gap-4">
                        <div className="flex-1 bg-gray-50 p-3 rounded-xl flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-600">Adults</span>
                            <div className="flex items-center gap-3 bg-white px-2 py-1 rounded-lg border border-gray-200">
                                <button type="button" onClick={() => updateField('members_adults', Math.max(1, (formData.members_adults || 1) - 1))} className="text-gray-400 hover:text-[#ff4b9a]">-</button>
                                <span className="text-sm font-bold">{formData.members_adults}</span>
                                <button type="button" onClick={() => updateField('members_adults', (formData.members_adults || 1) + 1)} className="text-gray-400 hover:text-[#ff4b9a]">+</button>
                            </div>
                        </div>
                        <div className="flex-1 bg-gray-50 p-3 rounded-xl flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-600">Children</span>
                            <div className="flex items-center gap-3 bg-white px-2 py-1 rounded-lg border border-gray-200">
                                <button type="button" onClick={() => updateField('members_children', Math.max(0, (formData.members_children || 0) - 1))} className="text-gray-400 hover:text-[#ff4b9a]">-</button>
                                <span className="text-sm font-bold">{formData.members_children}</span>
                                <button type="button" onClick={() => updateField('members_children', (formData.members_children || 0) + 1)} className="text-gray-400 hover:text-[#ff4b9a]">+</button>
                            </div>
                        </div>
                    </div>
                 </div>
             )}

             {/* 4. Emergency Contact (Crucial for Rentals) */}
             <div>
                <SectionTitle icon={ShieldCheck} title="Emergency Contact" />
                <div className="space-y-3 bg-red-50/50 p-4 rounded-2xl border border-red-50">
                    <input type="text" value={formData.emergency_contact?.name} onChange={e => updateEmergency('name', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm font-medium focus:outline-none focus:border-[#ff4b9a]" placeholder="Contact Name" />
                    <div className="grid grid-cols-2 gap-3">
                        <input type="tel" value={formData.emergency_contact?.phone} onChange={e => updateEmergency('phone', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm font-medium focus:outline-none focus:border-[#ff4b9a]" placeholder="Phone Number" />
                        <input type="text" value={formData.emergency_contact?.relation} onChange={e => updateEmergency('relation', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm font-medium focus:outline-none focus:border-[#ff4b9a]" placeholder="Relation (e.g. Brother)" />
                    </div>
                </div>
             </div>

             {/* 5. Docs & Terms */}
             <div>
                <SectionTitle icon={FileText} title="Booking Terms & Docs" />
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-900 mb-2">Start Date</label>
                        <div className="relative">
                            <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                            <input type="date" value={formData.start_date} onChange={e => updateField('start_date', e.target.value)} className="w-full pl-9 pr-3 py-3 rounded-xl border border-gray-200 bg-white text-sm font-bold focus:outline-none focus:border-[#ff4b9a]" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-900 mb-2">Deposit</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">৳</span>
                            <input type="number" value={formData.security_deposit} onChange={e => updateField('security_deposit', parseInt(e.target.value))} className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm font-bold focus:outline-none focus:border-[#ff4b9a]" />
                        </div>
                    </div>
                </div>
                
                <div className="flex gap-3">
                    <button type="button" className="flex-1 py-3 border-2 border-dashed border-gray-300 rounded-xl text-xs font-bold text-gray-500 hover:border-[#ff4b9a] hover:text-[#ff4b9a] transition-all flex items-center justify-center gap-2">
                        <Upload size={14}/> Upload ID
                    </button>
                    <button type="button" className="flex-1 py-3 border-2 border-dashed border-gray-300 rounded-xl text-xs font-bold text-gray-500 hover:border-[#ff4b9a] hover:text-[#ff4b9a] transition-all flex items-center justify-center gap-2">
                        <Upload size={14}/> Photo
                    </button>
                </div>
             </div>
              
              <div className="pt-4 sticky bottom-0 bg-white pb-4 border-t border-gray-100">
                <button type="submit" className="w-full py-4 bg-[#2d1b4e] text-white font-bold rounded-2xl shadow-xl shadow-indigo-200 active:scale-95 transition-transform flex items-center justify-center gap-2">
                    <CheckCircle2 size={20}/> Confirm Booking
                </button>
              </div>
        </form>
    );
};

export default Renters;
