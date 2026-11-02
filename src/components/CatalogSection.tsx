import React, { useState, useRef, useEffect, useCallback } from 'react';
import { LayoutGrid, GalleryHorizontal } from 'lucide-react';
import {
  Lang,
  PRODUCTS,
  ProductItem,
  ProductCategory,
  ProductSpec,
  buildWhatsAppUrl,
} from '../data/neorideData';
import { VehicleIllustration } from './VehicleIllustration';

interface CatalogSectionProps {
  lang: Lang;
  activeCategory: ProductCategory;
  onSelectCategory: (cat: ProductCategory) => void;
  compareIds: string[];
  onToggleCompare: (productId: string) => void;
  onCarouselModelChange: (productId: string | null) => void;
  onInspectProduct: (product: ProductItem) => void;
}

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  lang,
  activeCategory,
  onSelectCategory,
  compareIds,
  onToggleCompare,
  onCarouselModelChange,
  onInspectProduct,
}) => {
  const listRef = useRef<HTMLDivElement | null>(null);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  const [carouselPos, setCarouselPos] = useState<string>('1 / 6');
  const [canPrev, setCanPrev] = useState<boolean>(false);
  const [canNext, setCanNext] = useState<boolean>(true);
  const [hideHint, setHideHint] = useState<boolean>(false);

  const visibleProducts = PRODUCTS.filter(
    (p) => activeCategory === 'all' || p.category === activeCategory
  );

  const updateCarouselMetrics = useCallback(() => {
    const lst = listRef.current;
    if (!lst || viewMode === 'grid') {
      const n = visibleProducts.length;
      setCarouselPos(n ? `${n} / ${n}` : '');
      return;
    }
    const cards = Array.from(lst.querySelectorAll<HTMLElement>('.mdl'));
    const n = cards.length;
    const w = cards[0] ? cards[0].offsetWidth + 16 : 1;
    const sl = Math.abs(lst.scrollLeft);
    const i = Math.min(Math.max(n - 1, 0), Math.round(sl / w));
    setCarouselPos(n ? `${i + 1} / ${n}` : '');
    setCanPrev(sl >= 4);
    setCanNext(sl + lst.clientWidth < lst.scrollWidth - 4);
    if (sl > 24) {
      setHideHint(true);
    }

    const activeCard = cards[i];
    const activeId = activeCard?.dataset.id || null;
    const activeProd = PRODUCTS.find((p) => p.id === activeId);
    if (activeProd && activeProd.category !== 'piece') {
      onCarouselModelChange(activeProd.id);
    } else {
      onCarouselModelChange(null);
    }
  }, [visibleProducts.length, viewMode, onCarouselModelChange]);

  useEffect(() => {
    const lst = listRef.current;
    if (lst) {
      lst.scrollLeft = 0;
    }
    updateCarouselMetrics();
  }, [activeCategory, viewMode, lang, updateCarouselMetrics]);

  useEffect(() => {
    const lst = listRef.current;
    if (!lst) return;
    const onScroll = () => requestAnimationFrame(updateCarouselMetrics);
    lst.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateCarouselMetrics);
    return () => {
      lst.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateCarouselMetrics);
    };
  }, [updateCarouselMetrics]);

  const stepCarousel = (dir: -1 | 1) => {
    const lst = listRef.current;
    if (!lst) return;
    const firstCard = lst.querySelector<HTMLElement>('.mdl');
    const stepWidth = firstCard ? firstCard.offsetWidth + 16 : 300;
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    lst.scrollBy({
      left: dir * (lang === 'ar' ? -1 : 1) * stepWidth,
      behavior: prefersReduced ? 'auto' : 'smooth',
    });
  };

  const renderSpecIcon = (type: ProductSpec['type']) => {
    switch (type) {
      case 'range':
        return (
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 21s-6-5.2-6-10a6 6 0 1112 0c0 4.8-6 10-6 10z" />
            <circle cx="12" cy="11" r="2.2" />
          </svg>
        );
      case 'speed':
        return (
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M4 17a8 8 0 1116 0" />
            <path d="M12 17l4-5" />
            <circle cx="12" cy="17" r="1" />
          </svg>
        );
      case 'charge':
        return (
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="8.5" />
            <path d="M12 7.5V12l3 2" />
          </svg>
        );
      case 'battery':
        return (
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="7" width="16" height="10" rx="2" />
            <path d="M21 10.5v3M7 10v4M11 10v4M15 10v4" />
          </svg>
        );
      default:
        return (
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        );
    }
  };

  const firstComparedProduct =
    compareIds.length === 1
      ? PRODUCTS.find((p) => p.id === compareIds[0]) || null
      : null;

  return (
    <section id="catalogue">
      <div className="wrap">
        <div className="catalog-intro">
          <div>
            <p className="product-kicker">
              {lang === 'ar'
                ? 'اعثر على وسيلة تنقلك القادمة'
                : 'TROUVEZ VOTRE PROCHAINE MOBILITÉ'}
            </p>
            <h2 className="si">
              {lang === 'ar' ? 'الكتالوج' : 'Le catalogue'}
            </h2>
            <p className="lead">
              {lang === 'ar'
                ? 'قارن بين الطرازات، افتح البطاقة التقنية السريعة، ثم تواصل معنا عبر واتساب لتأكيد السعر والتوفر في بركان.'
                : 'Comparez les modèles, inspectez la fiche technique rapide, puis demandez une confirmation immédiate sur WhatsApp.'}
            </p>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div
          className="tabs"
          role="group"
          aria-label={
            lang === 'ar' ? 'تصفية حسب الفئة' : 'Filtrer par catégorie'
          }
        >
          {[
            { id: 'all' as const, fr: 'Toutes', ar: 'الكل' },
            {
              id: 'moto' as const,
              fr: 'Motos Électriques',
              ar: 'دراجات كهربائية',
            },
            {
              id: 'scoot' as const,
              fr: 'Trottinettes & Scooters',
              ar: 'سكوترات ودراجات صغيرة',
            },
            {
              id: 'piece' as const,
              fr: 'Casques & Pièces',
              ar: 'خوذات وقطع غيار',
            },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              aria-pressed={activeCategory === t.id}
              onClick={() => onSelectCategory(t.id)}
            >
              {lang === 'ar' ? t.ar : t.fr}
            </button>
          ))}
        </div>

        {/* Carousel Bar with Counter, Swipe Hint, Prev/Next Arrows & Carousel/Grid Toggle */}
        <div className="carbar">
          <span id="cpos" aria-live="polite">
            {carouselPos}
          </span>
          {viewMode === 'carousel' && !hideHint && (
            <span className="carhint" id="chint">
              {lang === 'ar'
                ? 'اسحب لعرض الطرازات'
                : 'Glissez pour voir les modèles'}
            </span>
          )}
          <div className="carbtns">
            <button
              type="button"
              onClick={() =>
                setViewMode((prev) =>
                  prev === 'carousel' ? 'grid' : 'carousel'
                )
              }
              aria-label={
                viewMode === 'carousel'
                  ? lang === 'ar'
                    ? 'عرض كشبكة'
                    : 'Afficher en grille'
                  : lang === 'ar'
                  ? 'عرض كشريط التمرير'
                  : 'Afficher en carrousel'
              }
              title={
                viewMode === 'carousel'
                  ? lang === 'ar'
                    ? 'عرض كشبكة'
                    : 'Vue grille'
                  : lang === 'ar'
                  ? 'عرض كشريط التمرير'
                  : 'Vue carrousel'
              }
              className={viewMode === 'grid' ? 'active-mode' : ''}
            >
              {viewMode === 'carousel' ? (
                <LayoutGrid className="w-5 h-5" />
              ) : (
                <GalleryHorizontal className="w-5 h-5" />
              )}
            </button>

            {viewMode === 'carousel' && (
              <>
                <button
                  type="button"
                  id="cprev"
                  disabled={!canPrev}
                  onClick={() => stepCarousel(-1)}
                  aria-label={
                    lang === 'ar' ? 'الطراز السابق' : 'Modèle précédent'
                  }
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    aria-hidden="true"
                  >
                    <path
                      d="M15 5l-7 7 7 7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  id="cnext"
                  disabled={!canNext}
                  onClick={() => stepCarousel(1)}
                  aria-label={
                    lang === 'ar' ? 'الطراز التالي' : 'Modèle suivant'
                  }
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    aria-hidden="true"
                  >
                    <path
                      d="M9 5l7 7-7 7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Clean Mockup v11 Product List (#list) with Quick-View Trigger */}
        <div
          id="list"
          ref={listRef}
          role="region"
          aria-roledescription={viewMode === 'carousel' ? 'carrousel' : undefined}
          aria-label={lang === 'ar' ? 'طرازات NeoRide' : 'Modèles NeoRide'}
          tabIndex={0}
          className={viewMode === 'grid' ? 'grid-mode' : ''}
        >
          {visibleProducts.map((x) => {
            const isSelected = compareIds.includes(x.id);
            const waMsg =
              lang === 'ar'
                ? `السلام عليكم NeoRide، أنا مهتم بـ: ${x.name}. واش ممكن تعطيوني الثمن والتوفر؟`
                : `Bonjour NeoRide, je suis intéressé par : ${x.name}. Pouvez-vous me renseigner sur le prix et la disponibilité ?`;

            const compareBtnText = isSelected
              ? lang === 'ar'
                ? '✓ في المقارنة'
                : '✓ Comparé'
              : firstComparedProduct
              ? (lang === 'ar' ? 'قارن مع ' : 'VS ') +
                firstComparedProduct.name
              : lang === 'ar'
              ? 'قارن'
              : 'Comparer';

            const rawSpecs: [string, string, ProductSpec['type'], number?][] =
              x.id === 'nr1-sport'
                ? [
                    ['90', lang === 'ar' ? 'كم مدى السير' : 'km d’autonomie', 'range', 100],
                    ['85', lang === 'ar' ? 'كم/ساعة كحد أقصى' : 'km/h max', 'speed', 100],
                    ['5 h', lang === 'ar' ? 'للشحن' : 'de charge', 'charge'],
                    ['72V', lang === 'ar' ? 'بطارية 30Ah' : 'batterie 30Ah', 'battery'],
                  ]
                : x.id === 'urban-3000'
                ? [
                    ['70', lang === 'ar' ? 'كم مدى السير' : 'km d’autonomie', 'range', 78],
                    ['70', lang === 'ar' ? 'كم/ساعة كحد أقصى' : 'km/h max', 'speed', 82],
                    ['6 h', lang === 'ar' ? 'للشحن' : 'de charge', 'charge'],
                    ['60V', lang === 'ar' ? 'بطارية 26Ah' : 'batterie 26Ah', 'battery'],
                  ]
                : x.id === 'eco-city'
                ? [
                    ['55', lang === 'ar' ? 'كم مدى السير' : 'km d’autonomie', 'range', 61],
                    ['45', lang === 'ar' ? 'كم/ساعة كحد أقصى' : 'km/h max', 'speed', 53],
                    ['5 h', lang === 'ar' ? 'للشحن' : 'de charge', 'charge'],
                    ['48V', lang === 'ar' ? 'بطارية 20Ah' : 'batterie 20Ah', 'battery'],
                  ]
                : x.id === 'pro-x'
                ? [
                    ['40', lang === 'ar' ? 'كم مدى السير' : 'km d’autonomie', 'range', 44],
                    ['35', lang === 'ar' ? 'كم/ساعة كحد أقصى' : 'km/h max', 'speed', 41],
                    ['4 h', lang === 'ar' ? 'للشحن' : 'de charge', 'charge'],
                    ['36V', lang === 'ar' ? 'بطارية 15Ah' : 'batterie 15Ah', 'battery'],
                  ]
                : x.id === 'casque-neoride'
                ? [
                    ['ECE', lang === 'ar' ? 'معيار 22.06' : 'norme 22.06', 'info'],
                    ['S–XL', lang === 'ar' ? 'المقاسات' : 'tailles', 'info'],
                    ['1', lang === 'ar' ? 'واقٍ مقاوم للخدش' : 'visière anti-rayures', 'info'],
                  ]
                : [
                    ['26Ah', lang === 'ar' ? 'ليثيوم-أيون' : 'lithium-ion', 'battery'],
                    ['60V', lang === 'ar' ? 'الجهد' : 'tension', 'battery'],
                    ['Urban', lang === 'ar' ? 'متوافق مع 3000' : 'compatible 3000', 'info'],
                  ];

            return (
              <article
                key={x.id}
                className="mdl"
                data-c={x.category}
                data-id={x.id}
              >
                <div
                  className="product-visual"
                  onClick={() => onInspectProduct(x)}
                  title={lang === 'ar' ? 'اضغط لعرض التفاصيل' : 'Cliquer pour vue rapide'}
                >
                  <VehicleIllustration
                    kind={x.artKind}
                    accentColor={/Urban/.test(x.name) ? '#aeb8b2' : '#2dff6e'}
                    label={x.name}
                  />
                </div>

                <div className="product-body">
                  <span className="product-kicker">
                    {x.category === 'moto'
                      ? lang === 'ar'
                        ? 'دراجة كهربائية'
                        : 'MOTO ÉLECTRIQUE'
                      : x.category === 'scoot'
                      ? lang === 'ar'
                        ? 'تنقل حضري'
                        : 'MOBILITÉ URBAINE'
                      : lang === 'ar'
                      ? 'تجهيزات وقطع غيار'
                      : 'ÉQUIPEMENT & PIÈCES'}
                  </span>
                  <h3 className="si">{x.name}</h3>
                  <div className="product-price-row">
                    <div className="pr">{x.priceFormatted} DH</div>
                    {x.monthlyEstimateDh && (
                      <div className="mo">
                        {lang === 'ar'
                          ? `أو ~${x.monthlyEstimateDh} درهم/شهر`
                          : `ou ~${x.monthlyEstimateDh} DH/mois`}
                      </div>
                    )}
                  </div>
                </div>

                <ul className="spx">
                  {rawSpecs.map(([val, lbl, iconType, ratio], idx) => (
                    <li key={idx} className="st">
                      {renderSpecIcon(iconType)}
                      <b>{val}</b>
                      <span>{lbl}</span>
                      {typeof ratio === 'number' && (
                        <i className="mt" aria-hidden="true">
                          <b style={{ width: `${ratio}%` }} />
                        </i>
                      )}
                    </li>
                  ))}
                </ul>

                <div className="buy">
                  <span className="stock">
                    {lang === 'ar'
                      ? 'استفسر في المعرض'
                      : 'Renseignements en magasin'}
                  </span>
                  <div className="product-actions">
                    <a
                      className="btn btn-g wa-link"
                      href={buildWhatsAppUrl(waMsg)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {lang === 'ar'
                        ? 'سول على الثمن والتوفر'
                        : 'Vérifier prix & disponibilité'}{' '}
                      <span className="arr" aria-hidden="true">
                        ↗
                      </span>
                    </a>

                    <div
                      className={
                        x.category !== 'piece'
                          ? 'product-secondary-actions'
                          : 'w-full'
                      }
                    >
                      <button
                        type="button"
                        className="btn btn-o"
                        onClick={() => onInspectProduct(x)}
                      >
                        {lang === 'ar' ? 'نظرة سريعة' : 'Vue rapide'}
                      </button>

                      {x.category !== 'piece' && (
                        <button
                          type="button"
                          className={`btn btn-o cmp-btn ${
                            isSelected ? 'sel' : ''
                          }`}
                          aria-pressed={isSelected}
                          onClick={() => onToggleCompare(x.id)}
                        >
                          {compareBtnText}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Vocal WhatsApp Note */}
        <p className="vocal">
          <span className="vic" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="9" y="3" width="6" height="11" rx="3" />
              <path d="M5 11a7 7 0 0014 0M12 18v3" />
            </svg>
          </span>
          <span>
            {lang === 'ar'
              ? 'جواب سريع — تقدر تكتب ولا تصيفط رسالة صوتية (أوديو) على واتساب.'
              : 'Réponse rapide — vous pouvez écrire ou envoyer un message vocal (audio) sur WhatsApp.'}
          </span>
        </p>

        {/* Conversion Strip */}
        <div className="conversion-strip">
          <div>
            <strong>
              {lang === 'ar'
                ? 'هل تحتار بين طرازين؟'
                : 'Vous hésitez entre deux modèles ?'}
            </strong>
            <p>
              {lang === 'ar'
                ? 'أرسل لنا تفاصيل تنقلاتك اليومية وميزانيتك، وسنساعدك في مقارنة الخيارات المتاحة.'
                : 'Envoyez-nous votre trajet quotidien et votre budget. On vous aidera à comparer les options disponibles.'}
            </p>
          </div>
          <a
            className="btn btn-g wa-link"
            href={buildWhatsAppUrl(
              lang === 'ar'
                ? 'السلام عليكم NeoRide، واش تقدرو تعاونوني نختار موطور كهربائي على حساب الميزانية والمسافات ديالي؟'
                : 'Bonjour NeoRide, pouvez-vous m’aider à choisir une moto électrique selon mon budget et mes trajets ?'
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            {lang === 'ar' ? 'ساعدني في الاختيار' : 'M’aider à choisir'}{' '}
            <span className="arr" aria-hidden="true">
              ↗
            </span>
          </a>
        </div>
      </div>
    </section>
  );
};
