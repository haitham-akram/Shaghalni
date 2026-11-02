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

function formatMessage(text: string, isUser: boolean): ReactNode {
  if (!text) return null;
  
  // Split by newlines and process each line
  const lines = text.split('\n');
  
  return (
    <div className="space-y-1 whitespace-pre-line">
      {lines.map((line, idx) => {
        // Check if line contains a URL
        const urlMatch = line.match(/(https?:\/\/[^\s]+)/);
        if (urlMatch) {
          const url = urlMatch[1];
          const beforeUrl = line.substring(0, urlMatch.index!);
          const afterUrl = line.substring(urlMatch.index! + url.length);
          return (
            <div key={idx} className="flex flex-wrap items-center gap-1">
              {beforeUrl && <span>{beforeUrl}</span>}
              <span
                dir="ltr"
                className={cn(
                  'underline break-all',
                  isUser ? 'text-night font-semibold' : 'text-forest font-semibold'
                )}
              >
                {url}
              </span>
              {afterUrl && <span>{afterUrl}</span>}
            </div>
          );
        }
        return <div key={idx}>{line}</div>;
      })}
    </div>
  );
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
          'relative max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[14px] leading-[1.7] shadow-[0_2px_8px_rgba(14,42,43,0.06)] transition-all chat-bubble-animate',
          isUser
            ? 'bg-primary text-night rounded-ee-sm border border-primary-hover/20 text-start'
            : 'bg-surface text-night rounded-es-sm border border-border text-start'
        )}
      >
        {children && typeof children === 'string' ? (
          formatMessage(children, isUser)
        ) : (
          <div className="space-y-1">{children}</div>
        )}

        {attachments && attachments.length > 0 && (
          <div className="mt-2 space-y-1.5">
            {attachments.map((att, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 rounded-xl bg-primary/15 border border-primary p-2 text-xs font-semibold text-night"
                dir="ltr"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/25 text-night shrink-0">
                  <FileText className="h-4 w-4" />
                </div>
                <span className="truncate flex-1">{att.name}</span>
                <Paperclip className="h-3 w-3 text-night/60 shrink-0" />
              </div>
            ))}
          </div>
        )}

        {time && (
          <div
            className={cn(
              'mt-1 text-[11px] text-night/55',
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
      <div className="flex items-center gap-1.5 rounded-2xl rounded-es-sm bg-surface border border-border px-4 py-3 shadow-[0_2px_8px_rgba(14,42,43,0.06)] chat-bubble-animate">
        <span className="h-2 w-2 rounded-full bg-night/40 animate-bounce [animation-delay:-0.3s]" />
        <span className="h-2 w-2 rounded-full bg-night/40 animate-bounce [animation-delay:-0.15s]" />
        <span className="h-2 w-2 rounded-full bg-night/40 animate-bounce" />
      </div>
    </div>
  );
}