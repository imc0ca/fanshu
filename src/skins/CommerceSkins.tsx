import {
  Home,
  Receipt,
  ShoppingBag,
  Ticket,
  Truck,
  Utensils,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import {
  Empty,
  Header,
  Media,
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
export function TaobaoSkin(p: Props) {
  const { tab, setTab, q, setQ, items } = useContent(p, "商品");
  const [status, setStatus] = useState("全部");
  const list = items
    .filter((i) =>
      tab === "商品"
        ? i.folder !== "订单" && i.folder !== "物流"
        : i.folder === tab,
    )
    .filter((i) => status === "全部" || meta(i, "status") === status);
  return (
    <div className="catalog-skin taobao-ui">
      <Header p={p} />
      <div className="taobao-search">
        <SearchBox value={q} set={setQ} placeholder="搜索商品或订单" />
      </div>
      <div className="catalog-scroll">
        {tab === "商品" ? (
          <div className="taobao-products">
            {list.map((i) => (
              <button key={i.id} onClick={() => p.onItem(i)}>
                <Media item={i} />
                <strong>{i.title}</strong>
                <p>
                  ¥ <b>{meta(i, "price", "—")}</b>
                </p>
                <small>{i.sender}</small>
              </button>
            ))}
          </div>
        ) : (
          <>
            <div className="taobao-status">
              {["全部", "待付款", "待发货", "待收货", "已完成"].map((s) => (
                <button
                  className={s === status ? "selected" : ""}
                  key={s}
                  onClick={() => setStatus(s)}
                >
                  {s}
                </button>
              ))}
            </div>
            {list.map((i) => (
              <button
                className="taobao-order"
                key={i.id}
                onClick={() => p.onItem(i)}
              >
                <div>
                  <ShoppingBag size={16} />
                  <strong>{i.sender}</strong>
                  <small>{meta(i, "status", "订单记录")}</small>
                </div>
                <section>
                  <Media item={i} />
                  <span>
                    <strong>{i.title}</strong>
                    <p>
                      {tab === "物流" ? meta(i, "tracking", i.body) : i.body}
                    </p>
                    <b>¥ {meta(i, "price", "—")}</b>
                  </span>
                </section>
                <footer>{meta(i, "number", i.time)}</footer>
              </button>
            ))}
          </>
        )}
        <Empty items={list} />
      </div>
      <Tabs
        tabs={["商品", "订单", "物流"]}
        value={tab}
        set={(t) => {
          setTab(t);
          setStatus("全部");
        }}
        icons={[<Home />, <ShoppingBag />, <Truck />]}
      />
    </div>
  );
}
const seoulShops = [
  {id:"berry",name:"Berry Cloud Cake",ko:"딸기 생크림 케이크",area:"연남동",category:"케이크",rating:"4.9",reviews:"1,284",minutes:"25–35",fee:"2,000",price:32000,emoji:"🍓",color:"#FBE4E8",desc:"Fresh Strawberry Cream Cake"},
  {id:"butter",name:"Butter & Crumb",ko:"소금빵 · 크루아상",area:"성수동",category:"베이커리",rating:"4.8",reviews:"856",minutes:"20–30",fee:"1,500",price:4500,emoji:"🥐",color:"#F8E8C8",desc:"Signature Salt Bread"},
  {id:"matcha",name:"Little Matcha House",ko:"말차 케이크",area:"합정동",category:"디저트",rating:"4.9",reviews:"624",minutes:"30–40",fee:"2,500",price:8900,emoji:"🍵",color:"#E4EED8",desc:"Matcha Cream Slice"},
  {id:"mandu",name:"Seoul Mandu Kitchen",ko:"수제 만두 · 찐만두",area:"자양동",category:"만두",rating:"4.9",reviews:"932",minutes:"15–25",fee:"1,000",price:8500,emoji:"🥟",color:"#F4E9D8",desc:"Handmade Pork & Kimchi Dumplings"},
  {id:"cloud",name:"Cloud Nine Bakery",ko:"우유 식빵 · 휘낭시에",area:"망원동",category:"베이커리",rating:"4.8",reviews:"478",minutes:"25–35",fee:"2,000",price:6500,emoji:"🍞",color:"#F5E6D5",desc:"Milk Bread & Financier"},
];
export function DeliverySkin(p: Props) {
  const {tab,setTab,q,setQ,items}=useContent(p,"商家");
  const [category,setCategory]=useState("전체");
  const [selected,setSelected]=useState<string|null>(null);
  const [cart,setCart]=useState<Record<string,number>>({});
  const shop=seoulShops.find(x=>x.id===selected);
  const filtered=seoulShops.filter(x=>(category==="전체"||x.category===category)&&(x.name+" "+x.ko+" "+x.desc).toLowerCase().includes(q.toLowerCase()));
  const count=Object.values(cart).reduce((a,b)=>a+b,0);
  const total=seoulShops.reduce((sum,x)=>sum+x.price*(cart[x.id]||0),0);
  const money=(n:number)=>"₩"+n.toLocaleString("ko-KR");
  const image=(x:typeof seoulShops[number],large=false)=>(
    <div style={{height:large?194:166,background:x.color,position:"relative",display:"grid",placeItems:"center",overflow:"hidden",borderRadius:large?15:12}}>
      <img src={`/fanshu/delivery-food/${x.id}.jpg`} alt={x.ko} style={{width:"100%",height:"100%",objectFit:"cover",position:"absolute",inset:0}} onError={e=>{e.currentTarget.style.display="none";}} />
      <span style={{fontSize:large?80:66}}>{x.emoji}</span>
      {!large&&<span style={{position:"absolute",top:10,left:10,background:"#ffffffea",borderRadius:5,padding:"4px 8px",fontSize:10,fontWeight:800,color:"#158B7C"}}>BEST</span>}
    </div>
  );
  return (
    <div className="catalog-skin delivery-ui" style={{background:"#F7F8F7",color:"#24322F"}}>
      <Header p={p}/>
      <div className="catalog-scroll" style={{padding:"13px 14px 95px",background:"#F7F8F7"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:13}}>
          <div><small style={{color:"#72837E",fontSize:11}}>배달 받을 주소 ▾</small><div style={{fontSize:15,fontWeight:800}}>서울특별시 광진구 자양동 1-2</div></div>
          <span style={{fontSize:22}}>🔔</span>
        </div>
        <div style={{background:"white",borderRadius:13,padding:"3px 10px",marginBottom:13}}><SearchBox value={q} set={setQ} placeholder="케이크, 베이커리, 만두 검색"/></div>
        {tab==="商家" ? shop ? (
          <div>
            <button onClick={()=>setSelected(null)} style={{border:0,background:"none",fontSize:14,padding:"5px 0 13px",color:"#268E80"}}>‹ 가게 목록으로</button>
            {image(shop,true)}
            <h2 style={{fontSize:23,margin:"15px 0 4px"}}>{shop.name}</h2>
            <div style={{fontSize:13,color:"#73817D"}}>★ {shop.rating} · 리뷰 {shop.reviews} · {shop.area}</div>
            <div style={{fontSize:13,margin:"8px 0 16px"}}>배달 {shop.minutes}분 · 배달팁 {money(Number(shop.fee.replace(",","")))}</div>
            <div style={{background:"white",borderRadius:14,padding:14}}>
              <strong>대표 메뉴</strong>
              <p style={{fontSize:14,margin:"9px 0 3px"}}>{shop.ko}</p>
              <small style={{color:"#8A9692"}}>{shop.desc}</small>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:14}}>
                <strong>{money(shop.price)}</strong>
                <button onClick={()=>setCart(c=>({...c,[shop.id]:(c[shop.id]||0)+1}))} style={{border:0,background:"#1BAF9A",color:"white",borderRadius:9,padding:"10px 14px",fontWeight:800}}>+ 담기</button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div style={{background:"#D8F5ED",borderRadius:16,padding:"17px 15px",marginBottom:18}}>
              <small style={{fontSize:10,color:"#398978",fontWeight:800,letterSpacing:1}}>TODAY'S SWEET PICKS</small>
              <h2 style={{margin:"5px 0",fontSize:22,color:"#16483E"}}>오늘은 달콤하게! 🍰</h2>
              <small style={{color:"#427F73"}}>서울 인기 디저트 & 수제 만두</small>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(5,minmax(0,1fr))",gap:5,marginBottom:20}}>
              {["전체","케이크","베이커리","디저트","만두"].map((c,i)=><button key={c} onClick={()=>setCategory(c)} style={{border:0,background:category===c?"#D6F5ED":"white",borderRadius:12,padding:"9px 1px",display:"grid",gap:5,justifyItems:"center",fontSize:10,color:"#34554C",fontWeight:category===c?800:500}}><span style={{fontSize:22}}>{["🏠","🎂","🥐","🍓","🥟"][i]}</span>{c}</button>)}
            </div>
            <h2 style={{fontSize:18,margin:"0 0 14px"}}>지금 인기 있는 맛집</h2>
            {filtered.map(x=><button key={x.id} onClick={()=>setSelected(x.id)} style={{border:0,background:"white",textAlign:"left",padding:10,borderRadius:15,marginBottom:13,width:"100%",color:"inherit"}}>
              {image(x)}
              <div style={{display:"flex",justifyContent:"space-between",marginTop:10,gap:8}}>
                <div><strong style={{fontSize:16}}>{x.name}</strong><div style={{fontSize:12,color:"#75837F",marginTop:3}}>{x.ko} · {x.area}</div></div>
                <span style={{fontSize:12,color:"#188F7B",fontWeight:700}}>★ {x.rating}</span>
              </div>
              <div style={{fontSize:12,color:"#75837F",marginTop:7}}>리뷰 {x.reviews} · 배달 {x.minutes}분 · 배달팁 ₩{x.fee}</div>
            </button>)}
            {filtered.length===0&&<div style={{textAlign:"center",padding:30,color:"#899"}}>검색 결과가 없어요</div>}
          </>
        ) : (
          <div><h2 style={{fontSize:20}}>주문내역</h2>{items.filter(i=>i.folder==="订单").map(i=><button key={i.id} onClick={()=>p.onItem(i)} className="delivery-order"><strong>{i.title}</strong><p>{i.body}</p><small>{i.time}</small></button>)}<Empty items={items.filter(i=>i.folder==="订单")}/></div>
        )}
      </div>
      {count>0&&<div style={{position:"absolute",bottom:67,left:16,right:16,background:"#1BAF9A",borderRadius:12,padding:"11px 14px",color:"white",fontSize:13,fontWeight:800,display:"flex",justifyContent:"space-between",zIndex:4}}><span>장바구니 {count}개</span><span>{money(total)}</span></div>}
      <Tabs tabs={["商家","订单"]} value={tab} set={v=>{setTab(v);setSelected(null);}} icons={[<Utensils/>,<Receipt/>]}/>
    </div>
  );
}
