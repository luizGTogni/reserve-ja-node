import type { IUsersRepository } from "@/application/repositories/IUsersRepository";
import type { UserCreate } from "@/domain/entities/dto/UserCreate";
import { prisma } from "@/infrastructure/prisma/client";

export class PrismaUsersRepository implements IUsersRepository {
  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  }

  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  }

  async create({ name, email, password }: UserCreate) {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password_hash: password,
      },
    });

    return user;
  }
}
