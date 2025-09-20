export class PropertyNoLongerAvailableError extends Error {
  constructor() {
    super("Property is no longer available.");
    this.name = "PropertyNoLongerAvailableError";
  }
}
