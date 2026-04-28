import type { Locale } from './config';

export type Messages = {
  title: string;
  name: string;
  headline: string;
  bio: string;
  description: string;
  skip_to_content: string;
  sections: {
    links: string;
  };
  contact: {
    title: string;
    email: string;
    cvLabel: string;
    cvUrl: string;
  };
  theme: {
    toggle: string;
    auto: string;
    light: string;
    dark: string;
  };
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
    title: 'Andrei Makarov aka r3nya',
    name: 'Andrei Makarov',
    headline: 'Software developer',
    bio: 'Build software for ~15 years. Currently into developer tools, AI-assisted workflows, and well-crafted interfaces.',
    description: "Andrei Makarov's homepage",
    skip_to_content: 'Skip to content',
    sections: {
      links: 'Links',
    },
    contact: {
      title: 'Contact',
      email: 'hi@r3nya.ru',
      cvLabel: 'Download CV (PDF)',
      cvUrl: '/cv.pdf',
    },
    theme: {
      toggle: 'Toggle theme',
      auto: 'auto',
      light: 'light',
      dark: 'dark',
    },
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
    headline: 'Разработчик ПО',
    bio: 'Пишу код уже ~15 лет. Сейчас — инструменты для разработчиков, AI-воркфлоу и качественные интерфейсы.',
    description: 'Домашняя страница Андрея Макарова',
    skip_to_content: 'Перейти к содержанию',
    sections: {
      links: 'Ссылки',
    },
    contact: {
      title: 'Контакты',
      email: 'hi@r3nya.ru',
      cvLabel: 'Скачать резюме (PDF)',
      cvUrl: '/cv.pdf',
    },
    theme: {
      toggle: 'Переключить тему',
      auto: 'авто',
      light: 'светлая',
      dark: 'темная',
    },
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
    headline: 'Desarrollador de software',
    bio: 'Programo desde hace ~15 años. Ahora me interesan las herramientas para desarrolladores, los flujos con IA y las interfaces bien hechas.',
    description: 'Página web de Andrei Makárov',
    skip_to_content: 'Saltar al contenido',
    sections: {
      links: 'Enlaces',
    },
    contact: {
      title: 'Contacto',
      email: 'hi@r3nya.ru',
      cvLabel: 'Descargar CV (PDF)',
      cvUrl: '/cv.pdf',
    },
    theme: {
      toggle: 'Cambiar tema',
      auto: 'auto',
      light: 'claro',
      dark: 'oscuro',
    },
    links: [
      commonLinks.github,
      commonLinks.linkedin,
      commonLinks.telegram,
      commonLinks.twitter,
    ],
  },
};
