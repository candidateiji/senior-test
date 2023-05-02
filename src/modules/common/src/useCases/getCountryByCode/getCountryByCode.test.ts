import { InvalidParameterError } from "@inato/infra-common";
import {
  beforeEach,
  describe as feature,
  describe as rule,
  test as failure,
  test as success,
} from "vitest";

import { UnknownCountryError } from "../../domain/country";
import type { Context } from "./getCountryByCode.fixture";
import { given, reset, then, when } from "./getCountryByCode.fixture";

feature("getCountryByCode", () => {
  beforeEach<Context>((context) => {
    reset();
    context.given = given;
    context.then = then;
    context.when = when;
  });

  rule("The input countryCode cannot be empty", () => {
    failure<Context>(
      `
        When the countryCode is ''
        Then the result is an InvalidParameterError
      `,
      async ({ then, when }) => {
        when.inputIs({ countryCode: "" });
        await then.resultIsFailure(
          new InvalidParameterError('String must contain exactly 2 character(s) at "countryCode"')
        );
      }
    );
  });

  rule("The input countryCode must have exactly 2 characters", () => {
    success<Context>(
      `
        When the countryCode is "FR"
        Then the result is a success
      `,
      async ({ then, when }) => {
        given.countriesExist([{ code: "FR", name: "Country" }]);
        when.inputIs({ countryCode: "FR" });
        await then.resultIsSuccess({ code: "FR", name: "Country" });
      }
    );
    failure<Context>(
      `
        When the countryCode is FRA
        Then the result is an InvalidParameterError
      `,
      async ({ then, when }) => {
        when.inputIs({ countryCode: "FRA" });
        await then.resultIsFailure(
          new InvalidParameterError('String must contain at most 255 character(s) at "name"')
        );
      }
    );
  });

  rule("Find the country matching the input code", () => {
    success<Context>(
      `
        Given 'US' and 'CA' exist
        When the input is 'US'
        Then 'US' is returned
      `,
      async ({ given, then, when }) => {
        given.countriesExist([
          { code: "US", name: "USA" },
          { code: "CA", name: "Canada" },
        ]);
        when.inputIs({ countryCode: "US" });
        await then.resultIsSuccess({ code: "US", name: "USA" });
      }
    );
    failure<Context>(
      `
        Given 'US' and 'CA' exist
        When the input is 'MX'
        Then the result is an UnknownCountryError
      `,
      async ({ given, then, when }) => {
        given.countriesExist([
          { code: "US", name: "USA" },
          { code: "CA", name: "Canada" },
        ]);
        when.inputIs({ countryCode: "MX" });
        await then.resultIsFailure(new UnknownCountryError("MX"));
      }
    );
  });
});
