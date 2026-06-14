"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { GA_TRACKING_ID, pageview } from "@/lib/analytics";

function AnalyticsComponent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
      pageview(url);
    }
  }, [pathname, searchParams]);

  return null;
}

export default function GoogleAnalytics() {
  if (!GA_TRACKING_ID || GA_TRACKING_ID === "YOUR_MEASUREMENT_ID") {
    // If it's still default placeholder, we'll still load the scripts or log a dev notice
    console.warn("Google Analytics: Measurement ID is not configured (currently using fallback 'YOUR_MEASUREMENT_ID')");
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              send_page_view: false,
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      <Suspense fallback={null}>
        <AnalyticsComponent />
      </Suspense>
    </>
  );
}
