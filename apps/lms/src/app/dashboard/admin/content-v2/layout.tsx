"use client";

import { cn } from "@/lib/utils";

export default function ContentV2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 flex">
      {children}
    </div>
  );
} 