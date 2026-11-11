import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

// Run only on the downloaded Dongchan copy, never on Song Xiaoyu's source.
const htmlPath = "dist/dongchan/index.html";
const dir = "dist/dongchan/media";
let html = readFileSync(htmlPath, "utf8");
const before = Buffer.byteLength(html);
mkdirSync(dir, { recursive: true });
let count = 0, saved = 0;
const types = { jpeg:"jpg", jpg:"jpg", png:"png", gif:"gif", webp:"webp", avif:"avif", svg+xml:"svg" };
// Extract embedded images to independently cacheable resources.
// Keep the exact image bytes, so no photo or story content is altered.
html = html.replace(/data:image\/(jpeg|jpg|png|gif|webp|avif|svg\+xml);base64,([A-Za-z0-9+/=]{2800,})/gi, (match, type, encoded) => {
  const bytes = Buffer.from(encoded, "base64");
  if (bytes.length < 2048) return match;
  const ext = types[type.toLowerCase()];
  const name = createHash("sha256").update(bytes).digest("hex").slice(0, 24) + "." + ext;
  const filename = join(dir, name);
  try { writeFileSync(filename, bytes, { flag:"wx" }); saved++; } catch (e) { if (e.code !== "EEXIST") throw e; }
  count++;
  return "media/" + name;
});
writeFileSync(htmlPath, html);
console.log(JSON.stringify({ beforeBytes:before, afterBytes:Buffer.byteLength(html), imagesReplaced:count, uniqueImages:saved, reductionPercent:Math.round((1-Buffer.byteLength(html)/before)*100) }));
