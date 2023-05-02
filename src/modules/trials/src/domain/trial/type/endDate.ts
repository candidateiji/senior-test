import { z } from "zod";

export const TRIAL_END_DATE_SCHEMA = z.date();

export type TrialEndDate = z.infer<typeof TRIAL_END_DATE_SCHEMA>;
