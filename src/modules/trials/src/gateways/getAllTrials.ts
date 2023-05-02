import { trials } from "@inato/infra-common";
import type { CountryCode } from "@inato/modules-common";
import type { SponsorName } from "@inato/modules-sponsors";
import { parseISO } from "date-fns";
import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";

import type { GetAllTrials } from "../domain";
import type { TrialName } from "../domain/trial/type/name";

export const getAllTrials: GetAllTrials = () =>
  pipe(
    trials,
    (rawTrials) =>
      rawTrials.map((rawTrial) => ({
        countryCode: rawTrial.country as CountryCode,
        endDate: parseISO(rawTrial.end_date),
        isCanceled: rawTrial.canceled,
        name: rawTrial.name as TrialName,
        sponsorName: rawTrial.sponsor as SponsorName,
        startDate: parseISO(rawTrial.start_date),
      })),
    TE.right
  );
