import type { InternalError, InvalidParameterError } from "@inato/infra-common";
import { pipe } from "fp-ts/function";
import * as RA from "fp-ts/ReadonlyArray";
import * as TE from "fp-ts/TaskEither";

import type { GetAllTrials, Trial } from "../../domain";
import { isOngoing } from "../../domain";

type Deps = {
  getAllTrials: GetAllTrials;
  getNow: () => Date;
};

type Failure = InternalError | InvalidParameterError;

type Output = TE.TaskEither<Failure, ReadonlyArray<Trial>>;

export type GetOngoingTrials = (deps: Deps) => () => Output;

export const handler: GetOngoingTrials =
  ({ getAllTrials, getNow }) =>
  () =>
    pipe(getAllTrials(), TE.map(RA.filter(isOngoing(getNow()))));
