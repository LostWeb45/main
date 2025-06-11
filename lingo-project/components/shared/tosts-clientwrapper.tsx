"use client";

import dynamic from "next/dynamic";

const TostsParams = dynamic(() => import("./tosts-params"), { ssr: false });

export function TostsParamsClientWrapper() {
  return <TostsParams />;
}
