import React, { useState } from "react";
import { SecurityProvider, useSecurity } from "./context/SecurityContext";
import { DeviceFrame } from "./components/common/DeviceFrame";
import { Header } from "./components/common/Header";
import { BottomNav } from "./components/common/BottomNav";
import { HomeTab } from "./components/home/HomeTab";
import { ScanTab } from "./components/scan/ScanTab";
import { AlertsTab } from "./components/alerts/AlertsTab";
import { AppAuditTab } from "./components/audit/AppAuditTab";
import { SettingsTab } from "./components/settings/SettingsTab";
import { OnboardingModal } from "./components/onboarding/OnboardingModal";
import { PWAInstallBanner } from "./components/common/PWAInstallBanner";
import { GetOnPhoneModal } from "./components/common/GetOnPhoneModal";

const AppContent: React.FC = () => {
  const { activeTab } = useSecurity();
  const [showGetOnPhoneModal, setShowGetOnPhoneModal] = useState(false);

  return (
    <DeviceFrame>
      <PWAInstallBanner onOpenGetOnPhoneModal={() => setShowGetOnPhoneModal(true)} />
      <Header onOpenGetOnPhone={() => setShowGetOnPhoneModal(true)} />
      <main className="flex-1 overflow-y-auto">
        {activeTab === "home" && <HomeTab />}
        {activeTab === "scan" && <ScanTab />}
        {activeTab === "alerts" && <AlertsTab />}
        {activeTab === "audit" && <AppAuditTab />}
        {activeTab === "settings" && (
          <SettingsTab onOpenGetOnPhone={() => setShowGetOnPhoneModal(true)} />
        )}
      </main>
      <BottomNav />
      <OnboardingModal />
      <GetOnPhoneModal
        isOpen={showGetOnPhoneModal}
        onClose={() => setShowGetOnPhoneModal(false)}
      />
    </DeviceFrame>
  );
};

export default function App() {
  return (
    <SecurityProvider>
      <AppContent />
    </SecurityProvider>
  );
}
