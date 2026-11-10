import React, { useState } from 'react';
import type {AboutContent, SkillGroup, SkillIcon} from '../types.ts';
import {Fieldset, Frame, Modal} from "@react95/core";
import { useResponsiveMode } from '../useResponsiveMode.ts';
import { ScrambleOpening, ScrambleText } from './ScrambleText.tsx';

const SKILL_GROUP_ORDER: SkillGroup[] = ['Backend', 'Frontend', 'Data & Cloud'];

const groupSkills = (skills: SkillIcon[]) =>
    SKILL_GROUP_ORDER
        .map((group) => ({ group, items: skills.filter((s) => s.group === group) }))
        .filter((g) => g.items.length > 0);

const Legend: React.FC<{ text: string }> = ({ text }) => (
    <legend className="win95-about-legend"><ScrambleText text={text} /></legend>
);

const Bio: React.FC<{ text: string }> = ({ text }) => (
    <p className="win95-bio-text">
        {text.split(/(?<=[.!?])(\s+)/).map((part, i) => (i % 2 ? part : <ScrambleText key={i} text={part} />))}
    </p>
);

const SkillsGrid: React.FC<{ skills: SkillIcon[] }> = ({ skills }) => (
    <div className="win95-skill-groups">
        {groupSkills(skills).map(({ group, items }) => (
            <div key={group} className="win95-skill-group">
                <ScrambleText className="win95-skill-group-label" text={group} />
                <div className="win95-skill-tile-row">
                    {items.map((skill) => {
                        const Icon = skill.icon;
                        return (
                            <div
                                key={skill.id}
                                className="win95-skill-tile"
                                title={skill.note ? `${skill.label} (${skill.note})` : skill.label}
                                data-scramble-group
                            >
                                <span className="win95-skill-tile-icon">
                                    <Icon size={32} color={skill.color} />
                                </span>
                                <ScrambleText className="win95-skill-tile-label" text={skill.label} />
                            </div>
                        );
                    })}
                </div>
            </div>
        ))}
    </div>
);

const INFO_FIELDS = (content: AboutContent) => [
  { label: 'NAME', value: content.name },
  { label: 'LOCATION', value: 'Brooklyn, NY' },
  { label: 'ROLE', value: 'Software Engineer' },
];

