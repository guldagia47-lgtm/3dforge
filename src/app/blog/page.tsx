import { type AppPath } from "@/app/navigation";
import { blogPosts } from "@/data/blogPosts";
import { useI18n } from "@/i18n/context";

type BlogIndexPageProps = {
  onNavigate: (path: AppPath) => void;
};

export default function BlogIndexPage({ onNavigate }: BlogIndexPageProps) {
  const { locale, copy } = useI18n();

  const sorted = [...blogPosts].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14">
      <header className="max-w-3xl space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-indigo-100/80">{copy.blog.eyebrow}</p>
        <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">{copy.blog.title}</h1>
        <p className="text-base leading-7 text-slate-300">{copy.blog.intro}</p>
        <p className="text-sm leading-6 text-slate-500">{copy.blog.seoNote}</p>
      </header>

      <ul className="mt-12 grid gap-6 lg:grid-cols-2">
        {sorted.map((post) => {
          const title = post.title[locale];
          const excerpt = post.excerpt[locale];
          const minutes = post.readingMinutes[locale];
          const path = `/blog/${post.slug}` as AppPath;

          return (
            <li key={post.slug}>
              <article className="glass-panel flex h-full flex-col rounded-[2rem] p-6 transition hover:border-white/15">
                <time className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500" dateTime={post.publishedAt}>
                  {copy.common.published} · {post.publishedAt}
                </time>
                <h2 className="mt-3 text-xl font-semibold tracking-tight text-white">
                  <button
                    type="button"
                    onClick={() => onNavigate(path)}
                    className="text-left transition hover:text-indigo-200"
                  >
                    {title}
                  </button>
                </h2>
                <p className="mt-3 flex-1 text-sm leading-7 text-slate-400">{excerpt}</p>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/8 pt-4 text-xs text-slate-500">
                  <span>
                    {minutes} {copy.common.minRead}
                  </span>
                  <button
                    type="button"
                    onClick={() => onNavigate(path)}
                    className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-white transition hover:bg-white/16"
                  >
                    {copy.common.readMore}
                  </button>
                </div>
              </article>
            </li>
          );
        })}
      </ul>

      {sorted.length === 0 ? <p className="mt-10 text-slate-400">{copy.blog.empty}</p> : null}
    </div>
  );
}
