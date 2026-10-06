import React from 'react';
import { Modal, Frame, TitleBar } from '@react95/core';
import { Sendmail2001 } from "@react95/icons/Sendmail2001";

interface MailSentModalProps {
    /** Whether the confirmation dialog is showing. */
    open: boolean;
    /** Dismiss the dialog (OK button or titlebar close). */
    onClose: () => void;
}

/**
 * Win95-style "Mail Sent" confirmation dialog, shown once the contact form has
 * actually handed the message off to EmailJS. Modelled on the react95 `Alert`
 * message box, but built directly on `Modal` so the body can use the
 * `Sendmail2001` mail-away icon instead of Alert's fixed User face.
 *
 * Centred on screen and floated above the pinned contact panel via the Modal's
 * draggable positioning, matching the desktop's other pop-up windows.
 */
export const MailSentModal: React.FC<MailSentModalProps> = ({ open, onClose }) => {
    if (!open) return null;

    return (
        <Modal
            data-testid="mail-sent-modal"
            width="380px"
            icon={<Sendmail2001 variant="16x16_4" />}
            title="Mail Sent"
            hasWindowButton={false}
            titleBarOptions={<TitleBar.Close key="close" onClick={onClose} />}
            dragOptions={{
                defaultPosition: {
                    x: typeof window === 'undefined' ? 0 : Math.floor(window.innerWidth / 2) - 190,
                    y: typeof window === 'undefined' ? 0 : Math.floor(window.innerHeight / 2) - 90,
                },
            }}
            buttons={[{ value: 'OK', onClick: onClose }]}
            buttonsAlignment="center"
        >
            <Modal.Content>
                <Frame display="flex" flexDirection="row" alignItems="center" gap="$6" padding="$4">
                    <Sendmail2001 variant="32x32_4" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: '16px', lineHeight: 1.4 }}>
                        Your message has been sent successfully!
                    </span>
                </Frame>
            </Modal.Content>
        </Modal>
    );
};

export default MailSentModal;
