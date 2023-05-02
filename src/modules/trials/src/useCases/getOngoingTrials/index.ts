import { getAllTrials } from "../../gateways/getAllTrials";
import { handler } from "./getOngoingTrials.handler";

export const getOngoingTrials = handler({
  getAllTrials: getAllTrials,
  getNow: () => new Date(),
});

export type { GetOngoingTrials } from "./getOngoingTrials.handler";
