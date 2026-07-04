'use client';

import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!session) {
    redirect('/auth/login');
  }

  const userRole = (session.user as any).role;

  const dashboardLinks = {
    TENANT: [
      { href: '/dashboard/tenant/applications', label: 'My Applications' },
      { href: '/dashboard/tenant/favorites', label: 'Saved Properties' },
      { href: '/dashboard/tenant/messages', label: 'Messages' },
    ],
    OWNER: [
      { href: '/dashboard/owner/properties', label: 'My Properties' },
      { href: '/dashboard/owner/applications', label: 'Applications' },
      { href: '/dashboard/owner/messages', label: 'Messages' },
    ],
    ARTISAN: [
      { href: '/dashboard/artisan/services', label: 'My Services' },
      { href: '/dashboard/artisan/projects', label: 'Projects & Bids' },
      { href: '/dashboard/artisan/earnings', label: 'Earnings' },
    ],
    ADMIN: [
      { href: '/dashboard/admin/users', label: 'Manage Users' },
      { href: '/dashboard/admin/verifications', label: 'Verifications' },
      { href: '/dashboard/admin/properties', label: 'Properties' },
    ],
  };

  const links = dashboardLinks[userRole as keyof typeof dashboardLinks] || [];

  return (
    <div className="min-h-screen bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome, {session.user?.name}!
          </h1>
          <p className="text-muted-foreground">
            Role: <span className="font-semibold capitalize">{userRole.toLowerCase()}</span>
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardContent className="pt-6">
                  <p className="font-semibold text-center">{link.label}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle>Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-700">
                  Welcome to your ShelterLink dashboard! Here you can manage your activities based on your role.
                </p>
              </div>

              {/* Role-specific content */}
              {userRole === 'TENANT' && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Tenant Dashboard</h3>
                  <p className="text-muted-foreground">
                    Browse properties, submit applications, and track your housing search in one place.
                  </p>
                  <Link href="/properties">
                    <Button>Browse Properties</Button>
                  </Link>
                </div>
              )}

              {userRole === 'OWNER' && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Property Owner Dashboard</h3>
                  <p className="text-muted-foreground">
                    List your properties, review applications, and manage your rentals or sales.
                  </p>
                  <Link href="/dashboard/owner/properties/new">
                    <Button>Post New Property</Button>
                  </Link>
                </div>
              )}

              {userRole === 'ARTISAN' && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Artisan Dashboard</h3>
                  <p className="text-muted-foreground">
                    Showcase your services, bid on projects, and grow your business on ShelterLink.
                  </p>
                  <Link href="/dashboard/artisan/services/new">
                    <Button>Add Service</Button>
                  </Link>
                </div>
              )}

              {userRole === 'ADMIN' && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Admin Dashboard</h3>
                  <p className="text-muted-foreground">
                    Manage platform users, verify artisans, and moderate content.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Logout */}
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={() => signOut({ callbackUrl: '/' })}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
