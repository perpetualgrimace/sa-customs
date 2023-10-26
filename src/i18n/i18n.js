import { derived } from "svelte/store";
import {
  register,
  init,
  locale,
  getLocaleFromPathname,
} from "svelte-i18n";

register("en", () => import("./en.json"));
register("ar", () => import("./ar.json"));

// exactly two letters surrounded by slashes
const regex = /\/(.\w{1})\//;

export function initClient() {
  init({
    fallbackLocale: "en",
    initialLocale: getLocaleFromPathname(regex),
  });

  // console.log("initClient called");
}

// https://github.com/kaisermann/sapper-template-i18n/blob/25d44b68c23901034984387e22924a4c36319925/src/i18n.js#L46
export function initServer() {
  init({
    fallbackLocale: "en",
    initialLocale: "en",
  });

  return (req, res, next) => {
    // get the initial locale only for a document request
    const DOCUMENT_REGEX = /^([^.?#@]+)?([?#](.+)?)?$/;
    const isDocument = DOCUMENT_REGEX.test(req.originalUrl);

    if (!isDocument) {
      next();
      return;
    }

    // check the URL for a lang parameter match
    const match = req.url.match(regex);
    const lang = match ? match[1] : "en";

    locale.set(lang);

    // console.log('server initialized with', lang);

    next();
  };
}

export const textDirection = derived(locale, ($locale) =>
  $locale === "ar" ? "rtl" : "ltr"
);
