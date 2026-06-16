'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import Image from 'next/image';

interface PropertyCardProps {
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
  onFavorite?: (id: string) => void;
  isFavorited?: boolean;
}

export function PropertyCard({
  id,
  title,
  description,
  address,
  city,
  bedrooms,
  bathrooms,
  rentalPrice,
  salePrice,
  images,
  views,
  favorites,
  onFavorite,
  isFavorited = false,
}: PropertyCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  const price = rentalPrice || salePrice;
  const priceLabel = rentalPrice ? '/month' : '';

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image Container */}
      <div
        className="relative w-full h-48 bg-muted overflow-hidden group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {images[0] && (
          <Image
            src={images[0]}
            alt={title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
        )}

        {/* Image Count Badge */}
        <Badge className="absolute top-2 right-2 bg-black/50 text-white border-0">
          {images.length} photos
        </Badge>

        {/* Favorite Button */}
        <button
          onClick={() => onFavorite?.(id)}
          className="absolute top-2 left-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
        >
          <svg
            className={`w-5 h-5 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <CardContent className="pt-4">
        <div className="mb-3">
          <h3 className="font-semibold text-lg truncate mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">
            {address}, {city}
          </p>
        </div>

        {/* Details */}
        <div className="flex justify-between text-sm mb-4">
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.5 1.5H3.75A2.25 2.25 0 001.5 3.75v12.5A2.25 2.25 0 003.75 18.5h12.5a2.25 2.25 0 002.25-2.25V9.5" />
            </svg>
            <span>{bedrooms} bed</span>
          </div>
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 012-2h6a2 2 0 012 2v12a1 1 0 11-2 0V4H6v12a1 1 0 11-2 0V4z" />
            </svg>
            <span>{bathrooms} bath</span>
          </div>
        </div>

        {/* Price */}
        {price && (
          <div className="mb-4">
            <p className="text-xl font-bold text-primary">
              ₦{price.toLocaleString()}
              <span className="text-sm font-normal text-muted-foreground">{priceLabel}</span>
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="flex justify-between text-xs text-muted-foreground border-t border-border pt-3">
          <span>👁 {views} views</span>
          <span>❤️ {favorites} favorites</span>
        </div>
      </CardContent>
    </Card>
  );
}
