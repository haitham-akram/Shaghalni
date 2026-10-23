'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { PhoneFrame } from './PhoneFrame';
import { ChatBubble, TypingIndicator, ChatAttachment } from './ChatBubble';
import { useTranslations } from 'next-intl';
import { RotateCcw } from 'lucide-react';
import { track } from '@/lib/analytics';

export interface ScriptMessage {
  id: number;
  from: 'user' | 'bot';
  text?: string;
  attachments?: ChatAttachment[];
  time: string;
}

interface DaySeparatorMessage {
  id: number;
  type: 'daySeparator';
  text: string;
}

type ChatMessage = ScriptMessage | DaySeparatorMessage;

interface ChatScriptProps {
  locale?: 'ar' | 'en';
  autoStartOnView?: boolean;
  showReplayButton?: boolean;
}

export function ChatScript({
  autoStartOnView = true,
  showReplayButton = true,
}: ChatScriptProps) {
  const t = useTranslations();
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const timeoutIdsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAllTimeouts = useCallback(() => {
    timeoutIdsRef.current.forEach((id) => clearTimeout(id));
    timeoutIdsRef.current = [];
  }, []);

  const baseMessages: ScriptMessage[] = useMemo(
    () => [
      // 1. Bot welcome message
      {
        id: 1,
        from: 'bot',
        text: t('chatScript.msg1'),
        time: '09:41',
      },
      // 2. User sends CV attachment
      {
        id: 2,
        from: 'user',
        attachments: [{ name: t('chatScript.msg2Attachment') }],
        time: '09:41',
      },
      // 3. Bot asks for preferences
      {
        id: 3,
        from: 'bot',
        text: t('chatScript.msg3'),
        time: '09:42',
      },
      // 4. User responds with details
      {
        id: 4,
        from: 'user',
        text: t('chatScript.msg4'),
        time: '09:42',
      },
      // 5. Bot confirms profile ready
      {
        id: 5,
        from: 'bot',
        text: t('chatScript.msg5'),
        time: '09:42',
      },
      // 6. Bot sends job notification (2 days later) - NO attachment, different timestamp
      {
        id: 6,
        from: 'bot',
        text: t('chatScript.msg6'),
        time: '09:00',
      },
    ],
    [t]
  );

  // Interleave day separator between messages 5 and 6
  const messages: ChatMessage[] = useMemo(
    () => {
      const daySeparator: DaySeparatorMessage = {
        id: 99,
        type: 'daySeparator',
        text: t('chatScript.daySeparator'),
      };
      return [
        ...baseMessages.slice(0, 5), // messages 1-5
        daySeparator,
        baseMessages[5], // message 6
      ];
    },
    [baseMessages, t]
  );

  const [visibleCount, setVisibleCount] = useState<number>(0);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [initialScrollDone, setInitialScrollDone] = useState(false);

  const startAnimation = useCallback(() => {
    clearAllTimeouts();

    // Check prefers-reduced-motion
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setVisibleCount(messages.length);
      setIsCompleted(true);
      setIsTyping(false);
      return;
    }

    setVisibleCount(0);
    setIsTyping(false);
    setIsCompleted(false);
    setHasStarted(true);

    let currentIndex = 0;

    const playNextStep = () => {
      if (currentIndex >= messages.length) {
        setIsCompleted(true);
        setIsTyping(false);
        return;
      }

      const nextMsg = messages[currentIndex];
      const isBot = 'from' in nextMsg && nextMsg.from === 'bot';

      if (isBot) {
        // Show typing indicator for ~900ms
        setIsTyping(true);
        const typingTimer = setTimeout(() => {
          setIsTyping(false);
          currentIndex++;
          setVisibleCount(currentIndex);
          // Wait before playing next message
          const nextStepTimer = setTimeout(playNextStep, 1000);
          timeoutIdsRef.current.push(nextStepTimer);
        }, 900);
        timeoutIdsRef.current.push(typingTimer);
      } else if ('type' in nextMsg && nextMsg.type === 'daySeparator') {
        // Day separator appears instantly
        currentIndex++;
        setVisibleCount(currentIndex);
        const nextStepTimer = setTimeout(playNextStep, 600);
        timeoutIdsRef.current.push(nextStepTimer);
      } else {
        // User message appears directly after short delay
        currentIndex++;
        setVisibleCount(currentIndex);
        const nextStepTimer = setTimeout(playNextStep, 1000);
        timeoutIdsRef.current.push(nextStepTimer);
      }
    };

    const startTimer = setTimeout(playNextStep, 500);
    timeoutIdsRef.current.push(startTimer);
  }, [clearAllTimeouts, messages]);

  // Observer to start animation when scrolled into view
  useEffect(() => {
    if (!autoStartOnView) {
      const timer = setTimeout(() => {
        startAnimation();
      }, 50);
      timeoutIdsRef.current.push(timer);
      return () => clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          startAnimation();
        }
      },
      { threshold: 0.25 }
    );

    const currentEl = containerRef.current;
    if (currentEl) {
      observer.observe(currentEl);
    }

    return () => {
      if (currentEl) observer.unobserve(currentEl);
    };
  }, [autoStartOnView, hasStarted, startAnimation]);

  // Clean up all timers on unmount
  useEffect(() => {
    return () => {
      clearAllTimeouts();
    };
  }, [clearAllTimeouts]);

  // Initial scroll to top (so message 1 is visible first)
  useEffect(() => {
    if (scrollContainerRef.current && !initialScrollDone) {
      scrollContainerRef.current.scrollTop = 0;
      setInitialScrollDone(true);
    }
  }, [initialScrollDone]);

  // Auto-scroll to bottom only when typing indicator shows (for bot messages) or conversation is complete
  useEffect(() => {
    if (scrollContainerRef.current && (isTyping || visibleCount === messages.length)) {
      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
    }
  }, [visibleCount, isTyping, messages.length]);

  const handleReplay = () => {
    track('demo_replay');
    setInitialScrollDone(false);
    startAnimation();
  };

  function isDaySeparator(msg: ChatMessage): msg is DaySeparatorMessage {
    return 'type' in msg && msg.type === 'daySeparator';
  }

  return (
    <div ref={containerRef} className="relative flex flex-col items-center">
      {/* Accessible screen reader summary */}
      <div className="sr-only">
        {t('demo.screenReaderSummary')}
      </div>

      {/* Visual interactive phone mockup */}
      <div aria-hidden="true" className="w-full">
        <PhoneFrame
          botName={t('common.brandName')}
          statusText={t('common.onlineStatus')}
          scrollRef={scrollContainerRef}
        >
          {messages.slice(0, visibleCount).map((msg) => {
            if (isDaySeparator(msg)) {
              return (
                <div
                  key={msg.id}
                  className="flex w-full justify-center py-1"
                  aria-hidden="true"
                >
                  <span className="px-3 py-0.5 text-[10px] font-medium text-ink-muted/60 bg-primary-soft/50 rounded-full">
                    {msg.text}
                  </span>
                </div>
              );
            }
            // msg is ScriptMessage here
            return (
              <ChatBubble
                key={msg.id}
                from={msg.from}
                attachments={msg.attachments}
                time={msg.time}
              >
                {msg.text}
              </ChatBubble>
            );
          })}

          {isTyping && <TypingIndicator />}
        </PhoneFrame>
      </div>

      {showReplayButton && (
        <div className="mt-4">
          <button
            type="button"
            onClick={handleReplay}
            disabled={!isCompleted && hasStarted}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-surface border border-border text-ink hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <RotateCcw className="h-4 w-4" />
            <span>{t('demo.replay')}</span>
          </button>
        </div>
      )}
    </div>
  );
}