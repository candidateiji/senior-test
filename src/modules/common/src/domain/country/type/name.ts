import { REASONABLY_SHORT_STRING_SCHEMA } from "@inato/infra-common";
import type { z } from "zod";

export const COUNTRY_NAME_RAW_SCHEMA = REASONABLY_SHORT_STRING_SCHEMA;
export const COUNTRY_NAME_SCHEMA = COUNTRY_NAME_RAW_SCHEMA.brand("CountryName");

export type CountryNameRaw = z.infer<typeof COUNTRY_NAME_RAW_SCHEMA>;
export type CountryName = z.infer<typeof COUNTRY_NAME_SCHEMA>;
