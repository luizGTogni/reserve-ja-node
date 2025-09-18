import type { Amenity } from "@/domain/entities/Amenity";
import type { AmenityCreate } from "@/domain/entities/dto/AmenityCreate";

export interface IAmenitiesRepository {
  findByTitle(title: string): Promise<Amenity | null>;
  create(data: AmenityCreate): Promise<Amenity>;
}
