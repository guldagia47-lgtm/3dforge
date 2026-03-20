import type { GenerationResult } from "@/lib/generation";
import { DAILY_MODEL_LIMIT, fetchDailyModelQuota } from "@/lib/modelQuota";
import { supabase, supabaseSetupMessage } from "@/lib/supabase";

export type SavedModel = {
  id: string;
  userId: string;
  prompt: string;
  style: string;
  providerPath: GenerationResult["providerPath"];
  sourceMode: GenerationResult["sourceMode"];
  taskId: string;
  modelUrl: string;
  previewUrl: string;
  thumbnailUrl: string;
  format: GenerationResult["format"];
  summary: string;
  responseSource: GenerationResult["responseSource"];
  status: "completed" | "processing" | "failed";
  referenceCount: number;
  createdAt: string;
  updatedAt: string;
};

export type SaveModelInput = {
  userId: string;
  prompt: string;
  style: string;
  referenceCount: number;
  result: GenerationResult;
};

type ModelRow = {
  id: string;
  user_id: string;
  prompt: string;
  style: string;
  provider_path: GenerationResult["providerPath"];
  source_mode: GenerationResult["sourceMode"];
  task_id: string;
  model_url: string;
  preview_url: string;
  thumbnail_url: string;
  format: GenerationResult["format"];
  summary: string;
  response_source: GenerationResult["responseSource"];
  status: SavedModel["status"];
  reference_count: number;
  created_at: string;
  updated_at: string;
};

function mapModel(row: ModelRow): SavedModel {
  return {
    id: row.id,
    userId: row.user_id,
    prompt: row.prompt,
    style: row.style,
    providerPath: row.provider_path,
    sourceMode: row.source_mode,
    taskId: row.task_id,
    modelUrl: row.model_url,
    previewUrl: row.preview_url,
    thumbnailUrl: row.thumbnail_url,
    format: row.format,
    summary: row.summary,
    responseSource: row.response_source,
    status: row.status,
    referenceCount: row.reference_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function saveGeneratedModel(input: SaveModelInput) {
  if (!supabase) {
    return { ok: false as const, message: supabaseSetupMessage };
  }

  const quotaResult = await fetchDailyModelQuota(input.userId);
  if (!quotaResult.ok) {
    return { ok: false as const, message: quotaResult.message };
  }

  if (quotaResult.data.reached) {
    return {
      ok: false as const,
      message: `Daily limit reached. You can save up to ${DAILY_MODEL_LIMIT} models per day.`,
    };
  }

  const { data, error } = await supabase
    .from("models")
    .insert({
      user_id: input.userId,
      prompt: input.prompt.trim(),
      style: input.style,
      provider_path: input.result.providerPath,
      source_mode: input.result.sourceMode,
      task_id: input.result.taskId,
      model_url: input.result.modelUrl,
      preview_url: input.result.previewUrl,
      thumbnail_url: input.result.thumbnailUrl,
      format: input.result.format,
      summary: input.result.summary,
      response_source: input.result.responseSource,
      status: input.result.status,
      reference_count: input.referenceCount,
    })
    .select("*")
    .single();

  if (error) {
    return { ok: false as const, message: error.message };
  }

  return { ok: true as const, data: mapModel(data as ModelRow) };
}

export async function fetchSavedModels(userId: string) {
  if (!supabase) {
    return { ok: false as const, message: supabaseSetupMessage };
  }

  const { data, error } = await supabase
    .from("models")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return { ok: false as const, message: error.message };
  }

  return { ok: true as const, data: (data as ModelRow[]).map(mapModel) };
}

export async function deleteSavedModel(modelId: string, userId: string) {
  if (!supabase) {
    return { ok: false as const, message: supabaseSetupMessage };
  }

  const { error } = await supabase.from("models").delete().eq("id", modelId).eq("user_id", userId);

  if (error) {
    return { ok: false as const, message: error.message };
  }

  return { ok: true as const };
}