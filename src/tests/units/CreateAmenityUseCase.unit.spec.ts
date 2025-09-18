import { AmenityAlreadyExistsError } from "@/application/errors/AmenityAlreadyExistsError";
import type { IAmenitiesRepository } from "@/application/repositories/IAmenitiesRepository";
import { CreateAmenityUseCase } from "@/application/use-cases/amenities/CreateAmenityUseCase";
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type MockInstance,
} from "vitest";
import { InMemoryAmenitiesRepository } from "./mocks/InMemoryAmenitiesRepository";

let amenitiesRepository: IAmenitiesRepository;
let sut: CreateAmenityUseCase;
let spyCreate: MockInstance;

describe("Create Amenity Use Case (Unit)", () => {
  beforeEach(() => {
    amenitiesRepository = new InMemoryAmenitiesRepository();
    sut = new CreateAmenityUseCase(amenitiesRepository);

    spyCreate = vi.spyOn(amenitiesRepository, "create");
  });

  it("Should be able to create an amenity", async () => {
    const { amenity } = await sut.execute({
      title: "Amenity 1",
      description: "Amenity Description",
    });

    expect(amenity).toHaveProperty("id");
    expect(amenity.id).toEqual(expect.any(String));
    expect(spyCreate).toHaveBeenCalledWith(
      expect.objectContaining({
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
