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
  title: string;
  keywords: string;
  profile: ProfileMeta;
};
