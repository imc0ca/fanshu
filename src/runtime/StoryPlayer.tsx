import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Phone } from "../Phone";
import { validateWork, type Work } from "../schema";
import "../styles.css";
import "./player.css";

const callScenes = [
  { image: "10899.jpeg", captions: [] as string[] },
  { image: "10900.jpeg", captions: ["灿荣就在我旁边", "让他和你打个招呼呀"] },
  { image: "10901.jpeg", captions: ["银硕哥你好～", "经常听成灿哥提起你"] },
  { image: "10902.jpeg", captions: ["炤熙也在", "我让他也过来"] },
  { image: "10903.jpeg", captions: ["这是在干嘛，好诡异的聊天…"] },
  { image: "10904.jpeg", captions: ["真的有点困了", "那我先挂了"] },
];
const callTimeline = callScenes.flatMap((scene, index) =>
  scene.captions.length ? scene.captions.map((caption) => ({ image: scene.image, caption })) :
  [{ image: scene.image, caption: "" }]
);
function VideoCallExperience() {
  const [phase, setPhase] = useState<"idle" | "ringing" | "connected" | "ended">("idle");
  const [seconds, setSeconds] = useState(0);
  const fired = React.useRef(false);
  const phaseRef = React.useRef(phase);
  phaseRef.current = phase;
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const observer = new IntersectionObserver((entries) => {
      if (fired.current || phaseRef.current !== "idle") return;
      if (entries.some((entry) => entry.isIntersecting)) {
        fired.current = true;
        timer = setTimeout(() => setPhase("ringing"), 2000);
      }
    }, { threshold: 0.65 });
    const search = () => {
      const nodes = Array.from(document.querySelectorAll("button, div, span"));
      const bubble = nodes.find((el) => el.textContent?.trim() === "📞 Video Call" && el.children.length === 0);
      if (bubble) observer.observe(bubble);
    };
    const mutations = new MutationObserver(search);
    mutations.observe(document.body, { childList: true, subtree: true });
    search();
    return () => { mutations.disconnect(); observer.disconnect(); clearTimeout(timer); };
  }, []);
  useEffect(() => {
    if (phase !== "connected") return;
    const started = Date.now();
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - started) / 1000);
      setSeconds(elapsed);
      if (elapsed >= callTimeline.length * 2) {
        setPhase("ended");
        try {
          const context = new AudioContext();
          const oscillator = context.createOscillator();
          const gain = context.createGain();
          oscillator.frequency.value = 440;
          gain.gain.value = 0.09;
          oscillator.connect(gain).connect(context.destination);
          oscillator.start(); oscillator.stop(context.currentTime + 0.25);
          oscillator.onended = () => { void context.close(); };
        } catch { /* audio may be blocked */ }
      }
    }, 150);
    return () => clearInterval(interval);
  }, [phase]);
  useEffect(() => {
    if (phase !== "ended") return;
    const timeout = setTimeout(() => setPhase("idle"), 1500);
    return () => clearTimeout(timeout);
  }, [phase]);
  if (phase === "idle") return null;
  const scene = callTimeline[Math.min(Math.floor(seconds / 2), callTimeline.length - 1)];
  const asset = (name: string) => "./video-call-20240321/" + name;
  return (
    <div className="story-video-call" role="dialog" aria-label="咚灿视频通话">
      {phase === "ringing" ? (
        <div className="story-video-incoming">
          <img src="./kkt-avatars/dongchan-2024.png" alt="咚灿头像" />
          <h2>咚灿</h2><p>视频通话邀请…</p>
          <button onClick={() => { setSeconds(0); setPhase("connected"); }} className="story-video-accept">▣<span>接听</span></button>
        </div>
      ) : phase === "ended" ? (
        <div className="story-video-ended">通话结束</div>
      ) : (
        <div className="story-video-connected">
          <img className="story-video-main" src={asset(scene.image)} alt="视频通话画面" />
          <div className="story-video-header"><strong>咚灿</strong><span>{String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}</span></div>
          <img className="story-video-self" src={asset("b813ec9132da2e69c492ec81a3885887.jpeg")} alt="宋小鱼的视频小窗" />
          {scene.caption && <div className="story-video-subtitle" key={seconds >> 1}>{scene.caption}</div>}
          <div className="story-video-controls"><span>♩<small>静音</small></span><span>▣<small>摄像头</small></span><span>◉<small>扬声器</small></span></div>
        </div>
      )}
    </div>
  );
}

function StoryPlayer() {
  const [work, setWork] = useState<Work | null>(null),
    [error, setError] = useState("");
  useEffect(() => {
    const abort = new AbortController();
    fetch(
      new URLSearchParams(location.search).get("preview") === "test"
        ? "./test-work.json"
        : new URLSearchParams(location.search).get("template") === "blank"
          ? "./blank-work.json"
          : "./work.json",
      { signal: abort.signal },
    )
      .then((r) => {
        if (!r.ok) throw Error("缺少作品文件，请运行 npm run story:build");
        return r.json();
      })
      .then((x) => {
        const w = validateWork(x);
        document.title =
          w.title === "捡手机" ? "捡手机" : w.title + " · 捡手机";
        setWork(w);
      })
      .catch((e) => {
        if (e.name !== "AbortError") setError(String(e));
      });
    return () => abort.abort();
  }, []);
  return (
    <main className="story-runtime">
      {work ? (
        <><Phone work={work} /><VideoCallExperience /></>
      ) : (
        <p role="status">{error || "正在打开手机…"}</p>
      )}
    </main>
  );
}
createRoot(document.getElementById("root")!).render(<StoryPlayer />);
