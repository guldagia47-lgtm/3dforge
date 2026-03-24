import { type AppPath } from "@/app/navigation";
import { getBlogPostBySlug } from "@/data/blogPosts";
import { useI18n } from "@/i18n/context";

type BlogPostPageProps = {
  slug: string;
  onNavigate: (path: AppPath) => void;
};

export default function BlogPostPage({ slug, onNavigate }: BlogPostPageProps) {
  const { locale, copy } = useI18n();
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
        <p className="text-lg text-slate-300">
          {locale === "tr" ? "Bu yazı bulunamadı." : "This article could not be found."}
        </p>
        <button
          type="button"
          onClick={() => onNavigate("/blog")}
          className="mt-6 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-slate-950 hover:bg-indigo-100"
        >
          {copy.common.backToBlog}
        </button>
      </div>
    );
  }

  const title = post.title[locale];
  const sections = post.sections[locale];
  const minutes = post.readingMinutes[locale];

  return (
    <article className="mx-auto max-w-3xl px-6 py-10 lg:px-8 lg:py-14" itemScope itemType="https://schema.org/Article">
      <meta itemProp="datePublished" content={post.publishedAt} />
      <button
        type="button"
        onClick={() => onNavigate("/blog")}
        className="text-sm font-medium text-indigo-200/90 hover:text-white"
      >
        ← {copy.common.backToBlog}
      </button>

      <header className="mt-8 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
          <time dateTime={post.publishedAt}>{post.publishedAt}</time>
          <span className="mx-2 text-slate-600">·</span>
          <span>
            {minutes} {copy.common.minRead}
          </span>
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl" itemProp="headline">
          {title}
        </h1>
        <p className="text-lg leading-8 text-slate-300" itemProp="description">
          {post.excerpt[locale]}
        </p>
        <p className="text-xs text-slate-500">
          <span className="font-medium text-slate-400">{copy.common.topics}:</span> {post.keywords[locale]}
        </p>
      </header>

      <div className="prose prose-invert mt-10 max-w-none" itemProp="articleBody">
        {sections.map((paragraph, index) => (
          <p key={index} className="mb-6 text-base leading-8 text-slate-300">
            {paragraph}
          </p>
        ))}
      </div>

      <aside className="mt-12 rounded-3xl border border-white/10 bg-white/4 p-5 text-sm leading-7 text-slate-400">
        {locale === "tr" ? (
          <>
            Bu yazı <strong className="text-slate-200">3D modeller</strong> odağındadır ve ModelForge’daki oluşturma, önizleme ve
            kütüphane akışıyla uyumludur. İngilizce sürüm için üst menüden dili <strong className="text-slate-200">English</strong>{" "}
            yapın; URL değişmez, başlık ve açıklama seçtiğiniz dile göre güncellenir.
          </>
        ) : (
          <>
            This article is centered on <strong className="text-slate-200">3D models</strong> and aligns with ModelForge’s create,
            preview, and library flow. Switch the header language to <strong className="text-slate-200">Türkçe</strong> for Turkish;
            the URL stays the same while titles and descriptions follow your locale.
          </>
        )}
      </aside>
    </article>
  );
}
