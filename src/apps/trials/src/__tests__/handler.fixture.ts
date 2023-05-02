import type { ExtractInput, ExtractOutput, OmitDeps } from "@inato/infra-common";
import type { GetOngoingTrialsByCountry } from "@inato/modules-trials/dist/useCases/getOngoingTrialsByCountry";
import * as TE from "fp-ts/TaskEither";
import { expect } from "vitest";

import type { Handler } from "../handler";
import { handler } from "../handler";

let fn: OmitDeps<GetOngoingTrialsByCountry>;
let result: ExtractOutput<Handler>;

export const given = {
  fnReturns: (output: ExtractOutput<GetOngoingTrialsByCountry>) => {
    fn = () => output;
  },
};

export const reset = () => {
  fn = () => TE.right([]);
};

export const then = {
  resultIsFailure: async (expectedResult: string) => {
    const actual = await result;
    const expected = await TE.left(expectedResult)();
    expect(actual).toEqual(expected);
  },
  resultIsSuccess: async (expectedResult: string) => {
    const actual = await result;
    const expected = await TE.right(expectedResult)();
    expect(actual).toEqual(expected);
  },
};

export const when = {
  inputIs: (input: ExtractInput<GetOngoingTrialsByCountry>) => {
    result = handler(fn)(input);
  },
};

export type Context = {
  given: typeof given;
  when: typeof when;
  then: typeof then;
};
