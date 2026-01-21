
export const COLORS = {
  primary: '#ff4b9a',
  secondary: '#7c3aed',
  background: '#f9fafb',
  text: '#1f2937',
  muted: '#6b7280',
};

export const CITIES = [
  'Dhaka', 
  'Chattogram', 
  'Sylhet', 
  'Rajshahi', 
  'Khulna', 
  'Barishal', 
  'Rangpur', 
  'Mymensingh',
  'Gazipur', 
  'Narayanganj', 
  'Cumilla', 
  'Cox\'s Bazar', 
  'Bogura', 
  'Savar'
];

export const AREAS: Record<string, string[]> = {
  'Dhaka': [
    'Adabor', 'Badda', 'Banani', 'Bangshal', 'Bhashantek', 'Cantonment', 'Chawkbazar',
    'Dakhinkhan', 'Darus Salam', 'Demra', 'Dhanmondi', 'Gendaria', 'Gulshan',
    'Hazaribagh', 'Jatrabari', 'Kadamtali', 'Kafrul', 'Kalabagan', 'Kamrangirchar',
    'Khilgaon', 'Khilkhet', 'Kotwali', 'Lalbagh', 'Mirpur', 'Mohammadpur', 'Motijheel',
    'New Market', 'Pallabi', 'Paltan', 'Ramna', 'Rampura', 'Sabujbagh', 'Shah Ali',
    'Shahbag', 'Sher-e-Bangla Nagar', 'Shyampur', 'Sutrapur', 'Tejgaon', 'Turag',
    'Uttara', 'Uttar Khan', 'Vatara', 'Wari'
  ],
  'Chattogram': [
    'Agrabad', 'Akbar Shah', 'Bakalia', 'Bayazid', 'Chandgaon', 'Chawkbazar',
    'Double Mooring', 'EPZ', 'Halishahar', 'Karnafuli', 'Khulshi', 'Kotwali',
    'Pahartali', 'Panchlaish', 'Patenga', 'Sadarghat'
  ],
  'Sylhet': [
    'Amberkhana', 'Bandar Bazar', 'Beanibazar', 'Bishwanath', 'Fenchuganj',
    'Golapganj', 'Jaintiapur', 'Kanaighat', 'Kotwali', 'Shahjalal Uposhahar',
    'South Surma', 'Zindabazar'
  ],
  'Rajshahi': [
    'Boalia', 'Chandrima', 'Katakhali', 'Matihar', 'Paba', 'Rajpara', 'Shah Makhdum'
  ],
  'Khulna': [
    'Daulatpur', 'Khalishpur', 'Khan Jahan Ali', 'Kotwali', 'Saltachara', 'Sonadanga'
  ],
  'Barishal': [
    'Agailjhara', 'Babuganj', 'Bakerganj', 'Banaripara', 'Gaurnadi', 'Hizla',
    'Barishal Sadar', 'Mehendiganj', 'Muladi', 'Wazirpur'
  ],
  'Rangpur': [
    'Badarganj', 'Gangachara', 'Kaunia', 'Rangpur Sadar', 'Mithapukur',
    'Pirgachha', 'Pirganj', 'Taraganj'
  ],
  'Mymensingh': [
    'Bhaluka', 'Dhobaura', 'Fulbaria', 'Gaffargaon', 'Gauripur', 'Haluaghat',
    'Ishwarganj', 'Mymensingh Sadar', 'Muktagachha', 'Nandail', 'Phulpur', 'Trishal'
  ],
  'Gazipur': [
    'Gazipur Sadar', 'Kaliakair', 'Kaliganj', 'Kapasia', 'Sreepur', 'Tongi'
  ],
  'Narayanganj': [
    'Araihazar', 'Bandar', 'Narayanganj Sadar', 'Rupganj', 'Siddhirganj', 'Sonargaon'
  ],
  'Cumilla': [
    'Barura', 'Brahmanpara', 'Burichang', 'Chandina', 'Chauddagram', 'Cumilla Sadar',
    'Daudkandi', 'Debidwar', 'Homna', 'Laksam', 'Lalmai', 'Meghna', 'Monohargonj',
    'Muradnagar', 'Nangalkot', 'Titas'
  ],
  'Cox\'s Bazar': [
    'Chakaria', 'Cox\'s Bazar Sadar', 'Kutubdia', 'Maheshkhali', 'Pekua',
    'Ramu', 'Teknaf', 'Ukhiya'
  ],
  'Bogura': [
    'Adamdighi', 'Bogura Sadar', 'Dhunat', 'Dupchanchia', 'Gabtali', 'Kahaloo',
    'Nandigram', 'Sariakandi', 'Sherpur', 'Shibganj', 'Sonatala'
  ],
  'Savar': [
    'Aminbazar', 'Ashulia', 'Birulia', 'Dhamsona', 'Hemayetpur', 'Shimulia', 'Tetuljhora'
  ]
};

export const RENT_TYPES = [
  'Hourly',
  'Daily',
  'Weekly',
  'Monthly',
  'Yearly'
];

export const MARKETPLACE_CATEGORIES: Record<string, string[]> = {
  'Real Estate': [
    'Flat', 'Furnished Flat', 'Bachelor', 'Sublet', 'Hostel', 'Office Space', 'Shop', 'Empty Space', 'Land', 'Garage'
  ],
  'Vehicles': [
    'Car', 'Bike', 'Bicycle', 'Truck', 'Van', 'Microbus', 'Ambulance', 'Ghora Gari', 'Boat'
  ],
  'Tech': [
    'Camera', 'Lens', 'Laptop', 'Drone', 'Gaming Console', 'Projector', 'Sound System', 'Tripod', 'Lighting Kit'
  ],
  'Services': [
    'Shifting', 'Technician', 'Teacher', 'AC Servicing', 'Photographer', 'Driver', 'Cleaner', 'Cook', 'Plumber', 'Electrician'
  ],
  'Events': [
    'Community Center', 'Rooftop', 'Empty Space', 'Decorator', 'Catering', 'Sound', 'Lighting', 'Ghora Gari', 'Photographer', 'Cinematographer'
  ]
};
