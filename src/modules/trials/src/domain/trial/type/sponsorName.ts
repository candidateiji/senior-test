import { SPONSOR_NAME_RAW_SCHEMA, SPONSOR_NAME_SCHEMA } from "@inato/modules-sponsors";
import type { z } from "zod";

export const TRIAL_SPONSOR_NAME_RAW_SCHEMA = SPONSOR_NAME_RAW_SCHEMA;
export const TRIAL_SPONSOR_NAME_SCHEMA = SPONSOR_NAME_SCHEMA;

export type TrialSponsorNameRaw = z.infer<typeof TRIAL_SPONSOR_NAME_RAW_SCHEMA>;
export type TrialSponsorName = z.infer<typeof TRIAL_SPONSOR_NAME_SCHEMA>;
