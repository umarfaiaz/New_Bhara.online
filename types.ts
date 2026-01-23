
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role?: 'lender' | 'renter';
  
  // Profile Extra
  address?: string;
  businessName?: string;
  language?: 'en' | 'bn';

  // Subscription
  plan: 'Free' | 'Pro' | 'Elite';
  planCycle?: 'Monthly' | 'Yearly';
  subscriptionRenewalDate?: string;
  smsBalance: number;
  joinDate: string;
  
  // Saved Items
  wishlist?: string[];
}

export type AssetCategory = 'Residential' | 'Commercial' | 'Vehicle' | 'Gadget' | 'Service' | 'Skill' | 'Event';
export type AssetStatus = 'Active' | 'Rented' | 'Listed' | 'Draft' | 'Maintenance';
export type RentCycle = 'Hourly' | 'Daily' | 'Weekly' | 'Monthly' | 'Yearly' | 'Per Session' | 'Per Project';

// --- Shared Configuration Types ---

export interface LocationData {
  district: string;
  upazila: string;
  area: string;
  address?: string;
  mapLink?: string;
}

export interface RentConfig {
  allowedTypes: RentCycle[];
  rates: Partial<Record<RentCycle, number>>; // e.g. { Daily: 5000, Monthly: 120000 }
  securityDeposit?: number;
  minimumDuration?: string; // e.g. "3 Days"
  advancePayment?: number;
}

export interface ChargesTemplate {
  serviceCharge?: number;
  cleaningFee?: number;
  driverFee?: number; // Vehicles
  fuelFee?: number;   // Vehicles
  lateFee?: number;
  utilityFee?: number; // Property
  gasFee?: number;
  waterFee?: number;
  electricityFee?: number;
  customCharges?: { name: string; amount: number }[];
}

// --- Marketplace Specifics ---
export interface MarketplaceSettings {
    discounts: { weekly: number; monthly: number }; // Percentage
    policy: 'Flexible' | 'Moderate' | 'Strict';
    rules: string[]; // e.g., 'No Smoking', 'No Pets'
    min_stay: number; // Value
    min_stay_unit?: 'Day' | 'Week' | 'Month'; // Unit
}

// --- Base Asset Interface ---

export interface BaseAsset {
  id: string;
  ownerId: string;
  name: string; // Internal Name / Title
  category: AssetCategory;
  subCategory?: string; // e.g. "Car", "Flat", "DSLR"
  
  description?: string;
  status: AssetStatus;
  availability: 'Available' | 'Booked' | 'Maintenance';
  
  location: LocationData;
  rentConfig: RentConfig;
  charges: ChargesTemplate;
  
  images: string[];
  tags: string[];
  
  created_at: string;
  updated_at?: string;
  
  // Marketplace Specifics (Optional until listed)
  is_listed: boolean;
  listing_title?: string;
  booking_type?: 'Request' | 'Instant';
  marketplace_settings?: MarketplaceSettings;
}

// --- Category Specific Interfaces ---

// 1. Residential & Commercial Buildings (Parents)
export interface PropertyBuilding extends BaseAsset {
  category: 'Residential' | 'Commercial';
  type: 'Building'; // Discriminator
  
  totalFloors: number;
  totalUnits: number;
  
  facilities: {
    lift?: boolean;
    liftCount?: number;
    generator?: boolean;
    cctv?: boolean;
    securityGuard?: boolean;
    parking?: { car: number; bike: number };
    waterSource?: 'WASA' | 'Deep Tube' | 'Both';
    gasSource?: 'Pipeline' | 'Cylinder' | 'None';
    internet?: boolean;
    fireSafety?: boolean;
  };
}

// 2. Units (Child Assets)
export interface PropertyUnit extends BaseAsset {
  category: 'Residential' | 'Commercial';
  type: 'Unit';
  parentId: string; // ID of the Building
  
  unitNumber: string; // "4A", "Shop-1"
  floorNumber: number;
  sizeSqft: number;
  
  // Residential Specifics
  bedrooms?: number;
  bathrooms?: number;
  balconies?: number;
  furnished?: 'None' | 'Semi' | 'Full';
  
  // Commercial Specifics
  shopCategory?: string; // "Grocery", "Clothing"
  frontageFeet?: number;
  officeType?: 'Open' | 'Partitioned';
}

// 3. Vehicles
export interface Vehicle extends BaseAsset {
  category: 'Vehicle';
  
  brand: string;
  model: string;
  modelYear: string;
  licensePlate: string;
  
  specifications: {
    transmission: 'Auto' | 'Manual';
    fuelType: 'Petrol' | 'Diesel' | 'CNG' | 'Hybrid' | 'Electric';
    seats: number;
    color?: string;
    mileage?: string;
  };
}

