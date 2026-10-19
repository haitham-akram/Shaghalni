# شغلني (Shaghalni) — Landing Website Build Spec

> **Audience:** an AI coding agent (or a junior dev) who knows nothing about this project.
> **Rule #1:** Follow this file literally. If something is not specified, pick the simplest option, and write it down in `DECISIONS.md`.
> **Rule #2:** Do not add features that are not in this file.

---

## 0. TL;DR

Build a **bilingual (Arabic default, English secondary) marketing website** for **شغلني**, an AI assistant that lives inside **WhatsApp** and **Telegram**. Users chat with it, share their CV and a job post, and it helps them prepare the right application files and apply.

- Framework: **Next.js (App Router) + TypeScript + Tailwind CSS + next-intl**
- Rendering: **static generation (SSG)**, not SSR. Metadata comes from `generateMetadata`.
- Primary goal of the site: **get the visitor to click "Start on WhatsApp" or "Start on Telegram".**
- Secondary goals: build trust (privacy, honesty), explain the product, give a way to contact the team.

---

## 1. Product Context (read this first)

| Item | Value |
|---|---|
| Product name (Arabic) | **شغلني** |
| Product name (Latin, use in URLs/code/English copy) | **Shaghalni** |
| What it is | An AI assistant inside WhatsApp and Telegram that helps people apply for jobs |
| What it does | Reads the user's CV, reads a job post, tailors the CV, writes a cover letter, suggests matching jobs, gives interview tips, answers questions |
| Where users meet it | WhatsApp bot, Telegram bot (no app download) |
| Primary language | Arabic (RTL), default |
| Secondary language | English (LTR) |
| Primary audience | Arabic-speaking job seekers: fresh graduates, career switchers, people applying to jobs abroad |
| Device | Mostly **mobile**. Design mobile-first. |

### 1.1 Honesty rules (IMPORTANT, legal and trust)

- **NEVER** write "we guarantee you a job" / "احصل على الوظيفة بالتأكيد" or anything that promises a job.
- Use: "apply faster", "apply with the right files", "increase your chances", "prepare a stronger application".
- Do **not** invent user numbers, testimonials, logos, or reviews. Use placeholders (see §14) clearly marked `TODO`.
- Do **not** claim features that are not listed in this file.

### 1.2 Placeholders the agent must NOT invent

Use environment variables / config constants for these and leave `TODO` values if unknown:

```
NEXT_PUBLIC_SITE_URL=https://shaghalni.example      # TODO real domain
NEXT_PUBLIC_WHATSAPP_NUMBER=000000000000            # TODO digits only, with country code, e.g. 970599123456
NEXT_PUBLIC_WHATSAPP_PREFILL_AR=مرحبا شغلني، أريد مساعدتي بالتقديم على وظيفة
NEXT_PUBLIC_WHATSAPP_PREFILL_EN=Hi Shaghalni, I want help applying for a job
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=shaghalni_bot     # TODO real bot username without @
NEXT_PUBLIC_CONTACT_EMAIL=hello@shaghalni.example   # TODO
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=                       # optional
RESEND_API_KEY=                                     # server only
CONTACT_TO_EMAIL=                                   # server only, where form messages go
CONTACT_FROM_EMAIL=                                 # server only, verified sender in Resend
TURNSTILE_SECRET_KEY=                               # server only
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
```

Channel links:

- WhatsApp: `https://wa.me/${NUMBER}?text=${encodeURIComponent(prefill)}`
- Telegram: `https://t.me/${BOT_USERNAME}?start=web`  (use `?start=web_ar` / `?start=web_en` to know the source language)

---

## 2. Tech Stack (exact)

| Concern | Choice |
|---|---|
| Framework | Next.js latest stable, **App Router**, TypeScript strict |
| Styling | Tailwind CSS (use **logical properties**, see §6) |
| i18n | `next-intl` |
| Fonts | `next/font/google`: **IBM Plex Sans Arabic** (Arabic), **Plus Jakarta Sans** (Latin) |
| Icons | `lucide-react` |
| Animation | CSS + `framer-motion` only where specified (hero chat demo). Respect `prefers-reduced-motion`. |
| Forms | Server Action or Route Handler + `zod` validation |
| Email | Resend |
| Anti-spam | Cloudflare Turnstile + honeypot field |
| Analytics | Plausible (or Umami). No Google Analytics, no cookie banner needed if no cookies. |
| QR code | `qrcode.react` |
| Lint/format | ESLint + Prettier (with `prettier-plugin-tailwindcss`) |
| Package manager | pnpm (or npm if pnpm unavailable) |
| Deploy | Vercel |

**Do not** add a CMS, database, auth, or payments. Not needed.

---

## 3. Project Structure

