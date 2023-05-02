import { InternalError, InvalidParameterError, stringOfLength } from "@inato/infra-common";
import * as TE from "fp-ts/TaskEither";
import {
  beforeEach,
  describe as feature,
  describe as rule,
  test as failure,
  test as success,
} from "vitest";

import type { Trial } from "../../domain";
import type { Context } from "./getOngoingTrialsBySponsor.fixture";
import { given, reset, then, when } from "./getOngoingTrialsBySponsor.fixture";

feature("getOngoingTrialsBySponsor", () => {
  beforeEach<Context>((context) => {
    reset();
    context.given = given;
    context.then = then;
    context.when = when;
  });

  rule("the sponsor name should not be empty", () => {
    failure<Context>(
      `
        When the sponsor name is empty
        Then the result is an InvalidParameterError
      `,
      async ({ then, when }) => {
        when.inputIs({ sponsorName: "" });
        await then.resultIsFailure(
          new InvalidParameterError('String must contain at least 1 character(s) at "sponsorName"')
        );
      }
    );
  });

  rule("the sponsor name should not be over 255 characters", () => {
    failure<Context>(
      `
        When the sponsor name is over 255 characters
        Then the result is an InvalidParameterError
      `,
      async ({ then, when }) => {
        when.inputIs({ sponsorName: stringOfLength(256) });
        await then.resultIsFailure(
          new InvalidParameterError('String must contain at most 255 character(s) at "sponsorName"')
        );
      }
    );

    success<Context>(
      `
        When the sponsor name is "SPONSOR_NAME"
        Then the result is a success
      `,
      async ({ then, when }) => {
        when.inputIs({ sponsorName: "SPONSOR_NAME" });
        await then.resultIsSuccess([]);
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
        when.inputIs({ sponsorName: "SPONSOR_NAME" });
        await then.resultIsFailure(new InternalError("internal error"));
      }
    );
  });

  rule("An ongoing trial matching the given sponsor name is returned to the user", () => {
    success<Context>(
      `
        Given there is 
          Trial "MATCH" sponsored by "SPONSOR_1"
          Trial "NO_MATCH" sponsored by "SPONSOR_2"
        When asking for the trials sponsored by "SPONSOR_1"
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
              sponsorName: "SPONSOR_2",
              startDate: new Date("2010-01-01"),
            } as Trial,
          ]),
          new Date("2021-04-26")
        );
        when.inputIs({ sponsorName: "SPONSOR_1" });
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
