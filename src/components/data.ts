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
import MP1 from '../assets/photos/MP_1.jpg'
import MP2 from '../assets/photos/MP_2.jpg'
import MP3 from '../assets/photos/MP_3.jpg'
import MP4 from '../assets/photos/MP_4.jpg'
import MP5 from '../assets/photos/MP_5.jpg'
import MP6 from '../assets/photos/MP_6.jpg'
import MP7 from '../assets/photos/MP_7.jpg'
import MP8 from '../assets/photos/MP_8.jpg'
import MP9 from '../assets/photos/MP_9.jpg'
import MP10 from '../assets/photos/MP_10.jpg'
import MP11 from '../assets/photos/MP_11.jpg'
import MP12 from '../assets/photos/MP_12.jpg'
import MP13 from '../assets/photos/MP_13.jpg'
import MP14 from '../assets/photos/MP_14.jpg'
import NYC1 from '../assets/photos/NYC_1.jpg'
import NYC3 from '../assets/photos/NYC_3.jpg'
import NYC4 from '../assets/photos/NYC_4.jpg'


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
} from 'react-icons/si'
import { FaAws } from 'react-icons/fa'
import { TbDatabase } from 'react-icons/tb'


export const defaultContent: Win95PortfolioContent = {
  windowTitle: 'PORTFOLIO.EXE',

  about: {
    heading: 'about\nme!',
    name: 'Bryanna Plaisir',
    bio:
      "Hi, I'm Bryanna, a software engineer with  experience across fintech and AI startups. I've worked on large-scale data migrations, distributed database upgrades, Kubernetes infrastructure, observability systems, and full-stack API development. I'm fluent in Go, Java, and Python, and I've built production systems on both AWS and GCP. I enjoy working on complex, high-impact infrastructure problems and building systems that are reliable at scale.\n\n Outside of engineering, I'm an avid biker and enjoy exploring New York City. I also spend my free time baking, from sourdough bread to cookies, and have recently taken up ceramics, focusing on hand-building techniques.",skills: [
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
        { id: 'ig', glyph: 'IG', handle: '@b_bry3' },
        { id: 'ln', glyph: 'Ln', handle: 'Bryanna Plaisir', url: 'https://www.linkedin.com/in/bryanna-plaisir/' },
        { id: 'pi', glyph: 'Gh', handle: 'brieCheese3999', url: 'https://github.com/brieCheese3999/bry-brie-website/projects' },
      ],
    },
  },

  photos: {
    heading: 'photo\nalbum',
    intro: 'This collection of film photographs traces a personal journey across a range of destinations, including the colonial streets and volcanic landscapes of Guatemala, the sun-drenched cliffs and cloud-draped horizons of Hawaii, the ancient stone terraces of Machu Picchu, and candid moments captured throughout New York City. Shot entirely on film, the images carry a distinct warmth and texture that only analog photography can produce, from soft grain and subtle light leaks to the timestamped corners that anchor each frame to a specific place and moment. Together, they form a visual travel log spanning multiple years and continents, reflecting both the natural grandeur of mountains, coastlines, and skies, and the intimate, everyday moments shared along the way. As an ongoing archive, this collection will continue to grow with each new journey, adding to a lifelong record of travel told frame by frame.',
    sectionLabel: 'GALLERY',
    items: [
      { id: 'gu1', img: Guatemala1 , label: "Antigua, Guatemala (2023)", alt: "Antigua, Guatemala (2023) - Town Square" },
      { id: 'gu5', img: Guatemala5 , label: "Antigua, Guatemala (2023)", alt: "Antigua, Guatemala (2023) - Sunset (3) " },
      { id: 'nyc13', img: NYC13 , label: "New York City (2023)", alt: "New York City (2023) - Friends"  },
      { id: 'nyc1', img: NYC1 , label: "New York City (2023)", alt: "New York City (2023) - Vince"  },
      { id: 'gu12', img: Guatemala12 , label: "Antigua, Guatemala (2023)", alt:"Antigua, Guatemala (2023) - Sunset (4) " },
      { id: 'nyc3', img: NYC3 , label: "New York City (2023)", alt: "New York City (2023) - Anaje"  },
      { id: 'nyc4', img: NYC4 , label: "New York City (2023)", alt: "New York City (2023) - Coney Island"  },
      { id: 'gu7', img: Guatemala7 , label: "Antigua, Guatemala (2023)" , alt: "Antigua, Guatemala (2023)" },
      { id: 'gu8', img: Guatemala8 , label: "Antigua, Guatemala (2023)", alt: "Antigua, Guatemala (2023) - Cathedral " },
      { id: 'hw1', img: Hawaii1 , label: "Maui, Hawaii (2025)", alt: "Maui, Hawaii (2025) - Sunset" },
      { id: 'hw4', img: Hawaii4 , label: "Maui, Hawaii (2025)", alt:"Maui, Hawaii (2025)" },
      { id: 'mp1', img: MP1 , label: "Machu Picchu, Peru (2026)", alt:"Aguas Calientes, Peru (2026)" },
      { id: 'mp2', img: MP2 , label: "Machu Picchu, Peru (2026)", alt:"Aguas Calientes, Peru (2026)" },
      { id: 'mp3', img: MP3 , label: "Machu Picchu, Peru (2026)", alt:"Aguas Calientes, Peru (2026)" },
      { id: 'gu9', img: Guatemala9 , label: "Acatenango, Guatemala (2023)", alt: "Acatenango, Guatemala (2023) - Clouds" },
      { id: 'mp4', img: MP4 , label: "Machu Picchu, Peru (2026)", alt:"Aguas Calientes, Peru (2026)" },
      { id: 'mp5', img: MP5 , label: "Machu Picchu, Peru (2026)", alt:"Aguas Calientes, Peru (2026)" },
      { id: 'gu2', img: Guatemala2 , label: "Antigua, Guatemala (2023)", alt: "Antigua, Guatemala (2023) - Tapestry Shop " },
      { id: 'mp6', img: MP6 , label: "Machu Picchu, Peru (2026)", alt:"Aguas Calientes, Peru (2026)" },
      { id: 'mp7', img: MP7 , label: "Machu Picchu, Peru (2026)", alt:"Aguas Calientes, Peru (2026)" },
      { id: 'hw2', img: Hawaii2 , label: "Maui, Hawaii (2025)", alt: "Maui, Hawaii (2025) - Clouds" },
      { id: 'mp8', img: MP8 , label: "Machu Picchu, Peru (2026)", alt:"Aguas Calientes, Peru (2026)" },
      { id: 'gu10', img: Guatemala10 , label: "Acatenango, Guatemala (2023)", alt: "Acatenango, Guatemala (2023) - Volcano " },
      { id: 'mp9', img: MP9 , label: "Machu Picchu, Peru (2026)", alt:"Aguas Calientes, Peru (2026)" },
      { id: 'mp10', img: MP10 , label: "Machu Picchu, Peru (2026)", alt:"Aguas Calientes, Peru (2026)" },
      { id: 'hw3', img: Hawaii3 , label: "Maui, Hawaii (2025)", alt:"Maui, Hawaii (2025) - Whale Watching" },
      { id: 'mp11', img: MP11 , label: "Machu Picchu, Peru (2026)", alt:"Aguas Calientes, Peru (2026)" },
      { id: 'gu3', img: Guatemala3 , label: "Late Atilitan, Guatemala (2023)", alt:"Late Atilitan, Guatemala (2023) - Sunset " },
      { id: 'mp12', img: MP12 , label: "Machu Picchu, Peru (2026)", alt:"Aguas Calientes, Peru (2026)" },
      { id: 'mp13', img: MP13 , label: "Machu Picchu, Peru (2026)", alt:"Aguas Calientes, Peru (2026)" },
      { id: 'gu11', img: Guatemala11 , label: "Acatenango, Guatemala (2023)", alt:"Acatenango, Guatemala (2023) - Forest " },
      { id: 'mp14', img: MP14 , label: "Machu Picchu, Peru (2026)", alt:"Aguas Calientes, Peru (2026)" },
      { id: 'gu4', img: Guatemala4 , label: "Antigua, Guatemala (2023)", alt: "Antigua, Guatemala (2023) - Sunset (2) " },
    ],
  },

  ceramics: {
    heading: 'clay\nworks',
    intro: "COMING SOON!",
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
      right: "50%",
      width: "150px",
      layer: 'front',
      fixed: true,
    }]
}

