import { ValueInvalidError } from "@/application/errors/ValueInvalidError";
import type { IPropertiesRepository } from "@/application/repositories/IPropertiesRepository";
import { CreatePropertyUseCase } from "@/application/use-cases/properties/CreatePropertyUseCase";
import type { User } from "@/domain/entities/User";
import { prisma } from "@/infrastructure/prisma/client";
import { PrismaPropertiesRepository } from "@/infrastructure/repositories/prisma/PrismaPropertiesRepository";
import { hash } from "bcryptjs";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

let propertiesRepository: IPropertiesRepository;
let user: User;
let sut: CreatePropertyUseCase;

describe("Create Property Use Case (Integration)", () => {
  beforeEach(() => {
    propertiesRepository = new PrismaPropertiesRepository();
    sut = new CreatePropertyUseCase(propertiesRepository);
  });

  beforeAll(async () => {
    user = await prisma.user.create({
      data: {
        name: "John Doe",
        email: "johndoe@example.com",
        password_hash: await hash("123456", 6),
      },
    });
  });

  afterEach(async () => {
    await prisma.property.deleteMany();
  });

  it("Should be able to create a property", async () => {
    const { property } = await sut.execute({
      title: "House 1",
      description: "House Description",
      userId: user.id,
      price_base: 250.5,
      refund_policy: "TOTAL",
      capacity: 8,
      latitude: -47.854582,
      longitude: -28.78475,
    });

    expect(property).toHaveProperty("id");
    expect(property).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: "House 1",
        description: "House Description",
        host_id: user.id,
        price_base: 250.5,
        refund_policy: "TOTAL",
        capacity: 8,
        latitude: -47.854582,
        longitude: -28.78475,
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      }),
    );
  });

  it("should not be able to create a property with price base less than or equal to 0", async () => {
    await expect(() =>
      sut.execute({
        title: "House 1",
        description: "House Description",
        userId: user.id,
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
        userId: user.id,
        price_base: 250.5,
        refund_policy: "TOTAL",
        capacity: 0,
        latitude: -47.854582,
        longitude: -28.78475,
      }),
    ).rejects.toBeInstanceOf(ValueInvalidError);
  });
});
