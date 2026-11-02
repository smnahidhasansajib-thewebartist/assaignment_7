"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, LoaderCircle, LockKeyhole, Mail, UserRound } from "lucide-react";
import { authClient } from "@/lib/auth-client";

function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="section auth-section">
      <div className="auth-card">
        <Link className="back-link" href="/">← হোম পেজে ফিরুন</Link>
        <div className="auth-card__mark">🛒</div>
        <span className="section-kicker">বাজারদর সবসময় হাতের কাছে</span>
        <h1>{title}</h1>
        <p className="auth-card__subtitle">{subtitle}</p>
        {children}
      </div>
      <div aria-hidden="true" className="auth-decoration auth-decoration--one">✳</div>
      <div aria-hidden="true" className="auth-decoration auth-decoration--two">✳</div>
    </section>
  );
}

function AuthLoading() {
  return <div aria-label="লোড হচ্ছে" className="auth-loading"><LoaderCircle className="spin" size={22} /></div>;
}

function SocialLogin({ callbackURL = "/" }: { callbackURL?: string }) {
  const [loading, setLoading] = useState<"google" | "github" | null>(null);

  async function signInWith(provider: "google" | "github") {
    setLoading(provider);
    try {
      const result = await authClient.signIn.social({
        provider,
        callbackURL,
      });
      if (result.error) {
        toast.error(result.error.message ?? "সোশ্যাল সাইন ইন করা যায়নি");
        setLoading(null);
      }
    } catch (error) {
      console.error(`${provider} sign-in failed:`, error);
      toast.error("সোশ্যাল সাইন ইন এখন উপলভ্য নয়।");
      setLoading(null);
    }
  }

  return (
    <>
      <div className="auth-divider"><span>অথবা</span></div>
      <div className="social-buttons">
        <button className="button button--social" disabled={loading !== null} onClick={() => void signInWith("google")} type="button">
          {loading === "google" ? <LoaderCircle className="spin" size={17} /> : <span className="google-mark">G</span>}
          Google দিয়ে চালিয়ে যান
        </button>
        <button className="button button--social" disabled={loading !== null} onClick={() => void signInWith("github")} type="button">
          {loading === "github" ? <LoaderCircle className="spin" size={17} /> : <span className="github-mark">GH</span>}
          GitHub দিয়ে চালিয়ে যান
        </button>
      </div>
    </>
  );
}

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const callbackUrl = searchParams.get("callbackUrl");
  const destination =
    callbackUrl?.startsWith("/") &&
    !callbackUrl.startsWith("//") &&
    !callbackUrl.includes("\\")
      ? callbackUrl
      : "/";

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    if (!email.trim() || !password) {
      const message = "ইমেইল ও পাসওয়ার্ড লিখুন।";
      setErrorMessage(message);
      toast.error(message);
      return;
    }
    setSubmitting(true);
    try {
      const result = await authClient.signIn.email({ email: email.trim(), password });
      if (result.error) {
        const message = result.error.message ?? "ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।";
        setErrorMessage(message);
        toast.error(message);
        return;
      }
      toast.success("সফলভাবে সাইন ইন হয়েছে");
      router.replace(destination);
      router.refresh();
    } catch (error) {
      console.error("Email sign-in failed:", error);
      const message = "সাইন ইন করা যায়নি। সার্ভার কনফিগারেশন পরীক্ষা করুন।";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout title="আবার স্বাগতম" subtitle="আপনার অ্যাকাউন্টে সাইন ইন করুন">
      <form className="auth-form" onSubmit={submit}>
        <label className="form-field">
          <span>ইমেইল ঠিকানা</span>
          <span className="input-wrap"><Mail aria-hidden="true" size={18} /><input autoComplete="email" onChange={(event) => setEmail(event.target.value)} placeholder="আপনার ইমেইল" type="email" value={email} /></span>
        </label>
        <label className="form-field">
          <span>পাসওয়ার্ড</span>
          <span className="input-wrap"><LockKeyhole aria-hidden="true" size={18} /><input autoComplete="current-password" onChange={(event) => setPassword(event.target.value)} placeholder="আপনার পাসওয়ার্ড" type="password" value={password} /></span>
        </label>
        {errorMessage && <p className="form-error" role="alert">{errorMessage}</p>}
        <button className="button button--primary button--large auth-submit" disabled={submitting} type="submit">
          {submitting ? <><LoaderCircle className="spin" size={18} /> যাচাই হচ্ছে…</> : "সাইন ইন"}
        </button>
      </form>
      <SocialLogin callbackURL={destination} />
      <p className="auth-switch">অ্যাকাউন্ট নেই? <Link href="/signup">সাইন আপ করুন</Link></p>
    </AuthLayout>
  );
}

function SignUpForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    if (!name.trim() || !email.trim() || password.length < 8) {
      const message = password.length < 8
        ? "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।"
        : "নাম ও ইমেইল ঠিকানা লিখুন।";
      setErrorMessage(message);
      toast.error(message);
      return;
    }
    setSubmitting(true);
    try {
      const result = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
      });
      if (result.error) {
        const message = result.error.message ?? "অ্যাকাউন্ট তৈরি করা যায়নি।";
        setErrorMessage(message);
        toast.error(message);
        return;
      }
      toast.success("অ্যাকাউন্ট তৈরি হয়েছে, এবার সাইন ইন করুন");
      router.push("/signin");
    } catch (error) {
      console.error("Email registration failed:", error);
      const message = "সাইন আপ করা যায়নি। সার্ভার কনফিগারেশন পরীক্ষা করুন।";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout title="নতুন অ্যাকাউন্ট তৈরি করুন" subtitle="বাজারদরের সঙ্গে থাকুন এক ধাপ এগিয়ে">
      <form className="auth-form" onSubmit={submit}>
        <label className="form-field">
          <span>আপনার নাম</span>
          <span className="input-wrap"><UserRound aria-hidden="true" size={18} /><input autoComplete="name" onChange={(event) => setName(event.target.value)} placeholder="পুরো নাম" value={name} /></span>
        </label>
        <label className="form-field">
          <span>ইমেইল ঠিকানা</span>
          <span className="input-wrap"><Mail aria-hidden="true" size={18} /><input autoComplete="email" onChange={(event) => setEmail(event.target.value)} placeholder="আপনার ইমেইল" type="email" value={email} /></span>
        </label>
        <label className="form-field">
          <span>পাসওয়ার্ড</span>
          <span className="input-wrap"><LockKeyhole aria-hidden="true" size={18} /><input autoComplete="new-password" minLength={8} onChange={(event) => setPassword(event.target.value)} placeholder="কমপক্ষে ৮ অক্ষর" type="password" value={password} /></span>
        </label>
        {errorMessage && <p className="form-error" role="alert">{errorMessage}</p>}
        <button className="button button--primary button--large auth-submit" disabled={submitting} type="submit">
          {submitting ? <><LoaderCircle className="spin" size={18} /> অ্যাকাউন্ট তৈরি হচ্ছে…</> : "সাইন আপ"}
        </button>
      </form>
      <SocialLogin />
      <p className="auth-switch">আগে থেকেই অ্যাকাউন্ট আছে? <Link href="/signin">সাইন ইন করুন</Link></p>
    </AuthLayout>
  );
}

export function SignInPage() {
  return <Suspense fallback={<AuthLoading />}><SignInForm /></Suspense>;
}

export function SignUpPage() {
  return <SignUpForm />;
}

export function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) router.replace("/signin?callbackUrl=%2Fprofile");
  }, [isPending, router, session]);

  if (isPending || !session) return <AuthLoading />;

  return (
    <section className="section profile-page">
      <div className="container">
        <Link className="back-link" href="/">← হোম পেজে ফিরুন</Link>
        <div className="profile-card">
          <div className="profile-avatar">{(session.user.name || "ব").charAt(0).toUpperCase()}</div>
          <span className="section-kicker">আপনার অ্যাকাউন্ট</span>
          <h1>আমার প্রোফাইল</h1>
          <dl className="profile-details">
            <div><dt>নাম</dt><dd>{session.user.name}</dd></div>
            <div><dt>ইমেইল</dt><dd>{session.user.email}</dd></div>
          </dl>
          <Link className="button button--primary" href="/profile/update">তথ্য আপডেট করুন</Link>
        </div>
      </div>
    </section>
  );
}

export function UpdateProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isPending && !session) router.replace("/signin?callbackUrl=%2Fprofile%2Fupdate");
  }, [isPending, router, session]);

  if (isPending || !session) return <AuthLoading />;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    if (!name) {
      toast.error("আপনার নাম লিখুন।");
      return;
    }
    setSubmitting(true);
    try {
      const result = await authClient.updateUser({ name: name.trim() });
      if (result.error) {
        toast.error(result.error.message ?? "তথ্য আপডেট করা যায়নি।");
        return;
      }
      toast.success("আপনার তথ্য আপডেট হয়েছে");
      router.push("/profile");
      router.refresh();
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error("তথ্য আপডেট করা যায়নি।");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="section profile-page">
      <div className="container">
        <div className="profile-card">
          <Link className="back-link" href="/profile"><ArrowLeft size={16} /> প্রোফাইলে ফিরুন</Link>
          <span className="section-kicker">ব্যক্তিগত তথ্য</span>
          <h1>নাম আপডেট করুন</h1>
          <p>আপনার প্রোফাইলে দেখানো নামটি পরিবর্তন করুন।</p>
          <form className="auth-form" onSubmit={submit}>
            <label className="form-field">
              <span>আপনার নাম</span>
              <span className="input-wrap"><UserRound aria-hidden="true" size={18} /><input autoComplete="name" defaultValue={session.user.name || ""} name="name" placeholder="আপনার নাম" /></span>
            </label>
            <button className="button button--primary button--large auth-submit" disabled={submitting} type="submit">
              {submitting ? <><LoaderCircle className="spin" size={18} /> আপডেট হচ্ছে…</> : "তথ্য আপডেট করুন"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
