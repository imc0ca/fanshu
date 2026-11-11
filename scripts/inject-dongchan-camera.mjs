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
  const cameraWords = /^(相机|camera)$/i;
  const cameraMode = /^(照片|拍照|photo|video|视频|人像|portrait|全景|panorama|慢动作|slo-mo)$/i;
  let recentlyOpenedCamera = false;
  let lastCameraClick = 0;
  document.addEventListener("click", e => {
    const target = e.target.closest("button,[role=button],a,[data-app-id],.app-icon");
    if (!target) return;
    const label = [target.getAttribute("aria-label"),target.getAttribute("title"),target.getAttribute("data-app-id"),target.textContent].filter(Boolean).join(" ").trim();
    if (/(^|\\s)(camera|相机)(\\s|$)/i.test(label) && label.length < 100) {
      recentlyOpenedCamera = true;
      lastCameraClick = Date.now();
      setTimeout(refresh, 100);
      setTimeout(refresh, 500);
    }
  }, true);
  function refresh() {
    if (!available) return;
    const nodes = [...document.querySelectorAll("body *")].filter(el => el.children.length === 0 && cameraWords.test((el.textContent||"").trim()));
    const modeNodes = [...document.querySelectorAll("body *")].filter(el => el.children.length === 0 && cameraMode.test((el.textContent||"").trim()));
    const active = (recentlyOpenedCamera && Date.now() - lastCameraClick < 120000) || (nodes.length && modeNodes.length);
    const old = document.getElementById("fanshu-camera-photo");
    if (!active) { if(old) old.remove(); return; }
    const root = modeNodes.find(el => el.getBoundingClientRect().width > 0)?.closest("section,[class*=camera],[class*=Camera],[class*=app],[class*=App]") ||
      nodes.find(el => el.getBoundingClientRect().width > 0)?.closest("section,[class*=camera],[class*=Camera],[class*=app],[class*=App]");
    if (!root) return;
    const candidates = [...root.querySelectorAll("video,canvas,[class*=viewfinder],[class*=preview],[class*=Preview]")];
    const view = candidates.find(el => { const r=el.getBoundingClientRect(); return r.width>150 && r.height>180; });
    if (!view) return;
    const host = view.parentElement;
    if (!host) return;
    if (getComputedStyle(host).position === "static") host.style.position = "relative";
    if (!host.querySelector("#fanshu-camera-photo")) {
      const el = document.createElement("div"); el.id = "fanshu-camera-photo"; host.append(el);
    }
  }
  const observer = new MutationObserver(() => { if (!available) return; requestAnimationFrame(refresh); });
  observer.observe(document.documentElement,{subtree:true,childList:true});
  setInterval(refresh,1200);
})();
<\/script>`;
writeFileSync(path, html.replace("</body>", injection + "\n</body>"));
console.log("Added Dongchan-only camera viewfinder photo support");
