import { getAllSponsors } from "../../gateways/getAllSponsors";
import { handler } from "./getSponsorByName.handler";

export const getSponsorByName = {
  handler: handler({ getAllSponsors }),
};

export type { GetSponsorByName } from "./getSponsorByName.handler";
