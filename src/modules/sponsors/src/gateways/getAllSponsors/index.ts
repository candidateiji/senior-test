import { InternalError, trials } from "@inato/infra-common";
import { pipe } from "fp-ts/function";
import * as RA from "fp-ts/ReadonlyArray";
import * as TE from "fp-ts/TaskEither";

import type { GetAllSponsors } from "../../domain/sponsor";
import { SPONSOR_NAME_SCHEMA } from "../../domain/sponsor";

export const getAllSponsors: GetAllSponsors = () => {
  const parseSponsor = ({ sponsor }: { sponsor: string }) =>
    TE.tryCatch(
      () => SPONSOR_NAME_SCHEMA.parseAsync(sponsor),
      (error) => new InternalError(error)
    );

  return pipe(
    trials,
    RA.map(parseSponsor),
    /**
     * ReadonlyArray<TaskEither<E, A>> -> TaskEither<E, ReadonlyArray<A>>
     */
    RA.sequence(TE.ApplicativePar)
  );
};
