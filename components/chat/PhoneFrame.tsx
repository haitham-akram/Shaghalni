import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

interface PhoneFrameProps {
  children: ReactNode;
  className?: string;
  botName: string;
  statusText: string;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
}

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
      className={cn(
        'relative mx-auto w-full max-w-[340px] sm:max-w-[360px] md:max-w-[380px]',
        'rounded-[40px] p-3 shadow-2xl bg-[#16172B] border-4 border-[#262846]',
        className
      )}
    >
      {/* Outer bezel shine */}
      <div className="relative rounded-[32px] overflow-hidden bg-bg flex flex-col h-[520px] sm:h-[560px] md:h-[600px] border border-border">
        {/* Status Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 pt-3 pb-2 text-[11px] font-medium text-ink-muted select-none bg-surface border-b border-border/40">
          <span dir="ltr">09:41</span>
          {/* Speaker / Notch */}
          <div className="h-4 w-20 sm:w-24 bg-[#16172B] rounded-full" />
          <div className="flex items-center gap-1.5" dir="ltr">
            <Signal className="h-3 w-3" />
            <Wifi className="h-3 w-3" />
            <BatteryMedium className="h-3.5 w-3.5" />
          </div>
        </div>

        {/* Chat App Header */}
        <div className="flex items-center gap-3 px-4 py-3 bg-surface border-b border-border select-none">
          {/* Bot Avatar */}
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white font-bold text-base shadow-sm">
            {avatarInitial}
            <span className="absolute bottom-0 end-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-ink truncate">{botName}</h4>
            <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{statusText}</span>
            </p>
          </div>
        </div>

        {/* Chat Message Scrollable Area */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F5F3FB] flex flex-col overscroll-contain"
        >
          {children}
        </div>

        {/* Dummy Input bar */}
        <div className="p-3 bg-surface border-t border-border flex items-center gap-2 text-ink-muted">
          <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-xs text-ink-muted/70 text-start">
            ...
          </div>
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white shrink-0">
            <svg
              className="h-4 w-4 rtl:-scale-x-100"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
