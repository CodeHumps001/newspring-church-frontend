import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Newspring Chapel - Church Financial Management System",
    template: "%s | Newspring Chapel",
  },
  description:
    "A comprehensive financial management system for Newspring Chapel A/G. Track tithes, offerings, special seeds, and children service finances with ease.",
  keywords: [
    "church management",
    "financial system",
    "tithe tracking",
    "offering management",
    "church accounting",
    "Newspring Chapel",
  ],
  authors: [{ name: "Newspring Chapel A/G" }],
  creator: "Newspring Chapel A/G",
  publisher: "Newspring Chapel A/G",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://newspring-chapel.vercel.app",
    siteName: "Newspring Chapel Financial System",
    title: "Newspring Chapel - Church Financial Management",
    description:
      "Easily manage church finances, track offerings, and generate reports with our comprehensive financial management system.",
    images: [
      {
        url: "/logo.jpeg",
        width: 1200,
        height: 630,
        alt: "Newspring Chapel Financial Management System",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Newspring Chapel - Church Financial Management",
    description:
      "Easily manage church finances, track offerings, and generate reports with our comprehensive financial management system.",
    images: ["/twitter-image.png"],
    creator: "@newspringchapel",
    site: "@newspringchapel",
  },
  icons: {
    icon: [
      { url: "/logo.jpeg", sizes: "any" },
      { url: "/logo.jpeg", sizes: "16x16", type: "image/png" },
      { url: "/logo.jpeg", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/logo.jpeg", sizes: "180x180", type: "image/png" }],
    other: [
      {
        rel: "mask-icon",
        url: "/logo.jpeg",
        color: "#3b82f6",
      },
    ],
  },
  verification: {
    google: "your-google-verification-code", // Add your Google Search Console code
    // yandex: "your-yandex-verification-code",
    // me: ["your-email@example.com"],
  },
  alternates: {
    canonical: "https://newspring-church.vercel.app/",
  },
  category: "Church Management",
  classification: "Financial Management System",
  applicationName: "Newspring Chapel FMS",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Structured Data / JSON-LD for better SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Newspring Chapel Financial Management System",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              description:
                "Church financial management system for tracking tithes, offerings, and generating reports.",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              provider: {
                "@type": "Organization",
                name: "Newspring Chapel A/G",
                url: "https://newspring-chapel.vercel.app",
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster position="top-right" />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
