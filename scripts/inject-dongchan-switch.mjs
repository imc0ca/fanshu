import { readFileSync, writeFileSync } from "node:fs";

const path = "dist/dongchan/index.html";
const html = readFileSync(path, "utf8");
const marker = "fanshu-perspective-switch";
if (!html.includes("</body>")) throw new Error("Dongchan HTML missing closing body");
if (html.includes(marker)) process.exit(0);

const overlay = `
<style id="fanshu-perspective-switch">
  #fanshu-switch-button{position:fixed;right:14px;bottom:calc(22px + env(safe-area-inset-bottom,0px));z-index:2147483647;display:flex;align-items:center;justify-content:center;gap:5px;padding:11px 15px;border-radius:999px;border:1px solid rgba(255,255,255,.5);background:rgba(20,23,38,.78);color:#fff;font:600 13px -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;text-decoration:none;box-shadow:0 5px 20px rgba(0,0,0,.3);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px)}
  #fanshu-switch-button:focus-visible{outline:3px solid #fff;outline-offset:3px}
</style>
<a id="fanshu-switch-button" href="../?phone=b" aria-label="切换到宋小鱼手机">⇄ 宋小鱼视角</a>
`;
writeFileSync(path, html.replace("</body>", overlay + "\n</body>"), "utf8");
console.log("Injected return-to-Song switch into Dongchan page");
