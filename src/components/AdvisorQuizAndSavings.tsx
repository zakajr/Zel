import React, { useState } from 'react';
import {
  ArrowUpRight,
  RotateCcw,
  ArrowLeft,
  Zap,
  BatteryCharging,
  Building2,
  Navigation,
  Compass,
  ShoppingBag,
  CheckCircle2,
} from 'lucide-react';
import {
  Lang,
  VEHICLE_PRODUCTS,
  ROUTE_PRESETS,
  ProductItem,
  buildWhatsAppUrl,
} from '../data/neorideData';
import { VehicleIllustration } from './VehicleIllustration';

interface AdvisorQuizAndSavingsProps {
  lang: Lang;
  onBookTestRide: (productId: string) => void;
  onInspectProduct: (product: ProductItem) => void;
}

export const AdvisorQuizAndSavings: React.FC<AdvisorQuizAndSavingsProps> = ({
  lang,
  onBookTestRide,
  onInspectProduct,
}) => {
  // --- Quiz State ---
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);

  const quizQuestions = [
    {
      qFr: 'Quelle distance parcourez-vous en moyenne par jour ?',
      qAr: 'ما هي المسافة التي تقطعها يوميًا في المتوسط؟',
      options: [
        { labelFr: 'Moins de 20 km (Centre-ville, courses)', labelAr: 'أقل من 20 كم (وسط المدينة، أغراض يومية)', val: 20, tagFr: 'moins de 20 km', tagAr: 'أقل من 20 كم' },
        { labelFr: '20 à 45 km (Trajets travail, périphérie)', labelAr: 'من 20 إلى 45 كم (العمل، أحفير، الضواحي)', val: 45, tagFr: '20 à 40 km', tagAr: 'من 20 حتى 40 كم' },
        { labelFr: 'Plus de 45 km (Route, Saïdia, Livraison)', labelAr: 'أكثر من 45 كم (الطريق، السعيدية، التوصيل)', val: 65, tagFr: 'plus de 40 km', tagAr: 'أكثر من 40 كم' },
      ],
    },
    {
      qFr: 'Quel est votre style de conduite et d’usage ?',
      qAr: 'ما هو أسلوب قيادتك وطبيعة استعمالك؟',
      options: [
        { labelFr: 'Pratique & urbain (maniabilité, facilité)', labelAr: 'هادئ وعملي داخل المدينة (سهولة الركن والقيادة)', val: 0 },
        { labelFr: 'Dynamique & routier (couple, duo ou livraison)', labelAr: 'ديناميكي أو مهني (سرعة، شخصين، أو توصيل)', val: 1 },
      ],
    },
    {
      qFr: 'Quel budget envisagez-vous ?',
      qAr: 'ما هي الميزانية التي تخطط لها؟',
      options: [
        { labelFr: 'Jusqu’à 10\u00a0000 DH', labelAr: 'حتى 10\u00a0000 درهم', val: 10000 },
        { labelFr: '10\u00a0000 à 18\u00a0000 DH', labelAr: 'من 10\u00a0000 إلى 18\u00a0000 درهم', val: 18000 },
        { labelFr: 'Plus de 18\u00a0000 DH (Performance max)', labelAr: 'أكثر من 18\u00a0000 درهم (أعلى مدى وأداء)', val: 99999 },
      ],
    },
  ];

  const handleQuizSelect = (optionIdx: number) => {
    setQuizAnswers((prev) => [...prev, optionIdx]);
  };

  const handleQuizBack = () => {
    setQuizAnswers((prev) => prev.slice(0, -1));
  };

  const handleQuizReset = () => {
    setQuizAnswers([]);
  };

  // Compute Quiz Recommendation
  const getQuizResult = (): { match: ProductItem; overBudget: boolean } | null => {
    if (quizAnswers.length < 3) return null;
    const reqKm = quizQuestions[0].options[quizAnswers[0]].val;
    const dynamicStyle = quizQuestions[1].options[quizAnswers[1]].val;
    const maxBudget = quizQuestions[2].options[quizAnswers[2]].val;

    let candidates = VEHICLE_PRODUCTS.filter(
      (p) => p.rangeKm >= reqKm && p.priceDh <= maxBudget
    );
    let overBudget = false;
    if (candidates.length === 0) {
      overBudget = true;
      candidates = VEHICLE_PRODUCTS.filter((p) => p.rangeKm >= reqKm);
    }
    if (candidates.length === 0) {
      candidates = [...VEHICLE_PRODUCTS].sort((a, b) => b.rangeKm - a.rangeKm).slice(0, 1);
    }

    candidates.sort((a, b) => (dynamicStyle ? b.speedKmh - a.speedKmh : a.priceDh - b.priceDh));
    return { match: candidates[0], overBudget };
  };

  const quizResult = getQuizResult();

  // --- Savings Calculator State ---
  const [dailyKm, setDailyKm] = useState<number>(35);
  const [calcMode, setCalcMode] = useState<'commuter' | 'delivery'>('commuter');
  const [activeChargeStep, setActiveChargeStep] = useState<number>(0);

  const handlePresetClick = (km: number, id: string) => {
    setDailyKm(km);
    if (id === 'livreur-pro') {
      setCalcMode('delivery');
    }
  };

  // Savings Math (matches mockup assumptions: thermal 3.5L/100km @ 13 DH/L + 0.15 DH/km maintenance = 0.605 DH/km; electric = 0.05 DH/km charge + 0.03 DH/km maintenance = 0.08 DH/km)
  const daysPerYear = calcMode === 'delivery' ? 330 : 365;
  const yearlyKm = dailyKm * daysPerYear;
  const thermalYearlyDh = Math.round(yearlyKm * (0.035 * 13 + 0.15));
  const electricYearlyDh = Math.round(yearlyKm * 0.08);
  const yearlySavingsDh = Math.max(0, thermalYearlyDh - electricYearlyDh);
  const monthlySavingsDh = Math.round(yearlySavingsDh / 12);

  // Payback months for Urban 3000 (17,500 DH) or Eco City (9,900 DH)
  const referenceModel = dailyKm > 45 ? VEHICLE_PRODUCTS[1] : VEHICLE_PRODUCTS[2]; // Urban 3000 or Eco City
  const paybackMonths = Math.max(
    4,
    Math.round(referenceModel.priceDh / Math.max(1, monthlySavingsDh))
  );

  // Compatible models for dailyKm with 20% safety buffer
  const compatibleModels = VEHICLE_PRODUCTS.filter((m) => m.rangeKm >= dailyKm * 1.2).sort(
    (a, b) => a.priceDh - b.priceDh
  );

  const formatDh = (num: number) =>
    Math.round(num)
      .toLocaleString('fr-FR')
      .replace(/\u202f/g, '\u00a0') + (lang === 'ar' ? ' درهم' : ' DH');

  const chargingSteps = [
    {
      num: '01',
      titleFr: 'Déclipsez en 10 secondes',
      titleAr: 'فكّ البطارية في 10 ثوانٍ',
      descFr:
        'Ouvrez le coffre sous la selle, débranchez le connecteur sécurisé et soulevez la batterie grâce à sa poignée ergonomique équilibrée.',
      descAr:
        'افتح المقعد، افصل القابس الآمن، وارفع البطارية بسهولة بفضل مقبضها المريح والمتوازن.',
      detailFr: 'Poids étudié · Verrouillage mécanique anti-vol sous clé',
      detailAr: 'وزن مدروس · قفل ميكانيكي آمن بالمفتاح ضد السرقة',
    },
    {
      num: '02',
      titleFr: 'Montez-la chez vous ou au bureau',
      titleAr: 'اصعد بها إلى شقتك أو مكتبك',
      descFr:
        'Plus besoin de chercher une prise électrique dans un garage collectif. Vous rechargez au salon, dans votre commerce ou au café.',
      descAr:
        'لا حاجة للبحث عن مقبس كهربائي في المرآب المشترك. اشحنها في شقتك، محلك التجاري أو مكتبك بكل حرية.',
      detailFr: 'Idéal pour les résidences et appartements à Berkane, Oujda & Nador',
      detailAr: 'عملي جدًا لسكان الشقق والإقامات في بركان ووجدة والناظور',
    },
    {
      num: '03',
      titleFr: 'Branchez sur prise normale 220V',
      titleAr: 'وصّلها بأي مقبس منزلي 220V',
      descFr:
        'Le chargeur intelligent coupe automatiquement en fin de cycle. Une charge complète revient à environ 2 à 3 DH d’électricité.',
      descAr:
        'يتوقف الشاحن الذكي تلقائيًا عند امتلاء البطارية. تكلف الشحنة الكاملة حوالي 2 إلى 3 دراهم فقط من الكهرباء.',
      detailFr: 'Protection BMS intégrée contre les surtensions et la chauffe',
      detailAr: 'حماية إلكترونية ذكية BMS ضد ارتفاع الجهد أو الحرارة',
    },
  ];

  const getPresetIcon = (id: string) => {
    switch (id) {
      case 'berkane-ville':
        return <Building2 className="w-4 h-4" />;
      case 'berkane-ahfir':
        return <Navigation className="w-4 h-4" />;
      case 'berkane-saidia':
        return <Compass className="w-4 h-4" />;
      default:
        return <ShoppingBag className="w-4 h-4" />;
    }
  };

  return (
    <>
      {/* SECTION 02: INTERACTIVE 3-QUESTION ADVISOR QUIZ */}
      <section id="quiz" className="py-16 sm:py-24 border-b border-[#262b2f] bg-[#0d0f10]">
        <div className="max-w-[1160px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Intro */}
            <div className="lg:col-span-5">
              <p className="text-xs font-mono-num text-[#9aa2a9] mb-2">
                {lang === 'ar' ? '02. مستشار الاختيار الذكي' : '02. Diagnostic Personnalisé'}
              </p>
              <h2 className="text-silver font-display font-bold text-[clamp(1.85rem,4vw,2.85rem)] leading-[1.08] tracking-tight">
                {lang === 'ar'
                  ? 'اعثر على طراز NeoRide المناسب لك في 3 أسئلة'
                  : 'Trouvez votre NeoRide en 3 questions'}
              </h2>
              <p className="text-[#9aa2a9] text-sm sm:text-base mt-3 leading-relaxed">
                {lang === 'ar'
                  ? 'أجب عن 3 أسئلة سريعة حول مسافتك اليومية، أسلوب قيادتك وميزانيتك لنقترح عليك الطراز الأنسب من معرضنا في بركان.'
                  : 'Vos trajets, votre style de conduite et votre budget : notre configurateur identifie immédiatement le modèle dimensionné pour votre quotidien.'}
              </p>

              {/* Progress Steps Summary */}
              <div className="mt-6 space-y-2.5 hidden sm:block">
                {[
                  {
                    step: '01',
                    label: lang === 'ar' ? 'المسافة اليومية' : 'Distance quotidienne',
                    done: quizAnswers.length >= 1,
                    val:
                      quizAnswers.length >= 1
                        ? lang === 'ar'
                          ? quizQuestions[0].options[quizAnswers[0]].tagAr
                          : quizQuestions[0].options[quizAnswers[0]].tagFr
                        : null,
                  },
                  {
                    step: '02',
                    label: lang === 'ar' ? 'أسلوب القيادة' : 'Style de conduite',
                    done: quizAnswers.length >= 2,
                    val:
                      quizAnswers.length >= 2
                        ? lang === 'ar'
                          ? quizQuestions[1].options[quizAnswers[1]].labelAr
                          : quizQuestions[1].options[quizAnswers[1]].labelFr
                        : null,
                  },
                  {
                    step: '03',
                    label: lang === 'ar' ? 'الميزانية' : 'Budget cible',
                    done: quizAnswers.length >= 3,
                    val:
                      quizAnswers.length >= 3
                        ? lang === 'ar'
                          ? quizQuestions[2].options[quizAnswers[2]].labelAr
                          : quizQuestions[2].options[quizAnswers[2]].labelFr
                        : null,
                  },
                ].map((item, idx) => (
                  <div
                    key={item.step}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded border text-xs ${
                      item.done
                        ? 'bg-[#141719] border-[#2dff6e]/40 text-[#f2f4f3]'
                        : idx === quizAnswers.length
                        ? 'bg-[#141719] border-[#32393f] text-[#f2f4f3]'
                        : 'bg-[#0d0f10] border-[#1f2428] text-[#6e777d]'
                    }`}
                  >
                    <span className="font-medium">
                      <span className="font-mono-num text-[#2dff6e] me-2">{item.step}.</span>
                      {item.label}
                    </span>
                    {item.val && (
                      <span className="text-[#2dff6e] font-semibold truncate max-w-[180px]">
                        {item.val}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Interactive Quiz Box */}
            <div className="lg:col-span-7 bg-[#141719] border border-[#262b2f] rounded p-5 sm:p-8">
              {/* Segmented Progress Bar */}
              <div className="flex items-center gap-2 mb-6">
                {[0, 1, 2].map((stepIdx) => (
                  <div
                    key={stepIdx}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                      stepIdx <= quizAnswers.length - (quizResult ? 0 : 0)
                        ? 'bg-[#2dff6e]'
                        : 'bg-[#262b2f]'
                    }`}
                  />
                ))}
              </div>

              {!quizResult ? (
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-mono-num text-[#2dff6e]">
                      {lang === 'ar'
                        ? `السؤال ${quizAnswers.length + 1} من 3`
                        : `Question ${quizAnswers.length + 1} sur 3`}
                    </span>
                    {quizAnswers.length > 0 && (
                      <button
                        type="button"
                        onClick={handleQuizBack}
                        className="inline-flex items-center gap-1 text-xs text-[#9aa2a9] hover:text-white cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5 flip-rtl" />
                        <span>{lang === 'ar' ? 'السؤال السابق' : 'Précédent'}</span>
                      </button>
                    )}
                  </div>

                  <h3 className="font-display font-bold text-xl sm:text-2xl text-[#f2f4f3] mb-5">
                    {lang === 'ar'
                      ? quizQuestions[quizAnswers.length].qAr
                      : quizQuestions[quizAnswers.length].qFr}
                  </h3>

                  <div className="grid gap-3">
                    {quizQuestions[quizAnswers.length].options.map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() => handleQuizSelect(oIdx)}
                        className="w-full min-h-[56px] px-5 py-3.5 text-start rounded bg-[#1a1e21] hover:bg-[#2dff6e] text-[#f2f4f3] hover:text-[#05150b] border border-[#2e3438] hover:border-[#2dff6e] font-semibold text-sm sm:text-base transition-colors flex items-center justify-between gap-4 cursor-pointer group"
                      >
                        <span>{lang === 'ar' ? opt.labelAr : opt.labelFr}</span>
                        <span className="text-xs font-mono-num opacity-60 group-hover:opacity-100 shrink-0">
                          →
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* Quiz Recommendation Result Card */
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2dff6e]">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>
                        {lang === 'ar' ? 'الطراز الموصى به لاحتياجاتك' : 'Votre NeoRide idéale'}
                      </span>
                    </span>

                    <button
                      type="button"
                      onClick={handleQuizReset}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9aa2a9] hover:text-[#f2f4f3] cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{lang === 'ar' ? 'إعادة الاختبار' : 'Recommencer'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center bg-[#0d0f10] border border-[#262b2f] rounded p-4">
                    <div className="sm:col-span-5 aspect-[16/10] sm:aspect-[4/3] rounded overflow-hidden border border-[#22272b]">
                      <VehicleIllustration
                        kind={quizResult.match.artKind}
                        accentColor="#2dff6e"
                        lang={lang}
                      />
                    </div>

                    <div className="sm:col-span-7">
                      <div className="text-xs text-[#9aa2a9]">
                        {lang === 'ar' ? quizResult.match.kickerAr : quizResult.match.kickerFr}
                      </div>
                      <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#f2f4f3] mt-0.5">
                        {lang === 'ar' ? quizResult.match.nameAr : quizResult.match.name}
                      </h3>
                      <div className="font-display font-extrabold text-xl text-[#2dff6e] tabular-nums bidi-plain mt-1">
                        {quizResult.match.priceFormatted} DH
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#22272b] text-xs">
                        {quizResult.match.specs.slice(0, 4).map((s, idx) => (
                          <div key={idx}>
                            <span className="font-bold text-[#f2f4f3] tabular-nums bidi-plain">
                              {s.value}
                            </span>{' '}
                            <span className="text-[#9aa2a9]">
                              {lang === 'ar' ? s.labelAr : s.labelFr}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {quizResult.overBudget && (
                    <p className="text-xs text-[#f5c76c] mt-3">
                      {lang === 'ar'
                        ? 'ملاحظة: اخترنا هذا الطراز لأنه يغطي مسافتك اليومية بأمان كامل.'
                        : 'Note : ce modèle dépasse légèrement le budget indiqué mais garantit l’autonomie nécessaire pour vos kilomètres quotidiens.'}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-3 mt-5">
                    <a
                      href={buildWhatsAppUrl(
                        lang === 'ar'
                          ? `السلام عليكم NeoRide، الاختبار نصحني بـ: ${quizResult.match.nameAr} (${quizResult.match.priceFormatted} درهم). المسافة ديالي: ${quizQuestions[0].options[quizAnswers[0]].tagAr} فالنهار. واش متوفر؟`
                          : `Bonjour NeoRide, le quiz me recommande : ${quizResult.match.name} (${quizResult.match.priceFormatted} DH). Mes trajets : ${quizQuestions[0].options[quizAnswers[0]].tagFr} par jour. Est-il disponible ?`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 min-h-[46px] px-5 py-2.5 bg-[#2dff6e] hover:bg-white text-[#05150b] font-bold text-sm rounded transition-colors whitespace-nowrap"
                    >
                      <span>{lang === 'ar' ? 'اطلبه عبر واتساب' : 'Demander sur WhatsApp'}</span>
                      <ArrowUpRight className="w-4 h-4 flip-rtl" />
                    </a>

                    <button
                      type="button"
                      onClick={() => onBookTestRide(quizResult.match.id)}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center min-h-[46px] px-4 py-2.5 bg-[#1a1e21] hover:bg-[#242a2e] text-[#f2f4f3] border border-[#2e3438] font-semibold text-sm rounded transition-colors cursor-pointer whitespace-nowrap"
                    >
                      {lang === 'ar' ? 'احجز تجربة لهذا الطراز' : 'Essayer ce modèle'}
                    </button>

                    <button
                      type="button"
                      onClick={() => onInspectProduct(quizResult.match)}
                      className="inline-flex items-center justify-center min-h-[46px] px-3 py-2 text-xs font-semibold text-[#9aa2a9] hover:text-white underline underline-offset-4 cursor-pointer"
                    >
                      {lang === 'ar' ? 'عرض البطاقة التقنية' : 'Fiche détaillée'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 03: WHY ELECTRIC, FUEL SAVINGS CALCULATOR & REMOVABLE BATTERY */}
      <section id="electrique" className="py-16 sm:py-24 border-b border-[#262b2f] bg-[#111416]">
        <div className="max-w-[1160px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Left Column: Value Proposition & Delivery Rider ROI */}
            <div className="lg:col-span-5">
              <p className="text-xs font-mono-num text-[#9aa2a9] mb-2">
                {lang === 'ar' ? '03. لماذا الكهرباء؟' : '03. Pourquoi l’Électrique'}
              </p>

              <div className="font-display font-extrabold text-[clamp(3.25rem,8vw,5.5rem)] leading-none text-silver tracking-tight tabular-nums bidi-plain">
                0{' '}
                <span className="text-lg sm:text-2xl font-bold text-[#2dff6e]">
                  {lang === 'ar' ? 'درهم بنزين' : 'DH d’essence'}
                </span>
              </div>

              <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#f2f4f3] mt-3 leading-snug">
                {lang === 'ar'
                  ? 'تكلفة كل كيلومتر شبه منعدمة مقارنة بالبنزين.'
                  : 'Chaque kilomètre vous coûte 8 fois moins cher.'}
              </h2>

              <div className="space-y-4 mt-6 text-sm sm:text-base text-[#9aa2a9]">
                <p>
                  <strong className="text-[#f2f4f3]">
                    {lang === 'ar' ? 'صيانة أقل بكثير.' : 'Entretien minimal.'}
                  </strong>{' '}
                  {lang === 'ar'
                    ? 'لا تغيير للزيت، لا شمعات إشعال (بواجي)، ولا سير نقل الحركة — وقت ومصاريف أقل في الورشة.'
                    : 'Ni vidange d’huile, ni bougies, ni courroie ni filtre : vous passez moins de temps à l’atelier.'}
                </p>
                <p>
                  <strong className="text-[#f2f4f3]">
                    {lang === 'ar' ? 'هدوء وعزم فوري.' : 'Silence et couple immédiat.'}
                  </strong>{' '}
                  {lang === 'ar'
                    ? 'انطلاقة سلسة وقوية فور تدوير المقبض، بدون ضجيج أو دخان أو رائحة بنزين.'
                    : 'La poussée est franche dès que vous tournez la poignée, sans bruit, sans vibrations ni fumée.'}
                </p>
              </div>

              {/* Delivery Rider / Coursier Pro Card */}
              <div className="mt-8 p-5 rounded bg-[#141719] border border-[#262b2f]">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-semibold text-[#2dff6e]">
                    {lang === 'ar'
                      ? 'خاص بموزّعي الطلبيات (Glovo، المطاعم، التوصيل)'
                      : 'Spécial Livreurs (Glovo, Restos, Coursiers)'}
                  </span>
                  <span className="text-xs font-mono-num text-[#9aa2a9]">
                    Berkane · Oujda · Nador
                  </span>
                </div>
                <h3 className="font-display font-bold text-base sm:text-lg text-[#f2f4f3]">
                  {lang === 'ar'
                    ? 'الدراجة تسدد ثمنها من توفير البنزين اليومي'
                    : 'Votre moto se rentabilise avec vos économies d’essence'}
                </h3>
                <p className="text-xs sm:text-sm text-[#9aa2a9] mt-1.5 leading-relaxed">
                  {lang === 'ar'
                    ? 'بدل حرق 45 إلى 60 درهم بنزين يوميًا (~1\u00a0500 درهم/شهر)، يكلفك الشحن الكهربائي أقل من 5 دراهم في اليوم.'
                    : 'Au lieu de brûler 45 à 60 DH d’essence par jour (~1\u00a0500 DH/mois), une NeoRide vous coûte moins de 5 DH d’électricité par jour.'}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handlePresetClick(85, 'livreur-pro')}
                    className="inline-flex items-center gap-1.5 min-h-[38px] px-3.5 py-1.5 text-xs font-bold rounded bg-[#2dff6e] text-[#05150b] hover:bg-white transition-colors cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>
                      {lang === 'ar' ? 'تفعيل حساب الموزّع (85 كم/يوم)' : 'Simuler 85 km/jour (Livreur)'}
                    </span>
                  </button>
                  <a
                    href={buildWhatsAppUrl(
                      lang === 'ar'
                        ? 'السلام عليكم NeoRide، أنا موزّع وبغيت نحسب واش الموطور الكهربائي كيربّحني فالخدمة ديالي.'
                        : 'Bonjour NeoRide, je suis livreur et je veux calculer la rentabilité d’une moto électrique pour mon travail.'
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-[#d0d6dc] hover:text-[#2dff6e] underline underline-offset-4"
                  >
                    {lang === 'ar' ? 'استشارة خاصة بالموزعين ↗' : 'Parler à un conseiller Pro ↗'}
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Savings & Range Compatibility Calculator */}
            <div className="lg:col-span-7 bg-[#141719] border border-[#262b2f] rounded p-5 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <h3 className="font-display font-bold text-lg sm:text-xl text-[#f2f4f3]">
                  {lang === 'ar' ? 'حاسبة التوفير والمدى اليومي' : 'Simulateur d’économies & d’autonomie'}
                </h3>

                {/* Mode Switcher */}
                <div className="inline-flex p-1 rounded bg-[#0d0f10] border border-[#262b2f]">
                  <button
                    type="button"
                    onClick={() => setCalcMode('commuter')}
                    className={`px-3 py-1 text-xs font-semibold rounded transition-colors cursor-pointer ${
                      calcMode === 'commuter'
                        ? 'bg-[#2dff6e] text-[#05150b]'
                        : 'text-[#9aa2a9] hover:text-white'
                    }`}
                  >
                    {lang === 'ar' ? 'تنقل يومي' : 'Particulier'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCalcMode('delivery');
                      if (dailyKm < 60) setDailyKm(85);
                    }}
                    className={`px-3 py-1 text-xs font-semibold rounded transition-colors cursor-pointer ${
                      calcMode === 'delivery'
                        ? 'bg-[#2dff6e] text-[#05150b]'
                        : 'text-[#9aa2a9] hover:text-white'
                    }`}
                  >
                    {lang === 'ar' ? 'موزّع محترف' : 'Livreur Pro'}
                  </button>
                </div>
              </div>

              {/* Route Presets */}
              <div className="mb-5">
                <div className="text-xs font-semibold text-[#9aa2a9] mb-2">
                  {lang === 'ar' ? 'اختر مسارًا معتادًا في الجهة الشرقية:' : 'Ou choisissez un trajet type dans l’Oriental :'}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ROUTE_PRESETS.map((preset) => {
                    const active = dailyKm === preset.km;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        aria-pressed={active}
                        onClick={() => handlePresetClick(preset.km, preset.id)}
                        className={`flex items-center gap-2.5 min-h-[44px] px-3.5 py-2 rounded border text-start text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                          active
                            ? 'bg-[#2dff6e]/15 text-[#2dff6e] border-[#2dff6e]'
                            : 'bg-[#1a1e21] text-[#d0d6dc] border-[#2e3438] hover:border-[#3e464c]'
                        }`}
                      >
                        <span className="text-[#2dff6e] shrink-0">{getPresetIcon(preset.id)}</span>
                        <span className="truncate">
                          {lang === 'ar' ? preset.labelAr : preset.labelFr}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Daily Distance Slider */}
              <div className="mb-6">
                <div className="flex items-baseline justify-between mb-2">
                  <label htmlFor="daily-km-slider" className="text-sm font-semibold text-[#f2f4f3]">
                    {lang === 'ar' ? 'مسافتك اليومية' : 'Vos kilomètres par jour'}
                  </label>
                  <output
                    htmlFor="daily-km-slider"
                    className="font-display font-extrabold text-2xl text-[#2dff6e] tabular-nums bidi-plain"
                  >
                    {dailyKm} {lang === 'ar' ? 'كم / يوم' : 'km / jour'}
                  </output>
                </div>
                <input
                  id="daily-km-slider"
                  type="range"
                  min={5}
                  max={120}
                  step={5}
                  value={dailyKm}
                  onChange={(e) => setDailyKm(Number(e.target.value))}
                  className="neoride-slider"
                />
                <div className="flex justify-between text-[11px] font-mono-num text-[#6e777d] mt-1">
                  <span>5 km</span>
                  <span>35 km (Ahfir)</span>
                  <span>60 km</span>
                  <span>85 km (Livreur)</span>
                  <span>120 km</span>
                </div>
              </div>

              {/* Cost Comparison Bars */}
              <div className="space-y-3 p-4 rounded bg-[#0d0f10] border border-[#22272b]">
                <div>
                  <div className="flex justify-between text-xs sm:text-sm mb-1.5">
                    <span className="text-[#9aa2a9]">
                      {lang === 'ar' ? 'موطور بنزين (وقود + زيت وصيانة)' : 'Moto thermique (Essence + vidanges)'}
                    </span>
                    <strong className="font-mono-num text-[#f2f4f3] tabular-nums bidi-plain">
                      {formatDh(thermalYearlyDh)} / {lang === 'ar' ? 'سنة' : 'an'}
                    </strong>
                  </div>
                  <div className="h-2.5 bg-[#1a1e21] rounded-full overflow-hidden">
                    <div className="h-full bg-[#6e777d] w-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs sm:text-sm mb-1.5">
                    <span className="text-[#2dff6e] font-semibold">
                      {lang === 'ar' ? 'موطور NeoRide الكهربائي (شحن 220V)' : 'NeoRide Électrique (Recharge 220V)'}
                    </span>
                    <strong className="font-mono-num text-[#2dff6e] tabular-nums bidi-plain">
                      {formatDh(electricYearlyDh)} / {lang === 'ar' ? 'سنة' : 'an'}
                    </strong>
                  </div>
                  <div className="h-2.5 bg-[#1a1e21] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#2dff6e] transition-all duration-300"
                      style={{
                        width: `${Math.max(5, Math.round((electricYearlyDh / thermalYearlyDh) * 100))}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Big Savings Output + Payback Metric */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div className="p-4 rounded bg-[#1a1e21]/70 border border-[#2dff6e]/30">
                  <span className="text-xs text-[#9aa2a9] block">
                    {lang === 'ar' ? 'التوفير الصافي السنوي المقدر' : 'Économie estimée par an'}
                  </span>
                  <strong className="font-display font-extrabold text-3xl sm:text-4xl text-[#2dff6e] tabular-nums bidi-plain block mt-1">
                    {formatDh(yearlySavingsDh)}
                  </strong>
                  <span className="text-xs text-[#c5ccd0] font-mono-num mt-1 block">
                    ≈ {formatDh(monthlySavingsDh)} / {lang === 'ar' ? 'شهر' : 'mois'}
                  </span>
                </div>

                <div className="p-4 rounded bg-[#0d0f10] border border-[#22272b]">
                  <span className="text-xs text-[#9aa2a9] block">
                    {lang === 'ar'
                      ? `استرجاع ثمن ${referenceModel.name}`
                      : `Rentabilité (${referenceModel.name})`}
                  </span>
                  <strong className="font-display font-bold text-xl sm:text-2xl text-[#f2f4f3] tabular-nums bidi-plain block mt-1">
                    ~{paybackMonths} {lang === 'ar' ? 'أشهر فقط' : 'mois'}
                  </strong>
                  <span className="text-xs text-[#9aa2a9] mt-1 block">
                    {lang === 'ar'
                      ? 'من خلال ما توفره في البنزين والزيت'
                      : 'Grâce aux économies de carburant et d’entretien'}
                  </span>
                </div>
              </div>

              {/* Model Range Compatibility Status */}
              <div className="mt-4 p-3.5 rounded bg-[#0d0f10] border border-[#22272b] text-xs sm:text-sm text-[#d0d6dc]">
                {compatibleModels.length > 0 ? (
                  <p>
                    <span className="text-[#2dff6e] font-semibold">
                      {lang === 'ar' ? '✓ يغطيه بشحنة واحدة: ' : '✓ Trajet couvert en une seule charge : '}
                    </span>
                    {compatibleModels.map((m) => m.name).join(', ')}.
                  </p>
                ) : (
                  <p>
                    <span className="text-[#f5c76c] font-semibold">
                      {lang === 'ar'
                        ? '⚡ مسافة مكثفة (+75 كم/يوم): '
                        : '⚡ Usage intensif (+75 km/jour) : '}
                    </span>
                    {lang === 'ar'
                      ? 'ننصح بطراز NR-1 Sport (مدى 90 كم) أو Urban 3000 مع بطارية احتياطية قابلة للتبديل في 10 ثوانٍ.'
                      : 'Nous recommandons la NeoRide NR-1 Sport (90 km) ou la Urban 3000 avec une seconde batterie amovible.'}
                  </p>
                )}
              </div>

              <p className="text-[11px] text-[#6e777d] mt-3">
                {lang === 'ar'
                  ? 'تقدير: البنزين 3.5 لتر/100 كم بسعر 13 درهم/لتر وصيانة 0.15 درهم/كم؛ الكهرباء 0.05 درهم/كم للشحن و0.03 درهم/كم للصيانة.'
                  : 'Base de calcul : thermique 3,5 L/100 km (essence 13 DH/L + entretien 0,15 DH/km) ; électrique 0,05 DH/km d’électricité + 0,03 DH/km d’entretien.'}
              </p>
            </div>
          </div>

          {/* Interactive 3-Step Removable Battery Section */}
          <div className="mt-14 pt-12 border-t border-[#262b2f]">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
              <div>
                <h3 className="text-silver font-display font-bold text-2xl sm:text-3xl">
                  {lang === 'ar' ? 'اشحنها بسهولة مثل هاتفك' : 'Rechargez comme un téléphone'}
                </h3>
                <p className="text-sm sm:text-base text-[#9aa2a9] mt-1">
                  {lang === 'ar'
                    ? 'وداعًا للبحث عن مقبس في الكاراج: البطارية القابلة للإزالة تصعد معك إلى الشقة أو المكتب.'
                    : 'Pas de prise au garage ? La batterie amovible à poignée monte avec vous en appartement ou au bureau.'}
                </p>
              </div>
              <span className="text-xs font-mono-num text-[#2dff6e]">
                220V · 50Hz · ~2,5 DH / charge
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {chargingSteps.map((st, idx) => {
                const isSelected = activeChargeStep === idx;
                return (
                  <button
                    key={st.num}
                    type="button"
                    onClick={() => setActiveChargeStep(idx)}
                    className={`text-start p-5 sm:p-6 rounded border transition-all cursor-pointer flex flex-col justify-between gap-4 ${
                      isSelected
                        ? 'bg-[#141719] border-[#2dff6e] shadow-[0_8px_24px_rgba(0,0,0,0.35)]'
                        : 'bg-[#141719]/60 border-[#262b2f] hover:border-[#384046]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span
                          className={`font-display font-extrabold text-3xl tabular-nums bidi-plain ${
                            isSelected ? 'text-[#2dff6e]' : 'text-[#6e777d]'
                          }`}
                        >
                          {st.num}
                        </span>
                        <BatteryCharging
                          className={`w-5 h-5 ${
                            isSelected ? 'text-[#2dff6e]' : 'text-[#6e777d]'
                          }`}
                        />
                      </div>
                      <h4 className="font-display font-bold text-lg text-[#f2f4f3]">
                        {lang === 'ar' ? st.titleAr : st.titleFr}
                      </h4>
                      <p className="text-xs sm:text-sm text-[#9aa2a9] mt-2 leading-relaxed">
                        {lang === 'ar' ? st.descAr : st.descFr}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#22272b] text-xs font-medium text-[#d0d6dc]">
                      {lang === 'ar' ? st.detailAr : st.detailFr}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
