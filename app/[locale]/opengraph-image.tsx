import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function Image({ params }: Props) {
  const { locale } = await params;
  const isAr = locale === 'ar';

  const brand = isAr ? 'شغلني' : 'Shaghalni';
  const title = isAr
    ? 'قدّم على الوظائف بملفات أقوى، وبسرعة'
    : 'Apply to jobs with stronger files, faster';
  const subtitle = isAr
    ? 'مساعدك الذكي داخل واتساب وتيليجرام لتجهيز السيرة الذاتية والتقديم'
    : 'Your AI assistant on WhatsApp & Telegram for job applications';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: isAr ? 'flex-end' : 'flex-start',
          justifyContent: 'space-between',
          backgroundColor: '#5E56FA',
          backgroundImage:
            'radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.15) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(255, 255, 255, 0.1) 2%, transparent 0%)',
          backgroundSize: '100px 100px',
          padding: '70px 80px',
          color: '#FFFFFF',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexDirection: isAr ? 'row-reverse' : 'row',
          }}
        >
          <div
            style={{
              fontSize: '48px',
              fontWeight: 800,
              letterSpacing: '-1px',
              color: '#FFFFFF',
            }}
          >
            {brand}
          </div>
          <div
            style={{
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              backgroundColor: '#FB5A69',
            }}
          />
        </div>

        {/* Center Copy */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: isAr ? 'flex-end' : 'flex-start',
            gap: '20px',
            maxWidth: '950px',
            textAlign: isAr ? 'right' : 'left',
          }}
        >
          <div
            style={{
              fontSize: '54px',
              fontWeight: 700,
              lineHeight: 1.25,
              color: '#FFFFFF',
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: '26px',
              color: '#F0EFFF',
              lineHeight: 1.4,
            }}
          >
            {subtitle}
          </div>
        </div>

        {/* Footer Channels Banner */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            flexDirection: isAr ? 'row-reverse' : 'row',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#25D366',
              color: '#0B2E1A',
              padding: '12px 24px',
              borderRadius: '16px',
              fontSize: '20px',
              fontWeight: 700,
            }}
          >
            WhatsApp
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#229ED9',
              color: '#FFFFFF',
              padding: '12px 24px',
              borderRadius: '16px',
              fontSize: '20px',
              fontWeight: 700,
            }}
          >
            Telegram
          </div>
          <div
            style={{
              fontSize: '18px',
              color: '#F0EFFF',
              marginInlineStart: '12px',
            }}
          >
            {isAr ? 'بدون تحميل أي تطبيق' : 'No app to install'}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
