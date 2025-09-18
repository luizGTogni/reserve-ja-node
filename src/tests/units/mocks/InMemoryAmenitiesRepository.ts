import type { IAmenitiesRepository } from "@/application/repositories/IAmenitiesRepository";
import type { Amenity } from "@/domain/entities/Amenity";
import type { AmenityCreate } from "@/domain/entities/dto/AmenityCreate";
import { randomUUID } from "crypto";

export class InMemoryAmenitiesRepository implements IAmenitiesRepository {
  private amenities: Amenity[] = [];

  async findByTitle(title: string) {
    return this.amenities.find((amenity) => amenity.title === title) || null;
  }

  async create(data: AmenityCreate) {
    const amenityCreated: Amenity = {
      id: randomUUID(),
      title: data.title,
      description: data.description || "",
    };

    this.amenities.push(amenityCreated);

    return amenityCreated;
  }
}
