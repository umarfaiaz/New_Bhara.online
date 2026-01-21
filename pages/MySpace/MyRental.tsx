
import React, { useState } from 'react';
import { FileText, MapPin, Calendar, Phone, Shield, Download, User, Home, Car, Camera, ChevronRight, X, Briefcase, Zap, Droplets, Gauge } from 'lucide-react';
import { DataService } from '../../services/mockData';
import { Tenant, AssetType, Building, Flat, Vehicle, Gadget } from '../../types';

const MyRental: React.FC = () => {
    // Get all rentals for the current user
    const rentals = DataService.getMyRentals();
    const [selectedRental, setSelectedRental] = useState<Tenant | null>(null);

    const getIcon = (type: AssetType) => {
        switch(type) {
            case 'Vehicle': return <Car size={24} className="text-white"/>;
            case 'Gadget': return <Camera size={24} className="text-white"/>;
            default: return <Home size={24} className="text-white"/>;
        }
    };

    const getGradient = (type: AssetType) => {
        switch(type) {
            case 'Vehicle': return 'bg-gradient-to-br from-indigo-500 to-purple-600';
            case 'Gadget': return 'bg-gradient-to-br from-orange-500 to-red-500';
            default: return 'bg-gradient-to-br from-blue-500 to-cyan-500';
        }
    };

    // If specific rental selected, show details
    if (selectedRental) {
        return <RentalDetailView rental={selectedRental} onBack={() => setSelectedRental(null)} />;
    }

    return (
        <div className="p-6 pb-32 space-y-6 bg-gray-50 min-h-screen">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">My Rentals</h2>
                <p className="text-sm text-gray-500">Manage your active subscriptions</p>
            </div>

            <div className="space-y-4">
                {rentals.map(rental => (
                    <div 
                        key={rental.id} 
                        onClick={() => setSelectedRental(rental)}
                        className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm cursor-pointer active:scale-[0.98] transition-all hover:shadow-md"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${getGradient(rental.asset_type)}`}>
                                {getIcon(rental.asset_type)}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-900 text-lg">{rental.asset_info?.name}</h3>
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{rental.asset_info?.sub_text}</p>
                            </div>
                            <div className="bg-gray-50 p-2 rounded-full">
                                <ChevronRight size={20} className="text-gray-400"/>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-xs">
                            <span className="font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">Active Lease</span>
                            <span className="text-gray-400">Since {new Date(rental.start_date).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- Detail View Component ---
const RentalDetailView: React.FC<{ rental: Tenant, onBack: () => void }> = ({ rental, onBack }) => {
    // Fetch detailed asset data based on type
    let assetDetails: any = null;
    let buildingDetails: Building | undefined;

    if (rental.asset_type === 'Residential') {
        assetDetails = DataService.getFlats().find(f => f.id === rental.asset_id);
        buildingDetails = DataService.getBuildings().find(b => b.id === assetDetails?.building_id);
    } else if (rental.asset_type === 'Vehicle') {
        assetDetails = DataService.getVehicles().find(v => v.id === rental.asset_id);
    } else if (rental.asset_type === 'Gadget') {
        assetDetails = DataService.getGadgets().find(g => g.id === rental.asset_id);
    }

    if (!assetDetails) return <div className="p-5">Error loading asset details. <button onClick={onBack}>Back</button></div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-32 animate-in slide-in-from-right duration-300">
            {/* Header Image Area */}
            <div className="relative h-64 bg-gray-900">
                <img 
                    src={assetDetails.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2'} 
                    className="w-full h-full object-cover opacity-60"
                />
                <button onClick={onBack} className="absolute top-6 left-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-gray-900 transition-all z-10">
                    <X size={20}/>
                </button>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-gray-900 to-transparent">
                    <span className="text-xs font-bold text-white/80 bg-white/10 backdrop-blur-sm px-2 py-1 rounded-md uppercase tracking-wider mb-2 inline-block">
                        {rental.asset_type} Rental
                    </span>
                    <h1 className="text-3xl font-bold text-white">{rental.asset_info?.name}</h1>
                    <p className="text-white/80 text-sm mt-1 flex items-center gap-1">
                        <MapPin size={14}/> {rental.asset_info?.sub_text}
                    </p>
                </div>
            </div>

            <div className="p-6 -mt-6 rounded-t-3xl bg-gray-50 relative z-10 space-y-6">
                
                {/* Specific Asset Stats */}
                <div className="grid grid-cols-2 gap-4">
                     <div className="bg-white p-4 rounded-2xl shadow-sm">
                         <p className="text-[10px] font-bold text-gray-400 uppercase">Rent Amount</p>
                         <p className="text-lg font-extrabold text-gray-900">৳ {rental.asset_type === 'Residential' ? assetDetails.monthly_rent?.toLocaleString() : assetDetails.rates?.['Monthly']?.toLocaleString() || assetDetails.rates?.['Daily']?.toLocaleString()}</p>
                         <p className="text-[10px] text-gray-400">per month</p>
                     </div>
                     <div className="bg-white p-4 rounded-2xl shadow-sm">
                         <p className="text-[10px] font-bold text-gray-400 uppercase">Next Due</p>
                         <p className="text-lg font-extrabold text-[#ff4b9a]">05 Oct</p>
                         <p className="text-[10px] text-gray-400">2023</p>
                     </div>
                </div>

                {/* Conditional Specs */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-sm font-bold text-gray-900 mb-4">Specifications</h3>
                    
                    {rental.asset_type === 'Residential' && (
                        <div className="space-y-4">
                            <div className="flex justify-between border-b border-gray-50 pb-2">
                                <span className="text-xs text-gray-500">Size</span>
                                <span className="text-sm font-bold text-gray-900">{assetDetails.size_sqft} sqft</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-50 pb-2">
                                <span className="text-xs text-gray-500">Floor</span>
                                <span className="text-sm font-bold text-gray-900">{assetDetails.floor_no}</span>
                            </div>
                            <div className="flex justify-between items-center pt-1">
                                <span className="text-xs text-gray-500">Utilities</span>
                                <div className="flex gap-2">
                                    {assetDetails.has_gas && <div className="p-1.5 bg-red-50 text-red-500 rounded-lg"><Zap size={14}/></div>}
                                    <div className="p-1.5 bg-blue-50 text-blue-500 rounded-lg"><Droplets size={14}/></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {rental.asset_type === 'Vehicle' && (
                        <div className="space-y-4">
                             <div className="flex justify-between border-b border-gray-50 pb-2">
                                <span className="text-xs text-gray-500">Model Year</span>
                                <span className="text-sm font-bold text-gray-900">{assetDetails.model_year || '2018'}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-50 pb-2">
                                <span className="text-xs text-gray-500">License Plate</span>
                                <span className="text-sm font-bold text-gray-900">{assetDetails.license_plate}</span>
                            </div>
                            <div className="flex justify-between items-center pt-1">
                                <span className="text-xs text-gray-500">Fuel Type</span>
                                <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded text-gray-700">{assetDetails.fuel_type}</span>
                            </div>
                        </div>
                    )}

                    {rental.asset_type === 'Gadget' && (
                        <div className="space-y-4">
                             <div className="flex justify-between border-b border-gray-50 pb-2">
                                <span className="text-xs text-gray-500">Brand</span>
                                <span className="text-sm font-bold text-gray-900">{assetDetails.brand}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-50 pb-2">
                                <span className="text-xs text-gray-500">Model</span>
                                <span className="text-sm font-bold text-gray-900">{assetDetails.model}</span>
                            </div>
                             <div className="flex justify-between border-b border-gray-50 pb-2">
                                <span className="text-xs text-gray-500">Serial No</span>
                                <span className="text-sm font-bold text-gray-900">{assetDetails.serial_no || 'N/A'}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Owner Contact */}
                <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">Owner Contact</h4>
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center">
                                <User size={20}/>
                            </div>
                            <div>
                                <p className="font-bold text-sm text-gray-900">{buildingDetails?.caretaker_name || 'Owner'}</p>
                                <p className="text-xs text-gray-500">{buildingDetails?.caretaker_phone || '01700000000'}</p>
                            </div>
                        </div>
                        <button onClick={() => window.open('tel:123')} className="bg-green-50 text-green-600 p-2.5 rounded-xl hover:bg-green-100 transition-colors">
                            <Phone size={20}/>
                        </button>
                    </div>
                </div>
                
                 {/* Documents */}
                 <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">Legal</h4>
                    <button className="w-full bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-3 hover:bg-gray-50 transition-colors shadow-sm">
                        <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
                            <FileText size={20}/>
                        </div>
                        <div className="flex-1 text-left">
                            <p className="font-bold text-sm text-gray-900">Agreement.pdf</p>
                            <p className="text-[10px] text-gray-400">Signed on {rental.start_date}</p>
                        </div>
                        <Download size={18} className="text-gray-400"/>
                    </button>
                </div>

            </div>
        </div>
    );
};

export default MyRental;
