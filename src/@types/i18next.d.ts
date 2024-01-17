// import the original type declarations
import "i18next";
// import all namespaces (for the default language, only)
import general from "../app/i18n/locales/en/general.json";
import home from "../app/i18n/locales/en/home.json";

declare module "i18next" {
  // Extend CustomTypeOptions
  interface CustomTypeOptions {
    // custom namespace type, if you changed it
    defaultNS: "general";
    // custom resources type
    resources: {
      general: typeof general;
      home: typeof home;
    };
    // other
  }
}
