import type { OmitDeps } from "@inato/infra-common";
import type {
  ContextConfigDefault,
  FastifyReply,
  FastifySchema,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
  RouteHandlerMethod,
  RouteOptions,
} from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import * as E from "fp-ts/Either";
import type { z } from "zod";

export const badRequest = (_: string | Error) => (reply: FastifyReply) =>
  reply.status(400).send(_ instanceof Error ? _.message : _);

export const internalError = (_: unknown) => (reply: FastifyReply) =>
  reply.status(500).send(E.toError);

export const success = (_: unknown) => (reply: FastifyReply) => reply.status(200).send(_);

export type HTTPHandler<Handler, Request extends FastifySchema> = (
  handler: OmitDeps<Handler>
) => RouteHandlerMethod<
  RawServerDefault,
  RawRequestDefaultExpression,
  RawReplyDefaultExpression,
  HTTPRequest<Request>,
  ContextConfigDefault,
  FastifySchema,
  ZodTypeProvider
>;

export type HTTPDefinition<Handler, Request extends FastifySchema> = (
  handler: OmitDeps<Handler>
) => RouteOptions<
  RawServerDefault,
  RawRequestDefaultExpression,
  RawReplyDefaultExpression,
  HTTPRequest<Request>,
  ContextConfigDefault,
  FastifySchema,
  ZodTypeProvider
>;

export type HTTPRequest<Schema extends FastifySchema> = {
  Querystring: z.infer<Schema["querystring"] extends z.ZodTypeAny ? Schema["querystring"] : never>;
};
