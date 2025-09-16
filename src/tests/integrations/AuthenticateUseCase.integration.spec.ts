import { InvalidCredentialsError } from "@/application/errors/InvalidCredentialsError";
import type { IUsersRepository } from "@/application/repositories/IUsersRepository";
import type { IHasher } from "@/application/services/IHasher";
import { AuthenticateUseCase } from "@/application/use-cases/AuthenticateUseCase";
import { BcryptHasher } from "@/infrastructure/drivers/hashers/BcryptHasher";
import { prisma } from "@/infrastructure/prisma/client";
import { PrismaUsersRepository } from "@/infrastructure/repositories/prisma/PrismaUsersRepository";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

let usersRepository: IUsersRepository;
let hasher: IHasher;
let sut: AuthenticateUseCase;

describe("Authenticate Use Case (Integration)", () => {
  beforeEach(() => {
    usersRepository = new PrismaUsersRepository();
    hasher = new BcryptHasher();
    sut = new AuthenticateUseCase(usersRepository, hasher);
  });

  afterEach(async () => {
    await prisma.user.deleteMany();
  });

  it("Should be able to authenticate with email and password", async () => {
    const userCreated = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: await hasher.toHash("123456"),
    });

    const { user } = await sut.execute({
      email: "johndoe@example.com",
      password: "123456",
    });

    expect(user).toHaveProperty("id");
    expect(user).toEqual(
      expect.objectContaining({
        id: userCreated.id,
        name: userCreated.name,
        email: userCreated.email,
        password_hash: userCreated.password_hash,
      }),
    );
  });

  it("should be not able to authenticate with wrong email", async () => {
    await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: await hasher.toHash("123456"),
    });

    await expect(() =>
      sut.execute({
        email: "email_wrong@example.com",
        password: "123456",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("should be not able to authenticate with wrong password", async () => {
    await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: await hasher.toHash("123456"),
    });

    await expect(() =>
      sut.execute({
        email: "johndoe@example.com",
        password: "password_wrong",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
