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
  const [april8Complete, setApril8Complete] = useSkinState<boolean>(p, "dongchanApril8Complete", false);
  // Scripted April 8 conversation: earlier messages stay visible without interaction.
  const [scriptCount, setScriptCount] = useState(0);
  const [scriptStarted, setScriptStarted] = useState(false);
  const [lastUnreadCleared, setLastUnreadCleared] = useState(false);
  const scroll = useRef<HTMLDivElement>(null);
  const scripted = p.thread === "咚灿"
    ? p.items.filter((m) => m.title === "咚灿" && m.meta?.interactive === "true")
    : [];
  const nextScript = scripted[scriptCount];
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
  const list = grouped(p.items.filter((m) => m.meta?.interactive !== "true" || april8Complete)).sort((a, b) => {
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
              if (p.thread === "咚灿" && scriptStarted && scriptCount >= scripted.length) setApril8Complete(true);
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
                      {april910Unread(m) ? <span className="kkt-script-unread">1</span> : (m.meta?.interactivePhase === "april9-10" ? "" : (m.meta.unread || ""))}
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
                if (scriptCount + 1 >= scripted.length) setApril8Complete(true);
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
export function MymyInstagram(p: SkinProps) {
  const [tab, setTab] = useSkinState<string>(p, "mymyTab", "主页"),
    [liked, setLiked] = useSkinState<string[]>(p, "mymyLiked", []),
    [saved, setSaved] = useSkinState<string[]>(p, "mymySaved", []),
    [replies, setReplies] = useSkinState<string[]>(p, "mymyReplies", []),
    [seen, setSeen] = useSkinState<string[]>(p, "mymySeen", []);
  const [sheet, setSheet] = useState<Item | null>(null),
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
            onClick={() => (selected ? setSelected(null) : p.onBack())}
          >
            <ArrowLeft />
          </button>
          <span className="igl2">
            {selected ? "帖子" : tab === "主页" ? "Instagram" : tab}
          </span>
          <button aria-label="打开私信" onClick={() => setTab("私信")}>
            <Send />
          </button>
        </header>
        <div className="igb">
          {selected && post(selected)}
          {!selected && tab === "主页" && (
            <>
              <div className="sts">
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
              {posts.map(post)}
              {!posts.length && <Blank />}
            </>
          )}
          {!selected && tab === "个人主页" && (
            <>
              <div className="pf">
                <Avatar name={p.owner || "机主"} />
                <div className="ps">
                  <div>
                    <b>{posts.length}</b>
                    <small>帖子</small>
                  </div>
                  <div>
                    <b>—</b>
                    <small>粉丝</small>
                  </div>
                  <div>
                    <b>—</b>
                    <small>关注</small>
                  </div>
                </div>
              </div>
              <p className="pn">{p.owner}</p>
              <div className="ptab">
                <div className="on">
                  <Grid />
                </div>
              </div>
              <div className="pg2">
                {posts.map((i) => (
                  <button key={i.id} onClick={() => openPost(i)}>
                    <Media item={i} />
                  </button>
                ))}
              </div>
            </>
          )}
          {!selected && tab === "私信" && (
            <>
              {dms.map((i) => (
                <button className="kzkr" key={i.id} onClick={() => openPost(i)}>
                  <Avatar name={i.sender} src={i.avatar} />
                  <span className="kzkn">
                    <b>{i.title}</b>
                    <small>{i.body}</small>
                  </span>
                </button>
              ))}
              {!dms.length && <Blank />}
            </>
          )}
          {!selected && tab === "搜索" && (
            <>
              <input
                className="mymy-search"
                aria-label="搜索Instagram"
                placeholder="搜索"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
              />
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
                !selected && tab === ["主页", "搜索", "私信", "个人主页"][n]
              }
              onClick={() => {
                setSelected(null);
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
