export const navLinks = [
  { name: 'Home', path: '/' },

  {
    name: 'Tour Booking',
    path: '/tour-booking',
    children: [
      { name: 'Point-to-Point', path: '/tour-booking/point' },
      { name: 'Package Tours', path: '/tour-booking/package' },
      { name: 'Customized Tours', path: '/tour-booking/customized' },
    ],
  },

  { name: 'Vehicle Category', path: '/vehicle-category' },
  { name: 'Reviews', path: '/reviews' },
  { name: 'About Us', path: '/about' },
  { name: 'Contact Us', path: '/contact' },
  { name: 'Gallery', path: '/gallery' },
];