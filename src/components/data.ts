import type {ClipArtContent, Win95PortfolioContent} from './types'

// Every travel photo, imported in bulk via Vite's glob so we don't maintain ~90
// hand-written import lines. Keyed by lowercased filename, so lookups are
// case-insensitive (the files on disk are .JPG while some references use .jpg —
// this also keeps case-sensitive Linux/CI builds working).
const photoModules: Record<string, string> = import.meta.glob(
  '../assets/photos/*.{jpg,jpeg,JPG,JPEG,png,PNG}',
  { eager: true, import: 'default' },
);

const photosByName: Record<string, string> = {};
for (const [path, url] of Object.entries(photoModules)) {
  const base = path.split('/').pop()!.toLowerCase();
  photosByName[base] = url;
}

/** Resolve a photo by filename (case-insensitive). Throws if it's missing so a
 *  typo fails loudly at startup rather than rendering a broken image. */
const photo = (name: string): string => {
  const url = photosByName[name.toLowerCase()];
  if (!url) throw new Error(`Photo not found in assets/photos: ${name}`);
  return url;
};
import BryHeadshot from '../assets/bryanna/BryannaHeadshot.jpg'


import Toto from '../assets/background/Toto.png'
import TotoLicking from '../assets/background/Toto lick copy.png'
import {
  SiGo,
  SiOpenjdk,
  SiPython,
  SiReact,
  SiTypescript,
  SiNextdotjs,
  SiBootstrap,
  SiKubernetes,
  SiGooglecloud,
  SiPostgresql,
  SiMysql,
  SiMinio,
  SiTerraform,
  SiInstagram,
  SiGithub,
} from 'react-icons/si'
import { FaAws, FaLinkedin } from 'react-icons/fa'
import { TbDatabase } from 'react-icons/tb'


