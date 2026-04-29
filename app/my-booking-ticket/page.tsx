import { redirect } from 'next/navigation';

// Payment gateway return URL from the old project. Forward to /my-bookings
// with the same params so the user lands on their freshly-paid booking.
export default async function MyBookingTicketPage({ searchParams }: any) {
  const params = await searchParams;
  const query = new URLSearchParams();
  if (params?.bookingId)     query.set('bookingId', String(params.bookingId));
  if (params?.paymentStatus) query.set('paymentStatus', String(params.paymentStatus));
  if (params?.isPublic)      query.set('isPublic', String(params.isPublic));
  const qs = query.toString();
  redirect(qs ? `/my-bookings?${qs}` : '/my-bookings');
}
