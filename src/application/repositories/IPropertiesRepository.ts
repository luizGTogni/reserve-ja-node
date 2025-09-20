import type { PropertyCreate } from "@/domain/entities/dto/PropertyCreate";
import type { Property } from "@/domain/entities/Property";

export interface IPropertiesRepository {
  findById(id: string): Promise<Property | null>;
  create(data: PropertyCreate): Promise<Property>;
}
