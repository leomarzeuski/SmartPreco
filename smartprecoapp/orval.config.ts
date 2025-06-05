import { defineConfig } from "orval";

export default defineConfig({
  smartpreco: {
    output: {
      client: "react-query",
      mode: "tags-split",
      target: "./api",
      schemas: "./api/model",
      mock: true,
      prettier: true,
      override: {
        mutator: {
          path: "./api/axios.ts",
          name: "customInstance",
        },
      },
    },
    input: {
      target:
        process.env.EXPO_PUBLIC_SWAGGER_URL ||
        "https://api.smartpreco.mindsnap.tech/api-json",
    },
  },
});
