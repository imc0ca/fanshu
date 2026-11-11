import { readFileSync, writeFileSync, existsSync } from "node:fs";

const path = "dist/dongchan/index.html";
const photoPath = "dist/dongchan/camera-photo/photo.jpg";
if (!existsSync(photoPath)) throw new Error("Dongchan camera photo missing: " + photoPath);
let html = readFileSync(path, "utf8");
if (!html.includes("</body>")) throw new Error("Dongchan HTML missing closing body");

const marker = "fanshu-dongchan-camera-photo";
if (html.includes(marker)) {
  console.log("Dongchan camera photo already injected");
  process.exit(0);
}

// The source camera component is .native-camera .camera-view.
// Mount the author's uploaded photograph via CSS directly in that view.
// The overlay grid and the original camera controls remain available.
const injection = `
<style id="fanshu-dongchan-camera-photo">
.native-camera .camera-view {
  background-image: url("./camera-photo/photo.jpg") !important;
  background-size: cover !important;
  background-position: center center !important;
  background-repeat: no-repeat !important;
}
.native-camera .camera-view > p {
  display: none !important;
}
.native-camera .camera-view > .camera-grid {
  z-index: 2;
}
</style>
`;
html = html.replace("</head>", injection + "\n</head>");
writeFileSync(path, html, "utf8");
console.log("Installed Dongchan camera photo in .native-camera .camera-view");
