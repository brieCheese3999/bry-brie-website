import type {ClipArtContent, Win95PortfolioContent} from './types'
import BryHeadshot from '../assets/bryanna/BryannaHeadshot.jpg'
import Acadia from '../assets/photos/ACADIA.jpeg'
import Acadia1 from '../assets/photos/ACADIA1.jpeg'
import Acadia2 from '../assets/photos/ACADIA2.jpeg'
import Acadia5 from '../assets/photos/ACADIA5.jpeg'
import Acadia6 from '../assets/photos/ACADIA6.jpeg'
import Acadia7 from '../assets/photos/ACADIA7.jpeg'
import Acadia8 from '../assets/photos/ACADIA8.jpeg'
import Acadia9 from '../assets/photos/ACADIA9.jpeg'
import Acadia10 from '../assets/photos/ACADIA10.jpeg'
import Acadia11 from '../assets/photos/ACADIA11.jpeg'
import Acadia12 from '../assets/photos/ACADIA12.jpeg'
import Acadia13 from '../assets/photos/ACADIA13.jpeg'
import Acadia14 from '../assets/photos/ACADIA14.jpeg'
import Acadia15 from '../assets/photos/ACADIA15.jpeg'
import Acadia16 from '../assets/photos/ACADIA16.jpeg'
import Acadia17 from '../assets/photos/ACADIA17.jpeg'
import Acadia18 from '../assets/photos/ACADIA18.jpeg'
import Acadia19 from '../assets/photos/ACADIA19.jpeg'
import Acadia21 from '../assets/photos/ACADIA21.jpeg'
import Acadia22 from '../assets/photos/ACADIA22.jpeg'
import Acadia23 from '../assets/photos/ACADIA23.jpeg'

