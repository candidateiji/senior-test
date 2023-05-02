import { z } from "zod";

import { COUNTRY_CODE_RAW_SCHEMA, COUNTRY_CODE_SCHEMA } from "./code";
import { COUNTRY_NAME_RAW_SCHEMA, COUNTRY_NAME_SCHEMA } from "./name";

export const COUNTRY_RAW_SCHEMA = z.object({
  code: COUNTRY_CODE_RAW_SCHEMA,
  name: COUNTRY_NAME_RAW_SCHEMA,
});

export const COUNTRY_SCHEMA = z
  .object({
    code: COUNTRY_CODE_SCHEMA,
    name: COUNTRY_NAME_SCHEMA,
  })
  .brand("Country");

export type CountryRaw = z.infer<typeof COUNTRY_RAW_SCHEMA>;
export type Country = z.infer<typeof COUNTRY_SCHEMA>;

export * from "./code";
export * from "./name";
