import { UserAlreadyExistsError } from "@/application/errors/UserAlreadyExistsError";
import type { IUsersRepository } from "@/application/repositories/IUsersRepository";
import type { IHasher } from "@/application/services/IHasher";
import { CreateUserUseCase } from "@/application/use-cases/users/CreateUserUseCase";
import { BcryptHasher } from "@/infrastructure/drivers/hashers/BcryptHasher";
import { prisma } from "@/infrastructure/prisma/client";
import { PrismaUsersRepository } from "@/infrastructure/repositories/prisma/PrismaUsersRepository";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

let usersRepository: IUsersRepository;
let hasher: IHasher;
let sut: CreateUserUseCase;

describe("Create User Use Case (Integration)", () => {
  beforeEach(() => {
    usersRepository = new PrismaUsersRepository();
    hasher = new BcryptHasher();
    sut = new CreateUserUseCase(usersRepository, hasher);
  });

  afterEach(async () => {
    await prisma.user.deleteMany();
  });

  it("Should be able to create user", async () => {
    const { user } = await sut.execute({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    expect(user).toHaveProperty("id");
    expect(user).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: "John Doe",
        email: "johndoe@example.com",
        password_hash: expect.any(String),
      }),
    );
  });

  it("should hash user password upon registration", async () => {
    const { user } = await sut.execute({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    const isPasswordCorrectlyHashed = await hasher.compare({
      plain: "123456",
      hashed: user.password_hash,
    });

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("should not be able to create user with same email", async () => {
    await sut.execute({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    await expect(() =>
      sut.execute({
        name: "John Doe",
        email: "johndoe@example.com",
        password: "123456",
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
