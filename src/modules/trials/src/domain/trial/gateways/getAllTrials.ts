import type { InternalError } from "@inato/infra-common";
import type * as TE from "fp-ts/TaskEither";

import type { Trial } from "../type";

export type GetAllTrials = () => TE.TaskEither<InternalError, ReadonlyArray<Trial>>;
