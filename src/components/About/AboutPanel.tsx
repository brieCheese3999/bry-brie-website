import React from 'react';
import type { AboutContent } from '../types.ts';
import {Fieldset, Frame, Modal, TextArea, Input, Button, List, Dropdown} from "@react95/core";
import {CdMusic, Copy, Cut, Fax, Faxcover108, FileFont2, Fontext3, Notepad, Print, Shell3224, Spellchk, Write1} from "@react95/icons";
import { useResponsiveMode } from '../useResponsiveMode.ts';

const buttonStyle: React.CSSProperties = {
    width: 25,
    height: 25,
    minWidth: 25,      // stops Button from growing to fit its content
    padding: 0,        // react95 Buttons default to extra padding — kill it
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,     // keeps buttons from squishing unevenly
};
const handleButtonClick = (e: React.MouseEvent<HTMLLIElement>) => alert(e.currentTarget.value);

/**
 * Desktop/tablet rendering: the original Windows-95-desktop layout, with
 * photo/socials/contact rendered as floating, draggable windows at fixed
 * pixel coordinates. Scaled to fit the viewport by the parent (Win95Portfolio)
 * via useResponsiveScale — left entirely as-is here.
 */
const DesktopAboutPanel: React.FC<{ content: AboutContent }> = ({ content }) => (
  <div style={{ position: 'relative'}}>
  <Frame>
      <Fieldset  width="800px" legend={content.heading} className="win95-pixel-heading" style={{
          marginBottom: '1em'
      }}>
          <Frame display="flex" flexDirection="column">
              <div className="win95-icon-row">
                  <h2 className="win95-subject-name">{content.name}</h2>
                  <br/>
                  <p className="win95-bio-text">{content.bio}</p>
              </div>
          </Frame>
      </Fieldset>

      <Fieldset width="800px" legend="SKILLS" className="win95-section-label" style={{
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

      <Fieldset width="800px" legend="EDUCATION" className="win95-section-label" style={{
          marginBottom: '1em'
      }}>
          <Frame display="flex" flexDirection="column">
      <div className="win95-edu-item">
        <span className="win95-yrs">{content.education.years}</span>
        <span className="win95-school">{content.education.school}</span>
          <br/>
          <span className="win95-school">Majors: </span>
          {content.education.majors.map((major) => (
          <span key={major}>[{major}] </span>
          ))}
          <br/>
          <span className="win95-school">Minor:</span>
          <span> [{content.education.minor}]</span>

      </div>

          </Frame>
      </Fieldset>

      <Modal style={{fontSize:"20px"}} id="photo-modal" title={content.photoWindow.title} titleBarOptions={<Modal.Minimize />}  dragOptions={{ defaultPosition: { x: 950, y: -15 } }}>
          <Modal.Content width="350px" boxShadow="$in" bgColor="white" p="16px">
              <Frame as="div" display="flex" flexDirection="column" gap="8px">
                  <img src={content.photoWindow.imageUrl} alt={content.photoWindow.alt}/>
              </Frame>
          </Modal.Content>
      </Modal>

      <Modal id="socials-modal" title={content.socials.title} titleBarOptions={<Modal.Minimize />}  dragOptions={{ defaultPosition: { x: 600, y: 380 } }}>
          <Modal.Content minWidth="270px" minHeight="112px">
              <Frame  display="flex" bgColor="$material" boxShadow="$out" flexDirection="column" padding="$4" gap="$7">
                  {content.socials.links.map((link) => (
                      <Frame key={link.handle} as="div" display="flex" bgColor="white" boxShadow="$in" flexDirection="row" padding="$4">
                          <span  className="win95-social-glyph">{link.glyph}</span>   {link.handle}
                      </Frame>
                  ))}
              </Frame>
          </Modal.Content>
      </Modal>


      <Modal minWidth="150px" minHeight="300px" id="contact-modal" title="CONTACT ME" titleBarOptions={<Modal.Minimize />} buttons={[{
          value: 'Send',
          onClick: handleButtonClick
      }]} menu={[{
          name: 'File',
          list: <List/>
      }, {
          name: 'Edit',
          list: <List/>
      },{
          name: 'View',
          list: <List/>
      },{
          name: 'Insert',
          list: <List/>
      },{
          name: 'Format',
          list: <List/>
      },{
          name: 'Tools',
          list: <List/>
      }, {
          name: 'Table',
          list: <List/>
      },{
          name: 'Compose',
          list: <List/>
      },{
          name: 'Help',
          list: <List/>
      }]}  dragOptions={{ defaultPosition: { x: 740, y: 530 } }}>
          <Frame  flexWrap="wrap" display="flex" bgColor="$material"  flexDirection="row" padding="$4" gap="$4">
          <Button key="music" style={buttonStyle}>
              <CdMusic variant="16x16_4"/>
          </Button>
          <Button key="copy" style={buttonStyle}>
              <Copy variant="16x16_4"/>
          </Button>
          <Button key="cut" style={buttonStyle}>
              <Cut variant="16x16_4"/>
          </Button>
          <Button key="faxcover" style={buttonStyle}>
              <Faxcover108 variant="16x16_1"/>
          </Button>
          <Button key="fax" style={{...buttonStyle, marginLeft: 10}}>
              <Fax variant="16x16_4"/>
          </Button>
          <Button key="filefont" style={buttonStyle}>
              <FileFont2 variant="16x16_4"/>
          </Button>
          <Button  key="fonttext" style={buttonStyle}>
              <Fontext3 variant="16x16_4"/>
          </Button>
          <Button key="notepad" style={{...buttonStyle, marginLeft: 10}}>
              <Notepad variant="16x16_4"/>
          </Button>
          <Button  key="print" style={buttonStyle}>
              <Print variant="16x16_4"/>
          </Button>
          <Button key="shell" style={buttonStyle}>
              <Shell3224 variant="16x16_4"/>
          </Button>
          <Button key="spellchk" style={buttonStyle}>
              <Spellchk variant="16x16_4"/>
          </Button>
          <Button key="write1" style={buttonStyle}>
              <Write1 variant="16x16_4"/>
          </Button>
          </Frame>

          <Frame  display="flex">
          <Dropdown width="11px" height="22px" minWidth="0px" options={['Normal']}  style={{ fontSize: '12px' }}/>
              <Dropdown  width="11px" height="22px"  minWidth="5px"  marginLeft="10px" options={['Arial']}  style={{ fontSize: '12px' }}/>
              <Dropdown  width="5px" height="22px"  minWidth="0px" marginLeft="10px"  options={['10']}  style={{ fontSize: '12px' }} />
      </Frame>
          <Modal.Content >
              <Frame display="flex" flexDirection="column">
                  <Frame display="flex" flexDirection="row" alignItems="center" gap="$2">
                      <Button style={{ minWidth: 40,  minHeight: 20,  padding: 4, marginRight: 10, marginBottom: 6}}>To...</Button>
                      <span>bryannaplaisir@gmail.com</span>
                  </Frame>
                  <Frame display="flex" flexDirection="row" alignItems="center" gap="$2">
                      <Button style={{ minWidth: 40, height: 25, padding: 4, marginRight: 10, marginBottom: 6 }}>Cc...</Button>
                      <Input style={{ flex: 1 ,width: 70, minWidth: 70, height: 25, padding: 4, marginRight: 10, marginBottom: 6}} />
                  </Frame>

                  <Frame display="flex" flexDirection="row" alignItems="center" gap="$2">
                      <span  style={{ minWidth: 40, display: 'inline-block',  marginRight: 10 }}>Subject:</span>
                      <Input style={{ flex: 1,width: 70, minWidth: 70, height: 25,padding: 4, marginRight: 10, marginBottom: 10 }} />
                  </Frame>
                 <TextArea display="flex"></TextArea>
              </Frame>
          </Modal.Content>
      </Modal>
  </Frame>
  </div>
);

/**
 * Mobile rendering: everything from DesktopAboutPanel, but as a single
 * static column — no draggable Modals, no fixed pixel coordinates, no
 * scale-to-fit wrapper. Each "window" becomes a plain Fieldset section
 * that flows naturally with the page, so it works at any width.
 */
const MobileAboutPanel: React.FC<{ content: AboutContent }> = ({ content }) => (
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
      <div className="win95-icon-row">
        {content.skills.map((skill) => (
          <div key={skill.id} className="win95-icon-chip win95-raised">
            {skill.label}
          </div>
        ))}
      </div>
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
        {content.socials.links.map((link) => (
          <div key={link.handle} className="win95-social-row">
            <span className="win95-social-glyph">{link.glyph}</span>
            <span>{link.handle}</span>
          </div>
        ))}
      </div>
    </Fieldset>

    <Fieldset legend="CONTACT ME" className="win95-section-label win95-mobile-fieldset">
      {/* Desktop shows a full fake mail-client toolbar for flavor; on mobile
          that's a lot of tiny unusable icons, so this collapses to the one
          thing that actually matters: a working way to email you. */}
      <a
        className="win95-mobile-contact-button win95-raised"
        href="mailto:bryannaplaisir@gmail.com"
      >
        Email me
      </a>
    </Fieldset>
  </div>
);

export const AboutPanel: React.FC<{ content: AboutContent }> = ({ content }) => {
  const { isMobile } = useResponsiveMode();
  return isMobile ? <MobileAboutPanel content={content} /> : <DesktopAboutPanel content={content} />;
};
