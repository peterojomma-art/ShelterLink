'use client';

import React from 'react';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted border-t border-border mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold mb-2">
              S
            </div>
            <h3 className="font-bold mb-2">ShelterLink</h3>
            <p className="text-sm text-muted-foreground">
              Connecting property owners, tenants, and verified artisans.
            </p>
          </div>

          {/* Properties */}
          <div>
            <h4 className="font-semibold mb-4">Properties</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/properties" className="hover:text-primary">
                  Browse Properties
                </Link>
              </li>
              <li>
                <Link href="/properties/post" className="hover:text-primary">
                  Post Property
                </Link>
              </li>
              <li>
                <Link href="/for-agents" className="hover:text-primary">
                  For Agents
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/artisans" className="hover:text-primary">
                  Find Artisans
                </Link>
              </li>
              <li>
                <Link href="/post-project" className="hover:text-primary">
                  Post a Project
                </Link>
              </li>
              <li>
                <Link href="/become-artisan" className="hover:text-primary">
                  Become an Artisan
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-primary">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} ShelterLink. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0 text-sm">
            <Link href="/privacy" className="hover:text-primary">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-primary">
              Terms
            </Link>
            <Link href="/security" className="hover:text-primary">
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
