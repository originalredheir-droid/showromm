'use client';

import React, { createContext, useContext, useState } from 'react';
import { PresenterSettings } from '@/types';
import { getStoredPresenterSettings, saveStoredPresenterSettings } from '@/lib/storage';

interface PresenterContextType extends PresenterSettings {
  togglePricing: () => void;
  toggleInternalDetails: () => void;
  togglePitchMode: () => void;
  setPitchMode: (active: boolean) => void;
}

const PresenterContext = createContext<PresenterContextType | undefined>(undefined);

export function PresenterProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<PresenterSettings>(() => {
    return getStoredPresenterSettings();
  });

  const updateSettings = (newSettings: PresenterSettings) => {
    setSettings(newSettings);
    saveStoredPresenterSettings(newSettings);
  };

  const togglePricing = () => {
    updateSettings({ ...settings, showPricing: !settings.showPricing });
  };

  const toggleInternalDetails = () => {
    updateSettings({ ...settings, showInternalDetails: !settings.showInternalDetails });
  };

  const togglePitchMode = () => {
    updateSettings({ ...settings, pitchMode: !settings.pitchMode });
  };

  const setPitchMode = (active: boolean) => {
    updateSettings({ ...settings, pitchMode: active });
  };

  return (
    <PresenterContext.Provider
      value={{
        ...settings,
        togglePricing,
        toggleInternalDetails,
        togglePitchMode,
        setPitchMode,
      }}
    >
      {children}
    </PresenterContext.Provider>
  );
}

export function usePresenter() {
  const context = useContext(PresenterContext);
  if (!context) {
    throw new Error('usePresenter must be used within a PresenterProvider');
  }
  return context;
}
