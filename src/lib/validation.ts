import { z } from 'zod';
import { UserRole, PropertyType, ServiceCategory } from '@prisma/client';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters').regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain uppercase, lowercase, and numbers'
  ),
  confirmPassword: z.string(),
  role: z.nativeEnum(UserRole),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const updateProfileSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  displayName: z.string().optional(),
  bio: z.string().max(500).optional(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  zipCode: z.string().optional(),
});

export const createPropertySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  description: z.string().min(20, 'Description must be at least 20 characters').max(5000),
  propertyType: z.nativeEnum(PropertyType),
  address: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2),
  country: z.string().min(2),
  zipCode: z.string().optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  bedrooms: z.number().int().min(0),
  bathrooms: z.number().min(0),
  squareFeet: z.number().int().optional(),
  yearBuilt: z.number().int().optional(),
  rentalPrice: z.number().positive().optional(),
  salePrice: z.number().positive().optional(),
  currency: z.string().default('NGN'),
  availableFrom: z.string().datetime().optional(),
  images: z.array(z.string().url()).max(20),
});

export const createArtisanProfileSchema = z.object({
  businessName: z.string().min(3),
  businessRegistration: z.string().optional(),
  yearsOfExperience: z.number().int().min(0),
  specializations: z.array(z.nativeEnum(ServiceCategory)).min(1),
});

export const createServiceSchema = z.object({
  category: z.nativeEnum(ServiceCategory),
  subcategory: z.string().min(3),
  title: z.string().min(5).max(100),
  description: z.string().min(20).max(5000),
  basePrice: z.number().positive().optional(),
  priceType: z.enum(['fixed', 'hourly']).default('fixed'),
  images: z.array(z.string().url()).max(10),
});

export const initiatePaymentSchema = z.object({
  amount: z.number().positive(),
  email: z.string().email(),
  currency: z.string().default('NGN'),
  description: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type CreatePropertyInput = z.infer<typeof createPropertySchema>;
