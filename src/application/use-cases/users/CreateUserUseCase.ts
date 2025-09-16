import type { User } from "@/domain/entities/User";
import { UserAlreadyExistsError } from "../../errors/UserAlreadyExistsError";
import type { IUsersRepository } from "../../repositories/IUsersRepository";
import type { IHasher } from "../../services/IHasher";

type CreateUserRequest = {
  name: string;
  email: string;
  password: string;
};

type CreateUserResponse = {
  user: User;
};

export class CreateUserUseCase {
  constructor(
    private readonly usersRepository: IUsersRepository,
    private readonly hasher: IHasher,
  ) {}

  async execute({
    name,
    email,
    password,
  }: CreateUserRequest): Promise<CreateUserResponse> {
    const userAlreadyExists = await this.usersRepository.findByEmail(email);

    if (userAlreadyExists) {
      throw new UserAlreadyExistsError();
    }

    const passwordHashed = await this.hasher.toHash(password);

    const user = await this.usersRepository.create({
      name,
      email,
      password: passwordHashed,
    });

    return { user };
  }
}
