import type { Locale } from './config';

export type Messages = {
  title: string;
  name: string;
  headline: string;
  description: string;
  skip_to_content: string;
  dark_theme: string;
  alias_label: string;
  links: {
    title: string;
    url: string;
  }[];
};

const commonLinks = {
  github: { title: 'Github', url: 'https://github.com/r3nya' },
  linkedin: {
    title: 'LinkedIn',
    url: 'https://www.linkedin.com/in/r3nya',
  },
  telegram: {
    title: 'Telegram',
    url: 'https://t.me/r3nya',
  },
  twitter: { title: 'X/Twitter', url: 'https://x.com/r3nya' },
} as const;

export const messages: Record<Locale, Messages> = {
  en: {
    title: 'Andrei Makarov aka r3nya',
    name: 'Andrei Makarov',
    headline: 'Software Developer 👨‍💻',
    description: "Andrei Makarov's homepage",
    skip_to_content: 'Skip to content',
    dark_theme: 'Dark theme',
    alias_label: 'Also known as',
    links: [
      commonLinks.github,
      commonLinks.linkedin,
      commonLinks.telegram,
      commonLinks.twitter,
    ],
  },
  ru: {
    title: 'Андрей Макаров aka r3nya',
    name: 'Андрей Макаров',
    headline: 'Разработчик ПО 👨‍💻',
    description: 'Домашняя страница Андрея Макарова',
    skip_to_content: 'Перейти к содержанию',
    dark_theme: 'Тёмная тема',
    alias_label: 'Также известен как',
    links: [
      commonLinks.github,
      commonLinks.linkedin,
      commonLinks.telegram,
      commonLinks.twitter,
    ],
  },
  es: {
    title: 'Andrei Makárov aka r3nya',
    name: 'Andrei Makárov',
    headline: 'Desarrollador 👨‍💻',
    description: 'Página web de Andrei Makárov',
    skip_to_content: 'Saltar al contenido',
    dark_theme: 'Tema oscuro',
    alias_label: 'También conocido como',
    links: [
      commonLinks.github,
      commonLinks.linkedin,
      commonLinks.telegram,
      commonLinks.twitter,
    ],
  },
};
