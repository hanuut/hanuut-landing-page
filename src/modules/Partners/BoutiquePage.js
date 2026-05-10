import React from 'react';
import IndustryTemplate from './components/IndustryTemplate';
import Seo from '../../components/Seo';

const BoutiquePage = () => {
  return (
    <>
      <Seo title="My Hanuut pour Boutiques en Ligne" description="Boutique Link-in-bio et gestion de stock pour vendeurs Instagram." url="https://hanuut.com/boutique" />
      <IndustryTemplate domain="global" />
    </>
  );
};
export default BoutiquePage;