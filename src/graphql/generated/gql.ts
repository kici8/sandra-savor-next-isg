/* eslint-disable */
import * as types from './graphql';



/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  query worksForHome($locale: I18NLocaleCode) {\n    works(locale: $locale) {\n      data {\n        id\n        attributes {\n          slug\n          title\n          description\n          images {\n            data {\n              id\n              attributes {\n                url\n                previewUrl\n                alternativeText\n                formats\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n": types.WorksForHomeDocument,
    "\n  query worksForWorkStaticParams($locale: I18NLocaleCode) {\n    works(locale: $locale) {\n      data {\n        id\n        attributes {\n          slug\n        }\n      }\n    }\n  }\n": types.WorksForWorkStaticParamsDocument,
    "\n  query worksForWork($locale: I18NLocaleCode, $slug: String) {\n    works(filters: { slug: { eq: $slug } }, locale: $locale) {\n      data {\n        id\n        attributes {\n          slug\n          title\n          description\n          dateOfCreation\n          widthInCm\n          heightInCm\n          categories {\n            data {\n              id\n              attributes {\n                title\n                slug\n              }\n            }\n          }\n          images {\n            data {\n              id\n              attributes {\n                url\n                alternativeText\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n": types.WorksForWorkDocument,
    "\n  query worksForWorks($locale: I18NLocaleCode) {\n    works(locale: $locale) {\n      data {\n        id\n        attributes {\n          slug\n          title\n          description\n          images {\n            data {\n              id\n              attributes {\n                url\n                previewUrl\n                alternativeText\n                formats\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n": types.WorksForWorksDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query worksForHome($locale: I18NLocaleCode) {\n    works(locale: $locale) {\n      data {\n        id\n        attributes {\n          slug\n          title\n          description\n          images {\n            data {\n              id\n              attributes {\n                url\n                previewUrl\n                alternativeText\n                formats\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').WorksForHomeDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query worksForWorkStaticParams($locale: I18NLocaleCode) {\n    works(locale: $locale) {\n      data {\n        id\n        attributes {\n          slug\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').WorksForWorkStaticParamsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query worksForWork($locale: I18NLocaleCode, $slug: String) {\n    works(filters: { slug: { eq: $slug } }, locale: $locale) {\n      data {\n        id\n        attributes {\n          slug\n          title\n          description\n          dateOfCreation\n          widthInCm\n          heightInCm\n          categories {\n            data {\n              id\n              attributes {\n                title\n                slug\n              }\n            }\n          }\n          images {\n            data {\n              id\n              attributes {\n                url\n                alternativeText\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').WorksForWorkDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query worksForWorks($locale: I18NLocaleCode) {\n    works(locale: $locale) {\n      data {\n        id\n        attributes {\n          slug\n          title\n          description\n          images {\n            data {\n              id\n              attributes {\n                url\n                previewUrl\n                alternativeText\n                formats\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').WorksForWorksDocument;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
