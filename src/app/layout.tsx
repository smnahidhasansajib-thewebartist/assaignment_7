import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import { ToastProvider } from "@/components/toast-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "বাজার দর | প্রতিদিনের বাজারদর",
  description:
    "বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের হালনাগাদ দাম, বাজারভিত্তিক তুলনা ও দৈনিক ওঠানামা এক নজরে দেখুন।",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="bn">
      <body>
        <SiteShell>{children}</SiteShell>
        <ToastProvider />
      </body>
    </html>
  );
}
