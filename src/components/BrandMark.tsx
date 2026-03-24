import { cn } from "@/utils/cn";

type BrandMarkProps = {
  className?: string;
  compact?: boolean;
};

export default function BrandMark({ className, compact = false }: BrandMarkProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.14),rgba(99,102,241,0.18))] shadow-[0_20px_60px_rgba(15,23,42,0.35)] backdrop-blur neon-ring">
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-cyan-100" fill="none" stroke="currentColor" strokeWidth={1.9}>
          <path d="M7 6.5 12 4l5 2.5v6L12 15l-5-2.5z" />
          <path d="M7 6.5 12 9l5-2.5" />
          <path d="M12 9v6" />
          <path d="M7 12.5 12 15l5-2.5" />
        </svg>
      </div>
      {!compact ? (
        <div>
          <p className="text-sm font-semibold tracking-[0.28em] text-indigo-100 uppercase">ModelForge</p>
          <p className="text-xs text-slate-400">Visual-to-3D generation platform</p>
        </div>
      ) : (
        <div>
          <p className="text-sm font-semibold tracking-[0.24em] text-indigo-100 uppercase">ModelForge</p>
        </div>
      )}
    </div>
  );
}