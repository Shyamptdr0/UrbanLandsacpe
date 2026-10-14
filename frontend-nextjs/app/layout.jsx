  import "./globals.css";
import Providers from "./providers";
import { Noto_Sans, Playfair_Display } from "next/font/google";
import { cn } from "@/lib/utils";

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
});

const notoSans = Noto_Sans({ subsets: ['latin'], variable: '--font-sans' });

export const metadata = {
  title: "Urban Landscape",
  description: "A construction & design platform engineered on precision, transparency and legacy craftsmanship.",
  icons: {
    icon: [
      { url: "/logo.jpeg", type: "image/jpeg" },
    ],
    shortcut: "/logo.jpeg",
    apple: "/logo.jpeg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={cn("font-sans", notoSans.variable, playfairDisplay.variable)}>
      <head>
        <link rel="icon" href="/logo.jpeg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/logo.jpeg" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
