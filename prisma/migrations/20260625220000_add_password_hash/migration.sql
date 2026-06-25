-- Add password hash support for email/password authentication.
ALTER TABLE "users"
ADD COLUMN "passwordHash" TEXT;
