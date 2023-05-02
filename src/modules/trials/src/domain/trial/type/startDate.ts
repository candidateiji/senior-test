import { z } from "zod";

export const TRIAL_START_DATE_SCHEMA = z.date();

export type TrialStartDate = z.infer<typeof TRIAL_START_DATE_SCHEMA>;
