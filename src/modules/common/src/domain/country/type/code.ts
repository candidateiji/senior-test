import { z } from "zod";

export const COUNTRY_CODE_RAW_SCHEMA = z.string().length(2);
export const COUNTRY_CODE_SCHEMA = COUNTRY_CODE_RAW_SCHEMA.brand("CountryCode");

export type CountryCodeRaw = z.infer<typeof COUNTRY_CODE_RAW_SCHEMA>;
export type CountryCode = z.infer<typeof COUNTRY_CODE_SCHEMA>;
