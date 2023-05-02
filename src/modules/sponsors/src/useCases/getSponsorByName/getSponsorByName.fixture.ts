import type { ExtractFailure, ExtractInput, ExtractOutput, OmitDeps } from "@inato/infra-common";
import * as TE from "fp-ts/TaskEither";
import { expect } from "vitest";

import type { SponsorName, SponsorNameRaw } from "../../domain/sponsor";
import type { GetSponsorByName } from "./getSponsorByName.handler";
import { handler } from "./getSponsorByName.handler";

let fn: OmitDeps<GetSponsorByName>;
let result: ExtractOutput<GetSponsorByName>;

export const given = {
  sponsorsExist: (sponsors: SponsorNameRaw[]) => {
    fn = handler({
      getAllSponsors: () => TE.right(sponsors.map((sponsor) => sponsor as SponsorName)),
    });
  },
};

export const reset = () => {
  fn = handler({ getAllSponsors: () => TE.right([]) });
};

export const then = {
  resultIsFailure: async (expectedResult: ExtractFailure<GetSponsorByName>) => {
    const actual = await result();
    const expected = await TE.left(expectedResult)();
    expect(actual).toEqual(expected);
  },
  resultIsSuccess: async (expectedResult: SponsorNameRaw) => {
    const actual = await result();
    const expected = await TE.right(expectedResult)();
    expect(actual).toEqual(expected);
  },
};

export const when = {
  inputIs: ({ name }: ExtractInput<GetSponsorByName>) => {
    result = fn({
      name,
    });
  },
};

export type Context = {
  given: typeof given;
  when: typeof when;
  then: typeof then;
};
