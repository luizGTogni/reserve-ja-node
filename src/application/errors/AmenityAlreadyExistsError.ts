export class AmenityAlreadyExistsError extends Error {
  constructor() {
    super("Amenity already exists.");
    this.name = "AmenityAlreadyExistsError";
  }
}
