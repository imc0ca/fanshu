import { calendarEntries, type CalendarEntry } from "../calendarEntries";
import { setPhotoSequence } from "../ios/Details";
import { PersistentSpotifyPlayer, playSpotify } from "../PersistentSpotifyPlayer";
export { WeatherSkin, HealthSkin } from "./CalibratedSystemApps";
import { useSkinState } from "../skinState";
import {
  Calendar,
  Camera,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  FileText,
  Folder,
  Globe,
  Grid,
  Heart,
  Image,
  LockKeyhole,
  MapPin,
  Music,
  Phone,
  Search,
  Star,
  Users,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import { download } from "../io";
import { type Item } from "../schema";
import {
  Add,
  Avatar,
  Empty,
  groupItems,
  Header,
  Media,
  meta,
  Row,
  SearchBox,
  Tabs,
  useContent,
  type Props,
} from "./shared";
export function PhoneSkin(p: Props) {
  const { tab, setTab, q, setQ, items } = useContent(p, "最近通话");
  const [digits, setDigits] = useState(""),
    [call, setCall] = useState("");
  const list = tab === "收藏" ? items.filter((i) => i.favorite) : items;
  return (
    <div className="catalog-skin native-phone">
      <Header p={p} />
      <div className="catalog-scroll">
        <h1>{tab}</h1>
        {tab === "拨号键盘" ? (
          <div className="dialer">
            <output>{digits || "输入号码"}</output>
            <div>
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map(
                (k) => (
                  <button key={k} onClick={() => setDigits((s) => s + k)}>
                    {k}
                    <small>
                      {
                        (
                          {
                            "2": "ABC",
                            "3": "DEF",
                            "4": "GHI",
                            "5": "JKL",
                            "6": "MNO",
                            "7": "PQRS",
                            "8": "TUV",
                            "9": "WXYZ",
                          } as Record<string, string>
                        )[k]
                      }
                    </small>
                  </button>
                ),
              )}
            </div>
            <button
              className="dial-call"
              disabled={!digits}
              aria-label="模拟拨号"
              onClick={() => {
                setCall(digits);
                const i = items.find((i) => meta(i, "number") === digits);
                if (i) p.onRead(i.id);
              }}
            >
              <Phone size={24} />
            </button>
            <button onClick={() => setDigits((s) => s.slice(0, -1))}>
              删除
            </button>
          </div>
        ) : (
          <>
            <SearchBox value={q} set={setQ} />
            {list.map((i) => (
              <button
                className={`call-row ${meta(i, "status") === "未接" ? "missed" : ""}`}
                key={i.id}
                onClick={() => p.onItem(i)}
              >
                <Phone size={17} />
                <span>
                  <strong>{i.title}</strong>
                  <small>
                    {meta(i, "number", i.sender)} ·{" "}
                    {meta(i, "status", "通话记录")}
                  </small>
                </span>
                <time>{i.time.slice(5, 10)}</time>
              </button>
            ))}
            <Empty items={list} />
          </>
        )}
      </div>
      <Tabs
        tabs={["收藏", "最近通话", "通讯录", "拨号键盘"]}
        value={tab}
        set={setTab}
        icons={[<Star />, <Clock />, <Users />, <Grid />]}
      />
      {call && (
        <div className="virtual-call">
          <small>虚拟通话</small>
          <Avatar name={call} />
          <h2>{call}</h2>
          <p>这是作品内的通话模拟</p>
          <button aria-label="挂断" onClick={() => setCall("")}>
            <Phone />
          </button>
        </div>
      )}
    </div>
  );
}
export function ContactsSkin(p: Props) {
  const { q, setQ, items } = useContent(p, "所有联系人");
  return (
    <div className="catalog-skin native-contacts">
      <Header p={p} />
      <div className="catalog-scroll">
        <h1>通讯录</h1>
        <SearchBox value={q} set={setQ} />
        <button
          className="contact-self"
          onClick={() => {
            if (items[0]) p.onItem(items[0]);
            else if (p.creator) p.onAdd();
          }}
        >
          <Avatar name={p.owner ?? "我"} />
          <span>
            <strong>{p.owner ?? "我的名片"}</strong>
            <small>我的名片</small>
          </span>
        </button>
        {groupItems(items, "所有联系人").map((g) => (
          <section key={g}>
            <h4 className="native-section">{g}</h4>
            {items
              .filter((i) => (i.folder || "所有联系人") === g)
              .sort((a, b) => a.title.localeCompare(b.title, "zh-CN"))
              .map((i) => (
                <Row
                  key={i.id}
                  item={i}
                  onItem={p.onItem}
                  leading={<Avatar name={i.title} />}
                />
              ))}
          </section>
        ))}
        <Empty items={items} />
      </div>
    </div>
  );
}
export function PhotosSkin(p: Props) {
  const { tab, setTab, q, setQ, items: originalItems } = useContent(p, "图库");
  const charlieDates = [
    "2021-06-12", "2021-10-17", "2022-05-08", "2022-12-04",
    "2023-07-23", "2023-11-19", "2024-04-14", "2024-08-25",
    "2025-02-05", "2025-02-05", "2026-01-01", "2026-05-22", "2026-09-29",
  ];
  const charlieItems: Item[] = charlieDates.map((date, index) => ({
    id: `charlie-photo-${index + 1}`,
    title: `查理 · ${date}`,
    body: `查理相册 · ${date}`,
    richText: "",
    meta: { date, album: "查理" },
    time: date,
    sender: "相册",
    avatar: "",
    kind: "image",
    media: `/fanshu/charlie-${String(index + 1).padStart(2, "0")}.png`,
    hidden: false,
    unlock: "",
    password: "",
    folder: "查理",
    favorite: false,
    outgoing: false,
    read: true,
    likes: 0,
    comments: [],
  }));
  // Static photo assets are shipped separately in public/photo-library and public/dadabendan.
  // All appear in the main library; only the new set belongs to 大大笨蛋.
  const galleryItems: Item[] = Array.from({ length: 20 }, (_, index) => ({
    id: `gallery-photo-${index + 1}`, title: `照片 ${index + 1}`, body: "", richText: "",
    meta: { album: "普通照片" }, time: "", sender: "相册", avatar: "",
    kind: "image", media: `/fanshu/gallery-${String(index + 1).padStart(2, "0")}.jpg`,
    hidden: false, unlock: "", password: "", folder: "普通照片", favorite: false,
    outgoing: false, read: true, likes: 0, comments: [],
  }));
  const standaloneGalleryItems: Item[] = Array.from({ length: 17 }, (_, index) => ({
    id: `gallery-extra-${index + 1}`, title: `照片 ${index + 1}`, body: "", richText: "",
    meta: { album: "首页照片" }, time: "", sender: "相册", avatar: "",
    kind: "image", media: `/fanshu/gallery-extra-${String(index + 1).padStart(2, "0")}.jpeg`,
    hidden: false, unlock: "", password: "", folder: "首页照片", favorite: false,
    outgoing: false, read: true, likes: 0, comments: [],
  }));
  const originalDadabendanItems: Item[] = Array.from({ length: 20 }, (_, index) => ({
    id: `dadabendan-original-${index + 1}`, title: `大大笨蛋 原始 ${index + 1}`, body: "", richText: "",
    meta: { album: "大大笨蛋" }, time: "", sender: "相册", avatar: "",
    kind: "image",
    media: `/fanshu/dadabendan-original/dadabendan-${String(index + 1).padStart(2, "0")}.${index >= 18 ? "png" : "jpeg"}`,
    hidden: false, unlock: "", password: "", folder: "大大笨蛋", favorite: false,
    outgoing: false, read: true, likes: 0, comments: [],
  }));
  const dadabendanExtensions = ["jpeg","jpeg","jpeg","png","jpeg","jpeg","jpeg","jpeg","jpeg","jpeg","jpeg","jpeg","jpeg","jpeg","jpeg","jpeg","jpeg","jpeg","jpeg","png"];
  const dadabendanItems: Item[] = dadabendanExtensions.map((ext, index) => ({
    id: `dadabendan-photo-${index + 1}`, title: `大大笨蛋 ${index + 21}`, body: "", richText: "",
    meta: { album: "大大笨蛋" }, time: "", sender: "相册", avatar: "",
    kind: "image", media: `/fanshu/dadabendan-${String(index + 1).padStart(2, "0")}.${ext}`,
    hidden: false, unlock: "", password: "", folder: "大大笨蛋", favorite: false,
    outgoing: false, read: true, likes: 0, comments: [],
  }));
  const items = [
    ...originalItems,
    ...standaloneGalleryItems.filter((i) => (i.title + i.body).toLowerCase().includes(q.toLowerCase())),
    ...galleryItems.filter((i) => (i.title + i.body + i.folder).toLowerCase().includes(q.toLowerCase())),
    ...originalDadabendanItems.filter((i) => (i.title + i.body + i.folder).toLowerCase().includes(q.toLowerCase())),
    ...dadabendanItems.filter((i) => (i.title + i.body + i.folder).toLowerCase().includes(q.toLowerCase())),
    ...charlieItems.filter((i) =>
      (i.title + i.body + i.folder).toLowerCase().includes(q.toLowerCase()),
    ),
  ];
  // Keep photo shoots together instead of scattering photos from the same session.
  // The three known duplicate files remain in their albums but appear only once in the library.
  const duplicateOriginalIds = new Set([
    "dadabendan-original-4", "dadabendan-original-19", "dadabendan-original-20",
  ]);
  const dedupedItems = items.filter((item) => !duplicateOriginalIds.has(item.id));
  const extras = dedupedItems.filter((item) => item.id.startsWith("gallery-extra-"));
  const regular = dedupedItems.filter((item) => !item.id.startsWith("gallery-extra-"));
  const galleryStart = regular.findIndex((item) => item.id === "gallery-photo-1");
  const insertAt = galleryStart < 0 ? regular.length : galleryStart + 8;
  const flowingItems = [...regular.slice(0, insertAt), ...extras.slice(0, 9), ...regular.slice(insertAt), ...extras.slice(9)];
  const [album, setAlbum] = useState("");
  const list =
    tab === "收藏"
      ? items.filter((i) => i.favorite)
      : album
        ? items.filter((i) => (i.folder || "未分类") === album)
        : flowingItems;
  return (
    <div className="catalog-skin native-photos">
      <Header p={p} />
      <div className="catalog-scroll">
        <h1>{album || tab}</h1>
        {tab === "相簿" && !album ? (
          <div className="album-grid">
            {["大大笨蛋", "查理"].filter((g) => items.some((i) => i.folder === g)).map((g) => (
              <button key={g} onClick={() => setAlbum(g)}>
                <Media
                  item={g === "大大笨蛋" ? originalDadabendanItems[3] : items.find((i) => (i.folder || "未分类") === g)!}
                />
                <strong>{g}</strong>
                <small>
                  {items.filter((i) => (i.folder || "未分类") === g).length} 项
                </small>
              </button>
            ))}
          </div>
        ) : (
          <>
            <SearchBox value={q} set={setQ} />
            <div className="photo-mosaic">
              {list.map((i) => (
                <button
                  aria-label={`查看${i.title}`}
                  key={i.id}
                  onClick={() => { setPhotoSequence(list); p.onItem(i); }}
                >
                  {i.media ? <img src={i.media} alt={i.title} loading="eager" decoding="async" /> : <Media item={i} />}
                  {i.favorite && <Heart size={12} fill="white" />}
                </button>
              ))}
            </div>
            <p className="media-count">{list.length} 个项目</p>
          </>
        )}
        <Empty items={list} />
      </div>
      <Tabs
        tabs={["图库", "相簿", "收藏"]}
        value={tab}
        set={(t) => {
          setTab(t);
          setAlbum("");
        }}
        icons={[<Image />, <Folder />, <Heart />]}
      />
    </div>
  );
}
export function CameraSkin(p: Props) {
  const [mode, setMode] = useState("照片"),
    [index, setIndex] = useState(0);
  const frames = p.items.filter((i) =>
    mode === "视频" ? i.kind === "video" : i.kind !== "video",
  );
  const frame = frames[index % Math.max(frames.length, 1)];
  return (
    <div className="catalog-skin native-camera">
      <Header p={p} />
      <div className="camera-top">
        <span>闪光灯关闭</span>
        <span>{mode === "视频" ? "HD · 30" : "4:3"}</span>
      </div>
      <div className="camera-view">
        {frame ? <Media item={frame} /> : <p>未设置取景画面</p>}
        <div className="camera-grid" />
      </div>
      <div className="camera-mode">
        {["视频", "照片"].map((m) => (
          <button
            className={mode === m ? "selected" : ""}
            key={m}
            onClick={() => {
              setMode(m);
              setIndex(0);
            }}
          >
            {m}
          </button>
        ))}
      </div>
      <div className="camera-controls">
        <button
          aria-label="查看上一画面"
          disabled={!frames.length}
          onClick={() => setIndex((i) => (i + 1) % frames.length)}
        >
          <Image size={24} />
        </button>
        <button
          className="camera-shutter"
          aria-label={p.creator ? "编辑拍摄画面" : "查看拍摄内容"}
          disabled={!p.creator && !frame}
          onClick={() => (p.creator ? p.onAdd() : frame && p.onItem(frame))}
        >
          <span />
        </button>
        <button
          aria-label="切换取景画面"
          disabled={frames.length < 2}
          onClick={() => setIndex((i) => i + 1)}
        >
          <Camera size={24} />
        </button>
      </div>
      <small className="camera-caption">作者设置的虚构取景内容</small>
    </div>
  );
}
export function SafariSkin(p: Props) {
  const [q, setQ] = useState(""),
    [tab, setTab] = useState("书签");
  const items = p.items
    .filter((i) =>
      (i.title + i.body + meta(i, "url"))
        .toLowerCase()
        .includes(q.toLowerCase()),
    )
    .filter((i) =>
      tab === "书签"
        ? i.favorite || i.folder !== "历史记录"
        : i.folder === "历史记录",
    );
  return (
    <div className="catalog-skin native-safari">
      <Header p={p} />
      <div className="catalog-scroll">
        <h1>{tab}</h1>
        <div className="safari-favorites">
          {items.map((i) => (
            <button key={i.id} onClick={() => p.onItem(i)}>
              <span>
                <Globe size={28} />
              </span>
              <strong>{i.title}</strong>
              <small>{meta(i, "url")}</small>
            </button>
          ))}
        </div>
        <Empty items={items} label="没有匹配的虚构网页" />
      </div>
      <label className="safari-address">
        <LockKeyhole size={13} />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜索或输入虚构网址"
          aria-label="地址栏"
          onKeyDown={(e) => {
            if (e.key === "Enter" && items[0]) p.onItem(items[0]);
          }}
        />
        <Search size={16} />
      </label>
      <Tabs
        tabs={["书签", "历史记录"]}
        value={tab}
        set={setTab}
        icons={[<Globe />, <Clock />]}
      />
    </div>
  );
}
export function NotesSkin(p: Props) {
  const { q, setQ, items } = useContent(p, "备忘录");
  const [folder, setFolder] = useState<string | null>(null);
  const list = folder
    ? items.filter((i) => (i.folder || "备忘录") === folder)
    : items;
  return (
    <div className="catalog-skin native-notes">
      <Header p={p} />
      <div className="catalog-scroll">
        <button className="notes-back" onClick={() => setFolder(null)}>
          <Folder size={17} />
          文件夹
        </button>
        <h1>{folder || "所有备忘录"}</h1>
        <SearchBox value={q} set={setQ} />
        {!folder && (
          <div className="note-folders">
            {groupItems(items, "备忘录").map((g) => (
              <button key={g} onClick={() => setFolder(g)}>
                <Folder size={17} />
                {g}
                <small>
                  {items.filter((i) => (i.folder || "备忘录") === g).length}
                </small>
              </button>
            ))}
          </div>
        )}
        <div className="notes-list">
          {list.map((i) => (
            <button key={i.id} onClick={() => p.onItem(i)}>
              <strong>
                {i.password && <LockKeyhole size={12} />} {i.title}
              </strong>
              <p>
                <time>{i.time.slice(5, 10)}</time>{" "}
                {i.password ? "已锁定的备忘录" : i.body.split("\n")[0]}
              </p>
              <small>{i.folder}</small>
            </button>
          ))}
        </div>
        <Empty items={list} />
      </div>
      <div className="notes-footer">
        <span>{list.length} 则备忘录</span>
        <Add p={p} label="新建备忘录" />
      </div>
    </div>
  );
}
export function CalendarSkin(p: Props) {
  const [month,setMonth]=useState(8),[year,setYear]=useState(2024),[day,setDay]=useState(2);
  const prefix=`${year}-${String(month+1).padStart(2,"0")}`;
  const dateKey=`${prefix}-${String(day).padStart(2,"0")}`;
  const storyEntries:CalendarEntry[]=p.items.map(i=>({date:i.time.slice(0,10),title:i.title,start:/[0-9]{2}:[0-9]{2}/.test(i.time.slice(11))?i.time.slice(11,16):undefined,location:meta(i,"location",i.body)}));
  const all=[...calendarEntries,...storyEntries];
  const list=all.filter(i=>i.date===dateKey).sort((a,b)=>(a.start||"").localeCompare(b.start||""));
  const move=(d:number)=>{const date=new Date(Date.UTC(year,month+d,1));setYear(date.getUTCFullYear());setMonth(date.getUTCMonth());setDay(1);};
  const first=new Date(Date.UTC(year,month,1)).getUTCDay();
  const days=new Date(Date.UTC(year,month+1,0)).getUTCDate();
  return <div className="catalog-skin native-calendar">
    <Header p={p}/>
    <div className="catalog-scroll">
      <div className="month-title">
        <button aria-label="上个月" onClick={()=>move(-1)}><ChevronLeft/></button>
        <h2>{year} 年 {month+1} 月</h2>
        <button aria-label="下个月" onClick={()=>move(1)}><ChevronRight/></button>
      </div>
      <div className="calendar-grid">
        {["日","一","二","三","四","五","六"].map(t=><small key={t}>{t}</small>)}
        {Array.from({length:first},(_,i)=><span key={"blank"+i}/>)}
        {Array.from({length:days},(_,i)=>{
          const date=`${prefix}-${String(i+1).padStart(2,"0")}`;
          const entries=all.filter(x=>x.date===date);
          return <button className="calendar-day-cell" aria-label={`${month+1}月${i+1}日，${entries.length}个日程`} key={i} onClick={()=>setDay(i+1)}>
            <span className={day===i+1?"calendar-day-number is-selected":"calendar-day-number"}>{i+1}</span>
            {entries.length>0&&<span className="calendar-day-dot" aria-hidden="true"/>}
          </button>;
        })}
      </div>
      <h4 className="native-section">{month+1} 月 {day} 日</h4>
      {list.map((entry,index)=><div className="calendar-event" key={entry.date+"-"+entry.title+"-"+index} style={{display:"flex",alignItems:"stretch",gap:10,marginBottom:8}}>
        <time style={{minWidth:88,whiteSpace:"nowrap"}}>{entry.start?entry.start+(entry.end?"–"+entry.end:""):"全天"}</time>
        <div style={{borderLeft:"5px solid "+(entry.category==="class"?"#4c86dd":"#e5a34c"),background:entry.category==="class"?"#eaf2ff":"#fff2df",padding:"9px 12px",borderRadius:8,flex:1,color:"#222"}}>
          <strong>{entry.title}</strong>{entry.location&&<p style={{margin:"4px 0 0",fontSize:12}}>{entry.location}</p>}
        </div>
      </div>)}
      {list.length===0&&<p style={{padding:16,color:"#888"}}>当天没有日程</p>}
      <Add p={p} label="添加日程"/>
    </div>
  </div>;
}
export function MailSkin(p: Props) {
  const { tab, setTab, q, setQ, items } = useContent(p, "收件箱");
  const list = items.filter(
    (i) =>
      tab === "全部邮件" ||
      i.folder === tab ||
      (tab === "收件箱" &&
        (!i.folder || !["草稿", "已发送"].includes(i.folder))),
  );
  return (
    <div className="catalog-skin native-mail">
      <Header p={p} />
      <div className="mail-folders">
        {["收件箱", "草稿", "已发送", "全部邮件"].map((t) => (
          <button
            key={t}
            className={tab === t ? "selected" : ""}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="catalog-scroll">
        <h1>{tab}</h1>
        <SearchBox value={q} set={setQ} />
        {list.map((i) => (
          <button
            className="mail-preview"
            key={i.id}
            onClick={() => p.onItem(i)}
          >
            <i className={!i.read ? "unread" : ""} />
            <div>
              <strong>{i.sender}</strong>
              <h3>{i.title}</h3>
              <p>{i.body}</p>
            </div>
            <time>{i.time.slice(5, 10)}</time>
          </button>
        ))}
        <Empty items={list} />
      </div>
      <footer className="mail-footer">
        <span>{list.length} 封邮件</span>
        <Add p={p} label="写邮件" />
      </footer>
    </div>
  );
}
export function ClockSkin(p: Props) {
  const [tab, setTab] = useState("世界时钟");
  const [enabled, setEnabled] = useSkinState<string[]>(p, "alarms-v2", ["wake-0830"]);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [running]);
  const cities = [
    { id: "tokyo", name: "东京", zone: "Asia/Tokyo" },
    { id: "seoul", name: "首尔", zone: "Asia/Seoul" },
    { id: "paris", name: "巴黎", zone: "Europe/Paris" },
    { id: "new-york", name: "纽约 · 美国", zone: "America/New_York" },
  ];
  const alarms = [
    { id: "wake-0830", clock: "08:30", label: "起床" },
    { id: "depart-1145", clock: "11:45", label: "出发" },
    { id: "early-0700", clock: "07:00", label: "早起" },
    { id: "morning-0915", clock: "09:15", label: "上午" },
    { id: "afternoon-1400", clock: "14:00", label: "提醒" },
    { id: "evening-1930", clock: "19:30", label: "晚上" },
  ];
  return (
    <div className="catalog-skin native-clock">
      <Header p={p} />
      <div className="catalog-scroll">
        <h1>{tab}</h1>
        {tab === "秒表" ? (
          <div className="stopwatch">
            <output>{String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}</output>
            <div>
              <button onClick={() => { setSeconds(0); setRunning(false); }}>复位</button>
              <button onClick={() => setRunning(!running)}>{running ? "暂停" : "开始"}</button>
            </div>
          </div>
        ) : tab === "世界时钟" ? (
          cities.map((city) => (
            <div className="alarm-row" key={city.id}>
              <div className="clock-entry">
                <time>{new Intl.DateTimeFormat("zh-CN", { timeZone: city.zone, hour: "2-digit", minute: "2-digit", hour12: false }).format(now)}</time>
                <small>{city.name}</small>
              </div>
              <Globe size={25} />
            </div>
          ))
        ) : (
          alarms.map((alarm) => (
            <div className="alarm-row" key={alarm.id}>
              <div className="clock-entry">
                <time>{alarm.clock}</time>
                <small>{alarm.label}</small>
              </div>
              <button
                role="switch"
                aria-label={`闹钟${alarm.clock} ${alarm.label}`}
                aria-checked={enabled.includes(alarm.id)}
                className={`native-switch ${enabled.includes(alarm.id) ? "on" : ""}`}
                onClick={() => setEnabled(enabled.includes(alarm.id) ? enabled.filter((id) => id !== alarm.id) : [...enabled, alarm.id])}
              ><span /></button>
            </div>
          ))
        )}
      </div>
      <Tabs tabs={["世界时钟", "闹钟", "秒表"]} value={tab} set={setTab} icons={[<Globe />, <Clock />, <Clock />]} />
    </div>
  );
}
export function RemindersSkin(p: Props) {
  const { tab, setTab, q, setQ, items } = useContent(p, "全部");
  const [checked, setChecked] = useSkinState<string[]>(p, "checked", []);
  const list =
    tab === "已完成"
      ? items.filter((i) => checked.includes(i.id))
      : items.filter((i) => !checked.includes(i.id));
  return (
    <div className="catalog-skin native-reminders">
      <Header p={p} />
      <div className="catalog-scroll">
        <SearchBox value={q} set={setQ} />
        <div className="reminder-categories">
          {["全部", "已完成"].map((t) => (
            <button key={t} onClick={() => setTab(t)}>
              <Calendar size={22} />
              <strong>
                {t === "全部" ? items.length - checked.length : checked.length}
              </strong>
              <span>{t}</span>
            </button>
          ))}
        </div>
        <h1>{tab}</h1>
        {list.map((i) => (
          <div className="reminder-row" key={i.id}>
            <button
              aria-label={`完成${i.title}`}
              role="checkbox"
              aria-checked={checked.includes(i.id)}
              onClick={() =>
                setChecked(
                  checked.includes(i.id)
                    ? checked.filter((x) => x !== i.id)
                    : [...checked, i.id],
                )
              }
            >
              <CheckCircle size={21} />
            </button>
            <button onClick={() => p.onItem(i)}>
              <strong>{i.title}</strong>
              <small>
                {i.time} · {i.folder}
              </small>
            </button>
          </div>
        ))}
        <Add p={p} label="新提醒事项" />
      </div>
    </div>
  );
}
export function FilesSkin(p: Props) {
  const { tab, setTab, q, setQ, items } = useContent(p, "最近项目");
  const [folder, setFolder] = useState("");
  const list = folder
    ? items.filter((i) => (i.folder || "我的iPhone") === folder)
    : items;
  return (
    <div className="catalog-skin native-files">
      <Header p={p} />
      <div className="catalog-scroll">
        <h1>{folder || tab}</h1>
        <SearchBox value={q} set={setQ} />
        {tab === "浏览" && !folder ? (
          <div className="file-folders">
            {groupItems(items, "我的iPhone").map((g) => (
              <button key={g} onClick={() => setFolder(g)}>
                <Folder size={45} />
                <strong>{g}</strong>
              </button>
            ))}
          </div>
        ) : (
          <div className="file-grid">
            {!folder && <div><button type="button" aria-label="简历（内容待添加）" style={{cursor:"default"}}><FileText size={49} /><strong>简历</strong><small>内容待添加</small></button></div>}
            {list.map((i) => (
              <div key={i.id}>
                <button onClick={() => p.onItem(i)}>
                  {i.media ? <Media item={i} /> : <FileText size={49} />}
                  <strong>{i.title}</strong>
                  <small>
                    {meta(i, "extension", "文件")} ·{" "}
                    {meta(i, "size", i.time.slice(0, 10))}
                  </small>
                </button>
                <button
                  aria-label={`下载${i.title}文本`}
                  onClick={() =>
                    download(
                      new Blob([i.body], { type: "text/plain" }),
                      `${i.title}.txt`,
                    )
                  }
                >
                  <Download size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
        <Empty items={list} />
      </div>
      <Tabs
        tabs={["最近项目", "浏览"]}
        value={tab}
        set={(t) => {
          setTab(t);
          setFolder("");
        }}
        icons={[<Clock />, <Folder />]}
      />
    </div>
  );
}
export function MusicSkin(p: Props) {
  const { tab, setTab, items } = useContent(p, "资料库");
  return (
    <div className="catalog-skin native-music">
      <Header p={p} />
      <div className="catalog-scroll">
        <h1>{tab}</h1>
        {tab === "歌单" ? (
          <div className="music-albums">
            {groupItems(items, "我的音乐").map((g) => (
              <button key={g} onClick={() => {
                const first = items.find(i => (i.folder || "我的音乐") === g);
                if (first) playSpotify(first, items);
                setTab("资料库");
              }}>
                <Music size={51} />
                <strong>{g}</strong>
              </button>
            ))}
          </div>
        ) : items.map((i, n) => (
          <button className="music-track" key={i.id} onClick={() => playSpotify(i, items)}>
            <small>{n + 1}</small>
            <span>
              <strong>{i.title}</strong>
              <small>{i.sender} · {meta(i, "album")}</small>
            </span>
            <span>{meta(i, "duration")}</span>
          </button>
        ))}
        <Empty items={items} />
      </div>
      <PersistentSpotifyPlayer items={items} musicStyle />
      <Tabs tabs={["资料库", "歌单"]} value={tab} set={setTab} icons={[<Music />, <Folder />]} />
    </div>
  );
}
function LocationMap({
  items,
  onItem,
  find = false,
}: {
  items: Item[];
  onItem: (i: Item) => void;
  find?: boolean;
}) {
  return (
    <div className={`fiction-map ${find ? "find-map" : ""}`}>
      <svg viewBox="0 0 300 300" aria-label="原创虚构地图">
        <rect width="300" height="300" fill="#e4e5d8" />
        {[35, 100, 190, 260].map((n) => (
          <path
            key={n}
            d={`M0 ${n} H300 M${n} 0 V300`}
            stroke="#fff"
            strokeWidth="11"
          />
        ))}
        <path
          d="M20 0 Q190 110 120 300"
          stroke="#b6d8df"
          strokeWidth="24"
          fill="none"
        />
        <rect x="205" y="112" width="42" height="65" rx="7" fill="#bdcfac" />
      </svg>
      {items.map((i, n) => (
        <button
          key={i.id}
          aria-label={`地图位置${i.title}`}
          className="map-pin"
          style={{
            left: `${Math.max(5, Math.min(90, Number(meta(i, "x", String(20 + ((n * 17) % 65))))))}%`,
            top: `${Math.max(8, Math.min(80, Number(meta(i, "y", String(25 + ((n * 13) % 50))))))}%`,
          }}
          onClick={() => onItem(i)}
        >
          {find ? <Avatar name={i.title} /> : <MapPin size={24} />}
        </button>
      ))}
    </div>
  );
}
export function MapsSkin(p: Props) {
  const { q, setQ, items } = useContent(p, "地点");
  return (
    <div className="catalog-skin native-maps">
      <Header p={p} />
      <LocationMap items={items} onItem={p.onItem} />
      <div className="map-sheet">
        <SearchBox value={q} set={setQ} placeholder="搜索虚构地点" />
        <div className="map-places">
          {items.map((i) => (
            <Row key={i.id} item={i} onItem={p.onItem} leading={<MapPin />} />
          ))}
        </div>
      </div>
    </div>
  );
}
export function WalletSkin(p: Props) {
  const [selected, setSelected] = useState("");
  const cards = p.items.filter((i) => i.folder !== "交易"),
    transactions = p.items.filter((i) => i.folder === "交易");
  return (
    <div className="catalog-skin native-wallet">
      <Header p={p} />
      <div className="catalog-scroll">
        <h1>钱包</h1>
        <div className="wallet-stack">
          {cards.map((i, n) => (
            <button
              key={i.id}
              className={selected === i.id ? "selected" : ""}
              style={{
                background: ["#252d38", "#716456", "#4a655d", "#735e6b"][n % 4],
              }}
              onClick={() => {
                setSelected(i.id);
                p.onItem(i);
              }}
            >
              <strong>{i.title}</strong>
              <span>{meta(i, "number", "••••")}</span>
              <small>{meta(i, "amount", i.sender)}</small>
            </button>
          ))}
        </div>
        <h4 className="native-section">交易记录</h4>
        {transactions.map((i) => (
          <Row key={i.id} item={i} onItem={p.onItem} leading={<Wallet />}>
            <strong>{meta(i, "amount")}</strong>
          </Row>
        ))}
        <Empty items={p.items} />
      </div>
    </div>
  );
}
export function FindSkin(p: Props) {
  const { tab, setTab, items } = useContent(p, "设备");
  const list = items.filter((i) =>
    tab === "设备" ? i.folder !== "人物" : i.folder === "人物",
  );
  return (
    <div className="catalog-skin native-find">
      <Header p={p} />
      <LocationMap items={list} onItem={p.onItem} find />
      <div className="find-sheet">
        <h2>{tab}</h2>
        {list.map((i) => (
          <Row
            key={i.id}
            item={i}
            onItem={p.onItem}
            leading={<Avatar name={i.title} />}
          >
            {meta(i, "status", "位置记录")}
          </Row>
        ))}
        <Empty items={list} />
      </div>
      <Tabs
        tabs={["人物", "设备"]}
        value={tab}
        set={setTab}
        icons={[<Users />, <MapPin />]}
      />
    </div>
  );
}
