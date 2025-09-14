import type { UserCreate } from "@/domain/entities/dto/UserCreate";
import type { User } from "@/domain/entities/User";

export interface IUsersRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: UserCreate): Promise<User>;
}
