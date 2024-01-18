import { TypedDocumentString } from "@/graphql/generated/graphql";
import { GraphQLError } from "graphql";

type GraphQLResponse<GraphQLData> =
  | { data: GraphQLData }
  | { errors: GraphQLError[] };

// TODO: check how refetching works
export const fetchData = async <Result, Variables>(
  document: TypedDocumentString<Result, Variables>,
  variables: Variables,
) => {
  const response = await fetch(process.env.API_URL as string, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: document.toString(),
      variables,
    }),
  });

  const result = (await response.json()) as GraphQLResponse<Result>;

  if ("errors" in result) {
    throw new Error(result.errors[0].message);
  }

  return result?.data;
};

// Errors thrown by the GraphQL API are included in the response that has the following format
// { "errors": [
//     {
//       "message": "", // A human readable error message
//       "extensions": {
//         "error": {
//           "name": "", // Strapi error name ('ApplicationError' or 'ValidationError'),
//           "message": "", // A human readable error message (same one as above);
//           "details": {}, // Error info specific to the error type
//         },
//         "code": "" // GraphQL error code (ex: BAD_USER_INPUT)
//       }
//     }
//   ],
//   "data": {
//     "graphQLQueryName": null
//   }
// }
