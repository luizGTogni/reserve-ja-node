export type BookingCreate = {
  user_id: string;
  property_id: string;
  checkin_at: Date;
  checkout_at: Date;
  number_guest: number;
  value_base: number;
  value_guest: number;
  value_host: number;
  value_tax: number;
  platform_fee: number;
  status: "PENDING" | "CONFIRMED" | "CANCELED" | "COMPLETED";
};
