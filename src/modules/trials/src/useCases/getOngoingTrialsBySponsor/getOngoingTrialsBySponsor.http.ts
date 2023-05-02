import type { HTTPDefinition, HTTPHandler } from "@inato/infra-http";
import { badRequest, internalError, success } from "@inato/infra-http";
import { SPONSOR_NAME_RAW_SCHEMA, UnknownSponsorError } from "@inato/modules-sponsors";
import { formatISO } from "date-fns";
import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import { z } from "zod";

import type { Trial } from "../../domain";
import type { GetOngoingTrialsBySponsor } from "../getOngoingTrialsBySponsor";

const schema = {
  querystring: z.object({
    sponsor_name: SPONSOR_NAME_RAW_SCHEMA,
  }),
};

type Input = typeof schema;

type Handler = HTTPHandler<GetOngoingTrialsBySponsor, Input>;

const handler: Handler = (getOngoingTrialsBySponsor) => async (request, reply) => {
  const dtoToHandler = {
    sponsorName: request.query.sponsor_name,
  };

  const handleFailure = TE.mapLeft((error) =>
    (error instanceof UnknownSponsorError ? badRequest(error) : internalError(error))(reply)
  );

  const trialToDTO = (trial: Trial) => ({
    end_date: formatISO(trial.endDate, {
      representation: "date",
    }),
    name: trial.name,
    sponsor: trial.sponsorName,
    start_date: formatISO(trial.startDate, {
      representation: "date",
    }),
  });

  const handleSuccess = TE.map((trials: ReadonlyArray<Trial>) =>
    success(trials.map(trialToDTO))(reply)
  );

  return await pipe(dtoToHandler, getOngoingTrialsBySponsor, handleFailure, handleSuccess)();
};

type HTTP = HTTPDefinition<GetOngoingTrialsBySponsor, Input>;

export const http: HTTP = (fn) => ({
  handler: handler(fn),
  method: "GET",
  schema,
  url: "/trials/get-ongoing-by-sponsors",
});
