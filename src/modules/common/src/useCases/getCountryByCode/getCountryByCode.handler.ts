import type { InternalError, InvalidParameterError } from "@inato/infra-common";
import { tryParseInput } from "@inato/infra-common";
import { flow, pipe } from "fp-ts/function";
import * as O from "fp-ts/Option";
import * as RA from "fp-ts/ReadonlyArray";
import * as TE from "fp-ts/TaskEither";
import { z } from "zod";

import type { Country, GetAllCountries } from "../../domain/country";
import { COUNTRY_CODE_RAW_SCHEMA, UnknownCountryError } from "../../domain/country";

type Deps = {
  getAllCountries: GetAllCountries;
};

const schema = z.object({
  countryCode: COUNTRY_CODE_RAW_SCHEMA,
});

type Input = z.infer<typeof schema>;

type Failure = InternalError | InvalidParameterError | UnknownCountryError;

type Output = TE.TaskEither<Failure, Country>;

export type GetCountryByCode = (deps: Deps) => (input: Input) => Output;

export const handler: GetCountryByCode = ({ getAllCountries }) => {
  const findCountryByCode = (countryCode: string) =>
    RA.findFirst((country: { code: string }) => country.code === countryCode);

  return flow(
    tryParseInput(schema),
    TE.chain(({ countryCode }) =>
      pipe(
        getAllCountries(),
        TE.map(findCountryByCode(countryCode)),
        TE.chain(O.match(() => TE.left(new UnknownCountryError(countryCode)), TE.right))
      )
    )
  );
};
