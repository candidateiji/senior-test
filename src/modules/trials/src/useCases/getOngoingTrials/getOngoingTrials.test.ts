import { InternalError } from "@inato/infra-common";
import * as TE from "fp-ts/TaskEither";
import {
  beforeEach,
  describe as feature,
  describe as rule,
  test as failure,
  test as success,
} from "vitest";

import type { Trial } from "../../domain";
import type { Context } from "./getOngoingTrials.fixture";
import { given, reset, then, when } from "./getOngoingTrials.fixture";

feature("getOngoingTrials", () => {
  beforeEach<Context>((context) => {
    reset();
    context.given = given;
    context.then = then;
    context.when = when;
  });

  rule("An error in a gateway is spread returned to the user", () => {
    failure<Context>(
      `
        When the getAllTrials gateway returns an InternalError
        Then the same error is returned
      `,
      async ({ given, then, when }) => {
        given.allTrials(TE.left(new InternalError("internal error")));
        when.askingForAllTrials();
        await then.resultIsFailure(new InternalError("internal error"));
      }
    );
  });

  rule("A trial is ongoing if it has already started", () => {
    success<Context>(
      `
        Given there is 
          Trial "MATCH" started 2020-01-01 
          Trial "NO_MATCH" will start 2050-01-01 
        When the date is 2021-04-26
        Then the result is a success with the "MATCH" trial
      `,
      async ({ given, then, when }) => {
        given.allTrials(
          TE.right([
            {
              countryCode: "US",
              endDate: new Date("2050-10-10"),
              isCanceled: false,
              name: "MATCH",
              sponsorName: "SPONSOR_1",
              startDate: new Date("2020-01-01"),
            } as Trial,
            {
              countryCode: "US",
              endDate: new Date("2050-10-10"),
              isCanceled: false,
              name: "NOT_MATCH",
              sponsorName: "SPONSOR_1",
              startDate: new Date("2050-01-01"),
            } as Trial,
          ])
        );
        when.askingForAllTrials();
        await then.resultIsSuccess([
          {
            countryCode: "US",
            endDate: new Date("2050-10-10"),
            isCanceled: false,
            name: "MATCH",
            sponsorName: "SPONSOR_1",
            startDate: new Date("2020-01-01"),
          } as Trial,
        ]);
      }
    );

    success<Context>(
      `
        Given there is 
          Trial "MATCH" that started today
        Then the result is a success with the "MATCH" trial
      `,
      async ({ given, then, when }) => {
        given.allTrials(
          TE.right([
            {
              countryCode: "US",
              endDate: new Date("2050-10-10"),
              isCanceled: false,
              name: "MATCH",
              sponsorName: "SPONSOR_1",
              startDate: new Date("2021-04-26"),
            } as Trial,
          ])
        );
        when.askingForAllTrials();
        await then.resultIsSuccess([
          {
            countryCode: "US",
            endDate: new Date("2050-10-10"),
            isCanceled: false,
            name: "MATCH",
            sponsorName: "SPONSOR_1",
            startDate: new Date("2021-04-26"),
          } as Trial,
        ]);
      }
    );

    success<Context>(
      `
        Given there is 
          Trial "NO_MATCH_1" will start 2040-01-01 
        When the date is 2021-04-26
        Then the result is an empty success
      `,
      async ({ given, then, when }) => {
        given.allTrials(
          TE.right([
            {
              countryCode: "US",
              endDate: new Date("2050-10-10"),
              isCanceled: false,
              name: "MATCH",
              sponsorName: "SPONSOR_1",
              startDate: new Date("2040-01-01"),
            } as Trial,
          ])
        );
        when.askingForAllTrials();
        await then.resultIsSuccess([]);
      }
    );
  });

  rule("A trial is ongoing if hasn't ended yet", () => {
    success<Context>(
      `
        Given there is 
          Trial "MATCH" will end 2050-01-01 
          Trial "NO_MATCH" will start 2020-01-01 
        When the date is 2021-04-26
        Then the result is a success with the "MATCH" trial
      `,
      async ({ given, then, when }) => {
        given.allTrials(
          TE.right([
            {
              countryCode: "US",
              endDate: new Date("2050-10-10"),
              isCanceled: false,
              name: "MATCH",
              sponsorName: "SPONSOR_1",
              startDate: new Date("2020-01-01"),
            } as Trial,
            {
              countryCode: "US",
              endDate: new Date("2020-10-10"),
              isCanceled: false,
              name: "NOT_MATCH",
              sponsorName: "SPONSOR_1",
              startDate: new Date("2010-01-01"),
            } as Trial,
          ])
        );
        when.askingForAllTrials();
        await then.resultIsSuccess([
          {
            countryCode: "US",
            endDate: new Date("2050-10-10"),
            isCanceled: false,
            name: "MATCH",
            sponsorName: "SPONSOR_1",
            startDate: new Date("2020-01-01"),
          } as Trial,
        ]);
      }
    );

    success<Context>(
      `
        Given there is 
          Trial "MATCH" will end today
        Then the result is a success with the "MATCH" trial
      `,
      async ({ given, then, when }) => {
        given.allTrials(
          TE.right([
            {
              countryCode: "US",
              endDate: new Date("2021-04-26"),
              isCanceled: false,
              name: "MATCH",
              sponsorName: "SPONSOR_1",
              startDate: new Date("2020-04-26"),
            } as Trial,
          ])
        );
        when.askingForAllTrials();
        await then.resultIsSuccess([
          {
            countryCode: "US",
            endDate: new Date("2021-04-26"),
            isCanceled: false,
            name: "MATCH",
            sponsorName: "SPONSOR_1",
            startDate: new Date("2020-04-26"),
          } as Trial,
        ]);
      }
    );

    success<Context>(
      `
        Given there is 
          Trial "NO_MATCH_1" that ended 2020-01-01 
        When the date is 2021-04-26
        Then the result is an empty success
      `,
      async ({ given, then, when }) => {
        given.allTrials(
          TE.right([
            {
              countryCode: "US",
              endDate: new Date("2020-10-10"),
              isCanceled: false,
              name: "MATCH",
              sponsorName: "SPONSOR_1",
              startDate: new Date("2010-01-01"),
            } as Trial,
          ])
        );
        when.askingForAllTrials();
        await then.resultIsSuccess([]);
      }
    );
  });

  rule("A trial is ongoing is it hasn't been cancelled", () => {
    success<Context>(
      `
        Given there is 
          Trial "MATCH" hasn't been cancelled
          Trial "NO_MATCH" has been cancelled
        Then the result is a success with the "MATCH" trial
      `,
      async ({ given, then, when }) => {
        given.allTrials(
          TE.right([
            {
              countryCode: "US",
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
          ])
        );
        when.askingForAllTrials();
        await then.resultIsSuccess([
          {
            countryCode: "US",
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
