import React from 'react';
import { Fieldset, Frame } from '@react95/core';
import { Printer } from '@react95/icons/Printer';
import { Diskcopy1 } from '@react95/icons/Diskcopy1';
import { useResponsiveMode } from '../useResponsiveMode';
import resumePdf from '../../assets/Bryanna_Plaisir_Resume.pdf';
import resumeImg from '../../assets/Bryanna_Plaisir_Resume.png';
import './resume.css';

export const ResumePanel: React.FC = () => {
  const { isMobile } = useResponsiveMode();

  const handlePrint = () => {
    const w = window.open(resumePdf);
    w?.addEventListener('load', () => w.print());
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = resumePdf;
    a.download = 'Bryanna_Plaisir_Resume.pdf';
    a.click();
  };

  return (
    <div className={`win95-typewriter resume-page${isMobile ? ' win95-mobile-stack' : ''}`}>
      <Fieldset
        className={`win95-pixel-heading ${isMobile ? 'win95-mobile-fieldset' : ''}`}
        style={{ width: isMobile ? undefined : '100%' }}
      >
        <Frame display="flex" flexDirection="column">
          <div className="resume-toolbar">
            <button className="resume-toolbar-btn" onClick={handlePrint}>
              <Printer variant="32x32_4" />
              <span className="resume-toolbar-label">Print</span>
            </button>
            <button className="resume-toolbar-btn" onClick={handleDownload}>
              <Diskcopy1 variant="32x32_4" />
              <span className="resume-toolbar-label">Download</span>
            </button>
          </div>
          <div className="resume-pdf-wrapper">
            <img
              src={resumeImg}
              alt="Bryanna Plaisir Resume"
              className="resume-pdf-viewer"
            />
          </div>
        </Frame>
      </Fieldset>
    </div>
  );
};
