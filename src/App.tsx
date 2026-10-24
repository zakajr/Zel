/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Phone, ArrowUpRight } from 'lucide-react';
import {
  Lang,
  ProductCategory,
  ProductItem,
  FAQ_ITEMS,
  buildWhatsAppUrl,
} from './data/neorideData';
import { ElectricRoadHero } from './components/ElectricRoadHero';
import { CatalogSection } from './components/CatalogSection';
import { AdvisorQuizAndSavings } from './components/AdvisorQuizAndSavings';
import { ShowroomTestRideAndFaq } from './components/ShowroomTestRideAndFaq';
import { CompareAndQuickViewModals } from './components/CompareAndQuickViewModals';

export default function App() {
  const [lang, setLang] = useState<Lang>('fr');
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('all');
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);
  const [inspectedProduct, setInspectedProduct] = useState<ProductItem | null>(null);
  const [selectedTestRideModelId, setSelectedTestRideModelId] = useState<string>('nr1-sport');
  const [showMobileDock, setShowMobileDock] = useState<boolean>(false);
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);

  // Sync HTML lang, dir, and document title
  useEffect(() => {
    const isAr = lang === 'ar';
    document.documentElement.dir = isAr ? 'rtl' : 'ltr';
    document.documentElement.lang = isAr ? 'ar' : 'fr';
    document.title = isAr
      ? 'NeoRide by Zelloufi — دراجات كهربائية وسكوترات وقطع غيار في بركان وجهة الشرق'
      : 'NeoRide by Zelloufi — Motos électriques, scooters et pièces à Berkane et dans l’Oriental';
  }, [lang]);

  // Inject Schema.org JSON-LD for MotorcycleDealer & FAQPage
  useEffect(() => {
    const dealerScript = document.createElement('script');
    dealerScript.type = 'application/ld+json';
    dealerScript.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'MotorcycleDealer',
      name: 'NeoRide by Zelloufi',
      areaServed: 'Oriental, Maroc',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Berkane',
        addressCountry: 'MA',
      },
      telephone: '+212600000000',
      openingHours: 'Mo-Sa 09:00-19:30',
    });

    const faqScript = document.createElement('script');
    faqScript.type = 'application/ld+json';
    faqScript.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ_ITEMS.map((f) => ({
        '@type': 'Question',
        name: f.qFr,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.aFr,
        },
      })),
    });

    document.head.appendChild(dealerScript);
    document.head.appendChild(faqScript);

    return () => {
      dealerScript.remove();
      faqScript.remove();
    };
  }, []);

  // Show mobile bottom dock after scrolling past hero, hide when keyboard/input is focused
  useEffect(() => {
    const onScroll = () => {
      setShowMobileDock(window.scrollY > 480);
    };
    const onFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && ['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName)) {
        setIsInputFocused(true);
      }
    };
    const onFocusOut = () => {
      setIsInputFocused(false);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('focusout', onFocusOut);
    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('focusout', onFocusOut);
    };
  }, []);

  const handleToggleLang = () => {
    setLang((prev) => (prev === 'fr' ? 'ar' : 'fr'));
  };

  const handleToggleCompare = (productId: string) => {
    if (navigator.vibrate) navigator.vibrate(8);
    setCompareIds((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      if (prev.length === 0) {
        return [productId];
      }
      const next = [prev[0], productId];
      setIsCompareModalOpen(true);
      return next;
    });
  };

  const handleRemoveCompare = (productId: string) => {
    setCompareIds((prev) => prev.filter((id) => id !== productId));
  };

  const handleSetComparePair = (idA: string, idB: string) => {
    setCompareIds([idA, idB]);
  };

  const handleClearCompare = () => {
    setCompareIds([]);
    setIsCompareModalOpen(false);
  };

  const handleBookTestRide = (productId: string) => {
    setSelectedTestRideModelId(productId);
    const el = document.getElementById('essai');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0f10] text-[#f2f4f3] flex flex-col">
      {/* Skip to content link for accessibility */}
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#2dff6e] focus:text-[#05150b] focus:font-bold focus:rounded"
      >
        {lang === 'ar' ? 'انتقل إلى المحتوى' : 'Aller au contenu'}
      </a>

      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-40 h-14 sm:h-16 bg-[#0d0f10]/95 border-b border-[#262b2f] backdrop-blur-md">
        <div className="max-w-[1160px] h-full mx-auto px-4 sm:px-6 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#top"
            className="font-logo font-black text-xl sm:text-2xl tracking-tight text-silver whitespace-nowrap shrink-0"
          >
            NeoRide
          </a>

          {/* Zone 2: 4–5 concise single-line text navigation links */}
          <nav
            aria-label={lang === 'ar' ? 'التنقل الرئيسي' : 'Navigation principale'}
            className="hidden md:flex items-center gap-7 text-sm font-medium text-[#9aa2a9]"
          >
            <a
              href="#catalogue"
              className="hover:text-[#f2f4f3] transition-colors whitespace-nowrap shrink-0"
            >
              {lang === 'ar' ? 'الكتالوج' : 'Catalogue'}
            </a>
            <a
              href="#quiz"
              className="hover:text-[#f2f4f3] transition-colors whitespace-nowrap shrink-0"
            >
              {lang === 'ar' ? 'الاختبار الذكي' : 'Conseiller'}
            </a>
            <a
              href="#electrique"
              className="hover:text-[#f2f4f3] transition-colors whitespace-nowrap shrink-0"
            >
              {lang === 'ar' ? 'حاسبة التوفير' : 'Économies'}
            </a>
            <a
              href="#essai"
              className="hover:text-[#f2f4f3] transition-colors whitespace-nowrap shrink-0"
            >
              {lang === 'ar' ? 'حجز تجربة' : 'Essai'}
            </a>
            <a
              href="#localisation"
              className="hover:text-[#f2f4f3] transition-colors whitespace-nowrap shrink-0"
            >
              {lang === 'ar' ? 'المعرض' : 'Showroom'}
            </a>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center shrink-0">
            <a
              href={buildWhatsAppUrl(
                lang === 'ar'
                  ? 'السلام عليكم NeoRide، بغيت نطلب أو نعرف معلومات أكثر.'
                  : 'Bonjour NeoRide, je souhaite commander / avoir des informations.'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 min-h-[38px] px-4 py-1.5 bg-[#2dff6e] hover:bg-white text-[#05150b] font-bold text-xs sm:text-sm rounded transition-colors whitespace-nowrap shrink-0"
            >
              <span>{lang === 'ar' ? 'تواصل عبر واتساب' : 'WhatsApp Showroom'}</span>
              <ArrowUpRight className="w-3.5 h-3.5 flip-rtl" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="top" className="flex-1">
        <ElectricRoadHero
          lang={lang}
          onToggleLang={handleToggleLang}
          onSelectCategory={setActiveCategory}
        />

        <CatalogSection
          lang={lang}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          compareIds={compareIds}
          onToggleCompare={handleToggleCompare}
          onInspectProduct={setInspectedProduct}
          onBookTestRide={handleBookTestRide}
        />

        <AdvisorQuizAndSavings
          lang={lang}
          onBookTestRide={handleBookTestRide}
          onInspectProduct={setInspectedProduct}
        />

        <ShowroomTestRideAndFaq
          lang={lang}
          selectedTestRideModelId={selectedTestRideModelId}
          onChangeTestRideModelId={setSelectedTestRideModelId}
        />
      </main>

      {/* Modals & Persistent Comparison Tray */}
      <CompareAndQuickViewModals
        lang={lang}
        compareIds={compareIds}
        onRemoveCompare={handleRemoveCompare}
        onSetComparePair={handleSetComparePair}
        onClearCompare={handleClearCompare}
        isCompareModalOpen={isCompareModalOpen}
        onOpenCompareModal={() => setIsCompareModalOpen(true)}
        onCloseCompareModal={() => setIsCompareModalOpen(false)}
        inspectedProduct={inspectedProduct}
        onCloseInspectModal={() => setInspectedProduct(null)}
        onBookTestRide={handleBookTestRide}
      />

      {/* Mobile Sticky Bottom Dock (Only visible on mobile when scrolled past hero, no input focused, and compare tray inactive) */}
      {showMobileDock && !isInputFocused && compareIds.length === 0 && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-[54px] px-3 bg-[#0d0f10]/95 border-t border-[#262b2f] backdrop-blur-md flex items-center gap-2">
          <a
            href="tel:+212600000000"
            className="flex-1 inline-flex items-center justify-center gap-1.5 min-h-[38px] px-3 rounded bg-[#1a1e21] text-[#f2f4f3] border border-[#2e3438] text-xs font-semibold whitespace-nowrap"
          >
            <Phone className="w-3.5 h-3.5 text-[#2dff6e]" />
            <span>{lang === 'ar' ? 'اتصل بالمعرض' : 'Appeler'}</span>
          </a>

          <a
            href="#essai"
            className="flex-1 inline-flex items-center justify-center min-h-[38px] px-3 rounded bg-[#1a1e21] text-[#f2f4f3] border border-[#2e3438] text-xs font-semibold whitespace-nowrap"
          >
            {lang === 'ar' ? 'حجز تجربة' : 'Réserver essai'}
          </a>

          <a
            href={buildWhatsAppUrl(
              lang === 'ar'
                ? 'السلام عليكم NeoRide، عندي سؤال.'
                : 'Bonjour NeoRide, j’ai une question.'
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1 min-h-[38px] px-3 rounded bg-[#2dff6e] text-[#05150b] text-xs font-bold whitespace-nowrap"
          >
            <span>{lang === 'ar' ? 'واتساب' : 'WhatsApp'}</span>
            <ArrowUpRight className="w-3.5 h-3.5 flip-rtl" />
          </a>
        </div>
      )}
    </div>
  );
}
