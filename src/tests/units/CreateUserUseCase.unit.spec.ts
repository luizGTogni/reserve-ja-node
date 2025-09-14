import { UserAlreadyExistsError } from "@/application/errors/UserAlreadyExistsError";
import type { IUsersRepository } from "@/application/repositories/IUsersRepository";
import type { IHasher } from "@/application/services/IHasher";
import type { CompareParams } from "@/application/services/types/IHasher.types";
import { CreateUserUseCase } from "@/application/use-cases/CreateUserUseCase";
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type MockInstance,
} from "vitest";
import { InMemoryUsersRepository } from "./mocks/InMemoryUsersRepository";

let usersRepository: IUsersRepository;
let mockHasher: IHasher;
let sut: CreateUserUseCase;
let spyCreate: MockInstance;

describe("Create User Use Case (Unit)", () => {
  beforeEach(() => {
    mockHasher = mockHasher = {
      toHash: vi.fn(async (plain: string) => `hashed-${plain}`),
      compare: vi.fn(
        async ({ plain, hashed }: CompareParams) =>
          hashed === `hashed-${plain}`,
      ),
    };

    usersRepository = new InMemoryUsersRepository();
    sut = new CreateUserUseCase(usersRepository, mockHasher);

    spyCreate = vi.spyOn(usersRepository, "create");
  });

  it("Should be able to create user", async () => {
    const { user } = await sut.execute({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    expect(user).toHaveProperty("id");
    expect(user.id).toEqual(expect.any(String));
    expect(mockHasher.toHash).toHaveBeenCalledWith("123456");
    expect(spyCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "johndoe@example.com",
      }),
    );
  });

  it("should hash user password upon registration", async () => {
    const { user } = await sut.execute({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    const isPasswordCorrectlyHashed = await mockHasher.compare({
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
