import BryHeadshot from '../assets/bryanna/BryannaHeadshot.jpg'

export const defaultContent: {
  ceramics: {
    heading: string;
    intro: string;
    items: ({ id: string; label: string } | { id: string; label: string } | { id: string; label: string } | {
      id: string;
      label: string
    } | { id: string; label: string } | { id: string; label: string })[];
    sectionLabel: string
  };
  about: {
    skills: ({ id: string; label: string } | { id: string; label: string } | { id: string; label: string } | {
      id: string;
      label: string
    } | { id: string; label: string } | { id: string; label: string } | { id: string; label: string })[];
    education: ({ school: string; detail: string; years: string } | {
      school: string;
      detail: string;
      years: string
    } | { school: string; detail: string; years: string })[];
    heading: string;
    name: string;
    bio: string;
    socials: {
      links: ({ glyph: string; handle: string; id: string } | { glyph: string; handle: string; id: string } | {
        glyph: string;
        handle: string;
        id: string
      })[];
      title: string
    };
    photoWindow: { imageUrl: any; alt: string; title: string }
  };
  windowTitle: string;
  photos: {
    heading: string;
    intro: string;
    items: ({ id: string; label: string } | { id: string; label: string } | { id: string; label: string } | {
      id: string;
      label: string
    } | { id: string; label: string } | { id: string; label: string })[];
    sectionLabel: string
  }
} = {
  windowTitle: 'PORTFOLIO.EXE',

  about: {
    heading: 'about\nme!',
    name: 'Sophie Van Schil',
    bio:
      "Hello! I'm Sophie Van Schil and I'm 20 years old. I specialize in interface design, which allows me to work with software like WordPress, Elementor, Visual Studio Code, and Figma. I'm always looking for new tricks and innovative designs to boost my creativity!",
    skills: [
      { id: 'fg', label: 'Fg' },
      { id: 'ae', label: 'Ae' },
      { id: 'pr', label: 'Pr' },
      { id: 'ps', label: 'Ps' },
      { id: 'ai', label: 'Ai' },
      { id: 'wp', label: 'Wp' },
      { id: 'vs', label: 'VS' },
    ],
    education: [
      { years: '2022–', school: 'AP Hogeschool', detail: 'bachelor Grafische Digitale Media' },
      { years: '2021–2022', school: 'KU Leuven', detail: 'bachelor Criminology (not completed)' },
      { years: '2016–2021', school: 'SJI Kontich', detail: 'Economy-modern languages' },
    ],
    photoWindow: {
      title: 'MEET-BRYANNA',
      imageUrl: BryHeadshot ,
      alt: 'Portrait of Sophie',
    },
    socials: {
      title: 'SOCIALS',
      links: [
        { id: 'ig', glyph: 'IG', handle: '@s0ph1ed1gital' },
        { id: 'be', glyph: 'Be', handle: 'Sophie Van Schil' },
        { id: 'pi', glyph: 'Pi', handle: '@s0ph1ed1gital' },
      ],
    },
  },

  photos: {
    heading: 'photo\nalbum',
    intro: 'A few frames from behind the lens — street, film, and studio work, sorted loosely by roll.',
    sectionLabel: 'GALLERY',
    items: [
      { id: 'p1', label: 'img_01.jpg' },
      { id: 'p2', label: 'img_02.jpg' },
      { id: 'p3', label: 'img_03.jpg' },
      { id: 'p4', label: 'img_04.jpg' },
      { id: 'p5', label: 'img_05.jpg' },
      { id: 'p6', label: 'img_06.jpg' },
    ],
  },

  ceramics: {
    heading: 'clay\nworks',
    intro: "Wheel-thrown and hand-built pieces, glazed in small batches. Most are one-offs — what's shown is what's left.",
    sectionLabel: 'PIECES',
    items: [
      { id: 'c1', label: 'bowl_01' },
      { id: 'c2', label: 'vase_02' },
      { id: 'c3', label: 'mug_03' },
      { id: 'c4', label: 'plate_04' },
      { id: 'c5', label: 'vase_05' },
      { id: 'c6', label: 'bowl_06' },
    ],
  }
};
