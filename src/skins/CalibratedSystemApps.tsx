import { useState } from "react";
import {
  Heart,
  Users,
  Grid2X2,
  Flame,
  Bed,
  Footprints,
  ChevronRight,
  ChevronLeft,
  User,
  Plus,
  MoonStar,
  Sunrise,
  CloudSun,
  Droplet,
  Wind,
  Map,
  List,
  Cloud,
  Sun,
  CloudRain,
  Activity,
  Search,
} from "lucide-react";
import { useSkinState } from "../skinState";
import type { Item } from "../schema";
import { meta, type Props } from "./shared";
import "../ios/native-apps.css";
const healthTypes = [
  { id: "cycle", title: "经期追踪", icon: Activity, color: "#7361ff" },
  { id: "activity", title: "健身记录", icon: Flame, color: "#ff5900" },
  { id: "sleep", title: "睡眠评分", icon: Bed, color: "#7361ff" },
  { id: "steps", title: "步数", icon: Footprints, color: "#ff5900" },
];
function seriesFor(item: Item | undefined) {
  try {
    const values = JSON.parse(meta(item, "series", "[]"));
    return Array.isArray(values)
      ? values
          .filter((v) => typeof v === "number" && Number.isFinite(v) && v >= 0)
          .slice(0, 30)
      : [];
  } catch {
    return [];
  }
}
function recordFor(items: Item[], key: string) {
  const map: Record<string, string[]> = {
    cycle: ["经期", "月经"],
    activity: ["活动", "健身"],
    sleep: ["睡眠"],
    steps: ["步数"],
  };
  return items.find((i) =>
    map[key].some((s) => meta(i, "metric", i.title).includes(s)),
  );
}
const healthSamples: Record<string, number[]> = {
  activity: [386, 512, 438, 465, 352, 548, 420, 479, 390, 456, 505, 370, 441, 420],
  sleep: [7.2, 7.8, 7.4, 8.1, 6.8, 7.6, 7.5, 7.9, 7.1, 7.4, 8.0, 7.2, 7.6, 7.5],
  steps: [5820, 7120, 6340, 7910, 4980, 6800, 6530, 7420, 5580, 6170, 7030, 5890, 6680, 6500],
};
const healthDefaults: Record<string, { value: string; unit: string; description: string }> = {
  activity: { value: "420", unit: "千卡", description: "每日活动目标 420 千卡 · 平均每周健身 3 次" },
  sleep: { value: "7小时30分钟", unit: "", description: "深度睡眠 30% · 核心睡眠 55% · 快速动眼睡眠 10% · 清醒 5%" },
  steps: { value: "6,500", unit: "步/天", description: "每日步数随活动量变化，平均约 6,500 步" },
};
export function HealthSkin(p: Props) {
  const [tab, setTab] = useSkinState<string>(p, "tab", "摘要"),
    [pins, setPins] = useSkinState<string[]>(
      p,
      "pins",
      p.items.some((i) => recordFor([i], "cycle"))
        ? ["cycle", "activity", "sleep", "steps"]
        : ["activity", "sleep", "steps"],
    );
  const [period, setPeriod] = useState("周");
  const [editing, setEditing] = useState(false),
    [detail, setDetail] = useState(""),
    [profile, setProfile] = useState(false);
  const current = recordFor(p.items, detail);
  const open = (key: string) => {
    const i = recordFor(p.items, key);
    if (i && p.creator) {
      p.onItem(i);
      return;
    }
    if (i?.password) {
      p.onItem(i);
      return;
    }
    if (i) p.onRead(i.id);
    setDetail(key);
  };
  return (
    <div className="catalog-skin native-health calibrated-health">
      <header className="health-native-nav">
        {detail || profile ? (
          <button
            aria-label="返回健康摘要"
            onClick={() => {
              setDetail("");
              setProfile(false);
            }}
          >
            <ChevronLeft />
          </button>
        ) : (
          <span />
        )}
        <strong>
          {detail
            ? healthTypes.find((x) => x.id === detail)?.title
            : profile
              ? "健康详细资料"
              : tab}
        </strong>
        <button
          aria-label="健康资料"
          onClick={() => (p.creator ? p.onAdd() : setProfile(true))}
        >
          <User size={23} />
        </button>
      </header>
      <div className="health-native-scroll">
        {profile ? (
          <>
            <h1>健康详细资料</h1>
            <section className="health-profile-empty">
              <User size={45} />
              <h2>{p.owner || "机主"}</h2>
              <p>尚未设置更多资料</p>
            </section>
          </>
        ) : detail ? (
          <>
            <div className="health-periods">
              {["日", "周", "月", "6个月", "年"].map((x) => (
                <button key={x} data-selected={period === x ? "true" : undefined} onClick={() => setPeriod(x)}>{x}</button>
              ))}
            </div>
            <p className="health-detail-value">
              {current ? meta(current, "value", healthDefaults[detail]?.value || "—") : healthDefaults[detail]?.value || "无数据"}{" "}
              <small>{current ? meta(current, "unit") : healthDefaults[detail]?.unit}</small>
            </p>
            {detail === "activity" && <p style={{margin:"0 22px 12px",color:"#6e6e73"}}>锻炼 35 分钟 · 站立 7 小时 · 每周健身约 3 次</p>}
            {detail === "sleep" && <p style={{margin:"0 22px 12px",color:"#6e6e73"}}>平均睡眠 7 小时 30 分钟</p>}
            <div className="health-detail-chart" aria-label={period + "健康记录柱状图"}>
              {(period === "日" ? healthSamples[detail]?.slice(-7) : period === "周" ? healthSamples[detail]?.slice(-7) : period === "月" ? healthSamples[detail] : period === "6个月" ? [...healthSamples[detail],...healthSamples[detail]] : [...healthSamples[detail],...healthSamples[detail],...healthSamples[detail]] )?.map((v, n, values) => (
                <span key={n} title={detail === "sleep" ? v.toFixed(1) + "小时" : String(Math.round(v))} style={{height:`${Math.max(9,(v / Math.max(...values, 1))*100)}%`,background:detail === "sleep" ? "#8270ed" : detail === "steps" ? "#ff8a25" : "#ff466b",flex:"1 1 0",minWidth:0,borderRadius:"4px 4px 0 0"}} />
              ))}
            </div>
            <div style={{display:"flex",justifyContent:"space-between",margin:"4px 22px 20px",fontSize:12,color:"#8e8e93"}}><span>{period === "日" ? "06:00" : period === "周" ? "周一" : "较早"}</span><span>{period === "日" ? "23:00" : period === "周" ? "周日" : "最近"}</span></div>
            {detail === "sleep" && <section className="health-detail-description">
              <h2>睡眠阶段</h2>
              <div style={{display:"flex",height:20,borderRadius:8,overflow:"hidden",margin:"14px 0"}}>
                {([["深度睡眠",30,"#4230aa"],["核心睡眠",55,"#8270ed"],["快速动眼睡眠",10,"#55b8e6"],["清醒",5,"#ff9d56"]] as const).map(([label,value,color]) => <div key={label} title={label+" "+value+"%"} style={{width:value+"%",background:color}} />)}
              </div>
              {([["深度睡眠","30%","#4230aa"],["核心睡眠","55%","#8270ed"],["快速动眼睡眠","10%","#55b8e6"],["清醒时间","5%","#ff9d56"]] as const).map(([label,value,color]) => <p key={label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",margin:"10px 0"}}><span><i style={{display:"inline-block",height:10,width:10,borderRadius:3,background:color,marginRight:8}} />{label}</span><strong>{value}</strong></p>)}
            </section>}
            {detail === "activity" && <section className="health-detail-description">
              <h2>本周健身</h2><p>周二 · 35 分钟　完成</p><p>周四 · 42 分钟　完成</p><p>周六 · 38 分钟　完成</p><p>每周约 3 次，其他日期以日常活动为主。</p>
            </section>}
            <section className="health-detail-description">
              <h2>记录</h2>
              <p>{current?.body || healthDefaults[detail]?.description || "暂无记录"}</p>
            </section>
          </>
              ) : (
                <p>暂无数据</p>
              )}
            </section>
          </>
        ) : tab === "摘要" ? (
          <>
            <div className="health-section-title">
              <h2>置顶</h2>
              <button onClick={() => setEditing(!editing)}>
                {editing ? "完成" : "编辑"}
              </button>
            </div>
            {editing && (
              <div className="health-pin-editor">
                {healthTypes.map((t) => (
                  <label key={t.id}>
                    <input
                      type="checkbox"
                      checked={pins.includes(t.id)}
                      onChange={() =>
                        setPins(
                          pins.includes(t.id)
                            ? pins.filter((x) => x !== t.id)
                            : [...pins, t.id],
                        )
                      }
                    />
                    {t.title}
                  </label>
                ))}
              </div>
            )}
            <div className="health-cards">
              {pins.map((id) => {
                const t = healthTypes.find((t) => t.id === id);
                if (!t) return null;
                const i = recordFor(p.items, id);
                const Icon = t.icon;
                return (
                  <button
                    key={id}
                    className={"health-native-card health-card-" + id}
                    onClick={() => open(id)}
                  >
                    <header style={{ color: t.color }}>
                      <Icon size={19} />
                      <strong>{t.title}</strong>
                      <time>{i?.time.slice(5, 10) || ""}</time>
                      <ChevronRight size={18} />
                    </header>
                    {id === "activity" ? (
                      <div className="health-activity-values">
                        {[
                          ["活动", "active", "千卡"],
                          ["锻炼", "exercise", "分钟"],
                          ["站立", "stand", "小时"],
                        ].map(([name, key, unit], n) => (
                          <div
                            key={key}
                            style={{
                              color: ["#ff2d55", "#54c900", "#00b2d9"][n],
                            }}
                          >
                            <small>{name}</small>
                            <p>
                              <b>{i ? meta(i, key, "—") : ({active:"420",exercise:"35",stand:"7"} as Record<string,string>)[key]}</b>
                              <span>{unit}</span>
                            </p>
                          </div>
                        ))}
                        <div className="activity-rings">
                          <i />
                          <i />
                          <i />
                        </div>
                      </div>
                    ) : (
                      <div className="health-card-bottom">
                        <div>
                          <b>
                            {i ? meta(i, "value", i.body || "无数据") : healthDefaults[id]?.value || "无数据"}
                          </b>
                          <span>{i ? meta(i, "unit") : healthDefaults[id]?.unit || ""}</span>
                        </div>
                        {id === "steps" && (
                          <div className="health-spark" aria-hidden="true">
                            {Array.from({ length: 7 }, (_, n) => (
                              <i
                                key={n}
                                style={{
                                  height:
                                    (seriesFor(i)[n] ?? healthSamples.steps[n]) !== undefined
                                      ? `${Math.max(3, ((seriesFor(i)[n] ?? healthSamples.steps[n]) / Math.max(...(seriesFor(i).length ? seriesFor(i) : healthSamples.steps), 1)) * 45)}px`
                                      : "8px",
                                }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            <button className="health-all-row" onClick={() => setTab("浏览")}>
              <Heart color="#ff2d55" />
              显示所有健康数据
              <ChevronRight />
            </button>
            <h2 className="health-trends-title">趋势</h2>
            <div className="health-trends-empty">
              平均每日 6,500 步 · 每周约 3 次健身 · 平均睡眠 7 小时 30 分钟
            </div>
          </>
        ) : tab === "共享" ? (
          <section className="health-sharing">
            <Users size={54} />
            <h2>共享健康数据</h2>
            <p>尚未共享数据</p>
            {p.items
              .filter((i) => i.folder === "共享")
              .map((i) => (
                <button key={i.id} onClick={() => p.onItem(i)}>
                  {i.title}
                </button>
              ))}
          </section>
        ) : (
          <>
            <h1>浏览</h1>
            {healthTypes.map((t) => (
              <button
                key={t.id}
                className="health-browse-row"
                onClick={() => open(t.id)}
              >
                <t.icon size={22} color={t.color} />
                {t.title}
                <ChevronRight />
              </button>
            ))}
            {p.items
              .filter((i) => !healthTypes.some((t) => recordFor([i], t.id)))
              .map((i) => (
                <button
                  className="health-browse-row"
                  key={i.id}
                  onClick={() => p.onItem(i)}
                >
                  {i.title}
                  <ChevronRight />
                </button>
              ))}
          </>
        )}
      </div>
      {!detail && !profile && (
        <nav className="health-floating-tabs">
          {[
            [Heart, "摘要"],
            [Users, "共享"],
            [Grid2X2, "浏览"],
          ].map(([Icon, label]) => {
            const Glyph = Icon as typeof Heart;
            return (
              <button
                key={String(label)}
                className={tab === label ? "selected" : ""}
                onClick={() => setTab(String(label))}
              >
                <Glyph size={25} />
                <span>{String(label)}</span>
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}
function listMeta(
  item: Item | undefined,
  key: string,
): {
  time?: string;
  temperature?: string;
  low?: string;
  high?: string;
  label?: string;
  condition?: string;
}[] {
  try {
    const v = JSON.parse(meta(item, key, "[]"));
    return Array.isArray(v)
      ? v
          .filter(
            (x) =>
              x &&
              typeof x === "object" &&
              Object.values(x).every(
                (v) => typeof v === "string" || typeof v === "number",
              ),
          )
          .slice(0, 12)
      : [];
  } catch {
    return [];
  }
}
export function WeatherSkin(p: Props) {
  const [index, setIndex] = useSkinState<number>(p, "city", 0),
    [mode, setMode] = useState("temperature"),
    [sheet, setSheet] = useState(""),
    [query, setQuery] = useState("");
  const item = p.items[index] || p.items[0],
    hourly = listMeta(item, "hourly"),
    daily = listMeta(item, "daily");
  const read = () => {
    if (item) {
      if (p.creator || item.password) p.onItem(item);
      else p.onRead(item.id);
    }
  };
  return (
    <div
      className="catalog-skin native-weather calibrated-weather"
      data-empty={!item}
    >
      <div className="weather-stars" aria-hidden="true" />
      <div className="weather-native-scroll">
        <section className="weather-native-current">
          <small>{item ? meta(item, "locationLabel", "城市") : "天气"}</small>
          <h1>{item?.title || "未添加城市"}</h1>
          <output>{meta(item, "temperature", "—")}°</output>
          <div className="weather-high-low">
            <span>最高 {meta(item, "high", "—")}°</span>
            <span>最低 {meta(item, "low", "—")}°</span>
          </div>
          <p>{meta(item, "condition", "暂无天气数据")}</p>
          <MoonStar className="weather-moon-art" size={55} />
        </section>
        <button
          className="weather-native-card weather-air-quality"
          onClick={() => {
            read();
            setSheet("空气质量");
          }}
        >
          <strong>
            {meta(item, "summary", "天气概况")}
          </strong>
          <div className="weather-aqi-scale">
            <i
              style={{
                left: Number.isFinite(Number(meta(item, "aqi")))
                  ? Math.max(0, Math.min(95, Number(meta(item, "aqi")) / 5)) +
                    "%"
                  : "0%",
              }}
            />
          </div>
          <p>
            {meta(item, "summary", "暂无天气数据")}
          </p>
        </button>
        <section className="weather-native-card weather-hourly">
          <header>
            <div>
              <strong>天气状况</strong>
              <small>
                {mode === "temperature"
                  ? "气温 (°C)"
                  : mode === "rain"
                    ? "降水概率"
                    : "风速"}
              </small>
            </div>
            <div className="weather-mode-switch">
              {[
                [Cloud, "temperature"],
                [Droplet, "rain"],
                [Wind, "wind"],
              ].map(([Icon, key]) => {
                const Glyph = Icon as typeof Cloud;
                return (
                  <button
                    aria-label={String(key)}
                    aria-pressed={mode === key}
                    key={String(key)}
                    onClick={() => setMode(String(key))}
                  >
                    <Glyph size={18} />
                  </button>
                );
              })}
            </div>
          </header>
          <div className="weather-hour-grid">
            {Array.from({ length: 6 }, (_, n) => (
              <button
                key={n}
                onClick={() => {
                  read();
                  setSheet("逐小时天气");
                }}
              >
                <strong>
                  {hourly[n]?.time ||
                    ["现在", "—时", "—时", "—时", "—时", "日出"][n]}
                </strong>
                {n === 5 ? (
                  <Sunrise size={28} color="#ffd60a" />
                ) : (
                  <Sun size={28} color="#ffd60a" />
                )}
                <span>
                  {n === 5
                    ? meta(item, "sunrise", "—")
                    : mode === "temperature"
                      ? (hourly[n]?.temperature ?? "—") + "°"
                      : mode === "rain"
                        ? meta(item, "rain", "—")
                        : meta(item, "wind", "—")}
                </span>
              </button>
            ))}
          </div>
        </section>
        <section className="weather-native-card weather-days">
          {(daily.length
            ? daily
            : [
                {
                  label: "今天",
                  low: meta(item, "low", "—"),
                  high: meta(item, "high", "—"),
                },
              ]
          ).map((d, n) => (
            <button
              key={n}
              onClick={() => {
                read();
                setSheet("每日天气");
              }}
            >
              <strong>{d.label || d.time || "—"}</strong>
              {d.condition?.includes("雨") ? <CloudRain size={23} color="#d9f2ff" /> : d.condition?.includes("多云") ? <CloudSun size={23} color="#ffd60a" /> : <Sun size={23} color="#ffd60a" />}
              <span>{d.low || "—"}°</span>
              <i />
              <b>{d.high || "—"}°</b>
            </button>
          ))}
        </section>
      </div>
      <nav className="weather-native-toolbar">
        <button aria-label="天气地图" onClick={() => setSheet("天气地图")}>
          <Map size={27} />
        </button>
        <div className="weather-city-dots">
          {p.items.length ? (
            p.items.map((i, n) => (
              <button
                aria-label={"切换城市" + i.title}
                aria-current={n === index ? "true" : undefined}
                key={i.id}
                onClick={() => {
                  setIndex(n);
                  p.onRead(i.id);
                }}
              />
            ))
          ) : (
            <span />
          )}
        </div>
        <button aria-label="城市列表" onClick={() => setSheet("城市列表")}>
          <List size={29} />
        </button>
      </nav>
      {sheet && (
        <div className="weather-native-sheet">
          <header>
            <button aria-label="返回天气" onClick={() => setSheet("")}>
              <ChevronLeft />
              天气
            </button>
            <strong>{sheet}</strong>
          </header>
          {sheet === "城市列表" ? (
            <>
              <label className="weather-city-search">
                <Search size={18} />
                <input
                  placeholder="搜索城市"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </label>
              {p.items
                .filter((i) => i.title.includes(query))
                .map((i) => (
                  <button
                    className="weather-city-row"
                    key={i.id}
                    onClick={() => {
                      setIndex(p.items.indexOf(i));
                      setSheet("");
                      p.onRead(i.id);
                    }}
                  >
                    <strong>{i.title}</strong>
                    <span>{meta(i, "temperature", "—")}°</span>
                  </button>
                ))}
              {!p.items.length && <p>暂无城市</p>}
              {p.creator && (
                <button onClick={p.onAdd}>
                  <Plus />
                  添加城市
                </button>
              )}
            </>
          ) : sheet === "天气地图" ? (
            <div className="weather-map-empty">
              <Map size={60} />
              <p>暂无地图数据</p>
            </div>
          ) : (
            <div className="weather-section-detail">
              <h2>{item?.title || "暂无城市"}</h2>
              <p>
                {sheet === "空气质量"
                  ? meta(item, "aqi", "暂无空气质量数据")
                  : item?.body || "暂无天气记录"}
              </p>
              {item && <small>{item.time}</small>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
