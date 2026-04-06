'use client';

export default function BookingModal({ place, onClose }: any) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-[400px]">
        <h2 className="text-lg font-semibold mb-4">
          Book {place?.attributes?.name}
        </h2>

        <input type="date" className="border p-2 w-full mb-3" />
        <input
          type="number"
          placeholder="Tickets"
          className="border p-2 w-full mb-3"
        />

        <button className="bg-orange-500 text-white px-4 py-2 rounded">
          Confirm Booking
        </button>

        <button onClick={onClose} className="ml-3 text-gray-500">
          Cancel
        </button>
      </div>
    </div>
  );
}