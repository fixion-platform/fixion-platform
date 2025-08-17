import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/How';
import Faq from '../components/Faq';
import Reviews from '../components/Reviews';
import Footer from '../components/Footer';
const Home = () => {
  return (
    <div>
      <Navbar />
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
