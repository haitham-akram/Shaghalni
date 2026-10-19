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

  const messages: ScriptMessage[] = useMemo(
    () => [
      {
        id: 1,
        from: 'user',
        text: t('chatScript.msg1'),
        time: '09:41',
      },
      {
        id: 2,
        from: 'bot',
        text: t('chatScript.msg2'),
        time: '09:41',
      },
      {
        id: 3,
        from: 'user',
        attachments: [{ name: t('chatScript.msg3Attachment') }],
        time: '09:42',
      },
      {
        id: 4,
        from: 'user',
        text: t('chatScript.msg4'),
        time: '09:42',
      },
      {
        id: 5,
        from: 'bot',
        text: t('chatScript.msg5'),
        time: '09:42',
      },
      {
        id: 6,
        from: 'bot',
        text: t('chatScript.msg6'),
        attachments: [
          { name: t('chatScript.msg6File1') },
          { name: t('chatScript.msg6File2') },
        ],
        time: '09:43',
      },
      {
        id: 7,
        from: 'user',
        text: t('chatScript.msg7'),
        time: '09:43',
      },
    ],
    [t]
  );

  const [visibleCount, setVisibleCount] = useState<number>(0);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

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
      const isBot = nextMsg.from === 'bot';

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

  // Scroll to bottom of the phone screen ONLY (never touches window scroll)
  useEffect(() => {
    if (scrollContainerRef.current) {
      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
    }
  }, [visibleCount, isTyping]);

  const handleReplay = () => {
    track('demo_replay');
    startAnimation();
  };

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
          {messages.slice(0, visibleCount).map((msg) => (
            <ChatBubble
              key={msg.id}
              from={msg.from}
              attachments={msg.attachments}
              time={msg.time}
            >
              {msg.text}
            </ChatBubble>
          ))}

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
