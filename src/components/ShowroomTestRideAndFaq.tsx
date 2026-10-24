import React, { useState, useEffect } from 'react';
import {
  ArrowUpRight,
  Copy,
  Check,
  MapPin,
  Phone,
  Clock,
  ChevronDown,
  MessageSquare,
} from 'lucide-react';
import {
  Lang,
  VEHICLE_PRODUCTS,
  ORIENTAL_CITIES,
  FAQ_ITEMS,
  buildWhatsAppUrl,
  getShowroomStatus,
} from '../data/neorideData';
import { VehicleIllustration } from './VehicleIllustration';

interface ShowroomTestRideAndFaqProps {
  lang: Lang;
  selectedTestRideModelId: string;
  onChangeTestRideModelId: (id: string) => void;
}

export const ShowroomTestRideAndFaq: React.FC<ShowroomTestRideAndFaqProps> = ({
  lang,
  selectedTestRideModelId,
  onChangeTestRideModelId,
}) => {
  // Test ride booking state
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(2); // Mercredi
  const [selectedHourIdx, setSelectedHourIdx] = useState<number>(2); // 16h
  const [selectedCity, setSelectedCity] = useState<string>('Berkane');
  const [firstName, setFirstName] = useState<string>('');
  const [copiedPreview, setCopiedPreview] = useState<boolean>(false);

  // FAQ state
  const [faqFilter, setFaqFilter] = useState<'all' | 'range' | 'delivery' | 'service'>('all');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-oriental');

  // Showroom status
  const [showroomStatus, setShowroomStatus] = useState(() => getShowroomStatus());

  useEffect(() => {
    const timer = setInterval(() => {
      setShowroomStatus(getShowroomStatus());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const daysShortFr = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const daysFullFr = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  const daysAr = ['الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const hoursFr = ['10h00', '12h00', '16h00', '18h00'];
  const hoursAr = ['10:00', '12:00', '16:00', '18:00'];

  const selectedModel =
    VEHICLE_PRODUCTS.find((m) => m.id === selectedTestRideModelId) || VEHICLE_PRODUCTS[0];

  const cleanName = firstName.trim() || (lang === 'ar' ? 'زبون NeoRide' : 'un client');

  const testRideMessage =
    lang === 'ar'
      ? `السلام عليكم NeoRide، معكم ${cleanName} (${selectedCity}). بغيت نجرّب ${selectedModel.nameAr} يوم ${daysAr[selectedDayIdx]} على الساعة ${hoursAr[selectedHourIdx]} فمعرض بركان.`
      : `Bonjour NeoRide, c’est ${cleanName} (${selectedCity}). Je souhaite essayer la ${selectedModel.name} ${daysFullFr[selectedDayIdx]} à ${hoursFr[selectedHourIdx]} au showroom de Berkane.`;

  const handleCopyMessage = () => {
    navigator.clipboard?.writeText(testRideMessage);
    setCopiedPreview(true);
    setTimeout(() => setCopiedPreview(false), 2200);
  };

  const proofCards = [
    {
      kind: 'moto' as const,
      accent: '#2dff6e',
      kickerFr: 'Showroom Berkane',
      kickerAr: 'معرض بركان',
      titleFr: 'Les modèles en vrai',
      titleAr: 'شاهد الطرازات عن قرب',
      descFr:
        'Découvrez la qualité d’assemblage, la position de conduite et le coffre de batterie directement au showroom.',
      descAr:
        'تعرّف على جودة التصنيع، وضعية القيادة المريحة، ومكان البطارية مباشرة في المعرض.',
    },
    {
      kind: 'scoot' as const,
      accent: '#cbd5e1',
      kickerFr: 'Dans les détails',
      kickerAr: 'أدق التفاصيل',
      titleFr: 'Équipements vérifiables',
      titleAr: 'تجهيزات تمنحك الثقة',
      descFr:
        'Comparez le freinage hydraulique, l’éclairage LED, l’écran numérique et les connecteurs de charge 220V.',
      descAr:
        'قارن الفرامل الهيدروليكية، إضاءة LED، الشاشة الرقمية وشاحن 220V المنزلي.',
    },
    {
      kind: 'battery' as const,
      accent: '#2dff6e',
      kickerFr: 'Atelier Zelloufi',
      kickerAr: 'ورشة زلّوفي',
      titleFr: 'Un suivi identifiable',
      titleAr: 'مواكبة وصيانة محلية',
      descFr:
        'Une équipe locale à Berkane pour répondre à vos questions avant l’achat et assurer le suivi des pièces.',
      descAr:
        'فريق محلي في بركان للإجابة عن أسئلتك قبل الشراء وتوفير قطع الغيار والمتابعة التقنية.',
    },
  ];

  const guarantees = [
    {
      titleFr: 'Garantie constructeur',
      titleAr: 'ضمان الشركة المصنّعة',
      descFr:
        'Les conditions de garantie (moteur, batterie, châssis) sont détaillées par écrit selon le modèle choisi lors de votre visite.',
      descAr:
        'تختلف شروط الضمان حسب الطراز والشركة المصنّعة. نقدم لك كافة التفاصيل المكتوبة عند زيارتك للمعرض.',
    },
    {
      titleFr: 'Pièces & après-vente à Berkane',
      titleAr: 'قطع الغيار وخدمة ما بعد البيع',
      descFr:
        'Batteries, chargeurs, plaquettes, pneus et contrôleurs : renseignez-vous sur les références suivies par notre atelier.',
      descAr:
        'بطاريات، شواحن، فرامل وإطارات: استفسر عن القطع المتوافقة وخدمات الصيانة المتوفرة في ورشتنا.',
    },
    {
      titleFr: 'Essai réel avant décision',
      titleAr: 'جرّب قبل الشراء',
      descFr:
        'Testez l’équilibre, le silence et le démarrage électrique sur place à Berkane en réservant un créneau.',
      descAr:
        'جرّب التوازن والهدوء والانطلاقة الكهربائية بعين المكان في بركان عبر حجز موعد مسبق.',
    },
    {
      titleFr: 'Accompagnement administratif',
      titleAr: 'المواكبة الإدارية',
      descFr:
        'Notre équipe vous guide sur les documents, la facturation et les démarches liées à votre véhicule.',
      descAr:
        'يرشدك فريقنا بخصوص الوثائق والفاتورة والإجراءات الإدارية المتعلقة بمركبتك المختارة.',
    },
  ];

  const filteredFaqs = FAQ_ITEMS.filter(
    (item) => faqFilter === 'all' || item.category === faqFilter
  );

  return (
    <>
      {/* SECTION 04: SHOWROOM PROOF & GUARANTEES */}
      <section id="confiance" className="py-16 sm:py-24 border-b border-[#262b2f] bg-[#0d0f10]">
        <div className="max-w-[1160px] mx-auto px-4 sm:px-6">
          <div className="max-w-[68ch] mb-10">
            <p className="text-xs font-mono-num text-[#9aa2a9] mb-2">
              {lang === 'ar' ? '04. الثقة والمواكبة المحلية' : '04. Showroom & Accompagnement Local'}
            </p>
            <h2 className="text-silver font-display font-bold text-[clamp(1.85rem,4vw,3rem)] leading-[1.08] tracking-tight">
              {lang === 'ar'
                ? 'تفضل بالزيارة. اطرح أسئلتك. وقرر براحة بال.'
                : 'Venez voir. Posez vos questions. Décidez sereinement.'}
            </h2>
            <p className="text-[#9aa2a9] text-sm sm:text-base mt-3 leading-relaxed">
              {lang === 'ar'
                ? 'شراء دراجة كهربائية يتطلب رؤية الموديل عن قرب والتأكد من وجود مخاطب محلي واضح في بركان وجهة الشرق.'
                : 'Acheter une moto électrique demande des preuves concrètes : voir les finitions de près, manipuler la batterie et compter sur un interlocuteur local à Berkane.'}
            </p>
          </div>

          {/* 3 Visual Proof Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {proofCards.map((card, idx) => (
              <article
                key={idx}
                className="bg-[#141719] border border-[#262b2f] rounded overflow-hidden flex flex-col"
              >
                <div className="aspect-[16/10] border-b border-[#262b2f]">
                  <VehicleIllustration kind={card.kind} accentColor={card.accent} lang={lang} />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-medium text-[#2dff6e] mb-1">
                      {lang === 'ar' ? card.kickerAr : card.kickerFr}
                    </div>
                    <h3 className="font-display font-bold text-xl text-[#f2f4f3]">
                      {lang === 'ar' ? card.titleAr : card.titleFr}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#9aa2a9] mt-2 leading-relaxed">
                      {lang === 'ar' ? card.descAr : card.descFr}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* 2x2 Transparent Guarantee Grid */}
          <div className="mt-12">
            <h3 className="font-display font-bold text-xl sm:text-2xl text-[#f2f4f3] mb-5">
              {lang === 'ar' ? 'قد بثقة وراحة بال' : 'Roulez l’esprit tranquille'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {guarantees.map((g, i) => (
                <div
                  key={i}
                  className="p-5 rounded bg-[#141719] border border-[#262b2f]"
                >
                  <h4 className="font-display font-bold text-base sm:text-lg text-[#f2f4f3]">
                    {lang === 'ar' ? g.titleAr : g.titleFr}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#9aa2a9] mt-1.5 leading-relaxed">
                    {lang === 'ar' ? g.descAr : g.descFr}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 05: INTERACTIVE TEST RIDE CONFIGURATOR */}
      <section id="essai" className="py-16 sm:py-24 border-b border-[#262b2f] bg-[#111416]">
        <div className="max-w-[1160px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Selected Vehicle Preview */}
            <div className="lg:col-span-5">
              <p className="text-xs font-mono-num text-[#9aa2a9] mb-2">
                {lang === 'ar' ? '05. حجز تجربة في المعرض' : '05. Essai & Visite Showroom'}
              </p>
              <h2 className="text-silver font-display font-bold text-[clamp(1.85rem,4vw,2.85rem)] leading-[1.08] tracking-tight">
                {lang === 'ar' ? 'احجز تجربة قيادة في بركان' : 'Réserver un essai'}
              </h2>
              <p className="text-[#9aa2a9] text-sm sm:text-base mt-3 leading-relaxed">
                {lang === 'ar'
                  ? 'اختر الطراز، اليوم والساعة المناسبة لك. يتم إعداد رسالتك تلقائيًا لتأكيد الموعد عبر واتساب مع فريق المعرض.'
                  : 'Choisissez votre modèle, votre jour et votre créneau horaire. L’équipe du showroom à Berkane prépare le véhicule et confirme votre rendez-vous sur WhatsApp.'}
              </p>

              {/* Live Vehicle Card Preview */}
              <div className="mt-6 bg-[#141719] border border-[#262b2f] rounded overflow-hidden">
                <div className="aspect-[16/9] border-b border-[#262b2f]">
                  <VehicleIllustration
                    kind={selectedModel.artKind}
                    accentColor="#2dff6e"
                    showCallouts={true}
                    lang={lang}
                  />
                </div>
                <div className="p-4 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs text-[#9aa2a9]">
                      {lang === 'ar' ? 'الطراز المختار للتجربة' : 'Modèle sélectionné pour l’essai'}
                    </div>
                    <div className="font-display font-bold text-lg text-[#f2f4f3]">
                      {lang === 'ar' ? selectedModel.nameAr : selectedModel.name}
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="font-display font-extrabold text-lg text-[#2dff6e] tabular-nums bidi-plain">
                      {selectedModel.priceFormatted} DH
                    </div>
                    <div className="text-xs text-[#9aa2a9] tabular-nums bidi-plain">
                      {selectedModel.rangeKm} km · {selectedModel.speedKmh} km/h
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Booking Form */}
            <div className="lg:col-span-7 bg-[#141719] border border-[#262b2f] rounded p-5 sm:p-8">
              <div className="space-y-5">
                {/* 1. Model Selector */}
                <div>
                  <label
                    htmlFor="test-ride-model"
                    className="block text-xs sm:text-sm font-semibold text-[#f2f4f3] mb-2"
                  >
                    {lang === 'ar' ? '1. أي طراز تود تجربته؟' : '1. Quel modèle souhaitez-vous essayer ?'}
                  </label>
                  <select
                    id="test-ride-model"
                    value={selectedModel.id}
                    onChange={(e) => onChangeTestRideModelId(e.target.value)}
                    className="w-full min-h-[48px] px-4 rounded bg-[#0d0f10] border border-[#2e3438] text-[#f2f4f3] text-sm sm:text-base font-medium cursor-pointer"
                  >
                    {VEHICLE_PRODUCTS.map((v) => (
                      <option key={v.id} value={v.id} className="bg-[#0d0f10]">
                        {v.name} — {v.priceFormatted} DH ({v.rangeKm} km)
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Day Selector */}
                <div>
                  <span className="block text-xs sm:text-sm font-semibold text-[#f2f4f3] mb-2">
                    {lang === 'ar' ? '2. أي يوم يناسبك؟' : '2. Quel jour vous arrange ?'}
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2" role="group">
                    {(lang === 'ar' ? daysAr : daysShortFr).map((dayLabel, idx) => {
                      const active = selectedDayIdx === idx;
                      return (
                        <button
                          key={dayLabel}
                          type="button"
                          aria-pressed={active}
                          onClick={() => setSelectedDayIdx(idx)}
                          className={`min-h-[44px] px-3 py-2 rounded text-xs sm:text-sm font-semibold border transition-colors cursor-pointer whitespace-nowrap ${
                            active
                              ? 'bg-[#2dff6e] text-[#05150b] border-[#2dff6e]'
                              : 'bg-[#0d0f10] text-[#d0d6dc] border-[#262b2f] hover:border-[#3a4248]'
                          }`}
                        >
                          {dayLabel}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Hour Selector */}
                <div>
                  <span className="block text-xs sm:text-sm font-semibold text-[#f2f4f3] mb-2">
                    {lang === 'ar' ? '3. أي ساعة تفضل؟' : '3. Quelle heure préférez-vous ?'}
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" role="group">
                    {(lang === 'ar' ? hoursAr : hoursFr).map((hourLabel, idx) => {
                      const active = selectedHourIdx === idx;
                      return (
                        <button
                          key={hourLabel}
                          type="button"
                          aria-pressed={active}
                          onClick={() => setSelectedHourIdx(idx)}
                          className={`min-h-[44px] px-3 py-2 rounded text-xs sm:text-sm font-mono-num font-semibold border transition-colors cursor-pointer whitespace-nowrap ${
                            active
                              ? 'bg-[#2dff6e] text-[#05150b] border-[#2dff6e]'
                              : 'bg-[#0d0f10] text-[#d0d6dc] border-[#262b2f] hover:border-[#3a4248]'
                          }`}
                        >
                          {hourLabel}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. First Name & City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="test-ride-name"
                      className="block text-xs sm:text-sm font-semibold text-[#f2f4f3] mb-2"
                    >
                      {lang === 'ar' ? '4. اسمك الأول' : '4. Votre prénom'}
                    </label>
                    <input
                      id="test-ride-name"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder={lang === 'ar' ? 'مثال: أمين / ياسين' : 'Ex : Yassine'}
                      autoComplete="given-name"
                      className="w-full min-h-[48px] px-4 rounded bg-[#0d0f10] border border-[#2e3438] text-[#f2f4f3] text-sm sm:text-base placeholder:text-[#6e777d]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="test-ride-city"
                      className="block text-xs sm:text-sm font-semibold text-[#f2f4f3] mb-2"
                    >
                      {lang === 'ar' ? '5. مدينتك' : '5. Votre ville'}
                    </label>
                    <select
                      id="test-ride-city"
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full min-h-[48px] px-4 rounded bg-[#0d0f10] border border-[#2e3438] text-[#f2f4f3] text-sm sm:text-base font-medium cursor-pointer"
                    >
                      {ORIENTAL_CITIES.map((c) => (
                        <option key={c.id} value={c.nameFr} className="bg-[#0d0f10]">
                          {lang === 'ar' ? c.nameAr : c.nameFr}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Live Message Preview (All-around hairline border, no thick left border) */}
                <div
                  aria-live="polite"
                  className="p-4 rounded bg-[#0d0f10] border border-[#262b2f] text-xs sm:text-sm text-[#d0d6dc]"
                >
                  <div className="flex items-center justify-between gap-2 text-[11px] font-mono-num text-[#9aa2a9] mb-1.5">
                    <span>
                      {lang === 'ar' ? 'معاينة رسالة واتساب الجاهزة:' : 'Aperçu du message WhatsApp :'}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyMessage}
                      className="inline-flex items-center gap-1 text-[#2dff6e] hover:underline cursor-pointer"
                    >
                      {copiedPreview ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>{lang === 'ar' ? 'تم النسخ' : 'Copié'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>{lang === 'ar' ? 'نسخ النص' : 'Copier'}</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="font-medium text-[#f2f4f3] leading-relaxed">
                    « {testRideMessage} »
                  </p>
                </div>

                {/* Submit CTA */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                  <a
                    href={buildWhatsAppUrl(testRideMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 min-h-[50px] px-6 py-3 bg-[#2dff6e] hover:bg-white text-[#05150b] font-bold text-sm sm:text-base rounded transition-colors whitespace-nowrap"
                  >
                    <span>
                      {lang === 'ar'
                        ? 'إرسال طلب الحجز عبر واتساب'
                        : 'Confirmer le créneau sur WhatsApp'}
                    </span>
                    <ArrowUpRight className="w-4 h-4 flip-rtl" />
                  </a>
                </div>

                <p className="text-xs text-[#6e777d]">
                  {lang === 'ar'
                    ? 'المواعيد تقريبية: يؤكد فريق المعرض اليوم والساعة عبر واتساب فور استلام رسالتك.'
                    : 'Créneaux indicatifs : notre équipe à Berkane vous confirme la disponibilité exacte sur WhatsApp.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 06: CATEGORIZED FAQ */}
      <section id="faq" className="py-16 sm:py-24 border-b border-[#262b2f] bg-[#0d0f10]">
        <div className="max-w-[920px] mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <p className="text-xs font-mono-num text-[#9aa2a9] mb-2">
              {lang === 'ar' ? '06. الأسئلة الشائعة' : '06. Questions Fréquentes'}
            </p>
            <h2 className="text-silver font-display font-bold text-[clamp(1.85rem,4vw,2.85rem)] leading-[1.08] tracking-tight">
              {lang === 'ar'
                ? 'كل ما يسأل عنه زبناؤنا في بركان وجهة الشرق'
                : 'Tout savoir avant de passer à l’électrique'}
            </h2>
          </div>

          {/* FAQ Category Filter */}
          <div className="flex flex-wrap items-center gap-2 mb-6" role="group">
            {[
              { id: 'all', labelFr: 'Toutes les questions', labelAr: 'الكل' },
              { id: 'range', labelFr: 'Autonomie & Recharge', labelAr: 'المدى والشحن' },
              { id: 'delivery', labelFr: 'Livraison Oriental', labelAr: 'التوصيل لجهة الشرق' },
              { id: 'service', labelFr: 'Garantie & Pièces', labelAr: 'الضمان وقطع الغيار' },
            ].map((tab) => {
              const active = faqFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFaqFilter(tab.id as typeof faqFilter)}
                  className={`min-h-[38px] px-3.5 py-1.5 rounded text-xs sm:text-sm font-semibold border transition-colors cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-[#2dff6e] text-[#05150b] border-[#2dff6e]'
                      : 'bg-[#141719] text-[#d0d6dc] border-[#262b2f] hover:border-[#3a4248]'
                  }`}
                >
                  {lang === 'ar' ? tab.labelAr : tab.labelFr}
                </button>
              );
            })}
          </div>

          {/* Accordion List */}
          <div className="divide-y divide-[#262b2f] border-y border-[#262b2f]">
            {filteredFaqs.map((item) => {
              const isOpen = openFaqId === item.id;
              return (
                <div key={item.id} className="py-1">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaqId(isOpen ? null : item.id)}
                    className="w-full py-4 text-start flex items-center justify-between gap-4 font-display font-bold text-base sm:text-lg text-[#f2f4f3] hover:text-[#2dff6e] transition-colors cursor-pointer"
                  >
                    <span>{lang === 'ar' ? item.qAr : item.qFr}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#2dff6e] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="pb-5 text-sm sm:text-base text-[#9aa2a9] leading-relaxed max-w-[68ch]">
                      {lang === 'ar' ? item.aAr : item.aFr}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FOOTER & ORIENTAL REGIONAL HUB */}
      <footer id="localisation" className="pt-16 sm:pt-24 pb-24 sm:pb-16 bg-[#111416]">
        <div className="max-w-[1160px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Showroom Info */}
            <div className="lg:col-span-5">
              <p className="text-xs font-mono-num text-[#9aa2a9] mb-2">
                NeoRide by Zelloufi · Maroc
              </p>
              <h2 className="text-silver font-display font-bold text-2xl sm:text-4xl">
                {lang === 'ar' ? 'زورونا في معرض بركان' : 'Venez nous voir à Berkane'}
              </h2>

              {/* Live Status Box (clean hairline border, explicit text state) */}
              <div className="mt-5 p-4 rounded bg-[#141719] border border-[#262b2f] flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
                <div>
                  <span className="text-[#9aa2a9]">
                    {lang === 'ar' ? 'حالة المعرض والورشة الآن: ' : 'Showroom & Atelier Berkane : '}
                  </span>
                  <strong
                    className={
                      showroomStatus.isOpen ? 'text-[#2dff6e] font-bold' : 'text-[#ff9a9a] font-bold'
                    }
                  >
                    {showroomStatus.isOpen
                      ? lang === 'ar'
                        ? 'مفتوح الآن'
                        : 'Ouvert actuellement'
                      : lang === 'ar'
                      ? 'مغلق حاليًا'
                      : 'Fermé pour le moment'}
                  </strong>
                </div>
                <span className="font-mono-num text-xs text-[#9aa2a9]">
                  {lang === 'ar' ? 'الاثنين – السبت · 09:00 – 19:30' : 'Lun – Sam · 09h00 – 19h30'}
                </span>
              </div>

              <address className="not-italic mt-6 space-y-4 text-sm sm:text-base">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#2dff6e] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-xs font-semibold text-[#9aa2a9]">
                      {lang === 'ar' ? 'العنوان' : 'Adresse'}
                    </strong>
                    <span className="text-[#f2f4f3]">
                      {lang === 'ar'
                        ? 'بركان، جهة الشرق، المغرب'
                        : 'Berkane, région de l’Oriental, Maroc'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#2dff6e] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-xs font-semibold text-[#9aa2a9]">
                      {lang === 'ar' ? 'الهاتف وواتساب' : 'Téléphone & WhatsApp'}
                    </strong>
                    <div className="flex flex-wrap items-center gap-3 mt-0.5">
                      <a
                        href="tel:+212600000000"
                        className="text-[#f2f4f3] hover:text-[#2dff6e] underline underline-offset-4 font-mono-num bidi-plain"
                      >
                        +212 6 00 00 00 00
                      </a>
                      <span aria-hidden="true" className="text-[#6e777d]">·</span>
                      <a
                        href={buildWhatsAppUrl(
                          lang === 'ar'
                            ? 'السلام عليكم NeoRide، عندي سؤال.'
                            : 'Bonjour NeoRide, j’ai une question.'
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#2dff6e] hover:underline font-semibold"
                      >
                        {lang === 'ar' ? 'محادثة واتساب مباشرة' : 'Messagerie WhatsApp'}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#2dff6e] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-xs font-semibold text-[#9aa2a9]">
                      {lang === 'ar' ? 'أوقات العمل' : 'Horaires d’ouverture'}
                    </strong>
                    <span className="text-[#f2f4f3]">
                      {lang === 'ar'
                        ? 'من الاثنين إلى السبت: 09:00 صباحًا – 19:30 مساءً'
                        : 'Lundi au Samedi : 09h00 – 19h30'}
                    </span>
                  </div>
                </div>
              </address>
            </div>

            {/* Interactive Map Embed */}
            <div className="lg:col-span-7 relative rounded overflow-hidden border border-[#262b2f] bg-[#141719] min-h-[320px]">
              <iframe
                title={lang === 'ar' ? 'خريطة بركان، المغرب' : 'Carte de Berkane, Maroc'}
                src="https://maps.google.com/maps?q=Berkane%2C%20Morocco&z=13&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-[320px] sm:h-[350px] block border-0 grayscale contrast-90 invert-[0.88]"
              />
              <div className="p-4 sm:p-5 bg-[#0d0f10]/95 border-t border-[#262b2f] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <strong className="block text-sm sm:text-base text-[#f2f4f3]">
                    NeoRide by Zelloufi · Berkane
                  </strong>
                  <p className="text-xs text-[#9aa2a9]">
                    {lang === 'ar'
                      ? 'افتح الموقع على خرائط Google لتحضير زيارتك للمعرض.'
                      : 'Ouvrez l’itinéraire sur Google Maps pour préparer votre visite.'}
                  </p>
                </div>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=NeoRide+by+Zelloufi+Berkane"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 min-h-[42px] px-4 py-2 bg-[#2dff6e] hover:bg-white text-[#05150b] font-bold text-xs sm:text-sm rounded transition-colors whitespace-nowrap shrink-0"
                >
                  <span>{lang === 'ar' ? 'فتح في خرائط Google' : 'Itinéraire Google Maps'}</span>
                  <ArrowUpRight className="w-4 h-4 flip-rtl" />
                </a>
              </div>
            </div>
          </div>

          {/* Oriental Region City Delivery Selector */}
          <div className="mt-14 pt-10 border-t border-[#262b2f]">
            <div className="max-w-[68ch] mb-5">
              <h3 className="font-display font-bold text-xl sm:text-2xl text-[#f2f4f3]">
                {lang === 'ar'
                  ? 'من بركان إلى كافة مدن الجهة الشرقية'
                  : 'Depuis Berkane, livraison dans tout l’Oriental'}
              </h3>
              <p className="text-xs sm:text-sm text-[#9aa2a9] mt-1">
                {lang === 'ar'
                  ? 'هل أنت في وجدة، الناظور، السعيدية، تاوريرت أو أحفير؟ اضغط على مدينتك لإرسال طلب استفسار عن التوصيل مباشرة عبر واتساب.'
                  : 'Vous habitez à Oujda, Nador, Saïdia, Taourirt ou Ahfir ? Sélectionnez votre ville pour connaître les modalités de livraison directe à domicile.'}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {ORIENTAL_CITIES.map((city) => (
                <a
                  key={city.id}
                  href={buildWhatsAppUrl(lang === 'ar' ? city.msgAr : city.msgFr)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded bg-[#141719] hover:bg-[#1a1e21] border border-[#262b2f] hover:border-[#2dff6e] transition-colors group flex flex-col justify-between gap-1"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-display font-bold text-base text-[#f2f4f3] group-hover:text-[#2dff6e]">
                      {lang === 'ar' ? city.nameAr : city.nameFr}
                    </span>
                    <MessageSquare className="w-3.5 h-3.5 text-[#6e777d] group-hover:text-[#2dff6e]" />
                  </div>
                  <span className="text-[11px] text-[#9aa2a9]">
                    {lang === 'ar' ? city.tagAr : city.tagFr}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Quiet Footer Copyright & Links */}
          <div className="mt-12 pt-6 border-t border-[#262b2f] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6e777d]">
            <div>
              © {new Date().getFullYear()} NeoRide by Zelloufi — Berkane, Oriental, Maroc.{' '}
              {lang === 'ar' ? 'جميع الحقوق محفوظة.' : 'Tous droits réservés.'}
            </div>
            <div className="flex items-center gap-4">
              <a href="#catalogue" className="hover:text-[#f2f4f3] transition-colors">
                {lang === 'ar' ? 'الكتالوج' : 'Catalogue'}
              </a>
              <a href="#electrique" className="hover:text-[#f2f4f3] transition-colors">
                {lang === 'ar' ? 'حاسبة التوفير' : 'Calculateur'}
              </a>
              <a href="#essai" className="hover:text-[#f2f4f3] transition-colors">
                {lang === 'ar' ? 'حجز تجربة' : 'Essai'}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
