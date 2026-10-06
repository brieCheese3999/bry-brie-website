import React from 'react';
import { Cut } from "@react95/icons/Cut";
import { Copy } from "@react95/icons/Copy";
import { Paste } from "@react95/icons/Paste";
import { Undo } from "@react95/icons/Undo";
import { Redo } from "@react95/icons/Redo";
import { Attach } from "@react95/icons/Attach";
import { Save } from "@react95/icons/Save";
import { Bold } from "@react95/icons/Bold";
import { Italic } from "@react95/icons/Italic";
import { Underlne } from "@react95/icons/Underlne";
import { Justify } from "@react95/icons/Justify";
import { Spellchk } from "@react95/icons/Spellchk";
import { FontBig } from "@react95/icons/FontBig";
import { FilePencil } from "@react95/icons/FilePencil";
import { FileText } from "@react95/icons/FileText";
import { Folder } from "@react95/icons/Folder";
import { ReaderDisket } from "@react95/icons/ReaderDisket";
import { Help } from "@react95/icons/Help";
import { Camera } from "@react95/icons/Camera";
import { Mspaint } from "@react95/icons/Mspaint";
import { Modal, Frame, Button, TextArea, Input, List, Dropdown } from '@react95/core';
import { Brush } from "@react95/icons/Brush";
import { Calculator } from "@react95/icons/Calculator";
import { CdMusic } from "@react95/icons/CdMusic";
import { Fax } from "@react95/icons/Fax";
import { FileFont2 } from "@react95/icons/FileFont2";
import { FilePick } from "@react95/icons/FilePick";
import { Fontext3 } from "@react95/icons/Fontext3";
import { Mail } from "@react95/icons/Mail";
import { Msrating109 } from "@react95/icons/Msrating109";
import { Notepad } from "@react95/icons/Notepad";
import { Printer } from "@react95/icons/Printer";
import { Signup } from "@react95/icons/Signup";
import { Wab321014 } from "@react95/icons/Wab321014";
import { Winpopup3 } from "@react95/icons/Winpopup3";
import { Wordpad } from "@react95/icons/Wordpad";
import { useResponsiveMode } from '../useResponsiveMode.ts';
import { useContactForm } from '../About/useContactForm.ts';
import { ReCaptcha } from '../About/ReCaptcha.tsx';
import { MailSentModal } from './MailSentModal.tsx';

const CONTACT_EMAIL = ['bryannaplaisir', 'gmail.com'].join('@');

const honeypotStyle: React.CSSProperties = {
    position: 'absolute',
    left: '-9999px',
    width: '1px',
    height: '1px',
    opacity: 0,
    pointerEvents: 'none',
};

const contactIcons = [Mail, Wab321014, Signup, Save, Printer, Spellchk, Cut, Copy,
    Paste, Undo, Redo, FileText, Attach, Fax, Notepad, Wordpad, FilePick,
    FileFont2, Fontext3, Winpopup3, Brush, Calculator, CdMusic, Folder,
    ReaderDisket, Help, Camera, Mspaint];

const formatIcons = [Bold, Italic, Underlne, FilePencil, FontBig, Justify, FileText, Spellchk, Printer, Msrating109];

const ContactIconStrip = () => {
    const stripRef = React.useRef<HTMLDivElement>(null);
    const [iconCount, setIconCount] = React.useState<number | null>(null);
    React.useEffect(() => {
        const strip = stripRef.current;
        if (!strip) return;
        const observer = new ResizeObserver(([entry]) => {
            // Reserve 40px per tile and a 4px gap; distribute spare space evenly.
            setIconCount(Math.max(1, Math.min(contactIcons.length, Math.floor((entry.contentRect.width + 4) / 44))));
        });
        observer.observe(strip);
        return () => observer.disconnect();
    }, []);
    return (
        <div ref={stripRef} className="contact-icon-strip" aria-hidden="true"
            style={iconCount === null ? undefined : { gridTemplateColumns: `repeat(${iconCount}, minmax(0, 1fr))` }}>
            {contactIcons.slice(0, iconCount ?? contactIcons.length).map((Icon, index) => (
                <span className="contact-icon-tile" key={index}><Icon /></span>
            ))}
        </div>
    );
};

/**
 * The contact form, lifted out of the About window into its own top-level
 * panel so the CONTACT nav item can show it directly. The desktop version keeps
 * the Wordpad-style Win95 window (but pinned into normal flow via
 * `.contact-panel-modal` rather than floating); mobile falls back to a plain
 * stacked column like the other panels.
 */
interface ContactPanelProps { form: ReturnType<typeof useContactForm> }

