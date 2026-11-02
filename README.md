# বাজার দর — BazarDor

বাজার দর বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের দৈনিক দাম, বাজারভিত্তিক তুলনা এবং দামের ওঠানামা এক জায়গায় দেখায়। মোবাইল, ট্যাবলেট ও ডেস্কটপে ব্যবহারযোগ্য বাংলা-প্রথম একটি বাজারদর অ্যাপ।

## প্রযুক্তি

- Next.js App Router, React, TypeScript
- Tailwind CSS 4 এবং responsive custom styles
- Better Auth (email/password, Google, GitHub)
- PostgreSQL (`pg`) for Better Auth
- React Hot Toast, Lucide React
- Programming Hero BazarDor API with two fallback API bases

## প্রধান ফিচার

1. আজ দাম বেড়েছে/কমেছে এমন পণ্যের তালিকা এবং চলমান বাজারদরের ticker।
2. প্রতিটি পণ্যের বাংলা দাম, পরিবর্তনের হার, ক্যাটাগরি ও এককসহ responsive card।
3. ক্যাটাগরি পেজে loading skeleton এবং Bengali-number-safe numeric price sorting।
4. সাইন ইন-সুরক্ষিত পণ্যের বিবরণ, সর্বনিম্ন/সর্বোচ্চ/গড় দাম ও বাজারভিত্তিক তুলনা।
5. Better Auth email/password ও Google/GitHub sign-in, signup, sign-out এবং protected-route redirect।
6. প্রোফাইল দেখা ও Better Auth দিয়ে নাম আপডেট।
7. অজানা route এবং invalid category/product-এর জন্য হোমে ফেরার CTA-সহ 404 state।
8. সব পেজে responsive layout, retryable API error state ও auth toast notification।

## চালানো

Node.js 20.9 বা তার পরের সংস্করণ প্রয়োজন।

```bash
npm install
Copy-Item .env.example .env.local
npm run dev
```

`.env.local`-এ PostgreSQL সংযোগ, Better Auth secret এবং প্রয়োজন হলে OAuth credentials যোগ করুন:

```dotenv
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=replace-with-a-random-secret-at-least-32-characters
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

Better Auth চালুর আগে configured database-এ Better Auth schema তৈরি করুন:

```bash
npx @better-auth/cli migrate
```

Google/GitHub sign-in সক্রিয় করতে সংশ্লিষ্ট OAuth credentials এবং provider console-এ `BETTER_AUTH_URL/api/auth/callback/google` বা `.../github` callback URL যোগ করুন। OAuth credentials না থাকলে email/password authentication ব্যবহার করা যাবে।

Database বা Better Auth secret অনুপস্থিত থাকলে sign-in/sign-up request স্পষ্ট configuration error (`503`) দেখায়; session check anonymous থাকে এবং public catalog কাজ করতে থাকে। Vercel-এও একই environment variables যোগ করুন এবং PostgreSQL-এ migration চালিয়ে deploy করুন। Next.js App Router-এ category ও product slug route ব্যবহৃত হওয়ায় refresh সরাসরি route-এই কাজ করে।
