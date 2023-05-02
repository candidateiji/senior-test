import type {
  ExtractDeps,
  ExtractFailure,
  ExtractOutput,
  InternalError,
} from "@inato/infra-common";
import * as TE from "fp-ts/TaskEither";
import { expect } from "vitest";

import type { Trial } from "../../domain";
import type { GetOngoingTrials } from "./getOngoingTrials.handler";
import { handler } from "./getOngoingTrials.handler";

let result: ExtractOutput<GetOngoingTrials>;
let deps: ExtractDeps<GetOngoingTrials>;

export const given = {
  allTrials: (trials: TE.TaskEither<InternalError, ReadonlyArray<Trial>>) => {
    deps.getAllTrials = () => trials;
  },
  nowIs: (now: Date) => {
    deps.getNow = () => now;
  },
};

export const reset = () => {
  deps = {
    getAllTrials: () => TE.right([]),
    getNow: () => new Date("2021-04-26"),
  };
};

export const then = {
  resultIsFailure: async (_: ExtractFailure<GetOngoingTrials>) => {
    const actual = await result();
    const expected = await TE.left(_)();
    expect(actual).toEqual(expected);
  },
  resultIsSuccess: async (_: ReadonlyArray<Trial>) => {
    const actual = await result();
    const expected = await TE.right(_)();
    expect(actual).toEqual(expected);
  },
};

export const when = {
  askingForAllTrials: () => {
    result = handler(deps)();
  },
};

export type Context = {
  given: typeof given;
  when: typeof when;
  then: typeof then;
};
