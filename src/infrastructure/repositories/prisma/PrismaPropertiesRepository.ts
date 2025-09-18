import type { IPropertiesRepository } from "@/application/repositories/IPropertiesRepository";
import type { PropertyCreate } from "@/domain/entities/dto/PropertyCreate";
import { Decimal } from "@/generated/prisma/runtime/library";
import { prisma } from "@/infrastructure/prisma/client";

export class PrismaPropertiesRepository implements IPropertiesRepository {
  async create(data: PropertyCreate) {
    const property = await prisma.property.create({
      data: {
        title: data.title,
        description: data.description,
        capacity: data.capacity,
        price_base: data.price_base,
        refund_policy: data.refund_policy,
        host_id: data.host_id,
        latitude: new Decimal(data.latitude),
        longitude: new Decimal(data.longitude),
      },
    });

    return {
      ...property,
      latitude: data.latitude,
      longitude: data.longitude,
      price_base: data.price_base,
    };
  }
}
