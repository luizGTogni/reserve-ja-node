import type { IBookingsRepository } from "@/application/repositories/IBookingsRepository";
import type { BookingCreate } from "@/domain/entities/dto/BookingCreate";
import { Decimal } from "@/generated/prisma/runtime/library";
import { prisma } from "@/infrastructure/prisma/client";
import dayjs from "dayjs";

export class PrismaBookingsRepository implements IBookingsRepository {
  async findByOnBookingDate(checkInAt: Date, checkOutAt: Date) {
    const startOfTheDay = dayjs(checkInAt).startOf("date");
    const endOfTheDay = dayjs(checkOutAt).endOf("date");

    const booking = await prisma.booking.findFirst({
      where: {
        OR: [
          {
            checkin_at: {
              gte: startOfTheDay.toDate(),
              lte: endOfTheDay.toDate(),
            },
          },
          {
            checkout_at: {
              gte: startOfTheDay.toDate(),
              lte: endOfTheDay.toDate(),
            },
          },
        ],
      },
    });

    if (!booking) {
      return null;
    }

    return {
      ...booking,
      value_base: booking.value_base.toNumber(),
      value_guest: booking.value_guest.toNumber(),
      value_host: booking.value_host.toNumber(),
      value_tax: booking.value_tax.toNumber(),
      platform_fee: booking.platform_fee.toNumber(),
    };
  }

  async create(data: BookingCreate) {
    const booking = await prisma.booking.create({
      data: {
        ...data,
        value_base: new Decimal(data.value_base),
        value_guest: new Decimal(data.value_guest),
        value_host: new Decimal(data.value_host),
        value_tax: new Decimal(data.value_tax),
        platform_fee: new Decimal(data.platform_fee),
      },
    });

    return {
      ...booking,
      value_base: data.value_base,
      value_guest: data.value_guest,
      value_host: data.value_host,
      value_tax: data.value_tax,
      platform_fee: data.platform_fee,
    };
  }
}
