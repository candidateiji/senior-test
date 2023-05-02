import { tryParseInput } from "@inato/infra-common";
import type { ConsoleHandler } from "@inato/infra-console";
import { errorToString } from "@inato/infra-console";
import type { Ports } from "@inato/modules-trials";
import { flow, pipe } from "fp-ts/function";
import * as RA from "fp-ts/ReadonlyArray";
import * as TE from "fp-ts/TaskEither";
import { z } from "zod";

const schema = z.object({
  countryCode: z.string().length(2),
});

type Input = z.infer<typeof schema>;

export type Handler = ConsoleHandler<Ports["GetOngoingTrialsByCountry"], Input>;

export const handler: Handler = (fn) => (input) =>
  pipe(
    input,
    (a) => a,
    tryParseInput(schema),
    TE.fold(
      (b) => TE.left(b),
      (c) => TE.right(c)
    ),
    TE.chain(fn),
    TE.fold(
      errorToString,
      flow(
        RA.map((trial) => `${trial.name},${trial.countryCode}`),
        (_) => _.join("\n"),
        (_) => TE.right(_)
      )
    )
  )();
