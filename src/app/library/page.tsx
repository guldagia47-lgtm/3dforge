import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/auth/AuthProvider";
import ModelViewer from "@/components/ModelViewer";
import { deleteSavedModel, fetchSavedModels, type SavedModel } from "@/lib/models";

const filters = ["All", "Tripo AI", "Meshy AI", "Tripo AI + Meshy AI"] as const;

export default function LibraryPage() {
  const { session } = useAuth();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [models, setModels] = useState<SavedModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadModels = useCallback(async () => {
    if (!session?.user.id) {
      return;
    }

    setLoading(true);
    setError(null);

    const result = await fetchSavedModels(session.user.id);

    if (!result.ok) {
      setError(result.message);
      setModels([]);
      setLoading(false);
      return;
    }

    setModels(result.data);
    setLoading(false);
  }, [session?.user.id]);

  useEffect(() => {
    if (!session?.user.id) {
      setLoading(false);
      return;
    }

    void loadModels();
  }, [loadModels, session?.user.id]);

  const filteredAssets = useMemo(() => {
    return models.filter((asset) => {
      const matchesQuery = asset.prompt.toLowerCase().includes(query.toLowerCase()) || asset.taskId.toLowerCase().includes(query.toLowerCase());
      const matchesFilter = filter === "All" || asset.providerPath === filter;
      return matchesQuery && matchesFilter;
    });
  }, [filter, models, query]);

  async function handleDelete(modelId: string) {
    if (!session?.user.id) {
      return;
    }

    const confirmed = window.confirm("Delete this model from your library?");

    if (!confirmed) {
      return;
    }

    setDeletingId(modelId);
    setError(null);

    const result = await deleteSavedModel(modelId, session.user.id);

    if (!result.ok) {
      setError(result.message);
      setDeletingId(null);
      return;
    }

    setModels((current) => current.filter((model) => model.id !== modelId));
    setDeletingId(null);
  }

  const hasModels = filteredAssets.length > 0;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14">
      <div className="space-y-8">
        <div className="max-w-3xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-indigo-100/80">Library</p>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">Browse saved models, review output, and remove what you no longer need.</h1>
          <p className="text-base leading-7 text-slate-300">
            The library is where finalized assets from the generation pipeline are organized and prepared for downstream use.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex min-w-[18rem] flex-1 items-center rounded-full border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-slate-300 glass-panel">
            <span className="mr-3 text-slate-500">Search</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full bg-transparent outline-none placeholder:text-slate-500"
              placeholder="Asset name"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            {filters.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  filter === item
                    ? "border-white/20 bg-white text-slate-950 shadow-[0_12px_24px_rgba(255,255,255,0.10)]"
                    : "border-white/10 bg-white/4 text-slate-300 hover:bg-white/8"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="glass-panel rounded-[2rem] px-6 py-10 text-sm text-slate-300">
            Loading saved models...
          </div>
        ) : null}

        {error ? (
          <div className="rounded-[2rem] border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-100">
            <p className="font-medium">Library error</p>
            <p className="mt-1 leading-6">{error}</p>
          </div>
        ) : null}

        {!loading && !error && !hasModels ? (
          <div className="glass-panel rounded-[2rem] px-6 py-10 text-sm text-slate-300">
            No saved models yet. Generate one from the Create Model page and it will appear here automatically.
          </div>
        ) : null}

        <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="grid gap-4 md:grid-cols-2">
          {filteredAssets.map((asset) => {
            const updatedAt = new Date(asset.updatedAt).toLocaleString([], {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            });

            return (
              <article key={asset.id} className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/65 shadow-lg shadow-slate-950/25">
                <div className="aspect-[4/3] bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.28),_rgba(15,23,42,0.85)_55%)] p-5">
                  <div className="flex h-full items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                    <div className="flex h-24 w-24 items-center justify-center rounded-[1.6rem] border border-white/20 bg-gradient-to-br from-white/18 to-indigo-400/20 text-xs text-white/80 neon-ring">
                      {asset.providerPath.split(" ").at(0)}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 p-5">
                  <div>
                    <h2 className="text-lg font-medium text-white">{asset.prompt}</h2>
                    <p className="mt-1 text-sm text-slate-400">
                      {asset.providerPath} · {asset.format}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Status</span>
                    <span className="text-white">{asset.status}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Updated</span>
                    <span className="text-white">{updatedAt}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Task ID</span>
                    <span className="truncate text-white">{asset.taskId}</span>
                  </div>

                  <div className="flex gap-3">
                    <a
                      href={asset.previewUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 rounded-full bg-white px-4 py-2 text-center text-sm font-medium text-slate-950 transition hover:bg-indigo-100"
                    >
                      Preview
                    </a>
                    <button type="button" onClick={() => void handleDelete(asset.id)} disabled={deletingId === asset.id} className="rounded-full border border-rose-400/20 bg-rose-500/10 px-4 py-2 text-sm text-rose-100 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-60">
                      {deletingId === asset.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}

          </div>

          <div className="space-y-4">
            <ModelViewer
              title="Library preview"
              modelUrl={filteredAssets[0]?.modelUrl ?? null}
              allowUpload
            />
            <div className="rounded-[2rem] border border-white/10 bg-slate-900/65 p-5 text-sm leading-7 text-slate-300">
              <p className="font-medium text-white">UX suggestion</p>
              <p className="mt-2">
                Keep the selected asset previewed on the right while the library list stays scrollable. This helps users inspect a file and continue browsing without losing context.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}