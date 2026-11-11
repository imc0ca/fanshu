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
    const placeholders = [...document.querySelectorAll("body *")].filter(el =>
      el.children.length === 0 && /未设置取景画面/.test((el.textContent || "").trim())
    );
    for (const label of placeholders) {
      let view = label;
      for (let i = 0; i < 6 && view.parentElement; i++) {
        const r = view.getBoundingClientRect();
        if (r.width >= 220 && r.height >= 300) break;
        view = view.parentElement;
      }
      const rect = view.getBoundingClientRect();
      if (rect.width < 220 || rect.height < 300) continue;
      if (view.dataset.fanshuCameraPhoto === "1") continue;
      view.dataset.fanshuCameraPhoto = "1";
      view.style.backgroundImage = 'url("' + photoUrl + '")';
      view.style.backgroundPosition = "center center";
      view.style.backgroundSize = "cover";
      view.style.backgroundRepeat = "no-repeat";
      label.style.visibility = "hidden";
    }
  }
  const observer = new MutationObserver(() => { if (!available) return; requestAnimationFrame(refresh); });
  observer.observe(document.documentElement,{subtree:true,childList:true});
  setInterval(refresh,1200);
})();
<\/script>`;
writeFileSync(path, html.replace("</body>", injection + "\n</body>"));
console.log("Added Dongchan-only camera viewfinder photo support");
