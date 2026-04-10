'use client';

interface StepHeaderProps {
  steps: string[];
  currentStep: number; // 0-indexed
  onBack?: () => void;
  title: string;
}

export default function StepHeader({ steps, currentStep, onBack, title }: StepHeaderProps) {
  return (
    <div className="mb-6">
      {/* Step progress dots */}
      <div className="flex items-center justify-center gap-2 mb-4">
        {steps.map((label, i) => (
          <div key={i} className="flex items-center gap-1">
            <div
              className={`flex items-center justify-center rounded-full text-[10px] font-bold transition-all duration-200 ${
                i < currentStep
                  ? 'w-6 h-6 bg-[#E8631A] text-white'
                  : i === currentStep
                  ? 'w-7 h-7 bg-[#E8631A] text-white ring-2 ring-[#E8631A]/30'
                  : 'w-6 h-6 bg-[#E8DAC5] text-[#7A6A58]'
              }`}
            >
              {i < currentStep ? '✓' : i + 1}
            </div>
            {i < steps.length - 1 && (
              <div
                className={`h-0.5 w-6 transition-all duration-200 ${
                  i < currentStep ? 'bg-[#E8631A]' : 'bg-[#E8DAC5]'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step label */}
      <div className="text-center">
        <div className="text-[10px] font-semibold tracking-[1px] uppercase text-[#E8631A] mb-1">
          Step {currentStep + 1} of {steps.length}
        </div>
        <h3 className="font-['Playfair_Display',serif] text-lg font-bold text-[#2C2017]">
          {title}
        </h3>
      </div>

      {/* Back button */}
      {onBack && (
        <button
          onClick={onBack}
          className="mt-3 flex items-center gap-1 text-sm text-[#7A6A58] hover:text-[#E8631A] transition-colors"
        >
          ← Back
        </button>
      )}
    </div>
  );
}
