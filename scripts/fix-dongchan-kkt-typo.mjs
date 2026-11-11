import { readFileSync, writeFileSync } from "node:fs";

const file = "dist/dongchan/index.html";
const html = readFileSync(file, "utf8");
const from = "聊聊我我";
const to = "卿卿我我";
const occurrences = html.split(from).length - 1;
// This is intentionally limited to exactly the two requested KKT occurrences.
// Abort deployment rather than silently changing other content.
if (occurrences !== 2) {
  throw new Error(`Expected exactly 2 Dongchan KKT typo occurrences, found ${occurrences}; no file changed`);
}
const changed = html.replaceAll(from, to);
if (changed.length !== html.length || changed.split(to).length - html.split(to).length !== 2) {
  throw new Error("Unexpected replacement result; no file changed");
}
writeFileSync(file, changed, "utf8");
console.log("Corrected exactly two KKT text occurrences; no image references modified.");
