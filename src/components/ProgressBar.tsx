"use client";

import { APP_CONFIG } from "@/lib/config";
import NextTopLoader from "nextjs-toploader";

export default function TopProgressBar() {
  return (
    <NextTopLoader
      color={APP_CONFIG.ui.progressBarColor}
      height={APP_CONFIG.ui.progressBarHeight}
      showSpinner={false}
      shadow={false}
    />
  );
}
