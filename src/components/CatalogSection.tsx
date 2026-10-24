import React, { useState } from 'react';
import {
  ArrowUpRight,
  SlidersHorizontal,
  Layers,
  Check,
  Mic,
  Eye,
  LayoutGrid,
  List,
} from 'lucide-react';
import {
  Lang,
  PRODUCTS,
  ProductCategory,
  ProductItem,
  buildWhatsAppUrl,
} from '../data/neorideData';
import { VehicleIllustration } from './VehicleIllustration';

interface CatalogSectionProps {
  lang: Lang;
  activeCategory: ProductCategory;
  onSelectCategory: (cat: ProductCategory) => void;
  compareIds: string[];
  onToggleCompare: (productId: string) => void;
  onInspectProduct: (product: ProductItem) => void;
  onBookTestRide: (productId: string) => void;
}

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  lang,
  activeCategory,
  onSelectCategory,
  compareIds,
  onToggleCompare,
  onInspectProduct,
  onBookTestRide,
}) => {
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'range-desc'>('default');
  const [selectedColors, setSelectedColors] = useState<Record<string, string>>({});
  const [xrayCards, setXrayCards] = useState<Record<string, boolean>>({});
  const [mobileCompact, setMobileCompact] = useState<boolean>(false);

  const categories: { id: ProductCategory; labelFr: string; labelAr: string; count: number }[] = [
    { id: 'all', labelFr: 'Tous les modèles', labelAr: 'الكل', count: PRODUCTS.length },
    {
      id: 'moto',
      labelFr: 'Motos Électriques',
      labelAr: 'دراجات كهربائية',
      count: PRODUCTS.filter((p) => p.category === 'moto').length,
    },
    {
      id: 'scoot',
      labelFr: 'Trottinettes & Scooters',
      labelAr: 'سكوترات وتروتينيت',
      count: PRODUCTS.filter((p) => p.category === 'scoot').length,
    },
    {
      id: 'piece',
      labelFr: 'Casques & Pièces',
      labelAr: 'خوذات وقطع غيار',
      count: PRODUCTS.filter((p) => p.category === 'piece').length,
    },
  ];

  const filteredProducts = PRODUCTS.filter(
    (item) => activeCategory === 'all' || item.category === activeCategory
  ).sort((a, b) => {
    if (sortBy === 'price-asc') return a.priceDh - b.priceDh;
    if (sortBy === 'range-desc') return b.rangeKm - a.rangeKm;
    return 0;
  });

  const toggleXray = (id: string) => {
    setXrayCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="catalogue" className="py-16 sm:py-24 border-b border-[#262b2f]">
      <div className="max-w-[1160px] mx-auto px-4 sm:px-6">
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <p className="text-xs font-mono-num text-[#9aa2a9] mb-2">
              {lang === 'ar' ? '01. الكتالوج والمواصفات' : '01. Catalogue & Fiches Techniques'}
            </p>
            <h2 className="text-silver font-display font-bold text-[clamp(1.85rem,4vw,3rem)] leading-[1.08] tracking-tight">
              {lang === 'ar' ? 'اختر وسيلة تنقلك الكهربائية' : 'Comparez les modèles disponibles'}
            </h2>
            <p className="text-[#9aa2a9] text-sm sm:text-base mt-2 max-w-[58ch]">
              {lang === 'ar'
                ? 'اختر اللون، تفحص المواصفات التقنية، قارن بين طرازين جنبًا إلى جنب، أو اطلب السعر والتوفر مباشرة عبر واتساب.'
                : 'Testez les coloris, affichez les points techniques en rayon X, comparez deux véhicules côte à côte ou vérifiez la disponibilité sur WhatsApp.'}
            </p>
          </div>

          {/* Sort & Mobile View Controls */}
          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-end">
            <div className="inline-flex items-center gap-2 bg-[#141719] border border-[#262b2f] rounded px-3 py-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#9aa2a9]" />
              <label htmlFor="catalog-sort" className="sr-only">
                {lang === 'ar' ? 'ترتيب حسب' : 'Trier par'}
              </label>
              <select
                id="catalog-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'default' | 'price-asc' | 'range-desc')}
                className="bg-transparent text-xs sm:text-sm font-medium text-[#f2f4f3] focus:outline-none cursor-pointer"
              >
                <option value="default" className="bg-[#141719]">
                  {lang === 'ar' ? 'الترتيب الافتراضي' : 'Tri recommandé'}
                </option>
                <option value="price-asc" className="bg-[#141719]">
                  {lang === 'ar' ? 'السعر: من الأقل للأعلى' : 'Prix : croissant'}
                </option>
                <option value="range-desc" className="bg-[#141719]">
                  {lang === 'ar' ? 'المدى: الأعلى أولًا' : 'Autonomie : maximale'}
                </option>
              </select>
            </div>

            {/* Mobile compact toggle */}
            <div className="flex sm:hidden items-center bg-[#141719] border border-[#262b2f] rounded p-0.5">
              <button
                type="button"
                onClick={() => setMobileCompact(false)}
                aria-label="Vue détaillée"
                className={`p-1.5 rounded transition-colors ${
                  !mobileCompact ? 'bg-[#2dff6e] text-[#05150b]' : 'text-[#9aa2a9]'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setMobileCompact(true)}
                aria-label="Vue liste compacte"
                className={`p-1.5 rounded transition-colors ${
                  mobileCompact ? 'bg-[#2dff6e] text-[#05150b]' : 'text-[#9aa2a9]'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Tabs (Functional Segmented Controls) */}
        <div
          role="group"
          aria-label={lang === 'ar' ? 'تصفية حسب الفئة' : 'Filtrer par catégorie'}
          className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar"
        >
          {categories.map((cat) => {
            const active = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                aria-pressed={active}
                onClick={() => onSelectCategory(cat.id)}
                className={`inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded text-xs sm:text-sm font-semibold border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-[#2dff6e] text-[#05150b] border-[#2dff6e]'
                    : 'bg-[#141719] text-[#d0d6dc] border-[#262b2f] hover:border-[#3a4147] hover:text-white'
                }`}
              >
                <span>{lang === 'ar' ? cat.labelAr : cat.labelFr}</span>
                <span
                  className={`text-xs font-mono-num ${
                    active ? 'text-[#05150b]/80' : 'text-[#9aa2a9]'
                  }`}
                >
                  ({cat.count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Responsive Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const activeColorId = selectedColors[product.id] || product.colors[0]?.id;
            const activeColorObj =
              product.colors.find((c) => c.id === activeColorId) || product.colors[0];
            const isCompared = compareIds.includes(product.id);
            const isXray = !!xrayCards[product.id];
            const isVehicle = product.category !== 'piece';

            const waMessage =
              lang === 'ar'
                ? `السلام عليكم NeoRide، أنا مهتم بـ: ${product.nameAr} (${activeColorObj.nameAr} — ${product.priceFormatted} درهم). واش ممكن تعطيوني الثمن النهائي والتوفر فالمعرض؟`
                : `Bonjour NeoRide, je suis intéressé par : ${product.name} (Finition ${activeColorObj.nameFr} — ${product.priceFormatted} DH). Pouvez-vous me renseigner sur le prix et la disponibilité ?`;

            return (
              <article
                key={product.id}
                className="group flex flex-col bg-[#141719] border border-[#262b2f] hover:border-[#3a4248] rounded overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
              >
                {/* Visual Header */}
                <div
                  className={`relative bg-[#101315] border-b border-[#262b2f] overflow-hidden ${
                    mobileCompact ? 'h-36 sm:h-auto sm:aspect-[16/10]' : 'aspect-[16/10]'
                  }`}
                >
                  <div
                    onClick={() => onInspectProduct(product)}
                    className="w-full h-full cursor-pointer"
                  >
                    <VehicleIllustration
                      kind={product.artKind}
                      accentColor={activeColorObj.hex}
                      showCallouts={isXray}
                      lang={lang}
                      label={lang === 'ar' ? product.nameAr : product.name}
                    />
                  </div>

                  {/* Top-Right Interactive X-Ray Toggle & Quick-View Trigger */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => toggleXray(product.id)}
                      aria-pressed={isXray}
                      className={`inline-flex items-center gap-1 min-h-[32px] px-2.5 py-1 rounded text-[11px] font-semibold border backdrop-blur-sm transition-colors cursor-pointer whitespace-nowrap ${
                        isXray
                          ? 'bg-[#2dff6e] text-[#05150b] border-[#2dff6e]'
                          : 'bg-[#0d0f10]/85 text-[#d0d6dc] border-[#2e3438] hover:text-white'
                      }`}
                    >
                      <Layers className="w-3 h-3" />
                      <span>{lang === 'ar' ? 'تفاصيل تقنية' : 'Rayon X'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onInspectProduct(product)}
                      aria-label={lang === 'ar' ? 'عرض البطاقة التقنية' : 'Voir la fiche complète'}
                      className="inline-flex items-center justify-center w-8 h-8 rounded bg-[#0d0f10]/85 text-[#d0d6dc] hover:text-[#2dff6e] border border-[#2e3438] backdrop-blur-sm transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Bottom-Left Color Swatch Picker */}
                  {product.colors.length > 1 && (
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-[#0d0f10]/85 border border-[#262b2f] px-2.5 py-1 rounded backdrop-blur-sm">
                      {product.colors.map((c) => {
                        const selected = c.id === activeColorObj.id;
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() =>
                              setSelectedColors((prev) => ({ ...prev, [product.id]: c.id }))
                            }
                            aria-label={lang === 'ar' ? c.nameAr : c.nameFr}
                            title={lang === 'ar' ? c.nameAr : c.nameFr}
                            className={`w-4 h-4 rounded-full transition-transform cursor-pointer ${
                              selected ? 'scale-125 ring-2 ring-white ring-offset-1 ring-offset-[#0d0f10]' : 'opacity-70 hover:opacity-100'
                            }`}
                            style={{ backgroundColor: c.hex }}
                          />
                        );
                      })}
                      <span className="text-[11px] text-[#c5ccd0] ms-1 whitespace-nowrap">
                        {lang === 'ar' ? activeColorObj.nameAr : activeColorObj.nameFr}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between gap-5">
                  <div>
                    {/* Quiet unboxed metadata line (Zero-Pill Discipline) */}
                    <div className="text-xs text-[#9aa2a9] mb-1.5">
                      {lang === 'ar' ? product.kickerAr : product.kickerFr}
                    </div>

                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-display font-bold text-xl text-[#f2f4f3] group-hover:text-[#2dff6e] transition-colors">
                        <button
                          type="button"
                          onClick={() => onInspectProduct(product)}
                          className="text-start cursor-pointer hover:underline"
                        >
                          {lang === 'ar' ? product.nameAr : product.name}
                        </button>
                      </h3>

                      <div className="font-display font-extrabold text-xl text-[#2dff6e] tabular-nums bidi-plain shrink-0">
                        {product.priceFormatted} <span className="text-xs font-normal text-[#9aa2a9]">DH</span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-[#9aa2a9] mt-1.5 line-clamp-2">
                      {lang === 'ar' ? product.subtitleAr : product.subtitleFr}
                    </p>

                    {/* 2x2 Spec Grid with Tabular Numerals */}
                    <ul className="grid grid-cols-2 gap-2.5 mt-4 pt-4 border-t border-[#262b2f]">
                      {product.specs.map((sp, idx) => (
                        <li
                          key={idx}
                          className="p-2.5 rounded bg-[#0d0f10]/70 border border-[#22272b]"
                        >
                          <div className="font-display font-bold text-base sm:text-lg text-[#f2f4f3] tabular-nums bidi-plain leading-tight">
                            {sp.value}
                          </div>
                          <div className="text-[11px] text-[#9aa2a9] mt-0.5">
                            {lang === 'ar' ? sp.labelAr : sp.labelFr}
                          </div>
                          {typeof sp.ratio === 'number' && (
                            <div
                              aria-hidden="true"
                              className="h-1 w-full bg-[#22272b] rounded-full overflow-hidden mt-2"
                            >
                              <div
                                className="h-full bg-[#2dff6e]"
                                style={{ width: `${sp.ratio}%` }}
                              />
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Card Actions */}
                  <div className="pt-2 space-y-2">
                    <div className="flex items-center justify-between text-xs text-[#9aa2a9] mb-2">
                      <span>
                        {lang === 'ar'
                          ? 'متوفر للمعاينة في معرض بركان'
                          : 'Renseignements & essai à Berkane'}
                      </span>
                      {product.costPer100KmDh > 0 && (
                        <span className="font-mono-num text-[#d0d6dc]">
                          ~{product.costPer100KmDh.toString().replace('.', ',')} DH / 100 km
                        </span>
                      )}
                    </div>

                    <a
                      href={buildWhatsAppUrl(waMessage)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 bg-[#2dff6e] hover:bg-white text-[#05150b] font-bold text-sm rounded transition-colors whitespace-nowrap"
                    >
                      <span>
                        {lang === 'ar' ? 'استفسر عن السعر والتوفر' : 'Vérifier prix & disponibilité'}
                      </span>
                      <ArrowUpRight className="w-4 h-4 flip-rtl" />
                    </a>

                    {isVehicle ? (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => onToggleCompare(product.id)}
                          aria-pressed={isCompared}
                          className={`inline-flex items-center justify-center gap-1.5 min-h-[40px] px-3 py-1.5 text-xs font-semibold rounded border transition-colors cursor-pointer whitespace-nowrap ${
                            isCompared
                              ? 'bg-[#2dff6e]/15 text-[#2dff6e] border-[#2dff6e]'
                              : 'bg-[#1a1e21] hover:bg-[#242a2e] text-[#d0d6dc] border-[#2e3438]'
                          }`}
                        >
                          {isCompared && <Check className="w-3.5 h-3.5" />}
                          <span>
                            {isCompared
                              ? lang === 'ar'
                                ? 'مضاف للمقارنة'
                                : 'Dans le comparateur'
                              : lang === 'ar'
                              ? 'قارن هذا الطراز'
                              : 'Comparer'}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onBookTestRide(product.id)}
                          className="inline-flex items-center justify-center gap-1.5 min-h-[40px] px-3 py-1.5 text-xs font-semibold rounded bg-[#1a1e21] hover:bg-[#242a2e] text-[#f2f4f3] border border-[#2e3438] transition-colors cursor-pointer whitespace-nowrap"
                        >
                          <span>{lang === 'ar' ? 'جرّبه في بركان' : 'Réserver un essai'}</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onInspectProduct(product)}
                        className="w-full inline-flex items-center justify-center gap-1.5 min-h-[40px] px-3 py-1.5 text-xs font-semibold rounded bg-[#1a1e21] hover:bg-[#242a2e] text-[#f2f4f3] border border-[#2e3438] transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <span>
                          {lang === 'ar' ? 'عرض التفاصيل والتوافق' : 'Voir détails & compatibilité'}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Voice Note & Personal Advice Conversion Strip */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center p-5 sm:p-6 rounded bg-[#141719] border border-[#262b2f]">
          <div className="lg:col-span-8 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-[#1a1e21] border border-[#2e3438] flex items-center justify-center shrink-0 text-[#2dff6e]">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base sm:text-lg text-[#f2f4f3]">
                {lang === 'ar'
                  ? 'هل تحتار بين طرازين؟ أرسل رسالة مكتوبة أو أوديو عبر واتساب'
                  : 'Vous hésitez entre deux modèles ? Écrivez ou envoyez un vocal sur WhatsApp'}
              </h3>
              <p className="text-xs sm:text-sm text-[#9aa2a9] mt-0.5">
                {lang === 'ar'
                  ? 'أخبرنا بمسافتك اليومية وميزانيتك، أو أرسل صورة لقطعة الغيار التي تبحث عنها — نرد عليك بسرعة من معرض بركان.'
                  : 'Indiquez votre trajet quotidien et votre budget (ou envoyez la photo d’une pièce) : notre équipe à Berkane vous répond rapidement.'}
              </p>
            </div>
          </div>

          <div className="lg:col-span-4 flex sm:justify-end">
            <a
              href={buildWhatsAppUrl(
                lang === 'ar'
                  ? 'السلام عليكم NeoRide، واش تقدرو تعاونوني نختار موطور كهربائي على حساب الميزانية والمسافات ديالي؟'
                  : 'Bonjour NeoRide, pouvez-vous m’aider à choisir une moto électrique selon mon budget et mes trajets ?'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[46px] px-5 py-2.5 bg-[#2dff6e] hover:bg-white text-[#05150b] font-bold text-sm rounded transition-colors whitespace-nowrap"
            >
              <span>{lang === 'ar' ? 'ساعدني في الاختيار' : 'M’aider à choisir'}</span>
              <ArrowUpRight className="w-4 h-4 flip-rtl" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
