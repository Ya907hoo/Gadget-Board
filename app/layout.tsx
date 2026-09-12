import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProvider } from "@/lib/context";

export const viewport: Viewport = {
  themeColor: "#0A84FF",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Gadget Board | 4D Pocket Collaborative Wishes",
  description: "A playful, Doraemon-inspired collaborative idea board where users post wishes, vote, and grant 22nd-century gadget solutions in real-time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Inter:wght@400;500;600;700&family=Nunito:wght@400;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-doraemon-cream text-doraemon-charcoal font-body antialiased flex flex-col selection:bg-doraemon-blue-light selection:text-doraemon-blue-dark">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
