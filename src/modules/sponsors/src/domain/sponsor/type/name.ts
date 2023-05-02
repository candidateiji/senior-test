import { REASONABLY_SHORT_STRING_SCHEMA } from "@inato/infra-common";
import type { z } from "zod";

export const SPONSOR_NAME_RAW_SCHEMA = REASONABLY_SHORT_STRING_SCHEMA;
export const SPONSOR_NAME_SCHEMA = SPONSOR_NAME_RAW_SCHEMA.brand("SponsorName");

export type SponsorNameRaw = z.infer<typeof SPONSOR_NAME_RAW_SCHEMA>;
export type SponsorName = z.infer<typeof SPONSOR_NAME_SCHEMA>;
