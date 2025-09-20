import type { IUsersRepository } from "@/application/repositories/IUsersRepository";
import type { UserCreate } from "@/domain/entities/dto/UserCreate";
import type { User } from "@/domain/entities/User";
import { randomUUID } from "crypto";

export class InMemoryUsersRepository implements IUsersRepository {
  private users: User[] = [];

  async findById(id: string) {
    return this.users.find((user) => user.id === id) || null;
  }

  async findByEmail(email: string) {
    return this.users.find((user) => user.email === email) || null;
  }

  async create(data: UserCreate) {
    const userCreated: User = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password,
      role: "GUEST",
      created_at: new Date(),
      updated_at: new Date(),
    };

    this.users.push(userCreated);

    return userCreated;
  }
}
