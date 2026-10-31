import { useEffect, useState } from "react";
import { Pause, Play, Repeat, Repeat1, Shuffle, SkipBack, SkipForward } from "lucide-react";
import type { Item } from "./schema";

type Mode = "order" | "repeat-one" | "shuffle";
const player = typeof Audio !== "undefined" ? new Audio() : null;
let activeId = "";
let playing = false;
let playbackError = "";
let mode: Mode = "order";
let list: Item[] = [];
let timer: ReturnType<typeof setTimeout> | undefined;
let fadeTimer: ReturnType<typeof setInterval> | undefined;
const listeners = new Set<() => void>();
function notify() { listeners.forEach(fn => fn()); }
function source(item: Item) {
  const file = item.meta.audioFile;
  if (typeof file !== "string" || !file.startsWith("/") || !/\.m4a$/i.test(file)) return "";
  // Files are in public/ and are published at /fanshu/ on GitHub Pages.
  // Preserve URL-encoded Korean/Chinese names and spaces.
  return `/fanshu${file}`;
}
function clearPending() {
  if (timer) clearTimeout(timer);
  if (fadeTimer) clearInterval(fadeTimer);
  timer = undefined;
  fadeTimer = undefined;
}
function start(item: Item, fade = false) {
  if (!player) return;
  const src = source(item);
  if (!src) { playing = false; playbackError = "这首歌尚未上传音频；已上传的前五首可以播放"; notify(); return; }
  clearPending();
  activeId = item.id;
  playbackError = "";
  player.src = src;
  player.loop = false;
  player.volume = fade ? 0 : 1;
  playing = true;
  notify();
  void player.play().then(() => {
    if (!fade) return;
    let step = 0;
    fadeTimer = setInterval(() => {
      if (!player || player.paused) { clearPending(); return; }
      step++;
      player.volume = Math.min(1, step / 10);
      if (step >= 10 && fadeTimer) { clearInterval(fadeTimer); fadeTimer = undefined; }
    }, 100);
  }).catch(() => { playing = false; playbackError = "音频加载失败，请检查文件是否可以直接打开"; notify(); });
}
function nextIndex() {
  const available = list.filter(i => !!source(i));
  if (!available.length) return null;
  const current = available.findIndex(i => i.id === activeId);
  if (mode === "repeat-one") return available[Math.max(0, current)];
  if (mode === "shuffle" && available.length > 1) {
    const choices = available.filter(i => i.id !== activeId);
    return choices[Math.floor(Math.random() * choices.length)];
  }
  return available[(current + 1) % available.length];
}
function next(delay = false) {
  if (!player) return;
  clearPending();
  const item = nextIndex();
  if (!item) return;
  if (delay) {
    playing = false; notify();
    timer = setTimeout(() => start(item, true), 1000);
  } else start(item);
}
if (player) {
  player.addEventListener("ended", () => next(true));
  player.addEventListener("pause", () => { if (!player.ended) { playing = false; notify(); } });
  player.addEventListener("play", () => { playing = true; playbackError = ""; notify(); });
  player.addEventListener("error", () => { playing = false; playbackError = "音频文件无法加载或格式不兼容"; notify(); });
}
export function PersistentSpotifyPlayer({ items, musicStyle = false }: { items: Item[]; musicStyle?: boolean }) {
  const [, rerender] = useState(0);
  useEffect(() => {
    const fn = () => rerender(v => v + 1);
    listeners.add(fn);
    return () => { listeners.delete(fn); };
  }, []);
  // Keep audio alive in this module even when the Spotify screen unmounts.
  list = items;
  const current = items.find(i => i.id === activeId);
  const toggle = () => {
    if (!player) return;
    clearPending();
    if (!activeId) { const first = items.find(i => !!source(i)); if (first) start(first); }
    else if (player.paused) { void player.play().catch(() => { playing = false; notify(); }); }
    else player.pause();
  };
  return (
    <div className="track-player" style={{display:"flex",alignItems:"center",justifyContent:"flex-start",gap:musicStyle ? 12 : 6,padding:musicStyle ? "14px 16px" : "8px 10px",minHeight:musicStyle ? 82 : undefined,width:"100%",boxSizing:"border-box",...(musicStyle ? {background:"#ffffff",color:"#202020",borderTop:"1px solid #f5dce4",boxShadow:"0 -3px 14px rgba(0,0,0,.06)"} : {})}}>
      <button aria-label={playing ? "暂停" : "播放"} title={playing ? "暂停" : "播放"} onClick={toggle} style={{flexShrink:0,...(musicStyle ? {color:"#f04476",background:"#fff0f5",border:"none",borderRadius:14,minWidth:42,minHeight:42,display:"inline-flex",alignItems:"center",justifyContent:"center"} : {})}}>
        {playing ? <Pause size={20}/> : <Play size={20}/>}
      </button>
      <div style={{flex:"1 1 auto",minWidth:0,display:"flex",flexDirection:"column",alignItems:"flex-start",textAlign:"left"}}>
        <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"100%",fontSize:musicStyle ? 15 : undefined,fontWeight:musicStyle ? 600 : undefined}}>{current ? current.title : "选择歌曲开始播放"}</span>
        {playbackError && <small role="status" style={{color:musicStyle ? "#c3295b" : "#ffb7b7",fontSize:11,lineHeight:1.2}}>{playbackError}</small>}
      </div>
      <button aria-label="上一首" title="上一首" onClick={() => {
        const available = items.filter(i => !!source(i));
        const n = available.findIndex(i => i.id === activeId);
        if (available.length) start(available[(n - 1 + available.length) % available.length]);
      }} style={{flexShrink:0,...(musicStyle ? {color:"#f04476",background:"#fff0f5",border:"none",borderRadius:14,minWidth:42,minHeight:42,display:"inline-flex",alignItems:"center",justifyContent:"center"} : {})}}><SkipBack size={18}/></button>
      <button aria-label="下一首" title="下一首" onClick={() => next()} style={{flexShrink:0,...(musicStyle ? {color:"#f04476",background:"#fff0f5",border:"none",borderRadius:14,minWidth:42,minHeight:42,display:"inline-flex",alignItems:"center",justifyContent:"center"} : {})}}><SkipForward size={18}/></button>
      <button aria-label={mode === "order" ? "顺序播放" : mode === "repeat-one" ? "单曲循环" : "随机播放"} title={mode === "order" ? "顺序播放" : mode === "repeat-one" ? "单曲循环" : "随机播放"} onClick={() => { mode = mode === "order" ? "repeat-one" : mode === "repeat-one" ? "shuffle" : "order"; notify(); }} style={{flexShrink:0,...(musicStyle ? {color:"#f04476",background:"#fff0f5",border:"none",borderRadius:14,minWidth:42,minHeight:42,display:"inline-flex",alignItems:"center",justifyContent:"center"} : {})}}>
        {mode === "repeat-one" ? <Repeat1 size={19}/> : mode === "shuffle" ? <Shuffle size={19}/> : <Repeat size={19}/>}
      </button>
    </div>
  );
}
export function playSpotify(item: Item, items: Item[]) { list = items; start(item); }
