import type { InternalError, InvalidParameterError, OmitDeps } from "@inato/infra-common";
import { tryParseInput } from "@inato/infra-common";
import type { Ports, UnknownCountryError } from "@inato/modules-common";
import { COUNTRY_CODE_RAW_SCHEMA } from "@inato/modules-common";
import { flow, pipe } from "fp-ts/function";
import * as RA from "fp-ts/ReadonlyArray";
import * as TE from "fp-ts/TaskEither";
import { z } from "zod";

import type { Trial } from "../../domain";
import type { GetOngoingTrials } from "../getOngoingTrials";

type Deps = {
  getCountryByCode: Ports["GetCountryByCode"];
  getOngoingTrials: OmitDeps<GetOngoingTrials>;
};

const schema = z.object({
  countryCode: COUNTRY_CODE_RAW_SCHEMA,
});

type Input = z.infer<typeof schema>;

type Failure = InternalError | InvalidParameterError | UnknownCountryError;

type Output = TE.TaskEither<Failure, ReadonlyArray<Trial>>;

export type GetOngoingTrialsByCountry = (deps: Deps) => (input: Input) => Output;

export const handler: GetOngoingTrialsByCountry = ({ getCountryByCode, getOngoingTrials }) =>
  flow(
    tryParseInput(schema),
    TE.chain(({ countryCode }) =>
      pipe(
        getCountryByCode({ countryCode }),
        TE.chain(getOngoingTrials),
        TE.map(RA.filter((trial) => trial.countryCode === countryCode))
      )
    )
  );
