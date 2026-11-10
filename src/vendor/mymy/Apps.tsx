/* React/data adapters for dudwo5/Mymy UI templates: kt/ktn/KHD/bub,
 * igHome/igProfile/igDM/igSheet, xHome. See NOTICE.txt for permission.
 * Author content, DOM globals, timers and media dependencies are excluded. */
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Search,
  Plus,
  Settings,
  Users,
  MessageCircle,
  MoreHorizontal,
  Heart,
  Home,
  Grid,
  Send,
  Bookmark,
  Repeat2,
  BarChart2,
  Share,
  User,
  Bell,
  X,
  Smile,
  Menu,
  Compass,
  PhoneMissed,
  Phone,
  Video,
  VideoOff,
} from "lucide-react";
import type { SkinProps } from "../../AppSkins";
import { Avatar, Media, xAvatarSrc, XPostGallery } from "../../skins/shared";
import { useSkinState } from "../../skinState";
import { makeItem, type Item } from "../../schema";
import "./ui.css";
import "./adapter.css";
import "../../skins/social-details.css";
function grouped(items: Item[]) {
  return [...new Set(items.map((i) => i.title))].map((title) => ({
    title,
    items: items.filter((i) => i.title === title),
  }));
}
export function messageRun(items: Item[], index: number) {
  const m = items[index],
    previous = items[index - 1],
    next = items[index + 1];
  // A new date or minute begins a new visible message group.
  // In particular, the first incoming message beneath a date heading
  // must always display its sender's avatar.
  const groupKey = (item: Item) =>
    (item.meta?.chatDate || item.time.slice(0, 10)) + "|" + item.time.slice(-5);
  return {
    first:
      !previous ||
      previous.outgoing !== m.outgoing ||
      previous.sender !== m.sender ||
      groupKey(previous) !== groupKey(m),
    last:
      !next ||
      next.outgoing !== m.outgoing ||
      next.sender !== m.sender ||
      groupKey(next) !== groupKey(m),
  };
}
const read = (p: SkinProps, i: Item) =>
  p.creator || i.password ? p.onItem(i) : p.onRead(i.id);
