// Update to prisma/schema.prisma to add Agency support
// Add these models to the existing schema:

// ============================================
// AGENCY & MULTI-USER SUPPORT
// ============================================

model Agency {
  id                    String                 @id @default(cuid())
  name                  String
  description           String?                @db.Text
  logo                  String?                // URL to agency logo
  website               String?
  phone                  String?
  email                  String
  address               String?
  city                  String?
  state                  String?
  country               String?
  
  // Business details
  registrationNumber    String?                @unique
  taxId                 String?
  businessType          String?                // "real_estate", "artisan", "both"
  
  // Verification
  isVerified            Boolean                @default(false)
  verificationStatus    VerificationStatus     @default(PENDING)
  verificationDate      DateTime?
  
  // Commission settings (agency can have custom rates)
  rentalCommission      Decimal                @default(0.1)
  saleCommission        Decimal                @default(0.1)
  serviceCommission     Decimal                @default(0.15)
  
  // Members & Permissions
  members               AgencyMember[]
  
  // Properties & Services
  properties            Property[]             @relation("agencyProperties")
  services              Service[]              @relation("agencyServices")
  
  // Wallet
  wallet                AgencyWallet?
  transactions          AgencyTransaction[]
  
  // Status
  isActive              Boolean                @default(true)
  suspendedAt           DateTime?
  suspensionReason      String?
  
  createdAt             DateTime               @default(now())
  updatedAt             DateTime               @updatedAt
  
  @@index([email])
  @@index([isVerified])
  @@index([city])
}

model AgencyMember {
  id                    String                 @id @default(cuid())
  agencyId              String
  agency                Agency                 @relation(fields: [agencyId], references: [id], onDelete: Cascade)
  
  userId                String
  user                  User                   @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  role                  String                 @default("member")  // "admin", "manager", "member"
  permissions           String[]               // Array of permission strings
  
  joinedAt              DateTime               @default(now())
  invitedAt             DateTime?              
  invitedBy             String?                // User ID of inviter
  
  isActive              Boolean                @default(true)
  
  @@unique([agencyId, userId])
  @@index([agencyId])
  @@index([userId])
}

model AgencyWallet {
  id                    String                 @id @default(cuid())
  agencyId              String                 @unique
  agency                Agency                 @relation(fields: [agencyId], references: [id], onDelete: Cascade)
  
  balance               Decimal                @default(0)
  currency              String                 @default("NGN")
  
  totalEarned           Decimal                @default(0)
  totalWithdrawn        Decimal                @default(0)
  totalDisputed         Decimal                @default(0)
  
  bankName              String?
  accountNumber         String?
  accountHolder         String?
  
  lastWithdrawalAt      DateTime?
  
  createdAt             DateTime               @default(now())
  updatedAt             DateTime               @updatedAt
  
  @@index([agencyId])
}

model AgencyTransaction {
  id                    String                 @id @default(cuid())
  agencyId              String
  agency                Agency                 @relation(fields: [agencyId], references: [id], onDelete: Cascade)
  
  type                  String                 // "deposit", "withdrawal", "commission_earned", "commission_deduction"
  amount                Decimal
  currency              String                 @default("NGN")
  status                String                 @default("pending")  // "pending", "completed", "failed"
  
  reference             String?                @unique
  description           String?
  paymentMethod         String?                // "paystack", "bank_transfer"
  
  createdAt             DateTime               @default(now())
  updatedAt             DateTime               @updatedAt
  
  @@index([agencyId])
  @@index([type])
  @@index([status])
}

