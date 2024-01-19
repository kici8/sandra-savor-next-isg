import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  // TODO: is possible to import this from the .env file?
  // schema: "http://127.0.0.1:1337/graphql",
  schema: "https://strapi-production-027c9.up.railway.app/graphql",
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
