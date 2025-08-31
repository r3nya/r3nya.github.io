import type { Locale } from './config';

export type Messages = {
  title: string;
  name: string;
  headline: string;
  skip_to_content: string;
  links: {
    title: string;
    icon: 'github' | 'linkedin' | 'paper-plane' | 'twitter';
    url: string;
  }[];
};

const commonLinks = {
  github: { title: 'Github', icon: 'github', url: 'https://github.com/r3nya' },
  linkedin: {
    title: 'LinkedIn',
    icon: 'linkedin',
    url: 'https://www.linkedin.com/in/r3nya',
  },
  telegram: {
    title: 'Telegram',
    icon: 'paper-plane',
    url: 'https://t.me/r3nya',
  },
  twitter: { title: 'X/Twitter', icon: 'twitter', url: 'https://x.com/r3nya' },
} as const;

export const messages: Record<Locale, Messages> = {
  en: {
    title: 'Andrey Makarov aka r3nya',
    name: 'Andrey Makarov',
    headline: 'Software Developer 👨‍💻',
    skip_to_content: 'Skip to content',
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
    skip_to_content: 'Перейти к содержанию',
    links: [
      commonLinks.github,
      commonLinks.linkedin,
      commonLinks.telegram,
      commonLinks.twitter,
    ],
  },
  es: {
    title: 'Andrey Makárov aka r3nya',
    name: 'Andrey Makárov',
    headline: 'Desarrollador 👨‍💻',
    skip_to_content: 'Saltar al contenido',
    links: [
      commonLinks.github,
      commonLinks.linkedin,
      commonLinks.telegram,
      commonLinks.twitter,
    ],
  },
};
