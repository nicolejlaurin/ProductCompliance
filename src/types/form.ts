export interface FormData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Service Selection
  serviceType: string;
  customServiceType?: string;
  
  // Conditional fields based on service type
  projectType?: string;
  budget?: string;
  timeline?: string;
  
  // Business specific
  businessName?: string;
  industry?: string;
  
  // Event specific
  eventType?: string;
  eventDate?: string;
  guestCount?: string;
  
  // Car service specific
  carMake?: string;
  carModel?: string;
  carYear?: string;
  serviceNeeded?: string;
  mileage?: string;
  
  // Real estate specific
  propertyType?: string;
  propertyValue?: string;
  location?: string;
  
  // Fitness specific
  fitnessGoal?: string;
  experience?: string;
  availability?: string;
  
  // Additional details
  additionalRequirements: string;
  hearAboutUs: string;
}

export interface FormErrors {
  [key: string]: string;
}

export const SERVICE_TYPES = {
  web_development: 'Web Development',
  mobile_app: 'Mobile App Development',
  digital_marketing: 'Digital Marketing',
  business_consulting: 'Business Consulting',
  event_planning: 'Event Planning',
  car: 'Car Services',
  real_estate: 'Real Estate',
  fitness: 'Fitness Training',
  custom: 'Other (Please specify)'
};

export const PROJECT_TYPES = {
  website: 'Business Website',
  ecommerce: 'E-commerce Store',
  web_app: 'Web Application',
  portfolio: 'Portfolio Site'
};

export const BUDGET_RANGES = {
  under_1k: 'Under $1,000',
  '1k_5k': '$1,000 - $5,000',
  '5k_15k': '$5,000 - $15,000',
  '15k_50k': '$15,000 - $50,000',
  over_50k: 'Over $50,000'
};

export const TIMELINES = {
  asap: 'ASAP',
  '1_week': '1 Week',
  '1_month': '1 Month',
  '3_months': '3 Months',
  '6_months': '6+ Months'
};

export const CAR_SERVICES = {
  maintenance: 'Regular Maintenance',
  repair: 'Repair Service',
  inspection: 'Vehicle Inspection',
  detailing: 'Car Detailing',
  modification: 'Performance Modification'
};

export const PROPERTY_TYPES = {
  residential: 'Residential',
  commercial: 'Commercial',
  land: 'Land/Lot',
  investment: 'Investment Property'
};

export const FITNESS_GOALS = {
  weight_loss: 'Weight Loss',
  muscle_gain: 'Muscle Gain',
  endurance: 'Endurance Training',
  strength: 'Strength Training',
  general: 'General Fitness'
};