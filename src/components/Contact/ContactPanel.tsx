import React from 'react';
import { Modal, Frame, Button, TextArea, Input, List, Dropdown } from '@react95/core';
import {
    Access226,
    Awfext326052,
    Bat,
    Brush,
    Calculator,
    CdMusic, Comdlg32528, Fax, Faxcover108, FileFont2, FilePick, Fontext3, Mail, Msrating109,
    Notepad, Printer, Shell32142, Shell3224, Signup, Wab321014, Winpopup3,
    Wmsui323911, Wordpad, Write1,
} from '@react95/icons';
import { useResponsiveMode } from '../useResponsiveMode.ts';
import { useContactForm } from '../About/useContactForm.ts';
import { ReCaptcha } from '../About/ReCaptcha.tsx';

const CONTACT_EMAIL = ['bryannaplaisir', 'gmail.com'].join('@');

const honeypotStyle: React.CSSProperties = {
    position: 'absolute',
    left: '-9999px',
    width: '1px',
    height: '1px',
    opacity: 0,
    pointerEvents: 'none',
};

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

/**
 * The contact form, lifted out of the About window into its own top-level
 * panel so the CONTACT nav item can show it directly. The desktop version keeps
 * the Wordpad-style Win95 window (but pinned into normal flow via
 * `.contact-panel-modal` rather than floating); mobile falls back to a plain
 * stacked column like the other panels.
 */
const DesktopContactPanel: React.FC = () => {
    const {
        senderEmail, setSenderEmail,
        subject, setSubject,
        message, setMessage,
        honeypot, setHoneypot,
        setRecaptchaToken,
        sendStatus,
        handleSend,
        sendButtonLabel,
    } = useContactForm();

    return (
        <Modal
            className="contact-panel-modal"
            style={{ fontSize: '15px' }}
            minWidth="880px"
            minHeight="450px"
            id="contact-modal"
            title="CONTACT ME"
            titleBarOptions={<Modal.Minimize />}
            menu={[
                { name: 'File', list: <List /> },
                { name: 'Edit', list: <List /> },
                { name: 'View', list: <List /> },
                { name: 'Insert', list: <List /> },
                { name: 'Format', list: <List /> },
                { name: 'Tools', list: <List /> },
                { name: 'Table', list: <List /> },
                { name: 'Compose', list: <List /> },
                { name: 'Help', list: <List /> },
            ]}
            dragOptions={{ defaultPosition: { x: 0, y: 0 } }}
        >
            <Frame flexWrap="wrap" display="flex" bgColor="$material" flexDirection="row" padding="$4" gap="$4">
                <Button key="mail" style={buttonStyle}><Mail variant="32x32_4" /></Button>
                <Button key="cdmusic" style={buttonStyle}><CdMusic variant="32x32_4" /></Button>
                <Button key="copy" style={buttonStyle}><FilePick variant="32x32_4" /></Button>
                <Button key="cut" style={buttonStyle}><Shell32142 variant="32x32_4" /></Button>
                <Button key="faxcover" style={buttonStyle}><Faxcover108 variant="32x32_4" /></Button>
                <Button key="fax" style={{ ...buttonStyle, marginLeft: 10 }}><Fax variant="32x32_4" /></Button>
                <Button key="filefont" style={buttonStyle}><FileFont2 variant="32x32_4" /></Button>
                <Button key="fonttext" style={buttonStyle}><Fontext3 variant="32x32_4" /></Button>
                <Button key="notepad" style={{ ...buttonStyle, marginLeft: 10 }}><Notepad variant="32x32_4" /></Button>
                <Button key="print" style={buttonStyle}><Wordpad variant="32x32_4" /></Button>
                <Button key="shell" style={buttonStyle}><Shell3224 variant="32x32_4" /></Button>
                <Button key="spellchk" style={buttonStyle}><Winpopup3 variant="32x32_4" /></Button>
                <Button key="write1a" style={buttonStyle}><Write1 variant="32x32_4" /></Button>
                <Button key="wmsui" style={buttonStyle}><Wmsui323911 variant="32x32_4" /></Button>
                <Button key="wab" style={buttonStyle}><Wab321014 variant="32x32_4" /></Button>
                <Button key="signup" style={buttonStyle}><Signup variant="32x32_4" /></Button>
                <Button key="access" style={buttonStyle}><Access226 variant="32x32_4"/></Button>
                <Button key="access" style={buttonStyle}><Awfext326052 variant="32x32_4"/></Button>
                <Button key="access" style={buttonStyle}><Bat variant="32x32_4"/></Button>
                <Button key="access" style={buttonStyle}><Brush variant="32x32_4"/></Button>
                <Button key="access" style={buttonStyle}><Calculator variant="32x32_4"/></Button>
                <Button key="access" style={buttonStyle}><Comdlg32528 variant="32x32_4"/></Button>

            </Frame>

            <Frame display="flex">
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Dropdown width="11px" minWidth="0px" options={['Normal']} style={{ fontSize: '15px' }} />
                    <Dropdown width="11px" minWidth="5px" marginLeft="10px" options={['Arial']} style={{ fontSize: '15px' }} />
                    <Dropdown width="5px" minWidth="0px" marginLeft="10px" marginRight={'8px'} options={['10']} style={{ fontSize: '15px' }} />
                    <Button key="printer" style={buttonStyle}><Printer variant="32x32_4" /></Button>
                    <Button key="msrating" style={buttonStyle}><Msrating109 variant="32x32_4" /></Button>
                </div>
            </Frame>

            <Modal.Content>
                <Frame display="flex" flexDirection="column">
                    <Frame display="flex" flexDirection="row" alignItems="center" gap="$2">
                        <Button style={{ minWidth: 45, fontSize: '15px', padding: 4, marginRight: 15, marginBottom: 6 }}>To...</Button>
                        <span style={{ fontSize: '17px' }}>{CONTACT_EMAIL}</span>
                    </Frame>
                    <Frame display="flex" flexDirection="row" alignItems="center" gap="$2">
                        <Button style={{ minWidth: 45, fontSize: '15px', padding: 4, marginRight: 15, marginBottom: 6 }}>From</Button>
                        <Input
                            type="email"
                            placeholder="your@email.com"
                            value={senderEmail}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSenderEmail(e.target.value)}
                            style={{ flex: 1, width: 70, fontSize: '15px', minWidth: 70, padding: 4, marginRight: 10, marginBottom: 6 }}
                        />
                    </Frame>
                    <Frame display="flex" flexDirection="row" alignItems="center" gap="$2">
                        <span style={{ minWidth: 40, fontSize: '15px', display: 'inline-block', marginRight: 10 }}>Subject:</span>
                        <Input
                            value={subject}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSubject(e.target.value)}
                            style={{ flex: 1, minWidth: 70, padding: 4, marginRight: 10, marginBottom: 10 }}
                        />
                    </Frame>
                    <TextArea
                        value={message}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
                        placeholder="Write your message here..."
                        style={{ minHeight: '600px', fontSize: '15px' }}
                        display="flex"
                    />
                    {/* Honeypot: hidden from users, tempting to bots. */}
                    <input
                        type="text"
                        name="company_website"
                        tabIndex={-1}
                        autoComplete="off"
                        aria-hidden="true"
                        style={honeypotStyle}
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                    />
                    <Frame display="flex" flexDirection="column" alignItems="flex-end" mt="$4" gap="$2">
                        <ReCaptcha onChange={setRecaptchaToken} />
                        <Button
                            onClick={handleSend}
                            disabled={sendStatus === 'sending'}
                            style={{ fontSize: '15px', padding: '8px 32px', minWidth: 120 }}
                        >
                            {sendButtonLabel}
                        </Button>
                    </Frame>
                </Frame>
            </Modal.Content>
        </Modal>
    );
};

