import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
//import profileIcon from './components/ProfileIcon';
import Footer from './components/Footer';


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

//user dashboard
import MyBookings from "./components/pages/User/MyBookings/MyBookings";
import MyReviews from "./components/pages/User/MyReviews/MyReviews";
import UserProfile from "./components/pages/User/UserProfile/UserProfile";  
import UserDashboard from "./components/pages/User/UserDashboard/UserDashboard";  
import MyMessages from "./components/pages/User/MyMessages/MyMessages";


//admin dashboard
import AdminLayout       from "./components/pages/Admin/AdminDashboard/AdminLayout";
import AdminDashboard    from "./components/pages/Admin/AdminDashboard/AdminDashboard";
import AddPointToPoint   from "./components/pages/Admin/AddPointToPoint/AddPointToPoint";
import ApproveBookings   from "./components/pages/Admin/ApproveBookings/ApproveBookings";
import Customers         from "./components/pages/Admin/Customers/Customer";
import FleetManagement   from "./components/pages/Admin/FleetManagement/FleetManagement";
import Messages          from "./components/pages/Admin/Messages/Messages";
import SeasonalPricing   from "./components/pages/Admin/SeasonalPricing/SeasonalPricing";
import TourPackages      from "./components/pages/Admin/TourPackages/TourPackages";
import AddGallery        from "./components/pages/Admin/AddGallery/AddGallery";
import Report            from "./components/pages/Admin/Report/Report";
import AdminProfile      from "./components/pages/Admin/AdminProfile/AdminProfile";


function SiteLayout({ children }) {
  return (
    <div className="min-h-screen w-screen max-w-none bg-slate-50">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Routes>

      {/* ════════════════════════════════════════════════════════
          ADMIN ROUTES
          AdminLayout provides its own sticky banner + tab nav.
          No site Navbar or Footer rendered here.
      ════════════════════════════════════════════════════════ */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="admin-dashboard"    element={<AdminDashboard />} />
        <Route path="add-point-to-point" element={<AddPointToPoint />} />
        <Route path="approve-bookings"   element={<ApproveBookings />} />
        <Route path="customers"          element={<Customers />} />
        <Route path="fleet-management"   element={<FleetManagement />} />
        <Route path="messages"           element={<Messages />} />
        <Route path="seasonal-pricing"   element={<SeasonalPricing />} />
        <Route path="tour-packages"      element={<TourPackages />} />
        <Route path="add-gallery"        element={<AddGallery />} />
        <Route path="report"             element={<Report />} />
        <Route path="profile"            element={<AdminProfile />} />
      </Route>

      {/* ════════════════════════════════════════════════════════
          SITE + USER ROUTES
          All wrapped in SiteLayout (Navbar + Footer).
      ════════════════════════════════════════════════════════ */}
      <Route path="/login"    element={<SiteLayout><Login /></SiteLayout>} />
      <Route path="/register" element={<SiteLayout><Register /></SiteLayout>} />

      <Route path="/"                      element={<SiteLayout><Home /></SiteLayout>} />
      <Route path="/about"                 element={<SiteLayout><About /></SiteLayout>} />
      <Route path="/contact"               element={<SiteLayout><Contact /></SiteLayout>} />
      <Route path="/gallery"               element={<SiteLayout><Gallery /></SiteLayout>} />
      <Route path="/reviews"               element={<SiteLayout><Reviews /></SiteLayout>} />
      <Route path="/vehicle-category"      element={<SiteLayout><VehicleCategory /></SiteLayout>} />
      <Route path="/tour-booking"          element={<SiteLayout><TourBooking /></SiteLayout>} />
      <Route path="/tour-booking/package"  element={<SiteLayout><Package /></SiteLayout>} />
      <Route path="/tour-booking/customized" element={<SiteLayout><Customized /></SiteLayout>} />
      <Route path="/tour-booking/point"    element={<SiteLayout><PointToPoint /></SiteLayout>} />

      <Route path="/user/dashboard"   element={<SiteLayout><UserDashboard /></SiteLayout>} />
      <Route path="/user/my-bookings" element={<SiteLayout><MyBookings /></SiteLayout>} />
      <Route path="/user/my-reviews"  element={<SiteLayout><MyReviews /></SiteLayout>} />
      <Route path="/user/profile"     element={<SiteLayout><UserProfile /></SiteLayout>} />
      <Route path="/user/messages"    element={<SiteLayout><MyMessages /></SiteLayout>} />

    </Routes>
  );
}
