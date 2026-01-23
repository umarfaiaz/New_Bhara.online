
import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Building2, Car, Camera, ChevronRight, MapPin, 
  Home, Globe, Edit, Trash2, Save, ArrowLeft, Check, 
  LayoutGrid, DollarSign, Image as ImageIcon, Briefcase, Calendar, 
  Wrench, ChevronDown, Layers, Box, Zap, Key, ShieldCheck, Wifi,
  Minus, ShoppingBag, Sofa, Sparkles, Tag, ArrowUpRight, Percent, CalendarClock, Ban, HeartHandshake, FileText,
  Receipt, Flame, Droplets, ListPlus, X
} from 'lucide-react';
import { Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import { AssetService, LocationService } from '../../services/mockData';
import { Asset, AssetCategory, RentCycle, MarketplaceSettings } from '../../types';
import { ASSET_CATEGORIES, RENT_TYPES, BANGLADESH_LOCATIONS, MARKETPLACE_CATEGORIES, SUGGESTED_TAGS } from '../../constants';

// --- MAIN WRAPPER & ROUTING ---
const Inventory: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-24 animate-in fade-in duration-300">
      <Routes>
        <Route index element={<AssetList />} />
        <Route path="new" element={<AssetForm mode="create" />} />
        <Route path="edit/:id" element={<AssetForm mode="edit" />} />
        <Route path="add-unit/:parentId" element={<AssetForm mode="unit" />} />
        {/* Helper route to handle legacy redirects or direct type selection */}
        <Route path="select-type" element={<AssetForm mode="create" />} />
      </Routes>
    </div>
  );
};

// --- 1. ASSET LIST VIEW ---
const AssetList: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'Assets' | 'Marketplace'>('Assets');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setAssets(AssetService.getAll());
  }, []);

  const filteredAssets = assets.filter(asset => {
      const matchesSearch = asset.name.toLowerCase().includes(search.toLowerCase());
      if (activeTab === 'Marketplace') return matchesSearch && asset.is_listed;
      
      // My Assets: Show Buildings and Standalone items. Hide Units (they are managed inside buildings or filtered differently)
      const isUnit = (asset as any).type === 'Unit';
      if (search) return matchesSearch; 
      return !isUnit; 
  });

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header Controls */}
      <div className="flex flex-row justify-between items-center gap-4">
          <div className="flex bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
              <button onClick={() => setActiveTab('Assets')} className={`px-4 sm:px-6 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'Assets' ? 'bg-gray-900 text-white shadow' : 'text-gray-500 hover:bg-gray-50'}`}>Assets</button>
              <button onClick={() => setActiveTab('Marketplace')} className={`px-4 sm:px-6 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'Marketplace' ? 'bg-gray-900 text-white shadow' : 'text-gray-500 hover:bg-gray-50'}`}>Market</button>
          </div>
          
          {/* Add Button */}
          <button 
            onClick={() => navigate('select-type')} 
            className="flex items-center gap-2 bg-[#2d1b4e] text-white px-4 py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-[#3a2366] transition-all active:scale-95"
          >
              <Plus size={18}/> <span className="hidden sm:inline">Add Asset</span>
          </button>
      </div>

      {/* Search */}
      <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
          <input 
            type="text" 
            placeholder="Search properties, vehicles, gadgets..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:border-[#ff4b9a] shadow-sm transition-all"
          />
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAssets.map(asset => (
              <AssetCard key={asset.id} asset={asset} isMarketplaceView={activeTab === 'Marketplace'} />
          ))}
          {filteredAssets.length === 0 && (
              <div className="col-span-full text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Box size={32} className="text-gray-300"/>
                  </div>
                  <p className="text-gray-500 font-bold">No assets found.</p>
                  <button onClick={() => navigate('select-type')} className="mt-4 text-[#ff4b9a] font-bold text-sm hover:underline">Add your first asset</button>
              </div>
          )}
      </div>
    </div>
  );
};

