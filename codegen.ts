import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  // schema: "http://127.0.0.1:1337/graphql",
  // schema: "https://strapi-production-027c9.up.railway.app/graphql",
  schema: process.env.GRAPHQL_ENDPOINT,
  documents: "./src/app/**/*.{ts,tsx}",
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    "./src/graphql/generated/": {
      preset: "client",
      config: {
        // Generate the body of a standard fetch POST request
        documentMode: "string",
      },
    },
  },
};

export default config;
