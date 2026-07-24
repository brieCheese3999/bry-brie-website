import type {ClipArtContent, Win95PortfolioContent} from './types'
import BryHeadshot from '../assets/bryanna/BryannaHeadshot.jpg'
import Guatemala1 from '../assets/photos/GUATEMALA_1.jpg'
import Guatemala2 from '../assets/photos/GUATEMALA_2.jpg'
import Guatemala3 from '../assets/photos/GUATEMALA_3.jpg'
import Guatemala4 from '../assets/photos/GUATEMALA_4.jpg'
import Guatemala5 from '../assets/photos/GUATEMALA_5.jpg'
import NYC13 from '../assets/photos/NYC_13.jpg'
import Guatemala7 from '../assets/photos/GUATEMALA_7.jpg'
import Guatemala8 from '../assets/photos/GUATEMALA_8.jpg'
import Guatemala9 from '../assets/photos/GUATEMALA_9.jpg'
import Guatemala10 from '../assets/photos/GUATEMALA_10.jpg'
import Guatemala11 from '../assets/photos/GUATEMALA_11.jpg'
import Guatemala12 from '../assets/photos/GUATEMALA_12.jpg'
import Hawaii1 from '../assets/photos/HAWAII_1.jpg'
import Hawaii2 from '../assets/photos/HAWAII_2.jpg'
import Hawaii3 from '../assets/photos/HAWAII_3.jpg'
import Hawaii4 from '../assets/photos/HAWAII_4.jpg'
import Toto from '../assets/background/Toto.png'
import TotoLicking from '../assets/background/Toto lick copy.png'

export const defaultContent: Win95PortfolioContent = {
  windowTitle: 'PORTFOLIO.EXE',

  about: {
    heading: 'about\nme!',
    name: 'Bryanna Plaisir',
    bio:
      "Hi, I'm Bryanna, a software engineer with  experience across fintech and AI startups. I've worked on large-scale data migrations, distributed database upgrades, Kubernetes infrastructure, observability systems, and full-stack API development. I'm fluent in Go, Java, and Python, and I've built production systems on both AWS and GCP. I enjoy working on complex, high-impact infrastructure problems and building systems that are reliable at scale.\n\n Outside of engineering, I'm an avid biker and enjoy exploring New York City. I also spend my free time baking, from sourdough bread to cookies, and have recently taken up ceramics, focusing on hand-building techniques.",skills: [
      { id: 'fg', label: 'Fg' },
      { id: 'ae', label: 'Ae' },
      { id: 'pr', label: 'Pr' },
      { id: 'ps', label: 'Ps' },
      { id: 'ai', label: 'Ai' },
      { id: 'wp', label: 'Wp' },
      { id: 'vs', label: 'VS' },
    ],
    education: { years: '2017–2021', school: 'University of Wisconsin-Madison', majors: ['Applied Mathematics' ,'Theatre'], minor: 'Computer Science'}
    ,
    photoWindow: {
      title: 'MEET-BRYANNA',
      imageUrl: BryHeadshot ,
      alt: 'Portrait of Bryanna',
    },
    socials: {
      title: 'SOCIALS',
      links: [
        { id: 'ig', glyph: 'IG', handle: '@b_bry3' },
        { id: 'ln', glyph: 'Ln', handle: 'Bryanna Plaisir' },
        { id: 'pi', glyph: 'Gh', handle: 'brieCheese3999' },
      ],
    },
  },

  photos: {
    heading: 'photo\nalbum',
    intro: 'A few frames from behind the lens — street, film, and studio work, sorted loosely by roll.',
    sectionLabel: 'GALLERY',
    items: [
      { id: 'gu1', img: Guatemala1 , label: "Antigua, Guatemala (2023)", alt: "Antigua, Guatemala (2023) - Town Square" },
      { id: 'gu2', img: Guatemala2 , label: "Antigua, Guatemala (2023)", alt: "Antigua, Guatemala (2023) - Tapestry Shop " },
      { id: 'gu3', img: Guatemala3 , label: "Late Atilitan, Guatemala (2023)", alt:"Late Atilitan, Guatemala (2023) - Sunset " },
      { id: 'gu4', img: Guatemala4 , label: "Antigua, Guatemala (2023)", alt: "Antigua, Guatemala (2023) - Sunset (2) " },
      { id: 'gu5', img: Guatemala5 , label: "Antigua, Guatemala (2023)", alt: "Antigua, Guatemala (2023) - Sunset (3) " },
      { id: 'nyc13', img: NYC13 , label: "New York City (2023)", alt: "New York City (2023) - Friends"  },
      { id: 'gu7', img: Guatemala7 , label: "Antigua, Guatemala (2023)" , alt: "Antigua, Guatemala (2023)" },
      { id: 'gu8', img: Guatemala8 , label: "Antigua, Guatemala (2023)", alt: "Antigua, Guatemala (2023) - Cathedral " },
      { id: 'gu9', img: Guatemala9 , label: "Acatenango, Guatemala (2023)", alt: "Acatenango, Guatemala (2023) - Clouds" },
      { id: 'gu10', img: Guatemala10 , label: "Acatenango, Guatemala (2023)", alt: "Acatenango, Guatemala (2023) - Volcano " },
      { id: 'gu11', img: Guatemala11 , label: "Acatenango, Guatemala (2023)", alt:"Acatenango, Guatemala (2023) - Forest " },
      { id: 'gu12', img: Guatemala12 , label: "Antigua, Guatemala (2023)", alt:"Antigua, Guatemala (2023) - Sunset (4) " },
      { id: 'hw1', img: Hawaii1 , label: "Maui, Hawaii (2025)", alt: "Maui, Hawaii (2025) - Sunset" },
      { id: 'hw2', img: Hawaii2 , label: "Maui, Hawaii (2025)", alt: "Maui, Hawaii (2025) - Clouds" },
      { id: 'hw3', img: Hawaii3 , label: "Maui, Hawaii (2025)", alt:"Maui, Hawaii (2025) - Whale Watching" },
      { id: 'hw4', img: Hawaii4 , label: "Maui, Hawaii (2025)", alt:"Maui, Hawaii (2025)" },
    ],
  },

  ceramics: {
    heading: 'clay\nworks',
    intro: "Wheel-thrown and hand-built pieces, glazed in small batches. Most are one-offs — what's shown is what's left.",
    sectionLabel: 'PIECES',
    items: [
      {
        id: 'c1', label: 'bowl_01',
        img: undefined
      },
      {
        id: 'c2', label: 'vase_02',
        img: undefined
      },
      {
        id: 'c3', label: 'mug_03',
        img: undefined
      },
      {
        id: 'c4', label: 'plate_04',
        img: undefined
      },
      {
        id: 'c5', label: 'vase_05',
        img: undefined
      },
      {
        id: 'c6', label: 'bowl_06',
        img: undefined
      },
    ],
  },
};

export const defaultClipArt: ClipArtContent = {
    items: [{
      id: "toto-1",
      img: Toto,
      alt: "Toto flopped over",
      left: "0%",
      right: "0%",
      width: "350px",

    },{
      id: "toto-2",
      img: TotoLicking,
      alt: "Toto licking",
      bottom: "0%",
      right: "50%",
      width: "250px",
      zIndex: 10
    }]
}
