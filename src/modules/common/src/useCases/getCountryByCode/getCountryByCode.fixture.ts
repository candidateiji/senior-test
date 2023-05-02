import type { ExtractFailure, ExtractInput, ExtractOutput, OmitDeps } from "@inato/infra-common";
import * as TE from "fp-ts/TaskEither";
import { expect } from "vitest";

import type { Country, CountryRaw } from "../../domain/country";
import type { GetCountryByCode } from "./getCountryByCode.handler";
import { handler } from "./getCountryByCode.handler";

let fn: OmitDeps<GetCountryByCode>;
let result: ExtractOutput<GetCountryByCode>;

export const given = {
  countriesExist: (countries: CountryRaw[]) => {
    fn = handler({
      getAllCountries: () => TE.right(countries.map((country) => country as Country)),
    });
  },
};

export const reset = () => {
  fn = handler({ getAllCountries: () => TE.right([]) });
};

export const then = {
  resultIsFailure: async (expectedResult: ExtractFailure<GetCountryByCode>) => {
    const actual = await result();
    const expected = await TE.left(expectedResult)();
    expect(actual).toEqual(expected);
  },
  resultIsSuccess: async (expectedResult: CountryRaw) => {
    const actual = await result();
    const expected = await TE.right(expectedResult)();
    expect(actual).toEqual(expected);
  },
};

export const when = {
  inputIs: ({ countryCode }: ExtractInput<GetCountryByCode>) => {
    result = fn({
      countryCode,
    });
  },
};

export type Context = {
  given: typeof given;
  when: typeof when;
  then: typeof then;
};
