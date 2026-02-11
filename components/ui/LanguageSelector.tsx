"use client";

import Script from "next/script";
import React from "react";

declare global {
  interface Window {
    gtranslateSettings?: Record<string, any>;
  }
}

export default function GTranslate(): React.JSX.Element {
  const settings = {
    default_language: "en",
    native_language_names: true,
    detect_browser_language: true,
    languages: ["en", "ig", "ha", "yo"],
    wrapper_selector: ".gtranslate_wrapper", // This must match the div below
    switcher_horizontal_position: "right",
    switcher_vertical_position: "bottom",
    flag_style: "2d",
    flag_size: 16,
    alt_flags: { en: "usa" },
  } as const;

  return (
    <>
      {/* 1. Put the wrapper here, NOT in your header files */}
      <div className="gtranslate_wrapper" />

      <Script
        id="gtranslate-settings"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.gtranslateSettings = ${JSON.stringify(settings)};`,
        }}
      />
      <Script
        src="https://cdn.gtranslate.net/widgets/latest/dwf.js"
        strategy="afterInteractive"
      />

      <style jsx global>{`
        /* 2. FORCE BODY TO STAY AT TOP (REMOVES WHITE SPACE) */
        body {
          top: 0px !important;
          position: static !important;
        }

        /* 3. POSITION THE ACTUAL SELECTOR AT THE BOTTOM RIGHT */
        .gtranslate_wrapper {
          position: fixed !important;
          bottom: 20px !important;
          right: 15px !important;
          z-index: 9999 !important;
        }

        /* Hide any other duplicates that might spawn at the top */
        header .gtranslate_wrapper,
        .nav-container .gtranslate_wrapper {
          display: none !important;
        }
      `}</style>
    </>
  );
}
