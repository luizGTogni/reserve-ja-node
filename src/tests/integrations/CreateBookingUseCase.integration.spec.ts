import { PropertyAlreadyBookedError } from "@/application/errors/PropertyAlreadyBookedError";
import { PropertyNoLongerAvailableError } from "@/application/errors/PropertyNoLongerAvailableError";
import { ValueInvalidError } from "@/application/errors/ValueInvalidError";
import type { IBookingsRepository } from "@/application/repositories/IBookingsRepository";
import type { IPropertiesRepository } from "@/application/repositories/IPropertiesRepository";
import { CreateBookingUseCase } from "@/application/use-cases/bookings/CreateBookingUseCase";
import type { User } from "@/domain/entities/User";
import { prisma } from "@/infrastructure/prisma/client";
import { PrismaBookingsRepository } from "@/infrastructure/repositories/prisma/PrismaBookingsRepository";
import { PrismaPropertiesRepository } from "@/infrastructure/repositories/prisma/PrismaPropertiesRepository";
import { hash } from "bcryptjs";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

let bookingsRepository: IBookingsRepository;
let propertiesRepository: IPropertiesRepository;
let user: User;
let sut: CreateBookingUseCase;

describe("Create Booking Use Case (Integration)", () => {
  beforeEach(() => {
    bookingsRepository = new PrismaBookingsRepository();
    propertiesRepository = new PrismaPropertiesRepository();
    sut = new CreateBookingUseCase(bookingsRepository, propertiesRepository);
  });

  afterEach(async () => {
    await prisma.booking.deleteMany();
    await prisma.property.deleteMany();
  });

  beforeAll(async () => {
    user = await prisma.user.create({
      data: {
        name: "John Doe",
        email: "johndoe@example.com",
        password_hash: await hash("123456", 6),
      },
    });
  });

  it("Should be able to booking a property", async () => {
    const property = await propertiesRepository.create({
      title: "House 1",
      description: "House Description",
      host_id: user.id,
      price_base: 100,
      refund_policy: "TOTAL",
      capacity: 8,
      latitude: -47.854582,
      longitude: -28.78475,
      amenities: [],
    });

    const { booking } = await sut.execute({
      userId: user.id,
      propertyId: property.id,
      numberGuests: 6,
      checkInAt: new Date(2025, 8, 20),
      checkOutAt: new Date(2025, 8, 24),
    });

    expect(booking).toHaveProperty("id");
    expect(booking.id).toEqual(expect.any(String));
    expect(booking).toEqual(
      expect.objectContaining({
        user_id: user.id,
        property_id: property.id,
        checkin_at: new Date("2025-09-20T03:00:00.000Z"),
        checkout_at: new Date("2025-09-24T03:00:00.000Z"),
        number_guest: 6,
        status: "PENDING",
        value_base: 100,
        value_guest: 400,
        value_host: 304,
        value_tax: 20,
        platform_fee: 76,
      }),
    );
  });

  it("Should not be able to a booking if property not found", async () => {
    await expect(() =>
      sut.execute({
        userId: user.id,
        propertyId: "property_id_not_found",
        numberGuests: 6,
        checkInAt: new Date(2025, 8, 23),
        checkOutAt: new Date(2025, 8, 28),
      }),
    ).rejects.toBeInstanceOf(PropertyNoLongerAvailableError);
  });

  it("Should not be able to a booking if property is already booked in same days", async () => {
    const property = await propertiesRepository.create({
      title: "House 1",
      description: "House Description",
      host_id: user.id,
      price_base: 100,
      refund_policy: "TOTAL",
      capacity: 8,
      latitude: -47.854582,
      longitude: -28.78475,
      amenities: [],
    });

    await sut.execute({
      userId: user.id,
      propertyId: property.id,
      numberGuests: 6,
      checkInAt: new Date(2025, 8, 20),
      checkOutAt: new Date(2025, 8, 24),
    });

    await expect(() =>
      sut.execute({
        userId: user.id,
        propertyId: property.id,
        numberGuests: 6,
        checkInAt: new Date(2025, 8, 23),
        checkOutAt: new Date(2025, 8, 28),
      }),
    ).rejects.toBeInstanceOf(PropertyAlreadyBookedError);
  });

  it("Should not be able to a booking if number guests bigger than property capacity", async () => {
    const property = await propertiesRepository.create({
      title: "House 1",
      description: "House Description",
      host_id: user.id,
      price_base: 100,
      refund_policy: "TOTAL",
      capacity: 8,
      latitude: -47.854582,
      longitude: -28.78475,
      amenities: [],
    });

    await expect(() =>
      sut.execute({
        userId: user.id,
        propertyId: property.id,
        numberGuests: 10,
        checkInAt: new Date(2025, 8, 23),
        checkOutAt: new Date(2025, 8, 28),
      }),
    ).rejects.toBeInstanceOf(ValueInvalidError);
  });
});
