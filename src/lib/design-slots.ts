// Centralized catalog of every editable site asset and text on the public side.
// Edited only by DEVELOPER from /admin/design. Public pages read these slugs at
// render time and fall back to the static defaults below if no row exists.

export type AssetType = "image" | "video" | "image|video";

export interface AssetSlot {
  slug: string;
  label: string;
  description: string;
  accept: AssetType;
  preview: "wide" | "square" | "tall";
}

export interface TextSlot {
  slug: string;
  label: string;
  description: string;
  multiline?: boolean;
  default: string;
}

export const ASSET_SLOTS: AssetSlot[] = [
  {
    slug: "site.logo",
    label: "Logo del sitio",
    description: "Sustituye al texto 'AutoImport Pro' del header (recomendado: SVG/PNG transparente).",
    accept: "image",
    preview: "wide",
  },
  {
    slug: "site.favicon",
    label: "Favicon",
    description: "Icono de la pestaña del navegador. PNG cuadrado 256x256 recomendado.",
    accept: "image",
    preview: "square",
  },
  {
    slug: "home.intro.background",
    label: "Fondo del intro screen",
    description: "Imagen o vídeo de fondo en la pantalla de bienvenida (botón START).",
    accept: "image|video",
    preview: "wide",
  },
  {
    slug: "home.banner.media",
    label: "Banner del home (Mustang)",
    description: "Imagen o vídeo del banner naranja con CTA 'VER ESCAPARATE'.",
    accept: "image|video",
    preview: "wide",
  },
  {
    slug: "home.about.image",
    label: "Imagen sección 'Alta gama'",
    description: "Imagen lateral en la sección 'Alta gama, lujo y super lujo' del home.",
    accept: "image",
    preview: "tall",
  },
  {
    slug: "catalog.hero",
    label: "Hero del catálogo",
    description: "Imagen panorámica de la cabecera del catálogo público.",
    accept: "image",
    preview: "wide",
  },
];

export const TEXT_SLOTS: TextSlot[] = [
  // Brand identity
  {
    slug: "brand.name",
    label: "Nombre de la marca",
    description: "Aparece en el logo textual y en los headers.",
    default: "AutoImport Pro",
  },
  {
    slug: "brand.tagline",
    label: "Tagline de la marca",
    description: "Línea pequeña debajo del nombre.",
    default: "Import & Business Manager",
  },

  // Home — intro screen
  {
    slug: "home.intro.cta",
    label: "Texto del botón START",
    description: "Botón central del intro screen.",
    default: "START",
  },
  {
    slug: "home.intro.hint",
    label: "Hint debajo del botón START",
    description: "Texto pequeño bajo el botón.",
    default: "Haz clic para entrar",
  },

  // Home — about section
  {
    slug: "home.about.title",
    label: "Título sección 'Alta gama'",
    description: "Encabezado en mayúsculas.",
    default: "ALTA GAMA, LUJO Y SUPER LUJO.",
  },
  {
    slug: "home.about.body",
    label: "Cuerpo sección 'Alta gama'",
    multiline: true,
    description: "Acepta HTML básico: <strong>, <br/>.",
    default:
      "Nos dedicamos exclusivamente a la <strong>Importación de Vehículos de Alta Gama, Lujo y SuperLujo</strong> por encargo para profesionales y particulares. Plazo de entrega 20 días, con entrega matriculado y transferido en cualquier punto de España. Garantía oficial incluida.<br/><br/>Todos nuestros vehículos proceden de servicios oficiales de cada marca y disponen de certificado de conformidad europeo, certificado de kilometraje, certificado de no siniestralidad y libro de mantenimiento en orden.",
  },

  // Home — stat cards
  { slug: "home.stat.1.title", label: "Stat 1 — título",    description: "", default: "Más de 500 vehículos importados" },
  { slug: "home.stat.1.sub",   label: "Stat 1 — subtítulo", description: "", default: "De las marcas más exclusivas del mercado" },
  { slug: "home.stat.2.title", label: "Stat 2 — título",    description: "", default: "8 años de experiencia" },
  { slug: "home.stat.2.sub",   label: "Stat 2 — subtítulo", description: "", default: "Importación de alta gama, lujo y superlujo" },
  { slug: "home.stat.3.title", label: "Stat 3 — título",    description: "", default: "Entrega en 20 días" },
  { slug: "home.stat.3.sub",   label: "Stat 3 — subtítulo", description: "", default: "Matriculado y transferido con garantía oficial" },
  { slug: "home.stat.4.title", label: "Stat 4 — título",    description: "", default: "Garantía oficial incluida" },
  { slug: "home.stat.4.sub",   label: "Stat 4 — subtítulo", description: "", default: "Todos los vehículos con certificados europeos" },

  // Home — Mustang banner
  {
    slug: "home.banner.eyebrow",
    label: "Banner — eyebrow (línea pequeña)",
    description: "",
    default: "Ford Mustang GT 5.0 · Nuestro Showroom",
  },
  {
    slug: "home.banner.title",
    label: "Banner — título grande",
    description: "",
    default: "VISITA NUESTRO ESCAPARATE VIRTUAL",
  },
  {
    slug: "home.banner.cta",
    label: "Banner — texto del botón",
    description: "",
    default: "VER ESCAPARATE",
  },

  // Home — contact CTA section
  {
    slug: "home.contact.title",
    label: "Sección contacto — título",
    description: "",
    default: "¿No encuentras lo que buscas?",
  },
  {
    slug: "home.contact.cta",
    label: "Sección contacto — texto del botón",
    description: "",
    default: "CONTACTA CON NOSOTROS AHORA",
  },

  // Home — marquee brands list
  {
    slug: "home.marquee.brands",
    label: "Marquee de marcas",
    description: "Lista separada por comas. Aparece en la línea inferior del intro screen.",
    multiline: true,
    default:
      "BMW, Mercedes-Benz, Porsche, Audi, Ferrari, Lamborghini, Maserati, Bentley, Rolls-Royce, Range Rover, McLaren, Aston Martin",
  },

  // Catalog
  {
    slug: "catalog.hero.title",
    label: "Catálogo — título del hero",
    multiline: true,
    description: "",
    default: "Vehículos de Alta Gama, Lujo y Super Lujo Importados",
  },

  // Footer
  {
    slug: "footer.copyright",
    label: "Footer — texto de copyright",
    description: "Reemplaza al texto generado por t.footer.rights.",
    default: "© 2026 AutoImport Pro · Todos los derechos reservados",
  },
];

export function findAssetSlot(slug: string): AssetSlot | undefined {
  return ASSET_SLOTS.find((s) => s.slug === slug);
}

export function findTextSlot(slug: string): TextSlot | undefined {
  return TEXT_SLOTS.find((s) => s.slug === slug);
}
