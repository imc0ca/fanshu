import { readFileSync, writeFileSync } from "node:fs";

const path = "dist/dongchan/index.html";
const html = readFileSync(path, "utf8");
const marker = "fanshu-dongchan-camera-photo";
if (!html.includes("</body>")) throw new Error("Dongchan HTML missing </body>");
if (html.includes(marker)) process.exit(0);

// Only the downloaded Dongchan page is changed. No source photos are touched.
const injection = `
<style id="fanshu-dongchan-camera-photo">
  #fanshu-camera-photo{position:absolute;inset:0;z-index:2;pointer-events:none;background:#000 url("./camera-photo/photo.jpg") center/cover no-repeat}
</style>
<script id="fanshu-dongchan-camera-photo-script">
(() => {
  const photoUrl = "./camera-photo/photo.jpg";
  const photo = new Image();
  photo.src = photoUrl;
  let available = false;
  photo.onload = () => { available = true; refresh(); };
  // Do not cover the camera with a broken image before the photo is uploaded.
  // The original camera uses a text placeholder, not a video/canvas element.
  // Target that placeholder directly so the existing camera controls remain intact.
  function refresh() {
    if (!available) return;
    const labels = [...document.querySelectorAll("body *")].filter(el =>
      el.children.length === 0 && (el.textContent || "").trim() === "未设置取景画面"
    );
    const old = document.getElementById("fanshu-camera-photo");
    if (!labels.length) { if (old) old.remove(); return; }
    const label = labels.find(el => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    });
    if (!label) return;
    // The preview is the large camera area containing this centered placeholder.
    // Walk up to the first portrait-sized ancestor, rather than searching for
    // nonexistent <video> or <canvas> nodes in this simulated camera app.
    let view = label.parentElement;
    while (view && view !== document.body) {
      const r = view.getBoundingClientRect();
      if (r.width >= 220 && r.height >= 350 && r.height <= window.innerHeight * 0.86) break;
      view = view.parentElement;
    }
    if (!view || view === document.body) return;
    if (getComputedStyle(view).position === "static") view.style.position = "relative";
    let overlay = view.querySelector("#fanshu-camera-photo");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "fanshu-camera-photo";
      overlay.setAttribute("aria-hidden", "true");
      view.appendChild(overlay);
    }
    overlay.style.cssText = 'position:absolute;inset:0;z-index:5;pointer-events:none;background-image:url("' + photoUrl + '");background-position:center;background-size:cover;background-repeat:no-repeat;';
    label.style.visibility = "hidden";
  }
  const observer = new MutationObserver(() => { if (!available) return; requestAnimationFrame(refresh); });
  observer.observe(document.documentElement,{subtree:true,childList:true});
  setInterval(refresh,1200);
})();
<\/script>`;
writeFileSync(path, html.replace("</body>", injection + "\n</body>"));
console.log("Added Dongchan-only camera viewfinder photo support");
