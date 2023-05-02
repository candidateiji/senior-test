import { handlers } from "@inato/modules-sponsors";

import { getOngoingTrials } from "../getOngoingTrials";
import { handler as rawHandler } from "./getOngoingTrialsBySponsor.handler";
import { http } from "./getOngoingTrialsBySponsor.http";

const handler = rawHandler({
  getOngoingTrials: getOngoingTrials,
  getSponsorByName: handlers.getSponsorByName,
});

export const getOngoingTrialsBySponsor = {
  handler,
  http: http(handler),
};

export type { GetOngoingTrialsBySponsor } from "./getOngoingTrialsBySponsor.handler";
