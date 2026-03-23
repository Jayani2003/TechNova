import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Routes, Route } from 'react-router-dom';


import Home from "./components/pages/Home/Home";
import About from "./components/pages/About/About";
import Contact from "./components/pages/Contact/Contact";
import Gallery from "./components/pages/Gallery/Gallery";
import Reviews from "./components/pages/Reviews/Reviews";
import VehicleCategory from "./components/pages/VehicleCategory/VehicleCategory";


import Customized from "./components/pages/TourBooking/Customized/Customized";
import Package from "./components/pages/TourBooking/Package/Package";
import PointToPoint from "./components/pages/TourBooking/PointToPoint/PointToPoint";


export default function App() {
  return (



    <div className="min-h-screen w-screen max-w-none bg-slate-50 ">
      <Navbar />

       <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/vehicle" element={<VehicleCategory />} />

        
        <Route path="/tour/customized" element={<Customized />} />
        <Route path="/tour/package" element={<Package />} />
        <Route path="/tour/point" element={<PointToPoint />} />
      </Routes>

      <Footer />
    </div>



  );
}