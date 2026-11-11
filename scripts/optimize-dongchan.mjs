import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

// Only process the downloaded Dongchan copy; never change either source repository.
const htmlPath = "dist/dongchan/index.html";
const mediaDir = "dist/dongchan/media";
const html = readFileSync(htmlPath, "utf8");
mkdirSync(mediaDir, { recursive: true });
const types = { jpeg:"jpg", jpg:"jpg", png:"png", gif:"gif", webp:"webp", avif:"avif", "svg+xml":"svg" };
let count = 0;
const paths = new Set();
const optimized = html.replace(/data:image\/(jpeg|jpg|png|gif|webp|avif|svg\+xml);base64,([A-Za-z0-9+/=]{2800,})/gi, (match, type, encoded) => {
  const bytes = Buffer.from(encoded, "base64");
  if (bytes.length < 2048) return match;
  const ext = types[type.toLowerCase()];
  const name = createHash("sha256").update(bytes).digest("hex").slice(0, 24) + "." + ext;
  const path = join(mediaDir, name);
  if (!existsSync(path)) writeFileSync(path, bytes);
  paths.add(path);
  count++;
  return "/fanshu/dongchan/media/" + name;
});
for (const path of paths) {
  if (!existsSync(path)) throw new Error("Missing extracted Dongchan photo: " + path);
}
if (count < 1 || optimized.length >= html.length) {
  throw new Error("Image optimization did not reduce Dongchan HTML; refusing to replace original");
}
writeFileSync(htmlPath, optimized);
console.log(JSON.stringify({ originalBytes:Buffer.byteLength(html), optimizedBytes:Buffer.byteLength(optimized), references:count, uniquePhotos:paths.size }));