// Update User model to support agencies
model User {
  id                    String                 @id @default(cuid())
  email                 String                 @unique
  emailVerified         DateTime?
  phone                 String?                @unique
  firstName             String?
  lastName              String?
  displayName           String?
  avatar                String?
  bio                    String?
  role                  UserRole               @default(TENANT)
  passwordHash          String?
  
  // Verification & KYC
  verificationStatus    VerificationStatus     @default(PENDING)
  verificationDocument  String?
  verificationSubmittedAt DateTime?
  verificationApprovedAt DateTime?
  kycApproved           Boolean                @default(false)
  
  // Location & Contact
  address               String?
  city                  String?
  state                 String?
  country               String?
  zipCode               String?
  latitude              Float?
  longitude             Float?
  
  // Preferences
  language              String                 @default("en")
  currency              String                 @default("NGN")
  darkMode              Boolean                @default(false)
  notificationsEnabled  Boolean                @default(true)
  
  // Account Status
  isActive              Boolean                @default(true)
  isSuspended           Boolean                @default(false)
  
  // Agency membership
  agencyMembership      AgencyMember[]
  primaryAgencyId       String?                // Agency user works for
  
  // Relationships
  properties            Property[]
  services              Service[]
  bids                  Bid[]
  reviewsGiven          Review[]               @relation("reviewer")
  favoriteProperties    FavoriteProperty[]
  favoriteArtisans      FavoriteArtisan[]
  savedSearches         SavedSearch[]
  chatConversations     ChatConversation[]     @relation("participants")
  chatMessages          ChatMessage[]          @relation("sender")
  transactions          Transaction[]
  wallet                Wallet?
  walletTransactions    WalletTransaction[]
  notifications         Notification[]
  
  createdAt             DateTime               @default(now())
  updatedAt             DateTime               @updatedAt
  lastLoginAt           DateTime?
  
  @@index([email])
  @@index([role])
  @@index([primaryAgencyId])
}

// Update Property model to support agencies
model Property {
  id                    String                 @id @default(cuid())
  ownerId               String
  owner                 User                   @relation(fields: [ownerId], references: [id], onDelete: Cascade)
  
  agencyId              String?                // If listed by agency
  agency                Agency?                @relation("agencyProperties", fields: [agencyId], references: [id], onDelete: SetNull)
  
  title                 String
  description           String                 @db.Text
  propertyType          PropertyType
  status                PropertyStatus         @default(FOR_RENT)
  
  // Location
  address               String
  city                  String
  state                 String
  country               String
  zipCode               String?
  latitude              Float
  longitude             Float
  
  // Details
  bedrooms              Int
  bathrooms             Decimal
  squareFeet            Int?
  yearBuilt             Int?
  parkingSpaces         Int?                   @default(0)
  hasGarden             Boolean                @default(false)
  hasBalcony            Boolean                @default(false)
  hasPool               Boolean                @default(false)
  hasGym                Boolean                @default(false)
  hasSecurity           Boolean                @default(false)
  hasBorehole           Boolean                @default(false)
  hasGenerator          Boolean                @default(false)
  
  // Pricing
  rentalPrice           Decimal?
  salePrice             Decimal?
  currency              String                 @default("NGN")
  pricePerUnit          String?
  
  // Media
  images                String[]               // Array of image URLs
  videos                String[]               // Array of video URLs
  floorPlan             String?
  has3DTour             Boolean                @default(false)
  
  // Availability
  availableFrom         DateTime?
  availableUntil        DateTime?
  
  // Moderation
  isApproved            Boolean                @default(false)
  approvedAt            DateTime?
  rejectionReason       String?
  isArchived            Boolean                @default(false)
  archivedAt            DateTime?
  
  // Metadata
  views                 Int                    @default(0)
  favorites             Int                    @default(0)
  
  // Relationships
  applications          PropertyApplication[]
  offers                PropertyOffer[]
  favoriteBy            FavoriteProperty[]
  reviews               Review[]               @relation("propertyReviews")
  
  createdAt             DateTime               @default(now())
  updatedAt             DateTime               @updatedAt
  publishedAt           DateTime?
  
  @@index([ownerId])
  @@index([agencyId])
  @@index([propertyType])
  @@index([city])
}

// Update Service model to support agencies
model Service {
  id                    String                 @id @default(cuid())
  artisanId             String
  artisan               User                   @relation(fields: [artisanId], references: [id], onDelete: Cascade)
  
  agencyId              String?                // If managed by agency
  agency                Agency?                @relation("agencyServices", fields: [agencyId], references: [id], onDelete: SetNull)
  
  category              ServiceCategory
  subcategory           String
  title                 String
  description           String                 @db.Text
  
  basePrice             Decimal?
  currency              String                 @default("NGN")
  priceType             String                 @default("fixed")
  
  includedServices      String[]
  excludedServices      String[]
  
  images                String[]
  videoUrl              String?
  
  estimatedDuration     String?
  deliveryTime          Int?
  
  isActive              Boolean                @default(true)
  isFeatured            Boolean                @default(false)
  
  averageRating         Float                  @default(0)
  totalOrders           Int                    @default(0)
  
  bids                  Bid[]
  projects              Project[]
  reviews               Review[]               @relation("serviceReviews")
  
  createdAt             DateTime               @default(now())
  updatedAt             DateTime               @updatedAt
  
  @@index([artisanId])
  @@index([agencyId])
  @@index([category])
}
