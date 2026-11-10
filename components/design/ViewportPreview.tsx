'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Monitor, Tablet, Smartphone, Lock, Maximize2 } from 'lucide-react';
import { Design, ScreenPreview } from '@/types';
import { cn } from '@/lib/utils';

interface ViewportPreviewProps {
  design: Design;
}

export function ViewportPreview({ design }: ViewportPreviewProps) {
  const [activeViewport, setActiveViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [selectedScreenId, setSelectedScreenId] = useState<string>(
    design.screenPreviews[0]?.id || 'main'
  );

  const activeScreen: ScreenPreview =
    design.screenPreviews.find((s) => s.id === selectedScreenId) ||
    design.screenPreviews.find((s) => s.viewport === activeViewport) || {
      id: 'default',
      title: design.title,
      viewport: activeViewport,
      image: design.visualPreviewImage,
      description: design.shortDescription,
    };

  const handleViewportChange = (viewport: 'desktop' | 'tablet' | 'mobile') => {
    setActiveViewport(viewport);
    const matched = design.screenPreviews.find((s) => s.viewport === viewport);
    if (matched) {
      setSelectedScreenId(matched.id);
    }
  };

  return (
    <div className="rounded-xl bg-[#181C22] border border-[#31353C] overflow-hidden shadow-2xl space-y-0">
      {/* Browser Stage Top Bezel */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-[#1C2026] border-b border-[#31353C] gap-3">
        {/* Window dots & simulated domain */}
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/30 border border-red-500/50" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/30 border border-yellow-500/50" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/30 border border-emerald-500/50" />
          <span className="ml-2 pl-3 border-l border-[#31353C] text-xs text-[#C2C7D0] flex items-center gap-1.5 font-mono">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>stage.redheir.studio/{design.slug}</span>
          </span>
        </div>

        {/* Viewport Mode Switcher Buttons */}
        <div className="flex items-center gap-1 bg-[#10141A] p-0.5 rounded-lg border border-[#31353C]">
          <button
            type="button"
            onClick={() => handleViewportChange('desktop')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1 rounded text-xs transition-colors',
              activeViewport === 'desktop'
                ? 'bg-[#262A31] text-[#DFE2EB] font-semibold border border-[#353940] shadow-sm'
                : 'text-[#C2C7D0] hover:text-[#DFE2EB]'
            )}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>
          <button
            type="button"
            onClick={() => handleViewportChange('tablet')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1 rounded text-xs transition-colors',
              activeViewport === 'tablet'
                ? 'bg-[#262A31] text-[#DFE2EB] font-semibold border border-[#353940] shadow-sm'
                : 'text-[#C2C7D0] hover:text-[#DFE2EB]'
            )}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span>Tablet</span>
          </button>
          <button
            type="button"
            onClick={() => handleViewportChange('mobile')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1 rounded text-xs transition-colors',
              activeViewport === 'mobile'
                ? 'bg-[#262A31] text-[#DFE2EB] font-semibold border border-[#353940] shadow-sm'
                : 'text-[#C2C7D0] hover:text-[#DFE2EB]'
            )}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile</span>
          </button>
        </div>
      </div>

      {/* Responsive Viewport Display Canvas */}
      <div className="relative bg-[#0A0E14] flex items-center justify-center p-4 sm:p-6 overflow-hidden min-h-[380px] sm:min-h-[460px]">
        {/* Frame container matching viewport width */}
        <div
          className={cn(
            'relative overflow-hidden rounded-lg shadow-2xl border border-[#31353C] transition-all duration-300',
            activeViewport === 'desktop' && 'w-full aspect-[16/10]',
            activeViewport === 'tablet' && 'w-full max-w-[640px] aspect-[4/3]',
            activeViewport === 'mobile' && 'w-full max-w-[340px] aspect-[9/16]'
          )}
        >
          <Image
            src={activeScreen.image}
            alt={activeScreen.title}
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover"
            priority
            referrerPolicy="no-referrer"
          />

          {/* Canvas badges */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="px-2.5 py-1 rounded text-[11px] font-semibold bg-[#10141A]/90 backdrop-blur border border-[#31353C] text-white flex items-center gap-1.5 shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Interactive Prototype</span>
            </span>
          </div>
        </div>
      </div>

      {/* Screen Preview Thumbnails Selector Strip */}
      {design.screenPreviews.length > 1 && (
        <div className="p-3 bg-[#1C2026] border-t border-[#31353C] flex items-center gap-2 overflow-x-auto">
          <span className="text-xs text-[#8B9199] uppercase tracking-wider font-semibold mr-2 shrink-0">
            Available Screens:
          </span>
          {design.screenPreviews.map((screen) => (
            <button
              key={screen.id}
              onClick={() => {
                setSelectedScreenId(screen.id);
                setActiveViewport(screen.viewport);
              }}
              type="button"
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs transition-all shrink-0',
                selectedScreenId === screen.id
                  ? 'bg-[#262A31] border-[#FF535B] text-[#DFE2EB] font-semibold'
                  : 'bg-[#10141A] border-[#31353C] text-[#C2C7D0] hover:text-[#DFE2EB]'
              )}
            >
              <span>{screen.title}</span>
              <span className="text-[10px] text-[#8B9199] font-mono">({screen.viewport})</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
