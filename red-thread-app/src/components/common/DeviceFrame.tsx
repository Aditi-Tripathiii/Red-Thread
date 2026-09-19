import React from "react";
import { Wifi, BatteryMedium, SignalHigh } from "lucide-react";
import { useSecurity } from "../../context/SecurityContext";

export const DeviceFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { deviceFrameMode } = useSecurity();

  if (!deviceFrameMode) {
    return <div className="min-h-screen flex flex-col bg-[#070B14]">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-[#03060C] py-6 px-3 flex items-center justify-center">
      {/* Android Device Shell */}
      <div className="relative w-full max-w-[420px] h-[860px] max-h-[95vh] bg-[#070B14] rounded-[48px] shadow-[0_25px_70px_rgba(0,0,0,0.85),0_0_0_12px_#1B263B,0_0_0_14px_#0C1322] border-4 border-[#243555] flex flex-col overflow-hidden">
        {/* Status Bar */}
        <div className="bg-[#070B14] text-slate-300 text-xs px-6 pt-3 pb-1 flex items-center justify-between select-none z-40">
          <span className="font-semibold text-slate-200 tracking-tight">10:00</span>
          {/* Camera Punch Hole */}
          <div className="w-3.5 h-3.5 bg-black rounded-full border border-slate-800" />
          <div className="flex items-center space-x-2 text-slate-300">
            <SignalHigh className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <span className="text-[11px] font-medium">98%</span>
            <BatteryMedium className="w-4 h-4 text-emerald-400" />
          </div>
        </div>

        {/* Device Screen Content */}
        <div className="flex-1 overflow-y-auto flex flex-col relative scrollbar-thin scrollbar-thumb-[#1A2640] scrollbar-track-transparent">
          {children}
        </div>

        {/* Android Gesture Navigation Bar */}
        <div className="bg-[#070B14] py-2 flex items-center justify-center z-40 border-t border-[#121B2D]">
          <div className="w-32 h-1 bg-slate-600 rounded-full" />
        </div>
      </div>
    </div>
  );
};
