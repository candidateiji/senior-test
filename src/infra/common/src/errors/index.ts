import { z } from "zod";

export const isZodError = (_: unknown): _ is z.ZodError =>
  _ instanceof z.ZodError ||
  (typeof _ === "object" && _ != null && "name" in _ && _["name"] === "ZodError");

export * from "./internal-error";
export * from "./invalid-parameter.error";
