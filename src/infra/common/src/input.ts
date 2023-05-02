import * as TE from "fp-ts/TaskEither";
import type { z } from "zod";
import { fromZodError } from "zod-validation-error";

import { isZodError } from "./errors";
import { InternalError } from "./errors/internal-error";
import { InvalidParameterError } from "./errors/invalid-parameter.error";

export const tryParseInput =
  <Output>(schema: z.ZodType<Output>) =>
  (input: unknown): TE.TaskEither<InvalidParameterError | InternalError, Output> =>
    TE.tryCatch(
      () => schema.parseAsync(input),
      (_) =>
        isZodError(_)
          ? new InvalidParameterError(fromZodError(_, { prefix: "", prefixSeparator: "" }).message)
          : new InternalError(_)
    );