```
/
├─ app/
│  ├─ [locale]/
│  │  ├─ layout.tsx              # <html lang dir>, fonts, providers, header/footer
│  │  ├─ page.tsx                # landing page (all sections)
│  │  ├─ contact/page.tsx
│  │  ├─ privacy/page.tsx
│  │  ├─ terms/page.tsx
│  │  ├─ not-found.tsx
│  │  ├─ opengraph-image.tsx     # localized OG image
│  │  └─ twitter-image.tsx       # optional: re-export of OG
│  ├─ api/contact/route.ts       # (if not using server action)
│  ├─ sitemap.ts
│  ├─ robots.ts
│  └─ manifest.ts
├─ components/
│  ├─ layout/ (Header, Footer, LanguageSwitcher, MobileMenu, StickyCtaBar)
│  ├─ sections/ (Hero, HowItWorks, Features, ChatDemo, Audience, Privacy, About, Faq, FinalCta)
│  ├─ ui/ (Button, ChannelButton, Card, Section, Container, Accordion, Badge)
│  └─ chat/ (PhoneFrame, ChatBubble, ChatScript)
├─ i18n/
│  ├─ routing.ts                 # locales, defaultLocale
│  ├─ request.ts
│  └─ navigation.ts              # Link, redirect, usePathname, useRouter from next-intl
├─ messages/
│  ├─ ar.json                    # SOURCE OF TRUTH
│  └─ en.json
├─ lib/
│  ├─ links.ts                   # whatsappUrl(locale), telegramUrl(locale)
│  ├─ seo.ts                     # metadata helpers
│  └─ analytics.ts               # track(eventName)
├─ public/ (favicon, icons, images)
├─ middleware.ts                 # next-intl middleware
├─ DECISIONS.md
└─ README.md
```

---

## 4. Internationalization (i18n)

### 4.1 Locales

- Locales: `ar` (default), `en`.
- URL strategy: **always prefix** → `/ar`, `/en`. Root `/` redirects to `/ar`.
- **Do not auto-redirect by IP.** Only use the saved choice (cookie `NEXT_LOCALE`, set by next-intl when user switches) or the default `ar`. Do not use `Accept-Language` detection to override `ar` (set `localeDetection: false`).

### 4.2 `i18n/routing.ts`

```ts
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['ar', 'en'],
  defaultLocale: 'ar',
  localePrefix: 'always',
  localeDetection: false,
});
```

### 4.3 `<html>` setup

In `app/[locale]/layout.tsx`:

```tsx
const dir = locale === 'ar' ? 'rtl' : 'ltr';
<html lang={locale} dir={dir} className={`${arabicFont.variable} ${latinFont.variable}`}>
```

Use `setRequestLocale(locale)` in layouts and pages, and export `generateStaticParams` returning both locales so pages stay **static**.

### 4.4 Rules for translations

- **Arabic is written first and natively**, not translated from English. English is the adapted version.
- Arabic tone: **simple Modern Standard Arabic with a friendly feel**. Avoid heavy dialect, avoid stiff legal language in marketing sections.
- Every user-visible string lives in `messages/{ar,en}.json`. **No hard-coded text in components.**
- Both JSON files must have **identical keys**. Add a script `pnpm check:i18n` that fails if keys differ.
- Numbers: use Western digits (0-9) in both languages for consistency with phone numbers and the product UI.
- Product name: write **شغلني** in Arabic text and **Shaghalni** in English text. In English copy you may write `Shaghalni (شغلني)` once in the hero.

### 4.5 Language switcher

- Located in the header (desktop) and inside the mobile menu.
- Label: in Arabic page show `English`, in English page show `العربية`. Use `lang` attribute on the label.
- Uses next-intl `Link` with `locale` prop so it stays on the same page (e.g. `/ar/contact` ↔ `/en/contact`).

---

## 5. RTL / LTR Rules (critical)

1. **Use Tailwind logical utilities only.** Never use `left/right` based classes for layout.

   | Don't | Do |
   |---|---|
   | `ml-4` `mr-4` | `ms-4` `me-4` |
   | `pl-4` `pr-4` | `ps-4` `pe-4` |
   | `text-left` `text-right` | `text-start` `text-end` |
   | `left-0` `right-0` | `start-0` `end-0` |
   | `border-l` `border-r` | `border-s` `border-e` |
   | `rounded-l-lg` | `rounded-s-lg` |

2. **Icons that imply direction** (arrows, chevrons) must be flipped in RTL: add `rtl:-scale-x-100`.
3. **Chat bubbles:** user messages align to `end`, bot messages to `start`, in both languages (mirrors naturally).
4. **Phone numbers, URLs, email addresses** inside Arabic text: wrap in `<bdi>` or `<span dir="ltr">`.
5. **Do not** letter-space Arabic text. `tracking-*` classes must not apply to Arabic (set `letter-spacing: 0` for `[lang=ar]`).
6. **No italic** and no uppercase transforms for Arabic.
7. Test every section in both directions at widths 360, 390, 768, 1024, 1440.

