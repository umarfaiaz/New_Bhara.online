
import { 
  User, Asset, Tenant, Bill, MaintenanceRequest, 
  ChatSession, ChatMessage, AssetType 
} from '../types';

// Mock Data Storage
let currentUser: User = {
  id: 'u1',
  name: 'Rafiqul Islam',
  email: 'rafiq@example.com',
  phone: '01711223344',
  role: 'lender',
  plan: 'Pro',
  smsBalance: 45,
  joinDate: '2023-01-15',
  wishlist: ['a2', 'a3'],
  avatar: 'https://i.pravatar.cc/150?u=u1'
};

const otherUsers: User[] = [
    { id: 'u2', name: 'Sadia Rahman', email: 'sadia@test.com', phone: '01900000001', role: 'renter', plan: 'Free', smsBalance: 0, joinDate: '2023-05-20', avatar: 'https://i.pravatar.cc/150?u=t1' }
];

const assets: any[] = [
    // Building
    {
        id: 'a1', ownerId: 'u1', name: 'Green View Tower', category: 'Residential', type: 'Building', 
        status: 'Active', availability: 'Available', location: { district: 'Dhaka', area: 'Uttara', address: 'Sector 4' },
        rentConfig: { allowedTypes: ['Monthly'], rates: { Monthly: 0 } },
        charges: { serviceCharge: 3000 }, images: [], tags: [], created_at: '2023-01-01',
        totalFloors: 6, totalUnits: 12, facilities: { lift: true, generator: true, cctv: true },
        is_listed: false
    },
    // Flat (Unit)
    {
        id: 'a2', ownerId: 'u1', parentId: 'a1', name: 'Flat 4A', category: 'Residential', type: 'Unit',
        status: 'Active', availability: 'Booked', location: { district: 'Dhaka', area: 'Uttara' },
        rentConfig: { allowedTypes: ['Monthly'], rates: { Monthly: 25000 } },
        charges: { 
            serviceCharge: 3000, 
            gasFee: 1080,
            customCharges: [
                { name: 'Gym Fee', amount: 500 },
                { name: 'Security', amount: 200 }
            ]
        }, 
        images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800'], tags: [], created_at: '2023-01-01',
        unitNumber: '4A', floorNumber: 4, sizeSqft: 1250, bedrooms: 3, bathrooms: 3, balconies: 2,
        is_listed: true, listing_title: 'Luxury 3BR Flat in Uttara', booking_type: 'Request',
        marketplace_settings: { discounts: { weekly: 0, monthly: 5 }, policy: 'Moderate', rules: ['No Smoking'], min_stay: 6, min_stay_unit: 'Month' }
    },
    // Vehicle
    {
        id: 'a3', ownerId: 'u1', name: 'Toyota Axio', category: 'Vehicle',
        status: 'Active', availability: 'Available', location: { district: 'Dhaka', area: 'Mirpur' },
        rentConfig: { allowedTypes: ['Daily', 'Monthly'], rates: { Daily: 3000, Monthly: 45000 } },
        charges: { driverFee: 500 }, images: ['https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80&w=800'], tags: [], created_at: '2023-01-01',
        brand: 'Toyota', model: 'Axio', modelYear: '2018', licensePlate: 'DHA-MET-GA-1234', specifications: { transmission: 'Auto', fuelType: 'Octane', seats: 5 },
        is_listed: true, listing_title: 'Premium Sedan for Rent', booking_type: 'Instant',
        marketplace_settings: { discounts: { weekly: 10, monthly: 20 }, policy: 'Strict', rules: [], min_stay: 3, min_stay_unit: 'Day' }
    }
];

const tenants: Tenant[] = [
    {
        id: 't1', asset_id: 'a2', asset_type: 'Residential', full_name: 'Sadia Rahman', phone: '01900000001',
        status: 'active', start_date: '2023-06-01', security_deposit: 50000, profession: 'Banker',
        asset_info: { name: 'Flat 4A', sub_text: 'Green View Tower' }, created_at: '2023-05-20', profile_image: 'https://i.pravatar.cc/150?u=t1',
        is_registered_user: true, linked_user_id: 'u2',
        agreement_text: "<b>1. Term:</b> The lease shall commence on 2023-06-01.<br><b>2. Rent:</b> Monthly rent is ৳25,000.<br><b>3. Maintenance:</b> Tenant is responsible for minor repairs."
    }
];

const bills: Bill[] = [
    {
        id: 'b1', tenant_id: 't1', asset_type: 'Residential', month: '2023-10-01', rent_amount: 25000,
        service_charge: 3000, water_bill: 500, gas_bill: 1080, electricity_bill: 1200, additional_charges_amount: 0,
        total: 30780, status: 'unpaid', created_at: '2023-10-01', tenant_name: 'Sadia Rahman', asset_name: 'Flat 4A'
    }
];

