import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';
import { RevealObserver } from '../utils/RevealObserver';
import Navigation from '../components/Navigation';
import PortalHero from '../components/PortalHero';
import StatementFold from '../components/StatementFold';
import Releases from '../components/Releases';
import Roster from '../components/Roster';
import DatesTable from '../components/DatesTable';
import CertificateSection from '../components/CertificateSection';
import ContactSection from '../components/ContactSection';
import Close from '../components/Close';

function LandingPage() {
  const reveals = useReveal();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const scrollTarget = params.get('scroll');
    if (!scrollTarget) return;
    const ids = { work: 'work', certificates: 'certificates' };
    const sectionId = ids[scrollTarget];
    if (!sectionId) return;
    const t = setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' });
    }, 80);
    return () => clearTimeout(t);
  }, [location.search]);

  return (
    <main className={reveals ? 'reveals' : ''}>
      <Navigation />
      <PortalHero />
      <StatementFold />
      <Releases />
      <Roster />
      <DatesTable />
      <CertificateSection />
      <ContactSection />
      <Close />
      <RevealObserver />
    </main>
  );
}

export default LandingPage;
