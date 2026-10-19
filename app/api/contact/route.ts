import { NextRequest, NextResponse } from 'next/server';
import { contactSchema } from '@/lib/contact-schema';
import { Resend } from 'resend';

// Simple in-memory rate limiter: 5 requests per 10 minutes per IP
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000; // 10 minutes
  const maxRequests = 5;

  const record = rateLimitMap.get(ip);
  if (!record || now > record.expiresAt) {
    rateLimitMap.set(ip, { count: 1, expiresAt: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count += 1;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      '127.0.0.1';

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await req.json();

    // 1. Validate with Zod
    const result = contactSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid form input', issues: result.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, topic, message, website, turnstileToken } = result.data;

    // 2. Honeypot check: If website field is filled, silently succeed
    if (website && website.trim().length > 0) {
      return NextResponse.json({ success: true });
    }

    // 3. Turnstile verification (if configured)
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
    if (turnstileSecret) {
      if (!turnstileToken) {
        return NextResponse.json(
          { error: 'Turnstile verification token missing' },
          { status: 400 }
        );
      }

      const turnstileRes = await fetch(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            secret: turnstileSecret,
            response: turnstileToken,
            remoteip: ip,
          }),
        }
      );

      const turnstileData = await turnstileRes.json();
      if (!turnstileData.success) {
        return NextResponse.json(
          { error: 'Turnstile verification failed' },
          { status: 400 }
        );
      }
    }

    // 4. Send email via Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    const contactToEmail = process.env.CONTACT_TO_EMAIL;
    const contactFromEmail =
      process.env.CONTACT_FROM_EMAIL || 'onboarding@resend.dev';

    if (resendApiKey && contactToEmail) {
      const resend = new Resend(resendApiKey);

      const plainTextContent = `New message from Shaghalni Contact Form:\n\nName: ${name}\nEmail: ${email}\nTopic: ${topic}\n\nMessage:\n${message}\n\nIP: ${ip}\nSent At: ${new Date().toISOString()}`;

      await resend.emails.send({
        from: contactFromEmail,
        to: contactToEmail,
        replyTo: email,
        subject: `[Shaghalni Contact] [${topic}] from ${name}`,
        text: plainTextContent,
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    // Never leak error details or sensitive contents
    return NextResponse.json(
      { error: 'An unexpected error occurred while processing your request' },
      { status: 500 }
    );
  }
}
