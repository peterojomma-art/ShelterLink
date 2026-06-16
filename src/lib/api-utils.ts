import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UnauthorizedError, ForbiddenError } from '@/utils/error';

export async function requireAuth(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new UnauthorizedError('Authentication required');
  }

  return session;
}

export async function requireRole(req: NextRequest, allowedRoles: string[]) {
  const session = await requireAuth(req);
  const userRole = (session.user as any).role;

  if (!allowedRoles.includes(userRole)) {
    throw new ForbiddenError('Insufficient permissions');
  }

  return session;
}

export function respondSuccess<T>(data: T, message?: string, statusCode: number = 200) {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    { status: statusCode }
  );
}

export function respondError(message: string, statusCode: number = 400, errors?: any[]) {
  return NextResponse.json(
    {
      success: false,
      message,
      errors,
    },
    { status: statusCode }
  );
}

export async function validateRequestBody<T>(
  req: NextRequest,
  schema: any
): Promise<T> {
  try {
    const body = await req.json();
    return schema.parse(body);
  } catch (error: any) {
    throw new Error(`Invalid request body: ${error.message}`);
  }
}
