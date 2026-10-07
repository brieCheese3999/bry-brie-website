import { useState } from 'react';
import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID ?? '';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID ?? '';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? '';
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY ?? '';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SendStatus = 'idle' | 'sending' | 'sent' | 'error';

/**
 * Shared state + submit logic for the contact form, used by both the desktop
 * and mobile Contact panels so the anti-spam protections stay identical.
 *
 * Note: because this is a static site, the EmailJS keys are necessarily public.
 * These client-side checks (honeypot and optional reCAPTCHA) stop the
 * bulk of automated form spam, but the authoritative protection is the
 * allowed-origins list, rate limit, and reCAPTCHA configured in the EmailJS
 * dashboard — those apply even when someone bypasses this form entirely.
 */
export function useContactForm() {
  const [senderEmail, setSenderEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  // Hidden field real users never see or fill. If it has a value, a bot did it.
  const [honeypot, setHoneypot] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [sendStatus, setSendStatus] = useState<SendStatus>('idle');
  // Confirmation opens only after EmailJS accepts the message.
  const [errorMessage, setErrorMessage] = useState('');
  const [showSentModal, setShowSentModal] = useState(false);

  const fail = (explanation: string) => {
    setSendStatus('error');
    setErrorMessage(explanation);
  };

  const handleSend = () => {
    if (sendStatus === 'sending') return;
    if (honeypot.trim() !== '') {
      fail('Your message could not be sent. Please try again.');
      return;
    }

    if (!senderEmail.trim() || !message.trim()) {
      fail('Please fill in your email and message.');
      return;
    }
    if (!EMAIL_RE.test(senderEmail.trim())) {
      fail('Please enter a valid email address.');
      return;
    }
    // Only enforce the captcha when one is actually configured, so the form
    // still works before a reCAPTCHA site key is set up.
    if (RECAPTCHA_SITE_KEY && !recaptchaToken) {
      fail('Please complete the captcha before sending.');
      return;
    }

    setErrorMessage('');
    setSendStatus('sending');
    emailjs
      .send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_email: senderEmail,
          subject: subject || '(No subject)',
          message,
          // EmailJS validates this field server-side when the template has
          // reCAPTCHA enabled; harmless to include when it's empty.
          'g-recaptcha-response': recaptchaToken ?? '',
        },
        EMAILJS_PUBLIC_KEY,
      )
      .then(() => {
        setSendStatus('sent');
        setShowSentModal(true);
        setSenderEmail('');
        setSubject('');
        setMessage('');
        setRecaptchaToken(null);
        setTimeout(() => setSendStatus('idle'), 3000);
      })
      .catch(() => fail('Your message could not be sent. Your draft is saved here. Check your connection and try again.'));
  };

  const sendButtonLabel =
    sendStatus === 'sending' ? 'Sending...' :
    sendStatus === 'sent' ? 'Sent!' :
    sendStatus === 'error' ? 'Try again' : 'Send';

  return {
    senderEmail, setSenderEmail,
    subject, setSubject,
    message, setMessage,
    honeypot, setHoneypot,
    setRecaptchaToken,
    sendStatus,
    errorMessage,
    handleSend,
    sendButtonLabel,
    showSentModal,
    dismissSentModal: () => setShowSentModal(false),
  };
}
