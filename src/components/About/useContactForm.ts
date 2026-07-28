import { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID ?? '';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID ?? '';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? '';
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY ?? '';

// A genuine human takes at least a few seconds to read the page and fill three
// fields; bots submit near-instantly. Anything faster than this is dropped.
const MIN_SUBMIT_MS = 3000;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SendStatus = 'idle' | 'sending' | 'sent' | 'error';

/**
 * Shared state + submit logic for the contact form, used by both the desktop
 * and mobile About panels so the anti-spam protections stay identical.
 *
 * Note: because this is a static site, the EmailJS keys are necessarily public.
 * These client-side checks (honeypot, time-trap, optional reCAPTCHA) stop the
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
  const mountTime = useRef(Date.now());

  const flashStatus = (status: SendStatus) => {
    setSendStatus(status);
    setTimeout(() => setSendStatus('idle'), 3000);
  };

  const handleSend = () => {
    // Silently drop obvious bots (honeypot filled or submitted implausibly
    // fast). We show "Sent!" rather than an error so a bot can't tell it was
    // caught and adapt.
    if (honeypot.trim() !== '' || Date.now() - mountTime.current < MIN_SUBMIT_MS) {
      flashStatus('sent');
      return;
    }

    if (!senderEmail.trim() || !message.trim()) {
      alert('Please fill in your email and message.');
      return;
    }
    if (!EMAIL_RE.test(senderEmail.trim())) {
      alert('Please enter a valid email address.');
      return;
    }
    // Only enforce the captcha when one is actually configured, so the form
    // still works before a reCAPTCHA site key is set up.
    if (RECAPTCHA_SITE_KEY && !recaptchaToken) {
      alert('Please complete the "I\'m not a robot" check.');
      return;
    }

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
        setSenderEmail('');
        setSubject('');
        setMessage('');
        setRecaptchaToken(null);
        setTimeout(() => setSendStatus('idle'), 3000);
      })
      .catch(() => flashStatus('error'));
  };

  const sendButtonLabel =
    sendStatus === 'sending' ? 'Sending...' :
    sendStatus === 'sent' ? 'Sent!' :
    sendStatus === 'error' ? 'Failed' : 'Send';

  return {
    senderEmail, setSenderEmail,
    subject, setSubject,
    message, setMessage,
    honeypot, setHoneypot,
    setRecaptchaToken,
    sendStatus,
    handleSend,
    sendButtonLabel,
  };
}
