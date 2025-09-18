import type { Amenity } from "../Amenity";

export type PropertyCreate = {
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  price_base: number;
  capacity: number;
  refund_policy: "TOTAL" | "PARCIAL";
  host_id: string;
  amenities: Amenity[];
};
