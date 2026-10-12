import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FaEnvelope, FaGithub, FaLinkedinIn, FaWhatsapp, FaCopy, FaCheck, FaFileLines, FaArrowUpRightFromSquare } from 'react-icons/fa6';
import { getSettings } from '../data/portfolio';

function ContactSection() {
  const [info, setInfo] = useState({
    contact_email: '',
    location: '',
    github_url: '',
    linkedin_url: '',
    whatsapp_url: '',
    cv_url: '',
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getSettings().then((s) => {
      setInfo({
        contact_email: s.contact_email || 'mazeneika2009@gmail.com',
        location: s.location || 'Cairo, Egypt',
        github_url: s.github_url || '',
        linkedin_url: s.linkedin_url || '',
        whatsapp_url: s.whatsapp_url || '',
        cv_url: s.cv_url || '',
      });
    });
  }, []);

  const email = info.contact_email || 'mazeneika2009@gmail.com';

  // Direct Gmail web compose: opens a ready-to-send draft in a new tab.
  // (mailto: depends on a local mail client being configured, which most
  // Chrome/Windows setups don't have — hence the broken blank-page behavior.)
  const gmailHref = `https://mail.google.com/mail/?view=cm&fs=1&to=mazeneika2009@gmail.com&su=Hello%20from%20Portfolio&body=Hello%20Mazen,%20`;

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = email;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    toast.success('Email copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const ctas = [
    ...(info.linkedin_url
      ? [{ label: 'LinkedIn', href: info.linkedin_url, icon: <FaLinkedinIn />, external: true }]
      : []),
    ...(info.github_url
      ? [{ label: 'GitHub', href: info.github_url, icon: <FaGithub />, external: true }]
      : []),
    ...(info.whatsapp_url
      ? [{ label: 'WhatsApp', href: info.whatsapp_url, icon: <FaWhatsapp />, external: true }]
      : []),
    ...(info.cv_url
      ? [{ label: 'Download CV', href: info.cv_url, icon: <FaFileLines />, external: true }]
      : []),
  ];

  return (
    <section id="contact" className="py-16 sm:py-28 overflow-hidden">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div>
          <p className="text-[10.5px] uppercase tracking-labels-wide text-muted mb-6" data-reveal>
            05 — Contact
          </p>
          <h2 className="font-display font-bold text-[clamp(34px,5vw,72px)] tracking-tightest leading-[0.95] mb-6" data-reveal>
            Let's build
            <br />
            something <span className="text-amber">real</span>.
          </h2>
          <p className="text-ink-secondary max-w-md mb-10" data-reveal>
            Have a project, a role, or just an idea? My inbox is always open — I usually reply within 24 hours.
          </p>
          <div className="text-sm text-ink-secondary space-y-2" data-reveal>
            <p className="text-[10.5px] uppercase tracking-labels text-muted">Based in</p>
            <p>{info.location || 'Cairo, Egypt'}</p>
          </div>
        </div>

        <div className="flex flex-col gap-6" data-reveal>
          <div className="inline-flex items-center gap-2.5 text-sm text-ink-secondary">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal opacity-60" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal" />
            </span>
            Available for new projects
          </div>

          <a
            href={gmailHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Compose email to ${email} in Gmail`}
            title={`Compose email to ${email} in Gmail`}
            className="group flex items-center justify-between gap-3 sm:gap-4 bg-ground-secondary border border-hairline rounded-2xl px-4 sm:px-6 py-5 hover:border-amber focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-ground active:scale-[0.99] transition-all min-h-[48px]"
          >
            <span className="flex items-center gap-3 sm:gap-4 min-w-0">
              <span className="flex items-center justify-center w-11 h-11 min-w-[48px] min-h-[48px] rounded-full bg-amber text-ground shrink-0">
                <FaEnvelope />
              </span>
              <span className="min-w-0">
                <span className="block text-[10.5px] uppercase tracking-labels text-muted">Email me at</span>
                <span className="block truncate text-ink font-medium text-sm sm:text-base">{email}</span>
              </span>
            </span>
            <span className="px-6 py-3 text-[10.5px] uppercase tracking-labels bg-amber text-ground rounded-full font-semibold group-hover:opacity-90 transition-opacity shrink-0 hidden sm:inline-block">
              Say hello
            </span>
          </a>

          <div className="flex flex-wrap gap-3">
            {ctas.map((cta) => (
              <a
                key={cta.label}
                href={cta.href}
                target="_blank"
                rel="noreferrer"
                className="min-h-[48px] inline-flex items-center gap-2.5 px-6 py-3 text-[10.5px] uppercase tracking-labels border border-hairline text-ink rounded-full hover:border-amber hover:text-amber transition-colors"
              >
                <span className="text-sm">{cta.icon}</span>
                {cta.label}
                <FaArrowUpRightFromSquare className="text-[10px] opacity-60" />
              </a>
            ))}
            <button
              type="button"
              onClick={copyEmail}
              className="min-h-[48px] inline-flex items-center gap-2.5 px-6 py-3 text-[10.5px] uppercase tracking-labels border border-hairline text-ink rounded-full hover:border-teal hover:text-teal transition-colors"
            >
              <span className="text-sm">{copied ? <FaCheck /> : <FaCopy />}</span>
              {copied ? 'Copied!' : 'Copy email'}
            </button>
          </div>

          <p className="text-sm text-muted">
            Prefer a quick chat? Email is fastest — or find me on the channels above.
          </p>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
