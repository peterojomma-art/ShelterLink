'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { PropertyCard } from '@/components/property/PropertyCard';
import { ArtisanCard } from '@/components/artisan/ArtisanCard';
import { useSession } from 'next-auth/react';

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

export default function HomePage() {
  const { data: session } = useSession();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/properties?pageSize=6');
      if (response.ok) {
        const data = await response.json();
        setProperties(data.data.items);
      }
    } catch (error) {
      console.error('Failed to fetch properties', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
                Find Your Dream Home or Expert Services
              </h1>
              <p className="text-lg text-muted-foreground">
                Connect with property owners, tenants, and verified artisans. Browse properties, post projects, or showcase your skills.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {session ? (
                  <>
                    <Link href="/dashboard">
                      <Button size="lg" className="w-full sm:w-auto">
                        Go to Dashboard
                      </Button>
                    </Link>
                    <Link href="/properties">
                      <Button size="lg" variant="outline" className="w-full sm:w-auto">
                        Browse Properties
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/auth/signup">
                      <Button size="lg" className="w-full sm:w-auto">
                        Get Started
                      </Button>
                    </Link>
                    <Link href="/auth/login">
                      <Button size="lg" variant="outline" className="w-full sm:w-auto">
                        Sign In
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg h-80 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <svg className="w-32 h-32 mx-auto opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2.393-2.393a1 1 0 011.414 0l2.293 2.293m0-2.5l2.393-2.393a1 1 0 011.414 0l2.293 2.293M3 20h18a1 1 0 001-1V7a1 1 0 00-1-1H5a1 1 0 00-1 1v12a1 1 0 001 1z" />
                  </svg>
                  <p>Your Properties & Services</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose ShelterLink?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🏠',
                title: 'Verified Properties',
                description: 'Browse verified listings with complete information and photos',
              },
              {
                icon: '⭐',
                title: 'Trusted Artisans',
                description: 'Connect with verified professionals and craftsmen',
              },
              {
                icon: '🔒',
                title: 'Secure Transactions',
                description: 'Safe payments and escrow protection for peace of mind',
              },
              {
                icon: '💬',
                title: 'Direct Messaging',
                description: 'Communicate directly with owners and service providers',
              },
              {
                icon: '📱',
                title: 'Mobile First',
                description: 'Seamless experience on all devices, anytime, anywhere',
              },
              {
                icon: '⚡',
                title: 'Fast & Easy',
                description: 'Quick listing, bidding, and booking processes',
              },
            ].map((feature, idx) => (
              <div key={idx} className="text-center">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-12 sm:py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Featured Properties</h2>
            <Link href="/properties" className="text-primary hover:underline">
              View all →
            </Link>
          </div>
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading properties...</p>
            </div>
          ) : properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  {...property}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No properties available yet</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 bg-gradient-to-r from-primary/90 to-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to find your next opportunity?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Whether you're looking for a home, services, or business opportunities, ShelterLink connects you with the right people.
          </p>
          {!session && (
            <Link href="/auth/signup">
              <Button size="lg" variant="secondary">
                Get Started for Free
              </Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
