export type BlogPost = {
  slug: string;
  publishedAt: string;
  readingMinutes: { en: number; tr: number };
  keywords: { en: string; tr: string };
  title: { en: string; tr: string };
  excerpt: { en: string; tr: string };
  /** Semantic sections for readable layout + SEO */
  sections: { en: string[]; tr: string[] };
};

export const blogPosts: BlogPost[] = [
  {
    slug: "ai-text-to-3d-pipeline-2025",
    publishedAt: "2026-03-20",
    readingMinutes: { en: 7, tr: 7 },
    keywords: {
      en: "text to 3D, AI mesh generation, Tripo AI, Meshy AI, GLB export, product design 2025",
      tr: "metinden 3D, yapay zeka mesh, Tripo AI, Meshy AI, GLB dışa aktarım, ürün tasarımı 2025",
    },
    title: {
      en: "How teams ship AI text-to-3D pipelines in 2025",
      tr: "Ekipler 2025’te yapay zekâ metin–3D hatlarını nasıl yayına alıyor?",
    },
    excerpt: {
      en: "From prompt hygiene to provider routing and Supabase-backed libraries—what actually moves the needle for production 3D workflows.",
      tr: "Prompt disiplininden sağlayıcı yönlendirmeye ve Supabase destekli kütüphanelere kadar: üretim 3D iş akışlarında fark yaratan pratikler.",
    },
    sections: {
      en: [
        "Product and game studios are converging on hybrid pipelines: large language models draft constraints, while specialized 3D APIs output meshes with predictable topology budgets.",
        "The winning pattern is normalization—every provider response is mapped to the same task record, preview URL, and export format so UI and billing stay coherent.",
        "Security still matters: never expose service keys in the browser; gate generation behind authenticated sessions and per-user quotas stored in Postgres.",
        "SEO angle: publish case studies with structured headings, real metrics (time-to-first-preview, revision count), and schema-friendly summaries so technical buyers can find you.",
      ],
      tr: [
        "Ürün ve oyun stüdyoları hibrit hatlarda buluşuyor: büyük dil modelleri kısıtları yazıyor, uzman 3D API’ler ise öngörülebilir topoloji bütçesiyle mesh üretiyor.",
        "Kazanan desen normalizasyon: her sağlayıcı yanıtı aynı görev kaydına, önizleme URL’sine ve dışa aktarım formatına eşlenir; arayüz ve faturalama tutarlı kalır.",
        "Güvenlik hâlâ kritik: servis anahtarlarını tarayıcıya koymayın; üretimi kimliği doğrulanmış oturumlar ve Postgres’te kullanıcı kotasıyla koruyun.",
        "SEO tarafı: yapılandırılmış başlıklar, gerçek metrikler (ilk önizlemeye süre, revizyon sayısı) ve özet paragraflarla teknik alıcıların sizi bulmasını kolaylaştırın.",
      ],
    },
  },
  {
    slug: "vite-spa-vercel-seo",
    publishedAt: "2026-03-18",
    readingMinutes: { en: 6, tr: 6 },
    keywords: {
      en: "Vite SPA SEO, Vercel rewrites, single page app, canonical URL, Core Web Vitals",
      tr: "Vite SPA SEO, Vercel rewrite, tek sayfa uygulama, canonical URL, Core Web Vitals",
    },
    title: {
      en: "Vite SPAs on Vercel: SEO checks that still matter in 2026",
      tr: "Vercel üzerinde Vite SPA: 2026’da hâlâ önemli olan SEO kontrolleri",
    },
    excerpt: {
      en: "Client-side routing is fine if crawlers receive index.html. Here is the rewrite pattern, metadata hygiene, and performance signals search engines still reward.",
      tr: "Ön uç yönlendirme, tarayıcıya index.html gittiği sürece sorun değil. Rewrite kalıbı, meta veri disiplini ve arama motorlarının ödüllendirdiği performans sinyalleri.",
    },
    sections: {
      en: [
        "Configure a catch-all rewrite to index.html so deep links like /auth/callback do not 404 at the edge.",
        "Set unique titles and meta descriptions per route in your SPA—search engines may execute JavaScript, but clear signals reduce ambiguity.",
        "Keep LCP healthy: prioritize hero text and avoid blocking fonts; Vite code-splitting helps but image discipline matters more for marketing pages.",
        "Use canonical links when the same content could appear with query parameters; pair with hreflang only when you have separate localized URLs.",
      ],
      tr: [
        "Kenar sunucuda /auth/callback gibi derin linklerin 404 vermemesi için catch-all rewrite ile index.html’e yönlendirin.",
        "SPA’da rota başına benzersiz title ve meta description kullanın; JS çalıştırılsa da net sinyaller belirsizliği azaltır.",
        "LCP’yi koruyun: kahraman metni ve font engellemelerini yönetin; Vite parçalama yardımcı olur ama pazarlama sayfalarında görsel disiplin daha kritiktir.",
        "Aynı içerik sorgu parametreleriyle de görünebiliyorsa canonical kullanın; ayrı yerelleştirilmiş URL’ler yoksa hreflang zorunlu değildir.",
      ],
    },
  },
  {
    slug: "supabase-auth-email-production",
    publishedAt: "2026-03-15",
    readingMinutes: { en: 5, tr: 5 },
    keywords: {
      en: "Supabase Auth, email verification, PKCE, redirect URLs, Resend SMTP",
      tr: "Supabase Auth, e-posta doğrulama, PKCE, yönlendirme URL’leri, Resend SMTP",
    },
    title: {
      en: "Supabase Auth in production: email, redirects, and rate limits",
      tr: "Üretimde Supabase Auth: e-posta, yönlendirmeler ve hız limitleri",
    },
    excerpt: {
      en: "A practical checklist for Site URL, Redirect URLs, custom SMTP, and the over_email_send_rate_limit error teams hit during launch week.",
      tr: "Site URL, Redirect URL’leri, özel SMTP ve lansman haftasında sık görülen over_email_send_rate_limit hatası için pratik kontrol listesi.",
    },
    sections: {
      en: [
        "Align VITE_APP_URL (or your deployed origin) with Supabase Auth URL configuration so magic links land on a route your SPA actually serves.",
        "When using custom SMTP, monitor provider quotas separately from Supabase—two rate limits can stack.",
        "Prefer PKCE flows for browser clients and keep the session lock noise in mind when many hooks call getSession simultaneously.",
        "Document the verification journey in your marketing site: it reduces support tickets and gives you indexable help content.",
      ],
      tr: [
        "VITE_APP_URL (veya canlı origin) değerini Supabase Auth URL ayarlarıyla hizalayın; böylece sihirli linkler SPA’nızın gerçekten sunduğu rotaya düşer.",
        "Özel SMTP kullanırken sağlayıcı kotasını Supabase’ten ayrı izleyin; iki hız limiti üst üste binebilir.",
        "Tarayıcı istemcileri için PKCE akışını tercih edin; birçok hook aynı anda getSession çağırdığında oturum kilidi gürültüsünü göz önünde bulundurun.",
        "Doğrulama yolculuğunu pazarlama sitesinde anlatın: destek yükünü azaltır ve indekslenebilir yardım içeriği sağlar.",
      ],
    },
  },
  {
    slug: "generative-3d-commerce-trends",
    publishedAt: "2026-03-10",
    readingMinutes: { en: 6, tr: 6 },
    keywords: {
      en: "generative 3D, ecommerce assets, SKU visualization, NeRF, Gaussian splatting",
      tr: "üretken 3D, e-ticaret varlıkları, SKU görselleştirme, NeRF, Gaussian splatting",
    },
    title: {
      en: "Generative 3D for commerce: what buyers evaluate beyond the demo",
      tr: "Ticaret için üretken 3D: alıcılar demodan sonra neye bakıyor?",
    },
    excerpt: {
      en: "Material accuracy, rigging readiness, and pipeline export stability beat flashy turntables when teams adopt AI meshes for catalogs.",
      tr: "Ekipler kataloglar için yapay zekâ mesh’e geçerken gösterişli turntable’dan çok malzeme doğruluğu, rig hazırlığı ve dışa aktarım istikrarı önem kazanır.",
    },
    sections: {
      en: [
        "Merchandising teams ask for repeatable lighting and color fidelity—document how your prompts preserve brand palettes.",
        "Downstream tools (Blender, Unity, USDZ) expose different constraints; publish which formats you certify for handoff.",
        "Trend: combining splat previews with mesh exports for AR try-on flows—be explicit about which step is client-side only.",
        "English + Turkish documentation improves regional SEO for manufacturers sourcing digital twins in EMEA.",
      ],
      tr: [
        "Merchandising ekipleri tekrarlanabilir ışık ve renk sadakati ister; prompt’larınızın marka paletlerini nasıl koruduğunu belgeleyin.",
        "Aşağı akış araçları (Blender, Unity, USDZ) farklı kısıtlar çıkarır; hangi formatları devreye almak için onayladığınızı yayınlayın.",
        "Eğilim: AR deneme akışlarında splat önizlemesi ile mesh dışa aktarımını birleştirmek—hangi adımın yalnızca istemci tarafında olduğunu açık yazın.",
        "İngilizce + Türkçe dokümantasyon, EMEA’da dijital ikiz arayan üreticiler için bölgesel SEO’yu güçlendirir.",
      ],
    },
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getAllBlogSlugs(): string[] {
  return blogPosts.map((post) => post.slug);
}
