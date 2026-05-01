export type Locale = "es" | "en" | "ru" | "de" | "it" | "fr" | "zh";

export const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: "es", label: "Español",  flag: "🇪🇸" },
  { code: "en", label: "English",  flag: "🇬🇧" },
  { code: "ru", label: "Русский",  flag: "🇷🇺" },
  { code: "de", label: "Deutsch",  flag: "🇩🇪" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "zh", label: "中文",     flag: "🇨🇳" },
];

type FeatureItem = { title: string; desc: string };
type StatItem    = { value: string; label: string };

export type Dict = {
  nav: { catalog: string; login: string; register: string };
  hero: { badge: string; title: string; accent: string; subtitle: string; cta1: string; cta2: string };
  stats: StatItem[];
  features: { title: string; sub: string; items: FeatureItem[] };
  cta: { title: string; sub: string; btn: string };
  footer: { rights: string };
  catalog: {
    title: string; found: string; no_results: string; no_results_sub: string;
    filters: string; search: string; search_ph: string;
    brand: string; all_brands: string; fuel: string; all_fuels: string;
    trans: string; all_trans: string; price: string; year_label: string;
    min: string; max: string; from: string; to: string;
    apply: string; clear: string; prev: string; next: string; page_of: string;
    login: string; register: string;
  };
  auth: {
    login: { title: string; sub: string; email: string; pass: string; btn: string; no_acc: string; link: string };
    register: {
      title: string; sub: string; name: string; name_ph: string; email: string;
      phone: string; phone_opt: string; pass: string; btn: string;
      have_acc: string; link: string; check1: string; check2: string; check3: string;
    };
  };
};

const es: Dict = {
  nav: { catalog: "Catálogo", login: "Iniciar Sesión", register: "Registrarse" },
  hero: {
    badge:    "Plataforma líder en importación de vehículos de lujo",
    title:    "Importa tu coche ideal",
    accent:   "al mejor precio",
    subtitle: "Conectamos proveedores, colaboradores y clientes en una plataforma profesional y segura para la importación y venta de vehículos de todo el mundo.",
    cta1:     "Explorar Catálogo",
    cta2:     "Crear Cuenta Gratis",
  },
  stats: [
    { value: "500+",  label: "Vehículos importados" },
    { value: "30+",   label: "Países de origen" },
    { value: "8",     label: "Años de experiencia" },
    { value: "1.200+",label: "Clientes satisfechos" },
  ],
  features: {
    title: "¿Por qué AutoImport Pro?",
    sub:   "Todo lo que necesitas para importar con total confianza",
    items: [
      { title: "Máxima Seguridad",    desc: "Cifrado SSL, autenticación segura y registro de auditoría completo en cada operación." },
      { title: "APIs Integradas",     desc: "Importa vehículos directamente desde fuentes externas con un solo clic." },
      { title: "Gestión de Roles",    desc: "Perfiles personalizados para Administrador, Proveedor, Colaborador y Cliente." },
      { title: "Catálogo Completo",   desc: "Fichas técnicas detalladas con fotos ilimitadas y todas las especificaciones." },
    ],
  },
  cta: {
    title: "¿Listo para empezar?",
    sub:   "Regístrate gratis y explora el catálogo de vehículos importados",
    btn:   "Crear Cuenta Gratuita",
  },
  footer: { rights: "© 2026 AutoImport Pro. Todos los derechos reservados." },
  catalog: {
    title: "Catálogo de Vehículos", found: "vehículos encontrados",
    no_results: "No se encontraron vehículos", no_results_sub: "Prueba con otros filtros",
    filters: "Filtros", search: "Búsqueda", search_ph: "Marca, modelo...",
    brand: "Marca", all_brands: "Todas", fuel: "Combustible", all_fuels: "Todos",
    trans: "Transmisión", all_trans: "Todas", price: "Precio (€)", year_label: "Año",
    min: "Mín", max: "Máx", from: "Desde", to: "Hasta",
    apply: "Aplicar Filtros", clear: "Limpiar filtros", prev: "Anterior", next: "Siguiente",
    page_of: "Página {n} de {total}", login: "Iniciar sesión", register: "Registrarse",
  },
  auth: {
    login: {
      title: "Iniciar Sesión", sub: "Accede a tu panel de control",
      email: "Email", pass: "Contraseña", btn: "Iniciar Sesión",
      no_acc: "¿No tienes cuenta?", link: "Regístrate aquí",
    },
    register: {
      title: "Crear Cuenta", sub: "Regístrate como cliente",
      name: "Nombre completo", name_ph: "Juan García",
      email: "Email", phone: "Teléfono", phone_opt: "Teléfono (opcional)",
      pass: "Contraseña", btn: "Crear Cuenta",
      have_acc: "¿Ya tienes cuenta?", link: "Inicia sesión",
      check1: "Al menos 8 caracteres", check2: "Una letra mayúscula", check3: "Un número",
    },
  },
};

