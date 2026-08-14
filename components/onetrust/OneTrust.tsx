"use client"

import Script from "next/script";

declare global {
  interface Window {
    OptanonWrapper?: () => void;
  }
}

const OneTrustAnalytics = () => {
  return (
    <Script
    
      src="https://cdn.cookielaw.org/scripttemplates/otSDKStub.js"
      strategy="afterInteractive"
      data-domain-script="019c31c4-545b-7420-b428-a31d9ebb1c5c"
      //data-domain-script="019d61a0-94ee-7ede-9af3-8c6199b00061"
      //data-domain-script="019d61a0-94ee-7ede-9af3-8c6199b00061-test"
    />
  );
};

export default OneTrustAnalytics;
