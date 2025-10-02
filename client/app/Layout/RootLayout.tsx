import { Providers } from "../providers";
import "./globals.css";

export const metadata = {
  title: "easydrive",
  description: "rent cars website ,easy drive is a rent car website that works in egypt for all visitors ",

};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
