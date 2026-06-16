import { NextRequest, NextResponse } from 'next/server';
import { registerSchema } from '@/lib/validation';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { logger } from '@/utils/logger';
import { validateEmail } from '@/utils/validators';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate input
    const validated = registerSchema.parse(body);

    // Check if email already exists
    const existingUser = await db.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email already registered' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(validated.password, 10);

    // Create user
    const user = await db.user.create({
      data: {
        email: validated.email,
        firstName: validated.firstName,
        lastName: validated.lastName,
        passwordHash,
        role: validated.role,
        isActive: true,
      },
    });

    logger.info('New user registered', { email: validated.email, role: validated.role });

    return NextResponse.json(
      {
        success: true,
        message: 'Registration successful',
        data: {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    logger.error('Registration error', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation error',
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Registration failed' },
      { status: 500 }
    );
  }
}
