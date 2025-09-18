import type { IPropertiesRepository } from "@/application/repositories/IPropertiesRepository";
import type { PropertyCreate } from "@/domain/entities/dto/PropertyCreate";
import type { Property } from "@/domain/entities/Property";
import { randomUUID } from "crypto";

export class InMemoryPropertiesRepository implements IPropertiesRepository {
  private properties: Property[] = [];

  async create(data: PropertyCreate) {
    const propertyCreated: Property = {
      id: randomUUID(),
      title: data.title,
      description: data.description,
      latitude: data.latitude,
      longitude: data.longitude,
      host_id: data.host_id,
      capacity: data.capacity,
      price_base: data.price_base,
      refund_policy: data.refund_policy,
      created_at: new Date(),
      updated_at: new Date(),
    };

    this.properties.push(propertyCreated);

    return propertyCreated;
  }
}
