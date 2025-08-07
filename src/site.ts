export type ProfileMeta = {
  name: string;
  title: string;
  firstName: string;
  lastName: string;
  username: string;
  gender: 'male' | 'female' | 'other';
  avatar: string;
};

export type SiteMeta = {
  author: string;
  description: string;
  themeColor: string;
  yandexVerification: string;
  openGraphDescription: string;
  safariPinnedTabColor: string;
  profile: ProfileMeta;
};

export const siteMeta: SiteMeta = {
  author: 'Andrew M.',
  description: "Andrey Makarov's homepage",
  themeColor: '#6f42c1',
  yandexVerification: '1ff13f78c7797ab6',
  openGraphDescription: "Yeah! It's my homepage…",
  safariPinnedTabColor: '#5bbad5',
  profile: {
    name: 'Andrey Makarov',
    title: 'Software Developer 👨‍💻',
    firstName: 'Andrey',
    lastName: 'Makarov',
    username: 'r3nya',
    gender: 'male',
    avatar: 'https://avatars3.githubusercontent.com/u/209313?v=3&s=460',
  },
};
