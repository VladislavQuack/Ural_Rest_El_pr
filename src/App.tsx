import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import {
  aboutIntro,
  aboutTimeline,
  cateringContent,
  loyaltyContent,
  venues,
  type Venue,
  type VenueCategory,
} from "./data";
import { onPhotoError, photoUrl, publicAsset } from "./photo";

type DialogMode = "detail" | "reservation" | "catering" | "loyalty" | "contacts" | null;
type Route = "home" | "about";

function routeFromHash(): Route {
  if (typeof window !== "undefined" && window.location.hash.startsWith("#/about")) return "about";
  return "home";
}

function BrandMark() {
  return (
    <svg className="brand-mark" viewBox="0 0 88 92" aria-hidden="true">
      <path d="M17 24 33 2l11 11L55 2l16 22-27-11Z" fill="currentColor" />
      <path
        d="M26 25v36a18 18 0 0 0 36 0V25"
        fill="none"
        stroke="currentColor"
        strokeWidth="17"
      />
    </svg>
  );
}

function LoyaltyCardVisual() {
  return (
    <div className="loyalty-card-visual" aria-hidden="true">
      <svg className="loyalty-card-art" viewBox="0 0 1000 620" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="loyalty-ribbon" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f7b87f" />
            <stop offset="48%" stopColor="#f0a07f" />
            <stop offset="100%" stopColor="#f8c9b8" />
          </linearGradient>
          <linearGradient id="loyalty-plane" x1="0" y1="0" x2="0.8" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#e2e2df" stopOpacity="0.12" />
          </linearGradient>
          <filter id="loyalty-soft">
            <feGaussianBlur stdDeviation="30" />
          </filter>
          <filter id="loyalty-soft-light">
            <feGaussianBlur stdDeviation="14" />
          </filter>
        </defs>

        <rect width="1000" height="620" fill="#f2f2f0" />
        <path
          d="M540 -40 1040 300v380H720Z"
          fill="url(#loyalty-plane)"
          filter="url(#loyalty-soft-light)"
        />
        <path
          d="M600 -60v330a190 190 0 0 0 380 0V-60"
          fill="none"
          stroke="url(#loyalty-ribbon)"
          strokeWidth="150"
          filter="url(#loyalty-soft)"
          opacity="0.55"
        />
        <path
          d="M600 -60v330a190 190 0 0 0 380 0V-60"
          fill="none"
          stroke="url(#loyalty-ribbon)"
          strokeWidth="150"
        />
        <path
          d="M120 700 760 60h70L190 700Z"
          fill="#1c1c1b"
          opacity="0.06"
          filter="url(#loyalty-soft-light)"
        />
      </svg>

      <div className="loyalty-card-top">
        <BrandMark />
        <span>
          УРАЛРЕСТОРАН
          <br />
          ГРУПП
        </span>
      </div>
      <div className="loyalty-card-label">КАРТА ЛОЯЛЬНОСТИ</div>
    </div>
  );
}

/** Loyalty card: prefer the real brand photo, fall back to the drawn SVG. */
function LoyaltyCard() {
  const [photoMissing, setPhotoMissing] = useState(false);
  if (photoMissing) return <LoyaltyCardVisual />;
  return (
    <div className="loyalty-card-visual loyalty-card-visual-photo">
      <img
        className="loyalty-card-photo"
        src={photoUrl("loyalty-card.jpg")}
        alt="Карта лояльности УралРесторан Групп"
        onError={() => setPhotoMissing(true)}
      />
    </div>
  );
}

function BrandLockup({ footer = false, onHome }: { footer?: boolean; onHome: () => void }) {
  const [logoMissing, setLogoMissing] = useState(false);
  return (
    <button
      className={`brand-lockup${footer ? " brand-lockup-footer" : ""}`}
      type="button"
      onClick={onHome}
      aria-label="УралРесторан Групп — на главную"
    >
      {logoMissing ? (
        <>
          <BrandMark />
          <span className="brand-wordmark">
            <span>УРАЛРЕСТОРАН</span>
            <span>ГРУПП</span>
          </span>
        </>
      ) : (
        <img
          className="brand-logo"
          src={publicAsset("logo.png")}
          alt="УралРесторан Групп"
          onError={() => setLogoMissing(true)}
        />
      )}
    </button>
  );
}

function ArrowUpRight() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M5 15 15 5M6.5 5H15v8.5" />
    </svg>
  );
}

function ArrowDown() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M10 3.5v12m0 0 5-5m-5 5-5-5" />
    </svg>
  );
}

function ArrowLeft() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M16.5 10h-12m0 0 5-5m-5 5 5 5" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M10 18s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z" />
      <circle cx="10" cy="8" r="2.1" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="10" cy="10" r="7" />
      <path d="M10 6.5V10l2.4 1.6" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4.2 3.8h3.1l1 3.1-1.9 1.1a11.5 11.5 0 0 0 5.6 5.6l1.1-1.9 3.1 1v3.1c0 .6-.5 1.1-1.1 1.1C8.4 16.9 3.1 11.6 3.1 4.9c0-.6.5-1.1 1.1-1.1Z" />
    </svg>
  );
}

