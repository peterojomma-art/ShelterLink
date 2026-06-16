'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { Button } from '@/components/ui/Button';
import { PropertyCard } from '@/components/property/PropertyCard';
import { ArtisanCard } from '@/components/artisan/ArtisanCard';

interface Property {
  id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  rentalPrice?: number;
  salePrice?: number;
  images: string[];
  views: number;
  favorites: number;
}

interface Artisan {
  id: string;
  displayName: string;
  businessName?: string;
  avatar?: string;
  category: string;
  averageRating: number;
  totalReviews: number;
  isVerified: boolean;
  yearsOfExperience?: number;
}

export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propsRes, artisansRes] = await Promise.all([
          fetch('/api/properties?page=1&pageSize=6'),
          fetch('/api/services?page=1&pageSize=6'),
        ]);

        if (propsRes.ok) {
          const propsData = await propsRes.json();
          setProperties(propsData.data?.items || []);
        }

        if (artisansRes.ok) {
          const artisansData = await artisansRes.json();
          setArtisans(artisansData.data?.items || []);
        }
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-primary/80 text-white py-12 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Find Your Perfect Home & Services
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Connect with property owners, tenants, and verified artisans. Search homes,
              book services, and build your dream space.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/properties">
                <Button size="lg" variant="secondary">
                  🏠 Browse Properties
                </Button>
              </Link>
              <Link href="/artisans">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  🔨 Find Services
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-12">Why Choose ShelterLink?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '✓',
                title: 'Verified Users',
                description: 'All artisans and property owners are verified for your peace of mind',
              },
              {
                icon: '💰',
                title: 'Secure Payments',
                description: 'Safe transactions with Paystack integration and escrow services',
              },
              {
                icon: '📱',
                title: 'Mobile First',
                description: 'Seamlessly browse properties and book services on any device',
              },
              {
                icon: '💬',
                title: 'Real-time Chat',
                description: 'Communicate directly with property owners and service providers',
              },
              {
                icon: '⭐',
                title: 'Ratings & Reviews',
                description: 'Make informed decisions based on real user experiences',
              },
              {
                icon: '🚀',
                title: 'Quick Verification',
                description: 'Get verified in minutes and start offering your services',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-background rounded-lg border border-border hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      {properties.length > 0 && (
        <section className="py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl md:text-4xl font-bold">Featured Properties</h2>
              <Link href="/properties">
                <Button variant="outline">View All</Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <Link key={property.id} href={`/properties/${property.id}`}>
                  <PropertyCard {...property} />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of users finding their perfect homes and services.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" variant="secondary">
                Sign Up Now
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
