import { handlers } from "@inato/modules-common";

import { getOngoingTrials } from "../getOngoingTrials";
import { handler } from "./getOngoingTrialsByCountry.handler";

export const getOngoingTrialsByCountry = handler({
  getOngoingTrials: getOngoingTrials,
  getCountryByCode: handlers.getCountryByCode,
});

export type { GetOngoingTrialsByCountry } from "./getOngoingTrialsByCountry.handler";
