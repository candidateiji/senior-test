import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import { describe as feature, test as success } from "vitest";

import type { Country } from "../../domain/country";
import { getAllCountries } from ".";

feature("getAllCountries", () => {
  success(
    `
      When calling getAllCountries
      Then it should return a list of all countries with their codes and names
    `,
    async ({ expect }) => {
      await pipe(
        getAllCountries(),
        TE.match(
          (e) => {
            throw e;
          },
          (countries: ReadonlyArray<Country>) => {
            expect(countries.length).toBeGreaterThan(0);

            countries.forEach((country) => {
              expect(country).toHaveProperty("code");
              expect(country.code).not.toEqual("");
              expect(country).toHaveProperty("name");
              expect(country.name).not.toEqual("");
            });
          }
        )
      )();
    }
  );
});