import Guatemala1 from '../assets/photos/GUATEMALA_1.jpg'
import Guatemala2 from '../assets/photos/GUATEMALA_2.jpg'
import Guatemala3 from '../assets/photos/GUATEMALA_3.jpg'
import Guatemala4 from '../assets/photos/GUATEMALA_4.jpg'
import Guatemala5 from '../assets/photos/GUATEMALA_5.jpg'
import Guatemala7 from '../assets/photos/GUATEMALA_7.jpg'
import Guatemala8 from '../assets/photos/GUATEMALA_8.jpg'
import Guatemala9 from '../assets/photos/GUATEMALA_9.jpg'
import Guatemala10 from '../assets/photos/GUATEMALA_10.jpg'
import Guatemala11 from '../assets/photos/GUATEMALA_11.jpg'
import Guatemala12 from '../assets/photos/GUATEMALA_12.jpg'
import Guatemala15 from '../assets/photos/GUATEMALA15.jpeg'
import Hawaii1 from '../assets/photos/HAWAII_1.jpg'
import Hawaii2 from '../assets/photos/HAWAII_2.jpg'
import Hawaii3 from '../assets/photos/HAWAII_3.jpg'
import Hawaii4 from '../assets/photos/HAWAII_4.jpg'
import Hawaii10 from '../assets/photos/HAWAII10.jpeg'
import Hawaii11 from '../assets/photos/HAWAII11.jpeg'
import Hawaii15 from '../assets/photos/HAWAII15.jpeg'
import Hawaii16 from '../assets/photos/HAWAII16.jpeg'
import Hawaii25 from '../assets/photos/HAWAII25.jpeg'
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
import NYC8 from '../assets/photos/NYC8.jpeg'
import NYC9 from '../assets/photos/NYC9.jpeg'
import NYC10 from '../assets/photos/NYC10.jpeg'
import NYC13 from '../assets/photos/NYC_13.jpg'
import NYC22 from '../assets/photos/NYC22.jpeg'
import NYC26 from '../assets/photos/NYC26.jpeg'
import NYC27 from '../assets/photos/NYC27.jpeg'
import NYC28 from '../assets/photos/NYC28.jpeg'
import NYC29 from '../assets/photos/NYC29.jpeg'
import NYC30 from '../assets/photos/NYC30.jpeg'
import Chi1 from '../assets/photos/CHI1.jpeg'
import Chi2 from '../assets/photos/CHI2.jpeg'
import Chi5 from '../assets/photos/CHI5.jpeg'
import Peru from '../assets/photos/PERU.jpeg'
import Peru3 from '../assets/photos/PERU3.jpeg'
import Thailand1 from '../assets/photos/THAILAND1.jpeg'
import Thailand2 from '../assets/photos/THAILAND2.jpeg'
import Thailand3 from '../assets/photos/THAILAND3.jpeg'
import Thailand4 from '../assets/photos/THAILAND4.jpeg'
import Thailand6 from '../assets/photos/THAILAND6.jpeg'
import Thailand8 from '../assets/photos/THAILAND8.jpeg'
import Thailand9 from '../assets/photos/THAILAND9.jpeg'
import Thailand10 from '../assets/photos/THAILAND10.jpeg'
import Thailand11 from '../assets/photos/THAILAND11.jpeg'
import Thailand13 from '../assets/photos/THAILAND13.jpeg'
import Thailand14 from '../assets/photos/THAILAND14.jpeg'
import Thailand15 from '../assets/photos/THAILAND15.jpeg'
import Thailand16 from '../assets/photos/THAILAND16.jpeg'
import Thailand17 from '../assets/photos/THAILAND17.jpeg'
import Thailand20 from '../assets/photos/THAILAND20.jpeg'
import Thailand25 from '../assets/photos/THAILAND25.jpeg'

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
    heading: 'about\nme!',
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
        { id: 'ig', glyph: 'IG', icon: SiInstagram, color: '#E4405F', handle: '@b_bry3' },
        { id: 'ln', glyph: 'Ln', icon: FaLinkedin, color: '#0A66C2', handle: 'Bryanna Plaisir', url: 'https://www.linkedin.com/in/bryanna-plaisir/' },
        { id: 'pi', glyph: 'Gh', icon: SiGithub, color: '#181717', handle: 'brieCheese3999', url: 'https://github.com/brieCheese3999/bry-brie-website/projects' },
      ],
    },
  },

  photos: {
    heading: 'photo\nalbum',
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
        'New York',
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
      { id: 'gu15', img: Guatemala15, label: "Guatemala (2023)", alt: "Guatemala (2023)" },
      { id: 'ac', img: Acadia, label: "Acadia, Maine", alt: "Acadia, Maine" },
      { id: 'ac1', img: Acadia1, label: "Acadia, Maine", alt: "Acadia, Maine" },
      { id: 'ac2', img: Acadia2, label: "Acadia, Maine", alt: "Acadia, Maine" },
      { id: 'ac5', img: Acadia5, label: "Acadia, Maine", alt: "Acadia, Maine" },
      { id: 'ac6', img: Acadia6, label: "Acadia, Maine", alt: "Acadia, Maine" },
      { id: 'ac7', img: Acadia7, label: "Acadia, Maine", alt: "Acadia, Maine" },
      { id: 'ac8', img: Acadia8, label: "Acadia, Maine", alt: "Acadia, Maine" },
      { id: 'ac9', img: Acadia9, label: "Acadia, Maine", alt: "Acadia, Maine" },
      { id: 'ac10', img: Acadia10, label: "Acadia, Maine", alt: "Acadia, Maine" },
      { id: 'ac11', img: Acadia11, label: "Acadia, Maine", alt: "Acadia, Maine" },
      { id: 'ac12', img: Acadia12, label: "Acadia, Maine", alt: "Acadia, Maine" },
      { id: 'ac13', img: Acadia13, label: "Acadia, Maine", alt: "Acadia, Maine" },
      { id: 'ac14', img: Acadia14, label: "Acadia, Maine", alt: "Acadia, Maine" },
      { id: 'ac15', img: Acadia15, label: "Acadia, Maine", alt: "Acadia, Maine" },
      { id: 'ac16', img: Acadia16, label: "Acadia, Maine", alt: "Acadia, Maine" },
      { id: 'ac17', img: Acadia17, label: "Acadia, Maine", alt: "Acadia, Maine" },
      { id: 'ac18', img: Acadia18, label: "Acadia, Maine", alt: "Acadia, Maine" },
      { id: 'ac19', img: Acadia19, label: "Acadia, Maine", alt: "Acadia, Maine" },
      { id: 'ac21', img: Acadia21, label: "Acadia, Maine", alt: "Acadia, Maine" },
      { id: 'ac22', img: Acadia22, label: "Acadia, Maine", alt: "Acadia, Maine" },
      { id: 'ac23', img: Acadia23, label: "Acadia, Maine", alt: "Acadia, Maine" },
      { id: 'chi1', img: Chi1, label: "Chicago, Illinois", alt: "Chicago, Illinois" },
      { id: 'chi2', img: Chi2, label: "Chicago, Illinois", alt: "Chicago, Illinois" },
      { id: 'chi5', img: Chi5, label: "Chicago, Illinois", alt: "Chicago, Illinois" },
      { id: 'hw10', img: Hawaii10, label: "Maui, Hawaii (2025)", alt: "Maui, Hawaii (2025)" },
      { id: 'hw11', img: Hawaii11, label: "Maui, Hawaii (2025)", alt: "Maui, Hawaii (2025)" },
      { id: 'hw15', img: Hawaii15, label: "Maui, Hawaii (2025)", alt: "Maui, Hawaii (2025)" },
      { id: 'hw16', img: Hawaii16, label: "Maui, Hawaii (2025)", alt: "Maui, Hawaii (2025)" },
      { id: 'hw25', img: Hawaii25, label: "Maui, Hawaii (2025)", alt: "Maui, Hawaii (2025)" },
      { id: 'nyc8', img: NYC8, label: "New York City", alt: "New York City" },
      { id: 'nyc9', img: NYC9, label: "New York City", alt: "New York City" },
      { id: 'nyc10', img: NYC10, label: "New York City", alt: "New York City" },
      { id: 'nyc22', img: NYC22, label: "New York City", alt: "New York City" },
      { id: 'nyc26', img: NYC26, label: "New York City", alt: "New York City" },
      { id: 'nyc27', img: NYC27, label: "New York City", alt: "New York City" },
      { id: 'nyc28', img: NYC28, label: "New York City", alt: "New York City" },
      { id: 'nyc29', img: NYC29, label: "New York City", alt: "New York City" },
      { id: 'nyc30', img: NYC30, label: "New York City", alt: "New York City" },
      { id: 'peru1', img: Peru, label: "Peru (2026)", alt: "Peru (2026)" },
      { id: 'peru3', img: Peru3, label: "Peru (2026)", alt: "Peru (2026)" },
      { id: 'th1', img: Thailand1, label: "Thailand", alt: "Thailand" },
      { id: 'th2', img: Thailand2, label: "Thailand", alt: "Thailand" },
      { id: 'th3', img: Thailand3, label: "Thailand", alt: "Thailand" },
      { id: 'th4', img: Thailand4, label: "Thailand", alt: "Thailand" },
      { id: 'th6', img: Thailand6, label: "Thailand", alt: "Thailand" },
      { id: 'th8', img: Thailand8, label: "Thailand", alt: "Thailand" },
      { id: 'th9', img: Thailand9, label: "Thailand", alt: "Thailand" },
      { id: 'th10', img: Thailand10, label: "Thailand", alt: "Thailand" },
      { id: 'th11', img: Thailand11, label: "Thailand", alt: "Thailand" },
      { id: 'th13', img: Thailand13, label: "Thailand", alt: "Thailand" },
      { id: 'th14', img: Thailand14, label: "Thailand", alt: "Thailand" },
      { id: 'th15', img: Thailand15, label: "Thailand", alt: "Thailand" },
      { id: 'th16', img: Thailand16, label: "Thailand", alt: "Thailand" },
      { id: 'th17', img: Thailand17, label: "Thailand", alt: "Thailand" },
      { id: 'th20', img: Thailand20, label: "Thailand", alt: "Thailand" },
      { id: 'th25', img: Thailand25, label: "Thailand", alt: "Thailand" },
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
      right: "85%",
      width: "150px",
      layer: 'front',
      fixed: true,
    }]
}

