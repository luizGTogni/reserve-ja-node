export class PropertyAlreadyBookedError extends Error {
  constructor() {
    super("Property is already booked.");
    this.name = "PropertyAlreadyBookedError";
  }
}