const MobileContactPanel: React.FC = () => {
    const {
        senderEmail, setSenderEmail,
        subject, setSubject,
        message, setMessage,
        honeypot, setHoneypot,
        setRecaptchaToken,
        sendStatus,
        handleSend,
        sendButtonLabel,
    } = useContactForm();

    return (
        <div className="win95-mobile-stack">
            <Frame display="flex" flexDirection="column" gap="$4" bgColor="$material" boxShadow="$out" padding="$8">
                <Frame display="flex" flexDirection="row" alignItems="center" gap="$2">
                    <span style={{ minWidth: 50, fontSize: '14px' }}>To:</span>
                    <span style={{ fontSize: '14px' }}>{CONTACT_EMAIL}</span>
                </Frame>
                <Frame display="flex" flexDirection="row" alignItems="center" gap="$2">
                    <span style={{ minWidth: 50, fontSize: '14px' }}>From:</span>
                    <Input
                        type="email"
                        placeholder="your@email.com"
                        value={senderEmail}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSenderEmail(e.target.value)}
                        style={{ flex: 1, fontSize: '14px', padding: 4 }}
                    />
                </Frame>
                <Frame display="flex" flexDirection="row" alignItems="center" gap="$2">
                    <span style={{ minWidth: 50, fontSize: '14px' }}>Subject:</span>
                    <Input
                        value={subject}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSubject(e.target.value)}
                        style={{ flex: 1, fontSize: '14px', padding: 4 }}
                    />
                </Frame>
                <TextArea
                    value={message}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
                    placeholder="Write your message here..."
                    style={{ minHeight: '120px', fontSize: '14px' }}
                />
                {/* Honeypot: hidden from users, tempting to bots. */}
                <input
                    type="text"
                    name="company_website"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    style={honeypotStyle}
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                />
                <ReCaptcha onChange={setRecaptchaToken} />
                <Button
                    onClick={handleSend}
                    disabled={sendStatus === 'sending'}
                    style={{ alignSelf: 'flex-end', fontSize: '18px', padding: '6px 28px', minWidth: 100 }}
                >
                    {sendButtonLabel}
                </Button>
            </Frame>
        </div>
    );
};

export const ContactPanel: React.FC = () => {
    const { isMobile } = useResponsiveMode();
    return isMobile ? <MobileContactPanel /> : <DesktopContactPanel />;
};

export default ContactPanel;