---

## 6. Design System

### 6.1 Color tokens

Define as CSS variables, map in Tailwind config. Support **light theme only** for v1 (dark sections allowed as design accents).

| Token | Hex | Use |
|---|---|---|
| `--bg` | `#FAF8F4` | page background (warm off-white) |
| `--surface` | `#FFFFFF` | cards |
| `--ink` | `#14172B` | main text |
| `--ink-muted` | `#555A74` | secondary text (check contrast ≥ 4.5:1 on `--bg`) |
| `--primary` | `#3D3AF0` | main brand, buttons, links |
| `--primary-hover` | `#2F2CD1` | hover |
| `--primary-soft` | `#ECECFE` | soft tinted backgrounds |
| `--accent` | `#F5A524` | highlights, badges, small success moments. **Use sparingly.** |
| `--night` | `#0E1022` | dark sections (Privacy, Final CTA) |
| `--border` | `#E6E2D9` | borders/dividers |
| `--whatsapp` | `#25D366` | **only** WhatsApp button / icon |
| `--telegram` | `#229ED9` | **only** Telegram button / icon |
| `--danger` | `#D92D20` | form errors |
| `--success` | `#12B76A` | form success |

Rules:

- Brand is **not** green or light blue. WhatsApp/Telegram colors appear only on channel buttons.
- Text on `--primary` is white. Verify contrast (WCAG AA). Text on WhatsApp green should be **dark ink** (`#0B2E1A`) or verify white passes; if not, use dark text.
- Accent saffron is never used for body text on white (fails contrast); use it for shapes, underlines, badges with dark text.

### 6.2 Typography

- Arabic: **IBM Plex Sans Arabic** weights 400, 500, 600, 700.
- Latin: **Plus Jakarta Sans** weights 400, 500, 600, 700.
- Set `font-family` by locale: `[lang=ar]` uses Arabic font first; `[lang=en]` uses Latin font first. Always include a system fallback stack.
- Arabic needs more line height. Scale:

| Style | Size (mobile → desktop) | Weight | Line height AR | Line height EN |
|---|---|---|---|---|
| Display (hero H1) | 36 → 64px | 700 | 1.35 | 1.1 |
| H2 | 28 → 44px | 700 | 1.4 | 1.15 |
| H3 | 20 → 24px | 600 | 1.5 | 1.3 |
| Body | 16 → 18px | 400 | 1.85 | 1.6 |
| Small | 14px | 400 | 1.7 | 1.5 |

- Max line length for paragraphs: `max-w-prose` (~65ch).
- Minimum body size on mobile: **16px**.

### 6.3 Spacing, radius, shadow

- Section vertical padding: `py-16` mobile, `py-24` desktop.
- Container: `max-w-6xl mx-auto px-5 md:px-8`.
- Radius: cards `rounded-2xl`, buttons `rounded-xl`, chips `rounded-full`.
- Shadow: one soft shadow only: `0 8px 30px rgba(20,23,43,0.08)`.
- Grid: 12 columns desktop, single column mobile.

### 6.4 Buttons

- **Primary:** indigo bg, white text, `h-12 px-6`, semi-bold.
- **Secondary:** white bg, ink text, 1px border.
- **ChannelButton (WhatsApp / Telegram):** brand color bg, official-style icon (use simple inline SVG), label text. Height ≥ 48px (touch target).
- Focus ring: 2px `--primary` with 2px offset, always visible on keyboard focus.

### 6.5 Visual style

- Clean, warm, friendly, professional. Lots of whitespace.
- **No stock photos of handshakes, robots, glowing brains, or random office people.**
- Show the product: **phone mockups with real chat conversations** (built in HTML/CSS, not images, so they are crisp and translatable).
- Decorative element: soft indigo blobs / a subtle dotted grid in hero background. Keep it light.
- Logo (v1): text wordmark "شغلني" in bold Arabic font with a small saffron dot/underline accent. TODO: replace when the team has a real logo. Make the Logo a component so swapping is easy.

---

## 7. Pages and Sections

### 7.1 Global layout

**Header** (sticky, blurred background):
- Start side: logo
- Center/end (desktop): nav links → *How it works*, *Features*, *Privacy*, *About*, *FAQ*, *Contact*
- End: language switcher + primary button "ابدأ الآن" / "Get started" (scrolls to hero CTA or opens a small dropdown with the two channels)
- Mobile: logo + language switcher + hamburger → full-screen menu
- Nav links on landing page are **anchor links** (`/#how`), on other pages they go back to `/{locale}#how`.

**Footer** (dark `--night`):
- Logo + one-line description
- Links: Privacy, Terms, Contact
- Channel buttons (small)
- Language switcher
- © {year} شغلني

