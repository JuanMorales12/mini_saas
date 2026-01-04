import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mini SaaS - Subscription Management",
  description: "A modern SaaS application with Stripe subscriptions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
