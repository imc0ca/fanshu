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
  {id:"suit",name:"男士商务正装西服套装 修身西装外套＋西裤 面试通勤",price:468,sold:"2千+",shop:"绅士西装定制店",emoji:"🤵",color:"#E4E8EC",tags:["西装","正装","面试","工作"]},
  {id:"melatonin",name:"褪黑素片 睡前营养补充装 60片",price:79,sold:"8千+",shop:"健康生活馆",emoji:"💊",color:"#E8E9F5",tags:["褪黑素","睡眠","保健"]},
  {id:"recorder",name:"便携式专业录音笔 高清降噪 长续航 采访播客",price:329,sold:"1千+",shop:"声音设备专营店",emoji:"🎙️",color:"#E6E9ED",tags:["录音","播客","录音设备","麦克风"]},
  {id:"microphone",name:"USB电容麦克风套装 防喷罩悬臂支架 直播播客",price:259,sold:"3千+",shop:"声学工作室",emoji:"🎤",color:"#E8E6F1",tags:["录音","播客","麦克风"]},
  {id:"headphone",name:"专业监听耳机 头戴式封闭降噪录音剪辑",price:399,sold:"900+",shop:"声学工作室",emoji:"🎧",color:"#E5EBED",tags:["耳机","录音","播客"]},
  {id:"sdcard",name:"高速存储卡 128GB 相机录音设备通用",price:89,sold:"5千+",shop:"数码配件仓",emoji:"💾",color:"#E9E9E9",tags:["录音","存储","相机"]},
  {id:"printer",name:"A4简历打印纸 100张 加厚高白办公用纸",price:35,sold:"1万+",shop:"办公文具旗舰店",emoji:"📄",color:"#F3EEE5",tags:["简历","工作","打印"]},
  {id:"shirt",name:"男士白衬衫 免烫商务长袖衬衣",price:139,sold:"4千+",shop:"绅士西装定制店",emoji:"👔",color:"#E5ECF5",tags:["正装","衬衫","工作"]},
  {id:"tie",name:"男士纯色真丝领带 商务面试礼盒",price:69,sold:"2千+",shop:"绅士西装定制店",emoji:"👔",color:"#E9E1E4",tags:["正装","领带"]},
  {id:"umbrella",name:"自动折叠晴雨伞 加固防风便携黑色",price:58,sold:"6千+",shop:"日常杂货铺",emoji:"☂️",color:"#E2E8ED",tags:["雨伞","日用"]},
  {id:"charger",name:"USB-C快充充电器 30W 双口充电头",price:89,sold:"9千+",shop:"数码配件仓",emoji:"🔌",color:"#EBEDEA",tags:["充电器","数码"]},
  {id:"camera",name:"迷你摄影补光灯 可调色温 摄影棚拍摄",price:128,sold:"2千+",shop:"影像器材专营店",emoji:"📷",color:"#E6E7E7",tags:["摄影","拍摄","补光"]},
];
export function TaobaoSkin(p: Props) {
  const {tab,setTab,q,setQ,items}=useContent(p,"商品");
  const [status,setStatus]=useState("全部");
  const [chosen,setChosen]=useState<string|null>(null);
  const [basket,setBasket]=useState<Record<string,number>>({});
  const [history,setHistory]=useState<{id:string;date:string;count:number}[]>([]);
  const [section,setSection]=useState("猜你喜欢");
  const scrollRef=useRef<HTMLDivElement>(null);
  useEffect(()=>{if(scrollRef.current)scrollRef.current.scrollTop=0;},[chosen,tab]);
  const chosenProduct=taobaoProducts.find(x=>x.id===chosen);
  const shown=taobaoProducts.filter(x=>(x.name+" "+x.shop+" "+x.tags.join(" ")).toLowerCase().includes(q.trim().toLowerCase())&&(section==="猜你喜欢"||section==="全部"||x.tags.includes(section)));
  const cartCount=Object.values(basket).reduce((a,b)=>a+b,0);
  const total=taobaoProducts.reduce((a,x)=>a+x.price*(basket[x.id]||0),0);
  const orange="#ff5500";
  const productArt=(x:typeof taobaoProducts[number],height=160)=><div style={{height,background:x.color,display:"grid",placeItems:"center",fontSize:height>200?90:58,position:"relative",overflow:"hidden"}}><img src={`/fanshu/taobao-products/${x.id}.jpg`} alt={x.name} style={{width:"100%",height:"100%",objectFit:"cover",position:"absolute",inset:0}} onError={e=>{e.currentTarget.style.display="none";}}/><span>{x.emoji}</span></div>;
  const buy=(id:string)=>setBasket(c=>({...c,[id]:(c[id]||0)+1}));
  const checkout=()=>{const date="2026-04-16";setHistory(h=>[...taobaoProducts.filter(x=>basket[x.id]).map(x=>({id:x.id,date,count:basket[x.id]})),...h]);setBasket({});setChosen(null);setTab("订单");};
  return <div className="catalog-skin taobao-ui" style={{background:"#f6f6f6",color:"#262626"}}>
    <Header p={p}/>
    <div style={{background:"white",padding:"9px 10px 11px",borderBottom:"1px solid #f3f3f3"}}>
      <div style={{display:"flex",gap:16,alignItems:"center",overflowX:"auto",whiteSpace:"nowrap",padding:"3px 3px 12px",fontSize:17,fontWeight:750}}>
        <span style={{background:"#ff5500",color:"white",borderRadius:8,padding:"3px 7px"}}>淘</span>
        <span>关注</span><span style={{color:"#ff5500",borderBottom:"3px solid #ff5500",paddingBottom:4}}>推荐</span><span>闪购</span><span style={{color:"#e90043"}}>双11</span><span>国补</span><span>穿搭</span><span>数码</span>
      </div>
      <div style={{border:"2px solid #ff5500",borderRadius:22,padding:"1px 3px 1px 12px",display:"flex",alignItems:"center",gap:4}}>
        <span style={{fontSize:17,color:"#ff5500"}}>⌕</span>
        <div style={{flex:1,minWidth:0}}><SearchBox value={q} set={v=>{setQ(v);setChosen(null);setTab("商品");}} placeholder="西装 录音笔 褪黑素"/></div>
        <button onClick={()=>{setChosen(null);setTab("商品");}} style={{border:0,borderRadius:17,background:"#ff5500",color:"white",fontWeight:800,padding:"9px 14px"}}>搜索</button>
      </div>
    </div>
    <div ref={scrollRef} className="catalog-scroll" style={{padding:"8px 7px 110px"}}>
      {tab==="商品" ? chosenProduct ? <div>
        <button onClick={()=>setChosen(null)} style={{border:0,background:"none",padding:"7px 0 13px",color:orange,fontSize:13}}>‹ 返回商品列表</button>
        <div style={{borderRadius:14,overflow:"hidden",background:"white"}}>{productArt(chosenProduct,280)}</div>
        <div style={{background:"white",borderRadius:13,padding:14,marginTop:10}}>
          <div style={{color:orange,fontSize:13}}>¥ <strong style={{fontSize:30}}>{chosenProduct.price}</strong><span style={{fontSize:11,marginLeft:8,color:"#999"}}>包邮</span></div>
          <strong style={{fontSize:17,lineHeight:1.5}}>{chosenProduct.name}</strong>
          <div style={{fontSize:12,color:"#999",marginTop:9}}>已售 {chosenProduct.sold} · 7天无理由退货</div>
        </div>
        <div style={{background:"white",borderRadius:13,padding:14,marginTop:10}}><strong>{chosenProduct.shop}</strong><div style={{fontSize:12,color:"#888",marginTop:8}}>店铺商品 · 规格及详情请以实际商品为准</div></div>
        <div style={{display:"flex",gap:9,marginTop:13}}>
          <button onClick={()=>buy(chosenProduct.id)} style={{flex:1,border:0,borderRadius:25,background:"#ffab29",color:"white",padding:13,fontWeight:800}}>加入购物车</button>
          <button onClick={()=>{buy(chosenProduct.id);setTab("购物车");setChosen(null);}} style={{flex:1,border:0,borderRadius:25,background:orange,color:"white",padding:13,fontWeight:800}}>立即购买</button>
        </div>
      </div> : <>
        <div style={{display:"flex",gap:9,overflowX:"auto",padding:"6px 0 13px"}}>
          {["猜你喜欢","全部","正装","录音","播客","工作","数码"].map(x=><button key={x} onClick={()=>setSection(x)} style={{whiteSpace:"nowrap",border:0,borderRadius:18,padding:"8px 12px",background:section===x?orange:"white",color:section===x?"white":"#555",fontWeight:section===x?800:500}}>{x}</button>)}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:7,alignItems:"start"}}>
          {shown.map(x=><button key={x.id} onClick={()=>setChosen(x.id)} style={{border:0,background:"white",borderRadius:10,overflow:"hidden",padding:0,textAlign:"left",color:"inherit",alignSelf:"start"}}>
            {productArt(x, x.id==="suit"||x.id==="shirt"||x.id==="umbrella"||x.id==="camera"?226: x.id==="recorder"||x.id==="headphone"?185:150)}
            <div style={{padding:"9px 8px 12px"}}><div style={{fontSize:12,fontWeight:700,lineHeight:1.5,minHeight:36,overflow:"hidden"}}>{x.name}</div>
            <div style={{color:orange,marginTop:6}}>¥ <strong style={{fontSize:21}}>{x.price}</strong></div>
            <div style={{fontSize:10,color:"#999",marginTop:4}}>{x.sold}人付款 · 包邮</div><div style={{fontSize:10,color:"#aaa",marginTop:3}}>{x.shop}</div></div>
          </button>)}
        </div>
        {!shown.length&&<div style={{padding:40,textAlign:"center",color:"#999"}}>没有找到相关商品</div>}
      </> : tab==="购物车" ? <>
        <h3 style={{margin:"7px 0 14px"}}>购物车（{cartCount}）</h3>
        {taobaoProducts.filter(x=>basket[x.id]).map(x=><div key={x.id} style={{background:"white",borderRadius:13,padding:12,display:"flex",gap:12,marginBottom:9}}>
          <div style={{width:74,overflow:"hidden",borderRadius:8}}>{productArt(x,74)}</div>
          <div style={{flex:1}}><strong style={{fontSize:12}}>{x.name}</strong><div style={{color:orange,marginTop:8,fontWeight:800}}>¥{x.price} <span style={{float:"right",color:"#777",fontSize:12}}>×{basket[x.id]}</span></div>
          <button onClick={()=>setBasket(c=>{const n={...c};delete n[x.id];return n;})} style={{border:0,background:"none",color:"#aaa",fontSize:11,padding:0}}>删除</button></div>
        </div>)}
        {!cartCount&&<div style={{padding:50,textAlign:"center",color:"#aaa"}}>购物车还是空的，去逛逛吧</div>}
        {cartCount>0&&<button onClick={checkout} style={{border:0,background:orange,color:"white",borderRadius:24,padding:14,width:"100%",fontWeight:800}}>模拟结算 · ¥{total}</button>}
      </> : <>
        <h3 style={{margin:"7px 0 13px"}}>我的订单</h3>
        <div style={{display:"flex",gap:7,overflowX:"auto",marginBottom:13}}>{["全部","待付款","待发货","待收货","已完成"].map(x=><button key={x} onClick={()=>setStatus(x)} style={{border:0,borderRadius:16,padding:"8px 10px",whiteSpace:"nowrap",background:status===x?"#ffe8dc":"white",color:status===x?orange:"#777"}}>{x}</button>)}</div>
        {history.filter(()=>status==="全部"||status==="已完成").map((h,i)=>{const x=taobaoProducts.find(z=>z.id===h.id);return x?<div key={h.id+i} style={{background:"white",borderRadius:12,padding:12,marginBottom:9}}><strong style={{fontSize:13}}>{x.shop}</strong><span style={{float:"right",fontSize:11,color:orange}}>已完成</span><div style={{display:"flex",gap:12,marginTop:12}}><div style={{width:68}}>{productArt(x,68)}</div><div style={{flex:1,fontSize:12}}>{x.name}<div style={{marginTop:8,color:"#999"}}>{h.date} · ×{h.count}</div><strong style={{color:orange}}>¥{x.price*h.count}</strong></div></div></div>:null;})}
        {items.filter(i=>i.folder==="订单"&&(status==="全部"||status===meta(i,"status"))).map(i=><button key={i.id} onClick={()=>p.onItem(i)} className="taobao-order"><strong>{i.title}</strong><p>{i.body}</p><small>{i.time}</small></button>)}
        {!history.length&&!items.some(i=>i.folder==="订单")&&<div style={{padding:40,textAlign:"center",color:"#aaa"}}>暂无订单记录</div>}
      </>}
    </div>
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
