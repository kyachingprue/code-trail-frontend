import React from 'react';
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';

const MainLayout = () => {
  return (
    <div className='bg-[#023047] w-full mx-auto'>
      <Navbar></Navbar>
      <div className='px-5'>
        <Outlet />
      </div>
      <Footer></Footer>
    </div>
  );
};

export default MainLayout;