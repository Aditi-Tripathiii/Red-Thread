import React from 'react';
import {
  LayoutDashboard,
  MessageSquareWarning,
  Globe,
  PhoneCall,
  ShieldAlert,
  QrCode,
  Ban,
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'messages'
  | 'links'
  | 'calls'
  | 'apps'
  | 'qr_checker'
  | 'blocked_items';

interface NavigationProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  threatCounts: {
    messages: number;
    links: number;
    calls: number;
    apps: number;
    blocked: number;
    qrScams: number;
  };
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  threatCounts,
}) => {
  const tabs = [
    {
      id: 'dashboard' as NavTab,
      label: 'Security Hub',
      icon: LayoutDashboard,
      badge: 0,
    },
    {
      id: 'qr_checker' as NavTab,
      label: 'UPI QR Checker',
      icon: QrCode,
      badge: threatCounts.qrScams,
      highlight: true,
    },
    {
      id: 'messages' as NavTab,
      label: 'Message AI',
      icon: MessageSquareWarning,
      badge: threatCounts.messages,
    },
    {
      id: 'links' as NavTab,
      label: 'Link Guard',
      icon: Globe,
      badge: threatCounts.links,
    },
    {
      id: 'calls' as NavTab,
      label: 'Scam Calls',
      icon: PhoneCall,
      badge: threatCounts.calls,
    },
    {
      id: 'apps' as NavTab,
      label: 'App Privacy',
      icon: ShieldAlert,
      badge: threatCounts.apps,
    },
    {
      id: 'blocked_items' as NavTab,
      label: 'Blocked Items',
      icon: Ban,
      badge: threatCounts.blocked,
      isBlockedTab: true,
    },
  ];

  return (
    <nav className="w-full bg-slate-950/95 border-b border-slate-800 px-2 sm:px-4 py-2 overflow-x-auto no-scrollbar sticky top-0 z-30 backdrop-blur-md">
      <div className="flex items-center gap-1 sm:gap-2 min-w-max mx-auto justify-start sm:justify-center">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex items-center gap-1.5 sm:gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? tab.isBlockedTab
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm shadow-rose-950/50'
                    : tab.highlight
                    ? 'bg-red-600/20 text-red-300 border border-red-500/40 shadow-sm shadow-red-950/50'
                    : 'bg-red-500/15 text-red-300 border border-red-500/40 shadow-sm shadow-red-950/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/70 border border-transparent'
              }`}
            >
              <Icon
                className={`w-4 h-4 ${
                  isActive
                    ? tab.isBlockedTab
                      ? 'text-rose-400'
                      : 'text-red-400'
                    : 'text-slate-400'
                }`}
              />
              <span>{tab.label}</span>

              {tab.badge > 0 && (
                <span className={`px-1.5 py-0.2 min-w-[1.125rem] h-4.5 rounded-full text-white text-[10px] font-bold flex items-center justify-center ${
                  tab.isBlockedTab ? 'bg-rose-600' : 'bg-red-600'
                }`}>
                  {tab.badge}
                </span>
              )}

              {isActive && (
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-red-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