/**
 * Hero creative slot. Keep the file at 2:1 (for example 2400×1200) —
 * one image works on desktop and mobile, nothing separate is needed.
 */
const heroCreative = {
  image: photoUrl("hero.webp"),
  alt: "Лучшие бургеры — El Primo steak house",
  badge: "Реклама",
  href: "#restaurants",
};

const aboutCreative = {
  image: photoUrl("about-hero.jpg"),
  alt: "Уютный зал ресторана холдинга",
};

function HeroMedia({
  image,
  alt,
  badge,
  href,
  priority = false,
}: {
  image: string;
  alt: string;
  badge?: string;
  href?: string;
  priority?: boolean;
}) {
  const picture = (
    <img
      className="hero-photo"
      src={image}
      alt={alt}
      onError={onPhotoError}
      {...(priority ? { fetchPriority: "high" as const } : { loading: "lazy" as const })}
    />
  );

  return (
    <div className="hero-media">
      {href ? (
        <a className="hero-media-link" href={href} aria-label={alt}>
          {picture}
        </a>
      ) : (
        picture
      )}
      {badge ? (
        <span className="hero-ad-badge" aria-label="Рекламный блок">
          {badge}
        </span>
      ) : null}
    </div>
  );
}

function categoryName(category: VenueCategory) {
  if (category === "coffee") return "Кофейня";
  if (category === "bar") return "Бар";
  return "Ресторан";
}

function mapEmbedSrc(address: string) {
  return `https://yandex.ru/map-widget/v1/?z=16&text=${encodeURIComponent(`${address}, Магнитогорск`)}`;
}

