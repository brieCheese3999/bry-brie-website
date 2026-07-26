import React, { useState } from 'react';
import type {AboutContent, SkillGroup, SkillIcon} from '../types.ts';
import {Fieldset, Frame, Modal, TextArea, Input, Button, List, Dropdown} from "@react95/core";
import {CdMusic, Fax, Faxcover108, FileFont2,
    FilePick, Fontext3, Mail, Msrating109, Notepad, Printer, Shell32142, Shell3224, Signup,
    Wab321014, Winpopup3, Wmsui323911, Wordpad, Write1} from "@react95/icons";
import { useResponsiveMode } from '../useResponsiveMode.ts';
import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID ?? '';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID ?? '';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? '';

const buttonStyle: React.CSSProperties = {
    width: 40,
    height: 40,
    minWidth: 40,
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
};

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
  const [senderEmail, setSenderEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sendStatus, setSendStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSend = () => {
    if (!senderEmail.trim() || !message.trim()) {
      alert('Please fill in your email and message.');
      return;
    }

    setSendStatus('sending');
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      from_email: senderEmail,
      subject: subject || '(No subject)',
      message,
    }, EMAILJS_PUBLIC_KEY)
      .then(() => {
        setSendStatus('sent');
        setSenderEmail('');
        setSubject('');
        setMessage('');
        setTimeout(() => setSendStatus('idle'), 3000);
      })
      .catch(() => {
        setSendStatus('error');
        setTimeout(() => setSendStatus('idle'), 3000);
      });
  };

  const sendButtonLabel =
    sendStatus === 'sending' ? 'Sending...' :
    sendStatus === 'sent' ? 'Sent!' :
    sendStatus === 'error' ? 'Failed' : 'Send';

  return (
  <div style={{ position: 'relative'}}>
  <Frame>
      <Fieldset  width="800px" legend={content.heading} className="win95-pixel-heading">
          <Frame display="flex" flexDirection="column">
              <div className="win95-icon-row">
                  <h2 className="win95-subject-name">{content.name}</h2>
                  <br/>
                  <p className="win95-bio-text">{content.bio}</p>
              </div>
          </Frame>
      </Fieldset>

      <Fieldset width="700px" legend="SKILLS" className="win95-section-label">
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

      <Modal style={{fontSize:"20px"}} id="photo-modal" title={content.photoWindow.title} titleBarOptions={<Modal.Minimize />}  dragOptions={{ defaultPosition: { x: 950, y: -15 } }}>
          <Modal.Content width="450px" boxShadow="$in" bgColor="white" p="16px">
              <Frame as="div" display="flex" flexDirection="column" gap="8px">
                  <img src={content.photoWindow.imageUrl} alt={content.photoWindow.alt}/>
              </Frame>
          </Modal.Content>
      </Modal>

      <Modal id="socials-modal" title={content.socials.title} titleBarOptions={<Modal.Minimize />}  dragOptions={{ defaultPosition: { x: 600, y: 380 } }}>
          <Modal.Content minWidth="310px" minHeight="142px">
              <Frame  display="flex" bgColor="$material" boxShadow="$out" flexDirection="column" padding="$4" gap="$7">
                  {content.socials.links.map((link) => (
                      <Frame key={link.handle} as="div" display="flex" bgColor="white" boxShadow="$in" flexDirection="row" padding="$4">
                          <span  className="win95-social-glyph">{link.glyph}</span>   {link.handle}
                      </Frame>
                  ))}
              </Frame>
          </Modal.Content>
      </Modal>


      <Modal minWidth="750px" minHeight="400px" id="contact-modal" title="CONTACT ME" titleBarOptions={<Modal.Minimize />} buttons={[{
          value: sendButtonLabel,
          onClick: handleSend
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
      }]}  dragOptions={{ defaultPosition: { x: 740, y: 630 } }}>
          <Frame  flexWrap="wrap" display="flex" bgColor="$material"  flexDirection="row" padding="$4" gap="$4">
              <Button key="mail" style={buttonStyle}>
                  <Mail variant="32x32_4"/>
              </Button>
          <Button key="cdmusic" style={buttonStyle}>
              <CdMusic variant="32x32_4"/>
          </Button>
          <Button key="copy" style={buttonStyle}>
              <FilePick variant="32x32_4"/>
          </Button>
          <Button key="cut" style={buttonStyle}>
              <Shell32142 variant="32x32_4"/>
          </Button>
          <Button key="faxcover" style={buttonStyle}>
              <Faxcover108 variant="32x32_4"/>
          </Button>
          <Button key="fax" style={{...buttonStyle, marginLeft: 10}}>
              <Fax variant="32x32_4"/>
          </Button>
          <Button key="filefont" style={buttonStyle}>
              <FileFont2 variant="32x32_4"/>
          </Button>
          <Button  key="fonttext" style={buttonStyle}>
              <Fontext3 variant="32x32_4"/>
          </Button>
          <Button key="notepad" style={{...buttonStyle, marginLeft: 10}}>
              <Notepad variant="32x32_4"/>
          </Button>
          <Button  key="print" style={buttonStyle}>
              <Wordpad variant="32x32_4"/>
          </Button>
          <Button key="shell" style={buttonStyle}>
              <Shell3224 variant="32x32_4"/>
          </Button>
          <Button key="spellchk" style={buttonStyle}>
              <Winpopup3 variant="32x32_4"/>
          </Button>
          <Button key="write1a" style={buttonStyle}>
              <Write1 variant="32x32_4"/>
          </Button>
          <Button key="wmsui" style={buttonStyle}>
              <Wmsui323911 variant="32x32_4"/>
          </Button>
          <Button key="wab" style={buttonStyle}>
              <Wab321014 variant="32x32_4"/>
          </Button>
          <Button key="signup" style={buttonStyle}>
              <Signup variant="32x32_4"/>
          </Button>
          </Frame>

          <Frame  display="flex">
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Dropdown width="11px" minWidth="0px" options={['Normal']}  style={{ fontSize: '15px' }}/>
              <Dropdown  width="11px"  minWidth="5px"  marginLeft="10px" options={['Arial']}  style={{ fontSize: '15px' }}/>
              <Dropdown  width="5px"  minWidth="0px" marginLeft="10px" marginRight={"8px"}  options={['10']}  style={{ fontSize: '15px' }} />
                  <Button key="printer" style={buttonStyle}>
                      <Printer variant="32x32_4"/>
                  </Button>
                  <Button key="msrating" style={buttonStyle}>
                      <Msrating109 variant="32x32_4"/>
                  </Button>
              </div>
          </Frame>
          <Modal.Content >
              <Frame display="flex" flexDirection="column">
                  <Frame display="flex" flexDirection="row" alignItems="center" gap="$2">
                      <Button style={{ minWidth: 45, fontSize: "15px",  padding: 4, marginRight: 15, marginBottom: 6}}>To...</Button>
                      <span style={{fontSize: "17px"}}>bryannaplaisir@gmail.com</span>
                  </Frame>
                  <Frame display="flex" flexDirection="row" alignItems="center" gap="$2">
                      <Button style={{ minWidth: 45, fontSize: "15px", padding: 4, marginRight: 15, marginBottom: 6 }}>From</Button>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={senderEmail}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSenderEmail(e.target.value)}
                        style={{ flex: 1 ,width: 70, fontSize: "15px",  minWidth: 70, padding: 4, marginRight: 10, marginBottom: 6}}
                      />
                  </Frame>

                  <Frame display="flex" flexDirection="row" alignItems="center" gap="$2">
                      <span  style={{ minWidth: 40, fontSize: "15px", display: 'inline-block',  marginRight: 10 }}>Subject:</span>
                      <Input
                        value={subject}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSubject(e.target.value)}
                        style={{ flex: 1, minWidth: 70,padding: 4, marginRight: 10, marginBottom: 10 }}
                      />
                  </Frame>
                 <TextArea
                   value={message}
                   onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
                   placeholder="Write your message here..."
                   style={{minHeight:"200px", fontSize: "15px"}}
                   display="flex"
                 />
              </Frame>
          </Modal.Content>
      </Modal>
  </Frame>
  </div>
  );
};

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
