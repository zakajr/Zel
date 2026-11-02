import React, { useState, useEffect } from 'react';
import {
  Lang,
  VEHICLE_PRODUCTS,
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
  const [ed, setEd] = useState<number>(2); // Mercredi
  const [eh, setEh] = useState<number>(2); // 16h
  const [en, setEn] = useState<string>('');
  const [showroomStatus, setShowroomStatus] = useState(() =>
    getShowroomStatus()
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setShowroomStatus(getShowroomStatus());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const DS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const DF = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  const DSA = ['الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const HS = ['10h', '12h', '16h', '18h'];
  const HSA = ['10:00', '12:00', '16:00', '18:00'];

  const selectedModel =
    VEHICLE_PRODUCTS.find((m) => m.id === selectedTestRideModelId) ||
    VEHICLE_PRODUCTS[0];

  const cleanName = en.trim() || 'votre prénom';
  const t =
    lang === 'ar'
      ? `السلام عليكم NeoRide، اسمي ${cleanName}. أود تجربة ${selectedModel.name} يوم ${DSA[ed]} على الساعة ${HS[eh]}.`
      : `Bonjour NeoRide, c’est ${cleanName}. Je souhaite essayer la ${selectedModel.name} ${DF[ed]} à ${HS[eh]}.`;

  return (
    <>
      {/* SECTION 04: SHOWROOM TRUST & GUARANTEES (#confiance) */}
      <section id="confiance">
        <div className="wrap">
          <p className="product-kicker">
            {lang === 'ar'
              ? 'الثقة دون وعود فارغة'
              : 'LA CONFIANCE, SANS PROMESSES VIDES'}
          </p>
          <h2 className="si">
            {lang === 'ar'
              ? 'تفضل بالزيارة، واطرح أسئلتك، واتخذ قرارك براحة.'
              : 'Venez voir. Posez vos questions. Décidez sereinement.'}
          </h2>
          <p className="lead">
            {lang === 'ar'
              ? 'تعرّف على الطرازات عن قرب، وتحدث مع فريقنا لاختيار ما يناسب احتياجاتك اليومية.'
              : 'Découvrez les modèles de près, échangez avec notre équipe et trouvez la solution qui correspond à votre quotidien.'}
          </p>

          <div className="proof-grid">
            <article className="proof-card">
              <div
                className="art"
                role="img"
                aria-label={
                  lang === 'ar'
                    ? 'دراجة معروضة (صورة توضيحية)'
                    : 'Moto exposée, visuel d’inspiration'
                }
              >
                <VehicleIllustration kind="moto" accentColor="#2dff6e" />
              </div>
              <div>
                <span className="proof-label">
                  {lang === 'ar' ? 'طرازاتنا' : 'NOS MODÈLES'}
                </span>
                <h3>
                  {lang === 'ar'
                    ? 'شاهد الطرازات عن قرب'
                    : 'Les modèles en vrai'}
                </h3>
                <p>
                  {lang === 'ar'
                    ? 'اكتشف مجموعة من المركبات المصممة لتسهيل تنقلاتك داخل المدينة وفي حياتك اليومية.'
                    : 'Découvrez une sélection de véhicules pensés pour simplifier vos déplacements en ville et au quotidien.'}
                </p>
              </div>
            </article>

            <article className="proof-card">
              <div
                className="art"
                role="img"
                aria-label={
                  lang === 'ar'
                    ? 'تفصيل دراجة (صورة توضيحية)'
                    : 'Détail de moto, visuel d’inspiration'
                }
              >
                <VehicleIllustration kind="scoot" accentColor="#2dff6e" />
              </div>
              <div>
                <span className="proof-label">
                  {lang === 'ar' ? 'التفاصيل' : 'DANS LES DÉTAILS'}
                </span>
                <h3>
                  {lang === 'ar'
                    ? 'تفاصيل تمنحك الثقة'
                    : 'Les détails qui rassurent'}
                </h3>
                <p>
                  {lang === 'ar'
                    ? 'قارن التجهيزات والمواصفات والخيارات لاختيار الطراز المناسب لك.'
                    : 'Comparez les équipements, les caractéristiques et les options pour choisir le modèle qui vous convient.'}
                </p>
              </div>
            </article>

            <article className="proof-card">
              <div
                className="art"
                role="img"
                aria-label={
                  lang === 'ar'
                    ? 'تجهيزات ودراجة (صورة توضيحية)'
                    : 'Équipement et moto, visuel d’inspiration'
                }
              >
                <VehicleIllustration kind="battery" accentColor="#2dff6e" />
              </div>
              <div>
                <span className="proof-label">
                  {lang === 'ar' ? 'المواكبة' : 'ACCOMPAGNEMENT'}
                </span>
                <h3>
                  {lang === 'ar'
                    ? 'خدمة ومواكبة واضحة'
                    : 'Un service identifiable'}
                </h3>
                <p>
                  {lang === 'ar'
                    ? 'يرافقك فريقنا في الاختيار ويجيب عن أسئلتك قبل اتخاذ القرار.'
                    : 'Notre équipe vous accompagne dans votre choix et répond à vos questions avant votre décision.'}
                </p>
              </div>
            </article>
          </div>

          <div className="trust-actions">
            <a
              className="btn btn-g wa-link"
              href={buildWhatsAppUrl(
                lang === 'ar'
                  ? 'السلام عليكم NeoRide، بغيت نزور المعرض ونشوف الموديلات المتوفرة.'
                  : 'Bonjour NeoRide, je voudrais visiter le showroom et voir les modèles disponibles.'
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              {lang === 'ar' ? 'تواصل مع المعرض' : 'Contacter le showroom'}
            </a>
            <a className="btn btn-o" href="#localisation">
              {lang === 'ar' ? 'عرض الموقع' : 'Voir la localisation'}
            </a>
          </div>

          <h3 className="si sub">
            {lang === 'ar' ? 'قد بثقة وراحة بال' : 'Roulez l’esprit tranquille'}
          </h3>

          <div className="gr">
            <div>
              <b>
                {lang === 'ar'
                  ? 'ضمان الشركة المصنّعة'
                  : 'Garantie constructeur'}
              </b>
              <span>
                {lang === 'ar'
                  ? 'تختلف شروط الضمان حسب الطراز والشركة المصنّعة. اطلب التفاصيل عند زيارتك.'
                  : 'Les conditions de garantie dépendent du modèle et du fabricant. Demandez les détails lors de votre visite.'}
              </span>
            </div>
            <div>
              <b>
                {lang === 'ar'
                  ? 'قطع الغيار وخدمة ما بعد البيع'
                  : 'Pièces & après-vente'}
              </b>
              <span>
                {lang === 'ar'
                  ? 'استفسر عن الصيانة وقطع الغيار المتوافقة وخدمات ما بعد البيع المتاحة.'
                  : 'Renseignez-vous sur l’entretien, les pièces compatibles et les solutions après-vente proposées.'}
              </span>
            </div>
            <div>
              <b>{lang === 'ar' ? 'جرّب قبل الشراء' : 'Essai avant achat'}</b>
              <span>
                {lang === 'ar'
                  ? 'تواصل مع فريقنا لمعرفة إمكانية تجربة الطراز الذي تختاره.'
                  : 'Contactez notre équipe pour connaître les possibilités d’essai selon le modèle choisi.'}
              </span>
            </div>
            <div>
              <b>
                {lang === 'ar'
                  ? 'المواكبة الإدارية'
                  : 'Accompagnement administratif'}
              </b>
              <span>
                {lang === 'ar'
                  ? 'يساعدك فريقنا في معرفة الوثائق والإجراءات المتعلقة بالمركبة المختارة.'
                  : 'Notre équipe vous renseigne sur les documents et démarches liés au véhicule choisi.'}
              </span>
            </div>
            <div>
              <b>
                {lang === 'ar'
                  ? 'إمكانية استبدال المركبة'
                  : 'Solutions de reprise'}
              </b>
              <span>
                {lang === 'ar'
                  ? 'تواصل معنا لمعرفة ما إذا كان استبدال مركبتك ممكنًا.'
                  : 'Contactez-nous pour savoir si une solution de reprise peut être envisagée.'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 05: BOOK A TEST RIDE (#essai) */}
      <section id="essai">
        <div className="wrap es" style={{ maxWidth: '720px' }}>
          <h2 className="si">
            {lang === 'ar' ? 'جرّب الموطور فبركان' : 'Réserver un essai'}
          </h2>
          <p className="lead">
            {lang === 'ar'
              ? 'اختر الطراز واليوم والوقت المناسب لك.'
              : 'Choisissez votre modèle, votre jour et l’heure qui vous conviennent.'}
          </p>

          <label htmlFor="em">
            {lang === 'ar' ? 'أي طراز؟' : 'Quel modèle ?'}
          </label>
          <select
            id="em"
            value={selectedModel.id}
            onChange={(e) => onChangeTestRideModelId(e.target.value)}
          >
            {VEHICLE_PRODUCTS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — {p.priceFormatted} DH
              </option>
            ))}
          </select>

          <div className="fl">{lang === 'ar' ? 'أي يوم؟' : 'Quel jour ?'}</div>
          <div className="chips" id="ed">
            {(lang === 'ar' ? DSA : DS).map((dLabel, idx) => (
              <button
                key={dLabel}
                type="button"
                aria-pressed={ed === idx}
                onClick={() => setEd(idx)}
              >
                {dLabel}
              </button>
            ))}
          </div>

          <div className="fl">
            {lang === 'ar' ? 'أي ساعة؟' : 'Quelle heure ?'}
          </div>
          <div className="chips" id="eh">
            {(lang === 'ar' ? HSA : HS).map((hLabel, idx) => (
              <button
                key={hLabel}
                type="button"
                aria-pressed={eh === idx}
                onClick={() => setEh(idx)}
              >
                {hLabel}
              </button>
            ))}
          </div>

          <label htmlFor="en">
            {lang === 'ar' ? 'اسمك الأول' : 'Votre prénom'}
          </label>
          <input
            className="fi"
            id="en"
            value={en}
            onChange={(e) => setEn(e.target.value)}
            placeholder={lang === 'ar' ? 'الاسم الأول' : 'Prénom'}
            autoComplete="given-name"
          />

          <p className="tiny">
            {lang === 'ar'
              ? 'المواعيد تقريبية: يؤكد الفريق اليوم والساعة عبر واتساب.'
              : 'Créneaux indicatifs : l’équipe confirme le jour et l’heure sur WhatsApp.'}
          </p>

          <div className="pv" id="ep" aria-live="polite">
            {lang === 'ar'
              ? `معاينة الرسالة: « ${t} »`
              : `Aperçu : « ${t} »`}
          </div>

          <a
            className="btn btn-g wa-link"
            id="ew"
            href={buildWhatsAppUrl(t)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {lang === 'ar' ? 'أرسل عبر واتساب' : 'Envoyer sur WhatsApp'}
          </a>
        </div>
      </section>

      {/* SECTION 06: FAQ WITH LIGHTNING BOLT & GREEN CHARGE PULSE (#faq) */}
      <section id="faq">
        <div className="wrap faq">
          <h2 className="si">
            {lang === 'ar' ? 'الأسئلة الشائعة' : 'Questions fréquentes'}
          </h2>
          <p className="lead">
            {lang === 'ar'
              ? 'إجابات عن أكثر الأسئلة شيوعًا لدى عملائنا في بركان وجهة الشرق.'
              : 'Ce que les clients de Berkane et de l’Oriental nous demandent le plus.'}
          </p>

          {FAQ_ITEMS.map((item) => (
            <details key={item.id}>
              <summary>{lang === 'ar' ? item.qAr : item.qFr}</summary>
              <p>{lang === 'ar' ? item.aAr : item.aFr}</p>
            </details>
          ))}
        </div>
      </section>

      {/* FOOTER & ORIENTAL DELIVERY HUB (#localisation) */}
      <footer id="localisation">
        <div className="wrap">
          <div className="ft">
            <div>
              <h2 className="si">
                {lang === 'ar'
                  ? 'زورونا في بركان'
                  : 'Venez nous voir à Berkane'}
              </h2>
              <address className="info">
                <div>
                  <b>{lang === 'ar' ? 'العنوان' : 'Adresse'}</b>
                  {lang === 'ar'
                    ? 'بركان، جهة الشرق، المغرب'
                    : 'Berkane, région de l’Oriental, Maroc'}
                </div>
                <div>
                  <b>{lang === 'ar' ? 'التواصل' : 'Contact'}</b>
                  <span>
                    <a href="tel:+212600000000">+212 6 00 00 00 00</a> ·{' '}
                    <a
                      className="wa-link"
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
                  </span>
                </div>
                <div>
                  <b>{lang === 'ar' ? 'مواعيد العمل' : 'Horaires'}</b>
                  <span>
                    {lang === 'ar'
                      ? 'الاثنين – السبت · 9:00 – 19:30'
                      : 'Lun – Sam · 9h00 – 19h30'}
                  </span>
                </div>
              </address>
            </div>

            <div className="map">
              <iframe
                title={
                  lang === 'ar'
                    ? 'خريطة بركان، المغرب'
                    : 'Carte de Berkane, Maroc'
                }
                src="https://maps.google.com/maps?q=Berkane%2C%20Morocco&z=13&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="map-overlay">
                <strong>NeoRide · Berkane</strong>
                <p>
                  {lang === 'ar'
                    ? 'اعثر على معرض NeoRide واستعد لزيارتك.'
                    : 'Retrouvez le showroom NeoRide et préparez votre visite.'}
                </p>
                <a
                  className="btn btn-g"
                  href="https://www.google.com/maps/search/?api=1&query=NeoRide+Berkane"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {lang === 'ar'
                    ? 'البحث على خرائط Google'
                    : 'Rechercher sur Google Maps'}{' '}
                  <span className="arr" aria-hidden="true">
                    ↗
                  </span>
                </a>
              </div>
            </div>
          </div>

          <div className="orient">
            <h3 className="si sub">
              {lang === 'ar'
                ? 'من بركان إلى مختلف أنحاء جهة الشرق'
                : 'Depuis Berkane, toute l’Oriental'}
            </h3>
            <p className="lead">
              {lang === 'ar'
                ? 'هل أنت في وجدة أو الناظور أو السعيدية أو مدينة أخرى بالجهة؟ اختر مدينتك لإرسال رسالة عبر واتساب والاستفسار عن خيارات التوصيل.'
                : 'Vous êtes à Oujda, Nador, Saïdia ou ailleurs dans la région ? Touchez votre ville : un message WhatsApp part vers nous. Indiquez-nous votre ville pour connaître les options de livraison.'}
            </p>
            <p
              className={`live ${showroomStatus.isOpen ? '' : 'closed'}`}
              id="live"
            >
              <span className="liv">
                {lang === 'ar'
                  ? 'المعرض والورشة فبركان :'
                  : 'Showroom & Atelier Berkane :'}
              </span>{' '}
              <strong id="ls">
                {showroomStatus.isOpen
                  ? lang === 'ar'
                    ? 'مفتوح'
                    : 'Ouvert'
                  : lang === 'ar'
                  ? 'مسدود دابا'
                  : 'Fermé pour le moment'}
              </strong>{' '}
              <span>
                {lang === 'ar'
                  ? '(الاثنين–السبت 9:00–19:30)'
                  : '(Lun–Sam 9h–19h30)'}
              </span>{' '}
              <span>·</span>{' '}
              <span>
                {lang === 'ar'
                  ? 'شحن مباشر نحو وجدة، الناظور، السعيدية، تاوريرت وأحفير.'
                  : 'Expédition directe vers Oujda, Nador, Saïdia, Taourirt & Ahfir.'}
              </span>
            </p>
            <div className="vl">
              {[
                {
                  fr: 'Berkane',
                  ar: 'بركان',
                  msgFr:
                    'Bonjour NeoRide, je suis à Berkane et je souhaite des informations.',
                  msgAr: 'السلام عليكم NeoRide، أنا فبركان وبغيت شي معلومات.',
                },
                {
                  fr: 'Oujda',
                  ar: 'وجدة',
                  msgFr:
                    'Bonjour NeoRide, je suis à Oujda. Livrez-vous chez moi ?',
                  msgAr: 'السلام عليكم NeoRide، أنا فوجدة. واش كتوصلو للدار؟',
                },
                {
                  fr: 'Nador',
                  ar: 'الناظور',
                  msgFr:
                    'Bonjour NeoRide, je suis à Nador. Livrez-vous chez moi ?',
                  msgAr: 'السلام عليكم NeoRide، أنا فالناظور. واش كتوصلو للدار؟',
                },
                {
                  fr: 'Saïdia',
                  ar: 'السعيدية',
                  msgFr:
                    'Bonjour NeoRide, je suis à Saïdia. Livrez-vous chez moi ?',
                  msgAr: 'السلام عليكم NeoRide، أنا فالسعيدية. واش كتوصلو للدار؟',
                },
                {
                  fr: 'Taourirt',
                  ar: 'تاوريرت',
                  msgFr:
                    'Bonjour NeoRide, je suis à Taourirt. Livrez-vous chez moi ?',
                  msgAr: 'السلام عليكم NeoRide، أنا فتاوريرت. واش كتوصلو للدار؟',
                },
                {
                  fr: 'Ahfir',
                  ar: 'أحفير',
                  msgFr:
                    'Bonjour NeoRide, je suis à Ahfir. Livrez-vous chez moi ?',
                  msgAr: 'السلام عليكم NeoRide، أنا فأحفير. واش كتوصلو للدار؟',
                },
                {
                  fr: 'Autre ville',
                  ar: 'مدينة أخرى',
                  msgFr:
                    'Bonjour NeoRide, je suis dans l’Oriental, dans une autre ville. Livrez-vous chez moi ?',
                  msgAr:
                    'السلام عليكم NeoRide، أنا فالجهة الشرقية، فمدينة أخرى. واش كتوصلو للدار؟',
                },
              ].map((c) => (
                <a
                  key={c.fr}
                  className="wa-link"
                  href={buildWhatsAppUrl(lang === 'ar' ? c.msgAr : c.msgFr)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {lang === 'ar' ? c.ar : c.fr}
                </a>
              ))}
            </div>
          </div>

          <div className="copy">
            {lang === 'ar'
              ? '© 2026 NeoRide. جميع الحقوق محفوظة.'
              : '© 2026 NeoRide. Tous droits réservés.'}
          </div>
        </div>
      </footer>
    </>
  );
};