export const defaultContent: Win95PortfolioContent = {
  windowTitle: 'PORTFOLIO.EXE',

  about: {
    heading: 'about me!',
    name: 'Bryanna Plaisir',
    bio:
      "Hi, I'm Bryanna, a software engineer with  experience across fintech and AI startups. I've worked on large-scale data migrations, distributed database upgrades, Kubernetes infrastructure, observability systems, and full-stack API development. I'm fluent in Python, Java, Typescript and Go, and I've built and managed production systems on both AWS and GCP.\n\n Outside of engineering, I'm an avid biker and enjoy biking around New York City. I also love baking sourdough bread and trying out new cookie recipes! One hobby that I've recently taken up is ceramics, with a focus on hand-building techniques.",skills: [
      { id: 'go', label: 'Go', icon: SiGo, group: 'Backend', color: '#00ADD8' },
      { id: 'java', label: 'Java', icon: SiOpenjdk, group: 'Backend', color: '#E76F00', note: 'Spring Boot, Hibernate' },
      { id: 'python', label: 'Python', icon: SiPython, group: 'Backend', color: '#3776AB', note: 'Pandas, Flask, Boto3' },

      { id: 'react', label: 'React', icon: SiReact, group: 'Frontend', color: '#61DAFB' },
      { id: 'typescript', label: 'TypeScript', icon: SiTypescript, group: 'Frontend', color: '#3178C6' },
      { id: 'nextjs', label: 'Next.js', icon: SiNextdotjs, group: 'Frontend', color: '#000000' },
      { id: 'bootstrap', label: 'Bootstrap', icon: SiBootstrap, group: 'Frontend', color: '#7952B3' },

      { id: 'kubernetes', label: 'Kubernetes', icon: SiKubernetes, group: 'Data & Cloud', color: '#326CE5' },
      { id: 'aws', label: 'AWS', icon: FaAws, group: 'Data & Cloud', color: '#FF9900', note: 'Lambda, EC2, S3, Glue, RDS, SQS' },
      { id: 'gcp', label: 'GCP', icon: SiGooglecloud, group: 'Data & Cloud', color: '#4285F4' },
      { id: 'postgresql', label: 'PostgreSQL', icon: SiPostgresql, group: 'Data & Cloud', color: '#336791' },
      { id: 'mysql', label: 'MySQL', icon: SiMysql, group: 'Data & Cloud', color: '#4479A1' },
      { id: 'yugabyte', label: 'YugabyteDB', icon: TbDatabase, group: 'Data & Cloud', color: '#FF6E42' },
      { id: 'minio', label: 'MinIO', icon: SiMinio, group: 'Data & Cloud', color: '#C72E49' },
      { id: 'terraform', label: 'Terraform', icon: SiTerraform, group: 'Data & Cloud', color: '#7B42BC' },
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
        { id: 'ig', glyph: 'IG', icon: SiInstagram, color: '#E4405F', handle: '@b_bry3', url: 'https://www.instagram.com/b_bry3/' },
        { id: 'ln', glyph: 'Ln', icon: FaLinkedin, color: '#0A66C2', handle: 'Bryanna Plaisir', url: 'https://www.linkedin.com/in/bryanna-plaisir/' },
        { id: 'pi', glyph: 'Gh', icon: SiGithub, color: '#181717', handle: 'brieCheese3999', url: 'https://github.com/brieCheese3999' },
      ],
    },
  },

  photos: {
    heading: 'photo album',
    intro: 'Since 2022, I have been shooting film photography as a way of documenting my travels throughout my life. This collection of photographs traces a personal journey across a range of destinations, capturing not just landscapes and landmarks but the intimate, everyday moments shared along the way. Shot entirely on film, each image carries a distinct warmth. To date, this collection spans the following destinations:\n' +
        '\n' +
        'Peru\n' +
        'Vietnam\n' +
        'Thailand\n' +
        'France\n' +
        'Lisbon\n' +
        'Mexico City\n' +
        'Acadia\n' +
        'Hawaii\n' +
        'Guatemala\n' +
        'Chicago\n' +
        'New York',
    sectionLabel: 'GALLERY',
    items: [
      { id: 'gu1', img: photo('GUATEMALA_1.JPG') , label: "Antigua, Guatemala (2023)", alt: "Antigua, Guatemala (2023) - Town Square" },
      { id: 'gu5', img: photo('GUATEMALA_5.jpg') , label: "Antigua, Guatemala (2023)", alt: "Antigua, Guatemala (2023) - Sunset (3) " },
      { id: 'nyc13', img: photo('NYC_13.jpg') , label: "New York City (2023)", alt: "New York City (2023) - Friends"  },
      { id: 'nyc1', img: photo('NYC_1.jpg') , label: "New York City (2023)", alt: "New York City (2023) - Vince"  },
      { id: 'gu12', img: photo('GUATEMALA_12.JPG') , label: "Antigua, Guatemala (2023)", alt:"Antigua, Guatemala (2023) - Sunset (4) " },
      { id: 'nyc3', img: photo('NYC_3.jpg') , label: "New York City (2023)", alt: "New York City (2023) - Anaje"  },
      { id: 'nyc4', img: photo('NYC_4.jpg') , label: "New York City (2023)", alt: "New York City (2023) - Coney Island"  },
      { id: 'gu7', img: photo('GUATEMALA_7.JPG') , label: "Antigua, Guatemala (2023)" , alt: "Antigua, Guatemala (2023)" },
      { id: 'gu8', img: photo('GUATEMALA_8.JPG') , label: "Antigua, Guatemala (2023)", alt: "Antigua, Guatemala (2023) - Cathedral " },
      { id: 'hw1', img: photo('HAWAII_1.jpg') , label: "Maui, Hawaii (2025)", alt: "Maui, Hawaii (2025) - Sunset" },
      { id: 'hw4', img: photo('HAWAII_4.jpg') , label: "Maui, Hawaii (2025)", alt:"Maui, Hawaii (2025)" },
      { id: 'mp1', img: photo('MP_1.jpg') , label: "Machu Picchu, Peru (2026)", alt:"Aguas Calientes, Peru (2026)" },
      { id: 'mp2', img: photo('MP_2.jpg') , label: "Machu Picchu, Peru (2026)", alt:"Aguas Calientes, Peru (2026)" },
      { id: 'mp3', img: photo('MP_3.jpg') , label: "Machu Picchu, Peru (2026)", alt:"Aguas Calientes, Peru (2026)" },
      { id: 'gu9', img: photo('GUATEMALA_9.JPG') , label: "Acatenango, Guatemala (2023)", alt: "Acatenango, Guatemala (2023) - Clouds" },
      { id: 'mp4', img: photo('MP_4.jpg') , label: "Machu Picchu, Peru (2026)", alt:"Aguas Calientes, Peru (2026)" },
      { id: 'mp5', img: photo('MP_5.JPG') , label: "Machu Picchu, Peru (2026)", alt:"Aguas Calientes, Peru (2026)" },
      { id: 'gu2', img: photo('GUATEMALA_2.jpg') , label: "Antigua, Guatemala (2023)", alt: "Antigua, Guatemala (2023) - Tapestry Shop " },
      { id: 'mp6', img: photo('MP_6.JPG') , label: "Machu Picchu, Peru (2026)", alt:"Aguas Calientes, Peru (2026)" },
      { id: 'mp7', img: photo('MP_7.JPG') , label: "Machu Picchu, Peru (2026)", alt:"Aguas Calientes, Peru (2026)" },
      { id: 'hw2', img: photo('HAWAII_2.jpg') , label: "Maui, Hawaii (2025)", alt: "Maui, Hawaii (2025) - Clouds" },
      { id: 'mp8', img: photo('MP_8.JPG') , label: "Machu Picchu, Peru (2026)", alt:"Aguas Calientes, Peru (2026)" },
      { id: 'gu10', img: photo('GUATEMALA_10.JPG') , label: "Acatenango, Guatemala (2023)", alt: "Acatenango, Guatemala (2023) - Volcano " },
      { id: 'mp9', img: photo('MP_9.JPG') , label: "Machu Picchu, Peru (2026)", alt:"Aguas Calientes, Peru (2026)" },
      { id: 'mp10', img: photo('MP_10.JPG') , label: "Machu Picchu, Peru (2026)", alt:"Aguas Calientes, Peru (2026)" },
      { id: 'hw3', img: photo('HAWAII_3.jpg') , label: "Maui, Hawaii (2025)", alt:"Maui, Hawaii (2025) - Whale Watching" },
      { id: 'mp11', img: photo('MP_11.JPG') , label: "Machu Picchu, Peru (2026)", alt:"Aguas Calientes, Peru (2026)" },
      { id: 'gu3', img: photo('GUATEMALA_3.jpg') , label: "Late Atilitan, Guatemala (2023)", alt:"Late Atilitan, Guatemala (2023) - Sunset " },
      { id: 'mp12', img: photo('MP_12.JPG') , label: "Machu Picchu, Peru (2026)", alt:"Aguas Calientes, Peru (2026)" },
      { id: 'mp13', img: photo('MP_13.JPG') , label: "Machu Picchu, Peru (2026)", alt:"Aguas Calientes, Peru (2026)" },
      { id: 'gu11', img: photo('GUATEMALA_11.JPG') , label: "Acatenango, Guatemala (2023)", alt:"Acatenango, Guatemala (2023) - Forest " },
      { id: 'mp14', img: photo('MP_14.JPG') , label: "Machu Picchu, Peru (2026)", alt:"Aguas Calientes, Peru (2026)" },
      { id: 'gu4', img: photo('GUATEMALA_4.jpg') , label: "Antigua, Guatemala (2023)", alt: "Antigua, Guatemala (2023) - Sunset (2) " },
      { id: 'gu15', img: photo('GUATEMALA15.jpeg'), label: "Guatemala (2023)", alt: "Guatemala (2023)" },
      { id: 'ac', img: photo('ACADIA.jpeg'), label: "Acadia, Maine", alt: "Acadia, Maine" },
      { id: 'ac1', img: photo('ACADIA1.jpeg'), label: "Acadia, Maine", alt: "Acadia, Maine" },
      { id: 'ac2', img: photo('ACADIA2.jpeg'), label: "Acadia, Maine", alt: "Acadia, Maine" },
      { id: 'ac5', img: photo('ACADIA5.jpeg'), label: "Acadia, Maine", alt: "Acadia, Maine" },
      { id: 'ac6', img: photo('ACADIA6.jpeg'), label: "Acadia, Maine", alt: "Acadia, Maine" },
      { id: 'ac7', img: photo('ACADIA7.jpeg'), label: "Acadia, Maine", alt: "Acadia, Maine" },
      { id: 'ac8', img: photo('ACADIA8.jpeg'), label: "Acadia, Maine", alt: "Acadia, Maine" },
      { id: 'ac9', img: photo('ACADIA9.jpeg'), label: "Acadia, Maine", alt: "Acadia, Maine" },
      { id: 'ac10', img: photo('ACADIA10.jpeg'), label: "Acadia, Maine", alt: "Acadia, Maine" },
      { id: 'ac11', img: photo('ACADIA11.jpeg'), label: "Acadia, Maine", alt: "Acadia, Maine" },
      { id: 'ac12', img: photo('ACADIA12.jpeg'), label: "Acadia, Maine", alt: "Acadia, Maine" },
      { id: 'ac13', img: photo('ACADIA13.jpeg'), label: "Acadia, Maine", alt: "Acadia, Maine" },
      { id: 'ac14', img: photo('ACADIA14.jpeg'), label: "Acadia, Maine", alt: "Acadia, Maine" },
      { id: 'ac15', img: photo('ACADIA15.jpeg'), label: "Acadia, Maine", alt: "Acadia, Maine" },
      { id: 'ac16', img: photo('ACADIA16.jpeg'), label: "Acadia, Maine", alt: "Acadia, Maine" },
      { id: 'ac17', img: photo('ACADIA17.jpeg'), label: "Acadia, Maine", alt: "Acadia, Maine" },
      { id: 'ac18', img: photo('ACADIA18.jpeg'), label: "Acadia, Maine", alt: "Acadia, Maine" },
      { id: 'ac19', img: photo('ACADIA19.jpeg'), label: "Acadia, Maine", alt: "Acadia, Maine" },
      { id: 'ac21', img: photo('ACADIA21.jpeg'), label: "Acadia, Maine", alt: "Acadia, Maine" },
      { id: 'ac22', img: photo('ACADIA22.jpeg'), label: "Acadia, Maine", alt: "Acadia, Maine" },
      { id: 'ac23', img: photo('ACADIA23.jpeg'), label: "Acadia, Maine", alt: "Acadia, Maine" },
      { id: 'chi1', img: photo('CHI1.jpeg'), label: "Chicago, Illinois", alt: "Chicago, Illinois" },
      { id: 'chi2', img: photo('CHI2.jpeg'), label: "Chicago, Illinois", alt: "Chicago, Illinois" },
      { id: 'chi5', img: photo('CHI5.jpeg'), label: "Chicago, Illinois", alt: "Chicago, Illinois" },
      { id: 'hw10', img: photo('HAWAII10.jpeg'), label: "Maui, Hawaii (2025)", alt: "Maui, Hawaii (2025)" },
      { id: 'hw11', img: photo('HAWAII11.jpeg'), label: "Maui, Hawaii (2025)", alt: "Maui, Hawaii (2025)" },
      { id: 'hw15', img: photo('HAWAII15.jpeg'), label: "Maui, Hawaii (2025)", alt: "Maui, Hawaii (2025)" },
      { id: 'hw16', img: photo('HAWAII16.jpeg'), label: "Maui, Hawaii (2025)", alt: "Maui, Hawaii (2025)" },
      { id: 'hw25', img: photo('HAWAII25.jpeg'), label: "Maui, Hawaii (2025)", alt: "Maui, Hawaii (2025)" },
      { id: 'nyc8', img: photo('NYC8.jpeg'), label: "New York City", alt: "New York City" },
      { id: 'nyc9', img: photo('NYC9.jpeg'), label: "New York City", alt: "New York City" },
      { id: 'nyc10', img: photo('NYC10.jpeg'), label: "New York City", alt: "New York City" },
      { id: 'nyc22', img: photo('NYC22.jpeg'), label: "New York City", alt: "New York City" },
      { id: 'nyc26', img: photo('NYC26.jpeg'), label: "New York City", alt: "New York City" },
      { id: 'nyc27', img: photo('NYC27.jpeg'), label: "New York City", alt: "New York City" },
      { id: 'nyc28', img: photo('NYC28.jpeg'), label: "New York City", alt: "New York City" },
      { id: 'nyc29', img: photo('NYC29.jpeg'), label: "New York City", alt: "New York City" },
      { id: 'nyc30', img: photo('NYC30.jpeg'), label: "New York City", alt: "New York City" },
      { id: 'peru1', img: photo('PERU.jpeg'), label: "Peru (2026)", alt: "Peru (2026)" },
      { id: 'peru3', img: photo('PERU3.jpeg'), label: "Peru (2026)", alt: "Peru (2026)" },
      { id: 'th1', img: photo('THAILAND1.jpeg'), label: "Thailand", alt: "Thailand" },
      { id: 'th2', img: photo('THAILAND2.jpeg'), label: "Thailand", alt: "Thailand" },
      { id: 'th3', img: photo('THAILAND3.jpeg'), label: "Thailand", alt: "Thailand" },
      { id: 'th4', img: photo('THAILAND4.jpeg'), label: "Thailand", alt: "Thailand" },
      { id: 'th6', img: photo('THAILAND6.jpeg'), label: "Thailand", alt: "Thailand" },
      { id: 'th8', img: photo('THAILAND8.jpeg'), label: "Thailand", alt: "Thailand" },
      { id: 'th9', img: photo('THAILAND9.jpeg'), label: "Thailand", alt: "Thailand" },
      { id: 'th10', img: photo('THAILAND10.jpeg'), label: "Thailand", alt: "Thailand" },
      { id: 'th11', img: photo('THAILAND11.jpeg'), label: "Thailand", alt: "Thailand" },
      { id: 'th13', img: photo('THAILAND13.jpeg'), label: "Thailand", alt: "Thailand" },
      { id: 'th14', img: photo('THAILAND14.jpeg'), label: "Thailand", alt: "Thailand" },
      { id: 'th15', img: photo('THAILAND15.jpeg'), label: "Thailand", alt: "Thailand" },
      { id: 'th16', img: photo('THAILAND16.jpeg'), label: "Thailand", alt: "Thailand" },
      { id: 'th17', img: photo('THAILAND17.jpeg'), label: "Thailand", alt: "Thailand" },
      { id: 'th20', img: photo('THAILAND20.jpeg'), label: "Thailand", alt: "Thailand" },
      { id: 'th25', img: photo('THAILAND25.jpeg'), label: "Thailand", alt: "Thailand" },
    ],
  },

  ceramics: {
    heading: 'clay works',
    intro: "Loading in the kiln, more to come soon!",
    sectionLabel: 'PIECES',
    items: [
        ],
  },
};

export const defaultClipArt: ClipArtContent = {
    items: [{
      id: "toto-1",
      img: Toto,
      alt: "Toto flopped over",
      right: "0%",
      top: "0px",
      width: "250px",
      layer: 'back',
      fixed: true,
    },{
      id: "toto-2",
      img: TotoLicking,
      alt: "Toto licking",
      bottom: "28px",
      right: "10%",
      width: "150px",
      layer: 'front',
      fixed: true,
    }]
}

