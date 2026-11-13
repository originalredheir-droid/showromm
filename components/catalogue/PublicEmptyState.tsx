import { Layers } from 'lucide-react';

export function PublicEmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto my-8 max-w-xl rounded-xl border border-dashed border-[#4B515B] bg-[#181C22] px-6 py-14 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[#31353C] bg-[#262A31] text-[#FF535B]">
        <Layers className="h-5 w-5" />
      </div>
      <h2 className="text-base font-semibold text-[#DFE2EB]">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#C2C7D0]">{description}</p>
    </div>
  );
}
