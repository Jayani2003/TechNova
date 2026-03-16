import React from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/Herosection';
import Footer from './components/Footer';
import Why_us from './components/Why_us';



export default function App() {
  return (
    <div className="min-h-screen w-screen max-w-none bg-slate-50 ">
      <Navbar />
        
      <HeroSection/>
      <Why_us />

      <main className='p-8 text-center'>
        <h1 className="text-3xl font-bold text-slate-900">Welcome to Lanka Wheels</h1>
      </main>
      <Footer />
    </div>
  );
}