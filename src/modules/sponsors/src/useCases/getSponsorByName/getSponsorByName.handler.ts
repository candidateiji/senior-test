import type { InternalError, InvalidParameterError } from "@inato/infra-common";
import { tryParseInput } from "@inato/infra-common";
import { flow, pipe } from "fp-ts/function";
import * as O from "fp-ts/Option";
import * as RA from "fp-ts/ReadonlyArray";
import * as TE from "fp-ts/TaskEither";
import { z } from "zod";

import type { GetAllSponsors, SponsorName } from "../../domain/sponsor";
import { SPONSOR_NAME_RAW_SCHEMA, UnknownSponsorError } from "../../domain/sponsor";

type Deps = {
  getAllSponsors: GetAllSponsors;
};

const schema = z.object({
  name: SPONSOR_NAME_RAW_SCHEMA,
});

type Input = z.infer<typeof schema>;

type Failure = InternalError | InvalidParameterError | UnknownSponsorError;

type Output = TE.TaskEither<Failure, SponsorName>;

export type GetSponsorByName = (deps: Deps) => (input: Input) => Output;

export const handler: GetSponsorByName = ({ getAllSponsors }) => {
  const findSponsorByName = (name: string) => RA.findFirst((sponsor) => sponsor === name);

  return flow(
    tryParseInput(schema),
    TE.chain(({ name }) =>
      pipe(
        getAllSponsors(),
        TE.map(findSponsorByName(name)),
        TE.chain(O.match(() => TE.left(new UnknownSponsorError(name)), TE.right))
      )
    )
  );
};
