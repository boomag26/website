import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Boom – Hub de Performance Gamer",
  description: "Boom.ag – Hub pioneiro em mídia de performance para o público gamer.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt" data-theme="SetupTwo">
      <head>
        {/* Favicon */}
        <link rel="shortcut icon" href="/assets/images/favicon.png" />

        {/* CSS do template (vêm de /public/assets/css) */}
        <link rel="stylesheet" href="/assets/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/assets/css/meanmenu.css" />
        <link rel="stylesheet" href="/assets/css/all.min.css" />
        <link rel="stylesheet" href="/assets/css/swiper-bundle.min.css" />
        <link rel="stylesheet" href="/assets/css/magnific-popup.css" />
        <link rel="stylesheet" href="/assets/css/animate.css" />
        <link rel="stylesheet" href="/assets/css/splitting.css" />
        <link rel="stylesheet" href="/assets/css/nice-select.css" />
        <link rel="stylesheet" href="/assets/css/style.css" />
      </head>
      <body className={inter.className}>
        {children}

        {/* Google tag (gtag.js) – GA4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-141YBDBHLP"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-141YBDBHLP');
          `}
        </Script>
      </body>
    </html>
  );
}