// --- 2. ASSET CARD COMPONENT ---
const AssetCard: React.FC<{ asset: Asset, isMarketplaceView: boolean }> = ({ asset, isMarketplaceView }) => {
    const navigate = useNavigate();
    const isBuilding = (asset as any).type === 'Building';
    const units = AssetService.getUnitsByBuilding(asset.id);
    const locationStr = typeof asset.location === 'string' ? asset.location : `${asset.location?.area || ''}, ${asset.location?.district || ''}`;
    const [showUnits, setShowUnits] = useState(false);
    
    const getIcon = () => {
        if(asset.category === 'Vehicle') return <Car size={20}/>;
        if(asset.category === 'Gadget') return <Camera size={20}/>;
        return <Building2 size={20}/>;
    };

    return (
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group flex flex-col h-full">
            {/* Main Card Content - Click to Edit */}
            <div className="flex gap-4 mb-4 cursor-pointer" onClick={() => navigate(`edit/${asset.id}`)}>
                <div className="w-16 h-16 bg-gray-100 rounded-xl shrink-0 flex items-center justify-center text-gray-400 overflow-hidden">
                    {asset.images?.[0] ? <img src={asset.images[0]} className="w-full h-full object-cover"/> : getIcon()}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-bold text-gray-900 truncate text-base">{asset.name}</h3>
                            <p className="text-xs text-gray-500 mt-0.5">{asset.subCategory || asset.category} • {locationStr}</p>
                        </div>
                        <div className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                            <Edit size={16}/>
                        </div>
                    </div>
                    <div className="flex gap-2 mt-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${asset.status === 'Active' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                            {asset.status}
                        </span>
                        {asset.is_listed && <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-purple-50 text-purple-600 border border-purple-100">Listed</span>}
                    </div>
                </div>
            </div>

            <div className="mt-auto pt-4 border-t border-gray-50">
                {isBuilding ? (
                    <div>
                        <div className="flex items-center justify-between">
                            <button 
                                onClick={(e) => { e.stopPropagation(); setShowUnits(!showUnits); }}
                                className="text-xs font-bold text-gray-500 flex items-center gap-1 hover:text-[#ff4b9a] transition-colors p-1 -ml-1"
                            >
                                {units.length} Units <ChevronDown size={14} className={`transition-transform duration-200 ${showUnits ? 'rotate-180 text-[#ff4b9a]' : ''}`}/>
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); navigate(`add-unit/${asset.id}`); }} className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline">
                                <Plus size={14}/> Add Unit
                            </button>
                        </div>
                        
                        {/* Expanded Units List */}
                        {showUnits && (
                            <div className="mt-3 space-y-2 bg-gray-50 p-2 rounded-xl animate-in slide-in-from-top-2 border border-gray-100">
                                {units.map(unit => (
                                    <div key={unit.id} onClick={(e) => { e.stopPropagation(); navigate(`edit/${unit.id}`); }} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 shadow-sm cursor-pointer hover:border-[#ff4b9a] hover:shadow-md transition-all">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-6 h-6 bg-blue-50 rounded-md flex items-center justify-center text-blue-500"><Home size={12}/></div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-800 leading-none">{unit.name}</p>
                                                {Object.values(unit.rentConfig.rates)[0] && <p className="text-[10px] text-gray-400 mt-0.5 font-medium">৳{Object.values(unit.rentConfig.rates)[0]}</p>}
                                            </div>
                                        </div>
                                        <Edit size={12} className="text-gray-300"/>
                                    </div>
                                ))}
                                {units.length === 0 && <p className="text-[10px] text-center text-gray-400 py-2">No units added yet.</p>}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-500">Rent</span>
                        <span className="text-sm font-black text-gray-900">৳ {Object.values(asset.rentConfig.rates)[0] || 0}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- COUNTER COMPONENT ---
const CounterInput: React.FC<{ label: string, value: number, onChange: (v: number) => void }> = ({ label, value, onChange }) => (
    <div className="bg-gray-50 p-3 rounded-2xl flex items-center justify-between">
        <label className="text-xs font-bold text-gray-600 uppercase">{label}</label>
        <div className="flex items-center gap-3 bg-white p-1 rounded-xl shadow-sm border border-gray-100">
            <button 
                onClick={() => onChange(Math.max(0, value - 1))} 
                className="w-8 h-8 rounded-lg bg-gray-50 text-gray-600 flex items-center justify-center hover:bg-gray-200 active:scale-90 transition-all"
            >
                <Minus size={14}/>
            </button>
            <span className="w-6 text-center font-bold text-gray-900 text-sm">{value}</span>
            <button 
                onClick={() => onChange(value + 1)} 
                className="w-8 h-8 rounded-lg bg-gray-50 text-gray-600 flex items-center justify-center hover:bg-gray-200 active:scale-90 transition-all"
            >
                <Plus size={14}/>
            </button>
        </div>
    </div>
);

// --- 3. ASSET FORM COMPONENT (Full Page) ---
const AssetForm: React.FC<{ mode: 'create' | 'edit' | 'unit' }> = ({ mode }) => {
    const navigate = useNavigate();
    const { id, parentId } = useParams();
    const location = useLocation(); 
    
    // Initial Data Fetching
    const existingAsset = mode === 'edit' && id ? AssetService.getById(id) : null;
    const parentAsset = mode === 'unit' && parentId ? AssetService.getById(parentId) : null;

    // Form State
    const [category, setCategory] = useState<AssetCategory>(existingAsset?.category || parentAsset?.category || 'Residential');
    const [step, setStep] = useState(mode === 'create' && !existingAsset ? 1 : 2); 
    
    const isBuilding = (existingAsset as any)?.type === 'Building' || 
                       (mode === 'create' && !existingAsset && (category === 'Residential' || category === 'Commercial'));
    
    // Fields
    const [name, setName] = useState(existingAsset?.name || '');
    const [desc, setDesc] = useState(existingAsset?.description || '');
    const [subCategory, setSubCategory] = useState(existingAsset?.subCategory || '');
    const [tags, setTags] = useState<string[]>(existingAsset?.tags || []);
    const [rent, setRent] = useState<string>(Object.values(existingAsset?.rentConfig?.rates || {})[0]?.toString() || '');
    const [rentCycle, setRentCycle] = useState<RentCycle>('Monthly');
    
    // Charges State (New Feature)
    const [charges, setCharges] = useState({
        serviceCharge: existingAsset?.charges?.serviceCharge || '',
        gasFee: existingAsset?.charges?.gasFee || '',
        waterFee: existingAsset?.charges?.waterFee || '',
        electricityFee: existingAsset?.charges?.electricityFee || '',
        driverFee: existingAsset?.charges?.driverFee || ''
    });

    // Custom Charges State
    const [customCharges, setCustomCharges] = useState<{name: string, amount: string}[]>(
        existingAsset?.charges?.customCharges?.map((c: any) => ({name: c.name, amount: c.amount.toString()})) || []
    );

    // Location State
    const [district, setDistrict] = useState(existingAsset?.location?.district || parentAsset?.location?.district || 'Dhaka');
    const [area, setArea] = useState(existingAsset?.location?.area || parentAsset?.location?.area || '');
    const [address, setAddress] = useState(existingAsset?.location?.address || parentAsset?.location?.address || '');

    // Facilities State (For Buildings)
    const [facilities, setFacilities] = useState<any>({
        lift: (existingAsset as any)?.facilities?.lift || false,
        generator: (existingAsset as any)?.facilities?.generator || false,
        cctv: (existingAsset as any)?.facilities?.cctv || false,
        gas: (existingAsset as any)?.facilities?.gasSource === 'Pipeline',
        parking: (existingAsset as any)?.facilities?.parking?.car > 0 || false,
        wifi: (existingAsset as any)?.facilities?.internet || false,
        security: (existingAsset as any)?.facilities?.securityGuard || false
    });

    // Specs State (For Units/Items)
    const [specs, setSpecs] = useState<any>({
        bedrooms: (existingAsset as any)?.bedrooms || 2,
        bathrooms: (existingAsset as any)?.bathrooms || 2,
        balconies: (existingAsset as any)?.balconies || 1,
        maidRoom: (existingAsset as any)?.maidRoom || false,
        sizeSqft: (existingAsset as any)?.sizeSqft || '',
        floorNumber: (existingAsset as any)?.floorNumber || '',
        floorType: (existingAsset as any)?.floorType || 'Tiles',
        furnished: (existingAsset as any)?.furnished || 'None',
        
        // Vehicle/Gadget
        brand: (existingAsset as any)?.brand || '',
        model: (existingAsset as any)?.model || '',
        licensePlate: (existingAsset as any)?.licensePlate || ''
    });

    // Marketplace Advanced State
    const [isListed, setIsListed] = useState(existingAsset?.is_listed || (location.state as any)?.isMarketplace || false);
    const [listingTitle, setListingTitle] = useState(existingAsset?.listing_title || '');
    const [bookingType, setBookingType] = useState(existingAsset?.booking_type || 'Request');
    
    // New Advanced Fields
    const [mpSettings, setMpSettings] = useState<MarketplaceSettings>({
        discounts: existingAsset?.marketplace_settings?.discounts || { weekly: 0, monthly: 0 },
        policy: existingAsset?.marketplace_settings?.policy || 'Flexible',
        rules: existingAsset?.marketplace_settings?.rules || [],
        min_stay: existingAsset?.marketplace_settings?.min_stay || 1,
        min_stay_unit: existingAsset?.marketplace_settings?.min_stay_unit || 'Day'
    });

    // Handlers
    const handleAddCustomCharge = () => {
        setCustomCharges([...customCharges, { name: '', amount: '' }]);
    };

    const handleRemoveCustomCharge = (index: number) => {
        setCustomCharges(customCharges.filter((_, i) => i !== index));
    };

    const handleCustomChargeChange = (index: number, field: 'name' | 'amount', value: string) => {
        const updated = [...customCharges];
        updated[index] = { ...updated[index], [field]: value };
        setCustomCharges(updated);
    };

    const handleAddTag = (tag: string) => {
        if (!tags.includes(tag)) setTags([...tags, tag]);
    };

    const handleRemoveTag = (tag: string) => {
        setTags(tags.filter(t => t !== tag));
    };

    const handleSave = () => {
        if (!name) return alert("Name is required");
        if (!isBuilding && !rent) return alert("Rent is required");

        const payload: any = {
            ...existingAsset,
            category,
            subCategory,
            name,
            description: desc,
            tags,
            rentConfig: {
                allowedTypes: [rentCycle],
                rates: { [rentCycle]: parseInt(rent) || 0 }
            },
            charges: {
                serviceCharge: parseInt(charges.serviceCharge as string) || 0,
                gasFee: parseInt(charges.gasFee as string) || 0,
                waterFee: parseInt(charges.waterFee as string) || 0,
                electricityFee: parseInt(charges.electricityFee as string) || 0,
                driverFee: parseInt(charges.driverFee as string) || 0,
                customCharges: customCharges.filter(c => c.name && c.amount).map(c => ({
                    name: c.name,
                    amount: parseInt(c.amount) || 0
                }))
            },
            location: { district, area, address },
            is_listed: isListed,
            status: 'Active',
            images: existingAsset?.images || [], 
            
            // Advanced Listing Info
            listing_title: listingTitle || name,
            booking_type: bookingType,
            marketplace_settings: mpSettings,
            
            // Facilities for Buildings
            ...(isBuilding ? {
                facilities: {
                    lift: facilities.lift,
                    generator: facilities.generator,
                    cctv: facilities.cctv,
                    gasSource: facilities.gas ? 'Pipeline' : 'Cylinder',
                    internet: facilities.wifi,
                    securityGuard: facilities.security,
                    parking: facilities.parking ? { car: 1, bike: 1 } : undefined
                }
            } : {}),

            // Specs for Units/Items
            ...(!isBuilding && category === 'Residential' ? { 
                bedrooms: parseInt(specs.bedrooms), 
                bathrooms: parseInt(specs.bathrooms),
                balconies: parseInt(specs.balconies),
                maidRoom: specs.maidRoom,
                sizeSqft: parseInt(specs.sizeSqft),
                floorNumber: parseInt(specs.floorNumber),
                floorType: specs.floorType,
                furnished: specs.furnished,
                unitNumber: mode === 'unit' ? name : undefined 
            } : {}),
            ...(!isBuilding && category === 'Vehicle' ? {
                brand: specs.brand,
                model: specs.model,
                licensePlate: specs.licensePlate
            } : {}),
            ...(!isBuilding && category === 'Gadget' ? {
                brand: specs.brand,
                model: specs.model
            } : {})
        };

        if (mode === 'unit' && parentAsset) {
            payload.parentId = parentAsset.id;
            payload.type = 'Unit';
            payload.category = parentAsset.category;
        } else if (mode === 'create') {
            if (category === 'Residential' || category === 'Commercial') {
                payload.type = 'Building';
            } else {
                payload.type = 'Item';
            }
        }

        if (mode === 'edit' && id) {
            AssetService.update(id, payload);
        } else {
            AssetService.create(payload);
        }

        navigate('/myspace/rentals');
    };

    const toggleRule = (rule: string) => {
        setMpSettings(prev => ({
            ...prev,
            rules: prev.rules.includes(rule) ? prev.rules.filter(r => r !== rule) : [...prev.rules, rule]
        }));
    };

    // --- STEP 1: CATEGORY SELECTION ---
    if (step === 1) {
        return (
            <div className="max-w-2xl mx-auto p-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
                <button onClick={() => navigate('/myspace/rentals')} className="mb-6 flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">
                    <ArrowLeft size={18}/> Back to Inventory
                </button>
                <h1 className="text-3xl font-black text-gray-900 mb-2">Add New Asset</h1>
                <p className="text-gray-500 mb-8">Select the category of the asset to configure relevant details.</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {ASSET_CATEGORIES.map(cat => (
                        <button 
                            key={cat}
                            onClick={() => { setCategory(cat); setStep(2); }}
                            className="flex flex-col items-center justify-center p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:border-[#ff4b9a] hover:shadow-md transition-all group"
                        >
                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#ff4b9a]/10 text-gray-600 group-hover:text-[#ff4b9a] transition-colors">
                                {cat === 'Residential' ? <Building2 size={24}/> : 
                                 cat === 'Vehicle' ? <Car size={24}/> : 
                                 cat === 'Gadget' ? <Camera size={24}/> : <Box size={24}/>}
                            </div>
                            <span className="font-bold text-gray-900 group-hover:text-[#ff4b9a]">{cat}</span>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    // --- STEP 2: DETAILS FORM ---
    return (
        <div className="max-w-3xl mx-auto p-4 sm:p-8 pb-32 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
                <button onClick={() => mode === 'create' ? setStep(1) : navigate(-1)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                    <ArrowLeft size={20}/>
                </button>
                <div>
                    <h1 className="text-2xl font-black text-gray-900">
                        {mode === 'edit' ? 'Edit Details' : mode === 'unit' ? 'Add Unit' : 'New Asset'}
                    </h1>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                        {isBuilding ? 'Building Property' : mode === 'unit' ? `${parentAsset?.name} Unit` : category}
                    </p>
                </div>
            </div>

            <div className="space-y-8">
                {/* 1. Category Manager & Basic Info */}
                <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-50 pb-2">
                        <LayoutGrid size={16} className="text-[#ff4b9a]"/> Asset Classification
                    </h3>
                    
                    <div className="grid gap-6">
                        {/* Sub Category Picker */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Category Type</label>
                            <div className="relative">
                                <select 
                                    value={subCategory} 
                                    onChange={e => setSubCategory(e.target.value)}
                                    className="w-full p-3 bg-gray-50 rounded-xl font-bold text-gray-900 border border-transparent focus:bg-white focus:border-[#ff4b9a] focus:ring-4 focus:ring-[#ff4b9a]/10 transition-all outline-none appearance-none"
                                >
                                    <option value="">Select Type...</option>
                                    {(MARKETPLACE_CATEGORIES[category] || []).map(sub => (
                                        <option key={sub} value={sub}>{sub}</option>
                                    ))}
                                </select>
                                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
                            </div>
                        </div>

                        {/* Title & Desc */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                                {mode === 'unit' ? 'Unit Number' : isBuilding ? 'Property Name' : 'Title'} <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="text" 
                                value={name} 
                                onChange={e => setName(e.target.value)} 
                                className="w-full p-3 bg-gray-50 rounded-xl font-bold text-gray-900 border border-transparent focus:bg-white focus:border-[#ff4b9a] focus:ring-4 focus:ring-[#ff4b9a]/10 transition-all outline-none"
                                placeholder={mode === 'unit' ? "e.g. Flat 4A" : "e.g. Ragib Villa"}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Description</label>
                            <textarea 
                                value={desc} 
                                onChange={e => setDesc(e.target.value)} 
                                className="w-full p-3 bg-gray-50 rounded-xl text-sm font-medium text-gray-900 border border-transparent focus:bg-white focus:border-[#ff4b9a] focus:ring-4 focus:ring-[#ff4b9a]/10 transition-all outline-none min-h-[80px]"
                                placeholder="Details about this asset..."
                            />
                        </div>

                        {/* Tags System */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Tags & Features</label>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {tags.map(tag => (
                                    <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-[#ff4b9a]/10 text-[#ff4b9a] text-xs font-bold rounded-full">
                                        {tag}
                                        <button onClick={() => handleRemoveTag(tag)} className="hover:text-red-500"><X size={12}/></button>
                                    </span>
                                ))}
                            </div>
                            <div className="space-y-2">
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Suggestions</p>
                                <div className="flex flex-wrap gap-2">
                                    {(SUGGESTED_TAGS[category] || []).map(suggestion => (
                                        <button 
                                            key={suggestion}
                                            onClick={() => handleAddTag(suggestion)}
                                            disabled={tags.includes(suggestion)}
                                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${tags.includes(suggestion) ? 'bg-gray-100 text-gray-400 border-gray-100 cursor-default' : 'bg-white text-gray-600 border-gray-200 hover:border-[#ff4b9a] hover:text-[#ff4b9a]'}`}
                                        >
                                            + {suggestion}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. Location (Hidden for Units) */}
                {mode !== 'unit' && (
                    <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-50 pb-2">
                            <MapPin size={16} className="text-[#ff4b9a]"/> Location
                        </h3>
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">District</label>
                                <div className="relative">
                                    <select 
                                        value={district} 
                                        onChange={e => setDistrict(e.target.value)}
                                        className="w-full p-3 bg-gray-50 rounded-xl text-sm font-bold text-gray-900 border border-transparent focus:bg-white focus:border-[#ff4b9a] outline-none appearance-none"
                                    >
                                        {Object.keys(BANGLADESH_LOCATIONS).map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Area</label>
                                <div className="relative">
                                    <select 
                                        value={area} 
                                        onChange={e => setArea(e.target.value)}
                                        className="w-full p-3 bg-gray-50 rounded-xl text-sm font-bold text-gray-900 border border-transparent focus:bg-white focus:border-[#ff4b9a] outline-none appearance-none"
                                    >
                                        <option value="">Select Area</option>
                                        {(BANGLADESH_LOCATIONS[district] ? Object.keys(BANGLADESH_LOCATIONS[district]) : []).map(a => <option key={a} value={a}>{a}</option>)}
                                    </select>
                                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Full Address</label>
                                <input 
                                    type="text" 
                                    value={address} 
                                    onChange={e => setAddress(e.target.value)} 
                                    className="w-full p-3 bg-gray-50 rounded-xl text-sm font-bold text-gray-900 border border-transparent focus:bg-white focus:border-[#ff4b9a] outline-none"
                                    placeholder="House, Road, Block..."
                                />
                            </div>
                        </div>
                    </section>
                )}

                {/* 3. FACILITIES (ONLY FOR BUILDINGS) */}
                {isBuilding && (
                    <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-50 pb-2">
                            <Zap size={16} className="text-[#ff4b9a]"/> Property Facilities
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { id: 'lift', label: 'Lift / Elevator', icon: Layers },
                                { id: 'generator', label: 'Power Generator', icon: Zap },
                                { id: 'gas', label: 'Gas Pipeline', icon: Flame },
                                { id: 'cctv', label: 'CCTV Camera', icon: Camera },
                                { id: 'security', label: 'Security Guard', icon: ShieldCheck },
                                { id: 'parking', label: 'Parking Space', icon: Car },
                                { id: 'wifi', label: 'Internet / WiFi', icon: Wifi },
                            ].map(fac => (
                                <button 
                                    key={fac.id}
                                    onClick={() => setFacilities({...facilities, [fac.id]: !facilities[fac.id]})}
                                    className={`p-4 rounded-xl border text-left flex items-center gap-3 transition-all ${facilities[fac.id] ? 'border-[#ff4b9a] bg-pink-50' : 'border-gray-100 bg-white hover:border-gray-300'}`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${facilities[fac.id] ? 'bg-[#ff4b9a] text-white' : 'bg-gray-100 text-gray-400'}`}>
                                        <fac.icon size={14}/>
                                    </div>
                                    <span className={`text-xs font-bold ${facilities[fac.id] ? 'text-[#ff4b9a]' : 'text-gray-600'}`}>{fac.label}</span>
                                </button>
                            ))}
                        </div>
                    </section>
                )}

                {/* 4. SPECS (UNITS & ITEMS ONLY - NO BUILDINGS) */}
                {!isBuilding && (
                    <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-50 pb-2">
                            <Wrench size={16} className="text-[#ff4b9a]"/> Specifications
                        </h3>
                        
                        {/* RESIDENTIAL SPECS */}
                        {category === 'Residential' && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <CounterInput label="Bedrooms" value={specs.bedrooms} onChange={v => setSpecs({...specs, bedrooms: v})}/>
                                    <CounterInput label="Bathrooms" value={specs.bathrooms} onChange={v => setSpecs({...specs, bathrooms: v})}/>
                                    <CounterInput label="Balconies" value={specs.balconies} onChange={v => setSpecs({...specs, balconies: v})}/>
                                    
                                    <div className="bg-gray-50 p-3 rounded-2xl flex items-center justify-between">
                                        <label className="text-xs font-bold text-gray-600 uppercase">Maid's Room</label>
                                        <button 
                                            onClick={() => setSpecs({...specs, maidRoom: !specs.maidRoom})}
                                            className={`w-12 h-7 rounded-full p-1 transition-colors ${specs.maidRoom ? 'bg-[#ff4b9a]' : 'bg-gray-300'}`}
                                        >
                                            <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${specs.maidRoom ? 'translate-x-5' : ''}`}></div>
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-2">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Size (Sq Ft)</label>
                                        <input type="number" value={specs.sizeSqft} onChange={e => setSpecs({...specs, sizeSqft: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl text-sm font-bold border-transparent focus:bg-white focus:border-[#ff4b9a] outline-none" placeholder="1200"/>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Floor No.</label>
                                        <input type="number" value={specs.floorNumber} onChange={e => setSpecs({...specs, floorNumber: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl text-sm font-bold border-transparent focus:bg-white focus:border-[#ff4b9a] outline-none" placeholder="4"/>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Floor Type</label>
                                        <select value={specs.floorType} onChange={e => setSpecs({...specs, floorType: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl text-sm font-bold border-transparent focus:bg-white focus:border-[#ff4b9a] outline-none">
                                            <option>Tiles</option><option>Mosaic</option><option>Marble</option><option>Wooden</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Furnished</label>
                                        <select value={specs.furnished} onChange={e => setSpecs({...specs, furnished: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl text-sm font-bold border-transparent focus:bg-white focus:border-[#ff4b9a] outline-none">
                                            <option value="None">Unfurnished</option><option value="Semi">Semi-Furnished</option><option value="Full">Fully Furnished</option>
                                        </select>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* VEHICLE SPECS */}
                        {category === 'Vehicle' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">Brand</label><input type="text" value={specs.brand} onChange={e => setSpecs({...specs, brand: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl text-sm font-bold border-transparent focus:bg-white focus:border-[#ff4b9a] outline-none" placeholder="Toyota"/></div>
                                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">Model</label><input type="text" value={specs.model} onChange={e => setSpecs({...specs, model: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl text-sm font-bold border-transparent focus:bg-white focus:border-[#ff4b9a] outline-none" placeholder="Corolla"/></div>
                                <div className="col-span-2"><label className="block text-xs font-bold text-gray-500 uppercase mb-2">License Plate</label><input type="text" value={specs.licensePlate} onChange={e => setSpecs({...specs, licensePlate: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl text-sm font-bold border-transparent focus:bg-white focus:border-[#ff4b9a] outline-none" placeholder="DHA-MET-GA-..."/></div>
                            </div>
                        )}
                        
                        {/* GADGET SPECS */}
                        {category === 'Gadget' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">Brand</label><input type="text" value={specs.brand} onChange={e => setSpecs({...specs, brand: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl text-sm font-bold border-transparent focus:bg-white focus:border-[#ff4b9a] outline-none" placeholder="Sony"/></div>
                                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">Model</label><input type="text" value={specs.model} onChange={e => setSpecs({...specs, model: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl text-sm font-bold border-transparent focus:bg-white focus:border-[#ff4b9a] outline-none" placeholder="A7 III"/></div>
                            </div>
                        )}
                    </section>
                )}

                {/* 5. FINANCIALS & CHARGES (UNITS & ITEMS ONLY - NO BUILDINGS) */}
                {!isBuilding && (
                    <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-50 pb-2">
                            <DollarSign size={16} className="text-[#ff4b9a]"/> Financials
                        </h3>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Rent / Rate</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">৳</span>
                                    <input 
                                        type="number" 
                                        value={rent} 
                                        onChange={e => setRent(e.target.value)} 
                                        className="w-full pl-8 pr-4 py-3 bg-gray-50 rounded-xl text-lg font-black text-gray-900 border border-transparent focus:bg-white focus:border-[#ff4b9a] outline-none"
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Cycle</label>
                                <div className="relative">
                                    <select 
                                        value={rentCycle} 
                                        onChange={e => setRentCycle(e.target.value as RentCycle)}
                                        className="w-full p-3 bg-gray-50 rounded-xl text-sm font-bold text-gray-900 border border-transparent focus:bg-white focus:border-[#ff4b9a] outline-none appearance-none"
                                    >
                                        {RENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
                                </div>
                            </div>
                        </div>

                        {/* Recurring Charges Section */}
                        <div className="pt-4 border-t border-gray-50 animate-in fade-in slide-in-from-top-2">
                            <h4 className="text-xs font-bold text-gray-600 uppercase mb-4 flex items-center gap-2"><Receipt size={14}/> Recurring Charges (Monthly)</h4>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Service Charge</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 font-bold">৳</span>
                                        <input type="number" value={charges.serviceCharge} onChange={e => setCharges({...charges, serviceCharge: e.target.value})} className="w-full pl-7 p-2 bg-gray-50 rounded-xl text-sm font-bold border-transparent focus:bg-white focus:border-[#ff4b9a] outline-none" placeholder="0"/>
                                    </div>
                                </div>
                                {category === 'Residential' && (
                                    <>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Gas Bill</label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 font-bold">৳</span>
                                                <input type="number" value={charges.gasFee} onChange={e => setCharges({...charges, gasFee: e.target.value})} className="w-full pl-7 p-2 bg-gray-50 rounded-xl text-sm font-bold border-transparent focus:bg-white focus:border-[#ff4b9a] outline-none" placeholder="0"/>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Water Bill</label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 font-bold">৳</span>
                                                <input type="number" value={charges.waterFee} onChange={e => setCharges({...charges, waterFee: e.target.value})} className="w-full pl-7 p-2 bg-gray-50 rounded-xl text-sm font-bold border-transparent focus:bg-white focus:border-[#ff4b9a] outline-none" placeholder="0"/>
                                            </div>
                                        </div>
                                    </>
                                )}
                                {category === 'Vehicle' && (
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Driver Allowance</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 font-bold">৳</span>
                                            <input type="number" value={charges.driverFee} onChange={e => setCharges({...charges, driverFee: e.target.value})} className="w-full pl-7 p-2 bg-gray-50 rounded-xl text-sm font-bold border-transparent focus:bg-white focus:border-[#ff4b9a] outline-none" placeholder="0"/>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Dynamic Custom Charges */}
                            <div className="space-y-3">
                                {customCharges.map((charge, idx) => (
                                    <div key={idx} className="flex gap-2 items-center animate-in slide-in-from-left-2">
                                        <input 
                                            type="text" 
                                            placeholder="Charge Name (e.g. Gym)" 
                                            value={charge.name}
                                            onChange={(e) => handleCustomChargeChange(idx, 'name', e.target.value)}
                                            className="flex-1 p-2 bg-gray-50 rounded-xl text-sm font-bold border-transparent focus:bg-white focus:border-[#ff4b9a] outline-none"
                                        />
                                        <div className="relative w-24">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 font-bold">৳</span>
                                            <input 
                                                type="number" 
                                                placeholder="0" 
                                                value={charge.amount}
                                                onChange={(e) => handleCustomChargeChange(idx, 'amount', e.target.value)}
                                                className="w-full pl-7 p-2 bg-gray-50 rounded-xl text-sm font-bold border-transparent focus:bg-white focus:border-[#ff4b9a] outline-none"
                                            />
                                        </div>
                                        <button onClick={() => handleRemoveCustomCharge(idx)} className="p-2 text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 rounded-xl transition-colors">
                                            <Trash2 size={16}/>
                                        </button>
                                    </div>
                                ))}
                                <button onClick={handleAddCustomCharge} className="text-xs font-bold text-[#ff4b9a] flex items-center gap-1 hover:underline mt-2">
                                    <ListPlus size={14}/> Add Custom Charge
                                </button>
                            </div>
                        </div>
                    </section>
                )}

                {/* 6. Settings & Advanced Marketplace */}
                <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                    <div className="flex items-center justify-between p-2">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                                <Globe size={24}/>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm">List on Marketplace</h4>
                                <p className="text-xs text-gray-500">Make visible to public.</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={isListed} onChange={e => setIsListed(e.target.checked)} className="sr-only peer"/>
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2d1b4e]"></div>
                        </label>
                    </div>

                    {isListed && (
                        <div className="animate-in slide-in-from-top-2 pt-4 border-t border-gray-100 space-y-6">
                            
                            {/* Listing Basics */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Listing Title <span className="text-[10px] text-gray-400 font-normal">(Defaults to name)</span></label>
                                <input 
                                    type="text" 
                                    value={listingTitle} 
                                    onChange={e => setListingTitle(e.target.value)} 
                                    placeholder={name}
                                    className="w-full p-3 bg-gray-50 rounded-xl text-sm font-bold text-gray-900 border border-transparent focus:bg-white focus:border-[#ff4b9a] outline-none"
                                />
                            </div>

                            {/* Booking Policy & Cancelation */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Booking Policy</label>
                                    <div className="flex gap-2">
                                        <button onClick={() => setBookingType('Request')} className={`flex-1 p-2.5 rounded-xl border text-left transition-all ${bookingType === 'Request' ? 'bg-[#ff4b9a]/5 border-[#ff4b9a] text-[#ff4b9a]' : 'bg-gray-50 border-transparent text-gray-500'}`}>
                                            <span className="block text-[10px] font-bold uppercase mb-0.5">Request</span>
                                            <span className="text-[9px] opacity-80">Manual approval</span>
                                        </button>
                                        <button onClick={() => setBookingType('Instant')} className={`flex-1 p-2.5 rounded-xl border text-left transition-all ${bookingType === 'Instant' ? 'bg-[#ff4b9a]/5 border-[#ff4b9a] text-[#ff4b9a]' : 'bg-gray-50 border-transparent text-gray-500'}`}>
                                            <span className="block text-[10px] font-bold uppercase mb-0.5">Instant</span>
                                            <span className="text-[9px] opacity-80">Auto confirm</span>
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Cancellation</label>
                                    <select 
                                        value={mpSettings.policy} 
                                        onChange={e => setMpSettings({...mpSettings, policy: e.target.value as any})}
                                        className="w-full p-3 bg-gray-50 rounded-xl text-sm font-bold text-gray-900 border border-transparent focus:bg-white focus:border-[#ff4b9a] outline-none"
                                    >
                                        <option value="Flexible">Flexible (Full refund 1 day prior)</option>
                                        <option value="Moderate">Moderate (Full refund 5 days prior)</option>
                                        <option value="Strict">Strict (No refund)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Advanced Pricing Rules */}
                            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                <h4 className="text-xs font-bold text-gray-900 uppercase mb-4 flex items-center gap-2"><Tag size={14}/> Pricing Strategy</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Weekly Discount (%)</label>
                                        <input 
                                            type="number" 
                                            value={mpSettings.discounts.weekly} 
                                            onChange={e => setMpSettings({...mpSettings, discounts: {...mpSettings.discounts, weekly: parseInt(e.target.value) || 0}})}
                                            className="w-full p-2 bg-white rounded-lg text-sm font-bold border border-gray-200 focus:border-[#ff4b9a] outline-none"
                                            placeholder="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Monthly Discount (%)</label>
                                        <input 
                                            type="number" 
                                            value={mpSettings.discounts.monthly} 
                                            onChange={e => setMpSettings({...mpSettings, discounts: {...mpSettings.discounts, monthly: parseInt(e.target.value) || 0}})}
                                            className="w-full p-2 bg-white rounded-lg text-sm font-bold border border-gray-200 focus:border-[#ff4b9a] outline-none"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                                {(mpSettings.discounts.weekly > 0 || mpSettings.discounts.monthly > 0) && (
                                    <div className="mt-3 p-2 bg-green-50 rounded-lg flex items-center gap-2 text-[10px] font-bold text-green-700">
                                        <Percent size={12}/>
                                        <span>Guests save money on longer stays, boosting your occupancy.</span>
                                    </div>
                                )}
                            </div>

                            {/* House Rules */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-3">House Rules</label>
                                <div className="flex flex-wrap gap-2">
                                    {['No Smoking', 'No Pets', 'Couple Friendly', 'Parties Allowed', 'Self Check-in'].map(rule => {
                                        const active = mpSettings.rules.includes(rule);
                                        return (
                                            <button 
                                                key={rule}
                                                onClick={() => toggleRule(rule)}
                                                className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all ${active ? 'bg-[#2d1b4e] text-white border-[#2d1b4e]' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}
                                            >
                                                {active && <Check size={10} className="inline mr-1"/>}
                                                {rule}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Min Stay with Unit Selection */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Minimum Stay</label>
                                <div className="flex gap-3">
                                    <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                                        <button onClick={() => setMpSettings({...mpSettings, min_stay: Math.max(1, mpSettings.min_stay - 1)})} className="w-8 h-8 rounded-lg bg-white flex items-center justify-center hover:bg-gray-50 shadow-sm"><Minus size={14}/></button>
                                        <span className="text-sm font-bold text-gray-900 w-8 text-center">{mpSettings.min_stay}</span>
                                        <button onClick={() => setMpSettings({...mpSettings, min_stay: mpSettings.min_stay + 1})} className="w-8 h-8 rounded-lg bg-white flex items-center justify-center hover:bg-gray-50 shadow-sm"><Plus size={14}/></button>
                                    </div>
                                    <div className="relative flex-1">
                                        <select 
                                            value={mpSettings.min_stay_unit || 'Day'} 
                                            onChange={e => setMpSettings({...mpSettings, min_stay_unit: e.target.value as any})}
                                            className="w-full h-full bg-gray-100 rounded-lg px-3 text-sm font-bold text-gray-900 border-transparent focus:bg-white focus:border-[#ff4b9a] appearance-none"
                                        >
                                            <option value="Day">Days</option>
                                            <option value="Week">Weeks</option>
                                            <option value="Month">Months</option>
                                        </select>
                                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"/>
                                    </div>
                                </div>
                            </div>

                            <div className="p-3 bg-blue-50 rounded-xl flex items-start gap-3">
                                <Sparkles size={16} className="text-blue-600 mt-0.5"/>
                                <p className="text-xs text-blue-800 leading-relaxed">
                                    <strong>Pro Tip:</strong> Add high-quality photos after saving to boost visibility by 3x.
                                </p>
                            </div>
                        </div>
                    )}
                </section>
            </div>

            {/* Bottom Actions */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 z-30 flex justify-center safe-bottom">
                <div className="max-w-3xl w-full flex gap-3">
                    <button onClick={() => navigate(-1)} className="flex-1 py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="flex-[2] py-4 bg-[#2d1b4e] text-white font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2 hover:bg-[#3a2366] active:scale-95 transition-all">
                        <Save size={20}/> Save Asset
                    </button>
                </div>
            </div>
        </div>
    );
};

// Helper for Facilities Icons
const FlameIcon = ({size, className}: any) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>;

export default Inventory;
