import { readFileSync, writeFileSync } from "node:fs";

const path = "dist/dongchan/index.html";
let html = readFileSync(path, "utf8");
if (!html.includes("</head>")) throw new Error("Dongchan HTML missing </head>");
// Clear older Pages service-worker caches that can mix a previous extracted-media
// Dongchan HTML with the restored inline-image version. Only once per browser.
const recovery = `<script id="fanshu-dongchan-cache-recovery">
(function(){
  var key="fanshu-dongchan-original-images-20261112";
  if(!("serviceWorker" in navigator)||sessionStorage.getItem(key))return;
  sessionStorage.setItem(key,"1");
  navigator.serviceWorker.getRegistrations().then(function(regs){
    return Promise.all(regs.filter(function(r){return r.scope.indexOf("/fanshu/")!==-1}).map(function(r){return r.unregister()}));
  }).then(function(){
    if(!("caches" in window))return;
    return caches.keys().then(function(keys){return Promise.all(keys.filter(function(k){return /workbox|precache|pages-navigation/i.test(k)}).map(function(k){return caches.delete(k)}))});
  }).then(function(){if(navigator.serviceWorker.controller)location.reload()}).catch(function(){});
})();
</script>`;
html = html.replace("</head>", recovery + "\n</head>");
const websiteId = "1bac7e2f-e90e-485a-b3f7-5d9f22a654ad";
if (html.includes('id="fanshu-dongchan-umami"')) process.exit(0);
// Same existing Umami dashboard, with Dongchan visits distinguishable by page URL.
if (html.includes('data-website-id="' + websiteId + '"')) {
  console.log("Dongchan already contains this Umami tracker");
  process.exit(0);
}
const tag = '<script id="fanshu-dongchan-umami" defer src="https://cloud.umami.is/script.js" data-website-id="' + websiteId + '" data-domains="imc0ca.github.io"></script>';
html = html.replace("</head>", tag + "\n</head>");
writeFileSync(path, html, "utf8");
console.log("Enabled Umami visits for /fanshu/dongchan/ using existing dashboard");
