export type Locale = "en" | "tr";

export type TranslationTree = typeof en;

const en = {
  meta: {
    description: {
      home: "ModelForge helps teams turn prompts and images into 3D assets with Tripo AI, Meshy AI, Supabase, and Stripe.",
      auth: "Sign in to ModelForge to access the 3D generation studio, library, and billing.",
      verify: "Confirm your email to activate your ModelForge session.",
      callback: "Completing secure sign-in for ModelForge.",
      dashboard: "Track usage, jobs, and subscription status in the ModelForge dashboard.",
      createModel: "Create 3D models from prompts and reference images in the ModelForge studio.",
      library: "Browse, preview, and manage saved 3D models in your ModelForge library.",
      blog: "Articles on 3D models: prompts, formats, preview, library workflows, Tripo AI & Meshy AI, and product-ready delivery.",
    },
    title: {
      home: "ModelForge | Generate 3D models from visuals and prompts",
      auth: "ModelForge | Sign in",
      verify: "ModelForge | Verify email",
      callback: "ModelForge | Completing sign in",
      dashboard: "ModelForge | Dashboard",
      createModel: "ModelForge | Create Model",
      library: "ModelForge | Library",
      blog: "ModelForge | Blog — 3D models, workflows, and delivery",
      blogPost: "ModelForge Blog",
    },
  },
  shell: {
    createModel: "Create model",
    signIn: "Sign in",
    signOut: "Sign out",
    sessionActive: "Session active",
    planActive: "plan active",
    ariaLanding: "Go to landing page",
  },
  lang: {
    en: "English",
    tr: "Türkçe",
    switch: "Language",
  },
  nav: {
    landing: "Landing",
    dashboard: "Dashboard",
    createModel: "Create Model",
    library: "Library",
    blog: "Blog",
  },
  common: {
    loadingSession: "Loading session...",
    readMore: "Read more",
    backToBlog: "Back to blog",
    published: "Published",
    minRead: "min read",
    topics: "Topics",
  },
  landing: {
    badge: "Visual-to-3D generation for ambitious teams",
    brand: "ModelForge",
    headlineLead: "Build premium 3D workflows from",
    headlineNeon: "prompts, images, and intent",
    headlineTrail: ".",
    subhead:
      "Launch a sleek generation studio where Tripo AI and Meshy AI transform references into editable assets, while Supabase, Resend, and Stripe keep the experience secure and monetized.",
    planCurrent: (plan: string, status: string) => `Current plan: ${plan} with ${status} billing status.`,
    planFree: "Current plan: Free until you subscribe.",
    ctaGenerate: "Start generating",
    ctaDashboard: "View dashboard",
    studioLabel: "Live generation studio",
    studioTier: "Premium workflow",
    preview: "Preview",
    previewTitle: "Low-poly electric scooter",
    previewBody:
      "Prompt-driven generation with image references, refinement passes, and export-ready output.",
    status: "Status",
    refining: "Refining",
    formats: "GLB / OBJ / FBX",
    previewReady: "Preview ready",
    pillars: [
      {
        title: "Prompt plus visuals",
        body: "Users can combine text instructions with reference images to steer generation with more precision.",
      },
      {
        title: "Tripo AI and Meshy AI",
        body: "The app routes requests through the right provider and normalizes every response into one clean workflow.",
      },
      {
        title: "Library first",
        body: "Every finished model is saved to Supabase so the user can revisit, preview, and delete assets later.",
      },
    ],
    steps: [
      {
        title: "Prompt and reference",
        body: "Start with a text prompt, add images, and define the target style and export format.",
      },
      {
        title: "Generate and refine",
        body: "Send the job through Tripo AI for creation, then let Meshy AI refine topology and texture.",
      },
      {
        title: "Review and ship",
        body: "Store the asset in the library, preview it in the browser, and export the files your team needs.",
      },
    ],
  },
  blog: {
    eyebrow: "3D models",
    title: "Blog",
    intro:
      "Deep dives into 3D models and the workflows around them—prompts, reference images, GLB/OBJ/STL choices, in-browser preview, library hygiene, Tripo AI and Meshy AI handoffs, and taking assets to product pages. English and Turkish.",
    empty: "No articles found.",
    seoNote:
      "Every post is written around 3D models and matches how ModelForge thinks: create, preview, save, iterate. Switch language for the other version; the URL stays the same.",
  },
};

