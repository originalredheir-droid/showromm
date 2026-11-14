'use client';

import React from 'react';
import { AlertCircle, ShieldCheck } from 'lucide-react';

interface CapabilityNoticeProps {
  customNotice?: string;
}

export function CapabilityNotice({ customNotice }: CapabilityNoticeProps) {
  return (
    <div className="p-4 rounded-xl bg-[#181C22] border border-[#31353C] space-y-3">
      <div className="flex items-center gap-2.5 text-[#B9C9D5]">
        <ShieldCheck className="w-5 h-5 shrink-0" />
        <span className="text-xs font-semibold uppercase tracking-wider">
          Production Scope Transparency
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="p-3 rounded-lg bg-[#10141A] border border-[#262A31] space-y-1">
          <div className="font-semibold text-[#DFE2EB] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>1. Visual & Interactive Design</span>
          </div>
          <p className="text-[#C2C7D0] leading-relaxed">
            Included: Complete frontend user interface, typography systems, responsive layouts, client-side animation choreography, and interactive mockup states.
          </p>
        </div>

        <div className="p-3 rounded-lg bg-[#10141A] border border-[#262A31] space-y-1">
          <div className="font-semibold text-[#DFE2EB] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B9C9D5]" />
            <span>2. Functional & Backend Architecture</span>
          </div>
          <p className="text-[#C2C7D0] leading-relaxed">
            Important: Visual previews do not imply automated server-side provision. Live relational databases, SMS/WhatsApp API keys, cloud hosting, and third-party gateways are scoped independently.
          </p>
        </div>
      </div>

      {customNotice && (
        <p className="text-[11px] text-[#8B9199] border-t border-[#262A31] pt-2 italic">
          * {customNotice}
        </p>
      )}
    </div>
  );
}
