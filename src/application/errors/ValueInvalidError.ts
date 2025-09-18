export class ValueInvalidError extends Error {
  constructor(field: string) {
    super(`Value invalid (${field}).`);
    this.name = "ValueInvalidError";
  }
}
