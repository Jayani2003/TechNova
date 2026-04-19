import { Check } from "lucide-react";

const BookingStepIndicator = ({ steps, currentStep }) => (
  <div className="flex items-center justify-center mb-10">
    {steps.map((step, index) => {
      const isCompleted = index < currentStep;
      const isActive = index === currentStep;
      return (
        <div key={index} className="flex items-center">
          {/* Circle */}
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                isCompleted
                  ? "bg-[#00b0a5] text-white shadow-md shadow-[#00b0a5]/30"
                  : isActive
                  ? "bg-[#00b0a5] text-white shadow-lg shadow-[#00b0a5]/40 scale-110"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              {isCompleted ? <Check className="w-5 h-5" /> : index + 1}
            </div>
            <span
              className={`text-xs mt-1 font-medium whitespace-nowrap ${
                isActive ? "text-[#00b0a5]" : isCompleted ? "text-slate-600" : "text-slate-400"
              }`}
            >
              {step}
            </span>
          </div>

          {/* Connector line */}
          {index < steps.length - 1 && (
            <div
              className={`h-0.5 w-16 sm:w-24 mx-2 mb-5 transition-all duration-500 ${
                isCompleted ? "bg-[#00b0a5]" : "bg-slate-200"
              }`}
            />
          )}
        </div>
      );
    })}
  </div>
);

export default BookingStepIndicator;
