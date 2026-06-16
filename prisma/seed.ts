import prisma from '@/lib/db';
import { UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.user.deleteMany();
  await prisma.agency.deleteMany();

  // Create agencies
  const realEstateAgency = await prisma.agency.create({
    data: {
      name: 'Elite Real Estate',
      email: 'info@eliterealestate.com',
      phone: '+234 800 123 4567',
      businessType: 'real_estate',
      isVerified: true,
      verificationStatus: 'APPROVED',
      rentalCommission: 0.1,
      saleCommission: 0.1,
    },
  });

  const artisanAgency = await prisma.agency.create({
    data: {
      name: 'BuildPro Artisans',
      email: 'info@buildpro.com',
      phone: '+234 800 987 6543',
      businessType: 'artisan',
      isVerified: true,
      verificationStatus: 'APPROVED',
      serviceCommission: 0.15,
    },
  });

  // Create users
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@shelterlink.com',
      firstName: 'Admin',
      lastName: 'User',
      displayName: 'Admin',
      passwordHash: await bcrypt.hash('Admin@123456', 10),
      role: 'ADMIN',
      verificationStatus: 'APPROVED',
      emailVerified: new Date(),
      isActive: true,
    },
  });

  const tenantUser = await prisma.user.create({
    data: {
      email: 'tenant@example.com',
      firstName: 'John',
      lastName: 'Doe',
      displayName: 'John D.',
      passwordHash: await bcrypt.hash('Tenant@123456', 10),
      role: 'TENANT',
      verificationStatus: 'APPROVED',
      emailVerified: new Date(),
      isActive: true,
      city: 'Lagos',
      country: 'Nigeria',
    },
  });

  const ownerUser = await prisma.user.create({
    data: {
      email: 'owner@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      displayName: 'Jane S.',
      passwordHash: await bcrypt.hash('Owner@123456', 10),
      role: 'OWNER',
      verificationStatus: 'APPROVED',
      emailVerified: new Date(),
      isActive: true,
      primaryAgencyId: realEstateAgency.id,
    },
  });

  const artisanUser = await prisma.user.create({
    data: {
      email: 'artisan@example.com',
      firstName: 'Michael',
      lastName: 'Johnson',
      displayName: 'Mike J.',
      passwordHash: await bcrypt.hash('Artisan@123456', 10),
      role: 'ARTISAN',
      verificationStatus: 'APPROVED',
      emailVerified: new Date(),
      isActive: true,
      primaryAgencyId: artisanAgency.id,
    },
  });

  // Create artisan profile
  await prisma.artisanProfile.create({
    data: {
      userId: artisanUser.id,
      businessName: 'Mike\'s Construction',
      yearsOfExperience: 5,
      specializations: ['CONSTRUCTION', 'PAINTING', 'ELECTRICAL'],
      isVerified: true,
    },
  });

  // Create sample properties
  await prisma.property.create({
    data: {
      ownerId: ownerUser.id,
      agencyId: realEstateAgency.id,
      title: 'Beautiful 3-Bedroom Apartment in Lagos',
      description: 'Luxury apartment with excellent amenities in the heart of Lagos. Modern finish, high security.',
      propertyType: 'APARTMENT',
      status: 'FOR_RENT',
      address: '123 Victoria Island',
      city: 'Lagos',
      state: 'Lagos',
      country: 'Nigeria',
      zipCode: '100001',
      latitude: 6.4281,
      longitude: 3.4219,
      bedrooms: 3,
      bathrooms: 2,
      squareFeet: 2500,
      rentalPrice: 500000,
      currency: 'NGN',
      hasPool: true,
      hasGym: true,
      hasSecurity: true,
      images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267'],
      isApproved: true,
      approvedAt: new Date(),
    },
  });

  // Create sample service
  await prisma.service.create({
    data: {
      artisanId: artisanUser.id,
      agencyId: artisanAgency.id,
      category: 'CONSTRUCTION',
      subcategory: 'House Renovation',
      title: 'Complete House Renovation Service',
      description: 'Professional house renovation with quality materials and experienced workers.',
      basePrice: 500000,
      currency: 'NGN',
      priceType: 'fixed',
      images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab'],
      isActive: true,
      averageRating: 4.8,
      totalOrders: 15,
    },
  });

  // Create wallets
  await prisma.wallet.create({
    data: {
      userId: tenantUser.id,
      balance: 0,
      currency: 'NGN',
    },
  });

  await prisma.wallet.create({
    data: {
      userId: artisanUser.id,
      balance: 1500000,
      currency: 'NGN',
      totalEarned: 5000000,
    },
  });

  // Create agency wallet
  await prisma.agencyWallet.create({
    data: {
      agencyId: realEstateAgency.id,
      balance: 5000000,
      currency: 'NGN',
      totalEarned: 15000000,
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('\n📝 Test Credentials:');
  console.log('Admin: admin@shelterlink.com / Admin@123456');
  console.log('Tenant: tenant@example.com / Tenant@123456');
  console.log('Owner: owner@example.com / Owner@123456');
  console.log('Artisan: artisan@example.com / Artisan@123456');
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
