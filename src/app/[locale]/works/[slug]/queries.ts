import { graphql } from "@/graphql/generated/gql";

export const worksForWorkStaticParams = graphql(/* GraphQL */ `
  query worksForWorkStaticParams($locale: I18NLocaleCode) {
    works(locale: $locale) {
      data {
        id
        attributes {
          slug
        }
      }
    }
  }
`);

export const worksForWork = graphql(/* GraphQL */ `
  query worksForWork($locale: I18NLocaleCode, $slug: String) {
    works(filters: { slug: { eq: $slug } }, locale: $locale) {
      data {
        id
        attributes {
          slug
          title
          description
          dateOfCreation
          widthInCm
          heightInCm
          categories {
            data {
              id
              attributes {
                title
                slug
              }
            }
          }
          images {
            data {
              id
              attributes {
                url
                alternativeText
              }
            }
          }
        }
      }
    }
  }
`);
