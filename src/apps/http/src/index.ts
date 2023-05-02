import { routes } from "@inato/modules-trials";
import fastify from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";

const server = fastify({
  logger: true,
});

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

for (const route of routes) {
  server.withTypeProvider<ZodTypeProvider>().route(route);
}

void (async () => {
  try {
    await server.listen({ port: 3000 });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
})();
