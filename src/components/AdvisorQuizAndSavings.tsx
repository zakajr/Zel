import React, { useState, useRef } from 'react';
import {
  Lang,
  VEHICLE_PRODUCTS,
  ProductItem,
  buildWhatsAppUrl,
} from '../data/neorideData';

interface AdvisorQuizAndSavingsProps {
  lang: Lang;
}

export const AdvisorQuizAndSavings: React.FC<AdvisorQuizAndSavingsProps> = ({
  lang,
}) => {
  // --- Quiz State ---
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const quizHeadingRef = useRef<HTMLDivElement | null>(null);

  const Q = [
    {
      qFr: 'Vos trajets par jour ?',
      qAr: 'كم تقطع يوميًا؟',
      opts: [
        { fr: 'Moins de 20 km', ar: 'أقل من 20 كم', val: 20, tagFr: 'moins de 20 km', tagAr: 'أقل من 20 كم' },
        { fr: '20 à 40 km', ar: 'من 20 إلى 40 كم', val: 40, tagFr: '20 à 40 km', tagAr: 'من 20 حتى 40 كم' },
        { fr: 'Plus de 40 km', ar: 'أكثر من 40 كم', val: 60, tagFr: 'plus de 40 km', tagAr: 'أكثر من 40 كم' },
      ],
    },
    {
      qFr: 'Votre style de conduite ?',
      qAr: 'ما أسلوب قيادتك؟',
      opts: [
        { fr: 'Tranquille, en ville', ar: 'هادئ داخل المدينة', val: 0 },
        { fr: 'Dynamique, sur route', ar: 'ديناميكي على الطريق', val: 1 },
      ],
    },
    {
      qFr: 'Votre budget ?',
      qAr: 'ما ميزانيتك؟',
      opts: [
        { fr: 'Jusqu’à 10\u00a0000 DH', ar: 'حتى 10\u00a0000 درهم', val: 10000 },
        { fr: '10\u00a0000 à 18\u00a0000 DH', ar: 'من 10\u00a0000 إلى 18\u00a0000 درهم', val: 18000 },
        { fr: 'Plus de 18\u00a0000 DH', ar: 'أكثر من 18\u00a0000 درهم', val: 99999 },
      ],
    },
  ];

  const handleSelectOption = (idx: number) => {
    setQuizAnswers((prev) => [...prev, idx]);
    setTimeout(() => {
      quizHeadingRef.current?.focus();
    }, 0);
  };

  const handleResetQuiz = () => {
    setQuizAnswers([]);
    setTimeout(() => {
      quizHeadingRef.current?.focus();
    }, 0);
  };

  const getQuizResult = (): { match: ProductItem; over: boolean } | null => {
    if (quizAnswers.length < 3) return null;
    const d = Q[0].opts[quizAnswers[0]].val;
    const st = Q[1].opts[quizAnswers[1]].val;
    const bd = Q[2].opts[quizAnswers[2]].val;

    let c = VEHICLE_PRODUCTS.filter((p) => p.rangeKm >= d && p.priceDh <= bd);
    let over = false;
    if (!c.length) {
      over = true;
      c = VEHICLE_PRODUCTS.filter((p) => p.rangeKm >= d);
    }
    if (!c.length) {
      c = [...VEHICLE_PRODUCTS]
        .sort((a, b) => b.rangeKm - a.rangeKm)
        .slice(0, 1);
    }
    c.sort((a, b) => (st ? b.speedKmh - a.speedKmh : a.priceDh - b.priceDh));
    return { match: c[0], over };
  };

  const quizRes = getQuizResult();

  // --- Savings Calculator State ---
  const [dailyKm, setDailyKm] = useState<number>(30);
  const [calcMode, setCalcMode] = useState<'commuter' | 'delivery'>('commuter');

  const daysPerYear = calcMode === 'delivery' ? 330 : 365;
  const y = dailyKm * daysPerYear;
  const t = y * (0.035 * 13 + 0.15);
  const e = y * 0.08;
  const yearlySavings = t - e;
  const monthlySavings = Math.round(yearlySavings / 12);

  const referenceModel =
    dailyKm > 45 ? VEHICLE_PRODUCTS[1] : VEHICLE_PRODUCTS[2];
  const paybackMonths = Math.max(
    4,
    Math.round(referenceModel.priceDh / Math.max(1, monthlySavings))
  );

  const formatDh = (n: number) =>
    Math.round(n)
      .toLocaleString('fr-FR')
      .replace(/\u202f/g, '\u00a0') + ' DH';

  const okModels = VEHICLE_PRODUCTS.filter((m) => m.rangeKm >= dailyKm * 1.25).sort(
    (a, b) => a.priceDh - b.priceDh
  );

  const recoText = okModels.length
    ? lang === 'ar'
      ? `كيغطيه بشحنة وحدة بلا مشاكل: ${okModels
          .slice(0, 3)
          .map((m) => m.name)
          .join(', ')}.`
      : `Trajet couvert avec une seule charge : ${okModels
          .slice(0, 3)
          .map((m) => m.name)
          .join(', ')}.`
    : lang === 'ar'
    ? 'هاد المسافة كتفوت شحنة وحدة: شحن بين الطلبيات ولا بطارية احتياطية.'
    : 'Ce trajet dépasse une seule charge : prévoyez une recharge entre deux courses ou une batterie de rechange.';

  return (
    <>
      {/* SECTION 02: 3-QUESTION QUIZ (#quiz) */}
      <section id="quiz">
        <div className="wrap">
          <h2 className="si">
            {lang === 'ar'
              ? 'اعثر على NeoRide المناسبة لك في 3 أسئلة'
              : 'Trouvez votre NeoRide en 3 questions'}
          </h2>
          <p className="lead">
            {lang === 'ar'
              ? 'تنقلاتك وأسلوبك وميزانيتك: سنساعدك في اختيار الطراز المناسب.'
              : 'Vos trajets, votre style, votre budget : on vous indique le modèle qui vous correspond.'}
          </p>

          <div className="qz" id="qz">
            {!quizRes ? (
              <>
                <div className="qp">
                  {[0, 1, 2].map((j) => (
                    <i
                      key={j}
                      className={j <= quizAnswers.length ? 'on' : ''}
                    />
                  ))}
                </div>
                <div
                  className="qq"
                  ref={quizHeadingRef}
                  tabIndex={-1}
                >
                  {lang === 'ar'
                    ? Q[quizAnswers.length].qAr
                    : Q[quizAnswers.length].qFr}
                </div>
                <div className="qo">
                  {Q[quizAnswers.length].opts.map((o, j) => (
                    <button
                      key={j}
                      type="button"
                      onClick={() => handleSelectOption(j)}
                    >
                      {lang === 'ar' ? o.ar : o.fr}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="qr">
                <div className="stock">
                  {lang === 'ar'
                    ? 'NeoRide المناسبة لك'
                    : 'Votre NeoRide idéale'}
                </div>
                <h3
                  className="si"
                  ref={quizHeadingRef}
                  tabIndex={-1}
                >
                  {quizRes.match.name}
                </h3>
                <div className="pr">{quizRes.match.priceFormatted} DH</div>

                <dl className="sp">
                  <div>
                    <dd>{quizRes.match.rangeKm}</dd>
                    <dt>{lang === 'ar' ? 'كم مدى السير' : 'km d’autonomie'}</dt>
                  </div>
                  <div>
                    <dd>{quizRes.match.speedKmh}</dd>
                    <dt>{lang === 'ar' ? 'كم/ساعة كحد أقصى' : 'km/h max'}</dt>
                  </div>
                  <div>
                    <dd>{quizRes.match.chargeHours} h</dd>
                    <dt>{lang === 'ar' ? 'للشحن' : 'de charge'}</dt>
                  </div>
                  <div>
                    <dd>{quizRes.match.specs[3]?.value.split(' ')[0]}</dd>
                    <dt>
                      {lang === 'ar'
                        ? `بطارية ${quizRes.match.specs[3]?.value.split(' ')[1] || ''}`
                        : `batterie ${quizRes.match.specs[3]?.value.split(' ')[1] || ''}`}
                    </dt>
                  </div>
                </dl>

                {quizRes.over && (
                  <p className="tiny">
                    {lang === 'ar'
                      ? 'لا يوجد طراز ضمن هذه الميزانية: هذا الأقرب لاحتياجاتك.'
                      : 'Aucun modèle dans ce budget : voici le plus proche de vos besoins.'}
                  </p>
                )}

                <div className="cta">
                  <a
                    className="btn btn-g wa-link"
                    href={buildWhatsAppUrl(
                      lang === 'ar'
                        ? `السلام عليكم NeoRide، الاختبار نصحني بـ: ${quizRes.match.name} (${quizRes.match.priceFormatted} درهم). المسافة ديالي: ${Q[0].opts[quizAnswers[0]].tagAr} فالنهار. واش متوفر؟`
                        : `Bonjour NeoRide, le quiz me recommande : ${quizRes.match.name} (${quizRes.match.priceFormatted} DH). Mes trajets : ${Q[0].opts[quizAnswers[0]].tagFr} par jour. Est-il disponible ?`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {lang === 'ar'
                      ? 'اطلب عبر واتساب'
                      : 'Demander sur WhatsApp'}
                  </a>
                  <button
                    className="btn btn-o"
                    id="qr"
                    type="button"
                    onClick={handleResetQuiz}
                  >
                    {lang === 'ar' ? 'إعادة المحاولة' : 'Recommencer'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 03: SAVINGS & REMOVABLE BATTERY (#electrique) */}
      <section className="save" id="electrique">
        <div className="wrap sv">
          <div>
            <div className="zero si">
              0
              <small>
                {lang === 'ar' ? 'درهم للبنزين' : 'DH d’essence'}
              </small>
            </div>
            <h2
              className="si"
              style={{ fontSize: 'clamp(26px,4vw,40px)' }}
            >
              {lang === 'ar'
                ? 'تكلفة كل كيلومتر منخفضة جدًا.'
                : 'Chaque kilomètre vous coûte presque rien.'}
            </h2>
            <div className="pt">
              <p>
                <b>{lang === 'ar' ? 'صيانة أقل.' : 'Entretien minimal.'}</b>{' '}
                {lang === 'ar'
                  ? 'لا تغيير للزيت ولا شمعات إشعال ولا سير نقل الحركة؛ وقت أقل في الصيانة.'
                  : 'Ni vidange, ni bougies, ni courroie : on passe moins de temps à l’atelier.'}
              </p>
              <p>
                <b>
                  {lang === 'ar' ? 'هدوء وقوة.' : 'Silence et puissance.'}
                </b>{' '}
                {lang === 'ar'
                  ? 'تسارع فوري عند تدوير المقبض، دون ضجيج أو دخان.'
                  : 'La poussée est immédiate dès que vous tournez la poignée, sans bruit ni fumée.'}
              </p>
            </div>
          </div>

          <div className="calc" aria-live="polite">
            <div className="fl">
              <span>{lang === 'ar' ? 'مسار معتاد' : 'Trajet type'}</span>

              {/* Commuter / Livreur Pro Toggle */}
              <div className="inline-flex gap-1 bg-white/8 p-1">
                <button
                  type="button"
                  onClick={() => setCalcMode('commuter')}
                  className={`min-h-[30px] px-2.5 text-xs font-bold transition-colors cursor-pointer ${
                    calcMode === 'commuter'
                      ? 'bg-[#2dff6e] text-[#05150b]'
                      : 'text-[#d7dce0] hover:text-white'
                  }`}
                >
                  {lang === 'ar' ? 'يومي' : 'Quotidien'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCalcMode('delivery');
                    if (dailyKm < 60) setDailyKm(85);
                  }}
                  className={`min-h-[30px] px-2.5 text-xs font-bold transition-colors cursor-pointer ${
                    calcMode === 'delivery'
                      ? 'bg-[#2dff6e] text-[#05150b]'
                      : 'text-[#d7dce0] hover:text-white'
                  }`}
                >
                  {lang === 'ar' ? 'موزّع محترف' : 'Livreur Pro'}
                </button>
              </div>
            </div>

            <div
              className="chips"
              id="trajets"
              role="group"
              aria-label={lang === 'ar' ? 'مسارات معتادة' : 'Trajets types'}
            >
              <button
                type="button"
                aria-pressed={dailyKm === 15}
                onClick={() => setDailyKm(15)}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M4 21V10l6-3v14M10 21V5l10 4v12M2 21h20M13 12h4M13 16h4" />
                </svg>
                <span>
                  {lang === 'ar'
                    ? 'بركان المدينة (15 كم)'
                    : 'Berkane Ville (15 km)'}
                </span>
              </button>

              <button
                type="button"
                aria-pressed={dailyKm === 35}
                onClick={() => setDailyKm(35)}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M7 21L10 3M17 21L14 3M12 5v3M12 11v3M12 17v3" />
                </svg>
                <span>
                  {lang === 'ar'
                    ? 'بركان ↔ أحفير (35 كم)'
                    : 'Berkane ↔ Ahfir (35 km)'}
                </span>
              </button>

              <button
                type="button"
                aria-pressed={dailyKm === 50}
                onClick={() => setDailyKm(50)}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="17" cy="6" r="2.5" />
                  <path d="M2 14c2.5-2 5-2 7.5 0s5 2 7.5 0 3.5-1.5 5-1M2 19c2.5-2 5-2 7.5 0s5 2 7.5 0 3.5-1.5 5-1" />
                </svg>
                <span>
                  {lang === 'ar'
                    ? 'بركان ↔ السعيدية (50 كم)'
                    : 'Berkane ↔ Saïdia (50 km)'}
                </span>
              </button>

              <button
                type="button"
                aria-pressed={dailyKm === 85}
                onClick={() => {
                  setDailyKm(85);
                  setCalcMode('delivery');
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 8h14l-1.2 11.2a2 2 0 01-2 1.8H8.2a2 2 0 01-2-1.8L5 8zM9 8V6a3 3 0 016 0v2" />
                </svg>
                <span>
                  {lang === 'ar'
                    ? 'موزّع / استعمال مكثف (85 كم)'
                    : 'Livreur / Intensif (85 km)'}
                </span>
              </button>
            </div>

            <label htmlFor="km">
              <span>
                {lang === 'ar' ? 'تنقلاتك اليومية' : 'Vos trajets par jour'}
              </span>
              <output id="kmo">
                {dailyKm}
                {lang === 'ar' ? ' كم' : ' km'}
              </output>
            </label>

            <input
              id="km"
              type="range"
              min={5}
              max={120}
              value={dailyKm}
              step={5}
              onChange={(ev) => setDailyKm(Number(ev.target.value))}
            />

            <div className="row">
              <span>{lang === 'ar' ? 'بنزين' : 'Thermique'}</span>
              <div className="track">
                <div className="fill f1" id="b1" style={{ width: '100%' }} />
              </div>
              <b id="t1">{formatDh(t)}</b>
            </div>

            <div className="row">
              <span>{lang === 'ar' ? 'كهربائية' : 'Électrique'}</span>
              <div className="track">
                <div
                  className="fill f2"
                  id="b2"
                  style={{ width: `${Math.max(4, (e / t) * 100)}%` }}
                />
              </div>
              <b id="t2">{formatDh(e)}</b>
            </div>

            <div className="big flex flex-wrap items-end justify-between gap-4">
              <div>
                <span>
                  {lang === 'ar'
                    ? 'التوفير السنوي التقديري'
                    : 'Économie estimée par an'}
                </span>
                <strong id="sav">{formatDh(yearlySavings)}</strong>
              </div>

              <div className="px-3.5 py-2 bg-white/[0.04] border border-white/10 text-xs">
                <span className="text-[#9aa2a9] block">
                  {lang === 'ar'
                    ? `استرجاع ثمن ${referenceModel.name}`
                    : `Rentabilisée (${referenceModel.name})`}
                </span>
                <b className="font-display text-base text-[#f2f4f3] tabular-nums bidi-plain">
                  ~{paybackMonths} {lang === 'ar' ? 'أشهر' : 'mois'}
                </b>
              </div>
            </div>

            <p className="reco" id="reco" aria-live="polite">
              {recoText}
            </p>
            <p className="tiny">
              {lang === 'ar'
                ? 'تقدير: البنزين 3.5 لتر لكل 100 كم بسعر 13 درهمًا للتر وصيانة 0.15 درهم/كم؛ والكهرباء 0.05 درهم/كم للشحن و0.03 درهم/كم للصيانة.'
                : 'Estimation : thermique 3,5 L/100 km, essence 13 DH/L, entretien 0,15 DH/km ; électrique 0,05 DH/km de recharge et 0,03 DH/km d’entretien.'}
            </p>
          </div>
        </div>

        <div className="wrap extra">
          <aside className="conversion-strip pro" aria-labelledby="prot">
            <div>
              <strong id="prot">
                <span className="ic">
                  <svg
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="6" cy="17" r="3" />
                    <circle cx="18" cy="17" r="3" />
                    <path d="M9 17h5l3-9M6 17l2-5h4M16 8h3" />
                  </svg>
                </span>
                {lang === 'ar'
                  ? 'واش نتا موزّع (Glovo، مطعم، ساعي) فبركان، وجدة ولا الناظور؟'
                  : 'Vous êtes livreur (Glovo, resto, coursier) à Berkane, Oujda ou Nador ?'}
              </strong>
              <p>
                {lang === 'ar'
                  ? 'بلا ما تحرق 40 حتى 60 درهم ديال البنزين فالنهار (حوالي 1\u00a0500 درهم فالشهر). موطور NeoRide الكهربائي كيكلفك أقل من 5 دراهم ديال الشحن فالنهار: الموطور كيخلّص على راسو من اللي كتوفر فالبنزين.'
                  : 'Arrêtez de brûler 40 à 60 DH d’essence par jour (~1\u00a0500 DH/mois). Une NeoRide électrique vous coûte moins de 5 DH de charge par jour : votre moto se rentabilise avec vos économies d’essence.'}
              </p>
            </div>
            <a
              className="btn btn-g wa-link"
              href={buildWhatsAppUrl(
                lang === 'ar'
                  ? 'السلام عليكم NeoRide، أنا موزّع وبغيت نحسب واش الموطور الكهربائي كيربّحني فالخدمة ديالي.'
                  : 'Bonjour NeoRide, je suis livreur et je veux calculer la rentabilité d’une moto électrique pour mon travail.'
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              {lang === 'ar'
                ? 'حسب ليا الربح ديالي'
                : 'Calculer ma rentabilité'}
            </a>
          </aside>

          <div className="chg">
            <h3 className="si">
              {lang === 'ar'
                ? 'شحن بحال التيليفون'
                : 'Rechargez comme un téléphone'}
            </h3>
            <ol className="steps">
              <li>
                <span className="stn">1</span>
                <b>
                  {lang === 'ar' ? 'حيّدها فـ 10 ثواني' : 'Déclipsez en 10 sec'}
                </b>
                <span>
                  {lang === 'ar'
                    ? 'بطارية بمقبض مريح'
                    : 'Batterie à poignée ergonomique'}
                </span>
              </li>
              <li>
                <span className="stn">2</span>
                <b>
                  {lang === 'ar' ? 'طلّعها للدار' : 'Montez-la chez vous'}
                </b>
                <span>
                  {lang === 'ar'
                    ? 'شقة، مكتب ولا مقهى — ما بقيتي محتاج بريز فالكاراج'
                    : 'Appartement, bureau ou café — plus besoin de prise au garage'}
                </span>
              </li>
              <li>
                <span className="stn">3</span>
                <b>
                  {lang === 'ar'
                    ? 'وصّلها بالبريز 220 فولت'
                    : 'Branchez sur prise 220V'}
                </b>
                <span>
                  {lang === 'ar'
                    ? 'شحن كامل بحوالي 2 حتى 3 دراهم ديال الكهرباء'
                    : 'Charge complète pour ~2 à 3 DH d’électricité'}
                </span>
              </li>
            </ol>
          </div>
        </div>
      </section>
    </>
  );
};