const maintenanceRequests: MaintenanceRequest[] = [
    {
        id: 'mr1', tenant_id: 't1', asset_id: 'a2', asset_name: 'Flat 4A', title: 'Leaky Faucet',
        description: 'Kitchen sink faucet dripping.', category: 'Plumbing', subCategory: 'Leaky Tap', priority: 'Low', status: 'Open', created_at: '2023-10-10'
    }
];

const chats: ChatSession[] = [
    {
        id: 'c1', type: 'direct', participants: [{ id: 'u1', name: 'Rafiqul', avatar: '' }, { id: 't1', name: 'Sadia', avatar: 'https://i.pravatar.cc/150?u=t1' }],
        unreadCount: 1, updatedAt: new Date().toISOString(), lastMessage: { id: 'm1', chatId: 'c1', senderId: 't1', text: 'Hi, rent paid.', timestamp: new Date().toISOString(), type: 'text', status: 'sent' }
    },
    {
        id: 'g1', type: 'group', name: 'Uttara Landlords Association', privacy: 'public', description: 'A community for house owners in Uttara sector 4 & 6.',
        participants: [{id:'u1', name:'Rafiqul', avatar:''}, {id:'u2', name:'Sadia', avatar:''}],
        unreadCount: 0, updatedAt: new Date(Date.now() - 86400000).toISOString(), image: 'https://images.unsplash.com/photo-1577412647305-991150c7d163?w=150',
        lastMessage: { id: 'm2', chatId: 'g1', senderId: 'u2', text: 'Meeting tomorrow?', timestamp: new Date().toISOString(), type: 'text', status: 'read' }
    }
];
const messages: Record<string, ChatMessage[]> = {
    'c1': [{ id: 'm1', chatId: 'c1', senderId: 't1', text: 'Hi, rent paid.', timestamp: new Date().toISOString(), type: 'text', status: 'sent' }],
    'g1': [{ id: 'm2', chatId: 'g1', senderId: 'u2', text: 'Meeting tomorrow?', timestamp: new Date().toISOString(), type: 'text', status: 'read' }]
};

export const DataService = {
    getStats: () => ({ totalCollected: 150000, totalPending: 30780, totalFlats: 12, occupiedFlats: 10, totalVehicles: 2, rentedVehicles: 1, totalGadgets: 5, rentedGadgets: 2, totalServices: 0, bookedServices: 0 }),
    getBills: () => bills,
    updateBill: (id: string, data: Partial<Bill>) => { const i = bills.findIndex(b=>b.id===id); if(i!==-1) bills[i] = {...bills[i], ...data}; },
    
    // Smart Maintenance Fetching - Uses current mocked session role
    getMaintenanceRequests: (userId?: string) => {
        // If no ID is passed, return all (dev mode). Otherwise filter by logic.
        const user = UserService.getCurrentUser();
        
        if (user.role === 'lender') {
            // Find all assets owned by this lender
            const myAssetIds = assets.filter(a => a.ownerId === user.id).map(a => a.id);
            // Return requests linked to these assets
            return maintenanceRequests.filter(mr => myAssetIds.includes(mr.asset_id));
        } else {
            // If renter, only show their own requests (Mock tenant ID is t1 for active rentals)
            return maintenanceRequests.filter(mr => mr.tenant_id === 't1' || mr.tenant_id === user.id); 
        }
    },
    
    addMaintenanceRequest: (req: any) => maintenanceRequests.push({ id: `mr${Date.now()}`, created_at: new Date().toISOString(), status: 'Open', ...req }),
    
    updateMaintenanceStatus: (id: string, status: 'Open' | 'In Progress' | 'Resolved') => {
        const req = maintenanceRequests.find(r => r.id === id);
        if (req) req.status = status;
    },

    getTenants: () => tenants,
    assignTenant: (assetId: string, data: any) => { tenants.push({ id: `t${Date.now()}`, asset_id: assetId, created_at: new Date().toISOString(), status: 'active', ...data }); },
    updateTenant: (id: string, data: Partial<Tenant>) => { const i = tenants.findIndex(t => t.id === id); if(i !== -1) tenants[i] = { ...tenants[i], ...data }; },
    
    getBuildings: () => assets.filter(a => a.type === 'Building'),
    getFlats: () => assets.filter(a => a.type === 'Unit'),
    getVehicles: () => assets.filter(a => a.category === 'Vehicle'),
    getGadgets: () => assets.filter(a => a.category === 'Gadget'),
    getServices: () => assets.filter(a => a.category === 'Service'),
    getMarketplaceItems: (userId?: string, includeUnlisted?: boolean) => {
        return assets.filter(a => (includeUnlisted || a.is_listed) && (!userId || a.ownerId === userId) && a.type !== 'Building').map(a => ({
            ...a, assetType: a.category, realType: a.type || a.category, displayPrice: `৳${Object.values(a.rentConfig.rates)[0] || 0}`,
            period: Object.keys(a.rentConfig.rates)[0] || '',
            details: a.category === 'Residential' ? { size: a.sizeSqft, bedrooms: a.bedrooms, washrooms: a.bathrooms } : { model_year: a.modelYear, fuel: a.specifications?.fuelType, transmission: a.specifications?.transmission, brand: a.brand, model: a.model },
            charges: a.charges,
            marketplace_settings: a.marketplace_settings,
            booking_type: a.booking_type,
            contact_preferences: ['chat', 'phone'], user_id: a.ownerId
        }));
    },
    getRecommendations: (id: string) => [],
    toggleListing: (id: string, type: any, status: boolean) => { const a = assets.find(x => x.id === id); if(a) a.is_listed = status; },
    getMyRentals: () => tenants.filter(t => t.id === 't1').map(t => ({ id: `r${t.id}`, ...t })) // Simplified for mock
};

