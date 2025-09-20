import type { Booking } from "@/domain/entities/Booking";
import type { BookingCreate } from "@/domain/entities/dto/BookingCreate";

export interface IBookingsRepository {
  findByOnBookingDate(
    checkInAt: Date,
    checkOutAt: Date,
  ): Promise<Booking | null>;
  create(data: BookingCreate): Promise<Booking>;
}