const en: Dict = {
  nav: { catalog: "Catalog", login: "Log In", register: "Sign Up" },
  hero: {
    badge:    "Leading luxury vehicle import platform",
    title:    "Import your ideal car",
    accent:   "at the best price",
    subtitle: "We connect providers, collaborators and clients on a professional, secure platform for importing and selling vehicles from around the world.",
    cta1:     "Explore Catalog",
    cta2:     "Create Free Account",
  },
  stats: [
    { value: "500+",  label: "Vehicles imported" },
    { value: "30+",   label: "Countries of origin" },
    { value: "8",     label: "Years of experience" },
    { value: "1,200+",label: "Satisfied clients" },
  ],
  features: {
    title: "Why AutoImport Pro?",
    sub:   "Everything you need to import with complete confidence",
    items: [
      { title: "Maximum Security",   desc: "SSL encryption, secure authentication and complete audit log for every operation." },
      { title: "Integrated APIs",    desc: "Import vehicles directly from external sources with a single click." },
      { title: "Role Management",    desc: "Custom profiles for Administrator, Provider, Collaborator and Client." },
      { title: "Full Catalog",       desc: "Detailed spec sheets with unlimited photos and all specifications." },
    ],
  },
  cta: {
    title: "Ready to get started?",
    sub:   "Sign up free and explore the catalog of imported vehicles",
    btn:   "Create Free Account",
  },
  footer: { rights: "© 2026 AutoImport Pro. All rights reserved." },
  catalog: {
    title: "Vehicle Catalog", found: "vehicles found",
    no_results: "No vehicles found", no_results_sub: "Try different filters",
    filters: "Filters", search: "Search", search_ph: "Brand, model...",
    brand: "Brand", all_brands: "All", fuel: "Fuel", all_fuels: "All",
    trans: "Transmission", all_trans: "All", price: "Price (€)", year_label: "Year",
    min: "Min", max: "Max", from: "From", to: "To",
    apply: "Apply Filters", clear: "Clear filters", prev: "Previous", next: "Next",
    page_of: "Page {n} of {total}", login: "Log in", register: "Sign up",
  },
  auth: {
    login: {
      title: "Log In", sub: "Access your control panel",
      email: "Email", pass: "Password", btn: "Log In",
      no_acc: "Don't have an account?", link: "Sign up here",
    },
    register: {
      title: "Create Account", sub: "Register as a client",
      name: "Full name", name_ph: "John Smith",
      email: "Email", phone: "Phone", phone_opt: "Phone (optional)",
      pass: "Password", btn: "Create Account",
      have_acc: "Already have an account?", link: "Log in",
      check1: "At least 8 characters", check2: "One uppercase letter", check3: "One number",
    },
  },
};

