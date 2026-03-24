export type GenerationProviderChoice = "auto" | "tripo" | "meshy";

export type GenerationInputMode = "prompt" | "image" | "multi-image";

export type GenerationReferenceFile = {
  name: string;
  type: string;
  size: number;
};

export type GenerationRequest = {
  prompt: string;
  provider: GenerationProviderChoice;
  style: string;
  references: GenerationReferenceFile[];
};

export type GenerationSuccess = {
  ok: true;
  data: {
    taskId: string;
    providerPath: "Tripo AI" | "Meshy AI" | "Tripo AI + Meshy AI";
    sourceMode: GenerationInputMode;
    status: "completed";
    modelUrl: string;
    previewUrl: string;
    thumbnailUrl: string;
    summary: string;
    format: "GLB";
    responseSource: "tripo" | "meshy" | "hybrid";
  };
};

export type GenerationFailure = {
  ok: false;
  error: {
    code: string;
    message: string;
    retryable: boolean;
  };
};

export type GenerationResult = GenerationSuccess["data"];
export type GenerationResponse = GenerationSuccess | GenerationFailure;

function randomId(prefix: string) {
  const base = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  return `${prefix}_${base.replace(/-/g, "").slice(0, 16)}`;
}

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function detectMode(references: GenerationReferenceFile[]): GenerationInputMode {
  if (references.length === 0) {
    return "prompt";
  }

  if (references.length === 1) {
    return "image";
  }

  return "multi-image";
}

function fileValidationError(message: string): GenerationFailure {
  return {
    ok: false,
    error: {
      code: "INVALID_REFERENCE",
      message,
      retryable: false,
    },
  };
}

function validateRequest(request: GenerationRequest): GenerationFailure | null {
  const prompt = request.prompt.trim();

  if (!prompt && request.references.length === 0) {
    return {
      ok: false,
      error: {
        code: "MISSING_INPUT",
        message: "Add a prompt, an image, or both before generating a model.",
        retryable: false,
      },
    };
  }

  if (request.references.length > 4) {
    return fileValidationError("Meshy multi-image generation supports up to 4 reference images.");
  }

  const invalidReference = request.references.find((file) => !file.type.startsWith("image/"));

  if (invalidReference) {
    return fileValidationError(`${invalidReference.name} is not an image file.`);
  }

  return null;
}

function buildPreviewUrl(taskId: string, mode: GenerationInputMode) {
  return `https://assets.modelforge.local/preview/${taskId}-${mode}.png`;
}

function buildModelUrl(taskId: string) {
  return `https://assets.modelforge.local/models/${taskId}.glb`;
}

function buildThumbnailUrl(taskId: string) {
  return `https://assets.modelforge.local/thumbnails/${taskId}.png`;
}

async function runTripoPipeline(request: GenerationRequest): Promise<GenerationSuccess["data"]> {
  const taskId = randomId("tripo");
  const mode = detectMode(request.references);

  await sleep(mode === "prompt" ? 700 : 900);

  return {
    taskId,
    providerPath: "Tripo AI",
    sourceMode: mode,
    status: "completed",
    modelUrl: buildModelUrl(taskId),
    previewUrl: buildPreviewUrl(taskId, mode),
    thumbnailUrl: buildThumbnailUrl(taskId),
    summary:
      mode === "prompt"
        ? `Tripo AI generated a prompt-based 3D concept for "${request.prompt.trim()}".`
        : `Tripo AI generated a 3D model from ${request.references.length} reference image${request.references.length > 1 ? "s" : ""}.`,
    format: "GLB",
    responseSource: "tripo",
  };
}

async function runMeshyPipeline(request: GenerationRequest): Promise<GenerationSuccess["data"]> {
  const taskId = randomId("meshy");
  const mode = detectMode(request.references);

  await sleep(mode === "prompt" ? 900 : 1100);

  return {
    taskId,
    providerPath: "Meshy AI",
    sourceMode: mode,
    status: "completed",
    modelUrl: buildModelUrl(taskId),
    previewUrl: buildPreviewUrl(taskId, mode),
    thumbnailUrl: buildThumbnailUrl(taskId),
    summary:
      mode === "prompt"
        ? `Meshy AI created a mesh from the prompt "${request.prompt.trim()}".`
        : `Meshy AI converted ${request.references.length} reference image${request.references.length > 1 ? "s" : ""} into a textured 3D asset.`,
    format: "GLB",
    responseSource: "meshy",
  };
}

async function runHybridPipeline(request: GenerationRequest): Promise<GenerationSuccess["data"]> {
  const tripoStage = await runTripoPipeline(request);
  await sleep(450);
  const taskId = randomId("hybrid");

  return {
    taskId,
    providerPath: "Tripo AI + Meshy AI",
    sourceMode: detectMode(request.references),
    status: "completed",
    modelUrl: buildModelUrl(taskId),
    previewUrl: tripoStage.previewUrl,
    thumbnailUrl: tripoStage.thumbnailUrl,
    summary: `Tripo AI created the base model and Meshy AI refined the output into a final GLB asset for "${request.prompt.trim()}".`,
    format: "GLB",
    responseSource: "hybrid",
  };
}

export async function generateModel(request: GenerationRequest): Promise<GenerationResponse> {
  const validationError = validateRequest(request);

  if (validationError) {
    return validationError;
  }

  const hasPrompt = Boolean(request.prompt.trim());
  const hasReferences = request.references.length > 0;

  try {
    if (request.provider === "tripo") {
      return { ok: true, data: await runTripoPipeline(request) };
    }

    if (request.provider === "meshy") {
      return { ok: true, data: await runMeshyPipeline(request) };
    }

    if (hasPrompt && hasReferences) {
      return { ok: true, data: await runHybridPipeline(request) };
    }

    if (hasReferences) {
      return { ok: true, data: await runMeshyPipeline(request) };
    }

    return { ok: true, data: await runTripoPipeline(request) };
  } catch (error) {
    return {
      ok: false,
      error: {
        code: "GENERATION_FAILED",
        message: error instanceof Error ? error.message : "The generation request could not be completed.",
        retryable: true,
      },
    };
  }
}
