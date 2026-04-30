'use client';

import { Suspense } from 'react';
import PayDifferenceAmount from '@/features/booking/components/PayDifferenceAmount';

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-sm text-[#7A6A58]">Loading…</div>}>
      <PayDifferenceAmount />
    </Suspense>
  );
}
