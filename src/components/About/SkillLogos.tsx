import React from 'react';

const s = 32;

const GoLogo = () => (
  <svg viewBox="0 0 32 32" width={s} height={s}>
    <rect fill="#00ADD8" width="32" height="32" rx="6"/>
    <text x="16" y="22" fill="#fff" fontSize="15" fontWeight="bold" textAnchor="middle" fontFamily="Arial, sans-serif">Go</text>
  </svg>
);

const JavaLogo = () => (
  <svg viewBox="0 0 32 32" width={s} height={s}>
    <rect fill="#E76F00" width="32" height="32" rx="6"/>
    <path d="M12 7c0 0 2 3 -1 6 -3 3 0 5 0 5" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
    <path d="M16 7c0 0 2 3 -1 6 -3 3 0 5 0 5" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
    <path d="M9 22c0 0 1.5 1.5 5 0.5s5 1 5 1" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <path d="M8 25c0 0 2 1.5 7 0.5s7 1 7 1" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
  </svg>
);

const PythonLogo = () => (
  <svg viewBox="0 0 32 32" width={s} height={s}>
    <rect fill="#3776AB" width="32" height="32" rx="6"/>
    <path d="M16 5c-4 0-5 2-5 3.5V11h5.5v1H9c-2 0-4 1.5-4 5s1.5 5 4 5h2.5v-3c0-2 1.5-3.5 3.5-3.5h5c1.5 0 3-1 3-3V8.5C23 7 21.5 5 16 5zm-2.5 2a1 1 0 110 2 1 1 0 010-2z" fill="#FFD43B"/>
    <path d="M16 27c4 0 5-2 5-3.5V21h-5.5v-1H23c2 0 4-1.5 4-5s-1.5-5-4-5h-2.5v3c0 2-1.5 3.5-3.5 3.5h-5c-1.5 0-3 1-3 3v4.5C9 25 10.5 27 16 27zm2.5-2a1 1 0 110-2 1 1 0 010 2z" fill="#fff"/>
  </svg>
);

const TypeScriptLogo = () => (
  <svg viewBox="0 0 32 32" width={s} height={s}>
    <rect fill="#3178C6" width="32" height="32" rx="6"/>
    <text x="16" y="22" fill="#fff" fontSize="14" fontWeight="bold" textAnchor="middle" fontFamily="Arial, sans-serif">TS</text>
  </svg>
);

const ReactLogo = () => (
  <svg viewBox="0 0 32 32" width={s} height={s}>
    <rect fill="#20232A" width="32" height="32" rx="6"/>
    <g transform="translate(16,16)" fill="none" stroke="#61DAFB" strokeWidth="1.3">
      <ellipse rx="11" ry="4.5"/>
      <ellipse rx="11" ry="4.5" transform="rotate(60)"/>
      <ellipse rx="11" ry="4.5" transform="rotate(120)"/>
    </g>
    <circle cx="16" cy="16" r="2" fill="#61DAFB"/>
  </svg>
);

const NextLogo = () => (
  <svg viewBox="0 0 32 32" width={s} height={s}>
    <rect fill="#000" width="32" height="32" rx="6"/>
    <text x="16" y="22" fill="#fff" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="Arial, sans-serif">N</text>
  </svg>
);

const SpringLogo = () => (
  <svg viewBox="0 0 32 32" width={s} height={s}>
    <rect fill="#6DB33F" width="32" height="32" rx="6"/>
    <path d="M24 8c-1 5-4 8-8 10-3 1.5-6 1-8 0" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <path d="M8 24c1-5 4-8 8-10 3-1.5 6-1 8 0" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <circle cx="10" cy="22" r="1.5" fill="#fff"/>
  </svg>
);

const KubernetesLogo = () => (
  <svg viewBox="0 0 32 32" width={s} height={s}>
    <rect fill="#326CE5" width="32" height="32" rx="6"/>
    <g transform="translate(16,16)" fill="none" stroke="#fff" strokeWidth="1.5">
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <line key={a} x1="0" y1="0" x2={Math.sin(a * Math.PI / 180) * 9} y2={-Math.cos(a * Math.PI / 180) * 9}/>
      ))}
    </g>
    <circle cx="16" cy="16" r="4" fill="none" stroke="#fff" strokeWidth="1.5"/>
    <polygon points="16,7 21.5,12 21.5,20 16,25 10.5,20 10.5,12" fill="none" stroke="#fff" strokeWidth="1.2"/>
  </svg>
);

