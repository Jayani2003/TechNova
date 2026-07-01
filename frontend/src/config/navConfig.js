export const navLinks = [
  { nameKey: 'nav.home', path: '/' },

  {
    nameKey: 'nav.tourBooking',
    path: '/tour-booking',
    children: [
      { nameKey: 'nav.pointToPoint', path: '/tour-booking/point' },
      { nameKey: 'nav.packageTours', path: '/tour-booking/package' },
      { nameKey: 'nav.customizedTours', path: '/tour-booking/customized' },
    ],
  },

  { nameKey: 'nav.vehicleCategory', path: '/vehicle-category' },
  { nameKey: 'nav.reviews', path: '/reviews' },
  { nameKey: 'nav.aboutUs', path: '/about' },
  { nameKey: 'nav.contactUs', path: '/contact' },
  { nameKey: 'nav.gallery', path: '/gallery' },
];