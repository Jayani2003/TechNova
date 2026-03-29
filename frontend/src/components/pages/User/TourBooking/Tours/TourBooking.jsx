import React from 'react';
import Intro from './Intro';
import Packagec from './Packagec';
import Custom from './Custom';
import Point from './Point';



function TourBooking() {
	return (
    <div className="bg-white min-h-screen font-sans">
      <Intro />
      <div className="max-w-7xl mx-auto px-4 py-16 space-y-24">
        <Packagec />
        <Custom />
        <Point />
      </div>
    </div>
  );
}

export default TourBooking;