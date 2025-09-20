-- CreateEnum
CREATE TYPE "public"."StatusBooking" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELED', 'COMPLETED');

-- AlterTable
ALTER TABLE "public"."users" ALTER COLUMN "created_at" SET DEFAULT now(),
ALTER COLUMN "updated_at" SET DEFAULT now();

-- CreateTable
CREATE TABLE "public"."bookings" (
    "id" TEXT NOT NULL,
    "checkin_at" TIMESTAMP(3) NOT NULL,
    "checkout_at" TIMESTAMP(3) NOT NULL,
    "number_guest" INTEGER NOT NULL,
    "value_base" DECIMAL(65,30) NOT NULL,
    "value_guest" DECIMAL(65,30) NOT NULL,
    "value_host" DECIMAL(65,30) NOT NULL,
    "value_tax" DECIMAL(65,30) NOT NULL,
    "platform_fee" DECIMAL(65,30) NOT NULL,
    "status" "public"."StatusBooking" NOT NULL DEFAULT 'PENDING',
    "user_id" TEXT NOT NULL,
    "property_id" TEXT NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."bookings" ADD CONSTRAINT "bookings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bookings" ADD CONSTRAINT "bookings_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
