-- Add new profile fields to User table
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "phone" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "website" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "linkedin" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "twitter" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "github" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "languages" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "interests" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "experienceYears" INTEGER;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "availability" TEXT DEFAULT 'AVAILABLE';
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "preferredMeetingType" TEXT DEFAULT 'BOTH';

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS "User_location_idx" ON "User"("location");
CREATE INDEX IF NOT EXISTS "User_availability_idx" ON "User"("availability");
