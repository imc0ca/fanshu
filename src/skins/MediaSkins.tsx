import { PersistentSpotifyPlayer, playSpotify } from "../PersistentSpotifyPlayer";
import { podcastEpisodes } from "../podcastEpisodes";
import { AudioPlayer, useTrack } from "../audio";
import { useSkinState } from "../skinState";
import {
  Bookmark,
  Check,
  Compass,
  Heart,
  Home,
  MessageCircle,
  Music,
  ChevronLeft,
  Play,
  Plus,
  Search,
  SkipForward,
  User,
  Users,
  Video,
} from "lucide-react";
import { useRef, useState } from "react";
import { safeMedia, type Item } from "../schema";
import {
  Avatar,
  Empty,
  groupItems,
  Header,
  Media,
  meta,
  SearchBox,
  Tabs,
  useContent,
  type Props,
} from "./shared";
function TrackPlayer({
  item,
  p,
  onNext,
}: {
  item: Item;
  p: Props;
  onNext: () => void;
}) {
  return (
    <div className="track-player">
      <button onClick={() => p.onItem(item)}>
        <Music size={20} />
        <span>
          {item.title}
          <small>{item.sender}</small>
        </span>
      </button>
      {item.kind === "audio" && safeMedia(item.media) ? (
        <AudioPlayer p={p} item={item} />
      ) : (
        <button onClick={() => p.onItem(item)}>查看</button>
      )}
      <button aria-label="下一首" onClick={onNext}>
        <SkipForward size={19} />
      </button>
    </div>
  );
}
export function SpotifySkin(p: Props) {
  const { tab, setTab, q, setQ, items } = useContent(p, "首页");
  const [playlist, setPlaylist] = useState("");
  const [podcastPage, setPodcastPage] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);
  const [episodeSearch, setEpisodeSearch] = useState("");
  const [episodeOrder, setEpisodeOrder] = useState<"desc" | "asc">("desc");
  const list = playlist
    ? items.filter((i) => (i.folder || "我的音乐") === playlist)
    : items;
  return (
    <div className="catalog-skin spotify-ui">
      <Header p={p} />
      <div className="catalog-scroll">
        <div className="spotify-heading">
          <Avatar name={p.owner ?? "我"} />
          <button
            className={tab === "首页" ? "selected" : ""}
            onClick={() => setTab("首页")}
          >
            音乐
          </button>
          <button
            className={tab === "音乐库" ? "selected" : ""}
            onClick={() => setTab("音乐库")}
          >
            音乐库
          </button>
          <button className={podcastPage ? "selected" : ""} onClick={() => setPodcastPage(true)}>播客</button>
        </div>
        {tab === "搜索" && <SearchBox value={q} set={setQ} />}
        {podcastPage ? (
          <section style={{padding:"10px 5px 32px",color:"#fff"}}>
            <button onClick={() => { if(selectedEpisode!==null) setSelectedEpisode(null); else setPodcastPage(false); }} style={{display:"flex",alignItems:"center",gap:6,color:"#ddd",marginBottom:18}}><ChevronLeft size={19}/> {selectedEpisode!==null ? "所有单集" : "返回音乐库"}</button>
            {selectedEpisode!==null ? (() => {
              const ep = podcastEpisodes.find(e => e.number===selectedEpisode);
              return ep ? <div>
                <img src="/fanshu/podcast-shihuashishuo.jpg" alt="石话石说" style={{width:156,height:156,objectFit:"cover",borderRadius:9,marginBottom:18}}/>
                <div style={{color:"#1ed760",fontSize:12,fontWeight:700,marginBottom:9}}>石话石说 · EP{String(ep.number).padStart(2,"0")}</div>
                <h1 style={{fontSize:25,lineHeight:1.4,margin:"0 0 12px",fontWeight:800}}>{ep.title}</h1>
                <div style={{color:"#a9a9a9",fontSize:12,marginBottom:22}}>{ep.date.replaceAll("/","-")} · seok {ep.number===77 ? "· 特别嘉宾 郑成灿" : ""}</div>
                <h2 style={{fontSize:17,marginBottom:12}}>本期简介</h2>
                <p style={{whiteSpace:"pre-wrap",lineHeight:1.85,color:"#dedede",fontSize:14}}>{ep.description}</p>
                <p style={{color:"#999",fontSize:12,marginTop:24}}>本页面为节目目录，尚未添加单集音频。</p>
              </div> : null;
            })() : <>
              <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:18}}>
                <img src="/fanshu/podcast-shihuashishuo.jpg" alt="石话石说播客封面" style={{width:126,height:126,flexShrink:0,objectFit:"cover",borderRadius:9,boxShadow:"0 5px 24px #0007"}}/>
                <div><div style={{fontSize:11,color:"#1ed760",fontWeight:700,letterSpacing:1}}>PODCAST</div><h1 style={{fontSize:27,lineHeight:1.25,margin:"8px 0",fontWeight:800}}>石话石说</h1><div style={{fontSize:13,color:"#bdbdbd"}}>seok · 104 期节目</div></div>
              </div>
              <p style={{lineHeight:1.65,color:"#eee",fontSize:14,marginBottom:8}}>每周日更新，关于没有标准答案的生活开放题。</p>
              <p style={{color:"#a9a9a9",fontSize:12,lineHeight:1.7,marginBottom:23}}>固定主播 seok · 生活观察、个人分享、开放式讨论、偶尔邀请嘉宾</p>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,marginBottom:14}}><h2 style={{fontSize:20,margin:0,fontWeight:800}}>所有单集 <span style={{color:"#999",fontSize:13,fontWeight:400}}>104</span></h2><div role="group" aria-label="单集排序" style={{display:"flex",gap:3,padding:3,background:"#292929",borderRadius:9,flexShrink:0}}><button onClick={() => setEpisodeOrder("desc")} aria-pressed={episodeOrder==="desc"} style={{fontSize:12,fontWeight:episodeOrder==="desc"?700:400,color:episodeOrder==="desc"?"#111":"#bbb",background:episodeOrder==="desc"?"#1ed760":"transparent",padding:"7px 9px",borderRadius:7}}>倒序</button><button onClick={() => setEpisodeOrder("asc")} aria-pressed={episodeOrder==="asc"} style={{fontSize:12,fontWeight:episodeOrder==="asc"?700:400,color:episodeOrder==="asc"?"#111":"#bbb",background:episodeOrder==="asc"?"#1ed760":"transparent",padding:"7px 9px",borderRadius:7}}>顺序</button></div></div>
              <input aria-label="搜索播客单集" placeholder="搜索单集标题或期数" value={episodeSearch} onChange={e=>setEpisodeSearch(e.target.value)} style={{width:"100%",boxSizing:"border-box",border:"1px solid #383838",borderRadius:9,background:"#242424",color:"#fff",padding:"11px 12px",fontSize:13,marginBottom:12}}/>
              {podcastEpisodes.filter(ep => !episodeSearch || ep.title.includes(episodeSearch) || String(ep.number).includes(episodeSearch)).slice().sort((a,b) => episodeOrder==="desc" ? b.number-a.number : a.number-b.number).map(ep => (
                <button key={ep.number} onClick={() => setSelectedEpisode(ep.number)} style={{width:"100%",display:"flex",gap:12,alignItems:"flex-start",textAlign:"left",color:"#fff",padding:"13px 2px",borderBottom:"1px solid #303030"}}>
                  <img src="/fanshu/podcast-shihuashishuo.jpg" alt="" style={{width:56,height:56,borderRadius:5,objectFit:"cover",flexShrink:0}}/>
                  <span style={{display:"flex",flexDirection:"column",minWidth:0,gap:5,flex:1}}>
                    <strong style={{fontSize:14,fontWeight:750,lineHeight:1.45}}>EP{String(ep.number).padStart(2,"0")} · {ep.title}</strong>
                    <small style={{color:"#aaa",fontSize:11}}>{ep.date.replaceAll("/","-")} · seok</small>
                    <span style={{fontSize:12,color:"#b6b6b6",lineHeight:1.4,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{ep.description}</span>
                  </span>
                  <ChevronLeft size={16} style={{transform:"rotate(180deg)",marginTop:20,color:"#aaa",flexShrink:0}}/>
                </button>
              ))}
            </>}
          </section>
        ) : (
          <>
          <button onClick={() => setPodcastPage(true)} style={{display:"flex",alignItems:"center",justifyContent:"flex-start",gap:10,width:"100%",padding:"9px 12px",margin:"5px 0 15px",background:"#242424",borderRadius:9,color:"#fff",textAlign:"left",minHeight:0}}>
            <img src="/fanshu/podcast-shihuashishuo.jpg" alt="石话石说封面" style={{width:48,height:48,objectFit:"cover",borderRadius:5,flexShrink:0}}/>
            <span style={{display:"flex",flexDirection:"column",alignItems:"flex-start",gap:3,minWidth:0,flex:"0 1 auto"}}><strong style={{fontSize:14,lineHeight:1.3}}>石话石说</strong><small style={{color:"#aaa",fontSize:11}}>seok 的播客 · 104 期节目</small></span>
          </button>
                  <h1>{playlist || (tab === "音乐库" ? "音乐库" : "为你收藏")}</h1>
        {!playlist && (
          <div className="spotify-playlists">
            {groupItems(items, "我的音乐").map((g) => (
              <button key={g} onClick={() => setPlaylist(g)}>
                <Music size={29} />
                <strong>{g}</strong>
              </button>
            ))}
          </div>
        )}
        {playlist && (
          <button className="playlist-back" onClick={() => setPlaylist("")}>
            返回全部音乐
          </button>
        )}
        <div className="spotify-tracks">
          {list.map((i, n) => (
            <button
              key={i.id}
              onClick={() => {
                playSpotify(i, items);
              }}
            >
              <span>{n + 1}</span>
              <div>
                <strong>{i.title}</strong>
                <small>
                  {i.sender} · {meta(i, "album")}
                </small>
              </div>
              <small>{meta(i, "duration")}</small>
            </button>
          ))}
        </div>
        <Empty items={list} />
          </>
        )}
      </div>
      <PersistentSpotifyPlayer items={items} />
      <Tabs
        tabs={["首页", "搜索", "音乐库"]}
        value={tab}
        set={(t) => {
          setTab(t);
          setPlaylist("");
          setPodcastPage(false);
        }}
        icons={[<Home />, <Search />, <Music />]}
      />
    </div>
  );
}
export function NeteaseSkin(p: Props) {
  const { tab, setTab, q, setQ, items } = useContent(p, "发现");
  const [folder, setFolder] = useState(""),
    [track, setTrack] = useTrack(p, items);
  const list = folder
    ? items.filter((i) => (i.folder || "我的歌单") === folder)
    : items;
  return (
    <div className="catalog-skin netease-ui">
      <Header p={p} />
      <div className="catalog-scroll">
        <SearchBox value={q} set={setQ} />
        {tab === "发现" ? (
          <>
            <div className="netease-feature">
              <Music size={44} />
              <h2>推荐歌单</h2>
            </div>
            <div className="netease-shelves">
              {groupItems(items, "我的歌单").map((g) => (
                <button
                  key={g}
                  onClick={() => {
                    setFolder(g);
                    setTab("我的");
                  }}
                >
                  <Music size={33} />
                  <strong>{g}</strong>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="netease-profile">
              <Avatar name={p.owner ?? "我"} />
              <h2>{p.owner ?? "我的音乐"}</h2>
            </div>
            <h3>{folder || "我的歌单"}</h3>
          </>
        )}
        {list.map((i, n) => (
          <div className="netease-track" key={i.id}>
            <button
              onClick={() => {
                setTrack(i);
              }}
            >
              <span>{n + 1}</span>
              <div>
                <strong>{i.title}</strong>
                <small>
                  {i.sender} · {meta(i, "album")}
                </small>
              </div>
            </button>
            <button
              aria-label={`歌曲详情${i.title}`}
              onClick={() => p.onItem(i)}
            >
              <MessageCircle size={18} />
            </button>
          </div>
        ))}
        <Empty items={list} />
      </div>
      {track && (
        <TrackPlayer
          item={track}
          p={p}
          onNext={() =>
            setTrack(
              items[
                (items.findIndex((i) => i.id === track.id) + 1) % items.length
              ],
            )
          }
        />
      )}
      <Tabs
        tabs={["发现", "我的"]}
        value={tab}
        set={(t) => {
          setTab(t);
          setFolder("");
        }}
        icons={[<Compass />, <Music />]}
      />
    </div>
  );
}
const youtubeDemo = [
  { title:"🌾🔥【星露谷物语】超详细沙漠节全攻略科普", channel:"星露谷小土豆", views:"2673次观看", age:"1年前", duration:"9:36", color:"#68a66c" },
  { title:"女主开局被校霸同桌一见钟情！本以为是纯情小奶狗，不料校霸竟是真病娇…", channel:"小白爆肝队", views:"23万次观看", age:"2年前", duration:"1:05:03", color:"#bd9878" },
  { title:"想知道爱犬品种，记者觉得检测不靠谱，寄出自己的DNA，结果她变成…", channel:"M2档案", views:"52万次观看", age:"2年前", duration:"29:44", color:"#536b83" },
  { title:"【宫崎骏 | Miyazaki Hayao】久石让 in 武道馆 音乐会 与宫崎骏动画一起走过的25年", channel:"The S Videos", views:"27万次观看", age:"8年前", duration:"4:32", color:"#464554" },
  { title:"全网星际争霸最全时间线梳理", channel:"我是社恐宇", views:"5万次观看", age:"10个月前", duration:"", color:"#484568" },
  { title:"Golden Lynel + 9 Silver Enemies | Testrun of BotW All-stars Challenge", channel:"Ordinary Champion", views:"236万次观看", age:"3年前", duration:"8:19", color:"#73856b" },
];
export function YouTubeSkin(_p: Props) {
  const [tab,setTab] = useState("首页");
  const [q,setQ] = useState("");
  const [selected,setSelected] = useState<number | null>(null);
  const [liked,setLiked] = useState<number[]>([]);
  const [subscribed,setSubscribed] = useState<string[]>([]);
  const [menu,setMenu] = useState<number | null>(null);
  const [comments,setComments] = useState(false);
  const items = youtubeDemo.filter(v=>(v.title+v.channel).toLowerCase().includes(q.toLowerCase()));
  const openVideo = (index:number) => {setSelected(index);setComments(false);setMenu(null);};
  const current = selected === null ? null : youtubeDemo[selected];
  const thumb = (v:typeof youtubeDemo[number]) => (
    <div style={{aspectRatio:"16/9",background:`linear-gradient(145deg,${v.color},#1c2631)`,position:"relative",display:"flex",alignItems:"center",justifyContent:"center",color:"white",overflow:"hidden"}}>
      <span style={{fontSize:13,opacity:.75,letterSpacing:1}}>视频封面待上传</span>
      <span style={{position:"absolute",right:8,bottom:8,background:"#000c",padding:"3px 5px",borderRadius:4,fontSize:12,fontWeight:600}}>{v.duration||"视频"}</span>
    </div>
  );
  return <div className="catalog-skin youtube-ui" style={{background:"#fff",color:"#111",display:"flex",flexDirection:"column",height:"100%"}}>
    <div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 15px 9px",flexShrink:0}}>
      {selected !== null ? <button onClick={()=>setSelected(null)} aria-label="返回"><ChevronLeft size={24}/></button> : null}
      <span style={{fontSize:21,fontWeight:800,letterSpacing:-1,flex:1}}><span style={{background:"#f03",color:"#fff",borderRadius:6,padding:"0 5px",fontSize:16,marginRight:5}}>▶</span>YouTube</span>
      <button aria-label="搜索" onClick={()=>document.getElementById("fanshu-youtube-search")?.focus()}><Search size={22}/></button>
      <button aria-label="个人中心" onClick={()=>{setSelected(null);setTab("我的");}}><User size={22}/></button>
    </div>
    {selected === null ? <>
      <div style={{padding:"0 12px 8px"}}><input id="fanshu-youtube-search" placeholder="搜索 YouTube" value={q} onChange={e=>setQ(e.target.value)} style={{background:"#f2f2f2",borderRadius:9,padding:"8px 12px",width:"100%",fontSize:14}}/></div>
      <div style={{display:"flex",gap:9,overflowX:"auto",padding:"2px 12px 10px",flexShrink:0}}>
        {["全部","游戏","音乐","动画","纪录片"].map(x=><span key={x} style={{padding:"7px 11px",borderRadius:8,background:x==="全部"?"#181818":"#eee",color:x==="全部"?"white":"#222",fontSize:12,whiteSpace:"nowrap"}}>{x}</span>)}
      </div>
      <div style={{overflowY:"auto",flex:1}}>
        {items.map(v=>{const index=youtubeDemo.indexOf(v);return <article key={index} style={{marginBottom:18}}>
          <button onClick={()=>openVideo(index)} style={{display:"block",width:"100%",padding:0}}>{thumb(v)}</button>
          <div style={{display:"flex",gap:10,padding:"11px 12px 0",alignItems:"flex-start"}}>
            <div style={{height:35,width:35,borderRadius:"50%",background:v.color,flexShrink:0,display:"grid",placeItems:"center",color:"#fff",fontWeight:700}}>{v.channel.slice(0,1)}</div>
            <button onClick={()=>openVideo(index)} style={{flex:1,textAlign:"left",padding:0}}>
              <div style={{fontSize:14,fontWeight:650,lineHeight:1.4,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{v.title}</div>
              <div style={{fontSize:11,color:"#737373",marginTop:5}}>{v.channel} · {v.views} · {v.age}</div>
            </button>
            <button onClick={()=>setMenu(menu===index?null:index)} aria-label="更多选项" style={{fontSize:22,lineHeight:1}}>⋮</button>
          </div>
          {menu===index&&<div style={{padding:"8px 16px",fontSize:12,color:"#666"}}>保存到稍后观看 · 分享</div>}
        </article>})}
      </div>
      <div style={{display:"flex",justifyContent:"space-around",borderTop:"1px solid #eee",padding:"10px 0 8px",flexShrink:0}}>
        {["首页","Shorts","订阅","我的"].map((x,i)=><button key={x} onClick={()=>setTab(x)} style={{display:"grid",justifyItems:"center",gap:3,color:tab===x?"#111":"#777",fontSize:10}}>{i===0?<Home size={21}/>:i===1?<Video size={21}/>:i===2?<Users size={21}/>:<User size={21}/>}<span>{x}</span></button>)}
      </div>
    </> : current&&<div style={{overflowY:"auto",flex:1}}>
      {thumb(current)}
      <div style={{padding:"14px 14px 9px"}}>
        <strong style={{fontSize:18,lineHeight:1.4}}>{current.title}</strong>
        <div style={{fontSize:12,color:"#777",marginTop:5}}>{current.views} · {current.age}</div>
        <div style={{display:"flex",alignItems:"center",gap:10,marginTop:16}}>
          <div style={{height:35,width:35,borderRadius:"50%",background:current.color,display:"grid",placeItems:"center",color:"white"}}>{current.channel.slice(0,1)}</div>
          <strong style={{flex:1,fontSize:14}}>{current.channel}</strong>
          <button onClick={()=>setSubscribed(x=>x.includes(current.channel)?x.filter(c=>c!==current.channel):[...x,current.channel])} style={{background:subscribed.includes(current.channel)?"#eee":"#111",color:subscribed.includes(current.channel)?"#111":"white",borderRadius:22,padding:"9px 13px",fontSize:12}}>{subscribed.includes(current.channel)?"已订阅":"订阅"}</button>
        </div>
        <div style={{display:"flex",gap:9,marginTop:17}}>
          <button onClick={()=>setLiked(x=>x.includes(selected!)?x.filter(n=>n!==selected!):[...x,selected!])} style={{background:"#f0f0f0",borderRadius:22,padding:"10px 15px",fontSize:13}}>{liked.includes(selected!)?"♥ 已点赞":"♡ 点赞"}</button>
          <button onClick={()=>setComments(!comments)} style={{background:"#f0f0f0",borderRadius:22,padding:"10px 15px",fontSize:13}}>评论</button>
          <button onClick={()=>navigator.clipboard?.writeText(window.location.href)} style={{background:"#f0f0f0",borderRadius:22,padding:"10px 15px",fontSize:13}}>分享</button>
        </div>
        {comments&&<div style={{padding:"18px 0",fontSize:13,color:"#777"}}>评论区 · 暂无评论</div>}
        <div style={{fontWeight:700,marginTop:25,marginBottom:12}}>接下来播放</div>
        {youtubeDemo.map((v,i)=>i===selected?null:<button key={i} onClick={()=>openVideo(i)} style={{display:"flex",gap:10,marginBottom:13,textAlign:"left",width:"100%"}}><div style={{width:"42%",flexShrink:0}}>{thumb(v)}</div><div style={{fontSize:12,fontWeight:600}}>{v.title}<div style={{color:"#888",fontSize:10,marginTop:6}}>{v.channel}</div></div></button>)}
      </div>
    </div>}
  </div>;
}
export function BilibiliSkin(p: Props) {
  const { tab, setTab, q, setQ, items } = useContent(p, "首页");
  const [category, setCategory] = useState("推荐");
  const list =
    tab === "历史"
      ? items.filter((i) => i.folder === "历史")
      : tab === "动态"
        ? items.filter((i) => i.folder === "动态")
        : category === "推荐"
          ? items
          : items.filter((i) => i.folder === category);
  return (
    <div className="catalog-skin bilibili-ui">
      <Header p={p} />
      <div className="bili-search">
        <Avatar name={p.owner ?? "我"} />
        <SearchBox value={q} set={setQ} />
      </div>
      <div className="bili-categories">
        {["推荐", "动画", "音乐", "生活"].map((c) => (
          <button
            key={c}
            className={category === c ? "selected" : ""}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="catalog-scroll">
        <div className="bili-grid">
          {list.map((i) => (
            <button key={i.id} onClick={() => p.onItem(i)}>
              <div>
                <Media item={i} />
                <small>
                  <Play size={10} />
                  {meta(i, "views", "—")}
                  <time>{meta(i, "duration")}</time>
                </small>
              </div>
              <strong>{i.title}</strong>
              <span>UP · {i.sender}</span>
            </button>
          ))}
        </div>
        <Empty items={list} />
      </div>
      <Tabs
        tabs={["首页", "动态", "历史"]}
        value={tab}
        set={setTab}
        icons={[<Home />, <MessageCircle />, <User />]}
      />
    </div>
  );
}
function VerticalVideo({ p, item }: { p: Props; item: Item }) {
  const [liked, setLiked] = useSkinState<boolean>(p, `liked-${item.id}`, false),
    [saved, setSaved] = useSkinState<boolean>(p, `saved-${item.id}`, false);
  return (
    <article className="vertical-video">
      <Media item={item} />
      <div className="vertical-actions">
        <button
          aria-label={`作者${item.sender}`}
          onClick={() => p.onItem(item)}
        >
          <Avatar name={item.sender} />
        </button>
        <button
          aria-label={`喜欢${item.title}`}
          onClick={() => setLiked(!liked)}
        >
          <Heart size={29} fill={liked ? "#f44368" : "white"} />
          <small>{item.likes + (liked ? 1 : 0)}</small>
        </button>
        <button aria-label={`评论${item.title}`} onClick={() => p.onItem(item)}>
          <MessageCircle size={29} />
          <small>{item.comments.length}</small>
        </button>
        <button
          aria-label={`收藏${item.title}`}
          onClick={() => setSaved(!saved)}
        >
          <Bookmark size={27} fill={saved ? "#f8cc55" : "none"} />
        </button>
      </div>
      <button className="vertical-caption" onClick={() => p.onItem(item)}>
        <strong>@{item.sender}</strong>
        <p>{item.body}</p>
        <small>
          <Music size={11} />
          {item.title}
        </small>
      </button>
    </article>
  );
}
export function DouyinSkin(p: Props) {
  const { tab, setTab, items } = useContent(p, "推荐");
  const list = tab === "推荐" ? items : items.filter((i) => i.folder === tab);
  return (
    <div className="catalog-skin douyin-ui">
      <Header p={p} />
      <div className="douyin-top">
        {["同城", "关注", "推荐"].map((t) => (
          <button
            className={tab === t ? "selected" : ""}
            key={t}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="vertical-feed">
        {list.map((i) => (
          <VerticalVideo key={i.id} p={p} item={i} />
        ))}
        <Empty items={list} />
      </div>
      <Tabs
        tabs={["推荐", "关注", "我"]}
        value={tab}
        set={setTab}
        icons={[<Home />, <Users />, <User />]}
      />
    </div>
  );
}
export function TikTokSkin(_p: Props) {
  const posts = [
    { file: "post-01.jpg", user: "Mia Rue", date: "10-9", avatar: "🐶", caption: "#dog #fluffy #puppy #puppies #cute", music: "Beautiful Boy (Darling...)", likes: 4500000, comments: 6434, saves: 251700, shares: 733800 },
    { file: "post-02.jpg", user: "Tex_dachshund", date: "5-29", avatar: "🐕", caption: "Which is your favorite ?\n#dachshund #puppydog #fy ...", music: "I'm A Believer - @Smash Mouth", likes: 29600, comments: 126, saves: 1828, shares: 17400 },
    { file: "post-03.jpg", user: "Niki 🐰", date: "", avatar: "🐰", caption: "#cute #bunny #funny #funnyvideo #animals", music: "咩的每一步都很坚定 - ...", likes: 240200, comments: 1720, saves: 30800, shares: 43000 },
    { file: "post-04.jpg", user: "cat memes", date: "", avatar: "🐱", caption: "Aura.", music: "AURA (Super Slowed) - @Ogryzek", likes: 1500000, comments: 5588, saves: 111000, shares: 621800 },
    { file: "post-05.jpg", user: "bunnydreamland", date: "10-12", avatar: "🐰", caption: "♡･Bunny Dreamland ･ ♡", music: "original sound - bunnydreamland", likes: 128400, comments: 876, saves: 12900, shares: 5620 },
  ];
  const [index, setIndex] = useState(0);
  const [liked, setLiked] = useState<number[]>([]);
  const [saved, setSaved] = useState<number[]>([]);
  const [following, setFollowing] = useState<number[]>([]);
  const [panel, setPanel] = useState<"comments" | "search" | "share" | null>(null);
  const [query, setQuery] = useState("");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Record<number, string[]>>({});
  const [tab, setTab] = useState("推荐");
  const start = useRef<number | null>(null);
  const lastWheel = useRef(0);
  const change = (step: number) => { setPanel(null); setIndex(i => Math.max(0, Math.min(posts.length - 1, i + step))); };
  const fmt = (n: number) => n >= 1000000 ? (n / 1000000).toFixed(1) + "M" : n >= 10000 ? (n / 1000).toFixed(1) + "K" : String(n);
  const post = posts[index];
  return (
    <div className="catalog-skin tiktok-ui tiktok-native-feed"
      onTouchStart={e => { start.current = e.touches[0]?.clientY ?? null; }}
      onTouchEnd={e => { if (start.current === null || panel) return; const delta = start.current - (e.changedTouches[0]?.clientY ?? start.current); if (Math.abs(delta) > 48) change(delta > 0 ? 1 : -1); start.current = null; }}
      onWheel={e => { if (panel || Math.abs(e.deltaY) < 25 || Date.now() - lastWheel.current < 550) return; lastWheel.current = Date.now(); change(e.deltaY > 0 ? 1 : -1); }}
    >
      <div className="tiktok-native-media" aria-label="上下滑动切换帖子">
        {posts.map((p, i) => <div key={p.file} className="tiktok-native-slide" style={{ transform: `translateY(${(i-index)*100}%)` }} aria-hidden={i !== index}>
          <img src={`${import.meta.env.BASE_URL}tiktok-images/${p.file}`} alt={p.user + " 帖子画面"} draggable={false} />
        </div>)}
      </div>
      <div className="tiktok-native-top"><button onClick={() => setPanel("search")} aria-label="搜索"><Search size={20}/></button>{["关注", "推荐"].map(t => <button key={t} className={tab === t ? "active" : ""} onClick={() => setTab(t)}>{t}</button>)}</div>
      <div className="tiktok-native-actions">
        <button className="tiktok-native-avatar" aria-label="关注作者" onClick={() => setFollowing(a => a.includes(index) ? a.filter(x => x !== index) : [...a,index])}><span>{post.avatar}</span><b>{following.includes(index) ? "✓" : "+"}</b></button>
        <button aria-label="点赞" onClick={() => setLiked(a => a.includes(index) ? a.filter(x => x !== index) : [...a,index])}><Heart size={31} fill={liked.includes(index) ? "#fe2c55" : "white"} color={liked.includes(index) ? "#fe2c55" : "white"}/><small>{fmt(post.likes + (liked.includes(index) ? 1 : 0))}</small></button>
        <button aria-label="查看评论" onClick={() => setPanel("comments")}><MessageCircle size={31} fill="white" color="white"/><small>{fmt(post.comments + (comments[index]?.length ?? 0))}</small></button>
        <button aria-label="收藏" onClick={() => setSaved(a => a.includes(index) ? a.filter(x => x !== index) : [...a,index])}><Bookmark size={31} fill={saved.includes(index) ? "#ffcf4b" : "white"} color={saved.includes(index) ? "#ffcf4b" : "white"}/><small>{fmt(post.saves + (saved.includes(index) ? 1 : 0))}</small></button>
        <button aria-label="分享" onClick={() => setPanel("share")}><span className="tiktok-native-share">➦</span><small>{fmt(post.shares)}</small></button>
      </div>
      <div className="tiktok-native-caption"><strong>{post.user} <span>· {post.date}</span></strong><p>{post.caption}</p><div><Music size={14}/>{post.music}</div></div>
      <div className="tiktok-native-bottom">{["首页","商城","+","收件箱","主页"].map(t => <button key={t} onClick={() => t === "首页" ? (setIndex(0),setPanel(null)) : setTab(t)} className={t === "+" ? "create" : ""}>{t}</button>)}</div>
      {panel && <div className="tiktok-native-overlay" onClick={() => setPanel(null)}>
        <section className="tiktok-native-sheet" onClick={e => e.stopPropagation()}>
          <button className="tiktok-native-close" onClick={() => setPanel(null)}>✕</button>
          {panel === "comments" ? <><h3>{fmt(post.comments + (comments[index]?.length ?? 0))} 条评论</h3><div className="tiktok-native-comments">{(comments[index] ?? []).map((c,i) => <p key={i}><strong>我</strong> {c}</p>)}<p className="tiktok-native-muted">可以在下方添加评论</p></div><form onSubmit={e => {e.preventDefault(); if(!comment.trim())return; setComments(a=>({...a,[index]:[...(a[index]??[]),comment.trim()]}));setComment("");}}><input value={comment} onChange={e=>setComment(e.target.value)} placeholder="添加评论..."/><button type="submit">发送</button></form></> :
          panel === "search" ? <><h3>搜索</h3><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="搜索相关内容"/><div>{posts.filter(p=>p.user.toLowerCase().includes(query.toLowerCase())||p.caption.toLowerCase().includes(query.toLowerCase())).map(p=><button key={p.file} onClick={()=>{setIndex(posts.indexOf(p));setPanel(null);}}>{p.user}</button>)}</div></> :
          <><h3>分享帖子</h3><p>复制网站链接分享给朋友</p><button onClick={()=>setPanel(null)}>完成</button></>}
        </section>
      </div>}
    </div>
  );
}
export function NetflixSkin(p: Props) {
  const { tab, setTab, q, setQ, items } = useContent(p, "首页");
  const [saved, setSaved] = useSkinState<string[]>(p, "saved", []);
  const list =
    tab === "我的片单"
      ? items.filter((i) => i.favorite || saved.includes(i.id))
      : items;
  const featured = list[0];
  return (
    <div className="catalog-skin netflix-ui">
      <Header p={p} />
      <div className="catalog-scroll">
        <SearchBox value={q} set={setQ} />
        {featured && tab === "首页" && (
          <div className="netflix-feature">
            <Media item={featured} />
            <div>
              <strong>{featured.title}</strong>
              <small>
                {meta(featured, "year")} · {meta(featured, "genre")} ·{" "}
                {meta(featured, "duration")}
              </small>
              <button onClick={() => p.onItem(featured)}>
                <Play size={16} />
                播放 / 详情
              </button>
              <button
                onClick={() =>
                  setSaved(
                    saved.includes(featured.id)
                      ? saved.filter((id) => id !== featured.id)
                      : [...saved, featured.id],
                  )
                }
              >
                {saved.includes(featured.id) ? (
                  <Check size={16} />
                ) : (
                  <Plus size={16} />
                )}
                我的片单
              </button>
            </div>
          </div>
        )}
        {groupItems(list, "影片").map((g) => (
          <section className="netflix-shelf" key={g}>
            <h3>{g}</h3>
            <div>
              {list
                .filter((i) => (i.folder || "影片") === g)
                .map((i) => (
                  <button key={i.id} onClick={() => p.onItem(i)}>
                    <Media item={i} />
                    <strong>{i.title}</strong>
                  </button>
                ))}
            </div>
          </section>
        ))}
        <Empty items={list} />
      </div>
      <Tabs
        tabs={["首页", "我的片单"]}
        value={tab}
        set={setTab}
        icons={[<Home />, <Bookmark />]}
      />
    </div>
  );
}