**StickyCtaBar (mobile only, < md):**
- Fixed bottom bar with two buttons side by side: WhatsApp and Telegram.
- Appears after the user scrolls past the hero's CTA buttons (IntersectionObserver). Hides on `/contact` page and when the mobile menu is open.
- Add `padding-bottom: env(safe-area-inset-bottom)`.
- Add bottom padding to the page body so the bar never covers content.

### 7.2 Landing page `/[locale]` — section order

Each section has an `id` for anchor links. Use a `<Section>` component for consistent spacing.

#### Section 1: Hero (`id="hero"`)

Layout: desktop two columns (text on the start side, phone mockup on the end side); mobile stacked (text first, phone after).

Content:
- Small badge: "مساعدك الذكي للتقديم على الوظائف على واتساب وتيليجرام" / "Your AI job-application assistant on WhatsApp & Telegram"
- H1 (AR): **قدّم على الوظائف بملفات أقوى، وبسرعة، من محادثة واحدة**
- H1 (EN): **Apply to jobs with stronger files, faster, from one chat**
- Subtext (AR): شغلني مساعد ذكي يقرأ سيرتك الذاتية والوظيفة التي تريدها، ويجهّز لك ملفات التقديم المناسبة. بدون تطبيق وبدون تعقيد، فقط ابعث رسالة.
- Subtext (EN): Shaghalni is an AI assistant that reads your CV and the job you want, then prepares the right application files for you. No app, no hassle, just send a message.
- Two ChannelButtons: "ابدأ على واتساب" / "Start on WhatsApp" and "ابدأ على تيليجرام" / "Start on Telegram"
- Under buttons, a small reassurance line with a lock icon: "مجاني للبدء • بياناتك محمية" / "Free to start • Your data is protected" — **only include "Free to start" if the team confirms it; otherwise use "No app to install • Your data is protected"** (add a `TODO` in DECISIONS.md).
- Desktop only: small QR code card "امسح الكود لفتح شغلني على هاتفك" / "Scan to open Shaghalni on your phone" (QR encodes the WhatsApp link).
- Phone mockup on the end side showing the animated chat (see §8).

#### Section 2: How it works (`id="how"`)

H2 (AR): **كيف يعمل شغلني؟** / (EN): **How does Shaghalni work?**
Three numbered steps, horizontal on desktop, vertical on mobile with a connecting line (use logical properties so the line flips in RTL):

1. **ابعث رسالة** / Send a message. افتح واتساب أو تيليجرام وابدأ المحادثة مع شغلني. / Open WhatsApp or Telegram and start chatting with Shaghalni.
2. **شارك سيرتك والوظيفة** / Share your CV and the job. ارفع سيرتك الذاتية وأرسل رابط الوظيفة أو نصها. / Upload your CV and send the job link or text.
3. **استلم ملفاتك جاهزة** / Get your files ready. يجهّز لك سيرة ذاتية معدّلة ورسالة تقديم تناسب الوظيفة، وتراجعها قبل الإرسال. / It prepares a tailored CV and cover letter for the job, and you review them before sending.

Each step: number badge (saffron), icon, title, text.

#### Section 3: Features (`id="features"`)

H2 (AR): **ماذا يفعل شغلني لأجلك؟** / (EN): **What does Shaghalni do for you?**
Grid of 6 cards (1 col mobile, 2 col tablet, 3 col desktop). Icon (lucide) + title + 1-2 lines:

| # | Icon | AR title | AR text | EN title | EN text |
|---|---|---|---|---|---|
| 1 | `FileText` | تعديل السيرة الذاتية | يعدّل سيرتك لتناسب كل وظيفة، ويبرز مهاراتك الأهم. | CV tailoring | Adapts your CV to each job and highlights your most relevant skills. |
| 2 | `Mail` | رسائل تقديم جاهزة | يكتب لك رسالة تقديم مناسبة للوظيفة وللشركة. | Cover letters | Writes a cover letter that fits the role and the company. |
| 3 | `Search` | ترشيح الوظائف | يساعدك على فهم أي الوظائف تناسب خبرتك. | Job matching | Helps you understand which jobs fit your experience. |
| 4 | `MessagesSquare` | تحضير للمقابلات | أسئلة متوقعة وتدريب على الإجابات قبل المقابلة. | Interview prep | Likely questions and practice answers before your interview. |
| 5 | `Languages` | عربي وإنجليزي | تواصل وجهّز ملفاتك بالعربية أو الإنجليزية. | Arabic & English | Chat and prepare your files in Arabic or English. |
| 6 | `Smartphone` | بدون تطبيق | كل شيء داخل واتساب أو تيليجرام، تطبيقات تستخدمها أصلًا. | No app needed | Everything happens inside WhatsApp or Telegram, apps you already use. |

> ⚠️ Only keep cards that the product really supports. Mark in `DECISIONS.md` that the team must confirm features 3 and 4.

#### Section 4: Live chat demo (`id="demo"`)