const ru: Dict = {
  nav: { catalog: "Каталог", login: "Войти", register: "Регистрация" },
  hero: {
    badge:    "Ведущая платформа импорта премиальных автомобилей",
    title:    "Импортируйте идеальный автомобиль",
    accent:   "по лучшей цене",
    subtitle: "Мы объединяем поставщиков, партнёров и клиентов на профессиональной надёжной платформе для импорта и продажи автомобилей со всего мира.",
    cta1:     "Смотреть каталог",
    cta2:     "Создать аккаунт",
  },
  stats: [
    { value: "500+",  label: "Импортировано автомобилей" },
    { value: "30+",   label: "Стран происхождения" },
    { value: "8",     label: "Лет опыта" },
    { value: "1200+", label: "Довольных клиентов" },
  ],
  features: {
    title: "Почему AutoImport Pro?",
    sub:   "Всё необходимое для уверенного импорта",
    items: [
      { title: "Максимальная безопасность", desc: "SSL-шифрование, надёжная аутентификация и полный журнал аудита для каждой операции." },
      { title: "Интегрированные API",       desc: "Импортируйте автомобили напрямую из внешних источников одним кликом." },
      { title: "Управление ролями",         desc: "Персональные профили для Администратора, Поставщика, Партнёра и Клиента." },
      { title: "Полный каталог",            desc: "Подробные технические листы с неограниченным количеством фото и характеристик." },
    ],
  },
  cta: {
    title: "Готовы начать?",
    sub:   "Зарегистрируйтесь бесплатно и изучите каталог импортных автомобилей",
    btn:   "Создать бесплатный аккаунт",
  },
  footer: { rights: "© 2026 AutoImport Pro. Все права защищены." },
  catalog: {
    title: "Каталог автомобилей", found: "автомобилей найдено",
    no_results: "Автомобили не найдены", no_results_sub: "Попробуйте другие фильтры",
    filters: "Фильтры", search: "Поиск", search_ph: "Марка, модель...",
    brand: "Марка", all_brands: "Все", fuel: "Топливо", all_fuels: "Все",
    trans: "Трансмиссия", all_trans: "Все", price: "Цена (€)", year_label: "Год",
    min: "Мин", max: "Макс", from: "От", to: "До",
    apply: "Применить фильтры", clear: "Сбросить фильтры", prev: "Назад", next: "Вперёд",
    page_of: "Страница {n} из {total}", login: "Войти", register: "Регистрация",
  },
  auth: {
    login: {
      title: "Войти", sub: "Доступ к панели управления",
      email: "Email", pass: "Пароль", btn: "Войти",
      no_acc: "Нет аккаунта?", link: "Зарегистрируйтесь",
    },
    register: {
      title: "Создать аккаунт", sub: "Зарегистрируйтесь как клиент",
      name: "Полное имя", name_ph: "Иван Иванов",
      email: "Email", phone: "Телефон", phone_opt: "Телефон (необязательно)",
      pass: "Пароль", btn: "Создать аккаунт",
      have_acc: "Уже есть аккаунт?", link: "Войти",
      check1: "Минимум 8 символов", check2: "Одна заглавная буква", check3: "Одна цифра",
    },
  },
};

