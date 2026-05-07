import { buildApiUrl } from '../config/api';
 
// Submit a Point-to-Point booking
export const submitP2PBooking = (data) => api.post('/bookings/p2p', data);
 
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
 
