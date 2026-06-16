# ShelterLink - Two-Sided Real Estate & Artisan Marketplace

🏠 **ShelterLink** is a comprehensive platform connecting property owners, tenants, buyers, and verified artisans/professionals. Built with modern technologies for a seamless, secure, and trustworthy experience.

## Features

### Real Estate Marketplace
- 📍 Rich property listings with photos, videos, 3D tours, and floor plans
- 🔍 Advanced search & filters (price, location, bedrooms, property type)
- ❤️ Saved searches and favorites
- 💬 In-app messaging between parties
- 📅 Virtual tours and viewing scheduling
- 📝 Application/Offer submission with document uploads

### Artisan & Professional Services
- ✅ Verified artisans (ID, licenses, portfolio, references)
- 🎯 Service categories and subcategories
- ⭐ Reviews, ratings, and verified badges
- 📊 Portfolio gallery and work examples
- 💼 Project posting and bidding system
- 📋 Quotation and booking system

### Shared Features
- 👤 User profiles with verification status
- ⭐ Reviews and ratings (post-transaction)
- 💳 Secure payment with Stripe & Paystack
- 📱 Commission system (10% rentals/sales, 15% services)
- 🔔 Notifications (email, push, in-app)
- 📚 Blog & market insights
- 📈 Analytics dashboards
- 🌙 Dark mode support
- 📱 Mobile-responsive PWA

## Tech Stack

### Frontend
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** for components
- **React Hook Form** + **Zod** for validation

### Backend
- **Next.js API Routes** with TypeScript
- **NextAuth.js** for authentication
- **Node.js** runtime

### Database & ORM
- **PostgreSQL** with **Prisma ORM**
- **PostGIS** for geospatial queries

### Services & Integrations
- **UploadThing** for file uploads
- **Mapbox** & **Google Maps** for location
- **Pusher** for real-time chat & notifications
- **Stripe** & **Paystack** for payments
- **NextAuth.js** for auth (Email, Google OAuth, Phone OTP)

### DevOps
- **Docker** & **Docker Compose** for containerization
- **Vercel** ready deployment
- **Railway** compatible

## Project Structure

```
shelterlink/
├── src/
│   ├── app/                    # Next.js 15 App Router
│   │   ├── (auth)/            # Auth routes (login, signup, forgot-password)
│   │   ├── (dashboard)/       # Protected dashboard routes
│   │   │   ├── tenant/        # Tenant dashboard
│   │   │   ├── owner/         # Property owner dashboard
│   │   │   ├── artisan/       # Artisan dashboard
│   │   │   └── admin/         # Admin panel
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── properties/    # Property CRUD endpoints
│   │   │   ├── artisans/      # Artisan endpoints
│   │   │   ├── services/      # Service endpoints
│   │   │   ├── chat/          # Messaging endpoints
│   │   │   ├── payments/      # Payment endpoints
│   │   │   └── admin/         # Admin endpoints
│   │   ├── (public)/          # Public routes
│   │   │   ├── page.tsx       # Homepage
│   │   │   ├── properties/    # Browse properties
│   │   │   ├── artisans/      # Browse artisans
│   │   │   ├── blog/          # Blog posts
│   │   │   └── about/         # About page
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── shared/            # Shared components
│   │   ├── property/          # Property-specific components
│   │   ├── artisan/           # Artisan-specific components
│   │   ├── chat/              # Chat components
│   │   └── admin/             # Admin components
│   ├── lib/
│   │   ├── auth.ts            # NextAuth configuration
│   │   ├── db.ts              # Prisma client
│   │   ├── utils.ts           # Utility functions
│   │   ├── validation.ts      # Zod schemas
│   │   ├── payment.ts         # Payment integration
│   │   └── upload.ts          # File upload helpers
│   ├── types/
│   │   ├── index.ts           # Global types
│   │   ├── user.ts            # User types
│   │   ├── property.ts        # Property types
│   │   ├── artisan.ts         # Artisan types
│   │   └── api.ts             # API response types
│   ├── hooks/
│   │   ├── useAuth.ts         # Auth hook
│   │   ├── useUser.ts         # User hook
│   │   └── useProperty.ts     # Property hook
│   ├── utils/
│   │   ├── error.ts           # Error handling
│   │   ├── logger.ts          # Logging
│   │   └── validators.ts      # Input validation
│   └── styles/
│       └── globals.css        # Global styles
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.ts                # Seed script
│   └── migrations/            # Database migrations
├── public/
│   ├── images/
│   └── icons/
├── .env.example               # Environment variables template
├── docker-compose.yml         # Docker Compose configuration
├── Dockerfile                 # Docker image
├── next.config.js             # Next.js configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies
```

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or pnpm

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/peterojomma-art/shelterlink.git
   cd shelterlink
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Set up database with Docker**
   ```bash
   docker-compose up -d db
   ```

5. **Run database migrations**
   ```bash
   npm run db:push
   # Or for migration history:
   npm run db:migrate
   ```

6. **Seed development data**
   ```bash
   npm run db:seed
   ```

7. **Start development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Using Docker Compose

```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

## Database Setup

### View Prisma Studio
```bash
npm run db:studio
```

### Create a new migration
```bash
npm run db:migrate -- --name migration_name
```

## Development

### Type checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

### Code formatting
```bash
npm run format
```

### Testing
```bash
npm run test
npm run test:watch
```

## Build & Deployment

### Build for production
```bash
npm run build
```

### Start production server
```bash
npm start
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Railway
1. Push to GitHub
2. Connect repository to Railway
3. Add PostgreSQL plugin
4. Set environment variables
5. Deploy

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Property Endpoints
- `GET /api/properties` - List properties
- `GET /api/properties/:id` - Get property details
- `POST /api/properties` - Create property (authenticated)
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property
- `GET /api/properties/:id/applications` - Get property applications

### Artisan Endpoints
- `GET /api/artisans` - List artisans
- `GET /api/artisans/:id` - Get artisan profile
- `POST /api/artisans` - Register as artisan
- `PUT /api/artisans/:id` - Update artisan profile
- `GET /api/artisans/:id/services` - Get artisan's services
- `POST /api/artisans/:id/verification` - Submit verification documents

### Service Endpoints
- `GET /api/services` - List services
- `POST /api/services` - Create service
- `GET /api/services/:id/bids` - Get service bids

### Chat Endpoints
- `POST /api/chat/messages` - Send message
- `GET /api/chat/conversations` - Get user conversations
- `GET /api/chat/conversations/:id/messages` - Get conversation messages

## Security

- Input validation with **Zod**
- SQL injection prevention via **Prisma**
- Rate limiting on API routes
- CSRF protection
- Secure password hashing with **bcryptjs**
- JWT token-based authentication
- Environment variable protection
- HTTPS enforced in production
- Security headers configured

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@shelterlink.com or open an issue on GitHub.

## Roadmap

- [ ] Mobile app (React Native)
- [ ] Video verification for artisans
- [ ] AI-powered property recommendations
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Payment installment plans
- [ ] Blockchain-based property verification
- [ ] Integration with government property records

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Database with [Prisma](https://www.prisma.io/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