const de: Dict = {
  nav: { catalog: "Katalog", login: "Anmelden", register: "Registrieren" },
  hero: {
    badge:    "Führende Plattform für Fahrzeugimport",
    title:    "Importieren Sie Ihr Traumauto",
    accent:   "zum besten Preis",
    subtitle: "Wir verbinden Anbieter, Mitarbeiter und Kunden auf einer professionellen, sicheren Plattform für den Import und Verkauf von Fahrzeugen aus aller Welt.",
    cta1:     "Katalog erkunden",
    cta2:     "Kostenloses Konto erstellen",
  },
  stats: [
    { value: "500+",  label: "Importierte Fahrzeuge" },
    { value: "30+",   label: "Herkunftsländer" },
    { value: "8",     label: "Jahre Erfahrung" },
    { value: "1.200+",label: "Zufriedene Kunden" },
  ],
  features: {
    title: "Warum AutoImport Pro?",
    sub:   "Alles, was Sie für einen sicheren Import benötigen",
    items: [
      { title: "Maximale Sicherheit",    desc: "SSL-Verschlüsselung, sichere Authentifizierung und vollständiges Prüfprotokoll." },
      { title: "Integrierte APIs",       desc: "Importieren Sie Fahrzeuge direkt aus externen Quellen mit einem Klick." },
      { title: "Rollenverwaltung",       desc: "Individuelle Profile für Administrator, Anbieter, Mitarbeiter und Kunde." },
      { title: "Vollständiger Katalog",  desc: "Detaillierte Datenblätter mit unbegrenzten Fotos und Spezifikationen." },
    ],
  },
  cta: {
    title: "Bereit anzufangen?",
    sub:   "Registrieren Sie sich kostenlos und erkunden Sie den Katalog importierter Fahrzeuge",
    btn:   "Kostenloses Konto erstellen",
  },
  footer: { rights: "© 2026 AutoImport Pro. Alle Rechte vorbehalten." },
  catalog: {
    title: "Fahrzeugkatalog", found: "Fahrzeuge gefunden",
    no_results: "Keine Fahrzeuge gefunden", no_results_sub: "Versuchen Sie andere Filter",
    filters: "Filter", search: "Suche", search_ph: "Marke, Modell...",
    brand: "Marke", all_brands: "Alle", fuel: "Kraftstoff", all_fuels: "Alle",
    trans: "Getriebe", all_trans: "Alle", price: "Preis (€)", year_label: "Jahr",
    min: "Min", max: "Max", from: "Von", to: "Bis",
    apply: "Filter anwenden", clear: "Filter löschen", prev: "Zurück", next: "Weiter",
    page_of: "Seite {n} von {total}", login: "Anmelden", register: "Registrieren",
  },
  auth: {
    login: {
      title: "Anmelden", sub: "Auf Ihr Bedienfeld zugreifen",
      email: "E-Mail", pass: "Passwort", btn: "Anmelden",
      no_acc: "Kein Konto?", link: "Hier registrieren",
    },
    register: {
      title: "Konto erstellen", sub: "Als Kunde registrieren",
      name: "Vollständiger Name", name_ph: "Max Mustermann",
      email: "E-Mail", phone: "Telefon", phone_opt: "Telefon (optional)",
      pass: "Passwort", btn: "Konto erstellen",
      have_acc: "Haben Sie bereits ein Konto?", link: "Anmelden",
      check1: "Mindestens 8 Zeichen", check2: "Ein Großbuchstabe", check3: "Eine Zahl",
    },
  },
};

