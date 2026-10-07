import React from 'react';
import { createPortal } from 'react-dom';
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
    const dialogRef = React.useRef<HTMLDialogElement>(null);
    React.useLayoutEffect(() => {
        if (!open) return;
        const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        const dialog = dialogRef.current;
        dialog?.showModal();
        dialog?.querySelector<HTMLButtonElement>('button')?.focus();
        return () => {
            dialog?.close();
            requestAnimationFrame(() => {
                const send = document.querySelector<HTMLButtonElement>('.seamless-tab-panel.is-active button[data-contact-send]');
                const target = trigger && trigger !== document.body && trigger.isConnected ? trigger : send;
                target?.focus({ preventScroll: true });
            });
        };
    }, [open]);
    if (!open) return null;

    return createPortal(
        <dialog ref={dialogRef} className="mail-sent-dialog" aria-label="Mail Sent"
            onCancel={event => { event.preventDefault(); onClose(); }}
            onKeyDown={event => {
                if (event.key !== 'Tab') return;
                const buttons = Array.from(dialogRef.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? []);
                const first = buttons[0];
                const last = buttons[buttons.length - 1];
                if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
                else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
            }}>
        <Modal
            data-testid="mail-sent-modal"
            className="mail-sent-window"
            role="presentation"
            width="100%"
            icon={<Sendmail2001 variant="16x16_4" />}
            title="Mail Sent"
            hasWindowButton={false}
            titleBarOptions={<TitleBar.Close key="close" onClick={onClose} />}
            dragOptions={{ disabled: true }}
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
        </dialog>, document.body
    );
};

export default MailSentModal;
