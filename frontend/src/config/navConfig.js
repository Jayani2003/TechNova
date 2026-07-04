export const navLinks = [
  { label: 'Home', path: '/' },

  {
    label: 'Tour Booking',
    path: '/tour-booking',
    children: [
      { label: 'Point-to-Point', path: '/tour-booking/point' },
      { label: 'Package Tours', path: '/tour-booking/package' },
      { label: 'Customized Tours', path: '/tour-booking/customized' },
    ],
  },

  { label: 'Vehicle Category', path: '/vehicle-category' },
  { label: 'Reviews', path: '/reviews' },
  { label: 'About Us', path: '/about' },
  { label: 'Contact Us', path: '/contact' },
  { label: 'Gallery', path: '/gallery' },
];