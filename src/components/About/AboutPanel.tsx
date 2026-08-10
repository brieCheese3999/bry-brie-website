import React from 'react';
import type {AboutContent, SkillGroup, SkillIcon} from '../types.ts';
import {Fieldset, Frame, Modal} from "@react95/core";
import { useResponsiveMode } from '../useResponsiveMode.ts';

const SKILL_GROUP_ORDER: SkillGroup[] = ['Backend', 'Frontend', 'Data & Cloud'];

const groupSkills = (skills: SkillIcon[]) =>
    SKILL_GROUP_ORDER
        .map((group) => ({ group, items: skills.filter((s) => s.group === group) }))
        .filter((g) => g.items.length > 0);

const SkillsGrid: React.FC<{ skills: SkillIcon[] }> = ({ skills }) => (
    <div className="win95-skill-groups">
        {groupSkills(skills).map(({ group, items }) => (
            <div key={group} className="win95-skill-group">
                <span className="win95-skill-group-label">{group}</span>
                <div className="win95-skill-tile-row">
                    {items.map((skill) => {
                        const Icon = skill.icon;
                        return (
                            <div
                                key={skill.id}
                                className="win95-skill-tile"
                                title={skill.note ? `${skill.label} (${skill.note})` : skill.label}
                            >
                                <span className="win95-skill-tile-icon">
                                    <Icon size={32} color={skill.color} />
                                </span>
                                <span className="win95-skill-tile-label">{skill.label}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        ))}
    </div>
);


const DesktopAboutPanel: React.FC<{ content: AboutContent }> = ({ content }) => {
  return (
  <div style={{ position: 'relative' ,paddingTop: '15px'}}>
      <Fieldset  width="800px" legend={content.heading} className="win95-pixel-heading">
          <Frame display="flex" flexDirection="column">
              <div className="win95-icon-row">
                  <h2 className="win95-subject-name">{content.name}</h2>
                  <p className="win95-bio-text">{content.bio}</p>
              </div>
          </Frame>
      </Fieldset>

      <Fieldset width="800px" legend="SKILLS" className="win95-section-label">
          <Frame display="flex" flexDirection="column">
              <SkillsGrid skills={content.skills} />
          </Frame>
      </Fieldset>

      <Fieldset width="500px" legend="EDUCATION" className="win95-section-label">
          <Frame display="flex" flexDirection="column">
      <div className="win95-edu-item">
        <span className="win95-yrs">{content.education.years}</span>
        <span className="win95-school">{content.education.school}</span>
          <br/>
          <span className="win95-school">Majors: </span>
          {content.education.majors.map((major) => (
          <span className="win95-major" key={major}>[{major}] </span>
          ))}
          <br/>
          <span className="win95-school">Minor:</span>
          <span className="win95-major"> [{content.education.minor}]</span>

      </div>

          </Frame>
      </Fieldset>

      <Modal style={{fontSize:"20px"}} id="photo-modal" title={content.photoWindow.title} titleBarOptions={<Modal.Minimize />}  dragOptions={{ defaultPosition: { x: 870, y: -25 } }}>
          <Modal.Content width="450px" boxShadow="$in" bgColor="white" p="16px">
              <Frame as="div" display="flex" flexDirection="column" gap="8px">
                  <img src={content.photoWindow.imageUrl} alt={content.photoWindow.alt}/>
              </Frame>
          </Modal.Content>
      </Modal>

      <Modal  style={{fontSize:"15px"}} id="socials-modal" title={content.socials.title} titleBarOptions={<Modal.Minimize />}  dragOptions={{ defaultPosition: { x: 870, y: 620 } }}>
          <Modal.Content minWidth="450px" minHeight="150px">
              <Frame  display="flex" bgColor="$material" boxShadow="$out" flexDirection="column" padding="$6" gap="$7">
                  {content.socials.links.map((link) => {
                      const Icon = link.icon;
                      return (
                      <Frame key={link.handle} as="div" className="win95-social-modal-row" display="flex" bgColor="white" boxShadow="$in" flexDirection="row" alignItems="center" padding="$6">
                          <span  className="win95-social-glyph">{Icon ? <Icon size={20} color={link.color} /> : link.glyph}</span>   {link.url ? (
                            <a className="win95-social-link" href={link.url} target="_blank" rel="noopener noreferrer">{link.handle}</a>
                          ) : (
                            link.handle
                          )}
                      </Frame>
                      );
                  })}
              </Frame>
          </Modal.Content>
      </Modal>


  </div>
  );
};

/**
 * Mobile rendering: everything from DesktopAboutPanel, but as a single
 * static column — no draggable Modals, no fixed pixel coordinates, no
 * scale-to-fit wrapper. Each "window" becomes a plain Fieldset section
 * that flows naturally with the page, so it works at any width.
 */
const MobileAboutPanel: React.FC<{ content: AboutContent }> = ({ content }) => {
  return (
  <div className="win95-mobile-stack">
    <Fieldset legend={content.heading} className="win95-pixel-heading win95-mobile-fieldset">
      <h2 className="win95-subject-name">{content.name}</h2>
      <p className="win95-bio-text">{content.bio}</p>
      {content.photoWindow.imageUrl && (
        <img
          className="win95-mobile-photo"
          src={content.photoWindow.imageUrl}
          alt={content.photoWindow.alt}
        />
      )}
    </Fieldset>

    <Fieldset legend="SKILLS" className="win95-section-label win95-mobile-fieldset">
      <SkillsGrid skills={content.skills} />
    </Fieldset>

    <Fieldset legend="EDUCATION" className="win95-section-label win95-mobile-fieldset">
      <div className="win95-edu-item">
        <span className="win95-yrs">{content.education.years}</span>
        <span className="win95-school">{content.education.school}</span>
        <br />
        <span className="win95-school">Majors: </span>
        {content.education.majors.map((major) => (
          <span key={major}>[{major}] </span>
        ))}
        <br />
        <span className="win95-school">Minor:</span>
        <span> [{content.education.minor}]</span>
      </div>
    </Fieldset>

    <Fieldset legend={content.socials.title} className="win95-section-label win95-mobile-fieldset">
      <div className="win95-mobile-social-list">
        {content.socials.links.map((link) => {
          const Icon = link.icon;
          return (
          <div key={link.handle} className="win95-social-row">
            <span className="win95-social-glyph">{Icon ? <Icon size={20} color={link.color} /> : link.glyph}</span>
            {link.url ? (
              <a className="win95-social-link" href={link.url} target="_blank" rel="noopener noreferrer">{link.handle}</a>
            ) : (
              <span>{link.handle}</span>
            )}
          </div>
          );
        })}
      </div>
    </Fieldset>
  </div>
  );
};

export const AboutPanel: React.FC<{ content: AboutContent }> = ({ content }) => {
  const { isMobile } = useResponsiveMode();
  return isMobile ? <MobileAboutPanel content={content} /> : <DesktopAboutPanel content={content} />;
};
