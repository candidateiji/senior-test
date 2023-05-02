import { REASONABLY_SHORT_STRING_SCHEMA } from "@inato/infra-common";
import type { z } from "zod";

export const TRIAL_NAME_RAW_SCHEMA = REASONABLY_SHORT_STRING_SCHEMA;
export const TRIAL_NAME_SCHEMA = TRIAL_NAME_RAW_SCHEMA.brand("TrialName");

export type TrialNameRaw = z.infer<typeof TRIAL_NAME_RAW_SCHEMA>;
export type TrialName = z.infer<typeof TRIAL_NAME_SCHEMA>;
