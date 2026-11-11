// Loaded only by Dongchan's standalone phone page.
(() => {
  const asset = new URL("./photo.jpg", document.currentScript.src).href;
  const photograph = new Image();
  let ready = false;
  photograph.onload = () => { ready = true; apply(); };
  photograph.src = asset;
  let scheduled = false;
  function schedule() {
    if (scheduled || !ready) return;
    scheduled = true;
    requestAnimationFrame(() => { scheduled = false; apply(); });
  }
  function apply() {
    if (!ready) return;
    const labels = [...document.querySelectorAll("body *")].filter(el =>
      !el.children.length && (el.textContent || "").trim() === "未设置取景画面"
    );
    for (const label of labels) {
      const lr = label.getBoundingClientRect();
      if (!lr.width || !lr.height) continue;
      let view = label.closest(".camera-view,[class*='camera-view'],[class*='camera-preview']");
      if (!view) {
        // The camera's preview is the first large portrait-shaped ancestor.
        for (let el = label.parentElement, depth = 0; el && depth < 8; el = el.parentElement, depth++) {
          const r = el.getBoundingClientRect();
          if (r.width >= 200 && r.height >= 280 && r.height > r.width * .7) {
            view = el; break;
          }
        }
      }
      if (!view) continue;
      view.style.setProperty("background-image", 'url("' + asset + '")', "important");
      view.style.setProperty("background-position", "center center", "important");
      view.style.setProperty("background-size", "cover", "important");
      view.style.setProperty("background-repeat", "no-repeat", "important");
      label.style.setProperty("visibility", "hidden", "important");
    }
  }
  const observer = new MutationObserver(schedule);
  observer.observe(document.documentElement, {childList:true, subtree:true});
  window.addEventListener("pageshow", schedule);
  document.addEventListener("click", () => setTimeout(schedule, 60), true);
  setInterval(schedule, 1800);
})();
