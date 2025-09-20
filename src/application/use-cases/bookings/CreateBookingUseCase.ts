import { PropertyAlreadyBookedError } from "@/application/errors/PropertyAlreadyBookedError";
import { PropertyNoLongerAvailableError } from "@/application/errors/PropertyNoLongerAvailableError";
import { ValueInvalidError } from "@/application/errors/ValueInvalidError";
import type { IBookingsRepository } from "@/application/repositories/IBookingsRepository";
import type { IPropertiesRepository } from "@/application/repositories/IPropertiesRepository";
import { calculatePrice } from "@/application/utils/calculatePrice";
import type { Booking } from "@/domain/entities/Booking";

type CreateBookingRequest = {
  userId: string;
  propertyId: string;
  numberGuests: number;
  checkInAt: Date;
  checkOutAt: Date;
};

type CreateBookingResponse = {
  booking: Booking;
};

export class CreateBookingUseCase {
  constructor(
    private readonly bookingsRepository: IBookingsRepository,
    private readonly propertiesRepository: IPropertiesRepository,
  ) {}

  async execute({
    userId,
    propertyId,
    numberGuests,
    checkInAt,
    checkOutAt,
  }: CreateBookingRequest): Promise<CreateBookingResponse> {
    const property = await this.propertiesRepository.findById(propertyId);

    if (!property) {
      throw new PropertyNoLongerAvailableError();
    }

    const isOnSameDate = await this.bookingsRepository.findByOnBookingDate(
      checkInAt,
      checkOutAt,
    );

    if (isOnSameDate) {
      throw new PropertyAlreadyBookedError();
    }

    if (numberGuests > property.capacity || numberGuests <= 0) {
      throw new ValueInvalidError("number guests");
    }

    const valuesPricesFinal = calculatePrice({
      checkInDate: checkInAt,
      checkOutDate: checkOutAt,
      priceBase: property.price_base,
    });

    const booking = await this.bookingsRepository.create({
      user_id: userId,
      property_id: propertyId,
      checkin_at: checkInAt,
      checkout_at: checkOutAt,
      number_guest: numberGuests,
      status: "PENDING",
      value_base: property.price_base,
      value_guest: valuesPricesFinal.priceFinalGuest,
      value_host: valuesPricesFinal.valueFinalHost,
      value_tax: valuesPricesFinal.valueTax,
      platform_fee: valuesPricesFinal.platformFee,
    });

    return { booking };
  }
}
