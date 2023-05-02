import type { InternalError, InvalidParameterError, OmitDeps } from "@inato/infra-common";
import { tryParseInput } from "@inato/infra-common";
import type { Ports, UnknownSponsorError } from "@inato/modules-sponsors";
import { SPONSOR_NAME_RAW_SCHEMA } from "@inato/modules-sponsors";
import { flow, pipe } from "fp-ts/function";
import * as RA from "fp-ts/ReadonlyArray";
import * as TE from "fp-ts/TaskEither";
import { z } from "zod";

import type { Trial } from "../../domain";
import type { GetOngoingTrials } from "../getOngoingTrials";

type Deps = {
  getOngoingTrials: OmitDeps<GetOngoingTrials>;
  getSponsorByName: Ports["GetSponsorByName"];
};

const schema = z.object({
  sponsorName: SPONSOR_NAME_RAW_SCHEMA,
});

type Input = z.infer<typeof schema>;

type Failure = InternalError | InvalidParameterError | UnknownSponsorError;

type Output = TE.TaskEither<Failure, ReadonlyArray<Trial>>;

export type GetOngoingTrialsBySponsor = (deps: Deps) => (input: Input) => Output;

export const handler: GetOngoingTrialsBySponsor = ({ getOngoingTrials, getSponsorByName }) =>
  flow(
    tryParseInput(schema),
    TE.chain(({ sponsorName }) =>
      pipe(
        getSponsorByName({ name: sponsorName }),
        TE.chain(getOngoingTrials),
        TE.map(RA.filter((trial) => trial.sponsorName === sponsorName))
      )
    )
  );
