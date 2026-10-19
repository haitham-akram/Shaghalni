import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { FileText, Paperclip } from 'lucide-react';

export interface ChatAttachment {
  name: string;
}

interface ChatBubbleProps {
  from: 'user' | 'bot';
  children?: ReactNode;
  attachments?: ChatAttachment[];
  time?: string;
  className?: string;
}

export function ChatBubble({
  from,
  children,
  attachments,
  time,
  className = '',
}: ChatBubbleProps) {
  const isUser = from === 'user';

  return (
    <div
      className={cn(
        'flex w-full flex-col',
        isUser ? 'items-end' : 'items-start',
        className
      )}
    >
      <div
        className={cn(
          'relative max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed shadow-sm transition-all chat-bubble-animate',
          isUser
            ? 'bg-primary-soft text-ink rounded-ee-sm border border-primary/20 text-start'
            : 'bg-white text-ink rounded-es-sm border border-border text-start'
        )}
      >
        {children && <div className="space-y-1">{children}</div>}

        {attachments && attachments.length > 0 && (
          <div className="mt-2 space-y-1.5">
            {attachments.map((att, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 rounded-xl bg-bg/80 border border-border p-2 text-xs font-medium text-ink"
                dir="ltr"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                  <FileText className="h-4 w-4" />
                </div>
                <span className="truncate flex-1">{att.name}</span>
                <Paperclip className="h-3 w-3 text-ink-muted shrink-0" />
              </div>
            ))}
          </div>
        )}

        {time && (
          <div
            className={cn(
              'mt-1 text-[10px] text-ink-muted/80',
              isUser ? 'text-end' : 'text-start'
            )}
            dir="ltr"
          >
            {time}
          </div>
        )}
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex w-full flex-col items-start">
      <div className="flex items-center gap-1.5 rounded-2xl rounded-es-sm bg-white border border-border px-4 py-3 shadow-sm chat-bubble-animate">
        <span className="h-2 w-2 rounded-full bg-ink-muted/60 animate-bounce [animation-delay:-0.3s]" />
        <span className="h-2 w-2 rounded-full bg-ink-muted/60 animate-bounce [animation-delay:-0.15s]" />
        <span className="h-2 w-2 rounded-full bg-ink-muted/60 animate-bounce" />
      </div>
    </div>
  );
}
