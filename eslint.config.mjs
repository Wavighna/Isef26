import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: [".next/**", ".tools/**", "node_modules/**"]
  },
  ...nextVitals,
  ...nextTypescript
]);
