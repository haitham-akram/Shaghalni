import { ReactNode, RefObject } from 'react';
import { cn } from '@/lib/utils';

interface PhoneFrameProps {
  children: ReactNode;
  className?: string;
  botName: string;
  statusText: string;
  scrollRef?: RefObject<HTMLDivElement | null>;
}

// Signal: 4 separate rounded bars, width 3, gap 1.5, heights 4 / 6.5 / 9 / 12
const SignalIcon = () => (
  <svg
    width="18"
    height="12"
    viewBox="0 0 18 12"
    fill="currentColor"
    aria-hidden="true"
    className="text-ink"
  >
    <rect x="0" y="8" width="3" height="4" rx="1" />
    <rect x="4.5" y="5.5" width="3" height="6.5" rx="1" />
    <rect x="9" y="3" width="3" height="9" rx="1" />
    <rect x="13.5" y="0" width="3" height="12" rx="1" />
  </svg>
);

// Wi-Fi: filled bottom wedge + two arc bands, all centered on (8.5, 11.5),
// each spanning -45° to +45° from vertical
const WifiIcon = () => (
  <svg
    width="17"
    height="12"
    viewBox="0 0 17 12"
    fill="none"
    aria-hidden="true"
    className="text-ink"
  >
    <path d="M8.5 11.5 L6.38 9.38 A3 3 0 0 1 10.62 9.38 Z" fill="currentColor" />
    <path
      d="M4.61 7.61 A5.5 5.5 0 0 1 12.39 7.61"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M2.14 5.14 A9 9 0 0 1 14.86 5.14"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);

// Battery: faint outline, small nub, solid fill level
const BatteryIcon = () => (
  <svg
    width="27"
    height="13"
    viewBox="0 0 27 13"
    fill="none"
    aria-hidden="true"
    className="text-ink"
  >
    <rect
      x="0.5"
      y="0.5"
      width="22"
      height="12"
      rx="3.8"
      stroke="currentColor"
      strokeWidth="1"
      strokeOpacity="0.35"
      fill="none"
    />
    <path
      d="M24 4.5v4c.8-.3 1.5-1.2 1.5-2s-.7-1.7-1.5-2z"
      fill="currentColor"
      fillOpacity="0.4"
    />
    <rect x="2" y="2" width="19" height="9" rx="2.5" fill="currentColor" />
  </svg>
);

// Paper plane (points up-right in LTR, flips to up-left in RTL)
const PaperPlaneIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="rtl:scale-x-[-1]"
  >
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </svg>
);

export function PhoneFrame({
  children,
  className = '',
  botName,
  statusText,
  scrollRef,
}: PhoneFrameProps) {
  const avatarInitial = botName?.trim() ? botName.trim().charAt(0) : 'ش';

  return (
    <div
      className={cn('phone-frame relative mx-auto', className)}
      aria-hidden="true"
    >
      {/* Outer glow/shadow */}
      <div
        className="absolute inset-0 rounded-[52px] bg-primary/18 blur-[35px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] -z-10"
        aria-hidden="true"
      />

      {/* Device frame */}
      <div
        className="relative rounded-[52px] bg-phone-bezel shadow-[0_30px_60px_rgba(0,0,0,0.5),0_0_0_1px_rgba(246,244,238,0.14),inset_0_1px_0_rgba(246,244,238,0.2)]"
        style={
          {
            width: 'var(--frame-width)',
            height: 'var(--frame-height)',
            padding: 'var(--bezel)',
          } as React.CSSProperties
        }
      >
        {/* Side buttons */}
        <div
          className="absolute left-[-8px] top-1/2 -translate-y-1/2 h-12 w-1.5 rounded-full bg-phone-bezel ring-1 ring-[rgba(246,244,238,0.14)]"
          aria-hidden="true"
        />
        <div
          className="absolute right-[-8px] top-[35%] h-16 w-1.5 rounded-full bg-phone-bezel ring-1 ring-[rgba(246,244,238,0.14)]"
          aria-hidden="true"
        />
        <div
          className="absolute right-[-8px] bottom-[35%] h-16 w-1.5 rounded-full bg-phone-bezel ring-1 ring-[rgba(246,244,238,0.14)]"
          aria-hidden="true"
        />

        {/* Screen */}
        <div
          className="relative overflow-hidden bg-bg flex flex-col"
          style={
            {
              width: '100%',
              height: '100%',
              borderRadius: 'var(--screen-radius)',
            } as React.CSSProperties
          }
        >
          {/* Dynamic Island */}
          <div
            className="absolute top-[10px] left-1/2 -translate-x-1/2 z-20 pointer-events-none"
            style={
              {
                width: 'var(--dynamic-island-w)',
                height: 'var(--dynamic-island-h)',
                minWidth: '110px',
                maxWidth: '140px',
              } as React.CSSProperties
            }
            aria-hidden="true"
          >
            <div className="relative w-full h-full rounded-full bg-[#000] shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
              {/* Single faint camera lens dot */}
              <div
                className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-[#1a1a1a] ring-1 ring-[#333]"
                aria-hidden="true"
              />
            </div>
          </div>

          {/* Status Bar - force LTR for device chrome */}
          <div
            className="flex items-center justify-between px-4 sm:px-5 pt-[50px] pb-2 text-[15px] font-semibold text-ink select-none"
            style={{ letterSpacing: '-0.01em' }}
            dir="ltr"
            aria-hidden="true"
          >
            <span
              className="tabular-nums"
              style={{
                fontFamily:
                  '-apple-system, "SF Pro Text", system-ui, sans-serif',
                fontWeight: 600,
              }}
            >
              9:41
            </span>
            <div className="flex items-center gap-[6px]" aria-hidden="true">
              <SignalIcon />
              <WifiIcon />
              <BatteryIcon />
            </div>
          </div>

          {/* Chat App Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-surface border-b border-border select-none relative z-10">
            {/* Bot Avatar */}
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-night font-bold text-base shadow-sm">
              {avatarInitial}
              <span
                className="absolute bottom-0 end-0 h-3 w-3 rounded-full bg-forest ring-2 ring-white"
                aria-hidden="true"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-ink truncate">{botName}</h4>
              <p className="text-[12px] text-forest font-medium flex items-center gap-1">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-forest animate-pulse motion-reduce:animate-none"
                  aria-hidden="true"
                />
                <span>{statusText}</span>
              </p>
            </div>
          </div>

          {/* Chat Message Scrollable Area - fade mask top & bottom */}
          <div
            ref={scrollRef}
            className="scroll-area flex-1 overflow-y-auto p-4 space-y-3 bg-bg flex flex-col overscroll-contain text-[14px]"
            style={
              {
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                maskImage:
                  'linear-gradient(to bottom, transparent, black 16px, black calc(100% - 24px), transparent)',
                WebkitMaskImage:
                  'linear-gradient(to bottom, transparent, black 16px, black calc(100% - 24px), transparent)',
              } as React.CSSProperties
            }
          >
            {children}
          </div>

          {/* Dummy Input bar */}
          <div className="p-3 bg-surface border-t border-border flex items-center gap-2 text-ink-muted relative z-10">
            <div className="flex-1 bg-paper rounded-full px-4 py-2.5 text-[13px] text-night/70 text-start font-medium border border-border/50">
              اكتب رسالة...
            </div>
            <button
              type="button"
              tabIndex={-1}
              className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-night shrink-0 transition-colors hover:bg-primary-hover active:scale-95"
              aria-hidden="true"
            >
              <PaperPlaneIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}