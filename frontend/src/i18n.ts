import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import { translateBatch } from './i18n/translation-client';

export const supportedLanguages = ['en', 'uz', 'ru'] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

const baseEnglishCatalog = {
  'nav.home': 'Home',
  'nav.login': 'Login',
  'nav.register': 'Register',
  'nav.dashboard': 'Dashboard',
  'nav.admin': 'Admin',
  'nav.language': 'Language',
} as const;

const loadedLanguageBundles = new Set<SupportedLanguage>(['en']);

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: { ...baseEnglishCatalog },
      },
      uz: {
        translation: {},
      },
      ru: {
        translation: {},
      },
    },
    supportedLngs: supportedLanguages as unknown as string[],
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export async function ensureAutoTranslations(language: SupportedLanguage): Promise<void> {
  if (language === 'en' || loadedLanguageBundles.has(language)) {
    return;
  }

  const keys = Object.keys(baseEnglishCatalog);
  const texts = keys.map((key) => baseEnglishCatalog[key as keyof typeof baseEnglishCatalog]);

  try {
    const translations = await translateBatch(texts, language, 'en');
    const translationBundle: Record<string, string> = {};

    keys.forEach((key, index) => {
      const fallbackText = texts[index] ?? '';
      translationBundle[key] = translations[index]?.translation ?? fallbackText;
    });

    i18n.addResourceBundle(language, 'translation', translationBundle, true, true);
    loadedLanguageBundles.add(language);
  } catch {
    // Keep fallback English strings when translation provider is unavailable.
  }
}

export default i18n;
