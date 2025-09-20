import dayjs from "dayjs";

type CalculatePriceProps = {
  checkInDate: Date;
  checkOutDate: Date;
  priceBase: number;
};

type CalculatePriceResponse = {
  priceFinalGuest: number;
  valueFinalHost: number;
  valueTax: number;
  platformFee: number;
};

export function calculatePrice({
  checkInDate,
  checkOutDate,
  priceBase,
}: CalculatePriceProps): CalculatePriceResponse {
  const PERCENTAGE_TAX = 0.05;
  const PERCENTAGE_PLATFORM = 0.2;

  const daysBooked = dayjs(checkOutDate).diff(checkInDate, "days");
  const priceFinalGuest = priceBase * daysBooked;
  const valueTax = priceFinalGuest * PERCENTAGE_TAX;
  const platformFee = (priceFinalGuest - valueTax) * PERCENTAGE_PLATFORM;
  const valueFinalHost = priceFinalGuest - (valueTax + platformFee);

  return {
    priceFinalGuest,
    valueFinalHost,
    valueTax,
    platformFee,
  };
}
