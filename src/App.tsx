/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Lang,
  ProductCategory,
  ProductItem,
  PRODUCTS,
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
  const [curCarouselModelId, setCurCarouselModelId] = useState<string | null>('nr1-sport');
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);
  const [inspectedProduct, setInspectedProduct] = useState<ProductItem | null>(null);
  const [selectedTestRideModelId, setSelectedTestRideModelId] = useState<string>('nr1-sport');
  const [showMobileDock, setShowMobileDock] = useState<boolean>(false);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);

  // Sync HTML lang, dir, and document title + meta description for SEO/GEO
  useEffect(() => {
    const isAr = lang === 'ar';
    document.documentElement.dir = isAr ? 'rtl' : 'ltr';
    document.documentElement.lang = isAr ? 'ar' : 'fr';
    document.title = isAr
      ? 'NeoRide — دراجات كهربائية وسكوترات وقطع غيار في بركان وجهة الشرق'
      : 'NeoRide — Motos & Scooters Électriques à Berkane et dans l’Oriental';
  }, [lang]);

  // Sync body classes for comparison tray and mobile dock padding
  useEffect(() => {
    document.body.classList.toggle('hastray', compareIds.length > 0 && !isCompareModalOpen);
  }, [compareIds.length, isCompareModalOpen]);

  useEffect(() => {
    const isDockActive = showMobileDock && !isInputFocused && compareIds.length === 0;
    document.body.classList.toggle('dockon', isDockActive);
  }, [showMobileDock, isInputFocused, compareIds.length]);

  // Inject comprehensive Schema.org @graph JSON-LD (MotorcycleDealer + Product ItemList + FAQPage) for SEO & GEO
  useEffect(() => {
    const seoGraphScript = document.createElement('script');
    seoGraphScript.type = 'application/ld+json';
    seoGraphScript.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': ['MotorcycleDealer', 'AutoPartsStore', 'LocalBusiness'],
          '@id': `${window.location.origin}/#dealer`,
          name: 'NeoRide',
          description:
            'Showroom de motos électriques, scooters électriques, trottinettes, casques homologués ECE 22.06 et pièces de rechange à Berkane et dans la région de l’Oriental (Oujda, Nador, Saïdia, Ahfir).',
          url: window.location.origin,
          telephone: '+212600000000',
          priceRange: '5200 MAD - 14900 MAD',
          currenciesAccepted: 'MAD',
          paymentAccepted: 'Cash, Bank Transfer',
          openingHours: 'Mo-Sa 09:00-19:30',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Berkane',
            addressRegion: 'Oriental',
            addressCountry: 'MA',
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: 34.92,
            longitude: -2.32,
          },
          areaServed: [
            { '@type': 'City', name: 'Berkane' },
            { '@type': 'City', name: 'Oujda' },
            { '@type': 'City', name: 'Nador' },
            { '@type': 'City', name: 'Saïdia' },
            { '@type': 'City', name: 'Ahfir' },
            { '@type': 'AdministrativeArea', name: 'Oriental, Maroc' },
          ],
        },
        {
          '@type': 'ItemList',
          name: 'Catalogue NeoRide — Motos, Scooters & Pièces Électriques',
          itemListElement: PRODUCTS.map((p, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'Product',
              name: p.name,
              description: `${p.kickerFr} — ${p.idealForFr}. ${p.highlightsFr.join(', ')}.`,
              brand: {
                '@type': 'Brand',
                name: 'NeoRide',
              },
              offers: {
                '@type': 'Offer',
                price: String(p.priceDh),
                priceCurrency: 'MAD',
                availability: 'https://schema.org/InStock',
                seller: {
                  '@type': 'Organization',
                  name: 'NeoRide Berkane',
                },
              },
              additionalProperty: p.specs.map((s) => ({
                '@type': 'PropertyValue',
                name: s.labelFr,
                value: s.value,
              })),
            },
          })),
        },
        {
          '@type': 'FAQPage',
          mainEntity: FAQ_ITEMS.map((f) => ({
            '@type': 'Question',
            name: f.qFr,
            acceptedAnswer: {
              '@type': 'Answer',
              text: f.aFr,
            },
          })),
        },
      ],
    });

    document.head.appendChild(seoGraphScript);
    return () => {
      seoGraphScript.remove();
    };
  }, []);

  // Show mobile bottom dock & floating scroll-top button after scrolling past hero
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setShowScrollTop(y > 360);
      setShowMobileDock(y > 480);
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

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('focusout', onFocusOut);
    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('focusout', onFocusOut);
    };
  }, []);

  // Close modals on Escape key
  useEffect(() => {
    if (!isCompareModalOpen && !inspectedProduct) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCompareModalOpen(false);
        setInspectedProduct(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isCompareModalOpen, inspectedProduct]);

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

  const handlePartsNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setActiveCategory('piece');
    const el = document.getElementById('catalogue');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToTop = () => {
    if (navigator.vibrate) navigator.vibrate(8);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Sticky 68px Header — Compact WhatsApp Logo & Zero Mobile Horizontal Scroll */}
      <header>
        <div className="wrap bar">
          {/* Left: White-Label NeoRide Logo */}
          <a
            href="#top"
            className="logo"
            aria-label="NeoRide"
          >
            <span className="si">NeoRide</span>
          </a>

          {/* Center: Clean Navigation Links */}
          <nav
            className="main-nav"
            aria-label={lang === 'ar' ? 'التنقل الرئيسي' : 'Navigation principale'}
          >
            <a
              href="#catalogue"
              onClick={() => setActiveCategory('all')}
            >
              {lang === 'ar' ? 'الكتالوج' : 'Catalogue'}
            </a>
            <a
              href="#catalogue"
              id="navp"
              onClick={handlePartsNavClick}
            >
              {lang === 'ar' ? 'قطع الغيار والإكسسوارات' : 'Pièces & Accessoires'}
            </a>
            <a href="#electrique">
              {lang === 'ar' ? 'لماذا الكهرباء؟' : 'Pourquoi l’Électrique'}
            </a>
            <a href="#localisation">
              {lang === 'ar' ? 'الموقع' : 'Localisation'}
            </a>
          </nav>

          {/* Right: Language Switcher + Compact 48x42px WhatsApp Icon Button */}
          <div className="lg">
            <button
              id="lang"
              type="button"
              className="lang"
              onClick={handleToggleLang}
              aria-label="Changer de langue / تغيير اللغة"
            >
              {lang === 'ar' ? 'Français' : 'عربية'}
            </button>

            <a
              className="btn btn-g header-wa"
              href={buildWhatsAppUrl(
                lang === 'ar'
                  ? 'السلام عليكم NeoRide، بغيت نطلب أو نعرف معلومات أكثر.'
                  : 'Bonjour NeoRide, je souhaite commander / avoir des informations.'
              )}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={lang === 'ar' ? 'اطلب عبر واتساب' : 'Commander sur WhatsApp'}
              title={lang === 'ar' ? 'اطلب عبر واتساب' : 'Commander sur WhatsApp'}
            >
              <svg className="wa-mark" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12.04 2a9.8 9.8 0 0 0-8.35 14.94L2.4 22l5.22-1.37A9.9 9.9 0 1 0 12.04 2Zm0 17.98a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.1.81.83-3.02-.2-.31a8.1 8.1 0 1 1 6.9 3.83Zm4.45-6.07c-.24-.12-1.43-.7-1.65-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.95-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.1-.49.1-.1.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.4-.54-.4h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.51.58.18 1.1.15 1.52.09.46-.07 1.43-.58 1.63-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" />
              </svg>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="top">
        <ElectricRoadHero lang={lang} />

        <CatalogSection
          lang={lang}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          compareIds={compareIds}
          onToggleCompare={handleToggleCompare}
          onCarouselModelChange={setCurCarouselModelId}
          onInspectProduct={setInspectedProduct}
        />

        <AdvisorQuizAndSavings lang={lang} />

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
        curCarouselModelId={curCarouselModelId}
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

      {/* Floating Scroll-Up Button (.scroll-top-btn) */}
      <button
        type="button"
        className={`scroll-top-btn${showScrollTop && !isInputFocused ? ' visible' : ''}`}
        onClick={handleScrollToTop}
        aria-label={lang === 'ar' ? 'العودة إلى الأعلى' : 'Retour en haut'}
        title={lang === 'ar' ? 'العودة إلى الأعلى' : 'Retour en haut'}
      >
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 19V5" />
          <path d="M5 12l7-7 7 7" />
        </svg>
      </button>

      {/* Mobile Sticky Bottom Dock (.dock) */}
      {showMobileDock && !isInputFocused && compareIds.length === 0 && (
        <div className="dock">
          <a className="btn btn-o" href="tel:+212600000000">
            {lang === 'ar' ? 'اتصل' : 'Appeler'}
          </a>
          <a
            className="btn btn-g"
            href={buildWhatsAppUrl(
              lang === 'ar'
                ? 'السلام عليكم NeoRide، عندي سؤال.'
                : 'Bonjour NeoRide, j’ai une question.'
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            {lang === 'ar' ? 'واتساب' : 'WhatsApp'}
          </a>
        </div>
      )}
    </>
  );
}
