import type {
  ExtractFailure,
  ExtractInput,
  ExtractOutput,
  InternalError,
  InvalidParameterError,
  OmitDeps,
} from "@inato/infra-common";
import type { Country, UnknownCountryError } from "@inato/modules-common";
import * as TE from "fp-ts/TaskEither";
import { expect } from "vitest";

import type { Trial } from "../../domain";
import type { GetOngoingTrialsByCountry } from "./getOngoingTrialsByCountry.handler";
import { handler } from "./getOngoingTrialsByCountry.handler";

let fn: OmitDeps<GetOngoingTrialsByCountry>;
let result: ExtractOutput<GetOngoingTrialsByCountry>;

type Failure = InternalError | InvalidParameterError | UnknownCountryError;

export const given = {
  trials: (
    trials: TE.TaskEither<InternalError, ReadonlyArray<Trial>>,
    now: Date,
    country: TE.TaskEither<Failure, Country> = TE.right({ code: "US", name: "USA" } as Country)
  ) => {
    fn = handler({
      getOngoingTrials: () => trials,
      getCountryByCode: () => country,
    });
  },
};

export const reset = () => {
  fn = handler({
    getOngoingTrials: () => TE.right([]),
    getCountryByCode: () => TE.right({ code: "US", name: "USA" } as Country),
  });
};

export const then = {
  resultIsFailure: async (expectedResult: ExtractFailure<GetOngoingTrialsByCountry>) => {
    const actual = await result();
    const expected = await TE.left(expectedResult)();
    expect(actual).toEqual(expected);
  },
  resultIsSuccess: async (expectedResult: ReadonlyArray<Trial>) => {
    const actual = await result();
    const expected = await TE.right(expectedResult)();
    expect(actual).toEqual(expected);
  },
};

export const when = {
  inputIs: ({ countryCode }: ExtractInput<GetOngoingTrialsByCountry>) => {
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
