'use client';

import { motion, MotionConfig } from 'framer-motion';
import {
  FileText,
  UserCheck,
  SlidersHorizontal,
  Clock,
  Wallet,
  Smartphone,
  LucideIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

interface FeatureItem {
  id: string;
  number: string;
  icon: LucideIcon;
  title: string;
  desc: string;
  variant: 'light' | 'dark' | 'forest';
  iconStyle: 'gradient' | 'white-bordered' | 'glass' | 'white-solid' | 'forest-solid';
  width: number;
  curvePath: string;
  desktopColClass?: string;
  flowIndex: number;
}

export function Features() {
  const t = useTranslations('features');

  // Row 1 features (~594px, ~291px, ~291px)
  // Flow in RTL: Card 1 (Right) -> Card 2 (Center) -> Card 3 (Left)
  const row1Features: FeatureItem[] = [
    {
      id: 'item1',
      number: '1',
      icon: FileText,
      title: t('item1Title'),
      desc: t('item1Desc'),
      variant: 'light',
      iconStyle: 'gradient',
      width: 594,
      // Sweeps across from beyond right edge (640, 150) and exits left at (0, 100)
      curvePath: 'M 640,150 C 480,160 320,70 160,60 C 80,55 30,85 0,100',
      desktopColClass: 'lg:col-start-1',
      flowIndex: 0,
    },
    {
      id: 'item2',
      number: '2',
      icon: UserCheck,
      title: t('item2Title'),
      desc: t('item2Desc'),
      variant: 'light',
      iconStyle: 'white-bordered',
      width: 291,
      // Enters at right edge ~y=100, dips to y=145 at centre, rises back to y=85 at left
      curvePath: 'M 310,100 C 240,105 170,145 100,145 C 50,145 15,120 -15,85',
      desktopColClass: 'lg:col-start-2',
      flowIndex: 1,
    },
    {
      id: 'item3',
      number: '3',
      icon: SlidersHorizontal,
      title: t('item3Title'),
      desc: t('item3Desc'),
      variant: 'dark',
      iconStyle: 'glass',
      width: 291,
      // Enters at right edge at (291, 100), swoops across, and curves down to bottom-left at (40, 205)
      curvePath: 'M 291,100 C 180,75 100,105 70,150 C 55,175 45,190 40,205',
      desktopColClass: 'lg:col-start-3',
      flowIndex: 2,
    },
  ];

  // Row 2 features (~441px, ~294px, ~441px)
  // Card 4 is placed directly underneath Card 3 in Column 3
  // Flow in RTL: Card 4 (Left) -> Card 5 (Center) -> Card 6 (Right)
  const row2Features: FeatureItem[] = [
    {
      id: 'item4',
      number: '4',
      icon: Clock,
      title: t('item4Title'),
      desc: t('item4Desc'),
      variant: 'forest',
      iconStyle: 'white-solid',
      width: 441,
      // Enters at top-left at (40, 0) continuing Card 3's downward curve, swoops across to (441, 110)
      curvePath: 'M 40,0 C 40,65 90,135 180,150 C 270,165 370,135 441,110',
      desktopColClass: 'lg:row-start-1 lg:col-start-3',
      flowIndex: 3,
    },
    {
      id: 'item5',
      number: '5',
      icon: Wallet,
      title: t('item5Title'),
      desc: t('item5Desc'),
      variant: 'light',
      iconStyle: 'white-bordered',
      width: 294,
      // Enters at left edge y=110, rises to y=70 at centre, then dips to y=130 at right edge
      curvePath: 'M -15,110 C 60,105 130,65 190,70 C 240,75 275,110 310,130',
      desktopColClass: 'lg:row-start-1 lg:col-start-2',
      flowIndex: 4,
    },
    {
      id: 'item6',
      number: '6',
      icon: Smartphone,
      title: t('item6Title'),
      desc: t('item6Desc'),
      variant: 'light',
      iconStyle: 'forest-solid',
      width: 441,
      // Enters from left-bottom, sweeps dramatically upward through mid-card, exits beyond right edge near top
      curvePath: 'M -15,170 C 60,165 140,135 210,100 C 270,70 360,55 460,70',
      desktopColClass: 'lg:row-start-1 lg:col-start-1',
      flowIndex: 5,
    },
  ];

  const renderCard = (feature: FeatureItem, idx: number) => {
    const Icon = feature.icon;

    // Card background & typography variants matching the reference
    let cardBgClass = 'bg-[#F4F6F8] border border-black/[0.04] shadow-[0_2px_8px_rgba(0,0,0,0.02)]';
    let titleClass = 'text-ink font-bold text-[17px] sm:text-[18px] md:text-[19px] tracking-tight';
    let descClass = 'text-ink-muted text-[13px] sm:text-[14px] leading-relaxed';
    let badgeClass = 'bg-white border border-black/[0.04] text-ink';

    // Wave colors — each variant uses only one blurred band to avoid double-line artefact
    // light cards: single soft white stroke blurred into the #F4F6F8 bg
    let strokeBaseColor = 'rgba(255, 255, 255, 0.90)';
    let strokeInnerColor = 'none'; // disabled for light cards — blurred band is enough
    let strokeFlowColor = 'rgba(255, 255, 255, 0.55)';
    if (feature.variant === 'dark') {
      cardBgClass = 'bg-[#0E2A2B] bg-gradient-to-br from-[#0E2A2B] via-[#103233] to-[#163D3E] border border-white/10 shadow-[0_10px_25px_rgba(14,42,43,0.28)]';
      titleClass = 'text-white font-bold text-[17px] sm:text-[18px] md:text-[19px] tracking-tight';
      descClass = 'text-white/75 text-[13px] sm:text-[14px] leading-relaxed';
      badgeClass = 'bg-white text-night font-bold';
      strokeBaseColor = 'rgba(255, 255, 255, 0.11)';
      strokeInnerColor = 'rgba(255, 255, 255, 0.07)';
      strokeFlowColor = 'rgba(123, 224, 176, 0.22)';
    } else if (feature.variant === 'forest') {
      cardBgClass = 'bg-[#1F7A58] bg-gradient-to-br from-[#1F7A58] to-[#16694A] border border-white/15 shadow-[0_10px_25px_rgba(31,122,88,0.22)]';
      titleClass = 'text-white font-bold text-[17px] sm:text-[18px] md:text-[19px] tracking-tight';
      descClass = 'text-white/85 text-[13px] sm:text-[14px] leading-relaxed';
      badgeClass = 'bg-white text-forest font-bold';
      strokeBaseColor = 'rgba(255, 255, 255, 0.14)';
      strokeInnerColor = 'rgba(255, 255, 255, 0.08)';
      strokeFlowColor = 'rgba(255, 255, 255, 0.26)';
    }

    // Icon container styling matching reference visual accents
    let iconWrapperClass = 'flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-sm transition-transform duration-300 group-hover:scale-105';
    const iconClass = 'h-5 w-5';

    switch (feature.iconStyle) {
      case 'gradient':
        iconWrapperClass += ' bg-gradient-to-br from-primary/30 to-forest/20 text-forest border border-forest/20';
        break;
      case 'white-bordered':
        iconWrapperClass += ' bg-white border border-black/[0.06] text-ink';
        break;
      case 'glass':
        iconWrapperClass += ' bg-white/10 border border-white/15 backdrop-blur-sm text-primary';
        break;
      case 'white-solid':
        iconWrapperClass += ' bg-white text-forest';
        break;
      case 'forest-solid':
        iconWrapperClass += ' bg-[#1F7A58] text-white';
        break;
    }

    return (
      <motion.div
        key={feature.id}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 0.45, delay: idx * 0.05, ease: 'easeOut' }}
        whileHover={{ y: -3 }}
        className={`group relative overflow-hidden rounded-[20px] ${cardBgClass} ${feature.desktopColClass || ''} min-h-[195px] lg:h-[205px] transition-all duration-300 hover:shadow-lg`}
      >
        {/* Soft, diffuse ambient wave pattern baked directly into the card background */}
        <svg
          viewBox={`0 0 ${feature.width} 205`}
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 z-0 h-full w-full"
          aria-hidden="true"
        >
          <defs>
            <filter id={`softBlur-${feature.id}`} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" />
            </filter>
          </defs>

          {/* Single broad, feathered ambient wave ribbon — the only stroke for all variants */}
          <path
            d={feature.curvePath}
            fill="none"
            stroke={strokeBaseColor}
            strokeWidth="38"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={`url(#softBlur-${feature.id})`}
            className="opacity-80 transition-opacity duration-300 group-hover:opacity-95"
          />

          {/* Optional crisp inner ribbon — only shown on dark/forest cards for depth */}
          {strokeInnerColor !== 'none' && (
            <path
              d={feature.curvePath}
              fill="none"
              stroke={strokeInnerColor}
              strokeWidth="22"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter={`url(#softBlur-${feature.id})`}
              className="opacity-70"
            />
          )}

          {/* Subtle sequential wave shimmer leading attention naturally across cards */}
          <path
            d={feature.curvePath}
            pathLength="100"
            fill="none"
            stroke={strokeFlowColor}
            strokeWidth="40"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={`url(#softBlur-${feature.id})`}
            className="feat-wave-shimmer"
            style={{
              animationDelay: `${feature.flowIndex * 0.8}s`,
            }}
          />
        </svg>

        {/* Number Badge at Top End Corner */}
        <div
          className={`absolute top-4 end-4 z-20 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold shadow-sm ${badgeClass}`}
          aria-hidden="true"
        >
          {feature.number}
        </div>

        {/* Card Content Layout: Header at top, description below */}
        <div className="relative z-10 flex h-full flex-col justify-between p-6 sm:p-7">
          {/* Top Row: Icon + Title */}
          <div className="flex items-center gap-3.5 pe-8">
            <div className={iconWrapperClass}>
              <Icon className={iconClass} />
            </div>
            <h3 className={titleClass}>{feature.title}</h3>
          </div>

          {/* Description Text */}
          <p className={descClass}>{feature.desc}</p>
        </div>
      </motion.div>
    );
  };

  return (
    <MotionConfig reducedMotion="user">
      <section id="features" className="bg-white border-t border-border/40 py-16 md:py-24">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          {/* Section Header */}
          <div className="mx-auto mb-12 max-w-2xl text-center space-y-3 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-ink tracking-tight">
              {t('title')}
            </h2>
            <p className="text-base sm:text-lg text-ink-muted leading-relaxed">
              {t('subtitle')}
            </p>
          </div>

          {/* Bento Grid: Two rows of 3 cards on desktop */}
          <div className="space-y-3">
            {/* First Row: 3 cards (~594px, ~291px, ~291px) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[594fr_291fr_291fr] gap-3">
              {row1Features.map((feature, idx) => renderCard(feature, idx))}
            </div>

            {/* Second Row: 3 cards (~441px, ~294px, ~441px) */}
            {/* Card 4 is placed directly in Column 3 (under Card 3), Card 5 in Column 2, Card 6 in Column 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[441fr_294fr_441fr] gap-3">
              {row2Features.map((feature, idx) => renderCard(feature, idx + 3))}
            </div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