const DesktopContactPanel: React.FC<ContactPanelProps> = ({ form }) => {
    const fieldId = React.useId();
    const {
        senderEmail, setSenderEmail,
        subject, setSubject,
        message, setMessage,
        honeypot, setHoneypot,
        setRecaptchaToken,
        sendStatus,
        handleSend,
        sendButtonLabel,
        showSentModal,
        dismissSentModal,
    } = form;

    return (
        <>
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
            <ContactIconStrip />

            <div className="contact-format-row">
                <div className="contact-font-pickers">
                    <Dropdown width="100%" minWidth="0px" options={['Normal']} style={{ fontSize: '20px' }} />
                    <Dropdown width="100%" minWidth="0px" options={['Arial']} style={{ fontSize: '20px' }} />
                    <Dropdown width="100%" minWidth="0px" options={['10']} style={{ fontSize: '20px' }} />
                </div>
                <div className="contact-format-icons" aria-hidden="true">
                    {formatIcons.map((Icon, index) => (
                        <span className="contact-icon-tile" key={index}><Icon /></span>
                    ))}
                </div>
            </div>

            <Modal.Content>
                <Frame display="flex" flexDirection="column">
                    <Frame display="flex" flexDirection="row" alignItems="center" gap="$2">
                        <Button style={{ minWidth: 75, fontSize: '20px', padding: 4, marginRight: 15, marginBottom: 6 }}>To...</Button>
                        <Input readOnly aria-label="To" value={CONTACT_EMAIL} style={{ flex: 1, minWidth: 0, fontSize: '20px', padding: 4, marginRight: 10 }} />
                    </Frame>
                    <Frame display="flex" flexDirection="row" alignItems="center" gap="$2">
                        <label htmlFor={`${fieldId}-email`} className="contact-from-label" style={{ minWidth: 75, fontSize: '20px', padding: 4, marginRight: 15, marginBottom: 6 }}>From</label>
                        <Input
                            type="email"
                            id={`${fieldId}-email`}
                            data-testid="contact-from"
                            placeholder="your@email.com"
                            value={senderEmail}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSenderEmail(e.target.value)}
                            style={{ flex: 1, width: 70, fontSize: '20px', minWidth: 70, padding: 4, marginRight: 10, marginBottom: 6 }}
                        />
                    </Frame>
                    <Frame display="flex" flexDirection="row" alignItems="center" gap="$2">
                        <label htmlFor={`${fieldId}-subject`} style={{ minWidth: 40, fontSize: '20px', display: 'inline-block', padding: 4, marginRight: 10, marginTop: 6 , marginBottom: 6}}>Subject:</label>
                        <Input
                            id={`${fieldId}-subject`}
                            data-testid="contact-subject"
                            value={subject}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSubject(e.target.value)}
                            style={{ flex: 1, fontSize: '20px', minWidth: 70, padding: 4, marginRight: 10, marginBottom: 10 }}
                        />
                    </Frame>
                    <label htmlFor={`${fieldId}-message`} className="contact-sr-label">Message</label>
                    <TextArea
                        id={`${fieldId}-message`}
                        data-testid="contact-message"
                        value={message}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
                        placeholder="Write your message here..."
                        style={{ minHeight: '600px', fontSize: '25px' }}
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
                            data-testid="contact-send"
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
        <MailSentModal open={showSentModal} onClose={dismissSentModal} />
        </>
    );
};

const MobileContactPanel: React.FC<ContactPanelProps> = ({ form }) => {
    const fieldId = React.useId();
    const {
        senderEmail, setSenderEmail,
        subject, setSubject,
        message, setMessage,
        honeypot, setHoneypot,
        setRecaptchaToken,
        sendStatus,
        handleSend,
        sendButtonLabel,
        showSentModal,
        dismissSentModal,
    } = form;

    return (
        <div className="win95-mobile-stack">
            <ContactIconStrip />
            <Frame display="flex" flexDirection="column" gap="$4" bgColor="$material" boxShadow="$out" padding="$8">
                <Frame display="flex" flexDirection="row" alignItems="center" gap="$2">
                    <span style={{ minWidth: 50, fontSize: '16px' }}>To:</span>
                    <Input readOnly aria-label="To" value={CONTACT_EMAIL} style={{ flex: 1, minWidth: 0, fontSize: '16px', padding: 4 }} />
                </Frame>
                <Frame display="flex" flexDirection="row" alignItems="center" gap="$2">
                    <label htmlFor={`${fieldId}-email`} style={{ minWidth: 50, fontSize: '16px' }}>From:</label>
                    <Input
                        type="email"
                            id={`${fieldId}-email`}
                        placeholder="your@email.com"
                        value={senderEmail}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSenderEmail(e.target.value)}
                        style={{ flex: 1, fontSize: '16px', padding: 4 }}
                    />
                </Frame>
                <Frame display="flex" flexDirection="row" alignItems="center" gap="$2">
                    <label htmlFor={`${fieldId}-subject`} style={{ minWidth: 50, fontSize: '16px' }}>Subject:</label>
                    <Input
                        id={`${fieldId}-subject`}
                        value={subject}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSubject(e.target.value)}
                        style={{ flex: 1, fontSize: '16px', padding: 4 }}
                    />
                </Frame>
                <label htmlFor={`${fieldId}-message`} className="contact-sr-label">Message</label>
                <TextArea
                    id={`${fieldId}-message`}
                    value={message}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
                    placeholder="Write your message here..."
                    rows={8}
                    style={{ minHeight: '160px', height: '192px', fontSize: '16px', resize: 'vertical' }}
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
            <MailSentModal open={showSentModal} onClose={dismissSentModal} />
        </div>
    );
};

export const ContactPanel: React.FC<ContactPanelProps> = ({ form }) => {
    const { isMobile } = useResponsiveMode();
    return isMobile ? <MobileContactPanel form={form} /> : <DesktopContactPanel form={form} />;
};

export default ContactPanel;
