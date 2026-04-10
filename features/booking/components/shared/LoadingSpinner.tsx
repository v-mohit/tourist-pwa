export default function LoadingSpinner({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <div className="w-8 h-8 border-3 border-[#E8DAC5] border-t-[#E8631A] rounded-full animate-spin" />
      <p className="text-sm text-[#7A6A58]">{message}</p>
    </div>
  );
}
