import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

const source = "dist/dongchan/index.html";
const original = readFileSync(source, "utf8");
const base = "dist/dongchan-preview";
const media = join(base, "media");
mkdirSync(media, {recursive:true});
copyFileSync(source, join(base, "original.html"));
const matches = [...original.matchAll(/data:image\\/(jpeg|jpg|png|gif|webp|avif);base64,([A-Za-z0-9+/=]{2800,})/gi)];
const manifest = [];
const extensions = {jpeg:"jpg",jpg:"jpg",png:"png",gif:"gif",webp:"webp",avif:"avif"};
let output = original;
for (const m of matches) {
  const bytes = Buffer.from(m[2], "base64");
  const hash = createHash("sha256").update(bytes).digest("hex");
  const filename = hash.slice(0,32)+"."+extensions[m[1].toLowerCase()];
  const dest = join(media,filename);
  if (!existsSync(dest)) writeFileSync(dest,bytes);
  if (createHash("sha256").update(readFileSync(dest)).digest("hex") !== hash) throw Error("Image checksum mismatch: "+filename);
  const url = "/fanshu/dongchan-preview/media/"+filename;
  output = output.split(m[0]).join(url);
  manifest.push({filename,sha256:hash,bytes:bytes.length});
}
if (matches.length === 0 || output.length >= original.length) throw Error("Preview optimization not useful; original remains untouched");
if (output.includes("data:image/") && output.length > original.length * .8) console.warn("Some embedded images remain");
writeFileSync(join(base,"index.html"),output);
writeFileSync(join(base,"manifest.json"),JSON.stringify({originalBytes:Buffer.byteLength(original),previewBytes:Buffer.byteLength(output),references:matches.length,images:manifest},null,2));
console.log("Preview prepared; production untouched",matches.length,Buffer.byteLength(original),Buffer.byteLength(output));
