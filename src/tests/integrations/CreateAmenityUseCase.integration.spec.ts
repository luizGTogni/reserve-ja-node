import { AmenityAlreadyExistsError } from "@/application/errors/AmenityAlreadyExistsError";
import type { IAmenitiesRepository } from "@/application/repositories/IAmenitiesRepository";
import { CreateAmenityUseCase } from "@/application/use-cases/amenities/CreateAmenityUseCase";
import { prisma } from "@/infrastructure/prisma/client";
import { PrismaAmenitiesRepository } from "@/infrastructure/repositories/prisma/PrismaAmenitiesRepository";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

let amenitiesRepository: IAmenitiesRepository;
let sut: CreateAmenityUseCase;

describe("Create Amenity Use Case (Integration)", () => {
  beforeEach(() => {
    amenitiesRepository = new PrismaAmenitiesRepository();
    sut = new CreateAmenityUseCase(amenitiesRepository);
  });

  afterEach(async () => {
    await prisma.amenity.deleteMany();
  });

  it("Should be able to create an amenity", async () => {
    const { amenity } = await sut.execute({
      title: "Amenity 1",
      description: "Amenity Description",
    });

    expect(amenity).toHaveProperty("id");
    expect(amenity).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: "Amenity 1",
        description: "Amenity Description",
      }),
    );
  });

  it("should not be able to create an amenity with same title", async () => {
    await sut.execute({
      title: "Amenity 1",
      description: "Amenity Description",
    });

    await expect(() =>
      sut.execute({
        title: "Amenity 1",
        description: "Amenity Description 2",
      }),
    ).rejects.toBeInstanceOf(AmenityAlreadyExistsError);
  });
});