H2 (AR): **شاهد شغلني وهو يعمل** / (EN): **See Shaghalni in action**
Large phone mockup with a scripted conversation (see §8). Beside it (desktop) a short list of 3 bullet points explaining what's happening. Include a "Replay" button.

#### Section 5: Who it's for (`id="audience"`)

H2 (AR): **لمن صُمم شغلني؟** / (EN): **Who is Shaghalni for?**
Three cards:
- **الخريجون الجدد** / Fresh graduates: أول سيرة ذاتية؟ لا تقلق، سنرتّبها معك. / Your first CV? We'll shape it together.
- **من يغيّر مساره المهني** / Career switchers: اعرض خبرتك بطريقة تناسب المجال الجديد. / Present your experience for your new field.
- **من يتقدم لوظائف خارج بلده** / People applying abroad: جهّز ملفات تناسب معايير الدول والشركات. / Prepare files that fit each country's and company's standards.

#### Section 6: Privacy & trust (`id="privacy"`) — dark section (`--night`)

H2 (AR): **بياناتك أمانة عندنا** / (EN): **Your data is safe with us**
Intro: يشارك المستخدمون معنا سيرهم الذاتية وبياناتهم الشخصية، ونتعامل معها بجدية.

4 trust points (icon + text) — **the team must confirm each one is true before launch** (add TODO in `DECISIONS.md`):
1. نستخدم بياناتك فقط لتجهيز طلبات التقديم الخاصة بك. / We use your data only to prepare your applications.
2. لا نبيع بياناتك لأي طرف. / We never sell your data.
3. يمكنك طلب حذف بياناتك في أي وقت. / You can request deletion of your data at any time.
4. نحمي الملفات بالتشفير والتخزين الآمن. / Files are protected with encryption and secure storage.

Link button: "اقرأ سياسة الخصوصية" / "Read our privacy policy" → `/privacy`.

#### Section 7: About us (`id="about"`)

H2 (AR): **من نحن** / (EN): **About us**
- Short story (3-4 sentences). Draft: (AR) نحن فريق صغير من المطورين يؤمن أن التقديم على وظيفة جيدة لا يجب أن يكون معقدًا أو مكلفًا. بنينا شغلني ليكون بجانبك في كل خطوة، من ترتيب سيرتك حتى الاستعداد للمقابلة. / (EN) We are a small team of builders who believe applying for a good job shouldn't be complicated or expensive. We built Shaghalni to stand beside you at every step, from polishing your CV to preparing for the interview.
- Mission line (big quote style): (AR) «أن يجد كل باحث عن عمل فرصته بثقة.» / (EN) "Help every job seeker go after their chance with confidence."
- Team grid: photo (circle), name, role, optional links. Data lives in `lib/team.ts` as an array with `TODO` placeholders. Photos optional; fallback to initials avatar.
- Replace the draft story with the team's real one when available (note in `DECISIONS.md`).

#### Section 8: FAQ (`id="faq"`)

Accessible accordion (`<details>` or button with `aria-expanded`). Questions:

1. هل شغلني مجاني؟ / Is Shaghalni free? → **TODO: team to provide pricing answer.** Placeholder: "يمكنك البدء الآن. سنوضح الخطط هنا عند الإطلاق." / "You can start now. We'll share plans here at launch."
2. هل أحتاج لتحميل تطبيق؟ / Do I need to download an app? → لا، يعمل داخل واتساب وتيليجرام. / No, it works inside WhatsApp and Telegram.
3. ما اللغات المدعومة؟ / Which languages are supported? → العربية والإنجليزية. / Arabic and English.
4. هل يضمن لي وظيفة؟ / Does it guarantee me a job? → لا أحد يستطيع ضمان ذلك. شغلني يساعدك على تقديم طلب أقوى وأسرع، والقرار النهائي لصاحب العمل. / No one can guarantee that. Shaghalni helps you submit a stronger, faster application; the final decision is the employer's.
5. هل بياناتي آمنة؟ / Is my data safe? → (short answer + link to privacy page)
6. هل يقدّم على الوظائف نيابةً عني؟ / Does it apply for me? → **TODO: team to confirm.** Placeholder: "يجهّز لك الملفات وتراجعها أنت قبل الإرسال." / "It prepares your files and you review them before sending."
7. ما أنواع الوظائف التي يدعمها؟ / What kinds of jobs does it support? → **TODO: team to confirm.**
8. كيف أتواصل مع الفريق؟ / How do I contact the team? → link to `/contact`.

Add **FAQPage JSON-LD** structured data built from the same translation strings.

#### Section 9: Final CTA + footer

Dark or indigo block. H2 (AR): **جاهز تبدأ؟ ابعث رسالة الآن** / (EN): **Ready to start? Send a message now.** Two ChannelButtons.

---

### 7.3 Contact page `/[locale]/contact`

