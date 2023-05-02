import { logFailure, logSuccess } from "@inato/infra-console";
import { handlers } from "@inato/modules-trials";
import { Command } from "commander";
import * as E from "fp-ts/Either";

import { handler } from "./handler";

const program = new Command()
  .option("-c, --country-code <char>, code of the country")
  .parse(process.argv);

void (async () => {
  await handler(handlers.getOngoingTrialsByCountry)(program.opts()).then(
    E.fold(logFailure, logSuccess)
  );
})();
