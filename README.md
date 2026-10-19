# شغلني (Shaghalni) — Landing Website

الموقع التعريفي والتسويقي الرسمي لخدمة **شغلني** — المساعد الذكي على واتساب وتيليجرام لمساعدة الباحثين عن عمل في إعداد ملفات تقديم احترافية ومخصصة لكل وظيفة.

---

## المزايا والتقنيات (Tech Stack)

- **إطار العمل**: [Next.js](https://nextjs.org/) (App Router) + TypeScript Strict
- **التصميم وتنسيق الأنماط**: [Tailwind CSS v4](https://tailwindcss.com/) بدعم كامل للخصائص المنطقية (RTL / LTR)
- **إدارة اللغات والترجمة (i18n)**: [next-intl](https://next-intl-docs.vercel.app/) (العربية هي اللغة الافتراضية، الإنجليزية لغة ثانوية)
- **الخطوط**: `IBM Plex Sans Arabic` للعربية، و `Plus Jakarta Sans` للإنجليزية
- **الأيقونات**: [lucide-react](https://lucide.dev/)
- **النماذج والتحقق**: [Zod](https://zod.dev/) للتحقق المتطابق في العميل والخادم
- **مكافحة البريد العشوائي**: حقل التمويه (Honeypot) + دعم Cloudflare Turnstile
- **إرسال البريد الإلكتروني**: [Resend](https://resend.com/)
- **التحليلات**: دعم [Plausible Analytics](https://plausible.io/) بدون ملفات تعريف ارتباط (Cookieless)

---

## متطلبات التشغيل والبدء (Getting Started)

1. **تثبيت الاعتماديات**:
   ```bash
   npm install
   ```

2. **إعداد متغيرات البيئة**:
   قم بنسخ ملف `.env.example` إلى `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   واضبط القيم المطلوبة (أرقام التواصل، مفاتيح Resend و Turnstile).

3. **تشغيل خادم التطوير**:
   ```bash
   npm run dev
   ```
   افتح المتصفح على [http://localhost:3000](http://localhost:3000) (سيتم التوجيه تلقائيًا إلى النسخة العربية `/ar`).

4. **بناء النسخة الإنتاجية (Production Build)**:
   ```bash
   npm run build
   ```

5. **التحقق من تطابق مفاتيح الترجمة (i18n Check)**:
   ```bash
   npm run check:i18n
   ```

---

## هيكل المجلدات (Project Structure)

```text
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx              # تخطيط الصفحات، الخطوط، والاتجاه lang/dir
│   │   ├── page.tsx                # الصفحة الرئيسية (جميع الأقسام)
│   │   ├── contact/page.tsx        # صفحة التواصل وقنوات الدعم
│   │   ├── privacy/page.tsx        # سياسة الخصوصية
│   │   ├── terms/page.tsx          # الشروط والأحكام
│   │   ├── not-found.tsx           # صفحة الخطأ 404
│   │   ├── opengraph-image.tsx     # صورة مشاركة الروابط ديناميكيًا
│   │   └── twitter-image.tsx       # إعادة تصدير صورة تويتر
│   ├── api/contact/route.ts        # معالج إرسال نموذج التواصل والبريد
│   ├── sitemap.ts                  # خريطة الموقع لمحركات البحث
│   ├── robots.ts                   # ملف robots.txt
│   └── manifest.ts                 # بيان تطبيق الويب PWA
├── components/
│   ├── layout/                     # الرأس، التذييل، محوّل اللغة، القائمة وشريط CTA المتنقل
│   ├── sections/                   # أقسام الصفحة الرئيسية
│   ├── ui/                         # المكونات الأساسية (Button, Card, Accordion, Badge...)
│   └── chat/                       # إطار الهاتف ومحاكاة المحادثة التفاعلية
├── messages/
│   ├── ar.json                     # النصوص العربية (المصدر الأساسي)
│   └── en.json                     # النصوص الإنجليزية المطابقة
├── lib/
│   ├── links.ts                    # روابط واتساب وتيليجرام المجهزة
│   ├── seo.ts                      # مساعدات الميتا وبيانات JSON-LD المنظمة
│   ├── analytics.ts                # تتبع أحداث Plausible
│   ├── team.ts                     # بيانات أعضاء الفريق
│   └── contact-schema.ts           # مخطط التحقق Zod لنموذج التواصل
├── DECISIONS.md                    # توثيق القرارات وبنود TODO المعلقة للفريق
└── SHAGHALNI_SITE_SPEC.md          # المواصفة الكاملة للمشروع
```

---

## إدارة الترجمة وتعديل النصوص

- جميع النصوص الظاهرة للمستخدم مخزنة في ملفي `messages/ar.json` و `messages/en.json`.
- يمنع وضع نصوص مكتوبة يدويًا داخل المكونات البرمجية.
- للتأكد من تطابق المفاتيح قبل النشر، قم بتشغيل الأمر:
  ```bash
  npm run check:i18n
  ```
