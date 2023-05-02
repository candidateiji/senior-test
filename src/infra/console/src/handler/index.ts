import type { OmitDeps } from "@inato/infra-common";
import type * as E from "fp-ts/Either";

export type ConsoleHandler<Handler, Input> = (
  fn: OmitDeps<Handler>
) => (input: Input) => Promise<E.Either<string, string>>;

export type ConsoleDefinition<Handler, Input> = {
  handler: ConsoleHandler<Handler, Input>;
  options: string[];
};
