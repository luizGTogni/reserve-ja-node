export interface Property {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  price_base: number;
  capacity: number;
  refund_policy: "TOTAL" | "PARCIAL";
  created_at: Date;
  updated_at: Date;
  host_id: string;
}
