export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || "YOUR_MEASUREMENT_ID";

// Log the pageview with their URL
export const pageview = (url) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// Log specific events
export const event = (action, params = {}) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, params);
  }
};
