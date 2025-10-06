import React from 'react';
import Landingnav from '../components/Landingnav';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/How';
import Faq from '../components/Faq';
import Reviews from '../components/Reviews';
import Footer from '../components/Footer';
const Home = () => {
  return (
    <div>
      <Landingnav />
      <Hero />
      <Features />
      <HowItWorks />
      <Faq />
      <Reviews />
      <Footer />
    </div>
  )
}

export default Home
