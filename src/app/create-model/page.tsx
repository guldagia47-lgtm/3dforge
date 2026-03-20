import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { useAuth } from "@/auth/AuthProvider";
import ModelViewer from "@/components/ModelViewer";
import { type GenerationResult } from "@/lib/generation";
import { saveGeneratedModel } from "@/lib/models";
import { DAILY_MODEL_LIMIT, fetchDailyModelQuota, type DailyModelQuota } from "@/lib/modelQuota";

const providers = ["Tripo AI", "Meshy AI", "Auto select"] as const;
const styles = ["Product render", "Game-ready", "Concept sculpt", "Clean topology"] as const;

export default function CreateModelPage() {
  const { session } = useAuth();
  const [prompt, setPrompt] = useState("A minimalist desk lamp with brushed aluminum and a warm fabric shade");
  const [provider, setProvider] = useState<(typeof providers)[number]>("Auto select");
  const [style, setStyle] = useState<(typeof styles)[number]>("Game-ready");
  const [references, setReferences] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [quota, setQuota] = useState<DailyModelQuota | null>(null);
  const [quotaLoading, setQuotaLoading] = useState(false);
  const [quotaError, setQuotaError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadQuota() {
      if (!session?.user.id) {
        if (active) {
          setQuota(null);
          setQuotaLoading(false);
        }
        return;
      }

      setQuotaLoading(true);
      const result = await fetchDailyModelQuota(session.user.id);

      if (!active) {
        return;
      }

      if (!result.ok) {
        setQuotaError(result.message);
        setQuota(null);
      } else {
        setQuota(result.data);
        setQuotaError(null);
      }

      setQuotaLoading(false);
    }

    void loadQuota();

    return () => {
      active = false;
    };
  }, [session?.user.id]);

  const summary = useMemo(
    () => [
      { label: "Provider", value: provider },
      { label: "Style", value: style },
      { label: "Prompt length", value: `${prompt.trim().length} chars` },
      { label: "References", value: `${references.length} file${references.length === 1 ? "" : "s"}` },
    ],
    [provider, prompt, references.length, style]
  );

  const loadingMessage = loading
    ? provider === "Tripo AI"
      ? "Tripo AI is generating the base model."
      : provider === "Meshy AI"
        ? "Meshy AI is processing the request and returning the final asset."
        : "Routing the prompt and references through Tripo AI, then Meshy AI."
    : "Keep the submit button disabled and show this one-line status while the request is in flight.";

  const quotaBanner = quota
    ? quota.reached
      ? `Daily limit reached. You can generate again after ${new Date(quota.resetAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} UTC.`
      : quota.warning ?? `You can create ${quota.remaining} more model${quota.remaining === 1 ? "" : "s"} today.`
    : quotaError ?? "Daily quota checks will appear here once Supabase is connected.";

  const submitDisabled = loading || quota?.reached || quotaLoading;
  const submitLabel = loading ? "Generating..." : quota?.reached ? "Daily limit reached" : quotaLoading ? "Checking quota..." : "Queue generation";

  function handleReferences(event: ChangeEvent<HTMLInputElement>) {
    const nextFiles = Array.from(event.target.files ?? []).slice(0, 4);
    setReferences(nextFiles);
    setError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!session?.user.id) {
      setError("You need an active session to generate and save models.");
      return;
    }

    if (quota?.reached) {
      setError(`You already used all ${DAILY_MODEL_LIMIT} allowed models for today. The limit resets at midnight UTC.`);
      return;
    }

    const latestQuota = session?.user.id ? await fetchDailyModelQuota(session.user.id) : null;
    if (latestQuota?.ok && latestQuota.data.reached) {
      setQuota(latestQuota.data);
      setError(`You already used all ${DAILY_MODEL_LIMIT} allowed models for today. The limit resets at midnight UTC.`);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setSaveMessage(null);
    setSaveError(null);

    try {
      const formData = new FormData();
      formData.set("prompt", prompt);
      formData.set("provider", provider === "Auto select" ? "auto" : provider === "Tripo AI" ? "tripo" : "meshy");
      formData.set("style", style);
      references.forEach((file) => formData.append("references", file));

      const response = await fetch("/api/generate-model", {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json()) as
        | { ok: true; data: GenerationResult }
        | { ok: false; error: { message: string } };

      if (!response.ok || !payload.ok) {
        throw new Error(payload.ok ? "The generation request failed." : payload.error.message);
      }

      setResult(payload.data);

      const saveResult = await saveGeneratedModel({
        userId: session.user.id,
        prompt,
        style,
        referenceCount: references.length,
        result: payload.data,
      });

      if (!saveResult.ok) {
        if (/daily limit reached/i.test(saveResult.message)) {
          setQuota({
            used: DAILY_MODEL_LIMIT,
            limit: DAILY_MODEL_LIMIT,
            remaining: 0,
            resetAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            reached: true,
            warning: `You reached the daily limit of ${DAILY_MODEL_LIMIT} models.`,
          });
          setError(saveResult.message);
          return;
        }

        setSaveError(`Model generated, but save failed: ${saveResult.message}`);
        return;
      }

      setSaveMessage(`Saved to your library as ${saveResult.data.id}.`);
      const quotaResult = await fetchDailyModelQuota(session.user.id);
      if (quotaResult.ok) {
        setQuota(quotaResult.data);
      }
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Unable to start model generation.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14">
      <div className="space-y-8">
        <div className="max-w-3xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-indigo-100/80">Create Model</p>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">Set a prompt, add references, and generate with precision.</h1>
          <p className="text-base leading-7 text-slate-300">
            This screen prepares the payload that will later be sent to the backend, where Tripo AI and Meshy AI orchestration will happen.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]" aria-busy={loading}>
          <div className="glass-panel space-y-6 rounded-[2rem] p-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white" htmlFor="prompt">
                Prompt
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                rows={7}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-400 focus:shadow-[0_0_0_1px_rgba(99,102,241,0.35),0_0_26px_rgba(99,102,241,0.16)]"
                placeholder="Describe the model, material, and intended usage"
                disabled={loading}
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-white" htmlFor="references">
                Reference uploads
              </label>
              <input
                id="references"
                type="file"
                accept="image/*"
                multiple
                onChange={handleReferences}
                disabled={loading}
                className="block w-full rounded-2xl border border-dashed border-white/12 bg-white/4 px-4 py-4 text-sm text-slate-300 file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-medium file:text-slate-950 hover:file:bg-indigo-100"
              />
              <p className="text-sm leading-6 text-slate-400">Upload up to 4 images for image-to-3D or multi-image generation.</p>
              {references.length > 0 ? (
                <ul className="space-y-2 rounded-2xl border border-white/8 bg-white/4 px-4 py-3 text-sm text-slate-300">
                  {references.map((file) => (
                    <li key={`${file.name}-${file.size}`} className="flex items-center justify-between gap-4">
                      <span className="truncate">{file.name}</span>
                      <span className="shrink-0 text-xs text-slate-500">{Math.max(1, Math.round(file.size / 1024))} KB</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-white">Provider</p>
              <div className="flex flex-wrap gap-3">
                {providers.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setProvider(item)}
                    disabled={loading}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      provider === item
                        ? "border-indigo-400 bg-indigo-400/15 text-white"
                        : "border-white/10 bg-white/4 text-slate-300 hover:bg-white/8"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-white">Output style</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {styles.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setStyle(item)}
                    disabled={loading}
                    className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                      style === item
                        ? "border-white/20 bg-white text-slate-950"
                        : "border-white/10 bg-white/4 text-slate-300 hover:bg-white/8"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitDisabled}
              className="rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 transition duration-200 hover:-translate-y-0.5 hover:bg-indigo-100 hover:shadow-[0_18px_40px_rgba(255,255,255,0.12)] disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {submitLabel}
            </button>
            <p className="text-xs text-slate-500">{loadingMessage}</p>

            <div className="rounded-3xl border border-cyan-400/15 bg-cyan-500/8 p-4 text-sm text-cyan-50/90">
              <p className="font-medium text-white">Daily quota</p>
              <p className="mt-1 leading-6">{quotaBanner}</p>
              <p className="mt-2 text-xs text-cyan-100/70">
                Limit control is based on successful model saves inside a UTC day window, so the counter resets automatically at midnight UTC.
              </p>
            </div>

            {error ? (
              <div className="rounded-3xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-100">
                <p className="font-medium">Generation failed</p>
                <p className="mt-1 leading-6">{error}</p>
              </div>
            ) : null}

            {saveMessage ? (
              <div className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">
                <p className="font-medium">Saved</p>
                <p className="mt-1 leading-6">{saveMessage}</p>
              </div>
            ) : null}

            {saveError ? (
              <div className="rounded-3xl border border-amber-400/20 bg-amber-500/10 p-4 text-sm text-amber-100">
                <p className="font-medium">Storage warning</p>
                <p className="mt-1 leading-6">{saveError}</p>
              </div>
            ) : null}
          </div>

          <div className="space-y-6">
            <div className="glass-panel rounded-[2rem] p-6">
              <h2 className="text-lg font-medium text-white">Request summary</h2>
              <div className="mt-5 space-y-4">
                {summary.map((item) => (
                  <div key={item.label} className="flex items-center justify-between border-b border-white/8 pb-3 text-sm last:border-none last:pb-0">
                    <span className="text-slate-400">{item.label}</span>
                    <span className="text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel rounded-[2rem] p-6">
              <h2 className="text-lg font-medium text-white">Queue state</h2>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                {result
                  ? `${result.providerPath} finished the job and returned a ${result.format} file ready for download.`
                  : loading
                    ? "The request is being processed. The UI stays visible, the submit button is disabled, and the status text updates in place."
                    : "Your submission will create a generation job record, call /api/generate-model, and return a normalized result back to the user."}
              </p>
            </div>

            {result ? (
              <div className="glass-panel rounded-[2rem] p-6">
                <h2 className="text-lg font-medium text-white">Generated result</h2>
                <div className="mt-5 space-y-4 text-sm">
                  <div className="flex items-center justify-between gap-4 border-b border-white/8 pb-3">
                    <span className="text-slate-400">Provider</span>
                    <span className="text-white">{result.providerPath}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 border-b border-white/8 pb-3">
                    <span className="text-slate-400">Task ID</span>
                    <span className="truncate text-white">{result.taskId}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 border-b border-white/8 pb-3">
                    <span className="text-slate-400">Format</span>
                    <span className="text-white">{result.format}</span>
                  </div>
                  <p className="leading-7 text-slate-300">{result.summary}</p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <a className="rounded-full bg-white px-4 py-2 text-xs font-medium text-slate-950 transition hover:bg-indigo-100" href={result.modelUrl} target="_blank" rel="noreferrer">
                      Download model
                    </a>
                    <a className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white transition hover:bg-white/10" href={result.previewUrl} target="_blank" rel="noreferrer">
                      Open preview
                    </a>
                  </div>
                </div>
              </div>
            ) : null}

            {result ? (
              <ModelViewer modelUrl={result.modelUrl} title="Generated model preview" allowUpload={false} />
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
}