"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = authClient.useSession();
  const pathname = usePathname();
  const router = useRouter();
  const redirected = useRef(false);

  useEffect(() => {
    if (isPending || session || redirected.current) return;
    redirected.current = true;
    toast("বিস্তারিত দেখতে আগে সাইন ইন করুন", { icon: "🔐" });
    router.replace(`/signin?callbackUrl=${encodeURIComponent(pathname)}`);
  }, [isPending, pathname, router, session]);

  if (isPending || !session) {
    return (
      <section aria-label="সেশন যাচাই হচ্ছে" className="section">
        <div className="container">
          <div className="state-card state-card--compact">
            <div className="loading-spinner" />
            <h2>{session ? "লোড হচ্ছে…" : "সাইন ইন পৃষ্ঠায় নেওয়া হচ্ছে…"}</h2>
          </div>
        </div>
      </section>
    );
  }

  return children;
}
