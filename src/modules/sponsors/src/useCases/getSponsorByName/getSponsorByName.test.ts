import { InvalidParameterError, stringOfLength } from "@inato/infra-common";
import {
  beforeEach,
  describe as feature,
  describe as rule,
  test as failure,
  test as success,
} from "vitest";

import { UnknownSponsorError } from "../../domain/sponsor";
import type { Context } from "./getSponsorByName.fixture";
import { given, reset, then, when } from "./getSponsorByName.fixture";

feature("getSponsorByName", () => {
  beforeEach<Context>((context) => {
    reset();
    context.given = given;
    context.then = then;
    context.when = when;
  });

  rule("The input name cannot be empty", () => {
    failure<Context>(
      `
        When the input is ''
        Then the result is an InvalidParameterError
      `,
      async ({ then, when }) => {
        when.inputIs({ name: "" });
        await then.resultIsFailure(
          new InvalidParameterError('String must contain at least 1 character(s) at "name"')
        );
      }
    );
  });

  rule("The input name cannot be over 255 characters", () => {
    success<Context>(
      `
        When the input is a string of length 255
        Then the result is a success
      `,
      async ({ then, when }) => {
        const name = stringOfLength(255);
        given.sponsorsExist([name]);
        when.inputIs({ name });
        await then.resultIsSuccess(name);
      }
    );
    failure<Context>(
      `
        When the input is a string of length 256
        Then the result is a failure
      `,
      async ({ then, when }) => {
        when.inputIs({ name: stringOfLength(256) });
        await then.resultIsFailure(
          new InvalidParameterError('String must contain at most 255 character(s) at "name"')
        );
      }
    );
  });

  rule("Find the sponsor matching the input name", () => {
    success<Context>(
      `
        Given 'Sponsor1' and 'Sponsor2' exist
        When the input is 'Sponsor1'
        Then 'Sponsor1' is returned
      `,
      async ({ given, then, when }) => {
        given.sponsorsExist(["Sponsor1", "Sponsor2"]);
        when.inputIs({ name: "Sponsor1" });
        await then.resultIsSuccess("Sponsor1");
      }
    );
    failure<Context>(
      `
        Given 'Sponsor1' and 'Sponsor2' exist
        When the input is 'Sponsor3'
        Then the result is a UnknownSponsorError
      `,
      async ({ given, then, when }) => {
        given.sponsorsExist(["Sponsor1", "Sponsor2"]);
        when.inputIs({ name: "Sponsor3" });
        await then.resultIsFailure(new UnknownSponsorError("Sponsor3"));
      }
    );
  });
});