const AWSLogo = () => (
  <svg viewBox="0 0 32 32" width={s} height={s}>
    <rect fill="#232F3E" width="32" height="32" rx="6"/>
    <text x="16" y="18" fill="#FF9900" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="Arial, sans-serif">AWS</text>
    <path d="M8 21 Q16 25 24 21" stroke="#FF9900" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <path d="M20 22 l4 -1 l-1 3" fill="#FF9900"/>
  </svg>
);

const GCPLogo = () => (
  <svg viewBox="0 0 32 32" width={s} height={s}>
    <rect fill="#fff" width="32" height="32" rx="6" stroke="#ddd" strokeWidth="0.5"/>
    <circle cx="11" cy="12" r="3.5" fill="#EA4335"/>
    <circle cx="21" cy="12" r="3.5" fill="#4285F4"/>
    <circle cx="16" cy="21" r="3.5" fill="#34A853"/>
    <circle cx="11" cy="12" r="1.5" fill="#fff"/>
    <circle cx="21" cy="12" r="1.5" fill="#fff"/>
    <circle cx="16" cy="21" r="1.5" fill="#fff"/>
    <line x1="13.5" y1="13.5" x2="18.5" y2="13.5" stroke="#FBBC05" strokeWidth="1.2"/>
    <line x1="12" y1="14.5" x2="14.5" y2="19" stroke="#FBBC05" strokeWidth="1.2"/>
    <line x1="19.5" y1="14.5" x2="17.5" y2="19" stroke="#FBBC05" strokeWidth="1.2"/>
  </svg>
);

const PostgresLogo = () => (
  <svg viewBox="0 0 32 32" width={s} height={s}>
    <rect fill="#336791" width="32" height="32" rx="6"/>
    <ellipse cx="15" cy="14" rx="7" ry="8" fill="none" stroke="#fff" strokeWidth="1.5"/>
    <path d="M22 14c0 4-1 8-2 10s-2 3-4 2" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <ellipse cx="12.5" cy="12" rx="1.5" ry="2" fill="#fff"/>
    <path d="M11 17 Q15 20 19 17" stroke="#fff" strokeWidth="1" fill="none"/>
  </svg>
);

const MySQLLogo = () => (
  <svg viewBox="0 0 32 32" width={s} height={s}>
    <rect fill="#00758F" width="32" height="32" rx="6"/>
    <text x="16" y="15" fill="#F29111" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="Arial, sans-serif">My</text>
    <text x="16" y="25" fill="#fff" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="Arial, sans-serif">SQL</text>
  </svg>
);

const TerraformLogo = () => (
  <svg viewBox="0 0 32 32" width={s} height={s}>
    <rect fill="#7B42BC" width="32" height="32" rx="6"/>
    <g transform="translate(7,5)">
      <polygon points="6,0 12,3.5 12,10.5 6,7" fill="#fff"/>
      <polygon points="13,4 19,7.5 19,14.5 13,11" fill="#fff" opacity="0.7"/>
      <polygon points="6,8 12,11.5 12,18.5 6,15" fill="#fff"/>
      <polygon points="0,4 6,7 6,14 0,10.5" fill="#fff" opacity="0.5"/>
    </g>
  </svg>
);

const GrafanaLogo = () => (
  <svg viewBox="0 0 32 32" width={s} height={s}>
    <rect fill="#F46800" width="32" height="32" rx="6"/>
    <circle cx="16" cy="16" r="8" fill="none" stroke="#fff" strokeWidth="1.5"/>
    <circle cx="16" cy="16" r="3" fill="#fff"/>
    {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
      <line
        key={a}
        x1={16 + Math.cos(a * Math.PI / 180) * 9}
        y1={16 + Math.sin(a * Math.PI / 180) * 9}
        x2={16 + Math.cos(a * Math.PI / 180) * 11}
        y2={16 + Math.sin(a * Math.PI / 180) * 11}
        stroke="#fff" strokeWidth="2" strokeLinecap="round"
      />
    ))}
  </svg>
);

export const skillLogos: Record<string, React.ReactNode> = {
  go: <GoLogo />,
  java: <JavaLogo />,
  python: <PythonLogo />,
  typescript: <TypeScriptLogo />,
  react: <ReactLogo />,
  nextjs: <NextLogo />,
  spring: <SpringLogo />,
  kubernetes: <KubernetesLogo />,
  aws: <AWSLogo />,
  gcp: <GCPLogo />,
  postgresql: <PostgresLogo />,
  mysql: <MySQLLogo />,
  terraform: <TerraformLogo />,
  grafana: <GrafanaLogo />,
};
