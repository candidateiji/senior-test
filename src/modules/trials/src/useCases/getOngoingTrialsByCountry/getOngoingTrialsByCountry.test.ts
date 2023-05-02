import { InternalError, InvalidParameterError } from "@inato/infra-common";
import * as TE from "fp-ts/TaskEither";
import {
  beforeEach,
  describe as feature,
  describe as rule,
  test as failure,
  test as success,
} from "vitest";

import type { Trial } from "../../domain";
import type { Context } from "./getOngoingTrialsByCountry.fixture";
import { given, reset, then, when } from "./getOngoingTrialsByCountry.fixture";

feature("getOngoingTrialsByCountry", () => {
  beforeEach<Context>((context) => {
    reset();
    context.given = given;
    context.then = then;
    context.when = when;
  });

  rule("the country code should be 2 letters long", () => {
    failure<Context>(
      `
        When the country code is empty
        Then the result is a failure
      `,
      async ({ then, when }) => {
        when.inputIs({ countryCode: "" });
        await then.resultIsFailure(
          new InvalidParameterError('String must contain exactly 2 character(s) at "countryCode"')
        );
      }
    );

    failure<Context>(
      `
        When the country code is 'O'
        Then the result is a failure
      `,
      async ({ then, when }) => {
        when.inputIs({ countryCode: "O" });
        await then.resultIsFailure(
          new InvalidParameterError('String must contain exactly 2 character(s) at "countryCode"')
        );
      }
    );
    failure<Context>(
      `
        When the country code is 'TTT'
        Then the result is a failure
      `,
      async ({ then, when }) => {
        when.inputIs({ countryCode: "TTT" });
        await then.resultIsFailure(
          new InvalidParameterError('String must contain exactly 2 character(s) at "countryCode"')
        );
      }
    );
  });

  rule("An error in a gateway is spread returned to the user", () => {
    failure<Context>(
      `
        When the gateway returns an InternalError
        Then the same error is returned
      `,
      async ({ given, then, when }) => {
        given.trials(TE.right([]), new Date(), TE.left(new InternalError("internal error")));
        when.inputIs({ countryCode: "TT" });
        await then.resultIsFailure(new InternalError("internal error"));
      }
    );
  });

  rule("An ongoing trial matching the given country code is returned to the user", () => {
    success<Context>(
      `
        Given there is 
          Trial "MATCH" is "FR"
          Trial "NO_MATCH" in "US"
        When asking for the trials in "FR"
        Then the result is a success with the "MATCH" trial
      `,
      async ({ given, then, when }) => {
        given.trials(
          TE.right([
            {
              countryCode: "FR",
              endDate: new Date("2050-10-10"),
              isCanceled: false,
              name: "MATCH",
              sponsorName: "SPONSOR_1",
              startDate: new Date("2020-01-01"),
            } as Trial,
            {
              countryCode: "US",
              endDate: new Date("2050-10-10"),
              isCanceled: true,
              name: "NOT_MATCH",
              sponsorName: "SPONSOR_1",
              startDate: new Date("2010-01-01"),
            } as Trial,
          ]),
          new Date("2021-04-26")
        );
        when.inputIs({ countryCode: "FR" });
        await then.resultIsSuccess([
          {
            countryCode: "FR",
            endDate: new Date("2050-10-10"),
            isCanceled: false,
            name: "MATCH",
            sponsorName: "SPONSOR_1",
            startDate: new Date("2020-01-01"),
          } as Trial,
        ]);
      }
    );
  });
});