Purpose: support, partnerships, feedback. **Not** the main CTA.

Layout: two columns desktop (form on one side, direct channels on the other), stacked on mobile.

**Direct channels card:** WhatsApp button, Telegram button, email (`mailto:`), a line "نرد عادةً خلال ... " (TODO team: response time; omit if unknown).

**Form fields:**

| Field | Type | Rules |
|---|---|---|
| name | text | required, 2–80 chars |
| email | email | required, valid |
| topic | select | options: Support / Partnership / Feedback / Other (translated) |
| message | textarea | required, 10–2000 chars |
| consent | checkbox | required: "أوافق على معالجة بياناتي للرد على رسالتي" + link to privacy |
| website | text | **honeypot**, hidden via CSS (not `display:none` only; use off-screen + `tabindex=-1` + `autocomplete=off`). If filled → silently succeed without sending. |
| turnstile token | hidden | verified server-side |

**Behavior:**
- Client + server validation with the **same zod schema** (put it in `lib/contact-schema.ts`).
- Error messages translated and shown under each field, `aria-describedby` wired.
- Submit button shows a loading state; disable while sending.
- On success: replace form with a success message; on failure: show a friendly error and the direct email as fallback.
- Server: verify Turnstile → rate-limit (simple in-memory or Upstash if available; at minimum 5 req/10 min per IP) → send email via Resend to `CONTACT_TO_EMAIL` with `reply-to` = sender's email → return JSON.
- **Never** log message contents. Never expose API keys to the client.

### 7.4 Privacy page `/[locale]/privacy` and Terms page `/[locale]/terms`

- Simple long-form pages in a readable layout (`max-w-prose`, headings, table of contents optional).
- Content: **placeholders written clearly with `TODO: legal review`**. Draft headings for privacy: What we collect, Why we collect it, How long we keep it, Who we share it with, Your rights (access, deletion), Security, Contact.
- Include "Last updated" date, driven by a constant.
- ⚠️ Add a visible note in `DECISIONS.md`: *these pages are drafts and must be reviewed by someone qualified before launch.*

### 7.5 404 page

Friendly message + button to home + the two channel buttons. Localized.

---

## 8. Chat Demo Component (hero + demo section)

Build **in HTML/CSS**, no images.

### 8.1 Components

- `PhoneFrame`: rounded device frame, notch, status bar, chat header (avatar "ش", name "شغلني" / "Shaghalni", status "متصل" / "online").
- `ChatBubble`: props `from: 'user' | 'bot'`, `children`, optional `attachment` (file chip: icon + filename), optional `time`.
- `ChatScript`: takes an array of messages and plays them one by one.

### 8.2 Behavior

- Plays: typing indicator (three dots, ~900ms) → bot message appears → short pause → next.
- Auto-plays when scrolled into view (IntersectionObserver), plays **once**; "Replay" button restarts.
- `prefers-reduced-motion`: show the **full conversation immediately**, no animation.
- Wrap in `aria-hidden="true"` with a visually hidden text summary for screen readers (the conversation is decorative).
- Bubble colors: user = `--primary-soft` with ink text; bot = white with border. Do not copy the WhatsApp UI exactly (avoid trademark issues); keep it generic.

### 8.3 Script (put in messages JSON as arrays)

Arabic:

1. user: مرحبا، أريد التقديم على وظيفة مطوّر ويب
2. bot: أهلًا بك! أنا شغلني 👋 ارفع سيرتك الذاتية وأرسل لي رابط الوظيفة.
3. user: 📎 CV_Ahmad.pdf
4. user: https://jobs.example.com/frontend-dev
5. bot: قرأت سيرتك والوظيفة. 3 مهارات مطلوبة موجودة عندك، وسأبرزها في الأعلى. سأجهّز لك الآن سيرة معدّلة ورسالة تقديم.
6. bot: جاهزة ✅ 📎 CV_Ahmad_Frontend.pdf 📎 Cover_Letter.pdf — راجعها وأخبرني إن أردت أي تعديل.
7. user: رائع، شكرًا!

English: same flow, natural wording (not literal translation).

> Use a fictional name/URL clearly (`example.com`). Do not show real company names.

---

## 9. SEO

All via the Metadata API, localized per page.

### 9.1 `generateMetadata` per page

- `title`: unique per page and locale. Template: `%s | شغلني` (AR) / `%s | Shaghalni` (EN).
- `description`: 140–160 chars, localized.
- `alternates`: `canonical` = current locale URL; `languages`: `{ ar: '/ar', en: '/en', 'x-default': '/ar' }` (use full absolute URLs via `metadataBase`).
- `openGraph`: `type: 'website'`, `locale` (`ar_AR`/`en_US`), `alternateLocale`, `siteName`, `url`, `images` (auto from `opengraph-image.tsx`).
- `twitter`: `card: 'summary_large_image'`.
- `robots`: index, follow (except non-production → noindex; use `VERCEL_ENV !== 'production'` check).

