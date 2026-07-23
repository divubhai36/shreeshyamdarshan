export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || "YOUR_MEASUREMENT_ID";

// Log the pageview with their URL
export const pageview = (url) => {
  if (typeof window !== "undefined") {
    const gtag = window.gtag || function() {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(arguments);
    };
    gtag("event", "page_view", {
      page_path: url,
      page_location: window.location.origin + url,
      page_title: document.title,
    });
  }
};

// Log specific events
export const event = (action, params = {}) => {
  if (typeof window !== "undefined") {
    const gtag = window.gtag || function() {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(arguments);
    };
    gtag("event", action, params);
  }
};