const DesktopAboutPanel: React.FC<{ content: AboutContent }> = ({ content }) => {
  const infoFields = INFO_FIELDS(content);
  return (
  <div className="win95-typewriter win95-about" style={{ position: 'relative' }}>
      <Fieldset  width="800px" className="win95-pixel-heading">
          <Legend text={content.heading} />
          <Frame display="flex" flexDirection="column">
              <div className="about-info-summary">
                  {infoFields.map((f) => (
                      <div key={f.label} className="about-info-row" data-scramble-group>
                          <span className="about-info-label"><ScrambleText text={f.label + ':'} /></span>
                          <span className="about-info-value"><ScrambleText text={f.value} /></span>
                      </div>
                  ))}
              </div>
              <div className="win95-icon-row">
                  <Bio text={content.bio} />
              </div>
          </Frame>
      </Fieldset>

      <Fieldset width="800px" className="win95-section-label">
          <Legend text="SKILLS" />
          <Frame display="flex" flexDirection="column">
              <SkillsGrid skills={content.skills} />
          </Frame>
      </Fieldset>

      <Fieldset width="500px" className="win95-section-label">
          <Legend text="EDUCATION" />
          <Frame display="flex" flexDirection="column">
      <div className="win95-edu-item" data-scramble-group>
        <ScrambleText className="win95-yrs" text={content.education.years} />
        <ScrambleText className="win95-school" text={content.education.school} />
          <br/>
          <ScrambleText className="win95-school" text="Majors: " />
          {content.education.majors.map((major) => (
          <ScrambleText className="win95-major" key={major} text={`[${major}] `} />
          ))}
          <br/>
          <ScrambleText className="win95-school" text="Minor:" />
          <ScrambleText className="win95-major" text={` [${content.education.minor}]`} />

      </div>

          </Frame>
      </Fieldset>

      <Modal style={{fontSize: "23px"}} id="photo-modal" title={content.photoWindow.title} titleBarOptions={<Modal.Minimize />}  dragOptions={{ defaultPosition: { x: 870, y: -25 } }}>
          <Modal.Content width="450px" boxShadow="$in" bgColor="white" p="16px">
              <Frame as="div" display="flex" flexDirection="column" gap="8px">
                  <img src={content.photoWindow.imageUrl} alt={content.photoWindow.alt}/>
              </Frame>
          </Modal.Content>
      </Modal>

      <Modal  style={{fontSize: "18px"}} id="socials-modal" title={content.socials.title} titleBarOptions={<Modal.Minimize />}  dragOptions={{ defaultPosition: { x: 870, y: 620 } }}>
          <Modal.Content minWidth="450px" minHeight="150px">
              <Frame  display="flex" bgColor="$material" boxShadow="$out" flexDirection="column" padding="$6" gap="$7">
                  {content.socials.links.map((link) => {
                      const Icon = link.icon;
                      return (
                      <Frame key={link.handle} as="div" className="win95-social-modal-row" display="flex" bgColor="white" boxShadow="$in" flexDirection="row" alignItems="center" padding="$6" data-scramble-group>
                          <span  className="win95-social-glyph">{Icon ? <Icon size={20} color={link.color} /> : link.glyph}</span>   {link.url ? (
                            <a className="win95-social-link" href={link.url} target="_blank" rel="noopener noreferrer"><ScrambleText text={link.handle} /></a>
                          ) : (
                            <ScrambleText text={link.handle} />
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

const MobileAboutPanel: React.FC<{ content: AboutContent }> = ({ content }) => {
  const infoFields = INFO_FIELDS(content);
  return (
  <div className="win95-typewriter win95-mobile-stack win95-about">
    <Fieldset className="win95-pixel-heading win95-mobile-fieldset">
      <Legend text={content.heading} />
      <div className="about-info-summary">
          {infoFields.map((f) => (
              <div key={f.label} className="about-info-row" data-scramble-group>
                  <span className="about-info-label"><ScrambleText text={f.label + ':'} /></span>
                  <span className="about-info-value"><ScrambleText text={f.value} /></span>
              </div>
          ))}
      </div>
      <Bio text={content.bio} />
      {content.photoWindow.imageUrl && (
        <img
          className="win95-mobile-photo"
          src={content.photoWindow.imageUrl}
          alt={content.photoWindow.alt}
        />
      )}
    </Fieldset>

    <Fieldset className="win95-section-label win95-mobile-fieldset">
      <Legend text="SKILLS" />
      <SkillsGrid skills={content.skills} />
    </Fieldset>

    <Fieldset className="win95-section-label win95-mobile-fieldset">
      <Legend text="EDUCATION" />
      <div className="win95-edu-item" data-scramble-group>
        <ScrambleText className="win95-yrs" text={content.education.years} />
        <ScrambleText className="win95-school" text={content.education.school} />
        <br />
        <ScrambleText className="win95-school" text="Majors: " />
        {content.education.majors.map((major) => (
          <ScrambleText key={major} text={`[${major}] `} />
        ))}
        <br />
        <ScrambleText className="win95-school" text="Minor:" />
        <ScrambleText text={` [${content.education.minor}]`} />
      </div>
    </Fieldset>

    <Fieldset className="win95-section-label win95-mobile-fieldset">
      <Legend text={content.socials.title} />
      <div className="win95-mobile-social-list">
        {content.socials.links.map((link) => {
          const Icon = link.icon;
          return (
          <div key={link.handle} className="win95-social-row" data-scramble-group>
            <span className="win95-social-glyph">{Icon ? <Icon size={20} color={link.color} /> : link.glyph}</span>
            {link.url ? (
              <a className="win95-social-link" href={link.url} target="_blank" rel="noopener noreferrer"><ScrambleText text={link.handle} /></a>
            ) : (
              <ScrambleText text={link.handle} />
            )}
          </div>
          );
        })}
      </div>
    </Fieldset>
  </div>
  );
};

export const AboutPanel: React.FC<{ content: AboutContent; active: boolean }> = ({ content, active }) => {
  const { isMobile } = useResponsiveMode();
  const [opened, setOpened] = useState(active);
  if (active && !opened) setOpened(true);
  return (
    <ScrambleOpening opened={opened}>
      {isMobile ? <MobileAboutPanel content={content} /> : <DesktopAboutPanel content={content} />}
    </ScrambleOpening>
  );
};
