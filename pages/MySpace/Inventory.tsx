
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import { Plus, MapPin, Building2, Car, Camera, ChevronRight, ChevronLeft, Layers, CheckCircle2, LayoutGrid, DollarSign, BedDouble, Bath, Globe, MessageCircle, Home, Image as ImageIcon, X, User } from 'lucide-react';
import { DataService } from '../../services/mockData';
import { CITIES, AREAS } from '../../constants';
import { Building, Flat, AssetType, Vehicle, Gadget, ServiceAsset, BaseAsset } from '../../types';

// --- Reusable UI Components ---

const Header: React.FC<{ 
    title: string; 
    subtitle?: string; 
    showBack?: boolean; 
    onBack?: () => void;
    action?: React.ReactNode;
}> = ({ title, subtitle, showBack, onBack, action }) => {
    const navigate = useNavigate();
    return (
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 px-5 py-4 flex items-center justify-between transition-all">
            <div className="flex items-center gap-3">
                {showBack && (
                    <button 
                        onClick={onBack || (() => navigate(-1))} 
                        className="w-9 h-9 rounded-full bg-gray-50 hover:bg-gray-100 border border-transparent hover:border-gray-200 flex items-center justify-center text-gray-700 transition-all active:scale-95"
                    >
                        <ChevronLeft size={22} />
                    </button>
                )}
                <div>
                    <h1 className="text-lg font-bold text-gray-900 leading-tight">{title}</h1>
                    {subtitle && <p className="text-xs text-gray-500 font-medium">{subtitle}</p>}
                </div>
            </div>
            {action}
        </div>
    );
};

const InputGroup: React.FC<{ label: string, children: React.ReactNode, optional?: boolean }> = ({ label, children, optional }) => (
    <div>
        <label className="text-xs font-bold text-gray-500 mb-1.5 block flex justify-between">
            {label}
            {optional && <span className="text-[9px] text-gray-400 font-normal uppercase">Optional</span>}
        </label>
        {children}
    </div>
);

const SectionHeading: React.FC<{ title: string, icon?: any }> = ({ title, icon: Icon }) => (
    <div className="flex items-center gap-2 pb-2 mb-4 border-b border-gray-100">
        {Icon && <Icon size={16} className="text-[#ff4b9a]" />}
        <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wide">{title}</h3>
    </div>
);

// --- LISTING EDITOR (MARKETING LAYER) ---

