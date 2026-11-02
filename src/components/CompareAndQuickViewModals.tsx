import React, { useState } from 'react';
import { X, Check, RotateCcw } from 'lucide-react';
import {
  Lang,
  VEHICLE_PRODUCTS,
  ProductItem,
  buildWhatsAppUrl,
} from '../data/neorideData';
import { VehicleIllustration } from './VehicleIllustration';

interface CompareAndQuickViewModalsProps {
  lang: Lang;
  compareIds: string[];
  curCarouselModelId: string | null;
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
  curCarouselModelId,
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
  const [inspectXray, setInspectXray] = useState<boolean>(true);

  const modelA = VEHICLE_PRODUCTS.find((p) => p.id === compareIds[0]) || null;
  const modelB = VEHICLE_PRODUCTS.find((p) => p.id === compareIds[1]) || null;

  const suggestedSecond =
    modelA && !modelB
      ? VEHICLE_PRODUCTS.find(
          (p) => p.id === curCarouselModelId && p.id !== modelA.id
        ) ||
        VEHICLE_PRODUCTS.find((p) => p.id !== modelA.id) ||
        null
      : null;

  return (
    <>
      {/* 1. PERSISTENT COMPARE TRAY (.ctray) */}
      {compareIds.length > 0 && !isCompareModalOpen && (
        <div
          id="ctray"
          className="ctray"
          role="region"
          aria-label={lang === 'ar' ? 'مقارنة الطرازات' : 'Comparaison de modèles'}
        >
          <div className="ctslots">
            {/* Slot 1 */}
            <div className="cts" id="cts0">
              {modelA && (
                <>
                  <span className="cth">
                    <VehicleIllustration kind={modelA.artKind} />
                  </span>
                  <b>{modelA.name}</b>
                  <button
                    type="button"
                    onClick={() => onRemoveCompare(modelA.id)}
                    aria-label={`Retirer ${modelA.name}`}
                  >
                    ✕
                  </button>
                </>
              )}
            </div>

            <span className="ctvs" aria-hidden="true">
              VS
            </span>

            {/* Slot 2 */}
            <div className="cts" id="cts1">
              {modelB ? (
                <>
                  <span className="cth">
                    <VehicleIllustration kind={modelB.artKind} />
                  </span>
                  <b>{modelB.name}</b>
                  <button
                    type="button"
                    onClick={() => onRemoveCompare(modelB.id)}
                    aria-label={`Retirer ${modelB.name}`}
                  >
                    ✕
                  </button>
                </>
              ) : (
                <span className="empty">
                  +{' '}
                  <span>
                    {lang === 'ar'
                      ? 'اختر طرازًا ثانيًا'
                      : 'Choisissez un 2e modèle'}
                  </span>
                </span>
              )}
            </div>
          </div>

          <div className="ctact">
            {suggestedSecond && (
              <button
                type="button"
                id="ctadd"
                className="btn btn-o"
                onClick={() => {
                  onSetComparePair(modelA!.id, suggestedSecond.id);
                  onOpenCompareModal();
                }}
              >
                {(lang === 'ar' ? 'قارن مع ' : 'Comparer avec ') +
                  suggestedSecond.name}
              </button>
            )}

            <button
              type="button"
              id="ctgo"
              className="btn btn-g"
              disabled={!modelA || !modelB}
              onClick={onOpenCompareModal}
            >
              {lang === 'ar' ? 'عرض المقارنة' : 'Voir la comparaison'}
            </button>

            <button
              type="button"
              id="ctclr"
              className="ctclr"
              onClick={onClearCompare}
              aria-label={
                lang === 'ar' ? 'إلغاء المقارنة' : 'Annuler la comparaison'
              }
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* 2. SIDE-BY-SIDE COMPARISON MODAL (dialog.cd) */}
      {isCompareModalOpen && modelA && modelB && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cdt"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-[rgba(5,8,6,0.84)] backdrop-blur-md overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) onCloseCompareModal();
          }}
        >
          <div className="cd">
            <div className="cdh">
              <h2 id="cdt" className="si">
                {lang === 'ar' ? 'مقارنة الطرازات' : 'Comparaison'}
              </h2>
              <button
                type="button"
                id="cdx"
                onClick={onCloseCompareModal}
                aria-label={lang === 'ar' ? 'إغلاق' : 'Fermer'}
              >
                ✕
              </button>
            </div>

            <div className="cds">
              <label>
                <span className="sr">
                  {lang === 'ar' ? 'الطراز أ' : 'Modèle A'}
                </span>
                <select
                  id="csa"
                  value={modelA.id}
                  onChange={(e) => {
                    const nextId = e.target.value;
                    if (nextId === modelB.id) {
                      onSetComparePair(nextId, modelA.id);
                    } else {
                      onSetComparePair(nextId, modelB.id);
                    }
                  }}
                >
                  {VEHICLE_PRODUCTS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span className="sr">
                  {lang === 'ar' ? 'الطراز ب' : 'Modèle B'}
                </span>
                <select
                  id="csb"
                  value={modelB.id}
                  onChange={(e) => {
                    const nextId = e.target.value;
                    if (nextId === modelA.id) {
                      onSetComparePair(modelB.id, nextId);
                    } else {
                      onSetComparePair(modelA.id, nextId);
                    }
                  }}
                >
                  {VEHICLE_PRODUCTS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <table>
              <caption className="sr">
                {modelA.name} vs {modelB.name}
              </caption>
              <thead>
                <tr>
                  <th scope="col">
                    <span className="sr">
                      {lang === 'ar' ? 'المعيار' : 'Critère'}
                    </span>
                  </th>
                  <th scope="col" id="cha">
                    {modelA.name}
                  </th>
                  <th scope="col" id="chb">
                    {modelB.name}
                  </th>
                </tr>
              </thead>
              <tbody id="ctb">
                {[
                  {
                    labelFr: 'Prix',
                    labelAr: 'السعر',
                    valA: `${modelA.priceFormatted} DH`,
                    valB: `${modelB.priceFormatted} DH`,
                    winA: modelA.priceDh < modelB.priceDh,
                    winB: modelB.priceDh < modelA.priceDh,
                  },
                  {
                    labelFr: 'Autonomie',
                    labelAr: 'المدى',
                    valA: `${modelA.rangeKm} km`,
                    valB: `${modelB.rangeKm} km`,
                    winA: modelA.rangeKm > modelB.rangeKm,
                    winB: modelB.rangeKm > modelA.rangeKm,
                  },
                  {
                    labelFr: 'Vitesse max',
                    labelAr: 'السرعة القصوى',
                    valA: `${modelA.speedKmh} km/h`,
                    valB: `${modelB.speedKmh} km/h`,
                    winA: modelA.speedKmh > modelB.speedKmh,
                    winB: modelB.speedKmh > modelA.speedKmh,
                  },
                  {
                    labelFr: 'Temps de charge',
                    labelAr: 'مدة الشحن',
                    valA: `${modelA.chargeHours} h`,
                    valB: `${modelB.chargeHours} h`,
                    winA: modelA.chargeHours < modelB.chargeHours,
                    winB: modelB.chargeHours < modelA.chargeHours,
                  },
                  {
                    labelFr: 'Batterie',
                    labelAr: 'البطارية',
                    valA:
                      lang === 'ar'
                        ? modelA.batteryLabelAr
                        : modelA.batteryLabelFr,
                    valB:
                      lang === 'ar'
                        ? modelB.batteryLabelAr
                        : modelB.batteryLabelFr,
                    winA: false,
                    winB: false,
                  },
                ].map((row, idx) => (
                  <tr key={idx}>
                    <th scope="row">
                      {lang === 'ar' ? row.labelAr : row.labelFr}
                    </th>
                    <td className={`num ${row.winA ? 'win' : ''}`}>
                      {row.valA}
                      {row.winA ? ' ✓' : ''}
                    </td>
                    <td className={`num ${row.winB ? 'win' : ''}`}>
                      {row.valB}
                      {row.winB ? ' ✓' : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p id="csum" className="csum">
              {(() => {
                const dk = modelA.rangeKm - modelB.rangeKm;
                const dv = modelA.speedKmh - modelB.speedKmh;
                const dp = modelA.priceDh - modelB.priceDh;
                const pt: string[] = [];
                if (dk) {
                  pt.push(
                    lang === 'ar'
                      ? `${dk > 0 ? modelA.name : modelB.name} يقطع مسافة أطول (+${Math.abs(dk)} كم)`
                      : `${dk > 0 ? modelA.name : modelB.name} va plus loin (+${Math.abs(dk)} km)`
                  );
                }
                if (dv) {
                  pt.push(
                    lang === 'ar'
                      ? `${dv > 0 ? modelA.name : modelB.name} أسرع (+${Math.abs(dv)} كم/س)`
                      : `${dv > 0 ? modelA.name : modelB.name} est plus rapide (+${Math.abs(dv)} km/h)`
                  );
                }
                if (dp) {
                  pt.push(
                    lang === 'ar'
                      ? `${dp < 0 ? modelA.name : modelB.name} أقل سعرًا بـ ${Math.abs(dp)
                          .toLocaleString('fr-FR')
                          .replace(/\u202f/g, '\u00a0')} درهم`
                      : `${dp < 0 ? modelA.name : modelB.name} coûte ${Math.abs(dp)
                          .toLocaleString('fr-FR')
                          .replace(/\u202f/g, '\u00a0')} DH de moins`
                  );
                }
                return pt.length ? pt.join(' ; ') + '.' : '';
              })()}
            </p>

            <div className="cta mt-5">
              <a
                id="cwa"
                className="btn btn-g"
                href={buildWhatsAppUrl(
                  lang === 'ar'
                    ? `السلام عليكم NeoRide، كنقارن بين ${modelA.name} (${modelA.priceFormatted} درهم) و ${modelB.name} (${modelB.priceFormatted} درهم). شنو كتنصحوني حسب المسافات والميزانية ديالي؟`
                    : `Bonjour NeoRide, je compare ${modelA.name} (${modelA.priceFormatted} DH) et ${modelB.name} (${modelB.priceFormatted} DH). Lequel me conseillez-vous selon mes trajets et mon budget ?`
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                {lang === 'ar'
                  ? 'اسأل عن الطرازين'
                  : 'Demander ces deux modèles'}
              </a>

              <button
                type="button"
                id="crst"
                className="btn btn-o"
                onClick={onClearCompare}
              >
                <RotateCcw className="w-4 h-4" />
                <span>{lang === 'ar' ? 'إعادة ضبط' : 'Réinitialiser'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. QUICK-VIEW TECHNICAL CONFIGURATOR MODAL */}
      {inspectedProduct && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="inspect-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[rgba(5,8,6,0.85)] backdrop-blur-md overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) onCloseInspectModal();
          }}
        >
          {(() => {
            const activeColor =
              inspectedProduct.colors.find((c) => c.id === inspectColorId) ||
              inspectedProduct.colors[0];

            return (
              <div className="w-[min(820px,calc(100%-24px))] bg-[#181b1d] border border-[#2dff6e]/40 text-[#f2f4f3] p-5 sm:p-7 my-auto max-h-[92svh] overflow-y-auto shadow-[0_24px_64px_rgba(0,0,0,0.85)]">
                <div className="flex items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <div className="text-[11px] font-extrabold tracking-[0.15em] uppercase text-[#2dff6e]">
                      {lang === 'ar'
                        ? inspectedProduct.kickerAr
                        : inspectedProduct.kickerFr}
                    </div>
                    <h2
                      id="inspect-modal-title"
                      className="si text-2xl sm:text-3xl m-0 mt-1"
                    >
                      {lang === 'ar'
                        ? inspectedProduct.nameAr
                        : inspectedProduct.name}
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={onCloseInspectModal}
                    aria-label={lang === 'ar' ? 'إغلاق' : 'Fermer'}
                    className="min-w-[44px] min-h-[44px] bg-white/10 hover:bg-white/20 text-[#f2f4f3] grid place-items-center cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pt-5">
                  <div className="md:col-span-6 space-y-3">
                    <div className="relative aspect-[16/11] overflow-hidden border border-white/12 bg-[#121416]">
                      <VehicleIllustration
                        kind={inspectedProduct.artKind}
                        accentColor={activeColor.hex}
                        showCallouts={inspectXray}
                        lang={lang}
                      />
                      <button
                        type="button"
                        onClick={() => setInspectXray((prev) => !prev)}
                        className={`xray-btn absolute bottom-3 right-3 ${
                          inspectXray ? 'active' : ''
                        }`}
                      >
                        {inspectXray
                          ? lang === 'ar'
                            ? 'إخفاء X-Ray'
                            : 'Masquer X-Ray'
                          : lang === 'ar'
                          ? 'تفعيل X-Ray'
                          : 'Activer X-Ray'}
                      </button>
                    </div>

                    {inspectedProduct.colors.length > 1 && (
                      <div className="flex items-center justify-between p-3 bg-[#121314] border border-white/10">
                        <span className="text-xs font-semibold text-[#9aa2a9]">
                          {lang === 'ar' ? 'اللون المتوفر:' : 'Finition showroom :'}
                        </span>
                        <div className="flex items-center gap-2 flex-wrap">
                          {inspectedProduct.colors.map((c) => (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => setInspectColorId(c.id)}
                              className={`inline-flex items-center gap-1.5 min-h-[34px] px-2.5 py-1 text-xs font-bold border cursor-pointer transition-colors ${
                                activeColor.id === c.id
                                  ? 'border-[#2dff6e] bg-white/10 text-white'
                                  : 'border-transparent text-[#9aa2a9] hover:text-white'
                              }`}
                            >
                              <span
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: c.hex }}
                              />
                              <span>
                                {lang === 'ar' ? c.nameAr : c.nameFr}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      {inspectedProduct.specs.map((s, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-[#121314] border border-white/10"
                        >
                          <div className="si font-bold text-xl tabular-nums">
                            {s.value}
                          </div>
                          <div className="text-xs text-[#9aa2a9] mt-0.5">
                            {lang === 'ar' ? s.labelAr : s.labelFr}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-6 space-y-4">
                    <div className="p-4 bg-[#121314] border border-[#2dff6e]/30 flex items-baseline justify-between">
                      <div>
                        <span className="text-xs text-[#9aa2a9] block">
                          {lang === 'ar'
                            ? 'السعر في المعرض'
                            : 'Prix indicatif showroom'}
                        </span>
                        {inspectedProduct.monthlyEstimateDh && (
                          <span className="text-xs text-[#c3c9ce]">
                            {lang === 'ar'
                              ? `أو ~${inspectedProduct.monthlyEstimateDh} درهم/شهر`
                              : `ou ~${inspectedProduct.monthlyEstimateDh} DH/mois`}
                          </span>
                        )}
                      </div>
                      <strong className="font-extrabold text-2xl text-[#2dff6e] tabular-nums">
                        {inspectedProduct.priceFormatted} DH
                      </strong>
                    </div>

                    <div>
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#9aa2a9] mb-2.5">
                        {lang === 'ar'
                          ? 'أبرز المواصفات التقنية'
                          : 'Points forts & équipements'}
                      </h3>
                      <ul className="space-y-2 text-sm text-[#d7dce0] list-none p-0 m-0">
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

                    <div className="p-3.5 bg-[#121314] border border-white/10 text-xs">
                      <strong className="text-[#f2f4f3] block mb-1">
                        {lang === 'ar' ? 'مثالي لـ:' : 'Usage recommandé :'}
                      </strong>
                      <span className="text-[#9aa2a9]">
                        {lang === 'ar'
                          ? inspectedProduct.idealForAr
                          : inspectedProduct.idealForFr}
                      </span>
                    </div>

                    <div className="pt-2 space-y-2.5">
                      <a
                        href={buildWhatsAppUrl(
                          lang === 'ar'
                            ? `السلام عليكم NeoRide، أنا مهتم بـ: ${inspectedProduct.nameAr} (${activeColor.nameAr} — ${inspectedProduct.priceFormatted} درهم). واش متوفر حاليا فالمعرض؟`
                            : `Bonjour NeoRide, je suis intéressé par : ${inspectedProduct.name} (${activeColor.nameFr} — ${inspectedProduct.priceFormatted} DH). Est-il disponible au showroom ?`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-g w-full"
                      >
                        <span>
                          {lang === 'ar'
                            ? 'تأكيد السعر والتوفر عبر واتساب'
                            : 'Vérifier prix & disponibilité'}
                        </span>
                        <span className="arr" aria-hidden="true">
                          ↗
                        </span>
                      </a>

                      {inspectedProduct.category !== 'piece' && (
                        <button
                          type="button"
                          onClick={() => {
                            const id = inspectedProduct.id;
                            onCloseInspectModal();
                            onBookTestRide(id);
                          }}
                          className="btn btn-o w-full"
                        >
                          {lang === 'ar'
                            ? 'جرّب هذا الموطور فبركان'
                            : 'Réserver un essai de ce modèle'}
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