Suggested copy:
- Home AR title: `شغلني | مساعدك الذكي للتقديم على الوظائف عبر واتساب وتيليجرام`
- Home AR description: `شغلني مساعد ذكي على واتساب وتيليجرام يجهّز سيرتك الذاتية ورسالة التقديم المناسبة لكل وظيفة. ابدأ الآن بدون تحميل أي تطبيق.`
- Home EN title: `Shaghalni | AI job application assistant on WhatsApp & Telegram`
- Home EN description: `Shaghalni is an AI assistant on WhatsApp and Telegram that tailors your CV and cover letter to each job. Start now, no app to download.`

### 9.2 Other SEO files

- `app/sitemap.ts`: all pages × both locales, with `alternates.languages`.
- `app/robots.ts`: allow all in production, disallow in preview; link the sitemap.
- `app/manifest.ts`: name, short_name, theme_color `#3D3AF0`, background `#FAF8F4`, icons.
- **JSON-LD** (inject as `<script type="application/ld+json">`):
  - `Organization` (name, url, logo, contactPoint)
  - `WebSite`
  - `FAQPage` (from the FAQ strings)
  - Optionally `SoftwareApplication`/`Service` describing the bot (no fake ratings!).
- Semantic HTML: one `<h1>` per page, headings in order, `<main>`, `<nav>`, `<footer>`, `alt` text on all meaningful images.

### 9.3 OG images (`opengraph-image.tsx`)

- 1200×630, generated with `ImageResponse`.
- Localized: Arabic version renders Arabic text. **The Arabic font file must be loaded explicitly** inside the handler (fetch the TTF from `/public/fonts/` and pass to `ImageResponse`), otherwise Arabic text will break. RTL handling inside satori can be tricky: **test it**. If Arabic shaping fails, fall back to a pre-designed static PNG per locale in `/public/og/`.
- Design: indigo background, wordmark, tagline, small chat bubbles. Keep text large and legible when shown small in WhatsApp/Telegram link previews.
- Test with the Telegram and WhatsApp link previews (links are mostly shared there).

---

## 10. Analytics and Events

Plausible custom events (via `lib/analytics.ts` → `window.plausible`):

| Event | When | Props |
|---|---|---|
| `cta_whatsapp` | click on any WhatsApp button | `{ location: 'hero' \| 'sticky' \| 'footer' \| 'final' \| 'contact', locale }` |
| `cta_telegram` | click on any Telegram button | same |
| `lang_switch` | language switched | `{ from, to }` |
| `contact_submit` | form sent successfully | `{ topic }` |
| `faq_open` | FAQ item opened | `{ id }` |
| `demo_replay` | replay clicked | none |

Never send personal data (name, email, message) to analytics. No cookies → no cookie banner required (still mention in privacy page).

---

## 11. Accessibility Checklist (must pass)

- Color contrast WCAG AA for all text.
- All interactive elements reachable by keyboard; visible focus ring.
- Touch targets ≥ 44×44px.
- `lang` and `dir` correct on `<html>`; use `lang="en"` on any English snippets inside Arabic pages and vice versa.
- Skip link: "تخطَّ إلى المحتوى" / "Skip to content".
- Accordion/menu with proper ARIA (`aria-expanded`, `aria-controls`).
- Form labels linked to inputs; errors announced (`aria-live="polite"`).
- Decorative chat demo hidden from screen readers with a text alternative.
- Respect `prefers-reduced-motion`.
- Run Lighthouse + axe; fix everything critical.

---

## 12. Performance Targets

- Lighthouse (mobile): Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.
- LCP < 2.5s, CLS < 0.1, INP < 200ms.
- Use `next/font` with `display: 'swap'` and **subset only needed weights** (Arabic + Latin subsets).
- Use `next/image` for any photos; set `width/height`; `priority` only on the hero if it has an image.
- No heavy JS: `framer-motion` only in the chat demo component, loaded with `dynamic()` (`ssr: false` not needed unless it causes issues).
- Keep the first-load JS small; check with `next build` output.

---

## 13. Security