const ListingEditor: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { assetId, type, returnTo } = location.state || {};
    
    // Fetch internal item to pre-fill
    let internalItem: any;
    if (type === 'Vehicle') internalItem = DataService.getVehicleById(assetId);
    else if (type === 'Gadget') internalItem = DataService.getGadgetById(assetId);
    else if (type === 'Service') internalItem = DataService.getServiceById(assetId);
    else if (type === 'Flat') internalItem = DataService.getFlatById(assetId);
    else if (type === 'Building') internalItem = DataService.getBuildingById(assetId);

    useEffect(() => {
        if(!internalItem) navigate('/myspace/inventory');
    }, [internalItem]);

    if (!internalItem) return null;

    const [title, setTitle] = useState(internalItem.listing_title || internalItem.name || (type === 'Flat' ? `Flat ${internalItem.flat_no}` : ''));
    const [desc, setDesc] = useState(internalItem.listing_description || '');
    const [price, setPrice] = useState(internalItem.listing_price || internalItem.monthly_rent || internalItem.rates?.['Daily'] || 0);
    const [hideAddress, setHideAddress] = useState(internalItem.hide_exact_address || false);
    const [contactPrefs, setContactPrefs] = useState<BaseAsset['contact_preferences']>(internalItem.contact_preferences || ['chat', 'phone']);
    const [isListed, setIsListed] = useState(internalItem.is_listed || false);

    const handlePublish = (status: boolean) => {
        const updatedData = {
            listing_title: title,
            listing_description: desc,
            listing_price: price,
            hide_exact_address: hideAddress,
            contact_preferences: contactPrefs,
            is_listed: status
        };

        if (type === 'Flat') DataService.updateFlat(assetId, updatedData);
        else if (type === 'Vehicle') DataService.updateVehicle(assetId, updatedData);
        else if (type === 'Gadget') DataService.updateGadget(assetId, updatedData);
        else if (type === 'Service') DataService.updateService(assetId, updatedData);
        else if (type === 'Residential') DataService.updateBuilding(assetId, updatedData);

        DataService.toggleListing(assetId, type, status);
        navigate(returnTo || '/myspace/listings');
    };

    const toggleContactPref = (method: 'chat' | 'phone' | 'email') => {
        if (contactPrefs?.includes(method)) {
            setContactPrefs(contactPrefs.filter(c => c !== method));
        } else {
            setContactPrefs([...(contactPrefs || []), method]);
        }
    };

    return (
        <div className="fixed inset-0 bg-white z-[60] flex flex-col">
            <div className="bg-white px-5 py-4 border-b border-gray-100 flex justify-between items-center shadow-sm shrink-0">
                <div>
                    <h1 className="text-lg font-bold text-gray-900">Listing Editor</h1>
                    <p className="text-xs text-gray-500">Public appearance on Marketplace</p>
                </div>
                <button onClick={() => navigate(-1)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100"><X size={20}/></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                {/* Preview Banner */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-start gap-4">
                    <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center border border-gray-200 text-gray-300">
                        <ImageIcon size={24}/>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase mb-1">Internal Reference</p>
                        <h3 className="font-bold text-gray-900 text-sm">{internalItem.name || `Flat ${internalItem.flat_no}`}</h3>
                        <p className="text-xs text-gray-500">ID: {internalItem.id}</p>
                    </div>
                </div>

                <div className="space-y-5">
                    <SectionHeading title="Public Display Info" icon={Globe} />
                    <InputGroup label="Listing Title">
                        <input 
                            type="text" 
                            value={title} 
                            onChange={e => setTitle(e.target.value)} 
                            className="w-full p-3 bg-white border-2 border-gray-100 rounded-xl font-bold text-gray-900 focus:border-[#ff4b9a] outline-none transition-colors"
                            placeholder="e.g. Luxurious 3 Bed in Gulshan"
                        />
                        <p className="text-[10px] text-gray-400 mt-1">Catchy titles attract 30% more clicks.</p>
                    </InputGroup>

                    <InputGroup label="Description">
                        <textarea 
                            value={desc} 
                            onChange={e => setDesc(e.target.value)} 
                            rows={5} 
                            className="w-full p-3 bg-white border-2 border-gray-100 rounded-xl text-sm font-medium text-gray-900 focus:border-[#ff4b9a] outline-none transition-colors"
                            placeholder="Highlight features, nearby amenities, and rules..."
                        />
                    </InputGroup>

                    <div className="grid grid-cols-2 gap-4">
                        <InputGroup label="Public Price">
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-400">৳</span>
                                <input 
                                    type="number" 
                                    value={price} 
                                    onChange={e => setPrice(parseInt(e.target.value))} 
                                    className="w-full pl-7 p-3 bg-white border-2 border-gray-100 rounded-xl font-bold focus:border-[#ff4b9a] outline-none"
                                />
                            </div>
                        </InputGroup>
                        <div className="flex flex-col justify-end pb-3">
                            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setHideAddress(!hideAddress)}>
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${hideAddress ? 'bg-[#ff4b9a] border-[#ff4b9a]' : 'border-gray-300 bg-white'}`}>
                                    {hideAddress && <CheckCircle2 size={14} className="text-white"/>}
                                </div>
                                <span className="text-xs font-bold text-gray-600">Hide Exact Address</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-5">
                    <SectionHeading title="Communication" icon={MessageCircle} />
                    <p className="text-xs text-gray-500 -mt-3 mb-2">How should interested customers reach you?</p>
                    <div className="flex gap-2">
                        {(['chat', 'phone', 'email'] as const).map(method => (
                            <button
                                key={method}
                                onClick={() => toggleContactPref(method)}
                                className={`flex-1 py-3 rounded-xl border text-xs font-bold capitalize transition-all ${contactPrefs?.includes(method) ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-500 border-gray-200'}`}
                            >
                                {method}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="p-5 border-t border-gray-100 safe-bottom bg-white flex gap-3">
                <button onClick={() => handlePublish(false)} className="flex-1 py-4 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200">
                    Save as Draft
                </button>
                <button onClick={() => handlePublish(true)} className="flex-[2] py-4 bg-[#ff4b9a] text-white font-bold rounded-xl shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2">
                    <Globe size={18}/> {isListed ? 'Update Listing' : 'Publish Live'}
                </button>
            </div>
        </div>
    );
};

