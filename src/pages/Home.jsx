import React from 'react';
import Header from '../components/Header';
import StoriesList from '../components/StoriesList';
import AboutStudy from '../components/AboutStudy';
import TestimonialCard from '../components/TestimonialCard';
import StudyTour from '../components/StudyTour';

const Home = () => {
  return (
    <div className='min-h-screen'>
      <Header></Header>
      <StoriesList></StoriesList>
      <AboutStudy></AboutStudy>
      <TestimonialCard></TestimonialCard>
      <StudyTour></StudyTour>
    </div>
  );
};

export default Home;