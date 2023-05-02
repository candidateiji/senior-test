import type { OmitDeps } from "@inato/infra-common";

import { type GetCountryByCode, getCountryByCode } from "./useCases/getCountryByCode";

export const handlers = {
  getCountryByCode: getCountryByCode.handler,
};

export type Ports = {
  GetCountryByCode: OmitDeps<GetCountryByCode>;
};

export * from "./domain/country";
