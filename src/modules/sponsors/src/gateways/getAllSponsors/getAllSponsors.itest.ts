import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import { describe as feature, test as success } from "vitest";

import type { SponsorName } from "../../domain/sponsor";
import { getAllSponsors } from ".";

feature("getAllSponsors", () => {
  success(
    `
      When calling getAllSponsors
      Then it should return a list of all sponsors
    `,
    async ({ expect }) => {
      await pipe(
        getAllSponsors(),
        TE.match(
          (e) => {
            throw e;
          },
          (sponsorNames: ReadonlyArray<SponsorName>) => {
            expect(sponsorNames.length).toBeGreaterThan(0);

            sponsorNames.forEach((sponsorName) => {
              expect(sponsorName).toBeTypeOf("string");
              expect(sponsorName).not.toEqual("");
            });
          }
        )
      )();
    }
  );
});