const it: Dict = {
  nav: { catalog: "Catalogo", login: "Accedi", register: "Registrati" },
  hero: {
    badge:    "Piattaforma leader nell'importazione di veicoli di lusso",
    title:    "Importa la tua auto ideale",
    accent:   "al miglior prezzo",
    subtitle: "Colleghiamo fornitori, collaboratori e clienti su una piattaforma professionale e sicura per l'importazione e la vendita di veicoli da tutto il mondo.",
    cta1:     "Esplora il Catalogo",
    cta2:     "Crea Account Gratuito",
  },
  stats: [
    { value: "500+",  label: "Veicoli importati" },
    { value: "30+",   label: "Paesi di origine" },
    { value: "8",     label: "Anni di esperienza" },
    { value: "1.200+",label: "Clienti soddisfatti" },
  ],
  features: {
    title: "Perché AutoImport Pro?",
    sub:   "Tutto ciò di cui hai bisogno per importare con fiducia",
    items: [
      { title: "Massima Sicurezza",    desc: "Crittografia SSL, autenticazione sicura e registro audit completo per ogni operazione." },
      { title: "API Integrate",        desc: "Importa veicoli direttamente da fonti esterne con un solo clic." },
      { title: "Gestione dei Ruoli",   desc: "Profili personalizzati per Amministratore, Fornitore, Collaboratore e Cliente." },
      { title: "Catalogo Completo",    desc: "Schede tecniche dettagliate con foto illimitate e tutte le specifiche." },
    ],
  },
  cta: {
    title: "Pronto per iniziare?",
    sub:   "Registrati gratuitamente ed esplora il catalogo di veicoli importati",
    btn:   "Crea Account Gratuito",
  },
  footer: { rights: "© 2026 AutoImport Pro. Tutti i diritti riservati." },
  catalog: {
    title: "Catalogo Veicoli", found: "veicoli trovati",
    no_results: "Nessun veicolo trovato", no_results_sub: "Prova con altri filtri",
    filters: "Filtri", search: "Ricerca", search_ph: "Marca, modello...",
    brand: "Marca", all_brands: "Tutte", fuel: "Carburante", all_fuels: "Tutti",
    trans: "Trasmissione", all_trans: "Tutte", price: "Prezzo (€)", year_label: "Anno",
    min: "Min", max: "Max", from: "Dal", to: "Al",
    apply: "Applica Filtri", clear: "Cancella filtri", prev: "Precedente", next: "Successivo",
    page_of: "Pagina {n} di {total}", login: "Accedi", register: "Registrati",
  },
  auth: {
    login: {
      title: "Accedi", sub: "Accedi al tuo pannello di controllo",
      email: "Email", pass: "Password", btn: "Accedi",
      no_acc: "Non hai un account?", link: "Registrati qui",
    },
    register: {
      title: "Crea Account", sub: "Registrati come cliente",
      name: "Nome completo", name_ph: "Mario Rossi",
      email: "Email", phone: "Telefono", phone_opt: "Telefono (opzionale)",
      pass: "Password", btn: "Crea Account",
      have_acc: "Hai già un account?", link: "Accedi",
      check1: "Almeno 8 caratteri", check2: "Una lettera maiuscola", check3: "Un numero",
    },
  },
};

const fr: Dict = {
  nav: { catalog: "Catalogue", login: "Se connecter", register: "S'inscrire" },
  hero: {
    badge:    "Plateforme leader d'importation de véhicules de luxe",
    title:    "Importez votre voiture idéale",
    accent:   "au meilleur prix",
    subtitle: "Nous connectons fournisseurs, collaborateurs et clients sur une plateforme professionnelle et sécurisée pour l'importation et la vente de véhicules du monde entier.",
    cta1:     "Explorer le Catalogue",
    cta2:     "Créer un Compte Gratuit",
  },
  stats: [
    { value: "500+",  label: "Véhicules importés" },
    { value: "30+",   label: "Pays d'origine" },
    { value: "8",     label: "Ans d'expérience" },
    { value: "1 200+",label: "Clients satisfaits" },
  ],
  features: {
    title: "Pourquoi AutoImport Pro ?",
    sub:   "Tout ce dont vous avez besoin pour importer en toute confiance",
    items: [
      { title: "Sécurité Maximale",    desc: "Chiffrement SSL, authentification sécurisée et journal d'audit complet pour chaque opération." },
      { title: "APIs Intégrées",       desc: "Importez des véhicules directement depuis des sources externes en un seul clic." },
      { title: "Gestion des Rôles",    desc: "Profils personnalisés pour Administrateur, Fournisseur, Collaborateur et Client." },
      { title: "Catalogue Complet",    desc: "Fiches techniques détaillées avec photos illimitées et toutes les spécifications." },
    ],
  },
  cta: {
    title: "Prêt à commencer ?",
    sub:   "Inscrivez-vous gratuitement et explorez le catalogue de véhicules importés",
    btn:   "Créer un Compte Gratuit",
  },
  footer: { rights: "© 2026 AutoImport Pro. Tous droits réservés." },
  catalog: {
    title: "Catalogue de Véhicules", found: "véhicules trouvés",
    no_results: "Aucun véhicule trouvé", no_results_sub: "Essayez d'autres filtres",
    filters: "Filtres", search: "Recherche", search_ph: "Marque, modèle...",
    brand: "Marque", all_brands: "Toutes", fuel: "Carburant", all_fuels: "Tous",
    trans: "Transmission", all_trans: "Toutes", price: "Prix (€)", year_label: "Année",
    min: "Min", max: "Max", from: "De", to: "À",
    apply: "Appliquer les filtres", clear: "Effacer les filtres", prev: "Précédent", next: "Suivant",
    page_of: "Page {n} sur {total}", login: "Se connecter", register: "S'inscrire",
  },
  auth: {
    login: {
      title: "Se connecter", sub: "Accédez à votre tableau de bord",
      email: "Email", pass: "Mot de passe", btn: "Se connecter",
      no_acc: "Pas encore de compte ?", link: "Inscrivez-vous ici",
    },
    register: {
      title: "Créer un Compte", sub: "Inscrivez-vous en tant que client",
      name: "Nom complet", name_ph: "Jean Dupont",
      email: "Email", phone: "Téléphone", phone_opt: "Téléphone (optionnel)",
      pass: "Mot de passe", btn: "Créer un Compte",
      have_acc: "Vous avez déjà un compte ?", link: "Se connecter",
      check1: "Au moins 8 caractères", check2: "Une lettre majuscule", check3: "Un chiffre",
    },
  },
};

