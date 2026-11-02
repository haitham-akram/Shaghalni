import { AnchorHTMLAttributes, ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export function WhatsAppIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.11 7.44C8.95 7.44 8.68 7.5 8.46 7.74C8.23 7.99 7.6 8.58 7.6 9.78C7.6 10.98 8.48 12.14 8.6 12.3C8.72 12.46 10.33 14.94 12.8 16C13.39 16.26 13.84 16.41 14.2 16.52C14.79 16.71 15.33 16.68 15.76 16.62C16.24 16.55 17.23 16.02 17.43 15.45C17.63 14.88 17.63 14.39 17.57 14.29C17.51 14.19 17.35 14.13 17.11 14.01C16.87 13.89 15.69 13.31 15.47 13.23C15.25 13.15 15.09 13.11 14.93 13.35C14.77 13.59 14.31 14.13 14.17 14.29C14.03 14.45 13.89 14.47 13.65 14.35C13.41 14.23 12.64 13.98 11.72 13.16C11 12.52 10.52 11.73 10.4 11.49C10.28 11.25 10.39 11.12 10.51 11C10.62 10.89 10.76 10.71 10.88 10.57C11 10.43 11.04 10.33 11.12 10.17C11.2 10.01 11.16 9.87 11.1 9.75C11.04 9.63 10.56 8.45 10.36 7.97C10.17 7.5 9.97 7.56 9.83 7.56C9.69 7.55 9.53 7.55 9.37 7.55L9.11 7.44Z" />
    </svg>
  );
}

export function TelegramIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.52 2.77-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
    </svg>
  );
}

interface CommonChannelProps {
  channel: 'whatsapp' | 'telegram';
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
  className?: string;
}

type ChannelButtonAsButton = CommonChannelProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ChannelButtonAsLink = CommonChannelProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

export type ChannelButtonProps = ChannelButtonAsButton | ChannelButtonAsLink;

export const ChannelButton = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ChannelButtonProps
>(({ className, channel, size = 'md', children, href, ...props }, ref) => {
  const isWhatsApp = channel === 'whatsapp';
  const Icon = isWhatsApp ? WhatsAppIcon : TelegramIcon;

  const bgStyles = isWhatsApp
    ? 'bg-whatsapp text-whatsapp-text hover:bg-whatsapp-hover'
    : 'bg-telegram text-white hover:bg-telegram-hover';

  const sizes = {
    sm: 'h-10 px-4 text-sm gap-2',
    md: 'h-12 px-6 text-base gap-2.5',
    lg: 'h-14 px-8 text-lg gap-3',
  };

  const baseClasses = cn(
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
    'active:scale-[0.98] shadow-sm',
    bgStyles,
    sizes[size],
    className
  );

  if (href) {
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={baseClasses}
        {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        <Icon className="h-5 w-5 shrink-0" />
        <span>{children}</span>
      </a>
    );
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type="button"
      className={baseClasses}
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <span>{children}</span>
    </button>
  );
});

ChannelButton.displayName = 'ChannelButton';