
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

export type AssetType = 'Residential' | 'Commercial' | 'Shared' | 'Vehicle' | 'Gadget' | 'Event Space' | 'Professional' | 'Service';
export type RentCycle = 'Hourly' | 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';

export interface BaseAsset {
  is_listed?: boolean; // If true, shows in marketplace
  images?: string[];   // URLs for marketplace
  
  // Listing Specifics (The Marketing Layer)
  listing_title?: string;
  listing_description?: string;
  listing_price?: number; // Might differ from internal rent
  hide_exact_address?: boolean; // Privacy control
  contact_preferences?: ('phone' | 'email' | 'chat')[]; 
  booking_type?: 'instant' | 'request'; 
  
  // Internal Dynamic Charges (Optional extras like 'Guard Bill')
  additional_charges?: { 
    id: string;
    name: string; 
    amount: number; 
    type: 'One-time' | 'Recurring';
  }[]; 
}

export interface Building extends BaseAsset {
  id: string;
  user_id: string;
  name: string;
  type: AssetType;
  
  // Location Details
  city: string;
  area: string;
  address: string; // Full address
  holding_no?: string;
  road_no?: string;
  zip_code?: string;
  
  // Structure & Management
  total_floors: number;
  caretaker_name?: string;
  caretaker_phone?: string;
  
  // Facilities (Internal reference)
  amenities?: string[]; // e.g. ['Lift', 'Generator', 'CCTV', 'WiFi', 'Guard']
  
  created_at: string;
  flat_count?: number;
  occupied_count?: number;
}

export interface Vehicle extends BaseAsset {
  id: string;
  user_id: string;
  name: string;
  license_plate: string; // Internal tracking
  type: string;
  transmission?: 'Auto' | 'Manual';
  fuel_type?: 'Petrol' | 'Diesel' | 'CNG' | 'Hybrid' | 'Electric';
  seats?: number;
  model_year?: string;
  color?: string;
  is_driver_included?: boolean;
  rates: Partial<Record<RentCycle, number>>;
  status: 'active' | 'rented' | 'maintenance';
  created_at: string;
}

export interface Gadget extends BaseAsset {
  id: string;
  user_id: string;
  name: string;
  brand?: string;
  model?: string;
  serial_no?: string; // Internal tracking
  category: string;
  rates: Partial<Record<RentCycle, number>>;
  default_rent_cycle?: RentCycle;
  security_deposit: number;
  status: 'active' | 'rented' | 'maintenance';
  created_at: string;
}

export interface ServiceAsset extends BaseAsset {
  id: string;
  user_id: string;
  name: string; 
  type: 'Professional' | 'Service' | 'Event Space';
  category: string; 
  description?: string;
  location?: string;
  rates: Partial<Record<RentCycle, number>>;
  status: 'active' | 'rented' | 'unavailable';
  availability?: string[]; 
  created_at: string;
}

export interface Flat extends BaseAsset {
  id: string;
  building_id: string;
  floor_no: number;
  flat_no: string; // Internal ID (e.g. 4A)
  size_sqft: number;
  
  // Attributes
  facing?: 'North' | 'South' | 'East' | 'West' | 'North-East' | 'North-West' | 'South-East' | 'South-West';
  furnishing?: 'Unfurnished' | 'Semi-Furnished' | 'Fully-Furnished';
  
  // Residential Specific
  bedrooms?: number;
  washrooms?: number;
  balconies?: number;
  has_kitchen?: boolean;
  has_dining?: boolean;
  has_living?: boolean;
  has_gas?: boolean;
  // Details
  has_drawing?: boolean;
  has_servant_room?: boolean;

  // Commercial Specific
  has_power_backup?: boolean;
  has_lift_access?: boolean;
  has_parking?: boolean;
  is_furnished?: boolean;

  amenities?: string[];

  // Internal Financials (Presets for Billing)
  rent_type: RentCycle;
  monthly_rent: number; 
  service_charge: number;
  water_bill: number;
  gas_bill: number;
  electricity_bill?: number; // Usually metered, but can have base
  
  is_vacant: boolean;
  created_at: string;
  tenant_id?: string;
}

export interface Tenant {
  id: string;
  asset_id: string;
  asset_type: AssetType;
  
  // Personal Info
  full_name: string;
  father_name?: string;
  dob?: string;
  gender?: 'Male' | 'Female' | 'Other';
  marital_status?: 'Single' | 'Married';
  
  // Contact
  phone: string;
  email?: string;
  permanent_address?: string;
  
  // Identity
  nid_number?: string;
  nid_front_image?: string;
  nid_back_image?: string;
  profile_image?: string;

  // Occupation
  profession?: string;
  company_name?: string;
  designation?: string;

  // Household
  members_adults?: number;
  members_children?: number;

  // Emergency
  emergency_name?: string;
  emergency_phone?: string;
  emergency_relation?: string;

  // Rental Terms
  start_date: string;
  end_date?: string;
  security_deposit?: number;
  status: 'active' | 'future' | 'past';
  created_at: string;
  
  // Snapshot
  asset_info?: {
    name: string;
    sub_text: string;
  };
}

export interface BillCharge {
  name: string;
  amount: number;
  note?: string;
  type?: string;
}

export interface Bill {
  id: string;
  tenant_id: string;
  asset_type: AssetType;
  month: string; // ISO String Date
  rent_amount: number;
  
  // Residential/Commercial Charges
  service_charge: number;
  water_bill: number;
  gas_bill: number;
  electricity_bill?: number;
  
  // Vehicle Specific
  fuel_cost?: number;
  driver_allowance?: number;
  toll_cost?: number;

  // Gadget Specific
  damage_cost?: number;
  late_fee?: number;

  // Generic
  other_bills?: number;
  additional_charges_amount: number;
  
  // Dynamic Charges
  extra_charges?: BillCharge[];
  
  total: number;
  paid_amount?: number; // Support partial payment tracking
  status: 'unpaid' | 'paid' | 'partial';
  created_at: string;
  tenant_name?: string;
  asset_name?: string;
  asset_sub?: string;
  paid_date?: string;
  paid_method?: string; // Cash, bKash, etc.
  paid_note?: string;
}

export interface Payment {
  id: string;
  bill_id: string;
  paid_amount: number;
  paid_date: string;
  method: string;
}

export interface MaintenanceRequest {
  id: string;
  tenant_id: string;
  asset_id: string; 
  asset_name: string;
  title: string;
  description: string;
  category: 'Plumbing' | 'Electrical' | 'Appliance' | 'Furniture' | 'Mechanical' | 'Other';
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'Resolved';
  created_at: string;
  images?: string[];
}

// --- Chat Types ---
export interface ChatSession {
    id: string;
    type: 'direct' | 'group';
    participants: {
        id: string;
        name: string;
        avatar: string;
        role?: 'admin' | 'member';
    }[];
    name?: string; // For groups
    image?: string; // For groups
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
    type: 'text' | 'image' | 'system' | 'action'; // action for things like 'Bill Paid'
    status: 'sent' | 'delivered' | 'read';
    actionData?: {
        type: 'payment' | 'maintenance';
        title: string;
        amount?: number;
    };
}
