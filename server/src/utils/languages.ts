export interface Language {
  name: string;
  value: SupportedLanguages;
}

export enum SupportedLanguages {
  en = "en",
  ar = "ar",
  es = "es",
  fr = "fr",
  de = "de",
  pt = "pt",
  it = "it",
  ja = "ja",
  ko = "ko",
  ru = "ru",
  hi = "hi",
  zh_Hans = "zh-Hans",
}

export const Languages: Language[] = [
  { name: "English", value: SupportedLanguages.en },
  { name: "Arabic", value: SupportedLanguages.ar },
  { name: "Spanish", value: SupportedLanguages.es },
  { name: "French", value: SupportedLanguages.fr },
  { name: "German", value: SupportedLanguages.de },
  { name: "Portuguese", value: SupportedLanguages.pt },
  { name: "Italian", value: SupportedLanguages.it },
  { name: "Japanese", value: SupportedLanguages.ja },
  { name: "Korean", value: SupportedLanguages.ko },
  { name: "Russian", value: SupportedLanguages.ru },
  { name: "Hindi", value: SupportedLanguages.hi },
  { name: "Chinese (Simplified)", value: SupportedLanguages.zh_Hans },
];

export interface LanguageCountry {
  countryCode: string;
  languageCode: string;
  urlSegment: string;
}

export const languagesCountry: LanguageCountry[] = [
  // English
  { countryCode: "us", languageCode: "en", urlSegment: "en-us" },
  // Arabic
  { countryCode: "sa", languageCode: "ar", urlSegment: "ar-sa" },
  // Spanish
  { countryCode: "us", languageCode: "es", urlSegment: "es-us" },
  // French
  { countryCode: "fr", languageCode: "fr", urlSegment: "fr-fr" },
  // German
  { countryCode: "de", languageCode: "de", urlSegment: "de-de" },
  // Portuguese
  { countryCode: "pt", languageCode: "pt", urlSegment: "pt-pt" },
  // Italian
  { countryCode: "it", languageCode: "it", urlSegment: "it-it" },
  // Japanese
  { countryCode: "jp", languageCode: "ja", urlSegment: "ja-jp" },
  // Korean
  { countryCode: "kr", languageCode: "ko", urlSegment: "ko-kr" },
  // Hindi
  { countryCode: "in", languageCode: "hi", urlSegment: "hi-in" },
  // Russian
  { countryCode: "ru", languageCode: "ru", urlSegment: "ru-ru" },
  // Chinese
  { countryCode: "cn", languageCode: "zh_Hans", urlSegment: "zh_Hans-cn" },
];
