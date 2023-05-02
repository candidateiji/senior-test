import { isZodError } from "@inato/infra-common/dist/errors";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import { fromZodError } from "zod-validation-error";

export const errorToString = (_: unknown) => {
  if (isZodError(_)) {
    return TE.left(fromZodError(_, { prefix: "", prefixSeparator: "" }).message);
  }

  return pipe(_, E.toError, (error) => error?.message ?? "Unknown error", TE.left);
};
