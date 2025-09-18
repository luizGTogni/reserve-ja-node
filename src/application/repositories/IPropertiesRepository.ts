import type { PropertyCreate } from "@/domain/entities/dto/PropertyCreate";
import type { Property } from "@/domain/entities/Property";

export interface IPropertiesRepository {
  create(data: PropertyCreate): Promise<Property>;
}
