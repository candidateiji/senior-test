import type { OmitDeps } from "@inato/infra-common";

import type { GetSponsorByName } from "./useCases/getSponsorByName";
import { getSponsorByName } from "./useCases/getSponsorByName";

export const handlers = {
  getSponsorByName: getSponsorByName.handler,
};

export type Ports = {
  GetSponsorByName: OmitDeps<GetSponsorByName>;
};

export * from "./domain/sponsor";
