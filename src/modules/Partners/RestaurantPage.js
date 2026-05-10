import React from 'react';
import IndustryTemplate from './components/IndustryTemplate';
import Seo from '../../components/Seo';

const RestaurantPage = () => {
  return (
    <>
      <Seo title="My Hanuut pour Restaurants et Cafés" description="Menu QR, écran cuisine et gestion de restaurant en Algérie." url="https://hanuut.com/restaurant" />
      <IndustryTemplate domain="food" />
    </>
  );
};
export default RestaurantPage;