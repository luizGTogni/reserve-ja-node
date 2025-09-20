import type { IBookingsRepository } from "@/application/repositories/IBookingsRepository";
import type { Booking } from "@/domain/entities/Booking";
import type { BookingCreate } from "@/domain/entities/dto/BookingCreate";
import { randomUUID } from "crypto";
import dayjs from "dayjs";

export class InMemoryBookingsRepository implements IBookingsRepository {
  private bookings: Booking[] = [];

  async findByOnBookingDate(checkInAt: Date, checkOutAt: Date) {
    const startOfTheDay = dayjs(checkInAt).startOf("date");
    const endOfTheDay = dayjs(checkOutAt).endOf("date");

    const checkInOnSameDates =
      this.bookings.find((booking) => {
        const checkInDate = dayjs(booking.checkin_at);
        const checkOutDate = dayjs(booking.checkout_at);

        const isOnSameDate =
          (checkInDate.isAfter(startOfTheDay) &&
            checkInDate.isBefore(endOfTheDay)) ||
          (checkOutDate.isAfter(startOfTheDay) &&
            checkOutDate.isBefore(endOfTheDay));

        return isOnSameDate;
      }) || null;

    return checkInOnSameDates;
  }

  async create(data: BookingCreate) {
    const bookingCreated: Booking = {
      id: randomUUID(),
      ...data,
    };

    this.bookings.push(bookingCreated);

    return bookingCreated;
  }
}
