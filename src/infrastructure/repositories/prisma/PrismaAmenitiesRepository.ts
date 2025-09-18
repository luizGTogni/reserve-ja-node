import type { IAmenitiesRepository } from "@/application/repositories/IAmenitiesRepository";
import type { AmenityCreate } from "@/domain/entities/dto/AmenityCreate";
import { prisma } from "@/infrastructure/prisma/client";

export class PrismaAmenitiesRepository implements IAmenitiesRepository {
  async findByTitle(title: string) {
    return await prisma.amenity.findUnique({
      where: {
        title,
      },
    });
  }

  async create({ title, description }: AmenityCreate) {
    const amenity = await prisma.amenity.create({
      data: {
        title,
        description: description || "",
      },
    });

    return amenity;
  }
}
