import type { User } from "@/domain/entities/User";
import { InvalidCredentialsError } from "../../errors/InvalidCredentialsError";
import type { IUsersRepository } from "../../repositories/IUsersRepository";
import type { IHasher } from "../../services/IHasher";

type AuthenticateRequest = {
  email: string;
  password: string;
};

type AuthenticateResponse = {
  user: User;
};

export class AuthenticateUseCase {
  constructor(
    private readonly usersRepository: IUsersRepository,
    private readonly hasher: IHasher,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateRequest): Promise<AuthenticateResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const doesPasswordMatches = await this.hasher.compare({
      plain: password,
      hashed: user.password_hash,
    });

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError();
    }

    return { user };
  }
}
