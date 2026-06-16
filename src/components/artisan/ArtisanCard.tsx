'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Image from 'next/image';
import { Star } from 'lucide-react';

interface ArtisanCardProps {
  id: string;
  name: string;
  businessName?: string;
  avatar?: string;
  category: string;
  averageRating: number;
  totalReviews: number;
  isVerified: boolean;
  yearsOfExperience?: number;
}

export function ArtisanCard({
  id,
  name,
  businessName,
  avatar,
  category,
  averageRating,
  totalReviews,
  isVerified,
  yearsOfExperience,
}: ArtisanCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Header with Avatar */}
      <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="flex items-center space-x-4 mb-3">
          {avatar ? (
            <Image
              src={avatar}
              alt={name}
              width={48}
              height={48}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              {name.charAt(0)}
            </div>
          )}
          <div className="flex-1">
            <h3 className="font-semibold truncate">{name}</h3>
            {businessName && (
              <p className="text-xs text-muted-foreground truncate">{businessName}</p>
            )}
          </div>
          {isVerified && (
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-2.77 3.066 3.066 0 00-3.58 3.03A6.124 6.124 0 001.5 12.75a6.124 6.124 0 006.332 6.116 6.09 6.089 0 003.093-.833 3.109 3.109 0 001.799-3.663 3.122 3.122 0 00-3.205-3.009 3.087 3.087 0 01-.778-6.066 3.066 3.066 0 005.078-2.457A12.224 12.224 0 005.904.75h.01a12.224 12.224 0 01.474 6.695 5.97 5.97 0 00.1 4.719 5.997 5.997 0 003.803 3.207 6.137 6.137 0 001.946.164h.003c.322 0 .641-.024.967-.052a6.133 6.133 0 005.396-5.404 6.06 6.06 0 00-1.884-4.904 4.118 4.118 0 00-7.893 1.066 7.1 7.1 0 01-.464-7.659" />
            </svg>
          )}
        </div>
      </div>

      {/* Content */}
      <CardContent className="pt-4">
        {/* Category */}
        <Badge variant="primary" className="mb-3">
          {category}
        </Badge>

        {/* Experience */}
        {yearsOfExperience && (
          <p className="text-sm text-muted-foreground mb-3">
            {yearsOfExperience} year{yearsOfExperience > 1 ? 's' : ''} of experience
          </p>
        )}

        {/* Rating */}
        <div className="flex items-center space-x-2 mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(averageRating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-medium">{averageRating.toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">({totalReviews})</span>
        </div>
      </CardContent>
    </Card>
  );
}
