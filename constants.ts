
export const COLORS = {
  primary: '#ff4b9a',
  secondary: '#7c3aed',
  background: '#f9fafb',
  text: '#1f2937',
  muted: '#6b7280',
};

// Hierarchical Location Data (Mock Subset)
export const BANGLADESH_LOCATIONS: Record<string, Record<string, string[]>> = {
  'Dhaka': {
    'Uttara': ['Sector 1', 'Sector 3', 'Sector 4', 'Sector 7', 'Sector 10', 'Sector 11', 'Sector 13', 'Sector 14'],
    'Mirpur': ['Mirpur 1', 'Mirpur 2', 'Mirpur 10', 'Mirpur 11', 'Mirpur 12', 'Pallabi', 'Kalshi', 'DOHS'],
    'Gulshan': ['Gulshan 1', 'Gulshan 2', 'Niketan'],
    'Banani': ['Block A', 'Block B', 'Block C', 'Block E', 'Chairman Bari'],
    'Dhanmondi': ['Road 2', 'Road 5', 'Road 15', 'Road 27', 'Jigatola', 'Shangkar'],
    'Mohammadpur': ['Ring Road', 'Shekhertek', 'Adabor', 'Japan Garden', 'Bosila'],
    'Bashundhara': ['Block A', 'Block B', 'Block C', 'Block D', 'Block I'],
    'Badda': ['North Badda', 'South Badda', 'Merul Badda', 'Aftabnagar']
  },
  'Chattogram': {
    'Agrabad': ['CDA R/A', 'Access Road', 'Muhuri Para'],
    'Khulshi': ['South Khulshi', 'North Khulshi', 'Zakir Hossain Road'],
    'Halishahar': ['Block A', 'Block B', 'GEC Circle'],
    'Panchlaish': ['Probortak', 'Muradpur']
  },
  'Sylhet': {
    'Kotwali': ['Zindabazar', 'Bandar Bazar', 'Ambarkhana'],
    'Shah Paran': ['Uposhahar', 'Shibganj', 'Tilagor']
  },
  'Rajshahi': {
    'Boalia': ['Shaheb Bazar', 'Alupotti'],
    'Motihar': ['Kazla', 'Binodpur']
  }
};

export const CITIES = Object.keys(BANGLADESH_LOCATIONS);

export const RENT_TYPES = [
  'Hourly',
  'Daily',
  'Weekly',
  'Monthly',
  'Yearly',
  'Per Session',
  'Per Project'
];

export const ASSET_CATEGORIES = [
  'Residential',
  'Commercial',
  'Vehicle',
  'Gadget',
  'Service',
  'Skill',
  'Event'
];

export const MARKETPLACE_CATEGORIES: Record<string, string[]> = {
  'Residential': [
    'Flat', 'Furnished Flat', 'Bachelor', 'Sublet', 'Hostel', 'Empty Space', 'Garage'
  ],
  'Commercial': [
    'Shop', 'Office', 'Warehouse', 'Factory', 'Showroom'
  ],
  'Vehicle': [
    'Car', 'Bike', 'Bicycle', 'Truck', 'Van', 'Microbus', 'Ambulance', 'Boat'
  ],
  'Gadget': [
    'Camera', 'Lens', 'Laptop', 'Drone', 'Gaming Console', 'Projector', 'Sound System', 'Tripod', 'Lighting Kit'
  ],
  'Skill': [
    'Tutor', 'Developer', 'Designer', 'Consultant', 'Trainer', 'Handyman', 'Technician', 'Photographer', 'Cinematographer'
  ],
  'Service': [
    'Shifting', 'Technician', 'Teacher', 'AC Servicing', 'Driver', 'Cleaner', 'Cook', 'Plumber', 'Electrician'
  ],
  'Event': [
    'Community Center', 'Rooftop', 'Auditorium', 'Decorator', 'Catering', 'Sound', 'Lighting'
  ]
};

export const SUGGESTED_TAGS: Record<string, string[]> = {
  'Residential': ['Furnished', 'South Facing', 'Top Floor', 'Generator', 'Gas', 'CCTV', 'Guard', 'Lift', 'Family', 'Bachelor Friendly'],
  'Commercial': ['Roadside', 'Glass Front', 'Corner Plot', 'Parking', 'Fire Safety', 'Generator', 'Loading Dock'],
  'Vehicle': ['AC', 'CNG', 'LPG', 'Hybrid', 'Automatic', 'Manual', 'Driver Included', 'Self Drive', 'Sedan', 'SUV'],
  'Gadget': ['4K', 'Wireless', 'Professional', 'Waterproof', 'Sony', 'Canon', 'Nikon', 'DJI', 'GoPro', 'Accessories Included'],
  'Skill': ['Wedding', 'Corporate', 'Portrait', 'React', 'Python', 'IELTS', 'Math', 'Physics', 'Plumbing', 'Electrical'],
  'Service': ['Home Service', 'Hourly', 'Contract', 'Emergency', '24/7', 'Verified'],
  'Event': ['Rooftop', 'Indoor', 'AC', 'Buffet', 'Sound System', 'Stage', 'Parking']
};
