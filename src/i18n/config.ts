export const locales = ['en', 'ru', 'es'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';
