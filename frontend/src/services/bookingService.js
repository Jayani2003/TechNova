import { api } from '../config/api';
 
// Submit a Point-to-Point booking
export const submitP2PBooking = (data) => api.post('/bookings/p2p', data);

const buildPackageBookingPayload = (data) => ({
  tourType: 'PACKAGE',
  packageId: data.packageId,
  packageName: data.packageName,
  customerEmail: data.customerEmail,
  startDate: data.startDate,
  endDate: data.endDate,
  pickupTime: data.pickupTime,
  totalDays: data.totalDays,
  daysRequired: data.daysRequired,
  categoryId: data.categoryId,
  noOfAdults: data.noOfAdults,
  noOfChildren: data.noOfChildren,
  agesOfChildren: data.agesOfChildren,
  babySeatNeeded: data.babySeatNeeded,
  smallLuggages: data.smallLuggages,
  largeLuggages: data.largeLuggages,
  customerName: data.customerName,
  customerPhone: data.customerPhone,
  notes: data.notes,
});

// Submit a Package booking through the same booking endpoint
export const submitPackageBooking = (data) =>
  api.post('/bookings/p2p', buildPackageBookingPayload(data));
 
// Fetch the logged-in customer's own bookings
export const fetchMyBookings = () => api.get('/bookings/my').then((d) => d.bookings);
 
// Admin: fetch ALL bookings
export const fetchAllBookings = () => api.get('/bookings').then((d) => d.bookings);
 
// Admin: send a price quote
export const sendQuote = (bookingId, quotedPrice, vehicleId) =>
  api.patch(`/bookings/${bookingId}/quote`, { quotedPrice, vehicleId });
 
// Customer: accept or reject a quote. Admin: advance workflow
export const updateBookingStatus = (bookingId, status) =>
  api.patch(`/bookings/${bookingId}/status`, { status });
 
