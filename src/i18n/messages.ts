import type { Locale } from './config';

export type Messages = {
  title: string;
  name: string;
  headline: string;
  links: { title: string; icon: 'github' | 'linkedin' | 'paper-plane' | 'twitter'; url: string }[];
};

const commonLinks = {
  github: { title: 'Github', icon: 'github', url: 'https://github.com/r3nya' },
  linkedin: { title: 'LinkedIn', icon: 'linkedin', url: 'https://www.linkedin.com/in/r3nya' },
  telegram: { title: 'Telegram', icon: 'paper-plane', url: 'https://t.me/r3nya' },
  twitter: { title: 'X/Twitter', icon: 'twitter', url: 'https://x.com/r3nya' },
} as const;

export const messages: Record<Locale, Messages> = {
  en: {
    title: 'Andrey Makarov aka r3nya',
    name: 'Andrey Makarov',
    headline: 'Software Developer 👨‍💻',
    links: [commonLinks.github, commonLinks.linkedin, commonLinks.telegram, commonLinks.twitter],
  },
  ru: {
    title: 'Андрей Макаров aka r3nya',
    name: 'Андрей Макаров',
    headline: 'Разработчик ПО 👨‍💻',
    links: [commonLinks.github, commonLinks.linkedin, commonLinks.telegram, commonLinks.twitter],
  },
  es: {
    title: 'Andrey Makarov aka r3nya',
    name: 'Andrey Makarov',
    headline: 'Desarrollador 👨‍💻',
    links: [commonLinks.github, commonLinks.linkedin, commonLinks.telegram, commonLinks.twitter],
  },
};
