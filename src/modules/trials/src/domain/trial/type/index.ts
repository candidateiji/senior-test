import { COUNTRY_CODE_SCHEMA } from "@inato/modules-common";
import { isAfter, isBefore, isSameDay } from "date-fns";
import { z } from "zod";

import { TRIAL_END_DATE_SCHEMA } from "./endDate";
import { TRIAL_NAME_SCHEMA } from "./name";
import { TRIAL_SPONSOR_NAME_SCHEMA } from "./sponsorName";
import { TRIAL_START_DATE_SCHEMA } from "./startDate";

export const TRIAL_SCHEMA = z.object({
  countryCode: COUNTRY_CODE_SCHEMA,
  endDate: TRIAL_END_DATE_SCHEMA,
  isCanceled: z.boolean(),
  name: TRIAL_NAME_SCHEMA,
  sponsorName: TRIAL_SPONSOR_NAME_SCHEMA,
  startDate: TRIAL_START_DATE_SCHEMA,
});

export type Trial = z.infer<typeof TRIAL_SCHEMA>;

export const isOngoing = (now: Date) => (trial: Trial) =>
  (isBefore(trial.startDate, now) || isSameDay(trial.startDate, now)) &&
  (isAfter(trial.endDate, now) || isSameDay(trial.endDate, now)) &&
  !trial.isCanceled;
