'use client';

import { Printer } from 'lucide-react';

export function ProposalPrintButton() {
  const print = () => {
    document.body.classList.add('printing-proposal');
    window.addEventListener('afterprint', () => {
      document.body.classList.remove('printing-proposal');
    }, { once: true });
    window.print();
  };

  return (
    <button
      type="button"
      onClick={print}
      className="print-hide inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#B9C9D5] px-4 py-2.5 text-sm font-semibold text-[#10141A] hover:bg-[#DDE5EA]"
    >
      <Printer className="h-4 w-4" />
      Print / Save as PDF
    </button>
  );
}
