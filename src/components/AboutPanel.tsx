import React from 'react';
import type { AboutContent } from './types';
import {Fieldset, Frame, Modal} from "@react95/core";

export const AboutPanel: React.FC<{ content: AboutContent }> = ({ content }) => (
  <section className="win95-panel">


      <Fieldset  width="400px" legend={content.heading} className="win95-pixel-heading" style={{
          marginBottom: '1em'
      }}>
          <Frame display="flex" flexDirection="column">
              <div className="win95-icon-row">
                  <h2 className="win95-subject-name">{content.name}</h2>
                  <p className="win95-bio-text">{content.bio}</p>
              </div>
          </Frame>
      </Fieldset>

      <Fieldset width="500px" legend="SKILLS" className="win95-section-label" style={{
          marginBottom: '1em'
      }}>
          <Frame display="flex" flexDirection="column">
    <div className="win95-icon-row">
      {content.skills.map((skill) => (
        <div key={skill.id} className="win95-icon-chip win95-raised">
          {skill.label}
        </div>
      ))}
    </div>
      </Frame>
      </Fieldset>

    <span className="win95-section-label">EDUCATION</span>
    {content.education.map((edu) => (
      <div key={edu.school} className="win95-edu-item">
        <span className="win95-yrs">{edu.years}</span>
        <span className="win95-school">{edu.school}</span> — {edu.detail}
      </div>
    ))}

      <Modal id="photo-modal" title={content.photoWindow.title} titleBarOptions={<Modal.Minimize />}>
          <Modal.Content width="350px" boxShadow="$in" bgColor="white" p="16px">
              <Frame as="div" display="flex" flexDirection="column" gap="8px">
                  <img src={content.photoWindow.imageUrl} alt={content.photoWindow.alt}/>
              </Frame>
          </Modal.Content>
      </Modal>

      <Modal id="photo-modal" title={content.socials.title} titleBarOptions={<Modal.Minimize />}>
          <Modal.Content width="230px">
              <Frame  display="flex" bgColor="$material" boxShadow="$out" flexDirection="column" padding="$4" gap="$4">
                  {content.socials.links.map((link) => (
                      <Frame as="div" display="flex" bgColor="white" boxShadow="$in" flexDirection="row" padding="$4">
                          <span  className="win95-social-glyph">{link.glyph}</span>   {link.handle}
                      </Frame>
                  ))}
              </Frame>
          </Modal.Content>
      </Modal>
  </section>
);
