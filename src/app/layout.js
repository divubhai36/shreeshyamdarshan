import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import siteConfig from "@/config/site";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  display: 'swap',
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL(siteConfig.baseUrl),
  title: {
    default: "Shree Shyam Darshan | India's #1 Divine Poshak Manufacturer",
    template: "%s | Shree Shyam Darshan"
  },
  description: "Experience the ultimate divine elegance with Shree Shyam Darshan. We are India's biggest manufacturer of premium Laddu Gopal Poshaks, Shringar, and Accessories. Direct from Surat to your home.",
  keywords: ["Laddu Gopal Poshaks", "Divine Shringar", "Shree Shyam Darshan", "Surat Poshak Manufacturer", "Handmade Deity Dresses", "Premium Pooja Accessories", "Ladoo Gopal Accessories"],
  authors: [{ name: "Shree Shyam Darshan" }],
  creator: "Shree Shyam Darshan",
  publisher: "Shree Shyam Darshan",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Shree Shyam Darshan - Premium Divine Collections",
    description: "India's Biggest Manufacturer of Divine Poshaks and Accessories. Crafted with devotion and excellence in Surat.",
    url: "https://shreeshyamdarshan.com",
    siteName: "Shree Shyam Darshan",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Shree Shyam Darshan Divine Collection Preview",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shree Shyam Darshan | Premium Divine Collections",
    description: "India's Biggest Manufacturer of Divine Poshaks and Accessories. Direct from Surat.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Shree Shyam Darshan",
              "image": "https://shreeshyamdarshan.com/og-image.jpg",
              "@id": "https://shreeshyamdarshan.com",
              "url": "https://shreeshyamdarshan.com",
              "telephone": "+91 73836 99199",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "69, Shree, Darshan Industries, Kamrej Rd, Laskana",
                "addressLocality": "Surat",
                "addressRegion": "Gujarat",
                "postalCode": "394185",
                "addressCountry": "IN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 21.2436,
                "longitude": 72.8893
              },
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday"
                ],
                "opens": "09:00",
                "closes": "18:00"
              },
              "sameAs": [
                "https://www.instagram.com/shree.shyam.darshan_/"
              ]
            }),
          }}
        />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
