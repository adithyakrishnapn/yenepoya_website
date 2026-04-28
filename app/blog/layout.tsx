import type { ReactNode } from "react";
import { LeadPopup } from "@/components/lead-popup";

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <LeadPopup />
    </>
  );
}