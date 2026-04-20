import React from 'react';
import { useSettingsStore } from '../store/playerStore';
import { clearInstanceCache } from '../api/instances';
import { clearCache } from '../api/tidalApi';
import type { AudioQuality } from '../api/types';
import { getQualityLabel } from '../lib/utils';

const QUALITIES: { value: AudioQuality; label: string; description: string; badge?: string }[] = [
  { value: 'LOW', label: 'Normal', description: 'Lossy 96kbps | Lower data usage', badge: 'AAC'  },
  { value: 'HIGH', label: 'High', description: 'Lossy 320kbps | Good quality', badge: 'AAC' },
  { value: 'LOSSLESS', label: 'Lossless', description: 'upto 16 bit 44.1 kHz | CD quality', badge: 'FLAC' },
  { value: 'HI_RES_LOSSLESS', label: 'Hi-Res Lossless', description: 'upto 24 bit 192 kHz | Studio Master', badge: 'FLAC' },
];

export default function SettingsPage() {
  const { audioQuality, dataSaver, setAudioQuality, setDataSaver, } = useSettingsStore();

  const handleClearCache = () => {
    clearCache();
    clearInstanceCache();
    window.location.reload();
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-display font-bold text-text-primary mb-8">Settings</h1>

      {/* Audio Quality */}
      <SettingsSection title="Audio Quality" description="Choose your preferred streaming quality">
        <div className="flex flex-col gap-2">
          {QUALITIES.map(({ value, label, description, badge }) => (
            <button
              key={value}
              onClick={() => setAudioQuality(value)}
              disabled={dataSaver && value !== 'LOW'}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-150
                ${audioQuality === value
                  ? 'border-accent bg-accent-dim'
                  : 'border-border bg-bg-elevated hover:border-border-bright hover:bg-bg-hover'
                }
                ${dataSaver && value !== 'LOW' ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                  ${audioQuality === value ? 'border-accent' : 'border-text-muted'}`}>
                  {audioQuality === value && (
                    <div className="w-2 h-2 rounded-full bg-accent" />
                  )}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${audioQuality === value ? 'text-accent' : 'text-text-primary'}`}>
                      {label}
                    </span>
                    {badge && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-accent-dim border border-accent/30 text-accent font-mono">
                        {badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-muted mt-0.5">{description}</p>
                </div>
              </div>
              {audioQuality === value && (
                <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6L5 9L10 3" stroke="#070709" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </SettingsSection>

      {/* Data Saver */}
      <SettingsSection title="Data Saver" description="Reduce data usage by capping quality to Normal">
        <Toggle
          enabled={dataSaver}
          onChange={(v) => {
            setDataSaver(v);
            if (v) setAudioQuality('LOW');
          }}
          label="Enable Data Saver"
        />
      </SettingsSection>

      {/* Instance / Network */}
      <SettingsSection title="Network" description="TIDAL instance settings">
        <button
          onClick={handleClearCache}
          className="px-4 py-2.5 rounded-xl bg-bg-elevated border border-border text-sm
            text-text-secondary hover:text-text-primary hover:border-border-bright transition-all"
        >
          Clear Cache & Reconnect
        </button>
        <p className="text-xs text-text-muted mt-2">
          Clears the instance cache and reloads. Use this if playback fails.
        </p>
      </SettingsSection>

      {/* About */}
      <SettingsSection title="About" description="">
        <div className="p-4 rounded-xl bg-bg-elevated border border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shadow-glow-sm">
              <span className="text-bg-primary font-display font-bold">R</span>
            </div>
            <div>
              <p className="font-display font-semibold text-text-primary">Rhythmax</p>
              <p className="text-xs text-text-muted">v1.0.0 · Web Player for TIDAL</p>
            </div>
          </div>
          <p className="text-xs text-text-muted leading-relaxed">
            Rhythmax is a community-powered TIDAL web player. It uses public TIDAL relay instances
            for streaming. Not affiliated with TIDAL or MQA.
          </p>
        </div>
      </SettingsSection>
    </div>
  );
}

function SettingsSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8">
      <div className="mb-4">
        <h2 className="text-base font-display font-semibold text-text-primary">{title}</h2>
        {description && <p className="text-sm text-text-muted mt-0.5">{description}</p>}
      </div>
      {children}
    </section>
  );
}

function Toggle({
  enabled,
  onChange,
  label,
}: {
  enabled: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <div
      className="flex items-center justify-between p-4 rounded-xl bg-bg-elevated border border-border cursor-pointer"
      onClick={() => onChange(!enabled)}
    >
      <span className="text-sm text-text-primary">{label}</span>
      <div
        className={`w-11 h-6 rounded-full transition-colors duration-200 relative
          ${enabled ? 'bg-accent' : 'bg-bg-hover'}`}
      >
        <div
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200
            ${enabled ? 'translate-x-5' : 'translate-x-0.5'}`}
        />
      </div>
    </div>
  );
}