// --- INVENTORY CONFIGURATION PAGES (INTERNAL DATA) ---

const BuildingConfig: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as any || {};
    const { returnTo, isMarketplace, nextAction } = state;

    const [formData, setFormData] = useState<Partial<Building>>({
        name: '', type: 'Residential', city: 'Dhaka', area: '', address: '', 
        total_floors: 1, amenities: [], caretaker_name: '', caretaker_phone: ''
    });

    const handleSave = () => {
        if(formData.name && formData.area) {
            const newB = DataService.addBuilding(formData as Building);
            if (nextAction === 'addFlat') {
                navigate('/myspace/inventory/config-flat', { state: { buildingId: newB.id, returnTo } });
            } else if (isMarketplace) {
                navigate('/myspace/inventory/config-flat', { state: { buildingId: newB.id, returnTo, isMarketplace } });
            } else {
                navigate(returnTo || '/myspace/inventory');
            }
        } else {
            alert("Please fill in Name and Area");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header title="Add Building" subtitle="Internal Configuration" showBack onBack={() => navigate(-1)} />
            <div className="flex-1 p-6 space-y-8 overflow-y-auto">
                <div className="space-y-4">
                    <SectionHeading title="General Info" icon={Building2} />
                    <InputGroup label="Property Name">
                        <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 rounded-xl bg-white border border-gray-200 font-bold outline-none focus:border-[#ff4b9a]" placeholder="e.g. Dream Heights"/>
                    </InputGroup>
                    <InputGroup label="Property Type">
                        <div className="flex bg-gray-200 p-1 rounded-xl">
                            {['Residential', 'Commercial'].map(t => (
                                <button 
                                    key={t}
                                    onClick={() => setFormData({...formData, type: t as AssetType})}
                                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${formData.type === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </InputGroup>
                </div>

                <div className="space-y-4">
                    <SectionHeading title="Location & Address" icon={MapPin} />
                    <div className="grid grid-cols-2 gap-4">
                        <InputGroup label="City"><select value={formData.city} onChange={e => setFormData({...formData, city: e.target.value, area: ''})} className="w-full p-3 rounded-xl bg-white border border-gray-200 font-bold outline-none">{CITIES.map(c => <option key={c} value={c}>{c}</option>)}</select></InputGroup>
                        <InputGroup label="Area"><select value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} className="w-full p-3 rounded-xl bg-white border border-gray-200 font-bold outline-none"><option value="" disabled>Select Area</option>{(AREAS[formData.city || 'Dhaka'] || []).map(area => <option key={area} value={area}>{area}</option>)}</select></InputGroup>
                    </div>
                    <InputGroup label="Full Address">
                        <textarea value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full p-3 rounded-xl bg-white border border-gray-200 font-bold outline-none text-sm" placeholder="House #, Road #, Block..." rows={2}/>
                    </InputGroup>
                </div>

                <div className="space-y-4">
                    <SectionHeading title="Structure & Management" icon={Layers} />
                    <div className="grid grid-cols-2 gap-4">
                        <InputGroup label="Total Floors">
                            <input type="number" value={formData.total_floors} onChange={e => setFormData({...formData, total_floors: parseInt(e.target.value)})} className="w-full p-3 rounded-xl bg-white border border-gray-200 font-bold outline-none" />
                        </InputGroup>
                        <InputGroup label="Total Units" optional>
                            <input type="number" placeholder="Auto-calc" disabled className="w-full p-3 rounded-xl bg-gray-100 border border-gray-200 font-bold outline-none text-gray-400" />
                        </InputGroup>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <InputGroup label="Caretaker Name" optional>
                            <input type="text" value={formData.caretaker_name} onChange={e => setFormData({...formData, caretaker_name: e.target.value})} className="w-full p-3 rounded-xl bg-white border border-gray-200 font-bold outline-none" />
                        </InputGroup>
                        <InputGroup label="Caretaker Phone" optional>
                            <input type="tel" value={formData.caretaker_phone} onChange={e => setFormData({...formData, caretaker_phone: e.target.value})} className="w-full p-3 rounded-xl bg-white border border-gray-200 font-bold outline-none" />
                        </InputGroup>
                    </div>
                </div>

                <div className="p-5 bg-white border-t border-gray-100 safe-bottom">
                    <button onClick={handleSave} className="w-full py-4 bg-[#2d1b4e] text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-transform">
                        {isMarketplace || nextAction ? 'Save & Add Units' : 'Create Building'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const FlatConfig: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as any || {};
    const { buildingId, editId, returnTo, isMarketplace } = state;

    const [formData, setFormData] = useState<Partial<Flat>>(
        editId ? DataService.getFlatById(editId)! : {
            flat_no: '', floor_no: 1, size_sqft: 1000, bedrooms: 3, washrooms: 2, 
            monthly_rent: 20000, rent_type: 'Monthly', 
            service_charge: 3000, water_bill: 500, gas_bill: 1000, electricity_bill: 0,
            building_id: buildingId, additional_charges: []
        }
    );

    const handleSave = () => {
        if (formData.flat_no && buildingId) {
            let newItem: Flat;
            if (editId) { DataService.updateFlat(editId, formData); newItem = DataService.getFlatById(editId)!; } 
            else { newItem = DataService.addFlat({ ...formData, building_id: buildingId }); }
            
            if (isMarketplace) {
                navigate('/myspace/inventory/listing-editor', { state: { assetId: newItem.id, type: 'Flat', returnTo: '/marketplace' } });
            } else if (returnTo) {
                navigate(returnTo, { state: { selectedNewId: newItem.id, type: 'Flat' } });
            } else {
                navigate(`/myspace/inventory/manage-flats/${buildingId}`);
            }
        } else {
            alert("Flat No and Building are required.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header title={editId ? `Edit Flat ${formData.flat_no}` : `Add New Unit`} subtitle="Internal Configuration" showBack onBack={() => navigate(-1)} />
            <div className="flex-1 p-6 space-y-8 overflow-y-auto">
                <div className="space-y-4">
                    <SectionHeading title="Unit Identification" icon={Home} />
                    <div className="grid grid-cols-2 gap-4">
                        <InputGroup label="Flat No / Name"><input type="text" value={formData.flat_no} onChange={e => setFormData({...formData, flat_no: e.target.value})} className="w-full p-3 rounded-xl bg-white border border-gray-200 font-bold outline-none placeholder:font-normal" placeholder="e.g. 4A"/></InputGroup>
                        <InputGroup label="Floor Level"><input type="number" value={formData.floor_no} onChange={e => setFormData({...formData, floor_no: parseInt(e.target.value)})} className="w-full p-3 rounded-xl bg-white border border-gray-200 font-bold outline-none"/></InputGroup>
                    </div>
                </div>

                <div className="space-y-4">
                    <SectionHeading title="Specifications" icon={LayoutGrid} />
                    <div className="grid grid-cols-3 gap-3">
                         <InputGroup label="Size (sqft)"><input type="number" value={formData.size_sqft} onChange={e => setFormData({...formData, size_sqft: parseInt(e.target.value)})} className="w-full p-3 rounded-xl bg-white border border-gray-200 font-bold outline-none"/></InputGroup>
                        <InputGroup label="Bedrooms"><input type="number" value={formData.bedrooms} onChange={e => setFormData({...formData, bedrooms: parseInt(e.target.value)})} className="w-full p-3 rounded-xl bg-white border border-gray-200 font-bold outline-none"/></InputGroup>
                        <InputGroup label="Bathrooms"><input type="number" value={formData.washrooms} onChange={e => setFormData({...formData, washrooms: parseInt(e.target.value)})} className="w-full p-3 rounded-xl bg-white border border-gray-200 font-bold outline-none"/></InputGroup>
                    </div>
                </div>

                <div className="space-y-4">
                    <SectionHeading title="Financials & Presets" icon={DollarSign} />
                    <p className="text-[10px] text-gray-500 -mt-3 mb-2">These amounts will automatically appear on monthly bills.</p>
                    <div className="grid grid-cols-2 gap-4">
                        <InputGroup label="Base Rent">
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-400">৳</span>
                                <input type="number" value={formData.monthly_rent} onChange={e => setFormData({...formData, monthly_rent: parseInt(e.target.value)})} className="w-full pl-7 p-3 rounded-xl bg-white border border-gray-200 font-bold outline-none focus:border-[#ff4b9a]"/>
                            </div>
                        </InputGroup>
                        <InputGroup label="Service Charge">
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-400">৳</span>
                                <input type="number" value={formData.service_charge} onChange={e => setFormData({...formData, service_charge: parseInt(e.target.value)})} className="w-full pl-7 p-3 rounded-xl bg-white border border-gray-200 font-bold outline-none"/>
                            </div>
                        </InputGroup>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <InputGroup label="Water Bill (Fixed)">
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-400">৳</span>
                                <input type="number" value={formData.water_bill} onChange={e => setFormData({...formData, water_bill: parseInt(e.target.value)})} className="w-full pl-7 p-3 rounded-xl bg-white border border-gray-200 font-bold outline-none"/>
                            </div>
                        </InputGroup>
                        <InputGroup label="Gas Bill (Fixed)">
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-400">৳</span>
                                <input type="number" value={formData.gas_bill} onChange={e => setFormData({...formData, gas_bill: parseInt(e.target.value)})} className="w-full pl-7 p-3 rounded-xl bg-white border border-gray-200 font-bold outline-none"/>
                            </div>
                        </InputGroup>
                    </div>
                </div>
            </div>
            <div className="p-5 bg-white border-t border-gray-100 safe-bottom">
                <button onClick={handleSave} className="w-full py-4 bg-[#2d1b4e] text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-transform">
                    {isMarketplace ? 'Save & Continue to Listing' : (editId ? 'Update Unit' : 'Add Unit')}
                </button>
            </div>
        </div>
    );
};

const VehicleConfig: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as any || {};
    const { editId, returnTo, isMarketplace } = state;

    const [formData, setFormData] = useState<Partial<Vehicle>>(
        editId ? DataService.getVehicleById(editId)! : {
            name: '', license_plate: '', type: 'Car', seats: 4, fuel_type: 'CNG', transmission: 'Auto',
            rates: { 'Daily': 3000, 'Monthly': 45000 }, status: 'active', is_driver_included: false,
            additional_charges: []
        }
    );

    const handleSave = () => {
        if(formData.name && formData.license_plate) {
            let newItem: Vehicle;
            if(editId) { DataService.updateVehicle(editId, formData); newItem = DataService.getVehicleById(editId)!; } 
            else { newItem = DataService.addVehicle(formData as Vehicle); }
            
            if (isMarketplace) {
                navigate('/myspace/inventory/listing-editor', { state: { assetId: newItem.id, type: 'Vehicle', returnTo: '/marketplace' } });
            } else if (returnTo) {
                navigate(returnTo, { state: { selectedNewId: newItem.id, type: 'Vehicle' } });
            } else {
                navigate('/myspace/inventory');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header title={editId ? "Edit Vehicle" : "Add Vehicle"} subtitle="Internal Tracking" showBack />
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                     <InputGroup label="Vehicle Name"><input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 font-bold outline-none" placeholder="e.g. Toyota Axio 2018"/></InputGroup>
                    <InputGroup label="License Plate"><input type="text" value={formData.license_plate} onChange={e => setFormData({...formData, license_plate: e.target.value})} className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 font-bold outline-none" placeholder="DHA-MET-GA-..."/></InputGroup>
                    <div className="grid grid-cols-2 gap-4">
                         <InputGroup label="Type"><select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 font-bold outline-none"><option>Car</option><option>Bike</option><option>Truck</option><option>Bus</option></select></InputGroup>
                        <InputGroup label="Transmission"><select value={formData.transmission} onChange={e => setFormData({...formData, transmission: e.target.value as any})} className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 font-bold outline-none"><option>Auto</option><option>Manual</option></select></InputGroup>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                    <h3 className="font-bold text-gray-900">Standard Rates</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <InputGroup label="Daily"><input type="number" value={formData.rates?.['Daily'] || ''} onChange={e => setFormData(prev => ({...prev, rates: { ...prev.rates, 'Daily': parseInt(e.target.value) || 0 }}))} className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 font-bold outline-none"/></InputGroup>
                        <InputGroup label="Monthly"><input type="number" value={formData.rates?.['Monthly'] || ''} onChange={e => setFormData(prev => ({...prev, rates: { ...prev.rates, 'Monthly': parseInt(e.target.value) || 0 }}))} className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 font-bold outline-none"/></InputGroup>
                    </div>
                </div>
            </div>
            <div className="p-5 bg-white border-t border-gray-100 safe-bottom">
                <button onClick={handleSave} className="w-full py-4 bg-[#2d1b4e] text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-transform">{isMarketplace ? 'Save & Create Listing' : 'Save Asset'}</button>
            </div>
        </div>
    );
};

const GadgetConfig: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as any || {};
    const { editId, category = 'Electronics', returnTo, isMarketplace } = state;

    const [formData, setFormData] = useState<Partial<Gadget>>(
        editId ? DataService.getGadgetById(editId)! : {
            name: '', brand: '', model: '', category: category, rates: { 'Daily': 1000 }, status: 'active',
            additional_charges: []
        }
    );

    const handleSave = () => {
        if(formData.name) {
             let newItem: Gadget;
             if(editId) { DataService.updateGadget(editId, formData); newItem = DataService.getGadgetById(editId)!; } 
             else { newItem = DataService.addGadget(formData as Gadget); }

             if (isMarketplace) {
                navigate('/myspace/inventory/listing-editor', { state: { assetId: newItem.id, type: 'Gadget', returnTo: '/marketplace' } });
             } else if (returnTo) {
                 navigate(returnTo, { state: { selectedNewId: newItem.id, type: 'Gadget' } });
             } else {
                 navigate('/myspace/inventory');
             }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header title={editId ? `Edit ${category}` : `Add ${category}`} showBack />
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                     <InputGroup label="Item Name">
                        <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 font-bold outline-none" placeholder={`e.g. ${category === 'Furniture' ? 'Teak Sofa' : 'Sony Camera'}`}/>
                    </InputGroup>
                    <div className="grid grid-cols-2 gap-4">
                        <InputGroup label="Brand"><input type="text" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 font-bold outline-none"/></InputGroup>
                        <InputGroup label="Model"><input type="text" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 font-bold outline-none"/></InputGroup>
                    </div>
                </div>
            </div>
            <div className="p-5 bg-white border-t border-gray-100 safe-bottom">
                <button onClick={handleSave} className="w-full py-4 bg-[#2d1b4e] text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-transform">{isMarketplace ? 'Save & Create Listing' : 'Save Asset'}</button>
            </div>
        </div>
    );
};

const ServiceConfig: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as any || {};
    const { editId, returnTo, isMarketplace } = state;

    const [formData, setFormData] = useState<Partial<ServiceAsset>>(
        editId ? DataService.getServiceById(editId)! : {
            name: '', type: 'Professional', category: 'Photographer', rates: { 'Daily': 5000 }, status: 'active', description: '',
            additional_charges: []
        }
    );

    const handleSave = () => {
        if(formData.name) {
             let newItem: ServiceAsset;
             if(editId) { DataService.updateService(editId, formData); newItem = DataService.getServiceById(editId)!; } 
             else { newItem = DataService.addService(formData as ServiceAsset); }

             if (isMarketplace) {
                navigate('/myspace/inventory/listing-editor', { state: { assetId: newItem.id, type: 'Service', returnTo: '/marketplace' } });
             } else if (returnTo) {
                 navigate(returnTo, { state: { selectedNewId: newItem.id, type: 'Service' } });
             } else {
                 navigate('/myspace/inventory');
             }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header title={editId ? "Edit Service" : "Add Service"} showBack />
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                     <InputGroup label="Service Title / Name"><input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 font-bold outline-none" placeholder="e.g. Wedding Photography"/></InputGroup>
                    <div className="grid grid-cols-2 gap-4">
                        <InputGroup label="Type"><select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})} className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 font-bold outline-none"><option>Professional</option><option>Service</option><option>Event Space</option></select></InputGroup>
                        <InputGroup label="Category"><input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 font-bold outline-none"/></InputGroup>
                    </div>
                </div>
            </div>
            <div className="p-5 bg-white border-t border-gray-100 safe-bottom">
                <button onClick={handleSave} className="w-full py-4 bg-[#2d1b4e] text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-transform">{isMarketplace ? 'Save & Create Listing' : 'Save Asset'}</button>
            </div>
        </div>
    );
};

// --- Page Layout & Routes ---

const AssetList: React.FC = () => {
  const navigate = useNavigate();
  const [buildings, setBuildings] = useState<Building[]>(DataService.getBuildings());
  const [vehicles, setVehicles] = useState<Vehicle[]>(DataService.getVehicles());
  const [gadgets, setGadgets] = useState<Gadget[]>(DataService.getGadgets());
  const [services, setServices] = useState<ServiceAsset[]>(DataService.getServices());

  const [activeTab, setActiveTab] = useState<'All' | 'Listed' | 'Property' | 'Vehicle' | 'Gadget' | 'Service'>('All');

  const isListedFilter = activeTab === 'Listed';

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-32">
      <Header 
        title="Inventory" 
        subtitle="Internal Asset Database"
        action={
            <button onClick={() => navigate('select-type')} className="flex items-center gap-2 bg-[#2d1b4e] text-white px-4 py-2 rounded-xl shadow-[0_4px_14px_rgba(45,27,78,0.3)] active:scale-95 transition-all">
                <Plus size={18} strokeWidth={2.5} /> <span className="text-xs font-bold">Add</span>
            </button>
        }
      />
      
      <div className="px-5 py-2 flex gap-2 overflow-x-auto scrollbar-hide">
          {['All', 'Listed', 'Property', 'Vehicle', 'Gadget', 'Service'].map(tab => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab as any)} 
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${activeTab === tab ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}
              >
                  {tab}
              </button>
          ))}
      </div>

      <div className="p-5 space-y-4">
          {(activeTab === 'All' || activeTab === 'Property' || (isListedFilter)) && buildings.filter(b => isListedFilter ? b.is_listed : true).map(b => (
              <div key={b.id} onClick={() => navigate(`manage-flats/${b.id}`)} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 cursor-pointer active:scale-[0.99] transition-transform">
                  <div className="flex justify-between items-start">
                      <div className="flex gap-4">
                          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                              <Building2 size={24} />
                          </div>
                          <div>
                              <h3 className="font-bold text-gray-900">{b.name}</h3>
                              <p className="text-xs text-gray-500">{b.type} • {b.area}</p>
                              <p className="text-[10px] text-gray-400 mt-1">{b.address}</p>
                              <div className="flex gap-2 mt-2">
                                  <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded font-bold text-gray-600">{b.flat_count} Units</span>
                                  <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded font-bold text-gray-600">{b.total_floors} Floors</span>
                              </div>
                          </div>
                      </div>
                      <ChevronRight size={20} className="text-gray-300" />
                  </div>
              </div>
          ))}

          {(activeTab === 'All' || activeTab === 'Vehicle' || (isListedFilter)) && vehicles.filter(v => isListedFilter ? v.is_listed : true).map(v => (
              <div key={v.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4">
                  <div className="flex justify-between items-start cursor-pointer" onClick={() => navigate(`config-vehicle`, { state: { editId: v.id } })}>
                        <div className="flex gap-4">
                            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                <Car size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">{v.name}</h3>
                                <p className="text-xs text-gray-500">{v.type} • {v.license_plate}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold inline-block ${v.status === 'rented' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}>
                                        {v.status === 'rented' ? 'Rented' : 'Available'}
                                    </span>
                                </div>
                            </div>
                        </div>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); navigate('/myspace/inventory/listing-editor', { state: { assetId: v.id, type: 'Vehicle' } }) }}
                    className={`w-full py-2 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors ${v.is_listed ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                      {v.is_listed ? <><Globe size={14}/> Manage Listing</> : <><Plus size={14}/> Create Listing</>}
                  </button>
              </div>
          ))}
          
      </div>
    </div>
  );
};

const SelectType: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const returnTo = (location.state as any)?.returnTo;
    const isMarketplace = (location.state as any)?.isMarketplace;

    const navigateToConfig = (path: string, state: any = {}) => {
        navigate(path, { state: { returnTo, isMarketplace, ...state } });
    };

    const categories = [
        { label: 'Real Estate', sub: 'Flat, Garage, Office', icon: Building2, path: '/myspace/inventory/config-building', color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Vehicles', sub: 'Car, Bike, Truck', icon: Car, path: '/myspace/inventory/config-vehicle', color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Electronics', sub: 'Camera, Drone, PC', icon: Camera, path: '/myspace/inventory/config-gadget', color: 'text-purple-600', bg: 'bg-purple-50', category: 'Electronics' },
        { label: 'Services', sub: 'Driver, Maid, Cook', icon: User, path: '/myspace/inventory/config-service', color: 'text-green-600', bg: 'bg-green-50', type: 'Professional' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header 
                title={isMarketplace ? "Post an Ad" : "Add New Asset"} 
                showBack 
                onBack={() => returnTo ? navigate(returnTo) : navigate(-1)}
            />
            <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">{isMarketplace ? 'What do you want to list?' : 'What do you want to add?'}</h2>
                <div className="grid grid-cols-2 gap-4">
                    {categories.map((cat, i) => (
                        <button 
                            key={i} 
                            onClick={() => navigateToConfig(cat.path, { category: cat.category, type: cat.type })} 
                            className="bg-white p-5 rounded-[1.5rem] border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center gap-3 hover:border-[#ff4b9a]/30 hover:shadow-md transition-all active:scale-95 group"
                        >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${cat.bg} ${cat.color} group-hover:scale-110 transition-transform`}>
                                <cat.icon size={28}/>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 leading-tight">{cat.label}</h3>
                                <p className="text-[10px] text-gray-400 mt-1">{cat.sub}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

const ManageFlats: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const building = DataService.getBuildingById(id || '');
    const [flats, setFlats] = useState<Flat[]>([]);

    useEffect(() => { setFlats(DataService.getFlats(id)); }, [id]);

    if (!building) return <div>Building not found</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header title={building.name} subtitle={`${building.flat_count} Units • ${building.area}`} showBack action={
                <button onClick={() => navigate('/myspace/inventory/config-flat', { state: { buildingId: id } })} className="flex items-center gap-2 bg-[#2d1b4e] text-white px-4 py-2 rounded-xl shadow-lg active:scale-95 transition-all"><Plus size={18} strokeWidth={2.5} /> <span className="text-xs font-bold">Add Unit</span></button>
            }/>
            <div className="flex-1 p-5 overflow-y-auto space-y-4 pb-24">
                {flats.map(flat => (
                     <div key={flat.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-[#ff4b9a]">
                        <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/myspace/inventory/config-flat', { state: { editId: flat.id, buildingId: id } })}>
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${flat.is_vacant ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>{flat.flat_no}</div>
                            <div>
                                <div className="flex items-center gap-2"><h4 className="font-bold text-gray-900 text-sm">Floor {flat.floor_no}</h4></div>
                                <p className="text-xs text-gray-500 mt-0.5">{flat.size_sqft} sqft • {flat.bedrooms} Bed</p>
                            </div>
                        </div>
                        <div className="text-right flex flex-col items-end gap-2">
                            <p className="font-bold text-gray-900 text-sm">৳ {flat.monthly_rent}</p>
                            <button 
                                onClick={(e) => { e.stopPropagation(); navigate('/myspace/inventory/listing-editor', { state: { assetId: flat.id, type: 'Flat' } }); }} 
                                className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-colors flex items-center gap-1 ${flat.is_listed ? 'bg-[#ff4b9a]/10 text-[#ff4b9a]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                {flat.is_listed ? <><Globe size={10}/> Listed</> : <><Plus size={12}/> List</>}
                            </button>
                        </div>
                     </div>
                ))}
            </div>
        </div>
    );
};

const Inventory: React.FC = () => {
  return (
    <Routes>
      <Route index element={<AssetList />} />
      <Route path="select-type" element={<SelectType />} />
      <Route path="config-building" element={<BuildingConfig />} />
      <Route path="manage-flats/:id" element={<ManageFlats />} />
      <Route path="config-flat" element={<FlatConfig />} />
      <Route path="config-vehicle" element={<VehicleConfig />} />
      <Route path="config-gadget" element={<GadgetConfig />} />
      <Route path="config-service" element={<ServiceConfig />} />
      <Route path="listing-editor" element={<ListingEditor />} />
    </Routes>
  );
};

export default Inventory;
