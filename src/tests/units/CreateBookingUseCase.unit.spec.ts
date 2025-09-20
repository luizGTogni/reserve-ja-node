import { PropertyAlreadyBookedError } from "@/application/errors/PropertyAlreadyBookedError";
import { PropertyNoLongerAvailableError } from "@/application/errors/PropertyNoLongerAvailableError";
import { ValueInvalidError } from "@/application/errors/ValueInvalidError";
import type { IBookingsRepository } from "@/application/repositories/IBookingsRepository";
import type { IPropertiesRepository } from "@/application/repositories/IPropertiesRepository";
import { CreateBookingUseCase } from "@/application/use-cases/bookings/CreateBookingUseCase";
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type MockInstance,
} from "vitest";
import { InMemoryBookingsRepository } from "./mocks/InMemoryBookingsRepository";
import { InMemoryPropertiesRepository } from "./mocks/InMemoryPropertiesRepository";

let bookingsRepository: IBookingsRepository;
let propertiesRepository: IPropertiesRepository;
let sut: CreateBookingUseCase;
let spyCreate: MockInstance;

describe("Create Booking Use Case (Unit)", () => {
  beforeEach(() => {
    bookingsRepository = new InMemoryBookingsRepository();
    propertiesRepository = new InMemoryPropertiesRepository();
    sut = new CreateBookingUseCase(bookingsRepository, propertiesRepository);

    spyCreate = vi.spyOn(bookingsRepository, "create");
  });

  it("Should be able to booking a property", async () => {
    const property = await propertiesRepository.create({
      title: "House 1",
      description: "House Description",
      host_id: "user-1",
      price_base: 100,
      refund_policy: "TOTAL",
      capacity: 8,
      latitude: -47.854582,
      longitude: -28.78475,
      amenities: [],
    });

    const { booking } = await sut.execute({
      userId: "user-1",
      propertyId: property.id,
      numberGuests: 6,
      checkInAt: new Date(Date.UTC(2025, 8, 20)),
      checkOutAt: new Date(Date.UTC(2025, 8, 24)),
    });

    expect(booking).toHaveProperty("id");
    expect(booking.id).toEqual(expect.any(String));
    expect(spyCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        property_id: property.id,
      }),
    );

    expect(booking).toEqual(
      expect.objectContaining({
        user_id: "user-1",
        property_id: property.id,
        checkin_at: new Date("2025-09-20T00:00:00.000Z"),
        checkout_at: new Date("2025-09-24T00:00:00.000Z"),
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
        userId: "user-1",
        propertyId: "property_id_not_found",
        numberGuests: 6,
        checkInAt: new Date(Date.UTC(2025, 8, 20)),
        checkOutAt: new Date(Date.UTC(2025, 8, 24)),
      }),
    ).rejects.toBeInstanceOf(PropertyNoLongerAvailableError);
  });

  it("Should not be able to a booking if property is already booked in same days", async () => {
    const property = await propertiesRepository.create({
      title: "House 1",
      description: "House Description",
      host_id: "user-1",
      price_base: 100,
      refund_policy: "TOTAL",
      capacity: 8,
      latitude: -47.854582,
      longitude: -28.78475,
      amenities: [],
    });

    await sut.execute({
      userId: "user-1",
      propertyId: property.id,
      numberGuests: 6,
      checkInAt: new Date(Date.UTC(2025, 8, 20)),
      checkOutAt: new Date(Date.UTC(2025, 8, 24)),
    });

    await expect(() =>
      sut.execute({
        userId: "user-1",
        propertyId: property.id,
        numberGuests: 6,
        checkInAt: new Date(Date.UTC(2025, 8, 23)),
        checkOutAt: new Date(Date.UTC(2025, 8, 28)),
      }),
    ).rejects.toBeInstanceOf(PropertyAlreadyBookedError);
  });

  it("Should not be able to a booking if number guests bigger than property capacity", async () => {
    const property = await propertiesRepository.create({
      title: "House 1",
      description: "House Description",
      host_id: "user-1",
      price_base: 100,
      refund_policy: "TOTAL",
      capacity: 8,
      latitude: -47.854582,
      longitude: -28.78475,
      amenities: [],
    });

    await expect(() =>
      sut.execute({
        userId: "user-1",
        propertyId: property.id,
        numberGuests: 10,
        checkInAt: new Date(Date.UTC(2025, 8, 23)),
        checkOutAt: new Date(Date.UTC(2025, 8, 28)),
      }),
    ).rejects.toBeInstanceOf(ValueInvalidError);
  });
});
