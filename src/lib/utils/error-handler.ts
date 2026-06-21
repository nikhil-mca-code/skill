import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export type ApiError = {
  code: string;
  message: string;
  details?: unknown;
};

export function handleError(error: unknown): NextResponse {
  console.error('API Error:', error);

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: error.errors,
        },
      },
      { status: 422 }
    );
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'CONFLICT',
            message: `Duplicate field: ${(error.meta?.target as string[])?.join(', ')}`,
          },
        },
        { status: 409 }
      );
    }
    // Record not found
    if (error.code === 'P2025') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Record not found',
          },
        },
        { status: 404 }
      );
    }
  }

  // Generic internal error
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred',
      },
    },
    { status: 500 }
  );
}