function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function todayIso() {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

function SuccessBlock({
  name,
  onClose,
  titled = false,
}: {
  name: string;
  onClose: () => void;
  titled?: boolean;
}) {
  const Heading = titled ? "h2" : "h3";

  return (
    <div className="success-state">
      <span className="success-mark" aria-hidden="true">
        ✓
      </span>
      <p className="eyebrow section-eyebrow">Заявка заполнена</p>
      <Heading id={titled ? "dialog-title" : undefined}>Спасибо{name ? `, ${name}` : ""}.</Heading>
      <p>Это демонстрационная версия: данные формы никуда не отправляются.</p>
      <button className="button-dark" type="button" onClick={onClose}>
        Понятно
      </button>
    </div>
  );
}

function BookingWidget({
  defaultVenue = "",
  lockVenue = false,
  compact = false,
  onSubmit,
}: {
  defaultVenue?: string;
  lockVenue?: boolean;
  compact?: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const [venue, setVenue] = useState(defaultVenue);

  useEffect(() => {
    setVenue(defaultVenue);
  }, [defaultVenue]);

  return (
    <form className={`contact-form${compact ? " contact-form-compact" : ""}`} onSubmit={onSubmit}>
      <div className="form-row">
        <label>
          Ваше имя
          <input autoComplete="name" name="name" placeholder="Как к вам обращаться" required />
        </label>
        <label>
          Телефон
          <input
            autoComplete="tel"
            name="phone"
            type="tel"
            placeholder="+7 ___ ___-__-__"
            required
          />
        </label>
      </div>

      <label>
        Ресторан
        {lockVenue ? (
          <input name="venue" value={defaultVenue} readOnly />
        ) : (
          <select
            name="venue"
            value={venue}
            onChange={(event) => setVenue(event.target.value)}
            required
          >
            <option value="">Выберите место</option>
            {venues.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        )}
      </label>

      <div className="form-row form-row-booking">
        <label>
          Дата
          <input name="date" type="date" min={todayIso()} required />
        </label>
        <label>
          Время
          <select name="time" defaultValue="19:00" required>
            <option>12:00</option>
            <option>14:00</option>
            <option>16:00</option>
            <option>18:00</option>
            <option>19:00</option>
            <option>20:00</option>
            <option>21:00</option>
          </select>
        </label>
        <label>
          Гостей
          <select name="guests" defaultValue="2" required>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6+">6+</option>
          </select>
        </label>
      </div>

      <button className="button-dark form-submit" type="submit">
        Забронировать столик <ArrowUpRight />
      </button>
      <p className="form-note">Демо-виджет: после отправки данные никуда не передаются.</p>
    </form>
  );
}

function VenueModal({
  venue,
  formSubmitted,
  submittedName,
  onClose,
  onSubmit,
}: {
  venue: Venue;
  formSubmitted: boolean;
  submittedName: string;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const photos = venue.gallery.length ? venue.gallery : [venue.image];
  const activePhoto = photos[photoIndex] ?? venue.image;

  useEffect(() => {
    setPhotoIndex(0);
  }, [venue.id]);

  return (
    <div className="venue-modal">
      <div className="venue-gallery">
        <div className="venue-photo-stage">
          <img src={activePhoto} alt={`${venue.name} — фото ${photoIndex + 1}`} onError={onPhotoError} />
          <span className="venue-photo-count">
            {String(photoIndex + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
          </span>
        </div>
        {photos.length > 1 && (
          <div className="venue-thumbs" role="tablist" aria-label="Фотографии заведения">
            {photos.map((photo, index) => (
              <button
                key={photo}
                type="button"
                className={`venue-thumb${index === photoIndex ? " is-active" : ""}`}
                aria-label={`Показать фото ${index + 1}`}
                onClick={() => setPhotoIndex(index)}
              >
                <img src={photo} alt="" onError={onPhotoError} />
              </button>
            ))}
          </div>
        )}
        <div className="venue-map-wrap">
          <iframe
            title={`Карта: ${venue.name}`}
            src={mapEmbedSrc(venue.address)}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      <div className="venue-info">
        <p className="eyebrow section-eyebrow">{categoryName(venue.category)}</p>
        <h2 id="dialog-title">{venue.name}</h2>
        <p className="venue-cuisine">{venue.cuisine}</p>
        <p className="dialog-description">{venue.about}</p>

        {venue.offer && <p className="venue-offer">{venue.offer}</p>}

        <ul className="venue-facts">
          <li>
            <ClockIcon />
            <span>{venue.hours}</span>
          </li>
          <li>
            <PinIcon />
            <a
              href={`https://yandex.ru/maps/?text=${encodeURIComponent(`${venue.address}, Магнитогорск`)}`}
              target="_blank"
              rel="noreferrer"
            >
              {venue.address}
            </a>
          </li>
          <li>
            <PhoneIcon />
            <a href={telHref(venue.phone)}>{venue.phone}</a>
          </li>
        </ul>

        {venue.branches && (
          <div className="branch-list">
            <p className="branch-list-title">Адреса</p>
            {venue.branches.map((branch) => (
              <p key={branch.address}>
                <span>
                  {branch.address}
                  {branch.note ? ` · ${branch.note}` : ""}
                </span>
                {branch.phone && <a href={telHref(branch.phone)}>{branch.phone}</a>}
              </p>
            ))}
          </div>
        )}

        <div className="venue-tags">
          {venue.highlights.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>

        <div className="booking-widget">
          <div className="booking-widget-head">
            <p className="eyebrow section-eyebrow">Бронь</p>
            <h3>Заказать столик</h3>
          </div>
          {formSubmitted ? (
            <SuccessBlock name={submittedName} onClose={onClose} />
          ) : (
            <BookingWidget defaultVenue={venue.name} lockVenue compact onSubmit={onSubmit} />
          )}
        </div>
      </div>
    </div>
  );
}

function CateringModal({
  formSubmitted,
  submittedName,
  onClose,
  onSubmit,
}: {
  formSubmitted: boolean;
  submittedName: string;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <div className="story-modal">
      <div className="story-hero">
        <img src={cateringContent.image} alt="Сервировка кейтеринга" onError={onPhotoError} />
        <div className="story-hero-copy">
          <p className="eyebrow">{cateringContent.since}</p>
          <h2 id="dialog-title">{cateringContent.title}</h2>
        </div>
      </div>

      <div className="story-body">
        <p className="story-lead">{cateringContent.lead}</p>

        <div className="format-row">
          {cateringContent.formats.map((format) => (
            <span key={format}>{format}</span>
          ))}
        </div>

        <div className="story-grid">
          {cateringContent.features.map((feature, index) => (
            <article key={feature.title} className="story-card">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>

        <div className="story-photos">
          {cateringContent.gallery.map((photo, index) => (
            <img key={photo} src={photo} alt={`Кейтеринг, фото ${index + 1}`} onError={onPhotoError} />
          ))}
        </div>

        <div className="booking-widget story-form">
          <div className="booking-widget-head">
            <p className="eyebrow section-eyebrow">Заявка</p>
            <h3>Обсудим ваше событие</h3>
          </div>
          {formSubmitted ? (
            <SuccessBlock name={submittedName} onClose={onClose} />
          ) : (
            <form className="contact-form contact-form-compact" onSubmit={onSubmit}>
              <div className="form-row">
                <label>
                  Ваше имя
                  <input autoComplete="name" name="name" placeholder="Как к вам обращаться" required />
                </label>
                <label>
                  Телефон
                  <input autoComplete="tel" name="phone" type="tel" placeholder="+7 ___ ___-__-__" required />
                </label>
              </div>
              <label>
                Расскажите о событии
                <textarea name="message" placeholder="Повод, дата, количество гостей, площадка" rows={3} />
              </label>
              <button className="button-dark form-submit" type="submit">
                Оставить заявку <ArrowUpRight />
              </button>
              <p className="form-note">Демо-форма: после отправки данные никуда не передаются.</p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function ContactsModal({
  formSubmitted,
  submittedName,
  onClose,
  onSubmit,
}: {
  formSubmitted: boolean;
  submittedName: string;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const contacts = [
    { phone: "+7 3519 23-08-08", place: "Диканька · ул. Горького, 1" },
    { phone: "+7 3519 22-43-23", place: "El Primo · пр. Металлургов, 7" },
    { phone: "+7 3519 28-85-55", place: "Горький кофе · единая справочная" },
    { phone: "+7 3519 42-42-02", place: "Тандыр-Паша · ул. Советская, 162" },
  ];

  return (
    <div className="contacts-modal">
      <p className="eyebrow section-eyebrow">Контакты</p>
      <h2 id="dialog-title">Как с нами связаться.</h2>
      <p className="dialog-description">
        Магнитогорск. Будем рады видеть вас в любом из заведений группы — или поможем с бронью по телефону.
      </p>

      <div className="contacts-rows">
        {contacts.map((contact) => (
          <a href={telHref(contact.phone)} key={contact.phone}>
            <strong>{contact.phone}</strong>
            <span>{contact.place}</span>
          </a>
        ))}
      </div>

      <div className="booking-widget">
        <div className="booking-widget-head">
          <p className="eyebrow section-eyebrow">Написать нам</p>
          <h3>Мы на связи</h3>
        </div>
        {formSubmitted ? (
          <SuccessBlock name={submittedName} onClose={onClose} />
        ) : (
          <form className="contact-form contact-form-compact" onSubmit={onSubmit}>
            <div className="form-row">
              <label>
                Ваше имя
                <input autoComplete="name" name="name" placeholder="Как к вам обращаться" required />
              </label>
              <label>
                Телефон
                <input autoComplete="tel" name="phone" type="tel" placeholder="+7 ___ ___-__-__" required />
              </label>
            </div>
            <label>
              Сообщение
              <textarea name="message" placeholder="Напишите, чем можем помочь" rows={3} />
            </label>
            <button className="button-dark form-submit" type="submit">
              Отправить <ArrowUpRight />
            </button>
            <p className="form-note">Демо-форма: после отправки данные никуда не передаются.</p>
          </form>
        )}
      </div>
    </div>
  );
}

function LoyaltyModal({
  formSubmitted,
  submittedName,
  onClose,
  onSubmit,
}: {
  formSubmitted: boolean;
  submittedName: string;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <div className="story-modal loyalty-modal">
      <div className="story-body">
        <p className="eyebrow section-eyebrow">Для постоянных гостей</p>
        <h2 id="dialog-title">{loyaltyContent.title}</h2>
        <p className="story-lead">{loyaltyContent.lead}</p>

        <div className="loyalty-pass">
          <LoyaltyCard />
          <p>Чем больше вечеров с нами — тем теплее возвращение.</p>
        </div>

        <div className="story-grid">
          {loyaltyContent.perks.map((perk, index) => (
            <article key={perk.title} className="story-card">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{perk.title}</h3>
              <p>{perk.text}</p>
            </article>
          ))}
        </div>

        <div className="booking-widget story-form">
          <div className="booking-widget-head">
            <p className="eyebrow section-eyebrow">Присоединиться</p>
            <h3>Оставьте контакты</h3>
          </div>
          {formSubmitted ? (
            <SuccessBlock name={submittedName} onClose={onClose} />
          ) : (
            <form className="contact-form contact-form-compact" onSubmit={onSubmit}>
              <div className="form-row">
                <label>
                  Ваше имя
                  <input autoComplete="name" name="name" placeholder="Как к вам обращаться" required />
                </label>
                <label>
                  Телефон
                  <input autoComplete="tel" name="phone" type="tel" placeholder="+7 ___ ___-__-__" required />
                </label>
              </div>
              <button className="button-dark form-submit" type="submit">
                Узнать о программе <ArrowUpRight />
              </button>
              <p className="form-note">Демо-форма: после отправки данные никуда не передаются.</p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

type NavHandlers = {
  route: Route;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean | ((open: boolean) => boolean)) => void;
  onHome: (sectionId?: string) => void;
  onAbout: () => void;
  onOpenDialog: (mode: Exclude<DialogMode, "detail" | null>) => void;
};

function SiteHeader({ route, mobileMenuOpen, setMobileMenuOpen, onHome, onAbout, onOpenDialog }: NavHandlers) {
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="site-header">
      <div className="header-main">
        <BrandLockup onHome={() => onHome()} />

        <nav className="desktop-navigation" aria-label="Главная навигация">
          <button type="button" onClick={() => onHome("restaurants")}>
            Рестораны
          </button>
          <button type="button" onClick={() => onOpenDialog("catering")}>
            Кейтеринг
          </button>
          <button type="button" onClick={() => onOpenDialog("loyalty")}>
            Программа лояльности
          </button>
          <button
            type="button"
            onClick={onAbout}
            className={route === "about" ? "is-active" : undefined}
            aria-current={route === "about" ? "page" : undefined}
          >
            О нас
          </button>
        </nav>

        <div className="header-actions">
          <button className="header-booking" type="button" onClick={() => onOpenDialog("reservation")}>
            <span className="booking-full">Заказать столик</span>
            <span className="booking-short">Столик</span>
          </button>
          <button
            className={`menu-toggle${mobileMenuOpen ? " is-open" : ""}`}
            type="button"
            aria-label={mobileMenuOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="mobile-navigation" id="mobile-navigation" aria-label="Мобильная навигация">
          <button
            type="button"
            onClick={() => {
              closeMobileMenu();
              onHome("restaurants");
            }}
          >
            Рестораны <ArrowUpRight />
          </button>
          <button type="button" onClick={() => onOpenDialog("catering")}>
            Кейтеринг <ArrowUpRight />
          </button>
          <button type="button" onClick={() => onOpenDialog("loyalty")}>
            Программа лояльности <ArrowUpRight />
          </button>
          <button type="button" onClick={onAbout}>
            О нас <ArrowUpRight />
          </button>
          <button className="mobile-booking-link" type="button" onClick={() => onOpenDialog("reservation")}>
            Заказать столик
          </button>
        </nav>
      )}
    </header>
  );
}

export default function App() {
  const [route, setRoute] = useState<Route>(routeFromHash);
  const [pageTransition, setPageTransition] = useState<"idle" | "leaving" | "entering">("idle");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const pendingSection = useRef<string | null>(null);
  const transitionTimer = useRef<number | null>(null);
  const releaseTimer = useRef<number | null>(null);

  const openVenue = useCallback((venue: Venue) => {
    setSelectedVenue(venue);
    setFormSubmitted(false);
    setDialogMode("detail");
    setMobileMenuOpen(false);
  }, []);

  const openVenueById = useCallback(
    (venueId: string) => {
      const venue = venues.find((item) => item.id === venueId);
      if (venue) openVenue(venue);
    },
    [openVenue],
  );

  const openDialog = useCallback((mode: Exclude<DialogMode, "detail" | null>) => {
    setSelectedVenue(null);
    setFormSubmitted(false);
    setDialogMode(mode);
    setMobileMenuOpen(false);
  }, []);

  const closeDialog = useCallback(() => {
    setDialogMode(null);
    setSelectedVenue(null);
    setFormSubmitted(false);
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setSubmittedName(String(formData.get("name") ?? ""));
    setFormSubmitted(true);
  };

  const goHome = useCallback(
    (sectionId?: string) => {
      setMobileMenuOpen(false);
      if (route === "about") {
        pendingSection.current = sectionId ?? null;
        setPageTransition("leaving");
        if (transitionTimer.current) window.clearTimeout(transitionTimer.current);
        transitionTimer.current = window.setTimeout(() => {
          window.location.hash = "#/";
        }, 260);
      } else if (sectionId) {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [route],
  );

  const goAbout = useCallback(() => {
    setMobileMenuOpen(false);
    if (route !== "about") {
      setPageTransition("leaving");
      if (transitionTimer.current) window.clearTimeout(transitionTimer.current);
      transitionTimer.current = window.setTimeout(() => {
        window.location.hash = "#/about";
      }, 260);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [route]);

  const scrollToId = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const scrollTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const onHashChange = () => {
      setRoute(routeFromHash());
      setPageTransition("entering");
      if (releaseTimer.current) window.clearTimeout(releaseTimer.current);
      releaseTimer.current = window.setTimeout(() => {
        setPageTransition("idle");
      }, 820);
    };

    window.addEventListener("hashchange", onHashChange);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
      if (transitionTimer.current) window.clearTimeout(transitionTimer.current);
      if (releaseTimer.current) window.clearTimeout(releaseTimer.current);
    };
  }, []);

  useEffect(() => {
    document.title =
      route === "about" ? "О нас — УралРесторан Групп" : "УралРесторан Групп — места для встреч";
    if (route === "home" && pendingSection.current) {
      const id = pendingSection.current;
      pendingSection.current = null;
      window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 80);
    } else {
      window.scrollTo(0, 0);
    }
  }, [route]);

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(".reveal:not(.is-visible)");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [route]);

  useEffect(() => {
    if (!dialogMode) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDialog();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [dialogMode, closeDialog]);

  const panelClass = useMemo(() => {
    if (dialogMode === "detail") return "dialog-panel dialog-xl";
    if (dialogMode === "catering" || dialogMode === "loyalty") return "dialog-panel dialog-story";
    return "dialog-panel";
  }, [dialogMode]);

  const headerProps: NavHandlers = {
    route,
    mobileMenuOpen,
    setMobileMenuOpen,
    onHome: goHome,
    onAbout: goAbout,
    onOpenDialog: openDialog,
  };

  return (
    <div className="site-page" id="top">
      {route === "home" ? (
        <>
          <section className="hero-shell" aria-label="УралРесторан Групп">
            <SiteHeader {...headerProps} />

            <button className="offer-bar" type="button" onClick={() => goHome("restaurants")}>
              <span className="offer-emphasis">Скидка 15%</span>
              <span> на меню кухни по будням с 12:00 до 15:00 в Диканьке</span>
              <ArrowUpRight />
            </button>

            <div className="hero-stage hero-stage-clean">
              <HeroMedia
                image={heroCreative.image}
                alt={heroCreative.alt}
                badge={heroCreative.badge}
                href={heroCreative.href}
                priority
              />
              <div className="hero-content">
                <h1 className="visually-hidden">УралРесторан Групп — рестораны, кофейни и бары Магнитогорска</h1>
                <div className="hero-actions">
                  <button className="button-light" type="button" onClick={() => goHome("restaurants")}>
                    Выбрать ресторан <ArrowUpRight />
                  </button>
                  <button className="hero-text-link" type="button" onClick={() => scrollToId("about")}>
                    О группе <ArrowDown />
                  </button>
                </div>
              </div>
            </div>
          </section>

          <main>
            <div className="stack">
              <section className="restaurant-gallery" id="restaurants" aria-label="Все заведения группы">
                <div className="gallery-row">
                  {venues.map((venue) => (
                    <button
                      className="restaurant-card reveal"
                      key={venue.id}
                      type="button"
                      aria-label={`Подробнее о заведении ${venue.name}`}
                      onClick={() => openVenue(venue)}
                    >
                      <span className="restaurant-card-media">
                        <img src={venue.image} alt="" loading="lazy" onError={onPhotoError} />
                      </span>
                      <span className="restaurant-card-body">
                        <span className="restaurant-card-meta">{categoryName(venue.category)}</span>
                        <span className="restaurant-card-title-line">
                          <span className="restaurant-card-name">{venue.name}</span>
                          <span className="restaurant-card-arrow">
                            <ArrowUpRight />
                          </span>
                        </span>
                        <span className="restaurant-card-cuisine">{venue.cuisine}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </section>

              <section className="block block-catering reveal" id="catering">
                <img className="block-photo" src={cateringContent.image} alt="Сервировка кейтеринга УралРесторан" onError={onPhotoError} />
                <div className="block-shade" />
                <div className="block-content block-content-light">
                  <p className="eyebrow block-eyebrow">Кейтеринг · URALRESTAURANT TEAM</p>
                  <h2>
                    Ресторанный вкус.
                    <br />
                    В вашем месте.
                  </h2>
                  <p>
                    Фуршет, банкет или корпоратив — привозим кухню холдинга и сервис туда, где вы празднуете.
                  </p>
                  <button className="button-light" type="button" onClick={() => openDialog("catering")}>
                    Обсудить событие <ArrowUpRight />
                  </button>
                </div>
              </section>

              <section className="block block-loyalty block-loyalty-photo reveal" id="loyalty">
                <img
                  className="block-photo"
                  src={photoUrl("loyalty-card.jpg")}
                  alt="Карта лояльности УралРесторан Групп"
                  onError={onPhotoError}
                />
                <div className="block-shade block-shade-light" />
                <div className="block-content block-content-dark">
                  <p className="eyebrow block-eyebrow">Программа лояльности</p>
                  <h2>
                    Приятно
                    <br />
                    возвращаться.
                  </h2>
                  <p>Накопительная скидка, привилегии гостя и подарочные сертификаты заведений группы.</p>
                  <button className="button-dark" type="button" onClick={() => openDialog("loyalty")}>
                    Узнать подробнее <ArrowUpRight />
                  </button>
                </div>
              </section>

              <section
                className="block block-about reveal is-clickable"
                id="about"
                onClick={goAbout}
                onKeyDown={(event) => {
                  if (event.target !== event.currentTarget) return;
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    goAbout();
                  }
                }}
                role="link"
                tabIndex={0}
                aria-label="Перейти на страницу о холдинге"
              >
                <div className="block-content">
                  <p className="eyebrow block-eyebrow">УралРесторан Групп · с 1998</p>
                  <h2>
                    Разные вкусы.
                    <br />
                    <span>Общий стол.</span>
                  </h2>
                  <p>
                    Холдинг объединяет рестораны, кофейни и бары Магнитогорска, чтобы у каждого повода встретиться
                    нашлось своё место.
                  </p>
                  <div className="about-stats">
                    <div>
                      <strong>25+</strong>
                      <span>лет встречаем гостей</span>
                    </div>
                    <div>
                      <strong>8</strong>
                      <span>заведений в городе</span>
                    </div>
                    <div>
                      <strong>1998</strong>
                      <span>год основания</span>
                    </div>
                  </div>
                  <div className="about-actions">
                    <span className="text-action about-link">
                      Читать историю холдинга <ArrowUpRight />
                    </span>
                    <button
                      className="text-action about-link about-link-muted"
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        goHome("restaurants");
                      }}
                    >
                      Выбрать место <ArrowUpRight />
                    </button>
                  </div>
                </div>
                <span className="block-goto" aria-hidden="true">
                  <ArrowUpRight />
                </span>
              </section>
            </div>
          </main>
        </>
      ) : (
        <>
          <section className="hero-shell about-shell" aria-label="О холдинге УралРесторан Групп">
            <SiteHeader {...headerProps} />

            <div className="hero-stage about-hero-stage">
              <HeroMedia image={aboutCreative.image} alt={aboutCreative.alt} priority />
              <div className="hero-content">
                <button className="back-link" type="button" onClick={() => goHome()}>
                  <ArrowLeft /> На главную
                </button>
                <p className="eyebrow hero-eyebrow">О нас · Магнитогорск · с 1998 года</p>
                <h1 className="hero-title about-hero-title">
                  <span>25 лет</span>
                  <span className="hero-title-group">за общим столом</span>
                </h1>
                <p className="hero-description">
                  Путь холдинга — от первого паба до восьми мест, где встречается весь город.
                </p>
                <div className="hero-actions">
                  <button className="button-light" type="button" onClick={() => scrollToId("history")}>
                    Смотреть историю <ArrowDown />
                  </button>
                  <button className="hero-text-link" type="button" onClick={() => goHome("restaurants")}>
                    Выбрать ресторан <ArrowUpRight />
                  </button>
                </div>
              </div>
            </div>
          </section>

          <main>
            <div className="stack">
              <section className="block block-about-intro reveal" aria-label="О холдинге">
                <div className="block-content">
                  <p className="eyebrow block-eyebrow">{aboutIntro.eyebrow}</p>
                  <h2>
                    {aboutIntro.titleTop}
                    <br />
                    <span>{aboutIntro.titleBottom}</span>
                  </h2>
                  <p className="about-intro-lead">{aboutIntro.lead}</p>
                  <p>{aboutIntro.text}</p>
                  <div className="about-stats">
                    <div>
                      <strong>25+</strong>
                      <span>лет в городе</span>
                    </div>
                    <div>
                      <strong>8</strong>
                      <span>заведений группы</span>
                    </div>
                    <div>
                      <strong>4</strong>
                      <span>кухни мира</span>
                    </div>
                  </div>
                </div>
                <div className="block-visual about-intro-visual">
                  <img src={aboutIntro.image} alt="Гости за столом в ресторане" loading="lazy" onError={onPhotoError} />
                </div>
              </section>

              <section className="block timeline-block reveal" id="history" aria-label="История холдинга">
                <div className="timeline-head">
                  <p className="eyebrow block-eyebrow">Временной путь</p>
                  <h2>
                    История,
                    <br />
                    написанная вкусом.
                  </h2>
                  <p>Каждый год — новое место, новая кухня и новые гости за нашим столом.</p>
                </div>
                <ol className="timeline">
                  {aboutTimeline.map((event) => (
                    <li className="timeline-item reveal" key={`${event.year}-${event.title}`}>
                      <span className="timeline-rail" aria-hidden="true">
                        <span className="timeline-dot" />
                        <span className="timeline-line" />
                      </span>
                      <span className="timeline-year">{event.year}</span>
                      {event.venueId ? (
                        <button
                          className="timeline-card is-clickable"
                          type="button"
                          onClick={() => event.venueId && openVenueById(event.venueId)}
                          aria-label={`Подробнее: ${event.title}`}
                        >
                          <span className="timeline-photo">
                            <img src={event.image} alt="" loading="lazy" onError={onPhotoError} />
                          </span>
                          <span className="timeline-copy">
                            <span className="timeline-tag">{event.tag}</span>
                            <span className="timeline-title-row">
                              <span className="timeline-title">{event.title}</span>
                              <span className="timeline-arrow">
                                <ArrowUpRight />
                              </span>
                            </span>
                            <span className="timeline-text">{event.text}</span>
                          </span>
                        </button>
                      ) : (
                        <div className="timeline-card">
                          <span className="timeline-photo">
                            <img src={event.image} alt="" loading="lazy" onError={onPhotoError} />
                          </span>
                          <span className="timeline-copy">
                            <span className="timeline-tag">{event.tag}</span>
                            <span className="timeline-title-row">
                              <span className="timeline-title">{event.title}</span>
                            </span>
                            <span className="timeline-text">{event.text}</span>
                          </span>
                        </div>
                      )}
                    </li>
                  ))}
                </ol>
              </section>

              <section className="block block-values reveal" aria-label="Наши принципы">
                <div className="block-content">
                  <p className="eyebrow block-eyebrow">Почему нас выбирают</p>
                  <h2>
                    Гости возвращаются.
                    <br />
                    <span>Мы знаем почему.</span>
                  </h2>
                </div>
                <div className="values-grid">
                  <div className="value-card reveal">
                    <span>01</span>
                    <h3>Кухня без компромиссов</h3>
                    <p>Фермерские продукты, честные порции и рецепты, которые хочется повторить дома — но лучше у нас.</p>
                  </div>
                  <div className="value-card reveal">
                    <span>02</span>
                    <h3>Сервис как забота</h3>
                    <p>Внимательный персонал, уютные залы и атмосфера, в которой одинаково хорошо и будним вечером, и в праздник.</p>
                  </div>
                  <div className="value-card reveal">
                    <span>03</span>
                    <h3>Место для каждого</h3>
                    <p>От романтического ужина до корпоративного вечера — у каждого повода есть свой стол в холдинге.</p>
                  </div>
                </div>
              </section>

              <section className="cta-row" aria-label="Кейтеринг и лояльность">
                <button
                  className="cta-card reveal"
                  type="button"
                  onClick={() => openDialog("catering")}
                  aria-label="Подробнее о кейтеринге"
                >
                  <img src={cateringContent.image} alt="" loading="lazy" onError={onPhotoError} />
                  <span className="cta-shade" />
                  <span className="cta-copy">
                    <span className="eyebrow">Кейтеринг · с 2019</span>
                    <span className="cta-title">Праздник в вашем месте</span>
                    <span className="cta-hint">
                      Обсудить событие <ArrowUpRight />
                    </span>
                  </span>
                </button>
                <button
                  className="cta-card reveal"
                  type="button"
                  onClick={() => openDialog("loyalty")}
                  aria-label="Подробнее о программе лояльности"
                >
                  <span className="cta-loyalty-bg" aria-hidden="true" />
                  <span className="cta-copy cta-copy-dark">
                    <span className="eyebrow">Программа лояльности</span>
                    <span className="cta-title">Приятно возвращаться</span>
                    <span className="cta-hint">
                      Узнать подробнее <ArrowUpRight />
                    </span>
                  </span>
                </button>
              </section>

              <section className="block venues-today reveal" aria-label="Заведения холдинга сегодня">
                <div className="venues-today-head">
                  <div>
                    <p className="eyebrow block-eyebrow">Холдинг сегодня</p>
                    <h2>Восемь мест. Один стол.</h2>
                  </div>
                  <button className="text-action" type="button" onClick={() => goHome("restaurants")}>
                    Все места на главной <ArrowUpRight />
                  </button>
                </div>
                <div className="venues-today-grid">
                  {venues.map((venue) => (
                    <button
                      className="venue-chip"
                      key={venue.id}
                      type="button"
                      onClick={() => openVenue(venue)}
                      aria-label={`Подробнее о заведении ${venue.name}`}
                    >
                      <span className="venue-chip-photo">
                        <img src={venue.image} alt="" loading="lazy" onError={onPhotoError} />
                      </span>
                      <span className="venue-chip-copy">
                        <span className="venue-chip-name">{venue.name}</span>
                        <span className="venue-chip-cuisine">{venue.cuisine}</span>
                      </span>
                      <span className="venue-chip-arrow">
                        <ArrowUpRight />
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </main>
        </>
      )}

      <footer className="site-footer">
        <div className="footer-main content-width">
          <div className="footer-brand-column">
            <BrandLockup footer onHome={() => goHome()} />
            <p>Магнитогорск. Встречаемся за столом.</p>
          </div>
          <div className="footer-links">
            <button type="button" onClick={() => goHome("restaurants")}>
              Рестораны
            </button>
            <button type="button" onClick={() => openDialog("catering")}>
              Кейтеринг
            </button>
            <button type="button" onClick={() => openDialog("loyalty")}>
              Программа лояльности
            </button>
            <button type="button" onClick={goAbout}>
              О группе
            </button>
            <button type="button" onClick={() => openDialog("contacts")}>
              Контакты
            </button>
          </div>
          <button className="footer-booking" type="button" onClick={() => openDialog("reservation")}>
            Забронировать столик <ArrowUpRight />
          </button>
        </div>
        <div className="footer-bottom content-width">
          <span>© {new Date().getFullYear()} УралРесторан Групп</span>
          <button type="button" onClick={scrollTop} className="footer-top">
            Наверх <ArrowUpRight />
          </button>
        </div>
      </footer>

      <div className={`page-transition page-transition-${pageTransition}`} aria-hidden="true">
        <div className="page-transition-mark">
          <BrandMark />
          <span>УРАЛРЕСТОРАН ГРУПП</span>
        </div>
      </div>

      {dialogMode && (
        <div
          className="dialog-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeDialog();
          }}
        >
          <section className={panelClass} role="dialog" aria-modal="true" aria-labelledby="dialog-title">
            <button className="dialog-close" type="button" aria-label="Закрыть окно" onClick={closeDialog}>
              <span />
              <span />
            </button>

            {dialogMode === "detail" && selectedVenue ? (
              <VenueModal
                venue={selectedVenue}
                formSubmitted={formSubmitted}
                submittedName={submittedName}
                onClose={closeDialog}
                onSubmit={handleSubmit}
              />
            ) : dialogMode === "catering" ? (
              <CateringModal
                formSubmitted={formSubmitted}
                submittedName={submittedName}
                onClose={closeDialog}
                onSubmit={handleSubmit}
              />
            ) : dialogMode === "loyalty" ? (
              <LoyaltyModal
                formSubmitted={formSubmitted}
                submittedName={submittedName}
                onClose={closeDialog}
                onSubmit={handleSubmit}
              />
            ) : dialogMode === "contacts" ? (
              <ContactsModal
                formSubmitted={formSubmitted}
                submittedName={submittedName}
                onClose={closeDialog}
                onSubmit={handleSubmit}
              />
            ) : formSubmitted ? (
              <SuccessBlock name={submittedName} onClose={closeDialog} titled />
            ) : (
              <div className="form-dialog-content">
                <p className="eyebrow section-eyebrow">Бронирование</p>
                <h2 id="dialog-title">Забронировать столик.</h2>
                <p className="dialog-description">Выберите место, дату и оставьте контакты — мы свяжемся с вами.</p>
                <BookingWidget onSubmit={handleSubmit} />
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
