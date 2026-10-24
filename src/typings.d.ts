export type ProfileMeta = {
  name: string;
  firstName: string;
  lastName: string;
  username: string;
  gender: 'male' | 'female' | 'other';
  avatar: string;
};

export type SiteMeta = {
  author: string;
  themeColor: { light: string; dark: string };
  yandexVerification: string;
  openGraphDescription: string;
  safariPinnedTabColor: string;
  title: string;
  profile: ProfileMeta;
};
