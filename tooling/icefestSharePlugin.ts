import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Plugin } from "vite";
import { icefestShare } from "../src/lib/icefestShare";

const escape = (value: string) => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Produce a real HTML head, not a JavaScript-only update, for social crawlers. */
export function icefestShareHtml(html: string): string {
  const cleaned = html
    .replace(/<title\b[^>]*>[\s\S]*?<\/title>/gi, "")
    .replace(/<meta\b(?=[^>]*(?:name|property)\s*=\s*["'](?:description|og:[^"']+|twitter:[^"']+)["'])[^>]*>/gi, "")
    .replace(/<link\b(?=[^>]*rel\s*=\s*["']canonical["'])[^>]*>/gi, "");
  const meta = (attr: "name" | "property", key: string, value: string) =>
    `<meta ${attr}="${key}" content="${escape(value)}" data-rh="true" />`;
  const tags = [
    `<title data-rh="true">${escape(icefestShare.title)}</title>`,
    `<link rel="canonical" href="${icefestShare.url}" data-rh="true" />`,
    meta("name", "description", icefestShare.description),
    ...Object.entries({ title: icefestShare.title, description: icefestShare.description, url: icefestShare.url, type: "website", locale: "es_CL", image: icefestShare.image, "image:secure_url": icefestShare.image, "image:type": "image/jpeg", "image:width": "1200", "image:height": "630", "image:alt": icefestShare.imageAlt }).map(([key, value]) => meta("property", `og:${key}`, value)),
    ...Object.entries({ card: "summary_large_image", title: icefestShare.title, description: icefestShare.description, image: icefestShare.image, "image:alt": icefestShare.imageAlt }).map(([key, value]) => meta("name", `twitter:${key}`, value)),
  ];
  return cleaned.replace(/<\/head>/i, `${tags.join("\n")}\n</head>`);
}

export function icefestSharePlugin(): Plugin {
  return {
    name: "icefest-static-share-head",
    enforce: "post",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const pathname = (req.url || "").split("?")[0].replace(/\/+$/, "");
        if (pathname !== "/icefest-santiago" && pathname !== "/icefest-santiago/index.html") return next();
        try {
          const template = await readFile(path.join(server.config.root, "index.html"), "utf8");
          const html = await server.transformIndexHtml("/icefest-santiago", icefestShareHtml(template));
          res.statusCode = 200;
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          res.end(html);
        } catch (error) {
          next(error);
        }
      });
    },
    generateBundle(_options, bundle) {
      const index = bundle["index.html"];
      if (!index || index.type !== "asset" || typeof index.source !== "string") {
        this.error("Missing built index.html for Icefest share metadata");
        return;
      }
      this.emitFile({ type: "asset", fileName: "icefest-santiago/index.html", source: icefestShareHtml(index.source) });
    },
  };
}