export const UserService = {
    getCurrentUser: () => currentUser,
    switchRole: (role: 'lender' | 'renter') => {
        currentUser.role = role;
        return currentUser;
    },
    getWishlist: () => currentUser.wishlist || [],
    toggleWishlist: (id: string) => { 
        if(currentUser.wishlist?.includes(id)) currentUser.wishlist = currentUser.wishlist.filter(x => x !== id);
        else currentUser.wishlist = [...(currentUser.wishlist||[]), id];
        return currentUser.wishlist;
    },
    updateUser: (data: any) => { Object.assign(currentUser, data); return {...currentUser}; },
    updatePlan: (plan: any, cycle: any) => { currentUser.plan = plan; currentUser.planCycle = cycle; return {...currentUser}; },
    topUpSMS: (amount: number) => { currentUser.smsBalance += amount; return {...currentUser}; },
    // Mock user search
    findUserByPhone: (phone: string) => otherUsers.find(u => u.phone === phone),
    getUserById: (id: string) => [...otherUsers, currentUser].find(u => u.id === id) || { id: 'unknown', name: 'Unknown', email: '' }
};

export const AssetService = {
    getAll: () => assets,
    getById: (id: string) => assets.find(a => a.id === id),
    getUnitsByBuilding: (id: string) => assets.filter(a => a.parentId === id),
    create: (asset: any) => { const n = { ...asset, id: `a${Date.now()}`, created_at: new Date().toISOString(), ownerId: currentUser.id }; assets.push(n); return n; },
    update: (id: string, data: any) => { const i = assets.findIndex(a => a.id === id); if(i !== -1) assets[i] = { ...assets[i], ...data }; }
};

export const ChatService = {
    getChats: () => chats,
    getChatById: (id: string) => chats.find(c => c.id === id),
    getMessages: (id: string) => messages[id] || [],
    sendMessage: (chatId: string, text: string, senderId: string) => {
        const msg: ChatMessage = { id: `m${Date.now()}`, chatId, senderId, text, type: 'text', status: 'sent', timestamp: new Date().toISOString() };
        if(!messages[chatId]) messages[chatId] = [];
        messages[chatId].push(msg);
        const c = chats.find(x => x.id === chatId);
        if(c) { c.lastMessage = msg; c.updatedAt = msg.timestamp; }
    },
    getContacts: () => tenants.map(t => ({ id: t.id, name: t.full_name, avatar: t.profile_image, role: 'Tenant' })),
    createGroup: (name: string, members: string[]) => {
        const g: ChatSession = { id: `g${Date.now()}`, type: 'group', name, participants: [{id:currentUser.id, name:currentUser.name, avatar:''}, ...members.map(m=>({id:m, name:'Member', avatar:''}))], unreadCount: 0, updatedAt: new Date().toISOString(), image: 'https://via.placeholder.com/150', privacy: 'private' };
        chats.unshift(g); return g;
    },
    startChat: (uid: string, msg: string) => {
        let c = chats.find(x => x.type === 'direct' && x.participants.some(p => p.id === uid));
        if(!c) {
            c = { id: `c${Date.now()}`, type: 'direct', participants: [{id:currentUser.id, name:currentUser.name, avatar:''}, {id:uid, name:'User', avatar:''}], unreadCount: 0, updatedAt: new Date().toISOString() };
            chats.unshift(c);
        }
        if(msg) ChatService.sendMessage(c.id, msg, currentUser.id);
        return c;
    },
    getPublicCommunities: () => chats.filter(c => c.type === 'group' && c.privacy === 'public'),
    joinGroup: (groupId: string) => {
        const g = chats.find(c => c.id === groupId);
        if(g && !g.participants.find(p=>p.id === currentUser.id)) {
            g.participants.push({id:currentUser.id, name:currentUser.name, avatar:currentUser.avatar||''});
        }
    },
    leaveGroup: (groupId: string) => {
        const g = chats.find(c => c.id === groupId);
        if(g) {
            g.participants = g.participants.filter(p => p.id !== currentUser.id);
        }
    }
};

export const LocationService = {};
