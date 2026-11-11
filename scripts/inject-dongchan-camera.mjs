import { readFileSync, writeFileSync, existsSync } from "node:fs";

const path = "dist/dongchan/index.html";
const folder = "dist/dongchan/camera-photo";
for (const name of ["photo.jpg", "camera-view.css", "camera-view.js"]) {
  if (!existsSync(folder + "/" + name)) throw new Error("Missing Dongchan camera asset: " + name);
}
let html = readFileSync(path, "utf8");
if (!html.includes("</head>") || !html.includes("</body>")) throw new Error("Dongchan HTML missing head or body");
if (html.includes("fanshu-dongchan-camera-photo")) process.exit(0);

// Keep the original camera UI. Load the photo and fallback matching logic from
// the user's own public/dongchan-camera directory.
html = html.replace("</head>", '<link id="fanshu-dongchan-camera-photo" rel="stylesheet" href="./camera-photo/camera-view.css">\n</head>');
html = html.replace("</body>", '<script defer src="./camera-photo/camera-view.js"></script>\n</body>');
writeFileSync(path, html, "utf8");
console.log("Dongchan camera uses public/dongchan-camera assets");
