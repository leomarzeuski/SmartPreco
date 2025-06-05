import { defineConfig } from "orval";

export default defineConfig({
  smartpreco: {
    output: {
      client: "react-query",
      mode: "tags-split",
      target: "./src/api/generated",
      mock: true,
      prettier: true,
      override: {
        mutator: {
          path: "./src/api/axios.ts",
          name: "axiosInstance",
        },
      },
    },
    input: {
      target: "https://api.smartpreco.mindsnap.tech/api-json",
      filters: {
        tags: ["Report", "Price", "Product", "Market", "Benefit"],
        schemas: [/Report/, /^Price/, /^Product/, /^Market/, /.*Benefit/],
      },
    },
  },
});
