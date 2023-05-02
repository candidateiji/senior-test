import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    deps: {
      inline: [/^(?!.*vitest).*$/],
    },
    include: ["**/*.{itest,ispec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
  },
});
