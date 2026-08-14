"use client"

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import getConfig from "next/config";
import Router from "next/router";
import useScripts from "@/hooks/useScripts";

declare global {
  interface Window {
    utag_data: any;
    tealium_data2track: any;
    OptanonWrapper?: () => void;
    OnetrustActiveGroups?: string;
    OneTrust?: {
      OnConsentChanged?: (callback: () => void) => void;
    };
    AdobeAnalyticsDisabled?: boolean;
    AdobeAnalyticsReloaded?: number;
  }
}

const AdobeAnalytics = ({ pageType, lang }: any) => {
  const origin = globalThis?.window?.location?.origin;
  const isProd = process.env.NODE_ENV !== "development";
  const entryCount = useRef(0); // Flag for the number of entries can be done on page load (this is limited to 1 to prevent analytics duplication in one run)
  const environment = process.env.NODE_ENV == "development"
    ? "qa"
    : isProd
      ? "prod"
      : "qa";

  // Hooks
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [initiated, setInitiated] = useState(false);
  const scriptsLoadedRef = useRef(false);
  const hasConsentRef = useRef(false);
  const [loadScripts] = useScripts([
    {
      src: '/scripts/jquery.min.js',
      id: 'jquery-script',
      queue: true,
      head: true,
      preserve: true,
    },
    {
      src: `https://tags.tiqcdn.com/utag/luxottica/unofficial/prod/utag.js`,
      //src: `https://tags.tiqcdn.com/utag/luxottica/unofficial/dev/utag.js`,
      type: "text/javascript",
      id: "adobe-analytics-script",
      queue: true,
      head: true,
      preserve: true,
    },
  ]);

  // Effects
  useEffect(() => {
    const home = pageType === "Home";
    const locator = pageType === "StoreList";
    const plp = pageType === "Plp";
    const pdp = pageType === "Pdp";
    const fallback = params?.lang === "default";

    const pageLocale = params?.lang === "en" ? "en-us" : params?.lang as string;
    const locale = pageLocale?.split("-");
    const paths = typeof params?.route === "string"
      ? [params?.route]
      : params?.route || [];

    let Page_Language = locale?.[0]?.toUpperCase() || "";
    let Page_Country = locale?.[1]?.toUpperCase() || "US";
    let Page_Type = "";
    let Page_Section1 = ""; //used by prop20
    let Page_Section2 = "";

    if (pageType === "Error") {
      Page_Language = Page_Language !== "DEFAULT" ? Page_Language : "EN";
      Page_Type = "Error";
      Page_Section1 = "Other";
      Page_Section2 = "ErrorHttp404";
    } else if (fallback) {
      Page_Language = "EN";
      Page_Country = "GB";
      Page_Type = pageType;
      Page_Section1 = "";
      Page_Section2 = "";
    } else if (locator) {
      Page_Type = "StoreLocator";
      Page_Section1 = "StoreList";
      Page_Section2 = "";
    } else if (plp) {
      Page_Type = "Plp";
      Page_Section1 = paths?.[0];
      Page_Section2 = paths
        ?.filter((path: any) => path !== Page_Section1)
        ?.join(":");
    } else if (pdp) {
      Page_Type = "Pdp";
      Page_Section1 = paths?.[0];
      Page_Section2 = paths
        ?.filter((path: any) => path !== Page_Section1)
        ?.join(":");
    } else {
      Page_Type = pageType;
      Page_Section1 = home ? pageType : paths?.[0] || "";
      Page_Section2 = paths
        ?.filter((path: any) => path !== Page_Section1)
        ?.join(":");
    }

    if (!window.utag_data) {
      window.utag_data = {
        Page_Language: Page_Language,
        Page_Country: Page_Country,
      };
    }

    if (!window.tealium_data2track) {
      window.tealium_data2track = [];
    }

    entryCount.current = entryCount.current + 1;
    //Add validation to the entry count per page
    if (entryCount.current === 1) {
      window.tealium_data2track.push({
        id: "VirtualPage-View",
        Page_Language: Page_Language,
        Page_Country: Page_Country,
        Page_Type: Page_Type,
        Page_Section1: Page_Section1,
        Page_Section2: Page_Section2,
      });

      console.log(window.tealium_data2track);
    }

    Router.events.on("routeChangeStart", () => {
      entryCount.current = 0;
    });

    setInitiated(true);
  }, [pathname, pageType, entryCount]); //[router, pageType, entryCount, BRAND_PAGES]

  useEffect(() => {
    if (!initiated) return;

    if (localStorage.getItem("analyticsLoaded") == null) {
      localStorage.setItem("analyticsLoaded", "true");
      loadScripts();
    }

    const disableTealium = () => {
      const now = Date.now();
      const lastReload = window.AdobeAnalyticsReloaded ?? 0;

      const reloadCooldown = 3000;

      if (now - lastReload > reloadCooldown) {
        window.AdobeAnalyticsReloaded = now;
        location.reload();
      }
    };

    const loadIfConsented = () => {
      const groupString = window?.OnetrustActiveGroups || "";
      const scriptsAlreadyLoaded = scriptsLoadedRef.current;
      const adobeDisabled = window?.AdobeAnalyticsDisabled;

      if (groupString.indexOf("C0002") > -1) {
        if (!scriptsAlreadyLoaded && !adobeDisabled) {
          loadScripts();
          scriptsLoadedRef.current = true;
        }
        hasConsentRef.current = true;
      } else {
        if (scriptsAlreadyLoaded && hasConsentRef.current) {
          disableTealium();
        }
        hasConsentRef.current = false;
      }
    };

    const prevOptanonWrapper = window.OptanonWrapper;
    window.OptanonWrapper = () => {
      try {
        prevOptanonWrapper && prevOptanonWrapper();
      } finally {
        loadIfConsented();
      }
    };

    const timeout = setTimeout(loadIfConsented, 1000);

    if (window.OneTrust?.OnConsentChanged) {
      window.OneTrust.OnConsentChanged(() => { loadIfConsented() });
    }

    return () => {
      clearTimeout(timeout);
      window.OptanonWrapper = prevOptanonWrapper;
    };
  }, [initiated, loadScripts]);

  return null;
};

export default AdobeAnalytics;