const tr: TranslationTree = {
  meta: {
    description: {
      home: "ModelForge, ekiplerin prompt ve görselleri Tripo AI, Meshy AI, Supabase ve Stripe ile 3D varlığa dönüştürmesine yardımcı olur.",
      auth: "3D üretim stüdyosu, kütüphane ve faturalama için ModelForge’a giriş yapın.",
      verify: "ModelForge oturumunuzu etkinleştirmek için e-postanızı doğrulayın.",
      callback: "ModelForge için güvenli oturum tamamlanıyor.",
      dashboard: "ModelForge panelinde kullanım, işler ve abonelik durumunu izleyin.",
      createModel: "ModelForge stüdyosunda prompt ve referans görsellerden 3D model oluşturun.",
      library: "Kayıtlı 3D modellerinizi ModelForge kütüphanesinde görüntüleyin, önizleyin ve yönetin.",
      blog: "3D modeller üzerine yazılar: prompt, formatlar, önizleme, kütüphane, Tripo AI ve Meshy AI, ürüne hazır teslim.",
    },
    title: {
      home: "ModelForge | Görseller ve promptlarla 3D model üretin",
      auth: "ModelForge | Giriş",
      verify: "ModelForge | E-posta doğrulama",
      callback: "ModelForge | Oturum tamamlanıyor",
      dashboard: "ModelForge | Panel",
      createModel: "ModelForge | Model oluştur",
      library: "ModelForge | Kütüphane",
      blog: "ModelForge | Blog — 3D modeller, iş akışları ve teslimat",
      blogPost: "ModelForge Blog",
    },
  },
  shell: {
    createModel: "Model oluştur",
    signIn: "Giriş yap",
    signOut: "Çıkış",
    sessionActive: "Oturum açık",
    planActive: "plan aktif",
    ariaLanding: "Ana sayfaya git",
  },
  lang: {
    en: "English",
    tr: "Türkçe",
    switch: "Dil",
  },
  nav: {
    landing: "Ana sayfa",
    dashboard: "Panel",
    createModel: "Model oluştur",
    library: "Kütüphane",
    blog: "Blog",
  },
  common: {
    loadingSession: "Oturum yükleniyor...",
    readMore: "Devamını oku",
    backToBlog: "Bloga dön",
    published: "Yayın",
    minRead: "dk okuma",
    topics: "Konular",
  },
  landing: {
    badge: "Hırslı ekipler için görselden 3D üretimi",
    brand: "ModelForge",
    headlineLead: "Prompt, görsel ve niyetle ",
    headlineNeon: "üst düzey 3D iş akışları",
    headlineTrail: " kurun.",
    subhead:
      "Tripo AI ve Meshy AI’ın referansları düzenlenebilir varlıklara dönüştürdüğü şık bir üretim stüdyosu açın; Supabase, Resend ve Stripe deneyimi güvenli ve monetize tutar.",
    planCurrent: (plan: string, status: string) => `Mevcut plan: ${plan}, fatura durumu: ${status}.`,
    planFree: "Mevcut plan: Abone olana kadar ücretsiz.",
    ctaGenerate: "Üretmeye başla",
    ctaDashboard: "Paneli görüntüle",
    studioLabel: "Canlı üretim stüdyosu",
    studioTier: "Premium iş akışı",
    preview: "Önizleme",
    previewTitle: "Düşük poligon elektrikli scooter",
    previewBody:
      "Görsel referanslar, iyileştirme geçişleri ve dışa aktarıma hazır çıktı ile prompt odaklı üretim.",
    status: "Durum",
    refining: "İyileştiriliyor",
    formats: "GLB / OBJ / FBX",
    previewReady: "Önizleme hazır",
    pillars: [
      {
        title: "Prompt ve görseller",
        body: "Kullanıcılar metin talimatlarını referans görsellerle birleştirerek üretimi daha hassas yönlendirebilir.",
      },
      {
        title: "Tripo AI ve Meshy AI",
        body: "Uygulama istekleri doğru sağlayıcıya yönlendirir ve her yanıtı tek bir sade iş akışında birleştirir.",
      },
      {
        title: "Önce kütüphane",
        body: "Her tamamlanan model Supabase’e kaydedilir; kullanıcı varlıkları sonra tekrar açabilir, önizleyebilir ve silebilir.",
      },
    ],
    steps: [
      {
        title: "Prompt ve referans",
        body: "Metin promptu ile başlayın, görseller ekleyin ve hedef stil ile dışa aktarım formatını tanımlayın.",
      },
      {
        title: "Üret ve iyileştir",
        body: "İşi oluşturma için Tripo AI’a gönderin, ardından topoloji ve doku için Meshy AI’a bırakın.",
      },
      {
        title: "İncele ve yayınla",
        body: "Varlığı kütüphanede saklayın, tarayıcıda önizleyin ve ekibinizin ihtiyaç duyduğu dosyaları dışa aktarın.",
      },
    ],
  },
  blog: {
    eyebrow: "3D modeller",
    title: "Blog",
    intro:
      "3D modeller ve çevrelerindeki iş akışlarına odaklı içerikler—prompt ve referans görseller, GLB/OBJ/STL seçimi, tarayıcı önizlemesi, kütüphane düzeni, Tripo AI ve Meshy AI devri, ürün sayfası ve AR. İngilizce ve Türkçe.",
    empty: "Makale bulunamadı.",
    seoNote:
      "Yazıların odağı 3D modellerdir ve ModelForge mantığıyla uyumludur: oluştur, önizle, kaydet, yinele. Diğer dil için site dilini değiştirin; URL değişmez.",
  },
};

export const translations: Record<Locale, TranslationTree> = { en, tr };
