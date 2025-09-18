import { AmenityAlreadyExistsError } from "@/application/errors/AmenityAlreadyExistsError";
import type { IAmenitiesRepository } from "@/application/repositories/IAmenitiesRepository";
import type { Amenity } from "@/domain/entities/Amenity";

type CreateAmenityRequest = {
  title: string;
  description: string | null;
};

type CreateAmenityResponse = {
  amenity: Amenity;
};

export class CreateAmenityUseCase {
  constructor(private readonly amenitiesRepository: IAmenitiesRepository) {}

  async execute({
    title,
    description,
  }: CreateAmenityRequest): Promise<CreateAmenityResponse> {
    const amenityAlreadyExists =
      await this.amenitiesRepository.findByTitle(title);

    if (amenityAlreadyExists) {
      throw new AmenityAlreadyExistsError();
    }

    const amenity = await this.amenitiesRepository.create({
      title,
      description,
    });

    return { amenity };
  }
}
