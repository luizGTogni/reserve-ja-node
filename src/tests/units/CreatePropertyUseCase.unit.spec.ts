import { ValueInvalidError } from "@/application/errors/ValueInvalidError";
import type { IPropertiesRepository } from "@/application/repositories/IPropertiesRepository";
import { CreatePropertyUseCase } from "@/application/use-cases/properties/CreatePropertyUseCase";
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type MockInstance,
} from "vitest";
import { InMemoryPropertiesRepository } from "./mocks/InMemoryPropertiesRepository";

let propertiesRepository: IPropertiesRepository;
let sut: CreatePropertyUseCase;
let spyCreate: MockInstance;

describe("Create Property Use Case (Unit)", () => {
  beforeEach(() => {
    propertiesRepository = new InMemoryPropertiesRepository();
    sut = new CreatePropertyUseCase(propertiesRepository);

    spyCreate = vi.spyOn(propertiesRepository, "create");
  });

  it("Should be able to create a property", async () => {
    const { property } = await sut.execute({
      title: "House 1",
      description: "House Description",
      userId: "user-1",
      price_base: 250.5,
      refund_policy: "TOTAL",
      capacity: 8,
      latitude: -47.854582,
      longitude: -28.78475,
    });

    expect(property).toHaveProperty("id");
    expect(property.id).toEqual(expect.any(String));
    expect(spyCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "House 1",
        description: "House Description",
        userId: "user-1",
        price_base: 250.5,
        refund_policy: "TOTAL",
        capacity: 8,
        latitude: -47.854582,
        longitude: -28.78475,
      }),
    );
  });

  it("should not be able to create a property with price base less than or equal to 0", async () => {
    await expect(() =>
      sut.execute({
        title: "House 1",
        description: "House Description",
        userId: "user-1",
        price_base: 0,
        refund_policy: "TOTAL",
        capacity: 8,
        latitude: -47.854582,
        longitude: -28.78475,
      }),
    ).rejects.toBeInstanceOf(ValueInvalidError);
  });

  it("should not be able to create a property with capacity less than or equal to 0", async () => {
    await expect(() =>
      sut.execute({
        title: "House 1",
        description: "House Description",
        userId: "user-1",
        price_base: 250.5,
        refund_policy: "TOTAL",
        capacity: 0,
        latitude: -47.854582,
        longitude: -28.78475,
      }),
    ).rejects.toBeInstanceOf(ValueInvalidError);
  });
});