// 4. Gadgets & Tools
export interface Gadget extends BaseAsset {
  category: 'Gadget';
  
  brand: string;
  model: string;
  serialNumber?: string;
  
  condition: 'New' | 'Like New' | 'Good' | 'Fair';
  accessories?: string[]; // "Lens", "Bag", "Charger"
}

// 5. Services & Skills
export interface ServiceProfile extends BaseAsset {
  category: 'Service' | 'Skill';
  
  professionalName?: string; // If different from Asset Name
  experienceYears?: number;
  qualifications?: string[];
  coverageArea?: string[]; // List of areas
  
  serviceMode: 'Online' | 'Offline' | 'Both';
}

// 6. Event Venues
export interface EventVenue extends BaseAsset {
  category: 'Event';
  
  capacity: number;
  venueType: 'Indoor' | 'Outdoor' | 'Rooftop';
  
  features: {
    ac?: boolean;
    soundSystem?: boolean;
    kitchen?: boolean;
    decorationAllowed?: boolean;
  };
}

// Union Type
export type Asset = PropertyBuilding | PropertyUnit | Vehicle | Gadget | ServiceProfile | EventVenue;

export type AssetType = AssetCategory;
export type Building = PropertyBuilding;
export type Flat = PropertyUnit;
export type ServiceAsset = ServiceProfile;

// --- Legacy Support (Mapped to new structure in UI) ---
export interface Tenant {
  id: string;
  asset_id: string;
  asset_type: AssetCategory;
  full_name: string;
  phone: string;
  email?: string;
  status: 'active' | 'future' | 'past';
  start_date: string;
  end_date?: string;
  security_deposit?: number;
  agreement_text?: string; 
  
  // Professional Details
  profession?: string;
  organization_name?: string;
  
  // Identity
  nid_number?: string;
  dob?: string;
  permanent_address?: string;
  
  // Family / Group (Residential)
  members_adults?: number;
  members_children?: number;
  
  // Vehicle Specific
  driving_license?: string;
  
  // Emergency
  emergency_contact?: {
      name: string;
      phone: string;
      relation: string;
  };

  profile_image?: string;
  created_at: string;
  asset_info?: { name: string; sub_text: string };
  
  // System flags
  is_registered_user?: boolean;
  linked_user_id?: string;
}

export interface BillCharge {
    name: string;
    amount: number;
    type?: string;
    note?: string;
}

export interface Bill {
  id: string;
  tenant_id: string;
  asset_type: AssetCategory;
  month: string;
  rent_amount: number;
  total: number;
  paid_amount?: number;
  // Updated statuses for approval workflow
  status: 'unpaid' | 'paid' | 'partial' | 'pending_approval' | 'changes_pending';
  created_at: string;
  tenant_name?: string;
  asset_name?: string;
  asset_sub?: string;
  paid_date?: string;
  paid_method?: string;
  paid_note?: string;
  service_charge: number;
  water_bill: number;
  gas_bill: number;
  electricity_bill?: number;
  fuel_cost?: number;
  driver_allowance?: number;
  toll_cost?: number;
  damage_cost?: number;
  late_fee?: number;
  other_bills?: number;
  additional_charges_amount: number;
  extra_charges?: BillCharge[];
}

export interface MaintenanceRequest {
  id: string;
  tenant_id: string;
  asset_id: string; 
  asset_name: string;
  title: string;
  description: string;
  category: 'Plumbing' | 'Electrical' | 'Appliance' | 'Furniture' | 'Structural' | 'Other';
  subCategory?: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'Resolved';
  created_at: string;
  images?: string[];
  cost?: number;
}

export interface ChatSession {
    id: string;
    type: 'direct' | 'group';
    privacy?: 'public' | 'private'; 
    participants: {
        id: string;
        name: string;
        avatar: string;
        role?: 'admin' | 'member';
    }[];
    name?: string;
    image?: string;
    description?: string; 
    lastMessage?: ChatMessage;
    unreadCount: number;
    updatedAt: string;
    isVerified?: boolean;
}

export interface ChatMessage {
    id: string;
    chatId: string;
    senderId: string;
    text: string;
    timestamp: string;
    type: 'text' | 'image' | 'system' | 'action'; 
    status: 'sent' | 'delivered' | 'read';
    actionData?: {
        type: 'payment' | 'maintenance' | 'invoice';
        title: string;
        amount?: number;
        id?: string;
        // Expanded to include Bill statuses
        status?: 'paid' | 'unpaid' | 'pending' | 'partial' | 'pending_approval' | 'changes_pending';
    };
}
