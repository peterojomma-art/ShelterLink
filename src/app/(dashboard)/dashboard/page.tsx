'use client';

import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    redirect('/auth/login');
  }

  const user = session?.user as any;

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold">ShelterLink Dashboard</h1>
          <Button variant="ghost" onClick={() => signOut()}>
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    Welcome back, {user?.name || user?.email}!
                  </h2>
                  <p className="text-muted-foreground">
                    Role: <Badge>{user?.role}</Badge>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Role-based Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {user?.role === 'OWNER' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">My Properties</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">0</p>
                  <p className="text-sm text-muted-foreground mt-2">Properties listed</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">0</p>
                  <p className="text-sm text-muted-foreground mt-2">New applications</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Earnings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">₦0</p>
                  <p className="text-sm text-muted-foreground mt-2">Total earnings</p>
                </CardContent>
              </Card>
            </>
          )}

          {user?.role === 'ARTISAN' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">My Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">0</p>
                  <p className="text-sm text-muted-foreground mt-2">Services offered</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">0</p>
                  <p className="text-sm text-muted-foreground mt-2">Ongoing projects</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Wallet</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">₦0</p>
                  <p className="text-sm text-muted-foreground mt-2">Available balance</p>
                </CardContent>
              </Card>
            </>
          )}

          {user?.role === 'TENANT' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Saved Properties</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">0</p>
                  <p className="text-sm text-muted-foreground mt-2">In favorites</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">0</p>
                  <p className="text-sm text-muted-foreground mt-2">Submitted</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Messages</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">0</p>
                  <p className="text-sm text-muted-foreground mt-2">Unread</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {user?.role === 'OWNER' && (
                <>
                  <Button className="w-full">Post Property</Button>
                  <Button variant="outline" className="w-full">
                    View Applications
                  </Button>
                  <Button variant="outline" className="w-full">
                    View Earnings
                  </Button>
                  <Button variant="outline" className="w-full">
                    Settings
                  </Button>
                </>
              )}

              {user?.role === 'ARTISAN' && (
                <>
                  <Button className="w-full">Add Service</Button>
                  <Button variant="outline" className="w-full">
                    View Bids
                  </Button>
                  <Button variant="outline" className="w-full">
                    Withdraw Earnings
                  </Button>
                  <Button variant="outline" className="w-full">
                    Settings
                  </Button>
                </>
              )}

              {user?.role === 'TENANT' && (
                <>
                  <Button className="w-full">Browse Properties</Button>
                  <Button variant="outline" className="w-full">
                    View Applications
                  </Button>
                  <Button variant="outline" className="w-full">
                    Browse Services
                  </Button>
                  <Button variant="outline" className="w-full">
                    Settings
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
