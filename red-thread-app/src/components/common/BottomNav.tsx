import React from "react";
import { LayoutDashboard, ScanSearch, BellRing, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { useSecurity } from "../../context/SecurityContext";

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, history } = useSecurity();

  const unreviewedThreatsCount = history.filter(
    (h) => (h.riskLevel === "HIGH" || h.riskLevel === "SUSPICIOUS") && !h.reviewed
  ).length;

  const navItems: {
    id: "home" | "scan" | "alerts" | "audit" | "settings";
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }[] = [
    { id: "home", label: "Home", icon: LayoutDashboard },
    { id: "scan", label: "Scan", icon: ScanSearch },
    { id: "alerts", label: "Alerts", icon: BellRing, badge: unreviewedThreatsCount },
    { id: "audit", label: "App Audit", icon: ShieldCheck },
    { id: "settings", label: "Settings", icon: SlidersHorizontal },
  ];

  return (
    <nav className="sticky bottom-0 z-30 bg-[#070B14]/95 backdrop-blur-lg border-t border-[#1A2640] px-3 py-2">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 active:scale-95 ${
                isActive
                  ? "text-cyan-400 font-semibold"
                  : "text-slate-400 hover:text-slate-200 font-normal"
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? "scale-110 text-cyan-400" : "text-slate-400"
                  }`}
                />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 px-1.5 py-0.2 min-w-[16px] h-4 text-[10px] font-bold bg-rose-500 text-white rounded-full flex items-center justify-center border border-[#070B14] shadow-sm animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tight">{item.label}</span>
              {isActive && (
                <span className="w-4 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
