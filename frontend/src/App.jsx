import React from 'react';
import Navbar from './components/Navbar/Navbar';
//import profileIcon from './components/ProfileIcon';
import Footer from './components/Footer';
import { Routes, Route } from 'react-router-dom';

import Login from "./components/pages/Shared/Login";
import Register from "./components/pages/Shared/Register";

//site
import Home from "./components/pages/Site/Home/Home";
import About from "./components/pages/Site/About/About";
import Contact from "./components/pages/Site/Contact/Contact";
import Gallery from "./components/pages/Site/Gallery/Gallery";
import Reviews from "./components/pages/Site/Reviews/Reviews";
import VehicleCategory from "./components/pages/Site/VehicleCategory/VehicleCategory";
import TourBooking from "./components/pages/Site/TourBooking/Tours/TourBooking";
import Customized from "./components/pages/Site/TourBooking/Customized/Customized";
import Package from "./components/pages/Site/TourBooking/Package/Package";
import PointToPoint from "./components/pages/Site/TourBooking/PointToPoint/PointToPoint";

//user dashbourd
import MyBookings from "./components/pages/User/MyBookings/MyBookings";
import MyReviews from "./components/pages/User/MyReviews/MyReviews";
import UserProfile from "./components/pages/User/UserProfile/UserProfile";  
import UserDadhboard from "./components/pages/User/UserDashboard/UserDashboard";  
import MyMessages from "./components/pages/User/MyMessages/MyMessages";


//admin dashbourd
import AddPointToPoint from "./components/pages/Admin/AddPointToPoint/AddPointToPoint";
import ApproveBookings from "./components/pages/Admin/ApproveBookings/ApproveBookings";
import ApproveReviews from "./components/pages/Admin/ApproveReviews/ApproveReviews";
import Customers from "./components/pages/Admin/Customers/Customer";
import AdminDashboard from "./components/pages/Admin/AdminDashboard/AdminDashboard";
import FleetManagement from "./components/pages/Admin/FleetManagement/FleetManagement";
import Messages from "./components/pages/Admin/Messages/Messages";
import SeasonalPricing from "./components/pages/Admin/SeasonalPricing/SeasonalPricing";
import TourPackages from "./components/pages/Admin/TourPackages/TourPackages";
import AddGallery from "./components/pages/Admin/AddGallery/AddGallery";
import Report from "./components/pages/Admin/Report/Report";
import AdminProfile from "./components/pages/Admin/AdminProfile/AdminProfile";




export default function App() {
  return (



    <div className="min-h-screen w-screen max-w-none bg-slate-50 ">
      <Navbar />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />


        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/vehicle-category" element={<VehicleCategory />} />
        <Route path="/tour-booking" element={<TourBooking />} />
        <Route path="/tour-booking/package" element={<Package />} />
        <Route path="/tour-booking/customized" element={<Customized />} />
        <Route path="/tour-booking/point" element={<PointToPoint />} />

        <Route path="/user/dashboard" element={<UserDadhboard />} />
        <Route path="/user/my-bookings" element={<MyBookings />} />
        <Route path="/user/my-reviews" element={<MyReviews />} />
        <Route path="/user/profile" element={<UserProfile />} />
        <Route path="/user/messages" element={<MyMessages />} />  



        <Route path="/admin/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin/add-point-to-point" element={<AddPointToPoint />} />
        <Route path="/admin/approve-bookings" element={<ApproveBookings />} />
        <Route path="/admin/approve-reviews" element={<ApproveReviews />} />
        <Route path="/admin/customers" element={<Customers />} />
        <Route path="/admin/fleet-management" element={<FleetManagement />} />
        <Route path="/admin/messages" element={<Messages />} />
        <Route path="/admin/seasonal-pricing" element={<SeasonalPricing />} />
        <Route path="/admin/tour-packages" element={<TourPackages />} />
        <Route path="/admin/add-gallery" element={<AddGallery />} />
        <Route path="/admin/report" element={<Report />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        
      </Routes>

      <Footer />
    </div>



  );
}
