import { pipe } from "fp-ts/function";
import { z } from "zod";

export const stringOfLength = (length: number): string =>
  pipe(
    Array.from({ length }).fill(null),
    (arr) => arr.map(() => "A"),
    (arr) => arr.join(""),
    (str) => str.substring(0, length)
  );

export const REASONABLY_SHORT_STRING_SCHEMA = z.string().min(1).max(255);
