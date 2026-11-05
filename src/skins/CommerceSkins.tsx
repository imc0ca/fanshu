import {
  Home,
  Receipt,
  ShoppingBag,
  Ticket,
  Utensils,
  Wallet,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  Empty,
  Header,
  meta,
  SearchBox,
  Tabs,
  useContent,
  type Props,
} from "./shared";
export function AlipaySkin(p: Props) {
  const { tab, setTab, q, setQ, items } = useContent(p, "账单");
  const list =
    tab === "卡包"
      ? items.filter((i) => i.folder === "卡包" || i.folder === "票券")
      : items.filter((i) => !["卡包", "票券"].includes(i.folder));
  return (
    <div className="catalog-skin alipay-ui">
      <Header p={p} />
      <div className="alipay-blue">
        <h2>{tab}</h2>
        <div>
          <button onClick={() => setTab("账单")}>
            <Receipt size={28} />
            账单
          </button>
          <button onClick={() => setTab("卡包")}>
            <Ticket size={28} />
            卡包
          </button>
        </div>
        <small>作品内的虚构支付记录</small>
      </div>
      <div className="catalog-scroll">
        <SearchBox value={q} set={setQ} />
        {list.map((i) =>
          tab === "卡包" ? (
            <button
              className="alipay-ticket"
              key={i.id}
              onClick={() => p.onItem(i)}
            >
              <Ticket size={23} />
              <div>
                <strong>{i.title}</strong>
                <p>{i.body}</p>
                <small>{i.time}</small>
              </div>
            </button>
          ) : (
            <button
              className="alipay-bill"
              key={i.id}
              onClick={() => p.onItem(i)}
            >
              <Wallet size={27} />
              <div>
                <strong>{i.title}</strong>
                <small>
                  {meta(i, "merchant", i.sender)} · {i.time.slice(5, 16)}
                </small>
              </div>
              <span>
                <strong>{meta(i, "amount", "—")}</strong>
                <small>{meta(i, "status", "账单记录")}</small>
              </span>
            </button>
          ),
        )}
        <Empty items={list} />
      </div>
      <Tabs
        tabs={["账单", "卡包"]}
        value={tab}
        set={setTab}
        icons={[<Receipt />, <Ticket />]}
      />
    </div>
  );
}
const taobaoProducts = [
  {
    "id": "swisse-sleep",
    "name": "褪黑素升级版 swisse 睡眠片 安瓶助眠 闪失快入睡 退黑色素 官方正品",
    "price": 239.53,
    "sold": "100万+",
    "shop": "Naturetech海外旗舰店",
    "emoji": "💜",
    "color": "#eee7f7",
    "tags": [
      "保健",
      "睡眠",
      "褪黑素"
    ],
    "originalPrice": null,
    "priceSuffix": "起",
    "offer": "官方立减69.5元；满250减30",
    "detail": "澳大利亚品牌｜跨境电商｜进口税价格已含税｜店铺入会价"
  },
  {
    "id": "squidward-holder",
    "name": "章鱼哥牙刷置物架 卫生间免打孔手动牙刷收纳架 创意桌面装饰小摆件",
    "price": 24.5,
    "sold": "46",
    "shop": "",
    "emoji": "🪥",
    "color": "#e4f2ed",
    "tags": [
      "日用",
      "收纳",
      "牙刷"
    ],
    "originalPrice": 28.9,
    "priceSuffix": "起",
    "offer": "官方立减15%，省4.4元",
    "detail": "1个装／2个装可选"
  },
  {
    "id": "wmf-pan",
    "name": "德国WMF福腾宝星辰牛排煎锅 条纹平底不粘锅 家用燃气电磁炉专用",
    "price": 364,
    "sold": "2000+",
    "shop": "WMF福腾宝",
    "emoji": "🍳",
    "color": "#f1f1f1",
    "tags": [
      "厨房",
      "煎锅",
      "厨具"
    ],
    "originalPrice": 619,
    "priceSuffix": "起",
    "offer": "官方立减200元；满380减45",
    "detail": "星辰Pro牛排煎盘｜燃气、电磁炉适用"
  },
  {
    "id": "binggrae-protein",
    "name": "韩国直邮宾格瑞BINGGRAE蛋白质饮料低卡代餐奶昔 健身蛋白饮250ml",
    "price": 317,
    "sold": "2000+",
    "shop": "",
    "emoji": "🥛",
    "color": "#f2e9f5",
    "tags": [
      "食品",
      "饮料",
      "蛋白质"
    ],
    "originalPrice": 320,
    "priceSuffix": "",
    "offer": "券满4减3",
    "detail": "250ml｜六种口味企划装｜韩国直邮"
  },
  {
    "id": "bibigo-dumplings",
    "name": "必品阁bibigo王饺子韩式泡菜蒸饺速冻水饺 韩国希杰煎饺速食早餐",
    "price": 33.28,
    "sold": "10万+",
    "shop": "必品阁",
    "emoji": "🥟",
    "color": "#e7f0dc",
    "tags": [
      "食品",
      "速冻",
      "饺子"
    ],
    "originalPrice": null,
    "priceSuffix": "起",
    "offer": "官方立减15%，省6.4元；券满68减3",
    "detail": "韩式泡菜味490g｜其他口味可选"
  },
  {
    "id": "shinchan-pot",
    "name": "【摩登主妇&蜡笔小新】左卫门砂锅煲汤炖锅 新婚乔迁搬家生日礼物",
    "price": 121.25,
    "sold": "7000+",
    "shop": "摩登主妇",
    "emoji": "🍲",
    "color": "#f7e8dc",
    "tags": [
      "厨房",
      "砂锅",
      "蜡笔小新"
    ],
    "originalPrice": null,
    "priceSuffix": "起",
    "offer": "凑单后106.7元起；官方立减15%，省23元",
    "detail": "蜡笔小新联名｜1.2L／1.8L可选"
  },
  {
    "id": "bodydream-suit",
    "name": "BODYDREAM总裁灰西服外套男 松弛感穿搭 宽松休闲毛呢西装／羊毛套装",
    "price": 330.01,
    "sold": "1000+",
    "shop": "BODYDREAM",
    "emoji": "🧥",
    "color": "#e5e5e5",
    "tags": [
      "穿搭",
      "正装",
      "西装",
      "工作"
    ],
    "originalPrice": 499,
    "priceSuffix": "起",
    "offer": "官方立减15%，省75元；满380减45",
    "detail": "灰色男士西服外套｜羊毛套装"
  },
  {
    "id": "polowalk-knit",
    "name": "【100%绵羊毛】POLOWALK男式羊毛衫 2026冬季新品经典翻领时尚上衣",
    "price": 260.48,
    "sold": "300+",
    "shop": "POLOWALK",
    "emoji": "👕",
    "color": "#e9e4e0",
    "tags": [
      "穿搭",
      "羊毛衫",
      "工作"
    ],
    "originalPrice": 352,
    "priceSuffix": "",
    "offer": "官方立减15%，省53元；满250减30",
    "detail": "100%绵羊毛｜花纱灰／花纱咖／花纱驼"
  }
];
type CartSeed = {id:string;shop:string;title:string;spec:string;price:number;original:number;qty:number;tags:string[];image?:string;badge?:"天猫"|"淘宝"|"国际";notice?:string;extra?:string};
const cartSeed:CartSeed[]=[
{"id":"stussy-hoodie","image":"stussy-hoodie","shop":"STUSSY官方旗舰店","badge":"天猫","title":"官方STUSSY经典LOGO连帽卫衣","spec":"BKX黑色;L","price":1299,"original":1299,"qty":1,"tags":[]},
{"id":"lemaire-bag","image":"lemaire-bag","shop":"天猫国际全球探物","badge":"国际","title":"Lemaire Soft Game系列手提包单","spec":"均码;BR490","price":4975,"original":6776,"qty":1,"tags":[]},
{"id":"mgd-hoodie","image":"mgd-hoodie","shop":"MGD官方旗舰店","badge":"淘宝","title":"韩国直邮mahagrid MGD","spec":"L;雾蓝色","price":299,"original":299,"qty":1,"tags":[]},
{id:"gold-bowl",image:"gold-bowl",shop:"摩登主妇旗舰店",badge:"天猫",title:"摩登主妇韩式泡面碗304不锈钢",spec:"金色304不锈钢韩式泡面碗-17CM",price:18.72,original:22.8,qty:2,tags:["消费券","官方立减3.5元","限时折扣券","退货宝"],notice:"限时优惠9.7折，最高省10元，仅剩05:41",extra:"可享满150减18消费券"},
{id:"bibigo-dumplings",shop:"韩膳宫 韩国进口食品超市",badge:"淘宝",title:"必品阁韩式王饺子bibigo",spec:"韩式泡菜490g*2袋",price:33.28,original:42.3,qty:1,tags:["官方立减6.4元","满68减3","淘金币抵0.42元"],image:"bibigo-dumplings"},
{id:"binggrae-protein",shop:"小红豆在韩国",badge:"淘宝",title:"韩国宾格瑞蛋白质饮品代餐奶昔",spec:"六种口味各三瓶 共18瓶",price:317,original:320,qty:1,tags:["满4减3","破损包退","极速退款"],image:"binggrae-protein"},
{id:"squidward-holder",shop:"七号时光小铺",badge:"淘宝",title:"章鱼哥我又开始干活了 牙刷架",spec:"【1个装】章鱼哥牙刷置物架",price:24.5,original:28.9,qty:1,tags:["官方立减4.4元","7天无理由退货","极速退款"],image:"squidward-holder"},
{id:"ceramic-bowls",image:"ceramic-bowls",shop:"meelyhome旗舰店",badge:"天猫",title:"meelyhome陶瓷家用碗碟",spec:"4.5英寸黑+5.7英寸白圆钵碗4个装",price:72.24,original:86,qty:1,tags:["消费券","官方立减12.9元","淘金币抵0.86元","退货宝"],extra:"可享满150减18消费券"},
{id:"wmf-pan",shop:"wmf旗舰店",badge:"天猫",title:"德国WMF专用牛排条纹不粘锅",spec:"星辰Pro牛排煎盘26cm",price:364,original:619,qty:1,tags:["消费券","官方立减200元","满500减10","退货宝"],image:"wmf-pan"},
{id:"sanho-wok",image:"sanho-wok",shop:"sanho三禾旗舰店",badge:"天猫",title:"三禾0涂层100%纯钛炒锅",spec:"32cm送锅铲【真100%纯钛 0涂层】",price:506,original:649,qty:1,tags:["消费券","官方立减98元","退货宝"],extra:"领政府补贴后约¥430.10"},
{id:"bruno-pot",image:"bruno-pot",shop:"bruno旗舰店",badge:"天猫",title:"BRUNO电压力锅小型家用3L",spec:"3L象牙白【0涂层316不锈钢内胆】",price:324.05,original:799,qty:1,tags:["消费券","官方立减120元","限时折扣券","退货宝"],notice:"限时优惠9.5折，最高省128元，已失效",extra:"限时补贴已失效"},
{id:"stone-vacuum",image:"stone-vacuum",shop:"石头电器旗舰店",badge:"天猫",title:"石头除螨级自集尘吸尘器一机8用",spec:"H50 Pro",price:1795.88,original:2799,qty:1,tags:["百亿补贴950元","退货宝","超级爆款"],extra:"领政府补贴等优惠后低至¥1399"},
{id:"uwant-vacuum",image:"uwant-vacuum",shop:"uwant旗舰店",badge:"天猫",title:"Uwant友望双杯除螨仪床上家用",spec:"【小精灵】【双吸口 强拍打】",price:205.7,original:379,qty:1,tags:["百亿加补4.9元","退货宝","买贵必赔"],extra:"领政府补贴后约¥164.56"},
{id:"bodydream-suit",shop:"bodydream旗舰店",badge:"天猫",title:"bodydream总裁灰西服套装",spec:"巴黎灰 上衣;L[150-160斤]",price:330.01,original:499,qty:1,tags:["消费券","官方立减75元","礼金直降","退货宝"],image:"bodydream-suit"},
{id:"polowalk-knit",shop:"POLOWALK官方旗舰店",badge:"天猫",title:"【100%绵羊毛】POLOWALK男式羊毛衫",spec:"藏青;XL[180/100A]",price:260.48,original:352,qty:1,tags:["消费券","官方立减53元","满5.01减5","退货宝"],image:"polowalk-knit"},
{id:"stgivo",image:"stgivo",shop:"STGIVO海外旗舰店",badge:"国际",title:"终身无鼻敏 一生好鼻子",spec:"2瓶基础装【效果起步】",price:336.12,original:468,qty:1,tags:["消费券","官方立减71元","限时折扣券","退货宝"],notice:"限时优惠9.6折，最高省50元，已失效",extra:"进口税:价格已含税 · 限时补贴已失效"},
{id:"swisse-sleep",shop:"Naturetech海外旗舰店",badge:"国际",title:"褪黑素升级版swisse睡眠片安瓶助眠",spec:"【2瓶装 立省20更划算】调节入睡",price:239.53,original:347.5,qty:1,tags:["消费券","官方立减69.5元","淘金币抵3.47元","退货宝"],image:"swisse-sleep",extra:"进口税:价格已含税"}
];
export function TaobaoSkin(p: Props) {
  const {tab,setTab,q,setQ,items}=useContent(p,"商品");
  const [status,setStatus]=useState("全部");
  const [chosen,setChosen]=useState<string|null>(null);
  const [,setBasket]=useState<Record<string,number>>({});
  const [cartQty,setCartQty]=useState<Record<string,number>>(()=>Object.fromEntries(cartSeed.map(x=>[x.id,x.qty])));
  const [cartSelected,setCartSelected]=useState<Record<string,boolean>>({});
  const [cartManage,setCartManage]=useState(false);
  const [history,setHistory]=useState<{id:string;date:string;count:number}[]>(()=>["stussy-hoodie","lemaire-bag","mgd-hoodie","bibigo-dumplings","swisse-sleep","stgivo","binggrae-protein"].map(id=>({id,date:"",count:1})));
  const [section,setSection]=useState("猜你喜欢");
  const scrollRef=useRef<HTMLDivElement>(null);
  useEffect(()=>{if(scrollRef.current)scrollRef.current.scrollTop=0;},[chosen,tab]);
  const chosenProduct=taobaoProducts.find(x=>x.id===chosen);
  const shown=taobaoProducts.filter(x=>(x.name+" "+x.shop+" "+x.tags.join(" ")).toLowerCase().includes(q.trim().toLowerCase())&&(section==="猜你喜欢"||section==="全部"||x.tags.includes(section)));
  const orange="#ff5500";
  const productArt=(x:typeof taobaoProducts[number],height=160)=>(
    <div style={{height,width:"100%",overflow:"hidden",backgroundColor:x.color,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <img src={`${import.meta.env.BASE_URL}taobao-products/${x.id}.jpg`} alt={x.name}
        loading="lazy"
        style={{width:"100%",height:"100%",objectFit:"contain",display:"block"}}
        onError={e=>{const img=e.currentTarget;img.onerror=null;img.style.display="none";}} />
    </div>
  );
  const buy=(id:string)=>setBasket(c=>({...c,[id]:(c[id]||0)+1}));
  return <div className="catalog-skin taobao-ui" style={{background:"#f6f6f6",color:"#262626"}}>
    {tab!=="购物车"&&<Header p={p}/>}
    {tab!=="购物车"&&<div style={{background:"white",padding:"9px 10px 11px",borderBottom:"1px solid #f3f3f3"}}>
      <div style={{display:"flex",gap:16,alignItems:"center",overflowX:"auto",whiteSpace:"nowrap",padding:"3px 3px 12px",fontSize:17,fontWeight:750}}>
        <span style={{background:"#ff5500",color:"white",borderRadius:8,padding:"3px 7px"}}>淘</span>
        <span>关注</span><span style={{color:"#ff5500",borderBottom:"3px solid #ff5500",paddingBottom:4}}>推荐</span><span>闪购</span><span style={{color:"#e90043"}}>双11</span><span>国补</span><span>穿搭</span><span>数码</span>
      </div>
      <div style={{border:"2px solid #ff5500",borderRadius:22,padding:"1px 3px 1px 12px",display:"flex",alignItems:"center",gap:4}}>
        <span style={{fontSize:17,color:"#ff5500"}}>⌕</span>
        <div style={{flex:1,minWidth:0}}><SearchBox value={q} set={v=>{setQ(v);setChosen(null);setTab("商品");}} placeholder="搜索宝贝"/></div>
        <button onClick={()=>{setChosen(null);setTab("商品");}} style={{border:0,borderRadius:17,background:"#ff5500",color:"white",fontWeight:800,padding:"9px 14px"}}>搜索</button>
      </div>
    </div>}
    <div ref={scrollRef} className="catalog-scroll" style={{padding:"8px 7px 110px"}}>
      {tab==="商品" ? chosenProduct ? <div>
        <button onClick={()=>setChosen(null)} style={{border:0,background:"none",padding:"7px 0 13px",color:orange,fontSize:13}}>‹ 返回商品列表</button>
        <div style={{borderRadius:14,overflow:"hidden",background:"white"}}>{productArt(chosenProduct,280)}</div>
        <div style={{background:"white",borderRadius:13,padding:14,marginTop:10}}>
          <div style={{color:orange,fontSize:13}}>¥ <strong style={{fontSize:30}}>{chosenProduct.price}</strong><span style={{fontSize:12}}>{chosenProduct.priceSuffix}</span><span style={{fontSize:11,marginLeft:8,color:"#999"}}>包邮</span></div>
          <strong style={{fontSize:17,lineHeight:1.5}}>{chosenProduct.name}</strong>
          <div style={{fontSize:12,color:"#999",marginTop:9}}>已售 {chosenProduct.sold}{chosenProduct.originalPrice ? ` · 优惠前 ¥${chosenProduct.originalPrice}` : ""}</div><div style={{fontSize:12,color:"#ff5500",marginTop:7}}>{chosenProduct.offer}</div><div style={{fontSize:12,color:"#777",marginTop:7}}>{chosenProduct.detail}</div>
        </div>
        <div style={{background:"white",borderRadius:13,padding:14,marginTop:10}}><strong>{chosenProduct.shop}</strong><div style={{fontSize:12,color:"#888",marginTop:8}}>店铺商品 · 规格及详情请以实际商品为准</div></div>
        <div style={{display:"flex",gap:9,marginTop:13}}>
          <button onClick={()=>buy(chosenProduct.id)} style={{flex:1,border:0,borderRadius:25,background:"#ffab29",color:"white",padding:13,fontWeight:800}}>加入购物车</button>
          <button onClick={()=>{buy(chosenProduct.id);setTab("购物车");setChosen(null);}} style={{flex:1,border:0,borderRadius:25,background:orange,color:"white",padding:13,fontWeight:800}}>立即购买</button>
        </div>
      </div> : <>
        <div style={{display:"flex",gap:9,overflowX:"auto",padding:"6px 0 13px"}}>
          {["猜你喜欢","全部","穿搭","食品","厨房","日用","保健"].map(x=><button key={x} onClick={()=>setSection(x)} style={{whiteSpace:"nowrap",border:0,borderRadius:18,padding:"8px 12px",background:section===x?orange:"white",color:section===x?"white":"#555",fontWeight:section===x?800:500}}>{x}</button>)}
        </div>
        <div style={{columnCount:2,columnGap:7}}>
          {shown.map(x=><button key={x.id} onClick={()=>setChosen(x.id)} style={{display:"block",width:"100%",boxSizing:"border-box",border:0,background:"white",borderRadius:11,overflow:"hidden",padding:0,textAlign:"left",color:"inherit",margin:"0 0 8px",breakInside:"avoid",verticalAlign:"top"}}>
            {productArt(x, x.id==="suit"||x.id==="shirt"||x.id==="umbrella"?205:x.id==="melatonin"||x.id==="mic"||x.id==="camera"?145:175)}
            <div style={{display:"block",padding:"8px 9px 10px",width:"100%",boxSizing:"border-box"}}>
              <div style={{fontSize:11,fontWeight:650,lineHeight:1.35,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden",overflowWrap:"anywhere"}}>{x.name}</div>
              <div style={{color:orange,marginTop:5,fontSize:12}}>¥ <strong style={{fontSize:19,fontWeight:800}}>{x.price}</strong>{x.priceSuffix}</div>
              <div style={{fontSize:10,color:"#999",marginTop:3}}>已售 {x.sold}</div>
              <div style={{fontSize:10,color:"#aaa",marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{x.shop}</div>
            </div>
          </button>)}
        </div>
        {!shown.length&&<div style={{padding:40,textAlign:"center",color:"#999"}}>没有找到相关商品</div>}
      </> : tab==="购物车" ? <>
        <div style={{background:"white",padding:"13px 13px 16px",margin:"-8px -7px 10px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <strong style={{fontSize:22,color:"#14203a"}}>购物车 <span style={{fontSize:15,fontWeight:500}}>(124)</span></strong>
          <button onClick={()=>setCartManage(x=>!x)} style={{border:0,background:"transparent",fontSize:15,color:"#14203a"}}>{cartManage?"完成":"管理"}</button>
        </div>
        {cartSeed.map((x)=>{
          const checked=!!cartSelected[x.id], qty=cartQty[x.id]||0;
          const check=()=>setCartSelected(v=>({...v,[x.id]:!v[x.id]}));
          const dot=(on:boolean,click:()=>void)=><button onClick={click} aria-label="选择商品" style={{width:21,height:21,borderRadius:"50%",border:on?"none":"2px solid #cbd0d8",background:on?"#ff6500":"white",color:"white",padding:0,flexShrink:0,fontSize:14}}>{on?"✓":""}</button>;
          return <div key={x.id} style={{background:"white",borderRadius:12,padding:"14px 12px",marginBottom:9,boxShadow:"0 1px 3px #eee"}}>
            <div style={{display:"flex",alignItems:"center",gap:11,marginBottom:12}}>
              {dot(checked,check)}
              <strong style={{fontSize:15,color:"#14203a",flex:1}}><span style={{color:x.badge==="淘宝"?"#ff6b00":x.badge==="国际"?"#9138e0":"#ff003b",marginRight:5}}>{x.badge}</span>{x.shop} ›</strong>
              <span style={{color:"#8892a3",fontSize:12}}>领券 ›</span>
            </div>
            {x.notice&&<div style={{margin:"0 0 12px 32px",background:"#fff0f3",color:"#fa1946",padding:"9px",borderRadius:7,fontSize:12}}>{x.notice}</div>}
            <div style={{display:"flex",alignItems:"center",gap:9}}>
              {dot(checked,check)}
              <div style={{width:88,height:88,flexShrink:0,borderRadius:9,overflow:"hidden",background:"#f3f3f3"}}>
                {x.image?<img src={`${import.meta.env.BASE_URL}${["gold-bowl","ceramic-bowls","sanho-wok","bruno-pot","stone-vacuum","uwant-vacuum","stgivo","stussy-hoodie","lemaire-bag","mgd-hoodie"].includes(x.id)?"taobao-cart":"taobao-products"}/${x.image}.jpg`} alt={x.title} style={{width:"100%",height:"100%",objectFit:"contain"}}/>:<div style={{width:"100%",height:"100%",background:"#f5f5f5"}}/>}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",gap:5,justifyContent:"space-between",alignItems:"start"}}>
                  <strong style={{fontSize:13,lineHeight:1.5,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",color:"#19223b"}}>{x.title}</strong>
                  <span style={{background:"#f4f5f7",borderRadius:3,fontSize:11,padding:"2px 4px",whiteSpace:"nowrap"}}>×{qty}</span>
                </div>
                <div style={{fontSize:12,color:"#8892a3",margin:"5px 0 6px",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{x.spec} ›</div>
                <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:6}}>{x.tags.map(t=><span key={t} style={{fontSize:10,color:t==="退货宝"?"#19ae6c":"#f56a18",border:"1px solid #ffe1cd",padding:"1px 3px",borderRadius:3}}>{t}</span>)}</div>
                <div style={{color:"#ff1748",fontSize:12}}> {x.price===x.original?"店铺优惠后":"店铺入会后"} ¥<strong style={{fontSize:21}}>{x.price}</strong> <s style={{color:"#8b94a4",fontSize:12}}>¥{x.original}</s></div>
                {cartManage&&<div style={{display:"flex",alignItems:"center",gap:9,justifyContent:"flex-end",marginTop:5}}><button onClick={()=>setCartQty(v=>({...v,[x.id]:Math.max(0,qty-1)}))}>−</button>{qty}<button onClick={()=>setCartQty(v=>({...v,[x.id]:qty+1}))}>＋</button></div>}
              </div>
            </div>
            {x.extra&&<div style={{margin:"10px 0 0 32px",background:x.extra.startsWith("领政府")?"#ebfbf1":"#fff0f2",color:x.extra.startsWith("领政府")?"#12ae63":"#fb2350",borderRadius:7,padding:"8px 10px",fontSize:12,fontWeight:650}}>{x.extra}</div>}
          </div>;
        })}
      </> : <>
        <h3 style={{margin:"7px 0 13px"}}>我的订单</h3>
        <div style={{display:"flex",gap:7,overflowX:"auto",marginBottom:13}}>{["全部","待付款","待发货","待收货","已完成"].map(x=><button key={x} onClick={()=>setStatus(x)} style={{border:0,borderRadius:16,padding:"8px 10px",whiteSpace:"nowrap",background:status===x?"#ffe8dc":"white",color:status===x?orange:"#777"}}>{x}</button>)}</div>
        {history.filter(()=>status==="全部"||status==="已完成").map((h,i)=>{const x=cartSeed.find(z=>z.id===h.id);return x?<div key={h.id+i} style={{background:"white",borderRadius:12,padding:12,marginBottom:9}}><strong style={{fontSize:13}}>{x.shop}</strong><span style={{float:"right",fontSize:11,color:orange}}>已完成</span><div style={{display:"flex",gap:12,marginTop:12}}><img src={`${import.meta.env.BASE_URL}${["gold-bowl","ceramic-bowls","sanho-wok","bruno-pot","stone-vacuum","uwant-vacuum","stgivo","stussy-hoodie","lemaire-bag","mgd-hoodie"].includes(x.id)?"taobao-cart":"taobao-products"}/${x.image||x.id}.jpg`} alt={x.title} style={{width:68,height:68,objectFit:"contain",borderRadius:8}}/><div style={{flex:1,fontSize:12}}>{x.title}<div style={{color:"#999",marginTop:3}}>{x.spec}</div><div style={{marginTop:8,color:"#999"}}>{h.date ? `${h.date} · ` : ""}×{h.count}</div><strong style={{color:orange}}>¥{(x.price*h.count).toFixed(2)}</strong></div></div></div>:null;})}
        {items.filter(i=>i.folder==="订单"&&(status==="全部"||status===meta(i,"status"))).map(i=><button key={i.id} onClick={()=>p.onItem(i)} className="taobao-order"><strong>{i.title}</strong><p>{i.body}</p><small>{i.time}</small></button>)}
        {!history.length&&!items.some(i=>i.folder==="订单")&&<div style={{padding:40,textAlign:"center",color:"#aaa"}}>暂无订单记录</div>}
      </>}
    </div>
    {tab==="购物车"&&<div style={{background:"white",padding:"9px 11px",display:"flex",gap:10,alignItems:"center",fontSize:13}}>
      <button onClick={()=>{const all=cartSeed.every(x=>cartSelected[x.id]);setCartSelected(Object.fromEntries(cartSeed.map(x=>[x.id,!all])));}} style={{border:"2px solid #ccd1d9",borderRadius:"50%",width:21,height:21,background:cartSeed.every(x=>cartSelected[x.id])?"#ff6500":"white",color:"white",flexShrink:0}}>{cartSeed.every(x=>cartSelected[x.id])?"✓":""}</button>
      <span style={{color:"#8791a3"}}>全选</span><span style={{flex:1,textAlign:"right"}}>合计: <strong style={{color:"#ff6500",fontSize:18}}>¥{cartSeed.reduce((sum,x)=>sum+(cartSelected[x.id]?x.price*(cartQty[x.id]||0):0),0).toFixed(2)}</strong></span>
      <button onClick={()=>{const chosen=cartSeed.filter(x=>cartSelected[x.id]);if(chosen.length){setHistory(h=>[...chosen.map(x=>({id:x.id,date:"2026-11-05",count:cartQty[x.id]||0})),...h]);setCartSelected({});setTab("订单");}}} style={{background:"linear-gradient(90deg,#ff9d00,#ff5500)",color:"white",border:0,borderRadius:10,padding:"13px 27px",fontWeight:800,fontSize:16}}>结算</button>
    </div>}
    <Tabs tabs={["商品","购物车","订单"]} value={tab} set={v=>{setTab(v);setChosen(null);}} icons={[<Home/>,<ShoppingBag/>,<Receipt/>]}/>
  </div>;
}
const seoulShops = [
  {id:"berry",name:"Berry Cloud Cake",ko:"草莓鲜奶油蛋糕",area:"延南洞",category:"蛋糕",rating:"4.9",reviews:"1,284",minutes:"25–35",fee:"2,000",price:32000,emoji:"🍓",color:"#FBE4E8",desc:"草莓鲜奶油蛋糕"},
  {id:"butter",name:"Butter & Crumb",ko:"盐面包与可颂",area:"圣水洞",category:"面包",rating:"4.8",reviews:"856",minutes:"20–30",fee:"1,500",price:4500,emoji:"🥐",color:"#F8E8C8",desc:"盐面包与可颂"},
  {id:"matcha",name:"Little Matcha House",ko:"抹茶奶油蛋糕",area:"合井洞",category:"甜品",rating:"4.9",reviews:"624",minutes:"30–40",fee:"2,500",price:8900,emoji:"🍵",color:"#E4EED8",desc:"抹茶奶油蛋糕"},
  {id:"mandu",name:"首尔手工饺子",ko:"手工蒸饺与泡菜饺",area:"紫阳洞",address:"서울특별시 광진구 자양동 1-2",category:"饺子",rating:"4.9",reviews:"932",minutes:"15–25",fee:"1,000",price:8500,emoji:"🥟",color:"#F4E9D8",desc:"手工蒸饺与泡菜饺"},
  {id:"jokbal",name:"圣水洞猪蹄",ko:"韩式酱卤猪蹄",area:"圣水洞",category:"猪蹄",rating:"4.8",reviews:"516",minutes:"25–40",fee:"2,000",price:39000,emoji:"🍖",color:"#F5E8DC",desc:"韩式酱卤猪蹄",address:"서울 성동구 성수일로8길 53 성수동복합시설"},
  {id:"soba",name:"新沙荞麦面",ko:"紫苏油荞麦面",area:"新沙洞",category:"荞麦面",rating:"4.8",reviews:"516",minutes:"25–40",fee:"2,000",price:12000,emoji:"🍜",color:"#F5E8DC",desc:"紫苏油荞麦面",address:"서울 강남구 신사동 576-10"},
  {id:"cream",name:"Maison Cream",ko:"香草奶油蛋糕",area:"汉南洞",category:"蛋糕",rating:"4.8",reviews:"516",minutes:"25–40",fee:"2,000",price:29000,emoji:"🍰",color:"#F5E8DC",desc:"香草奶油蛋糕",address:""},
  {id:"flour",name:"Flour Atelier",ko:"法棍与火腿三明治",area:"西村",category:"面包",rating:"4.8",reviews:"516",minutes:"25–40",fee:"2,000",price:9500,emoji:"🥖",color:"#F5E8DC",desc:"法棍与火腿三明治",address:""},
  {id:"peach",name:"Peach Oven",ko:"桃子水果塔",area:"延禧洞",category:"蛋糕",rating:"4.8",reviews:"516",minutes:"25–40",fee:"2,000",price:11500,emoji:"🍑",color:"#F5E8DC",desc:"桃子水果塔",address:""},
  {id:"cloud",name:"Cloud Nine Bakery",ko:"牛奶吐司与费南雪",area:"望远洞",category:"面包",rating:"4.8",reviews:"478",minutes:"25–35",fee:"2,000",price:6500,emoji:"🍞",color:"#F5E6D5",desc:"牛奶吐司与费南雪"},
];
const deliveryMenus: Record<string, [string,number,number,number][]> = {"berry":[["草莓鲜奶油整蛋糕",32000,4,1680],["草莓蛋糕切块",8500,1,420],["蓝莓奶油蛋糕",9500,1,460]],"butter":[["经典盐面包",4500,1,290],["黄油可颂",4800,1,330],["杏仁可颂",5900,1,410]],"matcha":[["抹茶奶油蛋糕",8900,1,430],["抹茶巴斯克",9800,1,480],["抹茶生巧塔",7900,1,390]],"mandu":[["猪肉蒸饺八只",8500,1,510],["泡菜饺八只",9000,1,480],["虾仁饺八只",10500,2,520]],"jokbal":[["招牌猪蹄小份",39000,2,1450],["招牌猪蹄中份",48000,3,1950],["蒜香猪蹄",44000,2,1680]],"soba":[["紫苏油荞麦面",12000,1,510],["冷荞麦面",11000,1,430],["辣拌荞麦面",12500,1,550]],"cream":[["香草奶油整蛋糕",29000,4,1550],["伯爵茶奶油蛋糕",8900,1,420],["巧克力奶油蛋糕",9200,1,490]],"flour":[["法棍面包",5500,2,640],["火腿黄油三明治",9500,1,580],["核桃乡村面包",7800,2,850]],"peach":[["桃子水果塔",11500,1,490],["桃子奶油蛋糕",9800,1,450],["迷你蜜桃整蛋糕",26000,3,1290]],"cloud":[["牛奶吐司",6500,3,1050],["原味费南雪",3200,1,220],["蜂蜜黄油司康",4500,1,360]]};
type DeliveryOrder = {id:string;date:string;shop:string;product:string;quantity:number;price:number;emoji:string;note?:string};
const deliveryHistory: DeliveryOrder[] = [
  {id:"2026-03-tteok",date:"2026-03-08",shop:"新堂洞辣炒年糕",product:"双人即食辣炒年糕锅（年糕、鱼饼、拉面、鸡蛋）",quantity:2,price:29500,emoji:"🌶️"},
  {id:"2026-02-chicken",date:"2026-02-22",shop:"弘大韩式炸鸡",product:"半半炸鸡（原味＋甜辣）· 腌萝卜 · 可乐×2",quantity:2,price:32500,emoji:"🍗"},
  {id:"2026-01-sundae",date:"2026-01-16",shop:"钟路米肠汤饭",product:"米肠汤饭×2 · 泡菜 · 萝卜块",quantity:2,price:25500,emoji:"🍲"},
  {id:"2025-12-jokbal",date:"2025-12-19",shop:"圣水洞猪蹄",product:"酱卤猪蹄双人份 · 生菜包饭 · 辣拌荞麦面",quantity:2,price:47500,emoji:"🍖"},
  {id:"2025-10-tteok",date:"2025-10-11",shop:"新堂洞辣炒年糕",product:"辣炒年糕双人套餐 · 炸紫菜卷×4 · 炸鱿鱼×2",quantity:2,price:26500,emoji:"🌶️"},
  {id:"2025-08-naengmyeon",date:"2025-08-23",shop:"乙支路冷面",product:"平壤冷面×2 · 绿豆煎饼",quantity:2,price:35500,emoji:"🍜"},
  {id:"2025-06-bossam",date:"2025-06-14",shop:"麻浦菜包肉",product:"菜包肉双人套餐 · 白菜包菜 · 萝卜泡菜",quantity:2,price:41500,emoji:"🥬"},
  {id:"2025-04-bibimbap",date:"2025-04-26",shop:"全州石锅拌饭",product:"石锅拌饭×2 · 韩式煎饼",quantity:2,price:29500,emoji:"🍚"},
  {id:"2025-02-gukbap",date:"2025-02-15",shop:"釜山猪肉汤饭",product:"猪肉汤饭×2 · 饭团 · 泡菜",quantity:2,price:28500,emoji:"🍲"},
  {id:"2025-01-tteok",date:"2025-01-25",shop:"新堂洞辣炒年糕",product:"芝士辣炒年糕双人份 · 鱼饼汤 · 炸饺子",quantity:2,price:28500,emoji:"🌶️"},
  {id:"cake-1101",date:"2024-11-01",shop:"Maison Cream",product:"香草奶油整蛋糕",quantity:1,price:29000,emoji:"🎂",note:"根据聊天中的蛋糕照片编排"},
  {id:"burger-3",date:"2024-10-25",shop:"LOTTERIA 乐天汉堡",product:"韩牛汉堡双人套餐（韩牛汉堡×2、薯条×2、可乐×2）",quantity:2,price:28900,emoji:"🍔"},
  {id:"soba-3",date:"2024-09-18",shop:"新沙荞麦面",product:"紫苏油荞麦面",quantity:2,price:29000,emoji:"🍜"},
  {id:"mandu-2",date:"2024-08-12",shop:"首尔手工饺子",product:"猪肉蒸饺八只 · 泡菜饺八只",quantity:2,price:23500,emoji:"🥟"},
  {id:"burger-2",date:"2024-07-21",shop:"LOTTERIA 乐天汉堡",product:"虾堡双人套餐（虾堡×2、芝士条×2、雪碧×2）",quantity:2,price:23900,emoji:"🍔"},
  {id:"soba-2",date:"2024-06-05",shop:"新沙荞麦面",product:"冷荞麦面",quantity:2,price:27000,emoji:"🍜"},
  {id:"mandu-1",date:"2024-05-18",shop:"首尔手工饺子",product:"虾仁饺八只 · 猪肉蒸饺八只",quantity:2,price:25000,emoji:"🥟"},
  {id:"burger-1",date:"2024-04-14",shop:"LOTTERIA 乐天汉堡",product:"经典牛肉汉堡双人套餐（牛肉汉堡×2、薯条×2、可乐×2）",quantity:2,price:25900,emoji:"🍔"},
  {id:"cake-0317",date:"2024-03-17",shop:"Berry Cloud Cake",product:"草莓鲜奶油整蛋糕",quantity:1,price:32000,emoji:"🍰",note:"聊天中提到已订草莓蛋糕"},
  {id:"soba-1",date:"2024-02-24",shop:"新沙荞麦面",product:"紫苏油荞麦面",quantity:2,price:29000,emoji:"🍜"}
];
const orderPhoto = (o: DeliveryOrder) => {
  const local: Record<string,string> = {
    soba:"soba.jpg",jokbal:"jokbal.jpg",chicken:"chicken.jpg",
    bossam:"bossam.jpg",mandu:"mandu.jpg"
  };
  const match = Object.keys(local).find(k=>o.id.includes(k));
  if (match) return "/fanshu/delivery-food/"+local[match];
  if (o.id==="cake-0317") return "/fanshu/delivery-food/berry.jpg";
  if (o.id==="cake-1101") return "/fanshu/delivery-food/cream.jpg";
  const photos: Record<string,string> = {
    tteok:"Tteok-bokki.jpg",sundae:"Sundae-guk.jpg",
    naengmyeon:"Naengmyeon.jpg",bibimbap:"Bibimbap.jpg",
    gukbap:"Dwaeji-gukbap.jpg",burger:"Hamburger.jpg"
  };
  const type = Object.keys(photos).find(k=>o.id.includes(k));
  return type ? "https://commons.wikimedia.org/wiki/Special:FilePath/"+encodeURIComponent(photos[type])+"?width=320" : "";
};
export function DeliverySkin(p: Props) {
  const {tab,setTab,q,setQ,items}=useContent(p,"商家");
  const [category,setCategory]=useState("全部");
  const [selected,setSelected]=useState<string|null>(null);
  const deliveryScrollRef=useRef<HTMLDivElement>(null);
  useEffect(()=>{if(deliveryScrollRef.current) deliveryScrollRef.current.scrollTop=0;},[selected,tab]);
  const [cart,setCart]=useState<Record<string,number>>({});
  const shop=seoulShops.find(x=>x.id===selected);
  const filtered=seoulShops.filter(x=>(category==="全部"||x.category===category)&&(x.name+" "+x.ko+" "+x.desc).toLowerCase().includes(q.toLowerCase()));
  const count=Object.values(cart).reduce((a,b)=>a+b,0);
  const total=seoulShops.reduce((sum,x)=>sum+x.price*(cart[x.id]||0),0);
  const money=(n:number)=>"₩"+n.toLocaleString("ko-KR");
  const image=(x:typeof seoulShops[number],large=false)=>(
    <div style={{width:"100%",minWidth:0,flex:"none",height:large?194:166,background:x.color,position:"relative",display:"grid",placeItems:"center",overflow:"hidden",borderRadius:large?15:12}}>
      <img src={`/fanshu/delivery-food/${x.id}.jpg`} alt={x.ko} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:x.id==="berry"?"center top":"center",position:"absolute",inset:0}} onError={e=>{e.currentTarget.style.display="none";}} />
      <span style={{fontSize:large?80:66}}>{x.emoji}</span>
      {!large&&<span style={{position:"absolute",top:10,left:10,background:"#ffffffea",borderRadius:5,padding:"4px 8px",fontSize:10,fontWeight:800,color:"#158B7C"}}>BEST</span>}
    </div>
  );
  return (
    <div className="catalog-skin delivery-ui" style={{background:"#F7F8F7",color:"#24322F"}}>
      <Header p={p}/>
      <div ref={deliveryScrollRef} className="catalog-scroll" style={{padding:"13px 14px 95px",background:"#F7F8F7"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:13}}>
          <div><small style={{color:"#72837E",fontSize:11}}>配送地址 ▾</small><div style={{fontSize:13,fontWeight:800,overflowWrap:"anywhere"}}>서울특별시 강남구 논현동 123-45</div></div>
          <span style={{fontSize:22}}>🔔</span>
        </div>
        <div style={{background:"white",borderRadius:13,padding:"3px 10px",marginBottom:13}}><SearchBox value={q} set={setQ} placeholder="搜索蛋糕、面包、饺子"/></div>
        {tab==="商家" ? shop ? (
          <div>
            <button onClick={()=>setSelected(null)} style={{border:0,background:"none",fontSize:14,padding:"5px 0 13px",color:"#268E80"}}>‹ 返回店铺列表</button>
            {image(shop,true)}
            <h2 style={{fontSize:23,margin:"15px 0 4px"}}>{shop.name}</h2>
            <div style={{fontSize:13,color:"#73817D"}}>★ {shop.rating} · 评价 {shop.reviews} · {shop.area}</div>
            {"address" in shop && shop.address && <div style={{fontSize:12,color:"#667873",marginTop:8}}>📍 {shop.address}</div>}<div style={{fontSize:13,margin:"8px 0 16px"}}>配送 {shop.minutes}分钟 · 配送费 {money(Number(shop.fee.replace(",","")))}</div>
            <div style={{background:"white",borderRadius:14,padding:14}}>
              <strong>店铺菜单</strong>
              <p style={{fontSize:12,color:"#82908A"}}>热量为整份估算值，仅供参考</p>
              {deliveryMenus[shop.id].map(([name,price,people,kcal],i)=>(
                <div key={i} style={{padding:"13px 0",borderTop:"1px solid #EEE"}}>
                  <strong>{name}</strong>
                  <div style={{fontSize:12,color:"#82908A",marginTop:5}}>适合{people}人食用 · 约{kcal}千卡</div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:9}}>
                    <strong>{money(price)}</strong>
                    <button onClick={()=>setCart(c=>({...c,[shop.id]:(c[shop.id]||0)+1}))} style={{border:0,background:"#1BAF9A",color:"white",borderRadius:9,padding:"9px 12px",fontWeight:800}}>+ 加入购物车</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div style={{background:"#D8F5ED",borderRadius:16,padding:"17px 15px",marginBottom:18}}>
              <small style={{fontSize:10,color:"#398978",fontWeight:800,letterSpacing:1}}>TODAY'S SWEET PICKS</small>
              <h2 style={{margin:"5px 0",fontSize:22,color:"#16483E"}}>今天来点甜的！ 🍰</h2>
              
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:5,marginBottom:20}}>
              {["全部","蛋糕","面包","甜品","饺子","猪蹄","荞麦面"].map((c,i)=><button key={c} onClick={()=>setCategory(c)} style={{border:0,background:category===c?"#D6F5ED":"white",borderRadius:12,padding:"9px 1px",display:"grid",gap:5,justifyItems:"center",fontSize:10,color:"#34554C",fontWeight:category===c?800:500}}><span style={{fontSize:22}}>{["🏠","🎂","🥐","🍓","🥟","🍖","🍜"][i]}</span>{c}</button>)}
            </div>
            <h2 style={{fontSize:18,margin:"0 0 14px"}}>热门店铺推荐</h2>
            {filtered.map(x=><button key={x.id} onClick={()=>setSelected(x.id)} style={{display:"block",boxSizing:"border-box",border:0,background:"white",textAlign:"left",padding:10,borderRadius:15,marginBottom:13,width:"100%",color:"inherit",minWidth:0}}>
              {image(x)}
              <div style={{display:"flex",justifyContent:"space-between",marginTop:10,gap:8}}>
                <div><strong style={{fontSize:16}}>{x.name}</strong><div style={{fontSize:12,color:"#75837F",marginTop:3}}>{x.ko} · {x.area}</div></div>
                <span style={{fontSize:12,color:"#188F7B",fontWeight:700}}>★ {x.rating}</span>
              </div>
              <div style={{fontSize:12,color:"#75837F",marginTop:7}}>评价 {x.reviews} · 配送 {x.minutes}分钟 · 配送费 ₩{x.fee}</div>{"address" in x && x.address && <div style={{fontSize:11,color:"#8B9793",marginTop:4}}>📍 {x.address}</div>}
            </button>)}
            {filtered.length===0&&<div style={{textAlign:"center",padding:30,color:"#899"}}>没有找到相关店铺</div>}
          </>
        ) : (
          <div>
            <h2 style={{fontSize:21,margin:"5px 0 5px"}}>我的订单</h2>
            <p style={{fontSize:12,color:"#83918B",margin:"0 0 16px"}}>历史订单 · 已送达</p>
            {deliveryHistory.map(o=>(
              <div key={o.id} style={{background:"white",borderRadius:15,padding:"14px 13px",marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",gap:8,alignItems:"center"}}>
                  <strong style={{fontSize:15}}>{o.shop}</strong>
                  <span style={{color:"#179C82",fontSize:12,fontWeight:700}}>已送达</span>
                </div>
                <div style={{fontSize:12,color:"#8C9994",marginTop:5}}>{o.date}</div>
                <div style={{display:"flex",gap:12,alignItems:"center",margin:"13px 0",padding:"10px 0",borderTop:"1px solid #F0F2F0",borderBottom:"1px solid #F0F2F0"}}>
                  <div style={{width:74,height:74,borderRadius:10,background:"#F4F5F0",overflow:"hidden",flexShrink:0}}><img src={orderPhoto(o)} alt={o.product} loading="lazy" style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>{e.currentTarget.style.opacity="0";}} /></div>
                  <div style={{flex:1,minWidth:0}}><strong style={{fontSize:13}}>{o.product}</strong><div style={{fontSize:12,color:"#88958F",marginTop:5}}>{o.quantity} 人份</div></div>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:13}}><span style={{color:"#8A9691"}}>实付款</span><strong>{money(o.price)}</strong></div>
              </div>
            ))}
            {items.filter(i=>i.folder==="订单").map(i=><button key={i.id} onClick={()=>p.onItem(i)} className="delivery-order"><strong>{i.title}</strong><p>{i.body}</p><small>{i.time}</small></button>)}
          </div>
        )}
      </div>
      {count>0&&<div style={{position:"absolute",bottom:67,left:16,right:16,background:"#1BAF9A",borderRadius:12,padding:"11px 14px",color:"white",fontSize:13,fontWeight:800,display:"flex",justifyContent:"space-between",zIndex:4}}><span>购物车 {count}件</span><span>{money(total)}</span></div>}
      <Tabs tabs={["商家","订单"]} value={tab} set={v=>{setTab(v);setSelected(null);}} icons={[<Utensils/>,<Receipt/>]}/>
    </div>
  );
}
