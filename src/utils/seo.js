const DEFAULT_TITLE = "Heaven Furniture Mart \u2014 Luxury & Bespoke Furniture Studio | Chattogram";
const DEFAULT_DESCRIPTION = "Chattogram's premier luxury bespoke furniture studio. Handcrafted living, bedroom, dining, and custom pieces in seasoned Chittagong Teak, tailored to your room's exact dimensions.";
const DEFAULT_OG_IMAGE = "/og-image.jpg";
export function setMetaTag(selector, attributeName, attributeValue, contentValue) {
  let element = document.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }
  element.setAttribute("content", contentValue);
}
export function setCanonicalUrl(url) {
  const finalUrl = url || (typeof window !== "undefined" ? `${window.location.origin}${window.location.pathname}` : "https://heavenfurnituremart.com/");
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }
  link.href = finalUrl;
  setMetaTag('meta[property="og:url"]', "property", "og:url", finalUrl);
  setMetaTag('meta[name="twitter:url"]', "name", "twitter:url", finalUrl);
  return finalUrl;
}
export function applySeoMetadata(options) {
  if (typeof document === "undefined") return;
  const title = options.title ? `${options.title} | Heaven Furniture Mart` : DEFAULT_TITLE;
  const description = options.description || DEFAULT_DESCRIPTION;
  const image = options.ogImage || DEFAULT_OG_IMAGE;
  const ogType = options.ogType || "website";
  document.title = title;
  const canonical = setCanonicalUrl(options.canonicalUrl);
  setMetaTag('meta[name="description"]', "name", "description", description);
  setMetaTag('meta[property="og:title"]', "property", "og:title", title);
  setMetaTag('meta[property="og:description"]', "property", "og:description", description);
  setMetaTag('meta[property="og:type"]', "property", "og:type", ogType);
  setMetaTag('meta[property="og:site_name"]', "property", "og:site_name", "Heaven Furniture Mart");
  setMetaTag('meta[property="og:locale"]', "property", "og:locale", "en_US");
  const absoluteImageUrl = image.startsWith("http") || image.startsWith("data:") ? image : `${window.location.origin}${image}`;
  setMetaTag('meta[property="og:image"]', "property", "og:image", absoluteImageUrl);
  setMetaTag('meta[property="og:image:secure_url"]', "property", "og:image:secure_url", absoluteImageUrl);
  setMetaTag('meta[property="og:image:width"]', "property", "og:image:width", "1200");
  setMetaTag('meta[property="og:image:height"]', "property", "og:image:height", "630");
  setMetaTag('meta[property="og:image:alt"]', "property", "og:image:alt", `${title} - Bespoke Luxury Atelier`);
  setMetaTag('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
  setMetaTag('meta[name="twitter:title"]', "name", "twitter:title", title);
  setMetaTag('meta[name="twitter:description"]', "name", "twitter:description", description);
  setMetaTag('meta[name="twitter:image"]', "name", "twitter:image", absoluteImageUrl);
}
export async function generateDynamicBespokeOgImage(config) {
  if (typeof document === "undefined") return DEFAULT_OG_IMAGE;
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 630;
  const ctx = canvas.getContext("2d");
  if (!ctx) return DEFAULT_OG_IMAGE;
  ctx.fillStyle = "#0E1A1C";
  ctx.fillRect(0, 0, 1200, 630);
  let imageDrawn = false;
  if (config.photoUrl) {
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      await new Promise((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject();
        img.src = config.photoUrl;
      });
      ctx.save();
      ctx.drawImage(img, 520, 0, 680, 630);
      const grad = ctx.createLinearGradient(460, 0, 780, 0);
      grad.addColorStop(0, "#0E1A1C");
      grad.addColorStop(1, "rgba(14, 26, 28, 0.15)");
      ctx.fillStyle = grad;
      ctx.fillRect(460, 0, 320, 630);
      ctx.restore();
      imageDrawn = true;
    } catch {
      ctx.fillStyle = "#132629";
      ctx.fillRect(520, 0, 680, 630);
    }
  }
  if (!imageDrawn) {
    ctx.strokeStyle = "rgba(197, 168, 128, 0.08)";
    ctx.lineWidth = 1;
    for (let i = 520; i < 1200; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.bezierCurveTo(i + 80, 200, i - 40, 420, i + 60, 630);
      ctx.stroke();
    }
  }
  ctx.strokeStyle = "rgba(197, 168, 128, 0.4)";
  ctx.lineWidth = 2;
  ctx.strokeRect(36, 36, 1128, 558);
  ctx.strokeStyle = "#C5A880";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(36, 70);
  ctx.lineTo(36, 36);
  ctx.lineTo(70, 36);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(36, 560);
  ctx.lineTo(36, 594);
  ctx.lineTo(70, 594);
  ctx.stroke();
  ctx.font = '600 13px -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = "#C5A880";
  ctx.fillText("HEAVEN FURNITURE MART \xB7 BESPOKE ATELIER", 72, 100);
  ctx.font = "700 11px -apple-system, BlinkMacSystemFont, sans-serif";
  const categoryText = (config.category || "BESPOKE ATELIER").toUpperCase();
  const categoryMetrics = ctx.measureText(categoryText);
  const pillWidth = Math.max(140, categoryMetrics.width + 28);
  ctx.fillStyle = "rgba(197, 168, 128, 0.15)";
  ctx.fillRect(72, 130, pillWidth, 32);
  ctx.strokeStyle = "#C5A880";
  ctx.lineWidth = 1;
  ctx.strokeRect(72, 130, pillWidth, 32);
  ctx.fillStyle = "#FAF8F5";
  ctx.fillText(categoryText, 86, 151);
  ctx.font = '400 42px "Cormorant Garamond", Georgia, serif';
  ctx.fillStyle = "#FAF8F5";
  const words = (config.suiteTitle || "Bespoke Luxury Furniture").split(" ");
  let line = "";
  let y = 225;
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = ctx.measureText(testLine);
    if (metrics.width > 480 && n > 0) {
      ctx.fillText(line, 72, y);
      line = words[n] + " ";
      y += 50;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, 72, y);
  ctx.font = '400 15px -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = "rgba(250, 248, 245, 0.85)";
  ctx.fillText(`Hardwood: ${config.woodType || "Chittagong Teak"}`, 72, Math.min(y + 55, 470));
  ctx.fillText("Craftsmanship: Generational Joinery \xB7 100% Tailored Dimensions", 72, Math.min(y + 80, 495));
  ctx.strokeStyle = "rgba(197, 168, 128, 0.25)";
  ctx.beginPath();
  ctx.moveTo(72, 530);
  ctx.lineTo(540, 530);
  ctx.stroke();
  ctx.font = "500 12px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillStyle = "#C5A880";
  ctx.fillText("AGRABAD ACCESS ROAD, CHATTOGRAM", 72, 555);
  ctx.fillStyle = "#FAF8F5";
  ctx.fillText("+880 1960-481983 \xB7 heavenfurnituremart.com", 320, 555);
  try {
    return canvas.toDataURL("image/jpeg", 0.92);
  } catch (canvasErr) {
    console.warn("Canvas export tainted or restricted, returning safe vector fallback:", canvasErr);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
      <rect width="1200" height="630" fill="#0E1A1C"/>
      <rect x="36" y="36" width="1128" height="558" fill="none" stroke="#C5A880" stroke-width="2" stroke-opacity="0.4"/>
      <text x="72" y="100" fill="#C5A880" font-family="sans-serif" font-size="14" font-weight="600" letter-spacing="3">HEAVEN FURNITURE MART \xB7 BESPOKE ATELIER</text>
      <text x="72" y="240" fill="#FAF8F5" font-family="serif" font-size="44">${config.suiteTitle}</text>
      <text x="72" y="310" fill="#C5A880" font-family="sans-serif" font-size="16">Hardwood: ${config.woodType}</text>
      <text x="72" y="555" fill="#FAF8F5" font-family="sans-serif" font-size="13">AGRABAD ACCESS ROAD, CHATTOGRAM \xB7 +880 1960-481983</text>
    </svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }
}
