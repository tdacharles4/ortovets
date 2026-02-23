import * as React from "react";

export function ReviewCard() {
  return (
    <div className="flex flex-col w-full max-w-[566px] h-fit min-h-[217px] rounded-[8px] border border-[#D9D9D9] p-[16px] gap-[16px] bg-white">
      {/* Content will be pulled from product info later */}
      <div className="flex flex-col gap-4">
        <div className="w-24 h-4 bg-muted animate-pulse rounded" />
        <div className="space-y-2">
          <div className="w-full h-4 bg-muted animate-pulse rounded" />
          <div className="w-full h-4 bg-muted animate-pulse rounded" />
          <div className="w-3/4 h-4 bg-muted animate-pulse rounded" />
        </div>
      </div>
      <div className="mt-auto flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
        <div className="w-32 h-4 bg-muted animate-pulse rounded" />
      </div>
    </div>
  );
}
