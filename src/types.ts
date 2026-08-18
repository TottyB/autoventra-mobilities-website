export type PageId =
  | 'home'
  | 'about'
  | 'services'
  | 'contact'
  | 'vehicles'
  | 'vehicle-detail'
  | 'rentals'
  | 'transport'
  | 'av-manage';

export interface Vehicle {
  id: string | number;
  make: string;
  model: string;
  year: number;
  mileage?: number | string | null;
  transmission: string;
  fuel_type: string;
  body_type: string;
  condition: string;
  price: number;
  discount_price?: number | null;
  status: 'available' | 'sold' | 'reserved';
  is_featured: boolean;
  description: string;
  photos: string[];
  created_at?: string;
}

export interface SiteSettings {
  id?: number | string;
  paybill_number: string;
  paybill_account_number: string;
  business_name: string;
  payment_instructions: string;
  updated_at?: string;
}

export interface Lead {
  id?: string | number;
  vehicle_id?: string | number | null;
  vehicle_name?: string | null;
  name: string;
  phone: string;
  email?: string | null;
  intent?: 'inquiry' | 'purchase' | string;
  lead_type?: 'test_drive' | 'vehicle_inquiry' | 'rental_booking' | 'general' | string;
  rental_vehicle?: string | null;
  rental_days?: number | null;
  start_date?: string | null;
  end_date?: string | null;
  amount?: number | null;
  payment_status?: 'unpaid' | 'paid' | 'deposit_paid' | string;
  is_paid?: boolean;
  preferred_date?: string | null;
  notes?: string | null;
  created_at?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  features: string[];
  icon: string;
  category: 'dealership' | 'rental' | 'logistics' | 'advisory';
}

export interface CoreValueItem {
  name: string;
  description: string;
  icon: string;
}

export interface ObjectiveItem {
  text: string;
}

export interface GoalItem {
  text: string;
}

export interface InquiryFormData {
  name: string;
  email: string;
  phone?: string;
  service: string;
  message: string;
}