function Blank() {
  return <p className="mymy-empty">暂无内容</p>;
}
function Back({ onClick }: { onClick: () => void }) {
  return (
    <button aria-label="返回" onClick={onClick}>
      <ArrowLeft size={22} />
    </button>
  );
}
function KktPhoto({ path, outgoing }: { path: string; outgoing: boolean }) {
  const [failed, setFailed] = useState(false);
  return failed ? (
    <span className="kkt-missing-photo">📷 图片待上传</span>
  ) : (
    <img
      className="kkt-uploaded-photo"
      src={`${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`}
      alt={outgoing ? "宋小鱼发送的照片" : "联系人发送的照片"}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
function KktCallCard({ type, missed, status, duration }: { type: string; missed: boolean; status?: string; duration?: string }) {
  const video = type === "video";
  const ended = status === "ended";
  const Glyph = video ? (missed && !ended ? VideoOff : Video) : (missed && !ended ? PhoneMissed : Phone);
  return (
    <span className={"kkt-call-card" + (ended ? " is-ended" : "")}>
      <span className={"kkt-call-icon" + (ended || missed ? " is-ended-icon" : "")}>
        <Glyph size={23} strokeWidth={2} fill={video ? "currentColor" : "none"} />
      </span>
      <span className="kkt-call-copy">
        <strong>{ended ? (video ? "End video call" : "End voice call") : (video ? "Video Call" : "Voice Call")}</strong>
        {ended ? <small className="kkt-call-duration">{duration || "0:01"}</small> : missed ? <small>Missed Call</small> : null}
      </span>
    </span>
  );
}
function kktDateLabel(value: string) {
  const match = /^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/.exec(value.trim());
  if (!match) return value;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return value;
  return new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(date);
}
const kktContacts = [
  { title: "咚灿", nickname: "덩떵찬", avatar: "dongchan-2024.png" },
  { title: "大植", nickname: "Daechi", avatar: "daechi.png" },
  { title: "鹅卵石", nickname: "CUl8r", avatar: "cul8r.png" },
  { title: "妈", nickname: "찰리 댕댕이맘", avatar: "mom.jpg" },
  { title: "正平哥", nickname: "siioiiei", avatar: "zhengping.jpg" },
  { title: "Osaki Shotaro", nickname: "Shoちゃん", avatar: "shotaro.jpg" },
  { title: "时宇哥", nickname: "Siwoo", avatar: "siwoo.jpg" },
];
function kktContact(title: string) { return kktContacts.find((c) => c.title === title); }
function kktAvatar(title: string, fallback?: string) {
  const c = kktContact(title);
  return c ? `${import.meta.env.BASE_URL}kkt-avatars/${c.avatar}` : fallback;
}
// Sort KakaoTalk conversations by the latest message, while pinning 咚灿 first.
function kktMessageStamp(item?: Item): string {
  if (!item) return "";
  const raw = String(item.time || "");
  const match = raw.match(/(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})(?:[ T]+(\d{1,2}):(\d{2}))?/);
  if (!match) return "";
  return [match[1], match[2].padStart(2, "0"), match[3].padStart(2, "0")].join("-")
    + " " + (match[4] || "00").padStart(2, "0") + ":" + (match[5] || "00");
}
function kktLatest(items: Item[]): Item | undefined {
  return items.reduce<Item | undefined>((latest, item) =>
    !latest || kktMessageStamp(item) >= kktMessageStamp(latest) ? item : latest, undefined);
}
function kktListTime(item?: Item): string {
  const stamp = kktMessageStamp(item);
  return stamp ? stamp.slice(0, 10).replace(/-/g, ".") : "";
}
export function MymyKakao(p: SkinProps) {
  const [tab, setTab] = useSkinState<string>(p, "mymyTab", "聊天"),
    [sent, setSent] = useSkinState<string[]>(p, "mymyKktSent", []),
    [draft, setDraft] = useState(""),
    [query, setQuery] = useState(""),
    [menu, setMenu] = useState(false);
  const [april12LastRead, setApril12LastRead] = useState(false);
  // Scripted April 8 conversation: earlier messages stay visible without interaction.
  const [scriptCount, setScriptCount] = useState(0);
  const [scriptStarted, setScriptStarted] = useState(false);
  const [lastUnreadCleared, setLastUnreadCleared] = useState(false);
  const scroll = useRef<HTMLDivElement>(null);
  const scripted = p.thread === "咚灿"
    ? p.items.filter((m) => m.title === "咚灿" && m.meta?.interactive === "true")
    : [];
  const nextScript = scripted[scriptCount];
  const revealedScript = scripted.slice(0, scriptCount);
  const lastRevealedApril12 = revealedScript.filter((m) => m.meta?.interactivePhase === "april12").at(-1);
  const april12Unread = (m: (typeof scripted)[number]) =>
    m.meta?.interactivePhase === "april12" &&
    lastRevealedApril12?.id === m.id &&
    lastRevealedApril12.outgoing === true &&
    !(april12LastRead && scriptCount === scripted.length);
  useEffect(() => {
    if (p.thread !== "咚灿" || !scriptStarted || !scripted.length || scriptCount !== scripted.length || lastRevealedApril12?.outgoing !== true) return;
    const timer = setTimeout(() => setApril12LastRead(true), 1000);
    return () => clearTimeout(timer);
  }, [p.thread, scriptStarted, scriptCount, scripted.length, lastRevealedApril12?.id, lastRevealedApril12?.outgoing]);
  const lastSentApril11 = scripted.slice(0, scriptCount).filter((m) => m.meta?.interactivePhase === "april11").at(-1);
  const lastSentApril11Index = lastSentApril11 ? Number(lastSentApril11.meta?.interactiveIndex) : -1;
  const april11Unread = (m: (typeof scripted)[number]) =>
    m.meta?.interactivePhase === "april11" && !lastRevealedApril12 && Number(m.meta?.interactiveIndex) === lastSentApril11Index;
  const april910 = scripted.filter((m) => m.meta?.interactivePhase === "april9-10");
  const lastApril910 = april910[april910.length - 1];
  const lastSentApril910 = scripted.slice(0, scriptCount).filter((m) => m.meta?.interactivePhase === "april9-10").at(-1);
  const lastSentApril910Index = lastSentApril910 ? Number(lastSentApril910.meta?.interactiveIndex) : -1;
  const april910Unread = (m: (typeof scripted)[number]) => {
    if (m.meta?.interactivePhase !== "april9-10") return false;
    const index = Number(m.meta?.interactiveIndex);
    if (index > lastSentApril910Index || lastSentApril910Index < 0) return false;
    if (lastSentApril910Index === 38 && lastUnreadCleared) return false;
    // The unanswered slipper question and following messages remain unread
    // together until the first 21:41 ellipsis is sent.
    if (lastSentApril910Index >= 30 && lastSentApril910Index <= 34) {
      return index >= 30 && index <= lastSentApril910Index;
    }
    return index === lastSentApril910Index;
  };
  useEffect(() => {
    if (!scriptStarted || !lastApril910 || lastSentApril910?.id !== lastApril910.id) return;
    const timer = setTimeout(() => setLastUnreadCleared(true), 1000);
    return () => clearTimeout(timer);
  }, [scriptStarted, lastSentApril910?.id, lastApril910?.id]);

  useEffect(() => {
    if (p.thread !== "咚灿" || scriptStarted || !scripted.length) return;
    let visibleSince: number | null = null;
    // Poll the actual chat viewport: the thread and its scroll position can
    // settle after the first animation frame, especially on mobile Safari.
    const check = () => {
      const root = scroll.current;
      if (!root) { visibleSince = null; return; }
      // .kkt-dated-message uses display: contents and has NO layout box.
      // Measure its visible message row instead of the zero-sized wrapper.
      const target = root.querySelector<HTMLElement>('[data-message-id="kkt-dongchan-20260408-008"] .kzm');
      if (!target) { visibleSince = null; return; }
      const rootBox = root.getBoundingClientRect();
      const bubbleBox = target.getBoundingClientRect();
      const inView = bubbleBox.bottom > rootBox.top + 4 && bubbleBox.top < rootBox.bottom - 4;
      // The last existing bubble being visible is sufficient; Safari can report
      // a stale scrollHeight until the input receives focus.
      if (inView) {
        if (visibleSince === null) visibleSince = Date.now();
        if (Date.now() - visibleSince >= 1000) {
          setScriptStarted(true);
          setScriptCount(1);
        }
      } else {
        visibleSince = null;
      }
    };
    check();
    const poll = setInterval(check, 150);
    return () => clearInterval(poll);
  }, [p.thread, scriptStarted, scripted.length]);
  useEffect(() => {
    if (!scriptStarted || !nextScript || nextScript.outgoing || p.thread !== "咚灿") return;
    const timer = setTimeout(() => setScriptCount((count) => count + 1), 1050);
    return () => clearTimeout(timer);
  }, [scriptStarted, scriptCount, p.thread, nextScript?.id]);
  useEffect(() => {
    if (!scriptStarted || p.thread !== "咚灿") return;
    const node = scroll.current;
    if (node) {
      const remaining = node.scrollHeight - node.scrollTop - node.clientHeight;
      if (remaining < 240) node.scrollTo({ top: node.scrollHeight, behavior: "smooth" });
    }
  }, [scriptCount, scriptStarted, p.thread]);
  const list = grouped(p.items.filter((m) => m.meta?.interactive !== "true")).sort((a, b) => {
    if (a.title === "咚灿") return -1;
    if (b.title === "咚灿") return 1;
    return kktMessageStamp(kktLatest(b.items)!).localeCompare(kktMessageStamp(kktLatest(a.items)!));
  }),
    messages = [
      ...p.items.filter((i) => i.title === p.thread && (i.meta?.interactive !== "true" || (scriptStarted && scripted.findIndex((m) => m.id === i.id) < scriptCount))),
      ...sent.flatMap((raw, index) => {
        try {
          const entry: unknown = JSON.parse(raw);
          if (
            !Array.isArray(entry) ||
            entry.length !== 3 ||
            !entry.every((v) => typeof v === "string") ||
            entry[0] !== p.thread
          )
            return [];
          return [
            makeItem({
              id: "local-kkt-" + index,
              title: entry[0],
              body: entry[1],
              time: entry[2],
              sender: p.owner || "机主",
              outgoing: true,
              meta: { local: "true" },
            }),
          ];
        } catch {
          return [];
        }
      }),
    ];
  useEffect(() => {
    const node = scroll.current;
    if (node) node.scrollTop = 0;
  }, [p.thread]);
  return (
    <div className="mymy-ui mymy-kakao" data-mymy="kakao">
      {p.thread ? (
        <>
          <header className="kzth">
            <Back onClick={() => {
              p.onThread("");
            }} />
            <span className="kzname">{p.thread}</span>
            <span className="kzpill">
              <button aria-label="聊天菜单" onClick={() => setMenu(!menu)}>
                <Menu size={21} />
              </button>
            </span>
          </header>
          <div className="msgs kk" ref={scroll}>
            {messages.map((m, i) => {
              const run = messageRun(messages, i);
              const chatDate = m.meta?.chatDate || m.time.slice(0, 10);
              const prev = messages[i - 1];
              const prevDate = prev ? (prev.meta?.chatDate || prev.time.slice(0, 10)) : "";
              return (
                <div key={m.id} className={"kkt-dated-message" + (m.meta?.interactive === "true" ? " kkt-script-appear" : "")} data-chat-date={chatDate} data-message-id={m.id}>
                  {chatDate !== prevDate && m.meta?.hideDateHeading !== "true" && (
                    <div className="kkt-date-heading">{kktDateLabel(chatDate)}</div>
                  )}
                <div
                  className={
                    "kzm " +
                    (m.outgoing ? "kzmy" : "kzot") +
                    (run.first ? " first" : "")
                  }
                >
                  {!m.outgoing && run.first && (
                    <>
                      <div className="kzmav">
                        <Avatar name={m.sender} src={p.thread === "咚灿" && chatDate >= "2026-02-16" ? `${import.meta.env.BASE_URL}kkt-avatars/seongchan-2026.png` : kktAvatar(p.thread, m.avatar)} />
                      </div>
                      <div className="kzmn">{p.thread === "咚灿" && chatDate >= "2026-02-16" ? "성찬" : (kktContact(p.thread)?.nickname || m.meta?.displaySender || m.sender)}</div>
                    </>
                  )}
                  {m.outgoing && (run.last || m.meta?.interactive === "true") && (
                    <span className="kzt">
                      {april910Unread(m) || april11Unread(m) || april12Unread(m) ? <span className="kkt-script-unread">1</span> : (m.meta?.interactivePhase === "april9-10" || m.meta?.interactivePhase === "april11" || m.meta?.interactivePhase === "april12" ? "" : (m.meta.unread || ""))}
                      <br />
                      {m.time.slice(-5)}
                    </span>
                  )}
                  <div className={m.meta?.callType && m.body.includes("未接通") ? "kkt-call-stack" : "kkt-bubble-holder"}>
                    <button
                      className={"kzbub" + (m.media ? " kzimg" : "") + (m.meta?.pendingImagePath ? " kkt-photo-only" : "") + (m.meta?.callType ? " kkt-call-only" : "")} data-call-type={m.meta?.callType || (/video\s*call/i.test(m.body) ? "video" : "")}
                      onClick={() => m.meta.local !== "true" && read(p, m)}
                    >
                      {m.meta?.pendingImagePath ? (
                        <KktPhoto path={m.meta.pendingImagePath} outgoing={!!m.outgoing} />
                      ) : m.meta?.callType ? (
                        <KktCallCard type={m.meta.callType} status={m.meta.callStatus} duration={m.meta.callDuration} missed={false} />
                      ) : /^\[语音消息\s+\d+:\d+\]$/.test(m.body) ? (
                        <span className="kkt-voice-card"><span className="kkt-voice-play" aria-hidden="true">▶</span><span className="kkt-voice-duration">{m.body.match(/\d+:\d+/)?.[0] || "0:05"}</span></span>
                      ) : m.media ? <Media item={m} /> : m.body.replace(/，{2,}/g, (commas) => ",".repeat(commas.length))}
                    </button>
                    {m.meta?.callType && (m.body.includes("未接通") || m.meta.callStatus === "missed") && (
                      <button className="kzbub kkt-call-only" onClick={() => read(p, m)}>
                        <span className="kkt-call-card kkt-missed-card">
                          <span className="kkt-call-icon is-ended-icon">
                            {m.meta.callType === "video" ? <VideoOff size={23} strokeWidth={2} /> : <PhoneMissed size={23} strokeWidth={2} />}
                          </span>
                          <span className="kkt-call-copy"><strong>Missed Call</strong></span>
                        </span>
                      </button>
                    )}
                  </div>
                  {!m.outgoing && (run.last || m.meta?.interactive === "true") && (
                    <span className="kzt">{m.time.slice(-5)}</span>
                  )}
                </div>
                </div>
              );
            })}
            {!messages.length && <div className="kkt-empty-thread" aria-label="暂无聊天记录" />}
          </div>
          <form
            className="kzinp"
            onSubmit={(e) => {
              e.preventDefault();
              if (scriptStarted && nextScript?.outgoing && p.thread === "咚灿") {
                setScriptCount((count) => count + 1);
                setDraft("");
                return;
              }
              if (draft.trim()) {
                setSent([
                  ...sent,
                  JSON.stringify([
                    p.thread,
                    draft.trim(),
                    p.virtualTime || "09:41",
                  ]),
                ]);
                setDraft("");
              }
            }}
          >
            <button
              type="button"
              aria-label="添加聊天内容"
              onClick={() => (p.creator ? p.onAdd() : setMenu(!menu))}
            >
              <Plus size={21} />
            </button>
            <input
              aria-label="KKT消息"
              placeholder="输入消息"
              value={scriptStarted && nextScript?.outgoing && p.thread === "咚灿" ? nextScript.body : draft}
              readOnly={scriptStarted && !!nextScript?.outgoing && p.thread === "咚灿"}
              maxLength={2000}
              onChange={(e) => setDraft(e.target.value)}
            />
            <Smile size={22} />
            <button
              className={(scriptStarted && nextScript?.outgoing && p.thread === "咚灿") || draft.trim() ? "go" : ""}
              aria-label="发送KKT消息"
              disabled={!(scriptStarted && nextScript?.outgoing && p.thread === "咚灿") && !draft.trim()}
            >
              ↑
            </button>
          </form>
          {menu && (
            <div className="mymy-local-menu">
              <strong>{p.thread}</strong>
              <p>
                群成员：{[...new Set(messages.map((m) => m.sender))].join("、")}
              </p>
              <button onClick={() => setMenu(false)}>完成</button>
            </div>
          )}
        </>
      ) : (
        <div className="kzkk">
          <div className="kzhd">
            <header className="kzkh">
              <b className="kzti">
                {tab === "好友" ? p.owner || "好友" : "聊天"}
              </b>
              <span className="kzic">
                <button
                  aria-label="搜索聊天"
                  onClick={() => setQuery(query ? "" : " ")}
                >
                  <Search size={21} />
                </button>
                {p.creator && (
                  <button aria-label="新增内容" onClick={p.onAdd}>
                    <Plus />
                  </button>
                )}
                <button aria-label="KKT设置" onClick={() => setMenu(!menu)}>
                  <Settings size={21} />
                </button>
              </span>
            </header>
            <div className="kzkc2">
              {["好友", "聊天"].map((t) => (
                <button
                  key={t}
                  className={
                    "kzkpl " +
                    (t === tab || (t === "为你推荐" && tab === "推荐")
                      ? "on"
                      : "")
                  }
                  onClick={() => setTab(t)}
                >
                  {t}
                </button>
              ))}
            </div>
            {query !== "" && (
              <input
                className="mymy-search"
                aria-label="搜索KKT"
                value={query.trimStart()}
                onChange={(e) => setQuery(e.target.value || " ")}
                placeholder="搜索"
              />
            )}
          </div>
          <div className="kzkb">
            <div className="kzksec">
              {tab === "好友" ? "好友" : "全部聊天"} {[...new Set([...list.map((g) => g.title), ...kktContacts.map((c) => c.title)])].length}
            </div>
            {[...list, ...kktContacts.filter((contact) => !list.some((g) => g.title === contact.title)).map((contact) => ({ title: contact.title, items: [] as typeof p.items }))]
              .filter((g) => g.title.includes(query.trim()))
              .map((g) => {
                const last = kktLatest(g.items);
                return (
                  <button
                    className="kzkr kzkcr"
                    key={g.title}
                    onClick={() => p.onThread(g.title)}
                  >
                    <Avatar name={g.title} src={kktAvatar(g.title, g.items.find((m) => !m.outgoing)?.avatar || last?.avatar)} />
                    <span className="kzkn">
                      <b>{g.title}</b>
                      <small>{tab === "好友" ? (kktContact(g.title)?.nickname || last?.sender || "") : (g.title === "鹅卵石" ? "ㅋㅋㅋㅋ好" : (last?.body || ""))}</small>
                    </span>
                    <span className="kzkmt">
                      {kktListTime(last)}
                      {last?.meta.unread && (
                        <i className="kzkbd">{last.meta.unread}</i>
                      )}
                    </span>
                  </button>
                );
              })}
            {!list.length && <Blank />}
          </div>
          <nav className="kzknv">
            {[Users, MessageCircle, Compass, Grid, MoreHorizontal].map(
              (Icon, i) => (
                <button
                  key={i}
                  aria-label={["好友", "聊天", "发现", "更多功能", "设置"][i]}
                  className={(tab === "好友" ? 0 : 1) === i ? "on" : ""}
                  onClick={() =>
                    i < 2 ? setTab(["好友", "聊天"][i]) : setMenu(true)
                  }
                >
                  <Icon />
                </button>
              ),
            )}
          </nav>
          {menu && (
            <div className="mymy-local-menu">
              <strong>KakaoTalk</strong>
              <p>作品内聊天</p>
              <button onClick={() => setMenu(false)}>完成</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
const igFriends = ["s2taro","burgerSc_0913","Wonb1n32","ddori.zip","tonny4321","siw00_","d4echi","sh0hei_"];
const igData: Record<string, [number,number,string]> = {
  "seok.wav":[28,591,"somewhere, somehow."],
  "s2taro":[49,427,"dancing somewhere 🪩"],
  "burgerSc_0913":[52,7619,"just here 🍔"],
  "Wonb1n32":[33,718,"404 not found"],
  "ddori.zip":[47,477,"just for fun :p"],
  "tonny4321":[63,821,"🏊‍♂️🎧 0321"],
  "siw00_":[26,322,"out of office"],
  "d4echi":[12,197,"Tiny joys everywhere"],
  "sh0hei_":[36,816,"☁️"]
};
const igFollowing: Record<string, number> = {"seok.wav":183,"s2taro":247,"burgerSc_0913":216,"Wonb1n32":158,"ddori.zip":192,"tonny4321":274,"siw00_":139,"d4echi":228,"sh0hei_":165};
function IGPortrait({id,size=54}:{id:string;size?:number}) {
  return <img src={`${import.meta.env.BASE_URL}ig-avatars/${id}.jpg`} onError={e=>{const img=e.currentTarget;const n=Number(img.dataset.retry||0);const stem=`${import.meta.env.BASE_URL}ig-avatars/${id}`;const choices=[`${stem}.jpeg`,`${stem}.png`,`${import.meta.env.BASE_URL}ig-avatars/${id==="sh0hei_"?"sh0hei":id}.jpg`];if(n<choices.length){img.dataset.retry=String(n+1);img.src=choices[n]}else{img.onerror=null;img.src="data:image/svg+xml,"+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" fill="#dedede"/><circle cx="40" cy="30" r="15" fill="#aaa"/><ellipse cx="40" cy="76" rx="29" ry="27" fill="#aaa"/></svg>`)}}} alt={id} style={{width:size,height:size,borderRadius:"50%",objectFit:"cover",flexShrink:0,background:"#eee"}} />;
}
const burgerPostPhotos = ["01.jpg","02.jpg","03.jpg","04.jpg","05.jpg"].map(name => `${import.meta.env.BASE_URL}ig-posts/burgerSc_0913-20260119/${name}`);
const burgerPokerPhotos = ["01.jpg","02.jpg","03.jpg"].map(name => `${import.meta.env.BASE_URL}ig-posts/burgerSc_0913-20250830/${name}`);
const burgerApplePhotos = ["01.jpg","02.jpg","03.jpg","04.jpg"].map(name => `${import.meta.env.BASE_URL}ig-posts/burgerSc_0913-20250927/${name}`);
const burgerBloomPhotos = ["01.jpg","02.jpg","03.jpg"].map(name => `${import.meta.env.BASE_URL}ig-posts/burgerSc_0913-20250416/${name}`);
const burgerOctoberPhoto = `${import.meta.env.BASE_URL}ig-posts/burgerSc_0913-20251009/burger_2025-10-09.jpg`;

const igDateValue = (value: string) => { const match = value.match(/(20\d{2})\D+(\d{1,2})\D+(\d{1,2})/); return match ? Number(match[1])*10000+Number(match[2])*100+Number(match[3]) : 0; };
const newIgPosts = [
  { id:"s2taro-20250528", user:"s2taro", date:"2025.5.28", caption:"💤", images:["1.jpeg","2.jpeg","3.jpeg"] },
  { id:"ddori-20250815", user:"ddori.zip", date:"2025.8.15", caption:"☎️", images:["1.jpeg","2.jpeg","3.jpeg"] },
  { id:"seok-20251211", user:"seok.wav", date:"2025.12.11", caption:"🥢🥢", images:["1.jpeg","2.jpeg","3.jpeg"] },
  { id:"wonb1n-20260216", user:"Wonb1n32", date:"2026.2.16", caption:"⭐️🌙", images:["1.jpeg","2.jpeg","3.jpeg"] },
  { id:"seok-20260314", user:"seok.wav", date:"2026.3.14", caption:"🖤🎧", images:["01.jpeg","02.jpeg","03.jpeg"] },
  { id:"seok-20251120", user:"seok.wav", date:"2025.11.20", caption:"🐩🎮", images:["1.jpeg","2.jpeg","3.jpeg"] },
  { id:"seok-20260125", user:"seok.wav", date:"2026.1.25", caption:"☔️🫴🏻📚🫖", images:["1.jpeg","2.jpeg","3.jpeg","4.jpeg","5.jpeg","6.jpeg","7.jpeg","8.jpeg"] },
  { id:"seok-20250927", user:"seok.wav", date:"2025.9.27", caption:"🌊🌊🌊\n@s2taro @burgerSc_0913 @ddori.zip", images:["1.jpeg","2.jpeg","3.jpeg","4.jpeg"] },
  { id:"ddori-20260303", user:"ddori.zip", date:"2026.3.3", caption:"summer moments 🌿", images:["1.jpeg","2.jpeg","3.jpeg"] },
  { id:"tonny-20260227", user:"tonny4321", date:"2026.2.27", caption:"L👀k!", images:["1.jpeg","2.jpeg","3.jpeg"] },
  { id:"tonny-20251026", user:"tonny4321", date:"2025.10.26", caption:"taking it slow 🚶", images:["1.jpeg","2.jpeg","3.jpeg"] },
  { id:"s2taro-20250917", user:"s2taro", date:"2025.9.17", caption:"💐", images:["01.jpeg","02.jpeg","03.jpeg"] },
  { id:"sh0hei-20251228", user:"sh0hei_", date:"2025.12.28", caption:"🦌🦅🤎", images:["1.jpeg","2.jpeg","3.jpeg","4.jpeg"] }
];
export function MymyInstagram(p: SkinProps) {
  const [tab, setTab] = useSkinState<string>(p, "mymyTab", "主页"),
    [liked, setLiked] = useSkinState<string[]>(p, "mymyLiked", []),
    [saved, setSaved] = useSkinState<string[]>(p, "mymySaved", []),
    [replies, setReplies] = useSkinState<string[]>(p, "mymyReplies", []),
    [seen, setSeen] = useSkinState<string[]>(p, "mymySeen", []);
  const [igViewed, setIgViewed] = useState<string | null>(null),
    [igList, setIgList] = useState<string | null>(null),
    [igChat, setIgChat] = useState<string | null>(null),
    [swipeStart, setSwipeStart] = useState<number | null>(null),
    [burgerSlide, setBurgerSlide] = useState(0),
    [burgerOpen, setBurgerOpen] = useState(false),
    [appleSlide, setAppleSlide] = useState(0),
    [appleOpen, setAppleOpen] = useState(false),
    [pokerSlide, setPokerSlide] = useState(0),
    [pokerOpen, setPokerOpen] = useState(false),
    [bloomSlide, setBloomSlide] = useState(0),
    [bloomOpen, setBloomOpen] = useState(false),
    [octoberOpen, setOctoberOpen] = useState(false),
    [igPhotoOpen, setIgPhotoOpen] = useState<string | null>(null),
    [igPhotoSlides, setIgPhotoSlides] = useState<Record<string, number>>({}),
    [igPhotoTouchX, setIgPhotoTouchX] = useState<number | null>(null),
    [sheet, setSheet] = useState<Item | null>(null),
    [selected, setSelected] = useState<Item | null>(null),
    [story, setStory] = useState(0),
    [draft, setDraft] = useState(""),
    [pop, setPop] = useState("");
  const posts = p.items.filter(
      (i) => i.folder !== "私信" && i.meta.story !== "true",
    ),
    stories = p.items.filter((i) => i.meta.story === "true"),
    dms = p.items.filter((i) => i.folder === "私信"),
    active = stories[story - 1];
  const toggle = (id: string, values: string[], set: (v: string[]) => void) =>
    set(values.includes(id) ? values.filter((v) => v !== id) : [...values, id]);
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(
      () => setStory((n) => (n < stories.length ? n + 1 : 0)),
      5000,
    );
    return () => clearTimeout(t);
  }, [active, stories.length]);
  const openStory = (i: number) => {
    const m = stories[i];
    setSeen([...new Set([...seen, m.id])]);
    read(p, m);
    setStory(i + 1);
  };
  const openPost = (i: Item) => {
    if (p.creator || i.password) p.onItem(i);
    else {
      read(p, i);
      setSelected(i);
    }
  };

  const renderNewIgPost = (entry: (typeof newIgPosts)[number]) => {
    const photos = entry.images.map(name => `${import.meta.env.BASE_URL}ig-posts/${entry.id}/${name}`);
    const slide = Math.max(0, Math.min(photos.length - 1, igPhotoSlides[entry.id] ?? 0));
    const moveSlide = (n: number) => setIgPhotoSlides(previous => ({...previous, [entry.id]: Math.max(0, Math.min(photos.length - 1, n))}));
    return (
      <article className="igp" key={entry.id} style={{background:"#fff"}}>
        <header className="igph">
          <IGPortrait id={entry.user} size={38}/>
          <div className="igpn">
            <button onClick={() => {setIgViewed(entry.user);setIgPhotoOpen(null)}}><b>{entry.user}</b></button>
            <small>{entry.date}</small>
          </div>
        </header>
        <div
          onTouchStart={e => setIgPhotoTouchX(e.touches[0]?.clientX ?? null)}
          onTouchEnd={e => {if(igPhotoTouchX===null)return;const diff=e.changedTouches[0].clientX-igPhotoTouchX;if(Math.abs(diff)>35)moveSlide(slide+(diff<0?1:-1));setIgPhotoTouchX(null)}}
          style={{position:"relative",width:"100%",minHeight:480,aspectRatio:"4 / 5",background:"#f5f5f5",touchAction:"pan-y",overflow:"hidden"}}
        >
          <img src={photos[slide]} alt={`${entry.user} 第 ${slide+1} 张照片`} style={{width:"100%",height:"100%",objectFit:"contain",display:"block",minWidth:0}}/>
          {slide>0&&<button onClick={()=>moveSlide(slide-1)} aria-label="上一张" style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",zIndex:5,width:48,height:64,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:30,fontWeight:600,color:"#222",border:0,borderRadius:28,background:"#ffffffdc",boxShadow:"0 2px 12px #0002",touchAction:"manipulation"}}>‹</button>}
          {slide<photos.length-1&&<button onClick={()=>moveSlide(slide+1)} aria-label="下一张" style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",zIndex:5,width:48,height:64,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:30,fontWeight:600,color:"#222",border:0,borderRadius:28,background:"#ffffffdc",boxShadow:"0 2px 12px #0002",touchAction:"manipulation"}}>›</button>}
          <span style={{position:"absolute",right:10,top:10,background:"#0009",color:"#fff",borderRadius:20,padding:"4px 9px",fontSize:12}}>{slide+1}/{photos.length}</span>
        </div>
        <div style={{display:"flex",justifyContent:"center",gap:5,padding:"9px 0"}}>
          {photos.map((_,i)=><button key={i} onClick={()=>moveSlide(i)} aria-label={`查看第${i+1}张`} style={{width:6,height:6,borderRadius:"50%",padding:0,border:0,background:i===slide?"#3897f0":"#ccc"}}/>)}
        </div>
        <div style={{padding:"4px 14px 14px",fontSize:14}}><b>{entry.user}</b> {entry.caption.split(/(@(?:s2taro|burgerSc_0913|ddori\.zip))/g).map((part,i)=>part.startsWith("@")&&["@s2taro","@burgerSc_0913","@ddori.zip"].includes(part)?<button key={i} onClick={()=>{setIgViewed(part.slice(1));setIgPhotoOpen(null)}} style={{color:"#3897f0",background:"none",border:0,padding:0,font:"inherit",cursor:"pointer"}}>{part}</button>:<span key={i} style={{whiteSpace:"pre-wrap"}}>{part}</span>)}<div style={{color:"#999",fontSize:12,marginTop:6}}>{entry.date}</div></div>
      </article>
    );
  };
  const burgerPost = () => (
    <article className="igp" style={{background:"#fff"}}>
      <header className="igph"><IGPortrait id="burgerSc_0913" size={38}/><div className="igpn"><button onClick={()=>{setIgViewed("burgerSc_0913");setBurgerOpen(false)}}><b>burgerSc_0913</b></button><small>2026.1.19</small></div></header>
      <div onTouchStart={e=>setSwipeStart(e.touches[0]?.clientX ?? null)} onTouchEnd={e=>{if(swipeStart===null)return;const diff=e.changedTouches[0].clientX-swipeStart;if(Math.abs(diff)>35)setBurgerSlide(n=>Math.max(0,Math.min(burgerPostPhotos.length-1,n+(diff<0?1:-1))));setSwipeStart(null)}} style={{position:"relative",width:"100%",aspectRatio:"1 / 1",background:"#f5f5f5",touchAction:"pan-y",overflow:"hidden"}}>
        <img src={burgerPostPhotos[burgerSlide]} alt={`burgerSc_0913 的第 ${burgerSlide+1} 张照片`} style={{width:"100%",height:"100%",objectFit:"contain",display:"block",minWidth:0}}/>
        {burgerSlide>0&&<button onClick={()=>setBurgerSlide(n=>n-1)} aria-label="上一张" style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",zIndex:5,width:48,height:64,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:30,fontWeight:600,color:"#222",border:0,borderRadius:28,background:"#ffffffdc",boxShadow:"0 2px 12px #0002",touchAction:"manipulation"}}>‹</button>}
        {burgerSlide<4&&<button onClick={()=>setBurgerSlide(n=>n+1)} aria-label="下一张" style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",zIndex:5,width:48,height:64,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:30,fontWeight:600,color:"#222",border:0,borderRadius:28,background:"#ffffffdc",boxShadow:"0 2px 12px #0002",touchAction:"manipulation"}}>›</button>}
        <span style={{position:"absolute",right:10,top:10,background:"#0009",color:"white",borderRadius:20,padding:"4px 9px",fontSize:12}}>{burgerSlide+1}/5</span>
      </div>
      <div style={{display:"flex",justifyContent:"center",gap:5,padding:"9px 0"}}>{burgerPostPhotos.map((_,i)=><button key={i} onClick={()=>setBurgerSlide(i)} aria-label={`查看第${i+1}张`} style={{width:6,height:6,borderRadius:"50%",padding:0,border:0,background:i===burgerSlide?"#3897f0":"#ccc"}}/>)}</div>
      <div style={{padding:"4px 14px 14px",fontSize:14}}><b>burgerSc_0913</b> 😎🕶️<div style={{color:"#999",fontSize:12,marginTop:6}}>2026年1月19日</div></div>
    </article>
  );
  const applePost = () => (
    <article className="igp" style={{background:"#fff"}}>
      <header className="igph"><IGPortrait id="burgerSc_0913" size={38}/><div className="igpn"><button onClick={()=>{setIgViewed("burgerSc_0913");setAppleOpen(false)}}><b>burgerSc_0913</b></button><small>2025.9.27</small></div></header>
      <div onTouchStart={e=>setSwipeStart(e.touches[0]?.clientX ?? null)} onTouchEnd={e=>{if(swipeStart===null)return;const diff=e.changedTouches[0].clientX-swipeStart;if(Math.abs(diff)>35)setAppleSlide(n=>Math.max(0,Math.min(3,n+(diff<0?1:-1))));setSwipeStart(null)}} style={{position:"relative",width:"100%",aspectRatio:"1 / 1",background:"#f5f5f5",touchAction:"pan-y",overflow:"hidden"}}>
        <img src={burgerApplePhotos[appleSlide]} alt={`It's like biting an apple 第 ${appleSlide+1} 张照片`} style={{width:"100%",height:"100%",objectFit:"contain",display:"block",minWidth:0}}/>
        {appleSlide>0&&<button onClick={()=>setAppleSlide(n=>n-1)} aria-label="上一张" style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",zIndex:5,width:48,height:64,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:30,fontWeight:600,color:"#222",border:0,borderRadius:28,background:"#ffffffdc",boxShadow:"0 2px 12px #0002",touchAction:"manipulation"}}>‹</button>}
        {appleSlide<3&&<button onClick={()=>setAppleSlide(n=>n+1)} aria-label="下一张" style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",zIndex:5,width:48,height:64,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:30,fontWeight:600,color:"#222",border:0,borderRadius:28,background:"#ffffffdc",boxShadow:"0 2px 12px #0002",touchAction:"manipulation"}}>›</button>}
        <span style={{position:"absolute",right:10,top:10,background:"#0009",color:"white",borderRadius:20,padding:"4px 9px",fontSize:12}}>{appleSlide+1}/4</span>
      </div>
      <div style={{display:"flex",justifyContent:"center",gap:5,padding:"9px 0"}}>{burgerApplePhotos.map((_,i)=><button key={i} onClick={()=>setAppleSlide(i)} aria-label={`查看第${i+1}张`} style={{width:6,height:6,borderRadius:"50%",padding:0,border:0,background:i===appleSlide?"#3897f0":"#ccc"}}/>)}</div>
      <div style={{padding:"4px 14px 14px",fontSize:14}}><b>burgerSc_0913</b> It's like biting an apple🍎🍏<div style={{color:"#999",fontSize:12,marginTop:6}}>2025年9月27日</div></div>
    </article>
  );
  const pokerPost = () => (
    <article className="igp" style={{background:"#fff"}}>
      <header className="igph"><IGPortrait id="burgerSc_0913" size={38}/><div className="igpn"><button onClick={()=>{setIgViewed("burgerSc_0913");setPokerOpen(false)}}><b>burgerSc_0913</b></button><small>2025.8.30</small></div></header>
      <div onTouchStart={e=>setSwipeStart(e.touches[0]?.clientX ?? null)} onTouchEnd={e=>{if(swipeStart===null)return;const diff=e.changedTouches[0].clientX-swipeStart;if(Math.abs(diff)>35)setPokerSlide(n=>Math.max(0,Math.min(burgerPokerPhotos.length-1,n+(diff<0?1:-1))));setSwipeStart(null)}} style={{position:"relative",width:"100%",aspectRatio:"1 / 1",background:"#f5f5f5",touchAction:"pan-y",overflow:"hidden"}}>
        <img src={burgerPokerPhotos[pokerSlide]} alt={`Poker Face？第 ${pokerSlide+1} 张照片`} style={{width:"100%",height:"100%",objectFit:"contain",display:"block",minWidth:0}}/>
        {pokerSlide>0&&<button onClick={()=>setPokerSlide(n=>n-1)} aria-label="上一张" style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",zIndex:5,width:48,height:64,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:30,fontWeight:600,color:"#222",border:0,borderRadius:28,background:"#ffffffdc",boxShadow:"0 2px 12px #0002",touchAction:"manipulation"}}>‹</button>}
        {pokerSlide<2&&<button onClick={()=>setPokerSlide(n=>n+1)} aria-label="下一张" style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",zIndex:5,width:48,height:64,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:30,fontWeight:600,color:"#222",border:0,borderRadius:28,background:"#ffffffdc",boxShadow:"0 2px 12px #0002",touchAction:"manipulation"}}>›</button>}
        <span style={{position:"absolute",right:10,top:10,background:"#0009",color:"white",borderRadius:20,padding:"4px 9px",fontSize:12}}>{pokerSlide+1}/3</span>
      </div>
      <div style={{display:"flex",justifyContent:"center",gap:5,padding:"9px 0"}}>{burgerPokerPhotos.map((_,i)=><button key={i} onClick={()=>setPokerSlide(i)} aria-label={`查看第${i+1}张`} style={{width:6,height:6,borderRadius:"50%",padding:0,border:0,background:i===pokerSlide?"#3897f0":"#ccc"}}/>)}</div>
      <div style={{padding:"4px 14px 14px",fontSize:14}}><b>burgerSc_0913</b> Poker Face？<div style={{color:"#999",fontSize:12,marginTop:6}}>2025年8月30日</div></div>
    </article>
  );
  const bloomPost = () => (
    <article className="igp" style={{background:"#fff"}}>
      <header className="igph"><IGPortrait id="burgerSc_0913" size={38}/><div className="igpn"><button onClick={()=>{setIgViewed("burgerSc_0913");setBloomOpen(false)}}><b>burgerSc_0913</b></button><small>2025.4.16</small></div></header>
      <div onTouchStart={e=>setSwipeStart(e.touches[0]?.clientX ?? null)} onTouchEnd={e=>{if(swipeStart===null)return;const diff=e.changedTouches[0].clientX-swipeStart;if(Math.abs(diff)>35)setBloomSlide(n=>Math.max(0,Math.min(burgerBloomPhotos.length-1,n+(diff<0?1:-1))));setSwipeStart(null)}} style={{position:"relative",width:"100%",aspectRatio:"1 / 1",background:"#f5f5f5",touchAction:"pan-y",overflow:"hidden"}}>
        <img src={burgerBloomPhotos[bloomSlide]} alt={`burgerSc_0913 的第 ${bloomSlide+1} 张照片`} style={{width:"100%",height:"100%",objectFit:"contain",display:"block",minWidth:0}}/>
        {bloomSlide>0&&<button onClick={()=>setBloomSlide(n=>n-1)} aria-label="上一张" style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",zIndex:5,width:48,height:64,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:30,fontWeight:600,color:"#222",border:0,borderRadius:28,background:"#ffffffdc",boxShadow:"0 2px 12px #0002",touchAction:"manipulation"}}>‹</button>}
        {bloomSlide<2&&<button onClick={()=>setBloomSlide(n=>n+1)} aria-label="下一张" style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",zIndex:5,width:48,height:64,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:30,fontWeight:600,color:"#222",border:0,borderRadius:28,background:"#ffffffdc",boxShadow:"0 2px 12px #0002",touchAction:"manipulation"}}>›</button>}
        <span style={{position:"absolute",right:10,top:10,background:"#0009",color:"white",borderRadius:20,padding:"4px 9px",fontSize:12}}>{bloomSlide+1}/3</span>
      </div>
      <div style={{display:"flex",justifyContent:"center",gap:5,padding:"9px 0"}}>{burgerBloomPhotos.map((_,i)=><button key={i} onClick={()=>setBloomSlide(i)} aria-label={`查看第${i+1}张`} style={{width:6,height:6,borderRadius:"50%",padding:0,border:0,background:i===bloomSlide?"#3897f0":"#ccc"}}/>)}</div>
      <div style={{padding:"4px 14px 14px",fontSize:14}}><b>burgerSc_0913</b> Blooming🌸<div style={{color:"#999",fontSize:12,marginTop:6}}>2025年4月16日</div></div>
    </article>
  );
  const post = (i: Item) => (
    <article className="igp" key={i.id}>
      <header className="igph">
        <Avatar name={i.sender} src={i.avatar} />
        <div className="igpn">
          <button onClick={() => setTab("个人主页")}>
            <b>{i.sender}</b>
          </button>
          <small>{i.meta.location || i.time}</small>
        </div>
        <button aria-label="帖子详情" onClick={() => openPost(i)}>
          <MoreHorizontal />
        </button>
      </header>
      <div
        className="carw"
        onDoubleClick={() => {
          if (!liked.includes(i.id)) setLiked([...liked, i.id]);
          setPop(i.id);
        }}
      >
        <Media item={i} />
        {pop === i.id && (
          <Heart
            className="mymy-heart-pop"
            fill="white"
            onAnimationEnd={() => setPop("")}
          />
        )}
      </div>
      <div className="iga">
        <button
          aria-label={"点赞" + i.title}
          aria-pressed={liked.includes(i.id)}
          onClick={() => toggle(i.id, liked, setLiked)}
        >
          <Heart
            fill={liked.includes(i.id) ? "#ff3040" : "none"}
            color={liked.includes(i.id) ? "#ff3040" : "currentColor"}
          />
        </button>
        <button
          aria-label={"评论" + i.title}
          onClick={() => {
            read(p, i);
            setSheet(i);
          }}
        >
          <MessageCircle />
        </button>
        <button aria-label="分享帖子" onClick={() => setTab("私信")}>
          <Send />
        </button>
        <button
          className="mymy-save"
          aria-label={"收藏" + i.title}
          aria-pressed={saved.includes(i.id)}
          onClick={() => toggle(i.id, saved, setSaved)}
        >
          <Bookmark fill={saved.includes(i.id) ? "currentColor" : "none"} />
        </button>
      </div>
      <p className="lk2">{i.likes + (liked.includes(i.id) ? 1 : 0)} 次赞</p>
      <button
        className="igc"
        onClick={() => {
          openPost(i);
        }}
      >
        <b>{i.sender}</b> {i.body}
      </button>
      <button className="cmall" onClick={() => setSheet(i)}>
        查看评论{" "}
        {i.comments.length +
          replies.filter((r) => r.startsWith(i.id + "\t")).length}
      </button>
      <p className="igt">{i.time}</p>
    </article>
  );
  return (
    <div className="mymy-ui mymy-instagram" data-mymy="instagram">
      <div className="ig">
        <header className="igh">
          <button
            aria-label={selected ? "返回Instagram动态" : "关闭当前App"}
            onClick={() => (igPhotoOpen ? setIgPhotoOpen(null) : octoberOpen ? setOctoberOpen(false) : bloomOpen ? setBloomOpen(false) : appleOpen ? setAppleOpen(false) : burgerOpen ? setBurgerOpen(false) : igChat ? setIgChat(null) : igList ? setIgList(null) : igViewed ? setIgViewed(null) : selected ? setSelected(null) : p.onBack())}
          >
            <ArrowLeft />
          </button>
          <span className="igl2">
            {igChat || igList || igViewed || (selected ? "帖子" : tab === "主页" ? "Instagram" : tab)}
          </span>
          <button aria-label="打开私信" onClick={() => setTab("私信")}>
            <Send />
          </button>
        </header>
        <div className="igb">
          {selected && !igViewed && !igList && post(selected)}
          {igList && !igChat && <div style={{padding:"8px 16px"}}>{igFriends.map(id=><button key={id} onClick={()=>{setIgViewed(id);setIgList(null)}} style={{display:"flex",alignItems:"center",justifyContent:"flex-start",gap:14,width:"100%",padding:"12px 0",border:0,borderBottom:"1px solid #eee",background:"white",textAlign:"left"}}><IGPortrait id={id} size={48}/><b>{id}</b></button>)}</div>}
          {igChat && <div style={{display:"flex",flexDirection:"column",minHeight:"100%",background:"#fff"}}><div style={{display:"flex",alignItems:"center",gap:12,padding:16,borderBottom:"1px solid #eee"}}><IGPortrait id={igChat} size={48}/><b>{igChat}</b></div><div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",color:"#999",fontSize:13}}>暂无聊天记录</div></div>}
          {igViewed && !igList && !igChat && !burgerOpen && !pokerOpen && !bloomOpen && !appleOpen && !octoberOpen && !igPhotoOpen && <div style={{padding:18}}><div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}><IGPortrait id={igViewed} size={78}/><div style={{textAlign:"center"}}><b>{igData[igViewed][0]}</b><div>帖子</div></div><div style={{textAlign:"center"}}><b>{igData[igViewed][1]}</b><div>粉丝</div></div><div style={{textAlign:"center"}}><b>{igFollowing[igViewed] ?? 176}</b><div>关注</div></div></div><b style={{display:"block",marginTop:14}}>{igViewed}</b><p>{igData[igViewed][2]}</p><button onClick={()=>setIgChat(igViewed)} style={{width:"100%",padding:10,borderRadius:8,border:0,background:"#eee",fontWeight:600}}>发消息</button><div className="ptab" style={{marginTop:18}}><div className="on"><Grid/></div></div><div className="pg2" style={{display:"grid",gridTemplateColumns:"repeat(3, minmax(0, 1fr))",gap:2,width:"100%"}}>{newIgPosts.filter(entry=>entry.user===igViewed).sort((a,b)=>igDateValue(b.date)-igDateValue(a.date)).map(entry=><button key={entry.id} onClick={()=>{setIgPhotoSlides(previous=>({...previous,[entry.id]:0}));setIgPhotoOpen(entry.id)}} style={{border:0,padding:0,background:"white",aspectRatio:"1"}}><img src={`${import.meta.env.BASE_URL}ig-posts/${entry.id}/${entry.images[0]}`} alt={entry.caption} style={{width:"100%",height:"100%",objectFit:"cover"}}/></button>)}{igViewed==="burgerSc_0913"&&<button onClick={()=>{setBurgerSlide(0);setBurgerOpen(true)}} style={{border:0,padding:0,background:"white",aspectRatio:"1"}}><img src={burgerPostPhotos[0]} alt="😎🕶️" style={{width:"100%",height:"100%",objectFit:"cover"}}/></button>}{igViewed==="burgerSc_0913"&&<button onClick={()=>{setAppleSlide(0);setAppleOpen(true)}} style={{border:0,padding:0,background:"white",aspectRatio:"1"}}><img src={burgerApplePhotos[0]} alt="It\u0027s like biting an apple🍎🍏" style={{width:"100%",height:"100%",objectFit:"cover"}}/></button>}{igViewed==="burgerSc_0913"&&<button onClick={()=>{setPokerSlide(0);setPokerOpen(true)}} style={{border:0,padding:0,background:"white",aspectRatio:"1"}}><img src={burgerPokerPhotos[0]} alt="Poker Face？" style={{width:"100%",height:"100%",objectFit:"cover"}}/></button>}{igViewed==="burgerSc_0913"&&<button onClick={()=>setOctoberOpen(true)} style={{border:0,padding:0,background:"white",aspectRatio:"1"}}><img src={burgerOctoberPhoto} alt="2025.10.9" style={{width:"100%",height:"100%",objectFit:"cover"}}/></button>}{igViewed==="burgerSc_0913"&&<button onClick={()=>{setBloomSlide(0);setBloomOpen(true)}} style={{border:0,padding:0,background:"white",aspectRatio:"1"}}><img src={burgerBloomPhotos[0]} alt="Blooming🌸" style={{width:"100%",height:"100%",objectFit:"cover"}}/></button>}{posts.filter(i=>i.sender===igViewed).map(i=><button key={i.id} onClick={()=>openPost(i)}><Media item={i}/></button>)}</div></div>}
          {igPhotoOpen && igViewed && newIgPosts.filter(entry=>entry.id===igPhotoOpen && entry.user===igViewed).map(renderNewIgPost)}
          {burgerOpen && igViewed==="burgerSc_0913" && <div>{burgerPost()}</div>}
          {appleOpen && igViewed==="burgerSc_0913" && <div>{applePost()}</div>}
          {pokerOpen && igViewed==="burgerSc_0913" && <div>{pokerPost()}</div>}
          {bloomOpen && igViewed==="burgerSc_0913" && <div>{bloomPost()}</div>}
          {octoberOpen && igViewed==="burgerSc_0913" && <div><article className="igp"><header className="igph"><IGPortrait id="burgerSc_0913" size={38}/><div className="igpn"><b>burgerSc_0913</b><small>2025.10.9</small></div></header><img src={burgerOctoberPhoto} alt="burgerSc_0913 2025.10.9" style={{display:"block",width:"100%",height:"auto"}}/><div style={{padding:"12px 14px",fontSize:13,color:"#999"}}>2025年10月9日</div></article></div>}
          {!selected && !igViewed && !igList && tab === "主页" && (
            <>
              <div className="sts">
                {["seok.wav",...igFriends].map(id=><button className="st" key={id} onClick={()=>{setIgViewed(id);setIgList(null);setTab("个人主页")}}><span className="sr on"><IGPortrait id={id} size={60}/></span><small>{id}</small></button>)}
                {stories.map((s, n) => (
                  <button
                    className="st"
                    key={s.id}
                    onClick={() => openStory(n)}
                  >
                    <span
                      className={"sr on " + (seen.includes(s.id) ? "seen" : "")}
                    >
                      <Avatar name={s.sender} src={s.avatar} />
                    </span>
                    <small>{s.sender}</small>
                  </button>
                ))}
              </div>
              {[
                ...newIgPosts.map(entry=>({date:entry.date,key:entry.id,render:()=>renderNewIgPost(entry)})),
                {date:"2026.1.19",key:"burger-20260119",render:burgerPost},
                {date:"2025.9.27",key:"burger-20250927",render:applePost},
                {date:"2025.8.30",key:"burger-20250830",render:pokerPost},
                {date:"2025.4.16",key:"burger-20250416",render:bloomPost},
                {date:"2025.10.9",key:"burger-20251009",render:()=> <article className="igp"><header className="igph"><IGPortrait id="burgerSc_0913" size={38}/><div className="igpn"><button onClick={()=>setIgViewed("burgerSc_0913")}><b>burgerSc_0913</b></button><small>2025.10.9</small></div></header><img src={burgerOctoberPhoto} alt="burgerSc_0913 2025.10.9" style={{width:"100%",height:"auto",display:"block"}}/></article>},
                ...posts.map(item=>({date:item.time || item.meta.location || "",key:item.id,render:()=>post(item)})),
              ].sort((a,b)=>igDateValue(b.date)-igDateValue(a.date)).map(entry=><div key={entry.key}>{entry.render()}</div>)}
              {!posts.length && <Blank />}
            </>
          )}
          {!selected && !igViewed && !igList && tab === "个人主页" && (
            <>
              <div className="pf">
                <IGPortrait id="seok.wav" size={82}/>
                <div className="ps">
                  <div><b>28</b><small>帖子</small></div>
                  <button onClick={()=>setIgList("粉丝")} style={{border:0,background:"transparent",display:"flex",flexDirection:"column",alignItems:"center"}}><b>591</b><small>粉丝</small></button>
                  <button onClick={()=>setIgList("关注")} style={{border:0,background:"transparent",display:"flex",flexDirection:"column",alignItems:"center"}}><b>8</b><small>关注</small></button>
                </div>
              </div>
              <p className="pn"><b>seok.wav</b><br/>somewhere, somehow.</p>
              <div style={{padding:"12px 16px"}}><b>互相关注的朋友</b><div style={{display:"flex",gap:12,overflowX:"auto",marginTop:12}}>{igFriends.map(id=><button key={id} onClick={()=>setIgViewed(id)} style={{border:0,background:"transparent",display:"flex",flexDirection:"column",alignItems:"center",gap:5,flexShrink:0,width:65}}><IGPortrait id={id} size={54}/><small style={{fontSize:10,maxWidth:65,overflow:"hidden",textOverflow:"ellipsis"}}>{id}</small></button>)}</div></div>
              <div className="ptab"><div className="on"><Grid/></div></div>
              <div className="pg2">{newIgPosts.filter(entry=>entry.user==="seok.wav").sort((a,b)=>igDateValue(b.date)-igDateValue(a.date)).map(entry=><button key={entry.id} onClick={()=>{setIgViewed(entry.user);setIgPhotoOpen(entry.id);setIgPhotoSlides(previous=>({...previous,[entry.id]:0}))}}><img src={`${import.meta.env.BASE_URL}ig-posts/${entry.id}/${entry.images[0]}`} alt={entry.caption} style={{width:"100%",height:"100%",objectFit:"cover"}}/></button>)}{posts.map(i=><button key={i.id} onClick={()=>openPost(i)}><Media item={i}/></button>)}</div>
            </>
          )}
          {!selected && !igViewed && !igList && !igChat && tab === "私信" && (
            <>
              {igFriends.map(id=><button key={id} onClick={()=>setIgChat(id)} style={{display:"flex",alignItems:"center",justifyContent:"flex-start",gap:14,width:"100%",padding:"12px 18px",border:0,borderBottom:"1px solid #eee",background:"white",textAlign:"left"}}><IGPortrait id={id} size={48}/><span><b>{id}</b><small style={{display:"block",color:"#999"}}>发送消息</small></span></button>)}
              {dms.map((i) => (
                <button className="kzkr" key={i.id} onClick={() => openPost(i)}>
                  <Avatar name={i.sender} src={i.avatar} />
                  <span className="kzkn">
                    <b>{i.title}</b>
                    <small>{i.body}</small>
                  </span>
                </button>
              ))}

            </>
          )}
          {!selected && !igViewed && !igList && tab === "搜索" && (
            <>
              <input
                className="mymy-search"
                style={{display:"block",width:"calc(100% - 32px)",margin:"12px 16px",boxSizing:"border-box",textAlign:"left"}}
                aria-label="搜索Instagram"
                placeholder="搜索"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
              />
              {["seok.wav",...igFriends].filter(id=>id.toLowerCase().includes(draft.toLowerCase())).map(id=><button key={id} onClick={()=>{setIgViewed(id);setIgList(null)}} style={{display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"flex-start",textAlign:"left",gap:14,padding:"10px 16px",width:"100%",minHeight:66,border:0,background:"white",boxSizing:"border-box"}}><span style={{display:"flex",width:48,minWidth:48,justifyContent:"flex-start",alignItems:"center",flexShrink:0}}><IGPortrait id={id} size={46}/></span><b style={{flex:"1 1 auto",textAlign:"left",margin:0}}>{id}</b></button>)}
              {posts
                .filter((i) => (i.title + i.body + i.sender).includes(draft))
                .map(post)}
            </>
          )}
        </div>
        <nav className="mymy-ig-nav">
          {[Home, Search, Send, User].map((Icon, n) => (
            <button
              key={n}
              aria-label={["主页", "搜索", "私信", "个人主页"][n]}
              aria-pressed={
                !selected && !igViewed && !igList && tab === ["主页", "搜索", "私信", "个人主页"][n]
              }
              onClick={() => {
                setSelected(null);
                setIgViewed(null);
                setIgList(null);
                setIgChat(null);
                setBurgerOpen(false);
                setBloomOpen(false);
                setOctoberOpen(false);
                setIgPhotoOpen(null);
                setTab(["主页", "搜索", "私信", "个人主页"][n]);
              }}
            >
              <Icon />
            </button>
          ))}
        </nav>
      </div>
      {sheet && (
        <div className="kzcs">
          <button
            className="kzbk"
            aria-label="关闭评论"
            onClick={() => setSheet(null)}
          />
          <section className="kzsh" role="dialog" aria-label="Instagram评论">
            <div className="mymy-sheet-handle" />
            <header>
              <b>评论</b>
              <button aria-label="关闭评论面板" onClick={() => setSheet(null)}>
                <X />
              </button>
            </header>
            <div className="mymy-comments">
              {[
                ...sheet.comments,
                ...replies
                  .filter((r) => r.startsWith(sheet.id + "\t"))
                  .map((r) => r.split("\t").slice(1).join("\t")),
              ].map((c, n) => (
                <p key={n}>
                  <Avatar name={c.split(":")[0]} />
                  {c}
                </p>
              ))}
            </div>
            <form
              className="cmb2"
              onSubmit={(e) => {
                e.preventDefault();
                if (draft.trim()) {
                  setReplies([...replies, sheet.id + "\t" + draft.trim()]);
                  setDraft("");
                }
              }}
            >
              <input
                aria-label="添加评论"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="添加评论"
                maxLength={500}
              />
              <button>发布</button>
            </form>
          </section>
        </div>
      )}
      {active && (
        <div
          className="mymy-story"
          onPointerDown={(e) => {
            const box = e.currentTarget.getBoundingClientRect();
            const next =
              e.clientX - box.left < box.width * 0.3 ? story - 1 : story + 1;
            setStory(next > stories.length ? 0 : Math.max(0, next));
          }}
        >
          <div className="mymy-story-bars">
            {stories.map((s, n) => (
              <i key={s.id} className={n < story ? "seen" : ""} />
            ))}
          </div>
          <header>
            <Avatar name={active.sender} src={active.avatar} />
            <b>{active.sender}</b>
            <button
              aria-label="关闭快拍"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => setStory(0)}
            >
              <X />
            </button>
          </header>
          <Media item={active} />
          <p>{active.body}</p>
        </div>
      )}
    </div>
  );
}
export function MymyX(p: SkinProps) {
  const [dark, setDark] = useSkinState<boolean>(p, "x-dark", true);
  const [tab, setTab] = useSkinState<string>(p, "mymyTab", "推荐"),
    [likes, setLikes] = useSkinState<string[]>(p, "mymyXLikes", []),
    [reposts, setReposts] = useSkinState<string[]>(p, "mymyXReposts", []),
    [marks, setMarks] = useSkinState<string[]>(p, "mymyXMarks", []),
    [query, setQuery] = useState("");
  const isLiked = (id: string) =>
    typeof p.ui?.["liked-" + id] === "boolean"
      ? Boolean(p.ui["liked-" + id])
      : likes.includes(id);
  const isSaved = (id: string) =>
    typeof p.ui?.["saved-" + id] === "boolean"
      ? Boolean(p.ui["saved-" + id])
      : marks.includes(id);
  const toggle = (id: string, v: string[], set: (x: string[]) => void) =>
    set(v.includes(id) ? v.filter((x) => x !== id) : [...v, id]);
  return (
    <div
      className={"mymy-ui mymy-x " + (dark ? "x-reference-dark" : "")}
      data-mymy="twitter"
    >
      <div className="kzxw">
        <header className="kzxh">
          <button aria-label="关闭当前App" onClick={p.onBack}>
            <ArrowLeft />
          </button>
          <div className="kzxlg">𝕏</div>
          <button aria-label="切换X外观" onClick={() => setDark(!dark)}>
            <User />
          </button>
        </header>
        <div className="kzxtb">
          {["为你推荐", "正在关注", "添加 +", "时间"].map((t) => (
            <button
              className={t === tab ? "on" : ""}
              key={t}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>
        {tab === "搜索" && (
          <input
            className="mymy-search"
            aria-label="搜索X"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索"
          />
        )}
        <div className="kzxfd">
          {p.items
            .filter((i) => (i.title + i.body).includes(query))
            .map((i) => (
              <article className="kzxt" key={i.id}>
                <Avatar name={i.sender} src={xAvatarSrc(String(i.meta?.handle || "")) || i.avatar} />
                <div className="kzxb">
                  <div className="kzxn">
                    <b>{i.sender}</b>
                    <small>
                      @{i.meta.handle || "user"} · {i.time.slice(-5)}
                    </small>
                    <em>
                      <MoreHorizontal size={18} />
                    </em>
                  </div>
                  <button
                    className="kzxx"
                    onClick={() => {
                      read(p, i);
                      p.onItem(i);
                    }}
                  >
                    {i.body}
                  </button>
                  <XPostGallery item={i} />
                  {i.media && (
                    <button
                      className="kzxv"
                      aria-label="打开媒体"
                      onClick={() => p.onItem(i)}
                    >
                      <Media item={i} />
                    </button>
                  )}
                  <div className="kzxac">
                    <button
                      aria-label={"评论" + i.title}
                      onClick={() => p.onItem(i)}
                    >
                      <MessageCircle />
                      {i.meta.commentCount || i.meta.originalCounts?.split("/")[0]?.trim() || i.comments.length}
                    </button>
                    <button
                      aria-label={"转发" + i.title}
                      aria-pressed={reposts.includes(i.id)}
                      onClick={() => toggle(i.id, reposts, setReposts)}
                    >
                      <Repeat2 />
                      {reposts.includes(i.id) ? 1 : 0}
                    </button>
                    <button
                      aria-label={"点赞" + i.title}
                      aria-pressed={isLiked(i.id)}
                      onClick={() => {
                        toggle(i.id, likes, setLikes);
                        p.onUi?.("liked-" + i.id, !isLiked(i.id));
                      }}
                    >
                      <Heart fill={isLiked(i.id) ? "#f91880" : "none"} />
                      {i.likes + (isLiked(i.id) ? 1 : 0)}
                    </button>
                    <span>
                      <BarChart2 />
                      {i.meta.views || "—"}
                    </span>
                    <button
                      aria-label={"收藏" + i.title}
                      aria-pressed={isSaved(i.id)}
                      onClick={() => {
                        toggle(i.id, marks, setMarks);
                        p.onUi?.("saved-" + i.id, !isSaved(i.id));
                      }}
                    >
                      <Bookmark />
                    </button>
                    <button aria-label="分享" onClick={() => p.onItem(i)}>
                      <Share />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          {!p.items.length && <Blank />}
        </div>
        <nav className="kzxnav">
          {[Home, Search, Bell, MessageCircle].map((Icon, n) => (
            <button
              key={n}
              aria-label={["时间线", "搜索", "通知", "私信"][n]}
              onClick={() => n < 2 && setTab(n ? "搜索" : "推荐")}
              disabled={n > 1}
            >
              <Icon />
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