- All secrets in env vars, never committed. Provide `.env.example`.
- Contact route: validate input with zod, verify Turnstile, rate-limit, escape/sanitize any HTML in the email (send as plain text).
- Security headers in `next.config.ts` (`X-Content-Type-Options`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`, basic `Permissions-Policy`). Add a CSP only if it doesn't break Plausible/Turnstile/fonts.
- External links to WhatsApp/Telegram: `rel="noopener noreferrer"` and `target="_blank"`.

---

## 14. Content Placeholders & Open Questions for the Team

The agent must **list these in `DECISIONS.md`** and leave `TODO` markers in code/messages. Do not invent answers.

1. Real domain name
2. WhatsApp business number and Telegram bot username
3. Pricing / is it free? (FAQ #1, hero reassurance line)
4. Confirm every feature card is real (esp. Job matching, Interview prep)
5. Does the bot apply on the user's behalf, or only prepare files? (FAQ #6)
6. Supported job types/countries (FAQ #7)
7. Confirm the privacy claims in §7.2 Section 6 (no selling data, deletion on request, encryption)
8. Team members: names, roles, photos, links
9. Real "about us" story and mission
10. Logo and brand assets
11. Contact email and response time
12. Legal review of Privacy + Terms

---

## 15. Build Plan (do in this order, commit after each step)

**Phase 1: Foundation**
1. `create-next-app` (TypeScript, Tailwind, App Router, ESLint, `src/` not used).
2. Install: `next-intl`, `lucide-react`, `framer-motion`, `zod`, `qrcode.react`, `resend`, prettier + tailwind plugin.
3. Set up i18n (`routing.ts`, `request.ts`, `navigation.ts`, `middleware.ts`), `app/[locale]/layout.tsx` with correct `lang`/`dir`, fonts, and `generateStaticParams`.
4. Add design tokens (CSS variables + Tailwind theme), typography rules, `.env.example`.
5. Build UI primitives: `Container`, `Section`, `Button`, `ChannelButton`, `Card`, `Badge`, `Accordion`.
6. Build `Header`, `Footer`, `LanguageSwitcher`, `MobileMenu`, `StickyCtaBar`.
✅ Check: `/ar` and `/en` render an empty page with header/footer, correct direction, switcher works.

**Phase 2: Content (Arabic first)**
7. Write `messages/ar.json` completely, then `messages/en.json`. Add `check:i18n` script.
8. Build sections in order: Hero (with chat demo), How it works, Features, Demo, Audience, Privacy, About, FAQ, Final CTA.
✅ Check: every section looks right in both languages at 360px and 1440px.

**Phase 3: Pages**
9. Contact page + API/server action + Turnstile + Resend.
10. Privacy and Terms pages (drafts), 404 page.
✅ Check: the form works end to end with real env vars in a test project.

**Phase 4: SEO + analytics**
11. `generateMetadata` for all pages, hreflang, sitemap, robots, manifest, JSON-LD, OG images (test Arabic rendering).
12. Plausible + event tracking.

**Phase 5: Quality**
13. Accessibility pass (axe + manual keyboard test), performance pass (Lighthouse mobile), cross-browser (Chrome, Safari iOS, Samsung Internet).
14. RTL visual QA of every component (mirrored icons, alignment, margins).
15. Write `README.md` (how to run, env vars, how to edit translations) and `DECISIONS.md`.

**Phase 6: Deploy**
16. Deploy on Vercel, set env vars, add domain, verify `https://domain/ar` and `/en`, submit sitemap to Google Search Console.
17. Share links in WhatsApp and Telegram to verify previews.

---

## 16. Definition of Done

- [ ] `/ar` is the default; `/` redirects to `/ar`; `/en` works.
- [ ] Zero hard-coded user-facing strings; `check:i18n` passes.
- [ ] RTL and LTR both look correct; no physical `left/right` Tailwind classes remain (search the codebase).
- [ ] Hero CTAs open WhatsApp/Telegram correctly with prefilled text.
- [ ] Sticky mobile CTA bar works and never overlaps content.
- [ ] Chat demo plays once, can replay, respects reduced motion.
- [ ] Contact form validates, blocks spam, sends email, shows success/error states.
- [ ] Privacy/Terms pages exist (marked draft).
- [ ] Metadata, hreflang, sitemap, robots, manifest, JSON-LD, OG images done and tested.
- [ ] Lighthouse mobile targets met.
- [ ] Accessibility checklist passed.
- [ ] No fake numbers/testimonials/claims; all open questions listed in `DECISIONS.md`.
- [ ] `README.md` and `.env.example` complete.

---

## 17. Common Mistakes to Avoid

1. Using `ml-*`/`pl-*`/`text-left` and then wondering why RTL is broken.
2. Forgetting to load the Arabic font file in the OG image handler → broken/boxed Arabic in link previews.
3. Making the page dynamic by accident (using `headers()`/`cookies()` in layouts) → loses static generation. Keep pages static.
4. Auto-detecting language from IP/browser and overriding Arabic default.
5. Writing English first and machine-translating to Arabic. Write Arabic natively.
6. Using WhatsApp green or Telegram blue as the brand color.
7. Promising jobs or inventing statistics/testimonials.
8. Putting phone numbers/emails in Arabic text without `dir="ltr"`, which scrambles them.
9. Letting the sticky mobile bar cover the footer/content.
10. Shipping the contact form without spam protection.
11. Hard-coding the WhatsApp number in many places. Use `lib/links.ts` only.
12. Adding extra features "because it would be cool". Stick to this file.
