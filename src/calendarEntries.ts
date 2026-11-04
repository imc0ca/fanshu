export type CalendarEntry = { date: string; title: string; start?: string; end?: string; location?: string; category?: "class"|"work"|"personal"; };
const fixed: CalendarEntry[] = [
["2024-01-08","成灿退伍"],["2024-04-12","退伍"],
["2024-04-05","成灿第一次 meeting","14:00","14:30"],["2024-04-17","成灿第二次 meeting","15:00","15:30"],["2024-04-24","成灿合同签约","15:00","15:50"],["2024-04-26","成灿 profile 拍摄","10:00","13:00"],
["2024-05-24","Fashiion画报 editorial casting","10:00"],["2024-05-29","R magazine 8月刊内页复试","14:00"],["2024-06-07","ri2e 夏秋 campaign casting","10:00"],["2024-06-08","Fashiion画报拍摄","10:00"],["2024-06-11","夏秋 campaign 复试","19:00"],["2024-06-20","R magazine 8月刊内页 fitting","14:00"],["2024-06-24","ri2e 夏秋 campaign fitting","10:00"],
["2024-06-29","R magazine 8月刊内页拍摄","10:00","12:00"],["2024-07-06","training","10:00"],["2024-07-07","COMMON FIELD lookbook casting","14:00"],["2024-07-12","COMMON FIELD lookbook 棚拍","10:00"],["2024-07-14","COMMON FIELD lookbook 外景拍摄","14:00"],["2024-07-15","FW Campaign casting","10:00"],["2024-07-20","COMMON FIELD lookbook 外景拍摄","10:00"],["2024-07-21","FW Campaign lookbook fitting","14:00"],["2024-07-24","FW Campaign lookbook 二次 fitting","14:00"],["2024-07-28","SATUR casting","10:00"],["2024-07-28","FW Campaign lookbook 拍摄","14:00"],
["2024-08-02","OFF RECORD editorial test","14:00"],["2024-08-03","SATUR fitting & 前拍","14:00"],["2024-08-06","SATUR拍摄","10:00"],["2024-08-10","OFF RECORD editorial fitting","10:00"],["2024-08-16","OFF RECORD editorial 棚拍","14:00"],["2024-08-17","OFF RECORD editorial 外景","10:00"],["2024-08-19","和经理人时宇哥见面交接工作"],

["2024-05-21","科目一"],["2024-05-22","练车"],["2024-05-23","科目二"],["2024-05-24","练车"],["2024-05-25","练车"],["2024-05-26","科目三"],
["2024-07-20","看房子"],["2024-07-22","看房子"],
["2024-09-26","圣诞企划策划会","15:00","17:00"],
["2024-10-06","美容室","15:00"],["2024-10-06","SATUR Seoul 快闪开幕","18:00"],
["2024-10-15","casting","09:00"],["2024-10-15","SW fitting","17:00"],
["2024-10-20","大邱拍摄"],["2024-10-25","外景拍摄","14:00"],
["2024-12-19","training","14:00"],
["2025-01-17","芬达广告"],["2025-01-17","Fanta commercial film 上线"],
["2025-04-06","石话石说第一期"],["2026-03-15","石话石说第五十期"],
["2024-11-18","就业说明会"],["2024-12-09","实习一轮面试","09:00"],["2024-12-16","终面"],["2025-01-06","入职 day 1"],["2025-02-12","播客第一期录制"],["2025-11-08","二轮试镜","14:00"],["2025-12-17","试镜"],["2025-02-16","毕业典礼"]
].map(([date,title,start,end])=>({date,title,start,end,category:"work" as const}));
const pad=(n:number)=>String(n).padStart(2,"0");
const iso=(d:Date)=>`${d.getUTCFullYear()}-${pad(d.getUTCMonth()+1)}-${pad(d.getUTCDate())}`;
const lessons:{from:string;to:string;weekday:number;title:string;start:string;end:string;location:string}[]=[
{from:"2024-09-02",to:"2024-12-20",weekday:1,title:"管理学原理",start:"08:00",end:"11:30",location:"经营馆阶梯教室C"},
{from:"2024-09-02",to:"2024-12-20",weekday:2,title:"微观经济学（二）",start:"08:00",end:"11:30",location:"三教303"},
{from:"2024-09-02",to:"2024-12-20",weekday:2,title:"市场营销学",start:"13:30",end:"17:00",location:"理科馆115"},
{from:"2024-09-02",to:"2024-12-20",weekday:3,title:"篮球",start:"13:30",end:"17:00",location:"篮球场6"},
{from:"2024-09-02",to:"2024-12-20",weekday:4,title:"民商法",start:"13:30",end:"17:00",location:"法学院阶梯教室A"},
{from:"2024-09-02",to:"2024-12-20",weekday:5,title:"财务会计学",start:"08:00",end:"11:30",location:"经营馆213"},
{from:"2025-03-03",to:"2025-06-20",weekday:2,title:"国际商务",start:"08:00",end:"11:30",location:"经营馆220"},
{from:"2025-03-03",to:"2025-06-20",weekday:2,title:"公司金融学",start:"13:30",end:"17:00",location:"经营馆212"},
{from:"2025-03-03",to:"2025-06-20",weekday:3,title:"毕业设计研讨（一）",start:"08:00",end:"11:30",location:"理科馆研讨间08"}
];
const recurring:CalendarEntry[]=[];
for(const lesson of lessons){for(let t=Date.parse(lesson.from+"T00:00:00Z");t<=Date.parse(lesson.to+"T00:00:00Z");t+=86400000){const d=new Date(t);if(d.getUTCDay()===lesson.weekday)recurring.push({date:iso(d),title:lesson.title,start:lesson.start,end:lesson.end,location:lesson.location,category:"class"});}}
for(const date of ["2024-06-29","2024-07-06","2024-07-13","2024-07-20","2024-07-27"]) {if(date==="2024-07-06")continue;recurring.push({date,title:"training",start:"14:00",end:"17:00",category:"work"});}
// Third-semester seminar weekday was not specified; do not invent weekly dates.
export const calendarEntries:CalendarEntry[]=[...fixed,...recurring].sort((a,b)=>a.date.localeCompare(b.date)||(a.start||"").localeCompare(b.start||""));
