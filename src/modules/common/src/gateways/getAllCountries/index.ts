import { countries, InternalError } from "@inato/infra-common";
import { pipe } from "fp-ts/function";
import * as RA from "fp-ts/ReadonlyArray";
import * as TE from "fp-ts/TaskEither";

import type { GetAllCountries } from "../../domain/country";
import { COUNTRY_SCHEMA } from "../../domain/country";

export const getAllCountries: GetAllCountries = () => {
  const parseCountry = (country: { code: string; name: string }) =>
    TE.tryCatch(
      () => COUNTRY_SCHEMA.parseAsync(country),
      (error) => new InternalError(error)
    );

  return pipe(
    countries,
    RA.map(parseCountry),
    /**
     * ReadonlyArray<TaskEither<E, A>> -> TaskEither<E, ReadonlyArray<A>>
     */
    RA.sequence(TE.ApplicativePar)
  );
};
