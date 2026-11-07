import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { createPortal } from "react-dom";
import { Phone as CallIcon, VideoOff, MicOff, Volume2, PhoneOff } from "lucide-react";
import { Phone as PhoneApp } from "../Phone";
import { makeItem, validateWork, type Work } from "../schema";
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
const callTimeline = callScenes.flatMap((scene) =>
  scene.captions.length ? scene.captions.map((caption) => ({ image: scene.image, caption })) :
  [{ image: scene.image, caption: "" }]
);
function VideoCallExperience() {
  const [phase, setPhase] = useState<"idle" | "ringing" | "connected">("idle");
  const [seconds, setSeconds] = useState(0);
  const fired = React.useRef(false);
  const ringtone = React.useRef<AudioContext | null>(null);
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
      const header = document.querySelector(".mymy-kakao .kzname");
      if (header?.textContent?.trim() !== "咚灿") return;
      const target = Array.from(document.querySelectorAll('.mymy-kakao .kkt-dated-message[data-chat-date="2024-03-21"] .kzbub')).find((el) => el.textContent?.trim() === "📞 Video Call");
      if (target) observer.observe(target);
    };
    const mutations = new MutationObserver(search);
    mutations.observe(document.body, { childList: true, subtree: true });
    search();
    return () => { mutations.disconnect(); observer.disconnect(); clearTimeout(timer); };
  }, []);
  useEffect(() => {
    if (phase !== "ringing") return;
    const play = () => {
      try {
        const ctx = ringtone.current ?? new AudioContext();
        ringtone.current = ctx;
        if (ctx.state === "suspended") void ctx.resume();
        [0, 0.23].forEach((delay) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.value = 660;
          gain.gain.setValueAtTime(0.0001, ctx.currentTime + delay);
          gain.gain.exponentialRampToValueAtTime(0.055, ctx.currentTime + delay + 0.025);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + 0.19);
          osc.connect(gain).connect(ctx.destination);
          osc.start(ctx.currentTime + delay);
          osc.stop(ctx.currentTime + delay + 0.2);
        });
      } catch { /* browsers can block automatic audio */ }
    };
    play();
    const interval = setInterval(play, 1800);
    return () => { clearInterval(interval); if (ringtone.current) { void ringtone.current.close(); ringtone.current = null; } };
  }, [phase]);
  useEffect(() => {
    if (phase !== "connected") return;
    const started = Date.now();
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - started) / 1000);
      setSeconds(elapsed);
      if (elapsed >= callTimeline.length * 2) {
        setPhase("idle");
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
  if (phase === "idle") return null;
  const screen = document.querySelector(".story-runtime .phone-shell");
  if (!screen) return null;
  const sceneIndex = Math.min(Math.floor(seconds / 2), callTimeline.length - 1);
  const scene = callTimeline[sceneIndex];
  const asset = (name: string) => "./video-call-20240321/" + name;
  return createPortal(
    <div className="story-video-call" role="dialog" aria-label="咚灿视频通话">
      {phase === "ringing" ? (
        <div className="story-video-incoming">
          <img src="./kkt-avatars/dongchan-2024.png" alt="咚灿头像" />
          <h2>咚灿</h2><p>视频通话邀请…</p>
          <button onClick={() => { setSeconds(0); setPhase("connected"); }} className="story-video-accept" aria-label="接听视频通话"><CallIcon size={25} fill="white" strokeWidth={2.3} /></button>
        </div>
      ) : (
        <div className="story-video-connected">
          <div className="story-video-photo-stage">{callScenes.map((photo) => <img key={photo.image} className={"story-video-main" + (photo.image === scene.image ? " is-active" : "")} src={asset(photo.image)} alt="视频通话画面" />)}</div>
          <div className="story-video-header"><strong>咚灿</strong><span>{String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}</span></div>
          <div className="story-video-self-wrap"><img className="story-video-self" src={asset("b813ec9132da2e69c492ec81a3885887.jpeg")} alt="宋小鱼的视频小窗" /><span className="story-video-self-off" aria-label="宋小鱼摄像头已关闭"><VideoOff size={17} strokeWidth={2.5}/></span></div>
          {scene.caption && <div className="story-video-subtitle" key={seconds >> 1}>{scene.caption}</div>}
          <div className="story-video-controls"><span><MicOff size={24}/><small>静音</small></span><span><VideoOff size={24}/><small>摄像头</small></span><span className="story-video-hangup" aria-label="挂断按钮（装饰，不可操作）"><PhoneOff size={25}/></span><span><Volume2 size={24}/><small>扬声器</small></span></div>
        </div>
      )}
    </div>, screen
  );
}

