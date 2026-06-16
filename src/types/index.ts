import { UserRole, PropertyType, PropertyStatus, ServiceCategory, VerificationStatus } from '@prisma/client';

export type { UserRole, PropertyType, PropertyStatus, ServiceCategory, VerificationStatus };

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  statusCode?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// User Types
export interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  avatar?: string;
  bio?: string;
  role: UserRole;
  verificationStatus: VerificationStatus;
  isActive: boolean;
  createdAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  agreeToTerms: boolean;
}

// Property Types
export interface PropertyListing {
  id: string;
  title: string;
  description: string;
  propertyType: PropertyType;
  status: PropertyStatus;
  bedrooms: number;
  bathrooms: number;
  squareFeet?: number;
  address: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  rentalPrice?: number;
  salePrice?: number;
  currency: string;
  images: string[];
  videos?: string[];
  views: number;
  favorites: number;
  createdAt: Date;
  owner?: UserProfile;
}

export interface PropertySearchFilters {
  keyword?: string;
  propertyType?: PropertyType;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  maxBathrooms?: number;
  status?: PropertyStatus;
  hasParking?: boolean;
  hasPool?: boolean;
  lat?: number;
  lng?: number;
  radius?: number;
  page?: number;
  pageSize?: number;
  sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'popular';
}

// Artisan Types
export interface ArtisanService {
  id: string;
  title: string;
  description: string;
  category: ServiceCategory;
  subcategory: string;
  basePrice?: number;
  currency: string;
  priceType: 'fixed' | 'hourly';
  averageRating: number;
  totalOrders: number;
  images: string[];
  isActive: boolean;
  createdAt: Date;
}

export interface ArtisanProfile extends UserProfile {
  businessName?: string;
  yearsOfExperience?: number;
  specializations: ServiceCategory[];
  averageRating: number;
  totalReviews: number;
  totalCompleted: number;
  isVerified: boolean;
  services: ArtisanService[];
}

// Notification Types
export interface NotificationPayload {
  type: string;
  title: string;
  message: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export interface PushNotification extends NotificationPayload {
  id: string;
  userId: string;
  isRead: boolean;
  createdAt: Date;
}
