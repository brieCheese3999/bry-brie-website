export type TabId = 'about' | 'photos' | 'ceramics';

export interface SkillIcon {
  id: string;
  label: string;
}

export interface EducationItem {
  years: string;
  school: string;
  detail: string;
}

export interface AboutContent {
  heading: string;
  name: string;
  bio: string;
  skills: SkillIcon[];
  education: EducationItem[];
  photoWindow: {
    title: string & never;
    imageUrl: string;
    alt: string;
  };
  socials: {
    title: string & never;
    links: SocialLink[];
  };
}

export interface GalleryItem {
  id: string;
  label: string;
  imageUrl?: string;
  alt?: string;
}

export interface GalleryContent {
  heading: string;
  intro: string;
  sectionLabel: string;
  items: GalleryItem[];
}

export interface SocialLink {
  id: string;
  glyph: string;
  handle: string;
}

export interface Win95PortfolioContent {
  windowTitle: string;
  about: AboutContent;
  photos: GalleryContent;
  ceramics: GalleryContent;
}


export interface WindowPosition {
  x: number;
  y: number;
}
