import { readFileSync, writeFileSync } from "node:fs";

const path = "dist/dongchan/index.html";
let html = readFileSync(path, "utf8");
if (!html.includes("</head>")) throw new Error("Dongchan HTML missing </head>");
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
