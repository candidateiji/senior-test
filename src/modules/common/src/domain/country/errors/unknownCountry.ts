export class UnknownCountryError extends Error {
  constructor(name: string) {
    super(`Unknown country with code: ${name}`);
  }
}
