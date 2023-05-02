import type { GetOngoingTrialsByCountry } from "./useCases/getOngoingTrialsByCountry";
import { getOngoingTrialsByCountry } from "./useCases/getOngoingTrialsByCountry";
import type { GetOngoingTrialsBySponsor } from "./useCases/getOngoingTrialsBySponsor";
import { getOngoingTrialsBySponsor } from "./useCases/getOngoingTrialsBySponsor";

export const handlers = {
  getOngoingTrialsByCountry,
  getOngoingTrialsBySponsor: getOngoingTrialsBySponsor.handler,
};

export const routes = [getOngoingTrialsBySponsor.http];

export type Ports = {
  GetOngoingTrialsByCountry: GetOngoingTrialsByCountry;
  GetOngoingTrialsBySponsor: GetOngoingTrialsBySponsor;
};

export * from "./domain/trial";
