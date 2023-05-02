export class InvalidParameterError extends Error {
  constructor(message: string) {
    super(`Invalid parameter: ${message}`);
  }
}
