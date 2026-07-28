import React, { useEffect, useRef } from 'react';

const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY ?? '';

/** True when a reCAPTCHA site key is configured; consumers can use this to
 *  require a token before allowing a submit. */
export const RECAPTCHA_ENABLED = Boolean(SITE_KEY);

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      render: (el: HTMLElement, opts: Record<string, unknown>) => number;
      reset: (id?: number) => void;
    };
  }
}

// Load the Google reCAPTCHA script exactly once, shared across renders.
let scriptPromise: Promise<void> | null = null;
function loadReCaptchaScript(): Promise<void> {
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise<void>((resolve, reject) => {
    if (window.grecaptcha) return resolve();
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load reCAPTCHA'));
    document.head.appendChild(script);
  });
  return scriptPromise;
}

interface ReCaptchaProps {
  /** Called with the token when solved, or null when it expires/errors. */
  onChange: (token: string | null) => void;
}

/**
 * reCAPTCHA v2 checkbox. Renders nothing unless VITE_RECAPTCHA_SITE_KEY is set,
 * so local/dev and pre-setup deploys keep a working form. Once the key is set
 * (and the same key is enabled on the EmailJS template), a solved token is
 * required before the form will send.
 */
export const ReCaptcha: React.FC<ReCaptchaProps> = ({ onChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<number | null>(null);

  useEffect(() => {
    if (!SITE_KEY) return;
    let cancelled = false;

    loadReCaptchaScript()
      .then(() => {
        if (cancelled || !window.grecaptcha) return;
        window.grecaptcha.ready(() => {
          if (cancelled || !containerRef.current || widgetId.current !== null) return;
          widgetId.current = window.grecaptcha!.render(containerRef.current, {
            sitekey: SITE_KEY,
            callback: (token: string) => onChange(token),
            'expired-callback': () => onChange(null),
            'error-callback': () => onChange(null),
          });
        });
      })
      .catch(() => onChange(null));

    return () => {
      cancelled = true;
    };
  }, [onChange]);

  if (!SITE_KEY) return null;
  return <div ref={containerRef} style={{ marginTop: 8 }} />;
};
