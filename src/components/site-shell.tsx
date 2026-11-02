import Link from "next/link";
import { connection } from "next/server";
import { SiteHeader } from "@/components/site-header";

export async function SiteShell({ children }: { children: React.ReactNode }) {
  await connection();
  const today = new Intl.DateTimeFormat("bn-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(new Date());

  return (
    <>
      <SiteHeader today={today} />
      <main className="site-main">{children}</main>
      <footer className="site-footer">
        <div className="container site-footer__inner">
          <Link className="footer-brand" href="/">বাজার দর</Link>
          <p>বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।</p>
          <p className="site-footer__note">
            সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
          </p>
          <span className="site-footer__copyright">© {new Date().getFullYear()} বাজার দর</span>
        </div>
      </footer>
    </>
  );
}
