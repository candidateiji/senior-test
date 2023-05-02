import type { InternalError } from "@inato/infra-common";
import type * as TE from "fp-ts/TaskEither";

import type { Country } from "../type";

export type GetAllCountries = () => TE.TaskEither<InternalError, ReadonlyArray<Country>>;
