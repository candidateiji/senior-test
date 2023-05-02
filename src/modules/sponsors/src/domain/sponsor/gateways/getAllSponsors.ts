import type { InternalError } from "@inato/infra-common";
import type * as TE from "fp-ts/TaskEither";

import type { SponsorName } from "../type";

export type GetAllSponsors = () => TE.TaskEither<InternalError, ReadonlyArray<SponsorName>>;
