import type { SyntheticEvent } from "react";

/**
 * Local photo plumbing.
 *
 * Every picture on the site lives in `public/photos/` and is referenced through
 * `photoUrl("some-name.jpg")`. Drop a file into that folder under the exact name
 * listed in `public/photos/README.md` and it shows up — no code changes needed.
 *
 * Files are referenced through `import.meta.env.BASE_URL` rather than a hardcoded
 * leading slash so the build keeps working when the site is served from a
 * subdirectory (GitHub Pages, a /site/ folder, etc.).
 */

const BASE = import.meta.env.BASE_URL ?? "/";

export function photoUrl(name: string): string {
  return `${BASE}photos/${name}`;
}

/** Non-photo brand assets that live directly in `public/` (e.g. `logo.png`). */
export function publicAsset(name: string): string {
  return `${BASE}${name}`;
}

/**
 * Branded tile shown in place of any photo that is not on the server yet
 * (not uploaded, mistyped name, wrong extension). It uses the site palette and
 * `slice` scaling so the caption stays centred whatever the slot's aspect ratio.
 */
const PLACEHOLDER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1100" preserveAspectRatio="xMidYMid slice">
  <rect width="1600" height="1100" fill="#e8e4db"/>
  <rect x="40" y="40" width="1520" height="1020" fill="none" stroke="#d8d4ca" stroke-width="4"/>
  <g transform="translate(800 470)" fill="none" stroke="#b1aa9a" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <path d="M-70 -100 L-45 -142 H45 L70 -100"/>
    <rect x="-150" y="-100" width="300" height="212" rx="28"/>
    <circle cx="0" cy="6" r="62"/>
    <circle cx="104" cy="-58" r="9" fill="#b1aa9a" stroke="none"/>
  </g>
  <text x="800" y="726" text-anchor="middle" font-family="Manrope, Arial, sans-serif" font-size="46" font-weight="700" letter-spacing="7" fill="#8b7650">ФОТО СКОРО</text>
  <text x="800" y="788" text-anchor="middle" font-family="Manrope, Arial, sans-serif" font-size="28" letter-spacing="5" fill="#b1aa9a">УРАЛРЕСТОРАН ГРУПП</text>
</svg>`;

export const PHOTO_PLACEHOLDER = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  PLACEHOLDER_SVG,
)}`;

/**
 * `<img onError>` handler. Swaps a failed photo for the placeholder tile.
 * The guard stops a second pass if the placeholder itself ever fails to decode.
 */
export function onPhotoError(event: SyntheticEvent<HTMLImageElement>): void {
  const el = event.currentTarget;
  if (el.dataset.photoFallback === "on") return;
  el.dataset.photoFallback = "on";
  el.src = PHOTO_PLACEHOLDER;
}
