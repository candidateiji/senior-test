import type * as TE from "fp-ts/TaskEither";

export type OmitDeps<F> = F extends (deps: any) => infer R ? R : never;

export type ExtractDeps<T> = T extends (deps: infer D) => (input: any) => any
  ? D
  : T extends (input: infer D) => any
  ? never
  : never;

export type ExtractInput<T> = T extends (deps: any) => (input: infer I) => any
  ? I
  : T extends (input: infer I) => any
  ? I
  : never;

export type ExtractOutput<T> = T extends (deps: any) => (input: any) => infer O
  ? O
  : T extends (input: any) => infer O
  ? O
  : never;

export type ExtractFailure<T> = T extends (deps: any) => (input: any) => TE.TaskEither<infer F, any>
  ? F
  : T extends (input: any) => TE.TaskEither<infer F, any>
  ? F
  : never;

export type ExtractSuccess<T> = T extends (deps: any) => (input: any) => TE.TaskEither<any, infer S>
  ? S
  : T extends (input: any) => TE.TaskEither<any, infer S>
  ? S
  : never;