const zh: Dict = {
  nav: { catalog: "目录", login: "登录", register: "注册" },
  hero: {
    badge:    "领先的豪华车辆进口平台",
    title:    "进口您的理想汽车",
    accent:   "以最优惠的价格",
    subtitle: "我们在专业、安全的平台上连接供应商、合作伙伴和客户，为全球汽车的进口和销售提供服务。",
    cta1:     "浏览目录",
    cta2:     "免费创建账户",
  },
  stats: [
    { value: "500+",  label: "已进口车辆" },
    { value: "30+",   label: "原产国" },
    { value: "8",     label: "年行业经验" },
    { value: "1200+", label: "满意客户" },
  ],
  features: {
    title: "为什么选择 AutoImport Pro？",
    sub:   "您进口所需的一切，尽在一个平台",
    items: [
      { title: "最高安全性",   desc: "SSL加密、安全身份验证以及每次操作的完整审计日志。" },
      { title: "集成API",      desc: "一键直接从外部来源进口车辆。" },
      { title: "角色管理",     desc: "为管理员、供应商、合作伙伴和客户提供个性化档案。" },
      { title: "完整目录",     desc: "详细技术规格表，包含无限照片和所有规格参数。" },
    ],
  },
  cta: {
    title: "准备好开始了吗？",
    sub:   "免费注册并浏览进口车辆目录",
    btn:   "免费创建账户",
  },
  footer: { rights: "© 2026 AutoImport Pro. 保留所有权利。" },
  catalog: {
    title: "车辆目录", found: "辆车辆",
    no_results: "未找到车辆", no_results_sub: "请尝试其他筛选条件",
    filters: "筛选", search: "搜索", search_ph: "品牌、车型...",
    brand: "品牌", all_brands: "全部", fuel: "燃料", all_fuels: "全部",
    trans: "变速箱", all_trans: "全部", price: "价格 (€)", year_label: "年份",
    min: "最低", max: "最高", from: "从", to: "至",
    apply: "应用筛选", clear: "清除筛选", prev: "上一页", next: "下一页",
    page_of: "第 {n} 页，共 {total} 页", login: "登录", register: "注册",
  },
  auth: {
    login: {
      title: "登录", sub: "访问您的控制面板",
      email: "电子邮件", pass: "密码", btn: "登录",
      no_acc: "没有账户？", link: "在此注册",
    },
    register: {
      title: "创建账户", sub: "注册为客户",
      name: "全名", name_ph: "张伟",
      email: "电子邮件", phone: "电话", phone_opt: "电话（可选）",
      pass: "密码", btn: "创建账户",
      have_acc: "已有账户？", link: "登录",
      check1: "至少8个字符", check2: "一个大写字母", check3: "一个数字",
    },
  },
};

export const translations: Record<Locale, Dict> = { es, en, ru, de, it, fr, zh };
