import type { GetOngoingTrialsBySponsor } from "./useCases/getOngoingTrialsBySponsor";
import { getOngoingTrialsBySponsor } from "./useCases/getOngoingTrialsBySponsor";

export const handlers = {
  getOngoingTrialsBySponsor: getOngoingTrialsBySponsor.handler,
};

export const routes = [getOngoingTrialsBySponsor.http];

export type Ports = {
  GetOngoingTrialsBySponsor: GetOngoingTrialsBySponsor;
};

export * from "./domain/trial";
