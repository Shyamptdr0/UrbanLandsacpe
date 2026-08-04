import "./globals.css";
import Providers from "./providers";
import { Noto_Sans, Playfair_Display } from "next/font/google";
import { cn } from "@/lib/utils";

const playfairDisplayHeading = Playfair_Display({subsets:['latin'],variable:'--font-heading'});

const notoSans = Noto_Sans({subsets:['latin'],variable:'--font-sans'});

export const metadata = {
  title: "Urban Landscape",
  description: "A construction & design platform engineered on precision, transparency and legacy craftsmanship.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={cn("font-sans", notoSans.variable, playfairDisplayHeading.variable)}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
