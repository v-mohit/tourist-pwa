'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { GetUserDetails } from '@/services/apiCalls/login.service';
import { GetUserTicketListInLastTenMin } from '@/services/apiCalls/booking.services';
import LastTransactionPopup from '@/features/booking/components/LastTransactionPopup';
import CtaSection from './components/CtaSection';

export default function HomeClient() {
  const { user, isAuthenticated, openLoginModal } = useAuth();

  // Resolve the database user ID from the JWT subject the same way the Header
  // does it, then fetch the last 10 minutes of transactions.
  const { data: userDetailData } = GetUserDetails(user?.sub) as any;
  const dbUserId = userDetailData?.result?.id ?? user?.sub ?? '';

  const [shouldFetchTickets, setShouldFetchTickets] = useState(false);
  const [recentTickets, setRecentTickets] = useState<any[]>([]);
  const [showRecentPopup, setShowRecentPopup] = useState(false);
  const [hasShownThisSession, setHasShownThisSession] = useState(false);

  useEffect(() => {
    if (dbUserId && !hasShownThisSession) setShouldFetchTickets(true);
  }, [dbUserId, hasShownThisSession]);

  GetUserTicketListInLastTenMin(
    dbUserId,
    shouldFetchTickets,
    (res: any) => {
      const list = res?.ticketBookingDetailDtos ?? [];
      if (Array.isArray(list) && list.length > 0) {
        setRecentTickets(list);
        setShowRecentPopup(true);
        setHasShownThisSession(true);
      }
    },
    () => {},
  );

  function handleBookClick() {
    if (!isAuthenticated) openLoginModal();
    else alert('Proceed to booking!');
  }

  return (
    <>
      <CtaSection onBook={handleBookClick} />
      <LastTransactionPopup
        open={showRecentPopup}
        data={recentTickets}
        onClose={() => setShowRecentPopup(false)}
      />
    </>
  );
}
