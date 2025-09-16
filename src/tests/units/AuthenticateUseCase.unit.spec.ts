import { InvalidCredentialsError } from "@/application/errors/InvalidCredentialsError";
import type { IUsersRepository } from "@/application/repositories/IUsersRepository";
import type { IHasher } from "@/application/services/IHasher";
import type { CompareParams } from "@/application/services/types/IHasher.types";
import { AuthenticateUseCase } from "@/application/use-cases/users/AuthenticateUseCase";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { InMemoryUsersRepository } from "./mocks/InMemoryUsersRepository";

let usersRepository: IUsersRepository;
let mockHasher: IHasher;
let sut: AuthenticateUseCase;

describe("Authenticate Use Case (Unit)", () => {
  beforeEach(() => {
    mockHasher = {
      toHash: vi.fn(async (plain: string) => `hashed-${plain}`),
      compare: vi.fn(
        async ({ plain, hashed }: CompareParams) =>
          hashed === `hashed-${plain}`,
      ),
    };

    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(usersRepository, mockHasher);
  });

  it("Should be able to authenticate with email and password", async () => {
    const userCreated = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: await mockHasher.toHash("123456"),
    });

    const { user } = await sut.execute({
      email: "johndoe@example.com",
      password: "123456",
    });

    expect(user).toHaveProperty("id");
    expect(user.id).toEqual(expect.any(String));
    expect(mockHasher.compare).toHaveBeenCalledWith({
      plain: "123456",
      hashed: userCreated.password_hash,
    });
  });

  it("should be not able to authenticate with wrong email", async () => {
    await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: await mockHasher.toHash("123456"),
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
      password: await mockHasher.toHash("123456"),
    });

    await expect(() =>
      sut.execute({
        email: "johndoe@example.com",
        password: "password_wrong",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
