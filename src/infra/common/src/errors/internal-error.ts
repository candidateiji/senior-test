export class InternalError extends Error {
  constructor(_: unknown) {
    super(String(_));
  }
}
