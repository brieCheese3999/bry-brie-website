import React from 'react';
import type { AboutContent } from './types';
import {Fieldset, Frame, Modal, TextArea, Input, Button, List, Dropdown} from "@react95/core";
import {CdMusic, Copy, Cut, Fax, Faxcover108, FileFont2, Fontext3, Notepad, Print, Shell3224, Spellchk, Write1} from "@react95/icons";

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

export const AboutPanel: React.FC<{ content: AboutContent }> = ({ content }) => (
  <Frame>
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

      <Fieldset width="500px" legend="EDUCATION" className="win95-section-label" style={{
          marginBottom: '1em'
      }}>
          <Frame display="flex" flexDirection="column">
    {content.education.map((edu) => (
      <div key={edu.school} className="win95-edu-item">
        <span className="win95-yrs">{edu.years}</span>
        <span className="win95-school">{edu.school}</span> — {edu.detail}
      </div>
    ))}
          </Frame>
      </Fieldset>

      <Modal id="photo-modal" title={content.photoWindow.title} titleBarOptions={<Modal.Minimize />}  dragOptions={{ defaultPosition: { x: 550, y: 70 } }}>
          <Modal.Content width="350px" boxShadow="$in" bgColor="white" p="16px">
              <Frame as="div" display="flex" flexDirection="column" gap="8px">
                  <img src={content.photoWindow.imageUrl} alt={content.photoWindow.alt}/>
              </Frame>
          </Modal.Content>
      </Modal>

      <Modal id="socials-modal" title={content.socials.title} titleBarOptions={<Modal.Minimize />}  dragOptions={{ defaultPosition: { x: 430, y: 450 } }}>
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
      }]}  dragOptions={{ defaultPosition: { x: 560, y: 610 } }}>
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
          <Button key="spellchk" style={buttonStyle}>
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
);
