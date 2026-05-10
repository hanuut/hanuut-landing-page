import React from 'react';
import IndustryTemplate from './components/IndustryTemplate';
import Seo from '../../components/Seo';

const EpiceriePage = () => {
  return (
    <>
      <Seo title="My Hanuut pour Alimentation Générale" description="Caisse hors-ligne et scan de code-barres pour les épiceries en Algérie." url="https://hanuut.com/epicerie" />
      <IndustryTemplate domain="grocery" />
    </>
  );
};
export default EpiceriePage;