function May18VideoCall() {
  const [visible, setVisible] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!visible) return;
    setElapsed(0);
    const ticker = setInterval(() => setElapsed((seconds) => seconds + 1), 1000);
    return () => clearInterval(ticker);
  }, [visible]);
  const fired = React.useRef(false);
  useEffect(() => {
    let delay: ReturnType<typeof setTimeout> | undefined;
    let finish: ReturnType<typeof setTimeout> | undefined;
    let watched: Element | null = null;
    const observer = new IntersectionObserver((entries) => {
      if (fired.current) return;
      for (const entry of entries) {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.65) {
          if (!delay) delay = setTimeout(() => {
            fired.current = true;
            setVisible(true);
            finish = setTimeout(() => setVisible(false), 4000);
          }, 2000);
        } else if (delay) { clearTimeout(delay); delay = undefined; }
      }
    }, { threshold: [0, 0.65, 1] });
    const locate = () => {
      const thread = document.querySelector(".mymy-kakao .kzname");
      const target = thread?.textContent?.trim() === "咚灿"
        ? document.querySelector('.mymy-kakao .kkt-dated-message[data-message-id="kkt-dongchan-20240518-020"] .kzbub')
        : null;
      if (watched !== target) {
        if (watched) observer.unobserve(watched);
        if (delay) { clearTimeout(delay); delay = undefined; }
        watched = target;
        if (target && !fired.current) observer.observe(target);
      }
    };
    const mutation = new MutationObserver(locate);
    mutation.observe(document.body, { childList: true, subtree: true });
    locate();
    return () => { mutation.disconnect(); observer.disconnect(); clearTimeout(delay); clearTimeout(finish); };
  }, []);
  if (!visible) return null;
  const screen = document.querySelector(".story-runtime .phone-shell");
  if (!screen) return null;
  return createPortal(
    <div className="story-video-call may18-video-call" role="dialog" aria-label="咚灿视频通话">
      <div className="story-video-connected">
        <div className="story-video-photo-stage">
          <img className="story-video-main is-active" src="./video-call-20240518/main.png" alt="咚灿视频画面" />
        </div>
        <div className="story-video-header"><strong>宋小鱼</strong><span>0:{String(elapsed).padStart(2, "0")}</span></div>
        <div className="story-video-self-wrap">
          <img className="story-video-self" src="./video-call-20240518/self.png" alt="宋小鱼的视频小窗" />
        </div>
        <div className="story-video-controls">
          <span><MicOff size={24}/></span><span className="story-video-hangup"><PhoneOff size={25}/></span><span><Volume2 size={24}/></span>
        </div>
      </div>
    </div>, screen
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
      .then(async (x) => {
        const w = validateWork(x);
        // Attach the two May 11, 2023 confession reply photos to their exact replies.
        for (const post of w.data.twitter ?? []) {
          if (post.id !== "x-confessions-001") continue;
          try {
            const replies = JSON.parse(String(post.meta?.repliesData || "[]"));
            if (!Array.isArray(replies)) continue;
            for (const reply of replies) {
              if (reply.id === "x-reply-005") { reply.image = "x-posts/x-20230511-reply-005.jpg"; reply.imagePending = false; }
              if (reply.id === "x-reply-016") { reply.image = "x-posts/x-20230511-reply-016.jpg"; reply.imagePending = false; }
            }
            post.meta.repliesData = JSON.stringify(replies);
          } catch (error) { console.warn("Could not parse X replies", error); }
        }
        // Correct the original X post metadata without altering other posts.
        for (const post of w.data.twitter ?? []) {
          if (post.id === "x-mar19-2024-1") { post.meta.commentCount = "492"; post.meta.postImages = "x-posts/x-mar19-2024-19.png|x-posts/x-mar19-2024-21.png|x-posts/x-mar19-2024-22.png"; }
          if (post.id === "x-mar15-2024-05") post.meta.postImages = "x-posts/x-mar15-2024-03.png|x-posts/x-mar15-2024-04.png|x-posts/x-mar15-2024-05.png";
          if (post.id === "x-mar15-2024-07") post.meta.postImages = "x-posts/x-mar15-2024-10.png|x-posts/x-mar15-2024-11.png";
        }
        if (new URLSearchParams(location.search).get("template") !== "blank") {
          try {
            const response = await fetch("./mom-kkt.json", { signal: abort.signal });
            if (response.ok) {
              const mom = await response.json();
              const current = w.data.kakao ?? [];
              const ids = new Set(current.map((item) => item.id));
              w.data.kakao = [...current, ...mom.filter((item: { id: string }) => !ids.has(item.id))];
            }
          } catch (e) { if (abort.signal.aborted) return; console.warn(e); }
        }
        if (new URLSearchParams(location.search).get("template") !== "blank") {
          try {
            const response = await fetch("./osaki-kkt.json", { signal: abort.signal });
            if (response.ok) {
              const osaki = await response.json();
              const current = w.data.kakao ?? [];
              const ids = new Set(current.map((item) => item.id));
              w.data.kakao = [...current, ...osaki.filter((item: { id: string }) => !ids.has(item.id))];
            }
          } catch (e) { if (abort.signal.aborted) return; console.warn(e); }
        }
        if (new URLSearchParams(location.search).get("template") !== "blank") {
          try {
            const response = await fetch("./zhengping-kkt.json", { signal: abort.signal });
            if (response.ok) {
              const messages = await response.json();
              const current = w.data.kakao ?? [];
              const ids = new Set(current.map((item) => item.id));
              w.data.kakao = [...current, ...messages.filter((item: { id: string }) => !ids.has(item.id))];
            }
          } catch (e) { if (abort.signal.aborted) return; console.warn(e); }
        }
        if (new URLSearchParams(location.search).get("template") !== "blank") {
          try {
            const response = await fetch("./daechi-kkt.json", { signal: abort.signal });
            if (response.ok) {
              const messages = await response.json();
              const current = w.data.kakao ?? [];
              const ids = new Set(current.map((item) => item.id));
              w.data.kakao = [...current, ...messages.filter((item: { id: string }) => !ids.has(item.id))];
            }
          } catch (e) { if (abort.signal.aborted) return; console.warn(e); }
        }
        if (new URLSearchParams(location.search).get("template") !== "blank") {
          try {
            const response = await fetch("./cul8r-kkt.json", { signal: abort.signal });
            if (response.ok) {
              const messages = await response.json();
              const current = w.data.kakao ?? [];
              const ids = new Set(current.map((item) => item.id));
              w.data.kakao = [...current, ...messages.filter((item: { id: string }) => !ids.has(item.id))];
            }
          } catch (e) { if (abort.signal.aborted) return; console.warn(e); }
        }
        if (new URLSearchParams(location.search).get("template") !== "blank") {
          try {
            const response = await fetch("./dongchan-kkt-2025-late.json", { signal: abort.signal });
            if (response.ok) {
              const messages = await response.json();
              const current = w.data.kakao ?? [];
              const ids = new Set(current.map((item) => item.id));
              w.data.kakao = [...current, ...messages.filter((item: { id: string }) => !ids.has(item.id))];
              w.data.kakao.sort((a, b) => String(a.time || "").localeCompare(String(b.time || "")));
            }
          } catch (e) { if (abort.signal.aborted) return; console.warn(e); }
        }
        if (new URLSearchParams(location.search).get("template") !== "blank") {
          try {
            const response = await fetch("./songxiaoyu-kkt-20260114.json", { signal: abort.signal });
            if (response.ok) {
              const messages = await response.json();
              const current = w.data.kakao ?? [];
              const ids = new Set(current.map((item) => item.id));
              w.data.kakao = [...current, ...messages.filter((item: { id: string }) => !ids.has(item.id))];
              w.data.kakao.sort((a, b) => String(a.time || "").localeCompare(String(b.time || "")));
            }
          } catch (e) { if (abort.signal.aborted) return; console.warn(e); }
        }
        if (new URLSearchParams(location.search).get("template") !== "blank") {
          try {
            const response = await fetch("./dongchan-kkt-20260216.json", { signal: abort.signal });
            if (response.ok) {
              const messages = await response.json();
              const current = w.data.kakao ?? [];
              const ids = new Set(current.map((item) => item.id));
              w.data.kakao = [...current, ...messages.filter((item: { id: string }) => !ids.has(item.id))];
              w.data.kakao.sort((a, b) => String(a.time || "").localeCompare(String(b.time || "")));
            }
          } catch (e) { if (abort.signal.aborted) return; console.warn(e); }
        }
        // Append the February 25 and March 11, 2026 Dongchan chats to the existing conversation.
        if (new URLSearchParams(location.search).get("template") !== "blank") {
          try {
            const response = await fetch("./dongchan-kkt-20260225-20260311.json", { signal: abort.signal });
            if (response.ok) {
              const messages = await response.json();
              const current = w.data.kakao ?? [];
              const ids = new Set(current.map((item) => item.id));
              w.data.kakao = [...current, ...messages.filter((item: { id: string }) => !ids.has(item.id))];
              w.data.kakao.sort((a, b) => String(a.time || "").localeCompare(String(b.time || "")));
            }
          } catch (e) { if (abort.signal.aborted) return; console.warn(e); }
        }
        // Add the seven authored calendar entries without replacing existing events.
        if (new URLSearchParams(location.search).get("template") !== "blank") {
          const dates: Array<[string, string]> = [
            ["2026-02-25", "入职"],
            ["2026-03-02", "交材料"],
            ["2026-03-09", "组会"],
            ["2026-03-13", "交会议记录"],
            ["2026-03-31", "会议记录"],
            ["2026-04-07", "组会"],
            ["2026-04-23", "组会"],
          ];
          const current = w.data.calendar ?? [];
          const ids = new Set(current.map((item) => item.id));
          w.data.calendar = [...current, ...dates.filter(([date]) => !ids.has("calendar-work-" + date)).map(([date, title]) => makeItem({
            id: "calendar-work-" + date,
            title,
            body: title,
            time: date + " 09:00",
            kind: "event",
            sender: "",
            outgoing: false,
            meta: {},
          }))].sort((a, b) => String(a.time || "").localeCompare(String(b.time || "")));
        }
        // Continue the existing Dongchan chat through April 5, 2026.
        if (new URLSearchParams(location.search).get("template") !== "blank") {
          try {
            const response = await fetch("./dongchan-kkt-20260316-20260405.json", { signal: abort.signal });
            if (response.ok) {
              const messages = await response.json();
              const current = w.data.kakao ?? [];
              const ids = new Set(current.map((item) => item.id));
              w.data.kakao = [...current, ...messages.filter((item: { id: string }) => !ids.has(item.id))];
              w.data.kakao.sort((a, b) => String(a.time || "").localeCompare(String(b.time || "")));
            }
          } catch (e) { if (abort.signal.aborted) return; console.warn(e); }
        }
        // Load the February 16 graduation confession as one X post with authored replies.
        if (new URLSearchParams(location.search).get("template") !== "blank") {
          try {
            const response = await fetch("./x-20260216-9736.json", { signal: abort.signal });
            if (response.ok) {
              const post = await response.json();
              const posts = w.data.twitter ?? [];
              // Preserve the original authored feed order; the new 2026 post belongs at the very bottom.
              w.data.twitter = [...posts.filter((item) => item.id !== post.id), post];
            }
          } catch (e) { if (abort.signal.aborted) return; console.warn(e); }
        }
        // Restore the missing incoming photo in the August 26, 2025 Dongchan chat.
        // Attach it to the 16:26 photo placeholder, not the adjacent outgoing message.
        for (const msg of w.data.kakao ?? []) {
          if (msg.title !== "咚灿" || msg.outgoing || !String(msg.time || "").startsWith("2025-08-26 16:26")) continue;
          if (String(msg.body || "").includes("图片待上传") || msg.meta?.pendingImagePath) {
            msg.meta = { ...msg.meta, pendingImagePath: "kkt-images/dongchan-20250826-1626.png" };
          }
        }
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
        <><PhoneApp work={work} /><VideoCallExperience /><May18VideoCall /></>
      ) : (
        <p role="status">{error || "正在打开手机…"}</p>
      )}
    </main>
  );
}
createRoot(document.getElementById("root")!).render(<StoryPlayer />);
