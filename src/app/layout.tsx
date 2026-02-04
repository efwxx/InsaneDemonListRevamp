import "./globals.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import { ThemeProvider } from "next-themes";
import Nav from "@/components/Nav";
import { getCurrentUser } from "@/lib/auth";
import Script from "next/script";
import type { Viewport } from "next";
import type { Metadata } from "next";

export const metadata: Metadata = {
  openGraph: {
    title: "Geometry Dash Insane Demonlist",
    description: "A demon list with insane demons instead of extreme demons.",
  },
  authors: {
    name: "hpsk",
  },
  title: "Insane Demon List",
  keywords:
    "hpsk,gdhpsk,insane,demon,list,demonlist,hardest,levels,geometry dash,gd",
  description: "A demon list with insane demons instead of extreme demons.",
  other: {
    "google-adsense-account": "ca-pub-4543250064393866",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 5.0,
  userScalable: true,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const data = user ? { user } : {};

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body>
        <ThemeProvider attribute="class">
          <Theme accentColor="sky" appearance="inherit">
            <Nav
              authData={data || {}}
              routes={[
                { route: "/main", name: "Main List" },
                { route: "/extended", name: "Extended List" },
                { route: "/legacy", name: "Legacy List" },
                { route: "/platformer", name: "Platformer List" },
                { route: "/leaderboards", name: "Leaderboards" },
                { route: "/packs", name: "Packs" },
                { route: "/submit", name: "Submit" },
              ]}
            ></Nav>
            {children}
          </Theme>
        </ThemeProvider>
      </body>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4543250064393866"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      ></Script>
    </html>
  );
}
