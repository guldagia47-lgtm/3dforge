const DESC_ID = "modelforge-meta-description";
const KW_ID = "modelforge-meta-keywords";

function ensureMeta(id: string, attr: "name" | "property", name: string) {
  if (typeof document === "undefined") {
    return null;
  }

  let el = document.querySelector<HTMLMetaElement>(`meta#${id}`);

  if (!el) {
    el = document.createElement("meta");
    el.id = id;
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }

  return el;
}

export function setPageSeo(input: { title: string; description: string; keywords?: string; path?: string }) {
  if (typeof document === "undefined") {
    return;
  }

  document.title = input.title;

  const desc = ensureMeta(DESC_ID, "name", "description");
  if (desc) {
    desc.content = input.description;
  }

  if (input.keywords) {
    const kw = ensureMeta(KW_ID, "name", "keywords");
    if (kw) {
      kw.content = input.keywords;
    }
  } else {
    document.getElementById(KW_ID)?.remove();
  }

  let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }

  if (input.path !== undefined) {
    const base = window.location.origin;
    canonical.href = `${base}${input.path.startsWith("/") ? input.path : `/${input.path}`}`;
  }
}
