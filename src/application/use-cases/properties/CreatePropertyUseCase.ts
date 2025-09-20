import { ValueInvalidError } from "@/application/errors/ValueInvalidError";
import type { IPropertiesRepository } from "@/application/repositories/IPropertiesRepository";
import type { Property } from "@/domain/entities/Property";

type CreatePropertyRequest = {
  userId: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  price_base: number;
  capacity: number;
  refund_policy: "TOTAL" | "PARCIAL";
};

type CreatePropertyResponse = {
  property: Property;
};

export class CreatePropertyUseCase {
  constructor(private readonly propertiesRepository: IPropertiesRepository) {}

  async execute(data: CreatePropertyRequest): Promise<CreatePropertyResponse> {
    if (data.price_base <= 0) {
      throw new ValueInvalidError("Price Base");
    }

    if (data.capacity <= 0) {
      throw new ValueInvalidError("Capacity");
    }

    const property = await this.propertiesRepository.create({
      ...data,
      host_id: data.userId,
      amenities: [],
    });

    return { property };
  }
}
