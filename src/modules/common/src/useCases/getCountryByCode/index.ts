import { getAllCountries } from "../../gateways/getAllCountries";
import { handler } from "./getCountryByCode.handler";

export const getCountryByCode = {
  handler: handler({ getAllCountries }),
};

export type { GetCountryByCode } from "./getCountryByCode.handler";
