import React, { useState } from 'react';
import { X, Check, ArrowUpRight, RotateCcw } from 'lucide-react';
import {
  Lang,
  PRODUCTS,
  VEHICLE_PRODUCTS,
  ProductItem,
  buildWhatsAppUrl,
} from '../data/neorideData';
import { VehicleIllustration } from './VehicleIllustration';

interface CompareAndQuickViewModalsProps {
  lang: Lang;
  compareIds: string[];
  onRemoveCompare: (id: string) => void;
  onSetComparePair: (idA: string, idB: string) => void;
  onClearCompare: () => void;
  isCompareModalOpen: boolean;
  onOpenCompareModal: () => void;
  onCloseCompareModal: () => void;
  inspectedProduct: ProductItem | null;
  onCloseInspectModal: () => void;
  onBookTestRide: (productId: string) => void;
}

export const CompareAndQuickViewModals: React.FC<CompareAndQuickViewModalsProps> = ({
  lang,
  compareIds,
  onRemoveCompare,
  onSetComparePair,
  onClearCompare,
  isCompareModalOpen,
  onOpenCompareModal,
  onCloseCompareModal,
  inspectedProduct,
  onCloseInspectModal,
  onBookTestRide,
}) => {
  const [inspectColorId, setInspectColorId] = useState<string>('');

  const modelA = VEHICLE_PRODUCTS.find((p) => p.id === compareIds[0]) || null;
  const modelB = VEHICLE_PRODUCTS.find((p) => p.id === compareIds[1]) || null;

  // Suggest a complementary second vehicle if only 1 is selected
  const suggestedSecond =
    modelA && !modelB
      ? VEHICLE_PRODUCTS.find((p) => p.id !== modelA.id) || null
      : null;

  return (
    <>
      {/* 1. PERSISTENT COMPARE TRAY (Replaces mobile bottom dock when active to respect 15% sticky cap) */}
      {compareIds.length > 0 && !isCompareModalOpen && (
        <div
          role="region"
          aria-label={lang === 'ar' ? 'مقارنة الطرازات' : 'Comparaison de modèles'}
          className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 w-[min(680px,calc(100%-24px))] bg-[#141719]/95 border border-[#2dff6e] rounded p-3 shadow-[0_12px_36px_rgba(0,0,0,0.75)] backdrop-blur-md"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            {/* Slots */}
            <div className="flex items-center gap-2 min-w-0 flex-1">
              {modelA && (
                <div className="flex items-center gap-2 bg-[#1a1e21] border border-[#2e3438] rounded px-2.5 py-1.5 min-w-0 flex-1">
                  <div className="w-9 h-6 rounded overflow-hidden shrink-0 hidden xs:block">
                    <VehicleIllustration kind={modelA.artKind} />
                  </div>
                  <span className="text-xs font-bold text-[#f2f4f3] truncate">
                    {modelA.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemoveCompare(modelA.id)}
                    aria-label={`Retirer ${modelA.name}`}
                    className="ms-auto text-[#9aa2a9] hover:text-white p-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <span className="font-display font-extrabold text-xs text-[#2dff6e] shrink-0">
                VS
              </span>

              {modelB ? (
                <div className="flex items-center gap-2 bg-[#1a1e21] border border-[#2e3438] rounded px-2.5 py-1.5 min-w-0 flex-1">
                  <div className="w-9 h-6 rounded overflow-hidden shrink-0 hidden xs:block">
                    <VehicleIllustration kind={modelB.artKind} />
                  </div>
                  <span className="text-xs font-bold text-[#f2f4f3] truncate">
                    {modelB.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemoveCompare(modelB.id)}
                    aria-label={`Retirer ${modelB.name}`}
                    className="ms-auto text-[#9aa2a9] hover:text-white p-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-2 bg-[#0d0f10] border border-dashed border-[#3a4248] rounded px-2.5 py-1.5 min-w-0 flex-1">
                  <span className="text-xs text-[#9aa2a9] truncate">
                    {lang === 'ar' ? '+ اختر طرازًا ثانيًا' : '+ Choisissez un 2e modèle'}
                  </span>
                  {suggestedSecond && (
                    <button
                      type="button"
                      onClick={() => {
                        onSetComparePair(modelA!.id, suggestedSecond.id);
                        onOpenCompareModal();
                      }}
                      className="text-[11px] font-semibold text-[#2dff6e] hover:underline whitespace-nowrap cursor-pointer"
                    >
                      + {suggestedSecond.name}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Tray Actions */}
            <div className="flex items-center justify-end gap-2 shrink-0">
              <button
                type="button"
                disabled={!modelA || !modelB}
                onClick={onOpenCompareModal}
                className="flex-1 sm:flex-initial min-h-[38px] px-4 py-1.5 rounded bg-[#2dff6e] disabled:opacity-40 text-[#05150b] font-bold text-xs sm:text-sm cursor-pointer whitespace-nowrap"
              >
                {lang === 'ar' ? 'عرض المقارنة' : 'Comparer maintenant'}
              </button>
              <button
                type="button"
                onClick={onClearCompare}
                aria-label={lang === 'ar' ? 'إلغاء المقارنة' : 'Annuler la comparaison'}
                className="min-h-[38px] px-2.5 rounded bg-[#1a1e21] hover:bg-[#262b2f] text-[#9aa2a9] hover:text-white border border-[#2e3438] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. SIDE-BY-SIDE COMPARISON MODAL */}
      {isCompareModalOpen && modelA && modelB && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="compare-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) onCloseCompareModal();
          }}
        >
          <div className="w-full max-w-[760px] bg-[#141719] border border-[#2e3438] rounded overflow-hidden my-auto max-h-[92svh] flex flex-col">
            {/* Header */}
            <div className="px-5 py-4 border-b border-[#262b2f] flex items-center justify-between gap-4">
              <h2
                id="compare-modal-title"
                className="text-silver font-display font-bold text-xl sm:text-2xl"
              >
                {lang === 'ar' ? 'مقارنة الطرازات جنبًا إلى جنب' : 'Comparaison côte à côte'}
              </h2>
              <button
                type="button"
                onClick={onCloseCompareModal}
                aria-label={lang === 'ar' ? 'إغلاق' : 'Fermer'}
                className="w-9 h-9 rounded bg-[#1a1e21] hover:bg-[#262b2f] text-[#f2f4f3] grid place-items-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 overflow-y-auto space-y-5">
              {/* Selectors + Visuals */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    model: modelA,
                    other: modelB,
                    onChange: (newId: string) => {
                      if (newId === modelB.id) {
                        onSetComparePair(newId, modelA.id);
                      } else {
                        onSetComparePair(newId, modelB.id);
                      }
                    },
                  },
                  {
                    model: modelB,
                    other: modelA,
                    onChange: (newId: string) => {
                      if (newId === modelA.id) {
                        onSetComparePair(modelB.id, newId);
                      } else {
                        onSetComparePair(modelA.id, newId);
                      }
                    },
                  },
                ].map((slot, idx) => (
                  <div key={idx} className="bg-[#0d0f10] border border-[#262b2f] rounded p-3">
                    <select
                      aria-label={idx === 0 ? 'Modèle A' : 'Modèle B'}
                      value={slot.model.id}
                      onChange={(e) => slot.onChange(e.target.value)}
                      className="w-full min-h-[40px] px-2.5 rounded bg-[#141719] border border-[#2e3438] text-xs sm:text-sm font-bold text-[#f2f4f3] mb-2.5 cursor-pointer"
                    >
                      {VEHICLE_PRODUCTS.map((v) => (
                        <option key={v.id} value={v.id} className="bg-[#141719]">
                          {v.name}
                        </option>
                      ))}
                    </select>
                    <div className="aspect-[16/10] rounded overflow-hidden border border-[#22272b]">
                      <VehicleIllustration kind={slot.model.artKind} lang={lang} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Comparison Table */}
              <div className="overflow-x-auto border border-[#262b2f] rounded">
                <table className="w-full text-start border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-[#0d0f10] border-b border-[#262b2f]">
                      <th className="py-3 px-3.5 text-start font-medium text-[#9aa2a9] w-[30%]">
                        {lang === 'ar' ? 'المعيار' : 'Critère'}
                      </th>
                      <th className="py-3 px-3.5 text-start font-display font-bold text-[#f2f4f3]">
                        {modelA.name}
                      </th>
                      <th className="py-3 px-3.5 text-start font-display font-bold text-[#f2f4f3]">
                        {modelB.name}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#262b2f]">
                    {[
                      {
                        labelFr: 'Prix indicatif',
                        labelAr: 'السعر',
                        valA: `${modelA.priceFormatted} DH`,
                        valB: `${modelB.priceFormatted} DH`,
                        winA: modelA.priceDh < modelB.priceDh,
                        winB: modelB.priceDh < modelA.priceDh,
                      },
                      {
                        labelFr: 'Autonomie par charge',
                        labelAr: 'المدى في الشحنة',
                        valA: `${modelA.rangeKm} km`,
                        valB: `${modelB.rangeKm} km`,
                        winA: modelA.rangeKm > modelB.rangeKm,
                        winB: modelB.rangeKm > modelA.rangeKm,
                      },
                      {
                        labelFr: 'Vitesse maximale',
                        labelAr: 'السرعة القصوى',
                        valA: `${modelA.speedKmh} km/h`,
                        valB: `${modelB.speedKmh} km/h`,
                        winA: modelA.speedKmh > modelB.speedKmh,
                        winB: modelB.speedKmh > modelA.speedKmh,
                      },
                      {
                        labelFr: 'Temps de charge (220V)',
                        labelAr: 'مدة الشحن (220V)',
                        valA: `${modelA.chargeHours} h`,
                        valB: `${modelB.chargeHours} h`,
                        winA: modelA.chargeHours < modelB.chargeHours,
                        winB: modelB.chargeHours < modelA.chargeHours,
                      },
                      {
                        labelFr: 'Batterie',
                        labelAr: 'البطارية',
                        valA: lang === 'ar' ? modelA.batteryLabelAr : modelA.batteryLabelFr,
                        valB: lang === 'ar' ? modelB.batteryLabelAr : modelB.batteryLabelFr,
                        winA: false,
                        winB: false,
                      },
                    ].map((row, rIdx) => (
                      <tr key={rIdx} className="bg-[#141719]">
                        <th className="py-3 px-3.5 text-start font-medium text-[#9aa2a9]">
                          {lang === 'ar' ? row.labelAr : row.labelFr}
                        </th>
                        <td
                          className={`py-3 px-3.5 tabular-nums bidi-plain ${
                            row.winA ? 'text-[#2dff6e] font-bold' : 'text-[#f2f4f3]'
                          }`}
                        >
                          {row.valA} {row.winA && '✓'}
                        </td>
                        <td
                          className={`py-3 px-3.5 tabular-nums bidi-plain ${
                            row.winB ? 'text-[#2dff6e] font-bold' : 'text-[#f2f4f3]'
                          }`}
                        >
                          {row.valB} {row.winB && '✓'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Natural-language verdict */}
              <div className="p-3.5 rounded bg-[#0d0f10] border border-[#262b2f] text-xs sm:text-sm text-[#d0d6dc]">
                {(() => {
                  const dk = modelA.rangeKm - modelB.rangeKm;
                  const dp = modelA.priceDh - modelB.priceDh;
                  const parts: string[] = [];
                  if (dk !== 0) {
                    const longer = dk > 0 ? modelA.name : modelB.name;
                    parts.push(
                      lang === 'ar'
                        ? `${longer} يمنحك مدى أطول بـ +${Math.abs(dk)} كم`
                        : `${longer} offre +${Math.abs(dk)} km d’autonomie supplémentaire`
                    );
                  }
                  if (dp !== 0) {
                    const cheaper = dp < 0 ? modelA.name : modelB.name;
                    const diffFormatted = Math.abs(dp)
                      .toLocaleString('fr-FR')
                      .replace(/\u202f/g, '\u00a0');
                    parts.push(
                      lang === 'ar'
                        ? `${cheaper} أقل تكلفة بفارق ${diffFormatted} درهم`
                        : `${cheaper} coûte ${diffFormatted} DH de moins`
                    );
                  }
                  return parts.join(' · ') + '.';
                })()}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-5 py-4 border-t border-[#262b2f] bg-[#0d0f10] flex flex-wrap items-center justify-between gap-3">
              <a
                href={buildWhatsAppUrl(
                  lang === 'ar'
                    ? `السلام عليكم NeoRide، كنقارن بين ${modelA.name} (${modelA.priceFormatted} درهم) و ${modelB.name} (${modelB.priceFormatted} درهم). شنو كتنصحوني حسب المسافات والميزانية ديالي؟`
                    : `Bonjour NeoRide, je compare ${modelA.name} (${modelA.priceFormatted} DH) et ${modelB.name} (${modelB.priceFormatted} DH). Lequel me conseillez-vous selon mes trajets et mon budget ?`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2 bg-[#2dff6e] hover:bg-white text-[#05150b] font-bold text-sm rounded transition-colors whitespace-nowrap"
              >
                <span>
                  {lang === 'ar' ? 'اسأل المعرض عن الطرازين' : 'Demander conseil sur ces 2 modèles'}
                </span>
                <ArrowUpRight className="w-4 h-4 flip-rtl" />
              </a>

              <button
                type="button"
                onClick={onClearCompare}
                className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded bg-[#1a1e21] hover:bg-[#262b2f] text-xs font-semibold text-[#d0d6dc] border border-[#2e3438] cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'إفراغ المقارنة' : 'Réinitialiser'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. PRODUCT TECHNICAL INSPECTOR MODAL */}
      {inspectedProduct && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="inspect-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) onCloseInspectModal();
          }}
        >
          {(() => {
            const activeColor =
              inspectedProduct.colors.find((c) => c.id === inspectColorId) ||
              inspectedProduct.colors[0];

            return (
              <div className="w-full max-w-[780px] bg-[#141719] border border-[#2e3438] rounded overflow-hidden my-auto max-h-[92svh] flex flex-col">
                <div className="px-5 py-4 border-b border-[#262b2f] flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs text-[#9aa2a9]">
                      {lang === 'ar' ? inspectedProduct.kickerAr : inspectedProduct.kickerFr}
                    </div>
                    <h2
                      id="inspect-modal-title"
                      className="font-display font-bold text-xl sm:text-2xl text-[#f2f4f3]"
                    >
                      {lang === 'ar' ? inspectedProduct.nameAr : inspectedProduct.name}
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={onCloseInspectModal}
                    aria-label={lang === 'ar' ? 'إغلاق' : 'Fermer'}
                    className="w-9 h-9 rounded bg-[#1a1e21] hover:bg-[#262b2f] text-[#f2f4f3] grid place-items-center cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-5 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  {/* Left Visual + Color Switcher */}
                  <div className="md:col-span-6 space-y-3">
                    <div className="aspect-[16/11] rounded overflow-hidden border border-[#262b2f] bg-[#0d0f10]">
                      <VehicleIllustration
                        kind={inspectedProduct.artKind}
                        accentColor={activeColor.hex}
                        showCallouts={true}
                        lang={lang}
                      />
                    </div>

                    {inspectedProduct.colors.length > 1 && (
                      <div className="flex items-center justify-between p-3 rounded bg-[#0d0f10] border border-[#262b2f]">
                        <span className="text-xs text-[#9aa2a9]">
                          {lang === 'ar' ? 'اللون:' : 'Finition :'}
                        </span>
                        <div className="flex items-center gap-2">
                          {inspectedProduct.colors.map((c) => (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => setInspectColorId(c.id)}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium border cursor-pointer ${
                                activeColor.id === c.id
                                  ? 'border-white bg-[#1a1e21] text-white'
                                  : 'border-transparent text-[#9aa2a9] hover:text-white'
                              }`}
                            >
                              <span
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: c.hex }}
                              />
                              <span>{lang === 'ar' ? c.nameAr : c.nameFr}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 2x2 Specs */}
                    <div className="grid grid-cols-2 gap-2">
                      {inspectedProduct.specs.map((s, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded bg-[#0d0f10] border border-[#262b2f]"
                        >
                          <div className="font-display font-bold text-base text-[#f2f4f3] tabular-nums bidi-plain">
                            {s.value}
                          </div>
                          <div className="text-[11px] text-[#9aa2a9]">
                            {lang === 'ar' ? s.labelAr : s.labelFr}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Highlights & Purchase Module */}
                  <div className="md:col-span-6 space-y-4">
                    <div className="p-4 rounded bg-[#0d0f10] border border-[#262b2f] flex items-baseline justify-between">
                      <span className="text-xs text-[#9aa2a9]">
                        {lang === 'ar' ? 'السعر في المعرض' : 'Prix indicatif showroom'}
                      </span>
                      <strong className="font-display font-extrabold text-2xl text-[#2dff6e] tabular-nums bidi-plain">
                        {inspectedProduct.priceFormatted} DH
                      </strong>
                    </div>

                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-[#9aa2a9] mb-2.5">
                        {lang === 'ar' ? 'أبرز المواصفات التقنية' : 'Points forts & équipements'}
                      </h3>
                      <ul className="space-y-2 text-xs sm:text-sm text-[#d0d6dc]">
                        {(lang === 'ar'
                          ? inspectedProduct.highlightsAr
                          : inspectedProduct.highlightsFr
                        ).map((hl, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-[#2dff6e] shrink-0 mt-0.5" />
                            <span>{hl}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3.5 rounded bg-[#0d0f10] border border-[#262b2f] text-xs">
                      <strong className="text-[#f2f4f3] block mb-0.5">
                        {lang === 'ar' ? 'مثالي لـ:' : 'Usage recommandé :'}
                      </strong>
                      <span className="text-[#9aa2a9]">
                        {lang === 'ar' ? inspectedProduct.idealForAr : inspectedProduct.idealForFr}
                      </span>
                    </div>

                    <div className="pt-2 space-y-2">
                      <a
                        href={buildWhatsAppUrl(
                          lang === 'ar'
                            ? `السلام عليكم NeoRide، أنا مهتم بـ: ${inspectedProduct.nameAr} (${activeColor.nameAr} — ${inspectedProduct.priceFormatted} درهم). واش متوفر حاليا فالمعرض؟`
                            : `Bonjour NeoRide, je suis intéressé par : ${inspectedProduct.name} (${activeColor.nameFr} — ${inspectedProduct.priceFormatted} DH). Est-il disponible au showroom ?`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 min-h-[46px] px-5 py-2.5 bg-[#2dff6e] hover:bg-white text-[#05150b] font-bold text-sm rounded transition-colors"
                      >
                        <span>
                          {lang === 'ar'
                            ? 'تأكيد السعر والتوفر عبر واتساب'
                            : 'Vérifier la disponibilité sur WhatsApp'}
                        </span>
                        <ArrowUpRight className="w-4 h-4 flip-rtl" />
                      </a>

                      {inspectedProduct.category !== 'piece' && (
                        <button
                          type="button"
                          onClick={() => {
                            const id = inspectedProduct.id;
                            onCloseInspectModal();
                            onBookTestRide(id);
                          }}
                          className="w-full inline-flex items-center justify-center min-h-[42px] px-4 py-2 bg-[#1a1e21] hover:bg-[#262b2f] text-[#f2f4f3] border border-[#2e3438] font-semibold text-xs sm:text-sm rounded transition-colors cursor-pointer"
                        >
                          {lang === 'ar'
                            ? 'حجز موعد لتجربة هذا الطراز في بركان'
                            : 'Réserver un essai de ce modèle à Berkane'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </>
  );
};
