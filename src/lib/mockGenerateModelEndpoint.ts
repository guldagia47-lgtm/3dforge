import { generateModel, type GenerationRequest } from "@/lib/generation";

type ExtendedFetch = typeof fetch & { __modelforgeMockInstalled?: boolean };

function errorStatus(code: string) {
  switch (code) {
    case "MISSING_INPUT":
    case "INVALID_REFERENCE":
      return 400;
    default:
      return 500;
  }
}

async function parseGenerationRequest(request: Request): Promise<GenerationRequest> {
  const formData = await request.formData();
  const prompt = String(formData.get("prompt") ?? "");
  const provider = String(formData.get("provider") ?? "auto") as GenerationRequest["provider"];
  const style = String(formData.get("style") ?? "Product render");

  const references = formData
    .getAll("references")
    .filter((entry): entry is File => entry instanceof File)
    .map((file) => ({
      name: file.name,
      type: file.type || "image/*",
      size: file.size,
    }));

  return { prompt, provider, style, references };
}

export function installMockGenerateModelEndpoint() {
  if (typeof window === "undefined") {
    return;
  }

  const currentFetch = window.fetch as ExtendedFetch;

  if (currentFetch.__modelforgeMockInstalled) {
    return;
  }

  const originalFetch = window.fetch.bind(window);

  const patchedFetch: ExtendedFetch = async (input, init) => {
    const request = input instanceof Request ? input : new Request(input, init);
    const url = new URL(request.url, window.location.origin);

    if (url.pathname !== "/api/generate-model") {
      return originalFetch(input, init);
    }

    const generationRequest = await parseGenerationRequest(request);
    const result = await generateModel(generationRequest);

    return new Response(JSON.stringify(result), {
      status: result.ok ? 200 : errorStatus(result.error.code),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  patchedFetch.__modelforgeMockInstalled = true;
  window.fetch = patchedFetch;
}
