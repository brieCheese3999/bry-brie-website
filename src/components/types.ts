import type { IconType } from 'react-icons';

export type TabId = 'about' | 'photos' | 'ceramics' | 'resume' | 'contact';

export type SkillGroup = 'Backend' | 'Frontend' | 'Data & Cloud';

export interface SkillIcon {
  id: string;
  label: string;
  icon: IconType;
  group: SkillGroup;
  color?: string;
  note?: string;
}

export interface EducationItem {
  years: string;
  school: string;
  majors: string[];
  minor: string;
}

export interface AboutContent {
  heading: string;
  name: string;
  bio: string;
  skills: SkillIcon[];
  education: EducationItem;
  photoWindow: {
    title: string;
    imageUrl: string;
    alt: string;
  };
  socials: {
    title: string;
    links: SocialLink[];
  };
}

export interface GalleryItem {
  id: string;
  label: string;
  img: string;
  width?: number;
  height?: number;
  thumbnail?: string;
  srcSet?: string;
  alt?: string;
}

export interface GalleryContent {
  heading: string;
  intro: string;
  sectionLabel: string;
  items: GalleryItem[];
}

export interface ClipArtItem {
  id: string;
  img: string;
  alt: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  width?: string;
  zIndex?: number;
  speed?: number;
  layer?: 'front' | 'back';
  fixed?: boolean;
}

export interface ClipArtContent {
  items: ClipArtItem[];
}

export interface SocialLink {
  id: string;
  glyph: string;
  icon?: IconType;
  color?: string;
  handle: string;
  url?: string;
}

export type CeramicStatus = 'for-sale' | 'showcase';

export interface CeramicMedia {
  type: 'image' | 'video';
  src: string;
  poster?: string;
  alt?: string;
}

export interface CeramicPiece {
  id: string;
  title: string;
  year?: string;
  blurb: string;
  media: CeramicMedia[];
  technique?: string;
  clay?: string;
  glaze?: string;
  dimensions?: string;
  status: CeramicStatus;
  price?: number;
  etsyUrl?: string;
}

export interface CeramicsContent {
  heading: string;
  intro: string;
  sectionLabel: string;
  items: CeramicPiece[];
}

export interface Win95PortfolioContent {
  windowTitle: string;
  about: AboutContent;
  photos: GalleryContent;
  ceramics: CeramicsContent;
}
