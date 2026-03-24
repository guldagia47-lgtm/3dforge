export type BlogPost = {
  slug: string;
  publishedAt: string;
  readingMinutes: { en: number; tr: number };
  keywords: { en: string; tr: string };
  title: { en: string; tr: string };
  excerpt: { en: string; tr: string };
  sections: { en: string[]; tr: string[] };
};

/**
 * All posts anchor on 3D models and branch into workflows that match ModelForge:
 * create flow, formats, preview, library, providers, quotas.
 */
export const blogPosts: BlogPost[] = [
  {
    slug: "3d-models-prompts-reference-images",
    publishedAt: "2026-03-22",
    readingMinutes: { en: 6, tr: 6 },
    keywords: {
      en: "3D models, text to 3D, reference images, prompt engineering, mesh quality",
      tr: "3D modeller, metinden 3D, referans görsel, prompt mühendisliği, mesh kalitesi",
    },
    title: {
      en: "Better 3D models start with prompts and reference images",
      tr: "Daha iyi 3D modeller: prompt ve referans görsellerle başlar",
    },
    excerpt: {
      en: "How clear intent, style tags, and a small set of reference uploads steer AI toward meshes you can actually ship—not just impressive turntable shots.",
      tr:
        "Net niyet, stil etiketleri ve birkaç referans görsel, yapay zekâyı yalnızca etkileyici turntable değil, gerçekten teslim edilebilir mesh’lere yönlendirir.",
    },
    sections: {
      en: [
        "Treat the prompt as a brief: name the object, materials, scale cues (real-world size or stylized), and the poly budget you expect for games, AR, or product pages.",
        "Reference images reduce ambiguity—front and side orthographic shots outperform random Pinterest collages when you want consistent silhouette and proportions.",
        "In a ModelForge-style flow, you combine prompt + uploads in one request; the studio should show prompt length, file count, and style so users iterate deliberately.",
        "After generation, compare preview topology against your target: hard edges for CAD-like parts, softer smoothing for characters, and consistent UV-friendly seams for texturing.",
      ],
      tr: [
        "Prompt’u bir brif gibi kullanın: nesneyi, malzemeleri, ölçek ipuçlarını (gerçek dünya veya stilize) ve oyun, AR veya ürün sayfası için beklediğiniz poligon bütçesini yazın.",
        "Referans görseller belirsizliği azaltır—silüet ve oran tutarlılığı için rastgele kolajlar yerine ön ve yan ortografik çekimler daha iyi sonuç verir.",
        "ModelForge tarzı akışta prompt ve yüklemeler tek istekte birleşir; stüdyo prompt uzunluğunu, dosya sayısını ve stili göstererek kullanıcının bilinçli iterasyon yapmasını sağlamalıdır.",
        "Üretimden sonra önizleme topolojisini hedefinize göre kontrol edin: CAD benzeri parçalar için sert kenarlar, karakterler için yumuşak smoothing, doku için UV dostu dikişler.",
      ],
    },
  },
  {
    slug: "3d-model-formats-glb-obj-stl",
    publishedAt: "2026-03-20",
    readingMinutes: { en: 5, tr: 5 },
    keywords: {
      en: "GLB, GLTF, OBJ, STL, 3D model export, PBR materials, 3D printing",
      tr: "GLB, GLTF, OBJ, STL, 3D model dışa aktarım, PBR malzeme, 3D baskı",
    },
    title: {
      en: "GLB, OBJ, and STL: picking the right format for your 3D models",
      tr: "GLB, OBJ ve STL: 3D modelleriniz için doğru format",
    },
    excerpt: {
      en: "Each format tells a different story—single-file delivery, legacy pipelines, or printable solids. Match the export to where your 3D model will live next.",
      tr: "Her format farklı bir senaryo anlatır—tek dosya teslimi, eski hatlar veya baskıya uygun gövde. Dışa aktarımı 3D modelinizin bir sonraki durağına göre seçin.",
    },
    sections: {
      en: [
        "GLB/GLTF bundles meshes, materials, and animations—ideal when your app previews 3D models in the browser and you want one download for stakeholders.",
        "OBJ remains universal for DCC handoff; pair it with MTL when you need basic materials, but expect extra steps for modern PBR workflows.",
        "STL encodes surface geometry for 3D printing and CAD checks; it is a poor choice for textured game assets but perfect when the 3D model is a physical prototype.",
        "In a generation studio, surface the format in the UI next to task IDs so support teams can trace which export a customer actually downloaded.",
      ],
      tr: [
        "GLB/GLTF; mesh, malzeme ve animasyonları tek pakette taşır—3D modelleri tarayıcıda önizlediğiniz ve paydaşlar için tek indirme istediğinizde idealdir.",
        "OBJ, DCC devri için evrenseldir; temel malzemeler için MTL ile eşleyin, ancak modern PBR iş akışlarında ek adımlar gerektiğini unutmayın.",
        "STL yüzey geometrisini 3D baskı ve CAD kontrolleri için kodlar; dokulu oyun varlığı için uygun değildir ama fiziksel prototip 3D modeli için uygundur.",
        "Bir üretim stüdyosunda formatı görev kimliklerinin yanında gösterin; destek ekipleri müşterinin hangi dışa aktarımı indirdiğini izleyebilsin.",
      ],
    },
  },
  {
    slug: "preview-3d-models-browser-workflow",
    publishedAt: "2026-03-18",
    readingMinutes: { en: 5, tr: 5 },
    keywords: {
      en: "3D model viewer, WebGL, Three.js, orbit controls, GLB preview",
      tr: "3D model görüntüleyici, WebGL, Three.js, yörünge kontrolleri, GLB önizleme",
    },
    title: {
      en: "Why in-browser preview matters for every 3D model you generate",
      tr: "Ürettiğiniz her 3D model için tarayıcı içi önizleme neden önemli?",
    },
    excerpt: {
      en: "Orbiting a mesh before download catches scale errors, flipped normals, and missing materials early—critical when AI-generated 3D models iterate quickly.",
      tr: "İndirmeden önce mesh’i döndürmek ölçek hatalarını, ters normalleri ve eksik malzemeleri erken yakalar—yapay zekâ 3D modelleri hızlı iterasyon yaptığında kritiktir.",
    },
    sections: {
      en: [
        "A dedicated viewer (orbit, zoom, neutral lighting) is faster than opening Blender for a sanity check when designers only need to approve silhouette and proportions.",
        "Support GLB first, then OBJ/STL fallbacks so marketing and engineering see the same 3D model state without installing plugins.",
        "Frame the camera automatically on load—users abandon flows when the mesh loads off-screen after a long generation wait.",
        "Pair preview with download links and task metadata so the 3D model in the browser is provably the same asset stored in your library.",
      ],
      tr: [
        "Ayrılmış bir görüntüleyici (yörünge, yakınlaştırma, nötr ışık), tasarımcılar yalnızca silüet ve oran onayı istediğinde Blender açmaktan daha hızlıdır.",
        "Önce GLB destekleyin, ardından OBJ/STL yedekleri ekleyin; pazarlama ve mühendislik aynı 3D model durumunu eklenti yüklemeden görsün.",
        "Yüklemede kamerayı otomatik kadrajlayın—uzun üretim bekleyişinden sonra mesh ekran dışında kalırsa kullanıcılar akışı terk eder.",
        "Önizlemeyi indirme bağlantıları ve görev meta verisiyle eşleyin; tarayıcıdaki 3D modelin kütüphanedeki varlıkla aynı olduğu izlenebilir olsun.",
      ],
    },
  },
  {
    slug: "3d-model-library-organization",
    publishedAt: "2026-03-16",
    readingMinutes: { en: 6, tr: 6 },
    keywords: {
      en: "3D model library, asset management, Supabase, metadata, search filters",
      tr: "3D model kütüphanesi, varlık yönetimi, Supabase, meta veri, arama filtreleri",
    },
    title: {
      en: "Organizing a 3D model library your team will actually use",
      tr: "Ekibinizin gerçekten kullanacağı bir 3D model kütüphanesi",
    },
    excerpt: {
      en: "Saved 3D models pile up fast. Prompt text, provider path, timestamps, and soft-delete patterns turn a flat list into a searchable product surface.",
      tr: "Kaydedilen 3D modeller hızla birikir. Prompt metni, sağlayıcı yolu, zaman damgaları ve yumuşak silme desenleri düz listeyi aranabilir bir ürün yüzeyine dönüştürür.",
    },
    sections: {
      en: [
        "Store the generation prompt and reference count with every 3D model row—future you will not remember which adjective fixed the handle geometry.",
        "Expose provider labels (e.g., Tripo AI, Meshy AI, or blended paths) so producers can compare quality trends per vendor over time.",
        "Filter by date and text search on prompts or task IDs; thumbnails or preview URLs make scanning faster than filenames like export_final_v7.glb.",
        "Daily quotas tied to successful saves encourage deliberate generation: users think twice before spamming variants that clutter the library.",
      ],
      tr: [
        "Her 3D model satırında üretim promptunu ve referans sayısını saklayın—gelecekteki siz hangi sıfatın tutamak geometrisini düzelttiğini hatırlamaz.",
        "Üreticilerin zaman içinde sağlayıcı başına kalite trendlerini karşılaştırabilmesi için sağlayıcı etiketlerini (ör. Tripo AI, Meshy AI veya birleşik yollar) gösterin.",
        "Tarihe ve prompt veya görev kimliği metin aramasına göre filtreleyin; export_final_v7.glb gibi dosya adlarından çok küçük resim veya önizleme URL’leri taramayı hızlandırır.",
        "Başarılı kayıtlara bağlı günlük kotalar bilinçli üretimi teşvik eder: kullanıcılar kütüphaneyi dolduran varyantları boşuna denemekten kaçınır.",
      ],
    },
  },
  {
    slug: "tripo-meshy-two-step-3d-models",
    publishedAt: "2026-03-14",
    readingMinutes: { en: 6, tr: 6 },
    keywords: {
      en: "Tripo AI, Meshy AI, 3D model generation, topology, texture refinement",
      tr: "Tripo AI, Meshy AI, 3D model üretimi, topoloji, doku iyileştirme",
    },
    title: {
      en: "Two-step 3D models: creation with Tripo AI, refinement with Meshy AI",
      tr: "İki aşamalı 3D modeller: Tripo AI ile oluşturma, Meshy AI ile iyileştirme",
    },
    excerpt: {
      en: "Splitting base mesh creation from polish mirrors how studios work—first volume and silhouette, then topology-friendly cleanup and textures.",
      tr: "Temel mesh oluşturmayı rötuştan ayırmak stüdyo pratiğini yansıtır—önce hacim ve silüet, ardından topoloji dostu temizlik ve dokular.",
    },
    sections: {
      en: [
        "Tripo-class steps excel at fast volumetric shapes from prompts and images; lean on them when exploration speed matters more than final poly count.",
        "Meshy-class passes tighten edge flow, materials, and export readiness—schedule them once the creative direction is locked.",
        "Normalize both stages into one task record so dashboards show a single timeline for the 3D model instead of orphaned provider IDs.",
        "Let users pick auto-routing when they are experimenting, but expose manual provider choice for art directors who already know which engine fits the brief.",
      ],
      tr: [
        "Tripo sınıfı adımlar prompt ve görsellerden hızlı hacimsel şekillerde güçlüdür; keşif hızı nihai poligon sayısından önemliyken bunlara yaslanın.",
        "Meshy sınıfı geçişler kenar akışını, malzemeleri ve dışa aktarım hazırlığını sıkılaştırır—yaratıcı yön kilitlendikten sonra planlayın.",
        "Her iki aşamayı tek görev kaydında birleştirin; böylece paneller 3D model için yalnız bir zaman çizelgesi gösterir, yetim sağlayıcı kimlikleri kalmaz.",
        "Kullanıcılar denerken otomatik yönlendirmeye izin verin; brifi hangi motorun karşıladığını bilen sanat yönetmenleri için manuel sağlayıcı seçimini de sunun.",
      ],
    },
  },
  {
    slug: "3d-models-product-pages-ar",
    publishedAt: "2026-03-12",
    readingMinutes: { en: 5, tr: 5 },
    keywords: {
      en: "3D models ecommerce, AR preview, product visualization, GLB web embed",
      tr: "3D modeller e-ticaret, AR önizleme, ürün görselleştirme, GLB web gömme",
    },
    title: {
      en: "From studio to storefront: using 3D models on product pages and AR",
      tr: "Stüdyodan vitrine: ürün sayfalarında ve AR’da 3D modeller",
    },
    excerpt: {
      en: "The same 3D model that previews in your generation app can power configurators and AR try-on—if you standardize scale, materials, and file size early.",
      tr: "Üretim uygulamanızda önizlenen 3D model, ölçek, malzeme ve dosya boyutunu erken standartlaştırdığınızda yapılandırıcıları ve AR denemeyi besleyebilir.",
    },
    sections: {
      en: [
        "E-commerce teams want GLB under a few megabytes with baked lighting tricks; generation studios should warn when high-poly outputs need decimation before web embed.",
        "AR shells expect consistent forward axes; document the orientation convention for every exported 3D model to avoid floating shoes and sideways furniture.",
        "Reuse the browser viewer component from your app on marketing pages—parity between internal previews and public embeds reduces “it looked different” tickets.",
        "Track which 3D models actually convert: tie analytics events to model IDs saved in your library, not just page views.",
      ],
      tr: [
        "E-ticaret ekipleri birkaç megabayt altında GLB ve pişmiş ışık hileleri ister; üretim stüdyoları yüksek poligon çıktıların web gömmeden önce seyreltme gerektirdiğinde uyarın.",
        "AR kabukları tutarlı ileri eksen bekler; yüzen ayakkabı ve yatay mobilya olmaması için her dışa aktarılan 3D model için yönelim kurallarını belgeleyin.",
        "Pazarlama sayfalarında uygulamanızdaki tarayıcı görüntüleyiciyi yeniden kullanın; iç önizleme ile kamuya açık gömüller arasında tutarlılık “farklı görünüyordu” taleplerini azaltır.",
        "Hangi 3D modellerin dönüşüm getirdiğini izleyin: yalnızca sayfa görüntülemesi değil, kütüphanede saklanan model kimliklerine bağlı analitik olayları kullanın.",
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
