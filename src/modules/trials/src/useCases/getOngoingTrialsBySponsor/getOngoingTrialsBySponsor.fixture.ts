import type {
  ExtractFailure,
  ExtractInput,
  ExtractOutput,
  InternalError,
  InvalidParameterError,
  OmitDeps,
} from "@inato/infra-common";
import type { SponsorName, UnknownSponsorError } from "@inato/modules-sponsors";
import * as TE from "fp-ts/TaskEither";
import { expect } from "vitest";

import type { Trial } from "../../domain";
import type { GetOngoingTrialsBySponsor } from "./getOngoingTrialsBySponsor.handler";
import { handler } from "./getOngoingTrialsBySponsor.handler";

let fn: OmitDeps<GetOngoingTrialsBySponsor>;
let result: ExtractOutput<GetOngoingTrialsBySponsor>;

type Failure = InternalError | InvalidParameterError | UnknownSponsorError;

export const given = {
  trials: (
    trials: TE.TaskEither<InternalError, ReadonlyArray<Trial>>,
    now: Date,
    sponsor: TE.TaskEither<Failure, SponsorName> = TE.right("SPONSOR_1" as SponsorName)
  ) => {
    fn = handler({
      getOngoingTrials: () => trials,
      getSponsorByName: () => sponsor,
    });
  },
};

export const reset = () => {
  fn = handler({
    getOngoingTrials: () => TE.right([]),
    getSponsorByName: () => TE.right("SPONSOR_1" as SponsorName),
  });
};

export const then = {
  resultIsFailure: async (expectedResult: ExtractFailure<GetOngoingTrialsBySponsor>) => {
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
  inputIs: (input: ExtractInput<GetOngoingTrialsBySponsor>) => {
    result = fn(input);
  },
};

export type Context = {
  given: typeof given;
  then: typeof then;
  when: typeof when;
};
