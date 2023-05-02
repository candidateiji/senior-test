import * as TE from "fp-ts/TaskEither";
import {
  beforeEach,
  describe as feature,
  describe as rule,
  test as failure,
  test as success,
} from "vitest";

import type { Context } from "./handler.fixture";
import { given, reset, then, when } from "./handler.fixture";

feature("getOngoingTrialsByCountry", () => {
  beforeEach<Context>((context) => {
    reset();
    context.given = given;
    context.then = then;
    context.when = when;
  });

  rule("The input should have a countryCode of string type", () => {
    success<Context>(
      `
        When the input is { countryCode: 'US' }
        Then the result is a success
      `,
      async ({ then, when }) => {
        given.fnReturns(TE.right([]));
        when.inputIs({ countryCode: "US" });
        await then.resultIsSuccess("");
      }
    );
    failure<Context>(
      `
        When the input is { countryCode: 123 }
        Then the result is a failure
      `,
      async ({ then, when }) => {
        // @ts-expect-error this is intentional
        when.inputIs({ countryCode: 123 });
        await then.resultIsFailure(
          'Invalid parameter: Expected string, received number at "countryCode"'
        );
      }
    );
  });

  rule("The handler result depends on the fn result", () => {
    success<Context>(
      `
        When fn returns a Right
        Then the handler returns a message that looks like "{name}, {countryCode}"
      `,
      async ({ given, then, when }) => {
        const trials = [
          { name: "Trial1", countryCode: "US" },
          { name: "Trial2", countryCode: "US" },
        ];
        // @ts-expect-error this is intentional
        given.fnReturns(TE.right(trials));
        when.inputIs({ countryCode: "US" });
        await then.resultIsSuccess("Trial1,US\nTrial2,US");
      }
    );

    failure<Context>(
      `
        When fn returns a Left
        Then the handler returns a Left that is a string
      `,
      async ({ given, then, when }) => {
        const error = new Error("An error occurred");
        given.fnReturns(TE.left(error));
        when.inputIs({ countryCode: "US" });
        await then.resultIsFailure("An error occurred");
      }
    );
  });
});
