import { useState, useRef, useEffect, useCallback } from "react";

// ─── TOKENS ──────────────────────────────────────────────────────────────────
const C = {
  page:   "#0d0d0f",
  s0:     "#000000",
  s1:     "#111114",
  s2:     "#18181c",
  s3:     "#202024",
  s4:     "#28282e",
  s5:     "#333338",
  ln:     "rgba(255,255,255,0.06)",
  ln2:    "rgba(255,255,255,0.11)",
  ln3:    "rgba(255,255,255,0.18)",
  t:      "#f2f2f5",
  t2:     "#a0a0b0",
  t3:     "#505060",
  acc:    "#d95f45",
  accH:   "#c04f37",
  accS:   "rgba(217,95,69,0.12)",
  accS2:  "rgba(217,95,69,0.20)",
  gr:     "#34c785",
  grS:    "rgba(52,199,133,0.12)",
  bl:     "#4d96f5",
  blS:    "rgba(77,150,245,0.12)",
  ye:     "#f5b731",
  yeS:    "rgba(245,183,49,0.12)",
  re:     "#e05555",
  reS:    "rgba(224,85,85,0.12)",
  pu:     "#9d78e8",
  puS:    "rgba(157,120,232,0.12)",
  r:      "8px",
  rM:     "12px",
  rL:     "16px",
  rXL:    "20px",
  ff:     "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif",
};

// ─── SAMPLE DATA ─────────────────────────────────────────────────────────────
const INIT_CLIENTS = [
  { id:1, name:"Alex Rivera",  av:"AR", email:"alex@riveramedia.com",   phone:"+1 305 555 0123", type:"YouTube",     rate:850,  status:"Active",   joined:"Jan 2024", contract:"Signed",  lastMsg:"2h ago" },
  { id:2, name:"Zoe Chen",     av:"ZC", email:"zoe@zoechen.co",         phone:"+1 407 555 0187", type:"Instagram",   rate:600,  status:"Active",   joined:"Mar 2024", contract:"Signed",  lastMsg:"1d ago" },
  { id:3, name:"Marcus Webb",  av:"MW", email:"m.webb@webbprod.io",     phone:"+1 212 555 0041", type:"Corporate",   rate:1200, status:"Active",   joined:"Nov 2023", contract:"Signed",  lastMsg:"3d ago" },
  { id:4, name:"Priya Nair",   av:"PN", email:"priya@naircreative.com", phone:"+1 310 555 0098", type:"YouTube",     rate:750,  status:"Inactive", joined:"Feb 2024", contract:"Expired", lastMsg:"3w ago" },
  { id:5, name:"Jake Torres",  av:"JT", email:"jake@torresfilm.com",    phone:"+1 512 555 0214", type:"Documentary", rate:1800, status:"Active",   joined:"Oct 2023", contract:"Signed",  lastMsg:"Today"  },
];

const INIT_MSGS = {
  1:[{from:"client",text:"Hey! Can you have ep 47 ready by Friday?",time:"10:23 AM"},{from:"me",text:"Absolutely! Rough cut by Thursday noon.",time:"10:31 AM"},{from:"client",text:"Perfect. Also thinking longer intro.",time:"10:45 AM"}],
  2:[{from:"client",text:"Love the reel! Can we tweak the color grade?",time:"Yesterday"},{from:"me",text:"Sure, warming it up. Sending v2 tonight.",time:"Yesterday"}],
  3:[{from:"me",text:"Q3 recap is done! Check your Drive.",time:"Mon"},{from:"client",text:"Excellent. Invoice approved.",time:"Mon"}],
  4:[{from:"client",text:"Taking a break for now, will reach out soon!",time:"Jun 3"}],
  5:[{from:"client",text:"Can we schedule a call for the rough cut?",time:"Today"},{from:"me",text:"Free at 3pm EST today or tomorrow morning.",time:"Today"}],
};

const INIT_PROJECTS = [
  { id:1, client:"Alex Rivera", title:"Episode 47 — Tech Talk",   status:"In Progress", due:"May 14", progress:65,  type:"YouTube",     value:850,  tasks:[{t:"Rough cut",d:true},{t:"Color grade",d:false},{t:"Sound mix",d:false},{t:"Export & upload",d:false}] },
  { id:2, client:"Jake Torres", title:"Documentary — Act II",      status:"Review",      due:"May 12", progress:90,  type:"Documentary", value:1800, tasks:[{t:"Rough cut",d:true},{t:"Color grade",d:true},{t:"Sound mix",d:true},{t:"Client review",d:false}] },
  { id:3, client:"Zoe Chen",    title:"May Lifestyle Reel",        status:"In Progress", due:"May 15", progress:40,  type:"Instagram",   value:600,  tasks:[{t:"Rough cut",d:true},{t:"Color grade",d:false},{t:"Music sync",d:false},{t:"Export",d:false}] },
  { id:4, client:"Marcus Webb", title:"Company Annual Recap",      status:"Completed",   due:"May 1",  progress:100, type:"Corporate",   value:1200, tasks:[{t:"Rough cut",d:true},{t:"Color grade",d:true},{t:"Sound mix",d:true},{t:"Delivered",d:true}] },
  { id:5, client:"Alex Rivera", title:"Episode 46 — Deep Dive",   status:"Completed",   due:"Apr 28", progress:100, type:"YouTube",     value:850,  tasks:[{t:"Rough cut",d:true},{t:"Color grade",d:true},{t:"Sound mix",d:true},{t:"Delivered",d:true}] },
  { id:6, client:"Priya Nair",  title:"Spring Collection Video",  status:"On Hold",     due:"Jun 1",  progress:20,  type:"YouTube",     value:750,  tasks:[{t:"Rough cut",d:true},{t:"Color grade",d:false},{t:"Sound mix",d:false},{t:"Export",d:false}] },
];

const INIT_PURCHASES = [
  { id:1, name:"Adobe Creative Cloud",  cat:"Software", amount:54.99,  date:"May 1",  recurring:true  },
  { id:2, name:"Epidemic Sound",         cat:"Music",    amount:15.00,  date:"May 1",  recurring:true  },
  { id:3, name:"SSD 2TB WD Black",       cat:"Hardware", amount:129.99, date:"Apr 28", recurring:false },
  { id:4, name:"Frame.io Pro",           cat:"Software", amount:25.00,  date:"May 1",  recurring:true  },
  { id:5, name:"DaVinci Resolve Studio", cat:"Software", amount:295.00, date:"Apr 15", recurring:false },
  { id:6, name:"Artlist License",        cat:"Music",    amount:199.00, date:"Apr 10", recurring:false },
];

const INIT_INCOME = [
  { month:"Jan", earned:2800 }, { month:"Feb", earned:3400 }, { month:"Mar", earned:2900 },
  { month:"Apr", earned:4050 }, { month:"May", earned:3250 },
];

const TEMPLATES = [
  { label:"Project delivered", body:"Hi {name}, your project is ready! Files have been uploaded to your Drive folder. Please let me know if you'd like any revisions. Looking forward to your feedback!" },
  { label:"Revision received",  body:"Hi {name}, thanks for the notes! I'll have the updated version ready within 48 hours. Feel free to reach out if anything else comes up." },
  { label:"Invoice reminder",   body:"Hi {name}, just a friendly reminder that invoice #{inv} for ${amount} is due on {date}. Please let me know if you have any questions!" },
  { label:"Project kickoff",    body:"Hi {name}, excited to get started on your project! I'll send over a rough cut by {date}. Let me know if you have any reference material to share." },
];

const AV_COLORS = [
  ["#0c1a2e","#4d96f5"],["#05190e","#34c785"],["#1c0e06","#e8794a"],
  ["#160a24","#9d78e8"],["#1a1200","#f5b731"],
];

// ─── UTILS ───────────────────────────────────────────────────────────────────
function now() {
  const d = new Date();
  return d.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",second:"2-digit"});
}
function nowDate() {
  return new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"});
}
function nowMonthYear() {
  return new Date().toLocaleDateString("en-US",{month:"long",year:"numeric"});
}
function curMonth() { return new Date().toLocaleDateString("en-US",{month:"short"}); }
function daysInCurMonth() { const d=new Date(); return new Date(d.getFullYear(),d.getMonth()+1,0).getDate(); }
function firstDayOfMonth() { const d=new Date(); return new Date(d.getFullYear(),d.getMonth(),1).getDay(); }
function todayNum() { return new Date().getDate(); }

// ─── EDITABLE INLINE ─────────────────────────────────────────────────────────
// Click to edit any value inline
function EditableText({ value, onChange, style={}, numericOnly=false, prefix="", suffix="" }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));
  const ref = useRef();

  const start = () => { setDraft(String(value)); setEditing(true); setTimeout(()=>ref.current?.select(),20); };
  const save = () => {
    setEditing(false);
    const v = numericOnly ? (parseFloat(draft.replace(/[^0-9.]/g,""))||0) : draft.trim()||value;
    onChange(v);
  };

  if (editing) return (
    <input ref={ref} value={draft} onChange={e=>setDraft(e.target.value)}
      onBlur={save} onKeyDown={e=>{if(e.key==="Enter")save();if(e.key==="Escape")setEditing(false);}}
      style={{ background:"transparent", border:"none", borderBottom:`1px solid ${C.acc}`, color:"inherit",
        fontSize:"inherit", fontWeight:"inherit", fontFamily:C.ff, outline:"none", width:"100%",
        letterSpacing:"inherit", padding:"0 0 1px", ...style }} />
  );

  return (
    <span onClick={start} title="Click to edit"
      style={{ cursor:"text", borderBottom:`1px dashed transparent`, transition:"border-color 0.15s",
        display:"inline-block", minWidth:20, ...style }}
      onMouseEnter={e=>e.currentTarget.style.borderBottomColor=C.t3}
      onMouseLeave={e=>e.currentTarget.style.borderBottomColor="transparent"}>
      {prefix}{typeof value==="number"?value.toLocaleString():value}{suffix}
    </span>
  );
}

// ─── EDITABLE STAT CARD ───────────────────────────────────────────────────────
function StatCard({ card, onUpdate, onDelete, canDelete=true }) {
  const colorMap = { acc:C.acc, green:C.gr, blue:C.bl, yellow:C.ye, red:C.re, purple:C.pu, default:C.t };
  const valueColor = colorMap[card.color] || C.t;
  const [hov, setHov] = useState(false);

  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ background:C.s2, border:`1px solid ${hov?C.ln2:C.ln}`, borderRadius:C.rL,
        padding:"1rem 1.1rem", position:"relative", transition:"border-color 0.2s, transform 0.2s",
        transform:hov?"translateY(-1px)":"none" }}>
      {canDelete && hov && (
        <button onClick={()=>onDelete(card.id)}
          style={{ position:"absolute", top:8, right:8, background:"none", border:"none",
            color:C.t3, cursor:"pointer", fontSize:14, lineHeight:1, padding:2,
            transition:"color 0.15s" }}
          onMouseEnter={e=>e.currentTarget.style.color=C.re}
          onMouseLeave={e=>e.currentTarget.style.color=C.t3}>
          <i className="ti ti-x" />
        </button>
      )}
      <p style={{ margin:"0 0 5px", fontSize:10, color:C.t3, textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:500 }}>
        <EditableText value={card.label} onChange={v=>onUpdate({...card,label:v})} style={{ fontSize:10, color:C.t3, letterSpacing:"0.08em", fontWeight:500 }} />
      </p>
      <p style={{ margin:0, fontSize:22, fontWeight:700, color:valueColor, letterSpacing:"-0.025em", fontFamily:C.ff }}>
        {card.prefix&&<span style={{ fontSize:14, fontWeight:500, opacity:0.7 }}>{card.prefix}</span>}
        <EditableText value={card.value} onChange={v=>onUpdate({...card,value:v})}
          numericOnly={card.numeric} style={{ fontSize:22, fontWeight:700, color:valueColor, letterSpacing:"-0.025em" }} />
        {card.suffix&&<span style={{ fontSize:12, fontWeight:400, color:C.t3 }}>{card.suffix}</span>}
      </p>
      {card.sub && <p style={{ margin:"4px 0 0", fontSize:11, color:C.t3 }}>{card.sub}</p>}
    </div>
  );
}

// ─── ADD CARD MODAL ───────────────────────────────────────────────────────────
function AddCardModal({ onAdd, onClose }) {
  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");
  const [sub, setSub] = useState("");
  const [prefix, setPrefix] = useState("");
  const [color, setColor] = useState("default");
  const colors = ["default","green","blue","yellow","acc","red","purple"];

  const save = () => {
    if (!label.trim()) return;
    const num = parseFloat(value.replace(/[^0-9.]/g,""));
    onAdd({ id:Date.now(), label:label.trim(), value:isNaN(num)?value.trim():num,
      sub:sub.trim(), prefix:prefix.trim(), color, numeric:!isNaN(num) });
    onClose();
  };

  return (
    <Overlay onClose={onClose}>
      <p style={{ margin:"0 0 4px", fontSize:11, color:C.t3, textTransform:"uppercase", letterSpacing:"0.08em" }}>New stat card</p>
      <p style={{ margin:"0 0 1.25rem", fontSize:17, fontWeight:600, color:C.t }}>Add a metric</p>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        <FI placeholder="Label (e.g. Net Revenue)" value={label} onChange={e=>setLabel(e.target.value)} />
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
          <FI placeholder="Prefix (e.g. $)" value={prefix} onChange={e=>setPrefix(e.target.value)} />
          <FI placeholder="Value (e.g. 4200)" value={value} onChange={e=>setValue(e.target.value)} />
        </div>
        <FI placeholder="Subtitle (optional)" value={sub} onChange={e=>setSub(e.target.value)} />
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {colors.map(col=>{
            const cmap={default:C.t,green:C.gr,blue:C.bl,yellow:C.ye,acc:C.acc,red:C.re,purple:C.pu};
            return <button key={col} onClick={()=>setColor(col)} style={{ width:22, height:22, borderRadius:"50%", background:cmap[col], border:`2px solid ${color===col?"#fff":"transparent"}`, cursor:"pointer", opacity:color===col?1:0.5, transition:"all 0.15s" }} />;
          })}
        </div>
      </div>
      <div style={{ display:"flex", gap:8, marginTop:"1.25rem" }}>
        <AppleBtn variant="primary" onClick={save} style={{ flex:1, justifyContent:"center" }}>Add card</AppleBtn>
        <AppleBtn variant="ghost" onClick={onClose}>Cancel</AppleBtn>
      </div>
    </Overlay>
  );
}

// ─── STAT GRID ────────────────────────────────────────────────────────────────
function StatGrid({ cards, onUpdateCard, onDeleteCard, onAddCard }) {
  const [showAdd, setShowAdd] = useState(false);
  return (
    <>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))", gap:10, marginBottom:"1.25rem" }}>
        {cards.map(card=>(
          <StatCard key={card.id} card={card}
            onUpdate={updated=>onUpdateCard(updated)}
            onDelete={id=>onDeleteCard(id)} />
        ))}
        <button onClick={()=>setShowAdd(true)}
          style={{ background:"rgba(255,255,255,0.02)", border:`1px dashed ${C.ln2}`, borderRadius:C.rL,
            padding:"1rem", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
            gap:6, cursor:"pointer", color:C.t3, transition:"all 0.15s", minHeight:80 }}
          onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.04)";e.currentTarget.style.borderColor=C.ln3;}}
          onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.02)";e.currentTarget.style.borderColor=C.ln2;}}>
          <i className="ti ti-plus" style={{ fontSize:16 }} />
          <span style={{ fontSize:10, fontWeight:500, letterSpacing:"0.05em", textTransform:"uppercase" }}>Add card</span>
        </button>
      </div>
      {showAdd && <AddCardModal onAdd={card=>{onAddCard(card);}} onClose={()=>setShowAdd(false)} />}
    </>
  );
}

// ─── PRIMITIVES ───────────────────────────────────────────────────────────────
function Av({ label, idx=0, size=38 }) {
  const [bg,fg] = AV_COLORS[idx % AV_COLORS.length];
  return <div style={{ width:size, height:size, borderRadius:"50%", background:bg, color:fg,
    display:"flex", alignItems:"center", justifyContent:"center", fontWeight:600,
    fontSize:size*0.3, flexShrink:0, letterSpacing:"0.01em", fontFamily:C.ff }}>{label}</div>;
}

function Badge({ children, color="dim" }) {
  const map = { green:[C.grS,C.gr], blue:[C.blS,C.bl], yellow:[C.yeS,C.ye],
    red:[C.reS,C.re], acc:[C.accS,C.acc], purple:[C.puS,C.pu],
    dim:["rgba(255,255,255,0.05)",C.t3] };
  const [bg,fg] = map[color]||map.dim;
  return <span style={{ background:bg, color:fg, fontSize:10, fontWeight:600,
    padding:"2px 8px", borderRadius:20, letterSpacing:"0.04em", textTransform:"uppercase", fontFamily:C.ff }}>{children}</span>;
}

function SBadge({ s }) {
  const m = { "Active":"green","Inactive":"dim","In Progress":"blue","Review":"yellow",
    "Completed":"green","On Hold":"red","Signed":"green","Expired":"red","Pending":"yellow" };
  return <Badge color={m[s]||"dim"}>{s}</Badge>;
}

function Bar({ v, color=C.acc }) {
  return <div style={{ background:"rgba(255,255,255,0.05)", borderRadius:4, height:4, overflow:"hidden" }}>
    <div style={{ width:`${v}%`, height:"100%", background:color, borderRadius:4, transition:"width 0.6s cubic-bezier(0.4,0,0.2,1)" }} />
  </div>;
}

function Card({ children, style={}, onClick }) {
  const [hov,setHov] = useState(false);
  return <div onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
    style={{ background:C.s2, border:`1px solid ${hov&&onClick?C.ln2:C.ln}`, borderRadius:C.rL,
      padding:"1.1rem 1.25rem", transition:"all 0.2s cubic-bezier(0.4,0,0.2,1)",
      cursor:onClick?"pointer":"default", transform:hov&&onClick?"translateY(-1px)":"none", ...style }}>
    {children}
  </div>;
}

function Divider() { return <div style={{ height:"0.5px", background:C.ln, margin:"0.75rem 0" }} />; }

function FI({ style={}, ...props }) {
  return <input {...props} style={{ background:C.s3, border:`1px solid ${C.ln2}`, borderRadius:C.r,
    color:C.t, fontSize:13, padding:"9px 13px", outline:"none", width:"100%",
    boxSizing:"border-box", fontFamily:C.ff, transition:"border-color 0.15s", ...style }}
    onFocus={e=>e.target.style.borderColor=C.acc}
    onBlur={e=>e.target.style.borderColor=C.ln2} />;
}

function FS({ children, style={}, ...props }) {
  return <select {...props} style={{ background:C.s3, border:`1px solid ${C.ln2}`, borderRadius:C.r,
    color:C.t, fontSize:13, padding:"9px 13px", outline:"none", width:"100%",
    boxSizing:"border-box", fontFamily:C.ff, ...style }}>{children}</select>;
}

function AppleBtn({ children, variant="ghost", style={}, ...props }) {
  const [hov,setHov] = useState(false);
  const base = { display:"inline-flex", alignItems:"center", gap:6, padding:"8px 16px",
    borderRadius:C.r, fontSize:13, fontWeight:500, cursor:"pointer", border:"none",
    transition:"all 0.15s", letterSpacing:"-0.01em", fontFamily:C.ff };
  const vars = {
    primary: { background:hov?C.accH:C.acc, color:"#fff", boxShadow:hov?"0 4px 12px rgba(217,95,69,0.3)":"none" },
    ghost:   { background:hov?"rgba(255,255,255,0.08)":"rgba(255,255,255,0.04)", color:C.t2, border:`0.5px solid ${C.ln2}` },
    danger:  { background:hov?C.reS:"transparent", color:C.re, border:`0.5px solid ${C.reS}` },
  };
  return <button {...props} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
    style={{ ...base, ...(vars[variant]||vars.ghost), ...style }}>{children}</button>;
}

function Overlay({ children, onClose }) {
  return <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.82)", zIndex:300,
    display:"flex", alignItems:"center", justifyContent:"center",
    backdropFilter:"blur(8px)", WebkitBackdropFilter:"blur(8px)" }}
    onClick={onClose}>
    <div style={{ background:C.s1, border:`0.5px solid ${C.ln2}`, borderRadius:C.rXL,
      padding:"1.75rem", width:380, maxWidth:"92vw", maxHeight:"88vh", overflowY:"auto",
      boxShadow:"0 32px 64px rgba(0,0,0,0.6)" }}
      onClick={e=>e.stopPropagation()}>
      {children}
    </div>
  </div>;
}

function SectionLabel({ children }) {
  return <p style={{ margin:"0 0 0.75rem", fontSize:11, fontWeight:600, color:C.t3,
    textTransform:"uppercase", letterSpacing:"0.08em" }}>{children}</p>;
}

// ─── NAV ─────────────────────────────────────────────────────────────────────
const NAV = [
  { id:"home",      icon:"ti-layout-dashboard", label:"Dashboard" },
  { id:"clients",   icon:"ti-users",            label:"Clients"   },
  { id:"projects",  icon:"ti-layout-kanban",    label:"Projects"  },
  { id:"finance",   icon:"ti-chart-bar",        label:"Earnings"  },
  { id:"expenses",  icon:"ti-receipt",          label:"Expenses"  },
  { id:"calendar",  icon:"ti-calendar",         label:"Calendar"  },
  { id:"templates", icon:"ti-template",         label:"Templates" },
];

function Nav({ page, setPage }) {
  return <div style={{ display:"flex", gap:2, padding:"0 0 1.25rem", borderBottom:`0.5px solid ${C.ln}`,
    marginBottom:"1.75rem", flexWrap:"wrap" }}>
    {NAV.map(n => {
      const active = page === n.id;
      return <button key={n.id} onClick={()=>setPage(n.id)}
        style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 14px", borderRadius:C.r,
          border:active?`0.5px solid rgba(217,95,69,0.3)`:"0.5px solid transparent",
          background:active?C.accS:"transparent", color:active?C.acc:C.t3,
          fontSize:12, fontWeight:active?600:400, cursor:"pointer", transition:"all 0.15s",
          letterSpacing:"-0.01em", fontFamily:C.ff }}>
        <i className={`ti ${n.icon}`} style={{ fontSize:14 }} />{n.label}
      </button>;
    })}
  </div>;
}

// ─── MSG MODAL ────────────────────────────────────────────────────────────────
function MsgModal({ client, msgs, onClose, onSend }) {
  const [input,setInput] = useState("");
  const bottomRef = useRef();
  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[msgs]);
  const send = () => { if(!input.trim()) return; onSend(client.id,input.trim()); setInput(""); };

  return <Overlay onClose={onClose}>
    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:"1rem", paddingBottom:"1rem", borderBottom:`0.5px solid ${C.ln}` }}>
      <Av label={client.av} idx={client.id-1} />
      <div style={{ flex:1 }}>
        <p style={{ margin:0, fontWeight:600, fontSize:15, color:C.t }}>{client.name}</p>
        <p style={{ margin:0, fontSize:11, color:C.t3 }}>{client.type} · {client.status}</p>
      </div>
      <button onClick={onClose} style={{ background:"none", border:"none", color:C.t3, fontSize:18, cursor:"pointer" }}><i className="ti ti-x" /></button>
    </div>
    <div style={{ maxHeight:260, overflowY:"auto", display:"flex", flexDirection:"column", gap:10, marginBottom:"1rem" }}>
      {msgs.map((m,i)=>(
        <div key={i} style={{ display:"flex", flexDirection:m.from==="me"?"row-reverse":"row", gap:8, alignItems:"flex-end" }}>
          <div style={{ background:m.from==="me"?C.acc:C.s3, color:m.from==="me"?"#fff":C.t,
            borderRadius:m.from==="me"?"14px 14px 3px 14px":"14px 14px 14px 3px",
            padding:"9px 13px", fontSize:13, maxWidth:"78%", lineHeight:1.55 }}>
            <p style={{ margin:0 }}>{m.text}</p>
            <p style={{ margin:"4px 0 0", fontSize:10, opacity:0.5, textAlign:m.from==="me"?"right":"left" }}>{m.time}</p>
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
    <div style={{ display:"flex", gap:8 }}>
      <FI value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Message…" style={{ flex:1 }} />
      <AppleBtn variant="primary" onClick={send}><i className="ti ti-send" style={{ fontSize:13 }} /></AppleBtn>
    </div>
  </Overlay>;
}

// ─── INVOICE MODAL ────────────────────────────────────────────────────────────
function InvoiceModal({ client, project, onClose }) {
  const [paid,setPaid] = useState(false);
  const inv = `INV-${String(client.id).padStart(3,"0")}${Date.now().toString().slice(-4)}`;
  const due = new Date(); due.setDate(due.getDate()+14);
  const dueStr = due.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});
  return <Overlay onClose={onClose}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"1.25rem" }}>
      <div>
        <p style={{ margin:"0 0 2px", fontSize:10, color:C.t3, textTransform:"uppercase", letterSpacing:"0.08em" }}>Invoice</p>
        <p style={{ margin:0, fontWeight:700, fontSize:22, color:C.t, letterSpacing:"-0.025em" }}>{inv}</p>
      </div>
      <div style={{ textAlign:"right" }}><SBadge s={paid?"Active":"Pending"} /><p style={{ margin:"6px 0 0", fontSize:11, color:C.t3 }}>Due {dueStr}</p></div>
    </div>
    <Divider />
    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"0.5rem" }}>
      <div><p style={{ margin:"0 0 2px", fontSize:10, color:C.t3, textTransform:"uppercase" }}>Bill to</p><p style={{ margin:0, fontWeight:600, color:C.t }}>{client.name}</p><p style={{ margin:0, fontSize:12, color:C.t3 }}>{client.email}</p></div>
      <div style={{ textAlign:"right" }}><p style={{ margin:"0 0 2px", fontSize:10, color:C.t3, textTransform:"uppercase" }}>Project</p><p style={{ margin:0, fontSize:13, color:C.t }}>{project||"Video editing services"}</p></div>
    </div>
    <Divider />
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.25rem" }}>
      <p style={{ margin:0, color:C.t2, fontSize:14 }}>Video editing services</p>
      <p style={{ margin:0, fontWeight:700, fontSize:22, color:C.acc, letterSpacing:"-0.025em" }}>${client.rate.toLocaleString()}</p>
    </div>
    <div style={{ display:"flex", gap:8 }}>
      <AppleBtn variant="primary" style={{ flex:1, justifyContent:"center" }}
        onClick={()=>navigator.clipboard?.writeText(`Invoice ${inv}\nTo: ${client.name}\nAmount: $${client.rate}\nDue: ${dueStr}`)}>
        <i className="ti ti-copy" style={{ fontSize:13 }} />Copy Invoice
      </AppleBtn>
      <AppleBtn variant="ghost" onClick={()=>setPaid(p=>!p)}>
        {paid?<><i className="ti ti-x" style={{ fontSize:13 }} />Unpaid</>:<><i className="ti ti-check" style={{ fontSize:13 }} />Mark Paid</>}
      </AppleBtn>
      <button onClick={onClose} style={{ background:"none", border:"none", color:C.t3, cursor:"pointer", fontSize:18 }}><i className="ti ti-x" /></button>
    </div>
  </Overlay>;
}

// ─── HOME ─────────────────────────────────────────────────────────────────────
function HomePage({ clients, projects, setPage }) {
  const [time,setTime] = useState(now());
  useEffect(()=>{ const t=setInterval(()=>setTime(now()),1000); return ()=>clearInterval(t); },[]);

  const [homeCards, setHomeCards] = useState([
    { id:1, label:"Active Clients", value:clients.filter(c=>c.status==="Active").length, sub:`${clients.length} total`, color:"default", numeric:true },
    { id:2, label:"Active Projects", value:projects.filter(p=>p.status==="In Progress"||p.status==="Review").length, sub:"in progress", color:"blue", numeric:true },
    { id:3, label:"This Month", value:3250, sub:curMonth()+" "+new Date().getFullYear(), prefix:"$", color:"green", numeric:true },
    { id:4, label:"Month Goal %", value:65, sub:"$5,000 target", suffix:"%", color:"yellow", numeric:true },
  ]);

  const activeProjects = projects.filter(p=>p.status==="In Progress"||p.status==="Review");
  const noContact = clients.filter(c=>c.lastMsg==="3w ago");

  return <div>
    <div style={{ marginBottom:"1.75rem" }}>
      <p style={{ margin:"0 0 2px", fontSize:11, color:C.t3, letterSpacing:"0.02em" }}>{nowDate()}</p>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
        <h2 style={{ margin:0, fontSize:24, fontWeight:700, color:C.t, letterSpacing:"-0.03em" }}>Good morning</h2>
        <p style={{ margin:0, fontSize:20, fontWeight:300, color:C.t3, letterSpacing:"-0.02em", fontVariantNumeric:"tabular-nums" }}>{time}</p>
      </div>
    </div>

    <StatGrid cards={homeCards}
      onUpdateCard={u=>setHomeCards(c=>c.map(x=>x.id===u.id?u:x))}
      onDeleteCard={id=>setHomeCards(c=>c.filter(x=>x.id!==id))}
      onAddCard={card=>setHomeCards(c=>[...c,card])} />

    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:"1.25rem" }}>
      <Card>
        <SectionLabel>Active Projects</SectionLabel>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {activeProjects.slice(0,3).map(p=>(
            <div key={p.id}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                <p style={{ margin:0, fontSize:12, color:C.t, fontWeight:500 }}>{p.title.length>26?p.title.slice(0,26)+"…":p.title}</p>
                <p style={{ margin:0, fontSize:11, color:C.t3 }}>Due {p.due}</p>
              </div>
              <Bar v={p.progress} color={p.status==="Review"?C.ye:C.bl} />
            </div>
          ))}
          {activeProjects.length===0&&<p style={{ margin:0, fontSize:12, color:C.t3 }}>No active projects</p>}
        </div>
      </Card>
      <Card>
        <SectionLabel>Alerts</SectionLabel>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {noContact.map(cl=>(
            <div key={cl.id} style={{ display:"flex", gap:9, alignItems:"flex-start" }}>
              <i className="ti ti-clock" style={{ fontSize:13, color:C.t3, marginTop:1 }} />
              <p style={{ margin:0, fontSize:12, color:C.t }}>No contact: <span style={{ color:C.t2 }}>{cl.name}</span> — {cl.lastMsg}</p>
            </div>
          ))}
          {noContact.length===0&&<p style={{ margin:0, fontSize:12, color:C.t3 }}>All clear ✓</p>}
        </div>
      </Card>
    </div>

    <Card>
      <SectionLabel>Quick Actions</SectionLabel>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        {[["ti-users","Clients","clients"],["ti-layout-kanban","Projects","projects"],["ti-chart-bar","Earnings","finance"],["ti-receipt","Expenses","expenses"],["ti-calendar","Calendar","calendar"],["ti-template","Templates","templates"]].map(([ic,lb,pg])=>(
          <AppleBtn key={pg} variant="ghost" onClick={()=>setPage(pg)}><i className={`ti ${ic}`} style={{ fontSize:13 }} />{lb}</AppleBtn>
        ))}
      </div>
    </Card>
  </div>;
}

// ─── CLIENTS ─────────────────────────────────────────────────────────────────
function ClientsPage({ clients, setClients, onMsg, onInvoice }) {
  const [search,setSearch] = useState("");
  const [filter,setFilter] = useState("All");
  const [clientCards, setClientCards] = useState([
    { id:1, label:"Total Clients", value:INIT_CLIENTS.length, color:"default", numeric:true },
    { id:2, label:"Active", value:INIT_CLIENTS.filter(c=>c.status==="Active").length, color:"green", numeric:true },
    { id:3, label:"Monthly Value", value:INIT_CLIENTS.filter(c=>c.status==="Active").reduce((a,c)=>a+c.rate,0), prefix:"$", color:"acc", numeric:true },
  ]);

  const filtered = clients.filter(c=>{
    const q = search.toLowerCase();
    return (c.name.toLowerCase().includes(q)||c.type.toLowerCase().includes(q)||c.email.toLowerCase().includes(q))
      && (filter==="All"||c.status===filter);
  });

  return <div>
    <h2 style={{ margin:"0 0 1.25rem", fontSize:22, fontWeight:700, color:C.t, letterSpacing:"-0.03em" }}>Clients</h2>
    <StatGrid cards={clientCards}
      onUpdateCard={u=>setClientCards(c=>c.map(x=>x.id===u.id?u:x))}
      onDeleteCard={id=>setClientCards(c=>c.filter(x=>x.id!==id))}
      onAddCard={card=>setClientCards(c=>[...c,card])} />

    <div style={{ display:"flex", gap:8, marginBottom:"1.25rem", flexWrap:"wrap" }}>
      <FI value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search clients…" style={{ flex:1, minWidth:160 }} />
      {["All","Active","Inactive"].map(f=>(
        <AppleBtn key={f} variant={filter===f?"primary":"ghost"} onClick={()=>setFilter(f)}>{f}</AppleBtn>
      ))}
    </div>

    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
      {filtered.map((cl,i)=>(
        <Card key={cl.id} style={{ padding:"1rem 1.25rem" }}>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <Av label={cl.av} idx={i} />
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:4 }}>
                <p style={{ margin:0, fontWeight:600, fontSize:14, color:C.t, letterSpacing:"-0.01em" }}>
                  <EditableText value={cl.name} onChange={v=>setClients(prev=>prev.map(x=>x.id===cl.id?{...x,name:v}:x))} style={{ fontSize:14, fontWeight:600, color:C.t, letterSpacing:"-0.01em" }} />
                </p>
                <SBadge s={cl.status} /><Badge color="dim">{cl.type}</Badge>
              </div>
              <p style={{ margin:0, fontSize:11, color:C.t3 }}>{cl.email} · {cl.phone}</p>
              <div style={{ display:"flex", gap:8, alignItems:"center", marginTop:5 }}>
                <span style={{ fontSize:10, color:C.t3 }}>Contract:</span><SBadge s={cl.contract} />
                <span style={{ fontSize:10, color:C.t3 }}>Last: {cl.lastMsg}</span>
              </div>
            </div>
            <div style={{ textAlign:"right", flexShrink:0, display:"flex", flexDirection:"column", gap:6, alignItems:"flex-end" }}>
              <p style={{ margin:0, fontWeight:700, fontSize:15, color:C.t, letterSpacing:"-0.02em" }}>
                $<EditableText value={cl.rate} onChange={v=>setClients(prev=>prev.map(x=>x.id===cl.id?{...x,rate:Number(v)}:x))} numericOnly style={{ fontSize:15, fontWeight:700, color:C.t }} />
                <span style={{ fontWeight:400, color:C.t3, fontSize:11 }}>/mo</span>
              </p>
              <div style={{ display:"flex", gap:6 }}>
                <AppleBtn variant="ghost" onClick={()=>onMsg(cl)} style={{ fontSize:11, padding:"4px 10px" }}><i className="ti ti-message" style={{ fontSize:12 }} />Chat</AppleBtn>
                <AppleBtn variant="ghost" onClick={()=>onInvoice(cl)} style={{ fontSize:11, padding:"4px 10px" }}><i className="ti ti-file-invoice" style={{ fontSize:12 }} />Invoice</AppleBtn>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  </div>;
}

// ─── PROJECTS ─────────────────────────────────────────────────────────────────
function ProjectsPage({ projects, setProjects }) {
  const [filter,setFilter] = useState("All");
  const [expanded,setExpanded] = useState(null);
  const [projectCards, setProjectCards] = useState([
    { id:1, label:"Total", value:INIT_PROJECTS.length, color:"default", numeric:true },
    { id:2, label:"Active", value:INIT_PROJECTS.filter(p=>p.status==="In Progress"||p.status==="Review").length, color:"blue", numeric:true },
    { id:3, label:"Completed", value:INIT_PROJECTS.filter(p=>p.status==="Completed").length, color:"green", numeric:true },
    { id:4, label:"Pipeline", value:INIT_PROJECTS.reduce((a,p)=>a+p.value,0), prefix:"$", color:"acc", numeric:true },
  ]);

  const filtered = filter==="All"?projects:projects.filter(p=>p.status===filter);
  const statusColor = { "In Progress":C.bl,"Review":C.ye,"Completed":C.gr,"On Hold":C.re };

  const toggleTask=(pid,ti)=>setProjects(prev=>prev.map(p=>p.id!==pid?p:{
    ...p,
    tasks:p.tasks.map((t,i)=>i!==ti?t:{...t,d:!t.d}),
    progress:Math.round((p.tasks.map((t,i)=>i===ti?!t.d:t.d).filter(Boolean).length/p.tasks.length)*100)
  }));

  return <div>
    <h2 style={{ margin:"0 0 1.25rem", fontSize:22, fontWeight:700, color:C.t, letterSpacing:"-0.03em" }}>Projects</h2>
    <StatGrid cards={projectCards}
      onUpdateCard={u=>setProjectCards(c=>c.map(x=>x.id===u.id?u:x))}
      onDeleteCard={id=>setProjectCards(c=>c.filter(x=>x.id!==id))}
      onAddCard={card=>setProjectCards(c=>[...c,card])} />

    <div style={{ display:"flex", gap:6, marginBottom:"1.25rem", flexWrap:"wrap" }}>
      {["All","In Progress","Review","Completed","On Hold"].map(s=>(
        <AppleBtn key={s} variant={filter===s?"primary":"ghost"} onClick={()=>setFilter(s)}>{s}</AppleBtn>
      ))}
    </div>

    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
      {filtered.map(p=>(
        <div key={p.id}>
          <Card onClick={()=>setExpanded(expanded===p.id?null:p.id)} style={{ padding:"1rem 1.25rem" }}>
            <div style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap", marginBottom:4 }}>
                  <p style={{ margin:0, fontWeight:600, fontSize:14, color:C.t, letterSpacing:"-0.01em" }}>{p.title}</p>
                  <SBadge s={p.status} /><Badge color="dim">{p.type}</Badge>
                </div>
                <p style={{ margin:"0 0 9px", fontSize:11, color:C.t3 }}>{p.client} · Due {p.due}</p>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ flex:1 }}><Bar v={p.progress} color={statusColor[p.status]||C.acc} /></div>
                  <p style={{ margin:0, fontSize:10, color:C.t3, minWidth:30 }}>{p.progress}%</p>
                </div>
              </div>
              <div style={{ textAlign:"right", flexShrink:0 }}>
                <p style={{ margin:0, fontWeight:700, fontSize:15, color:C.t, letterSpacing:"-0.02em" }}>${p.value.toLocaleString()}</p>
                <p style={{ margin:"3px 0 0", fontSize:10, color:C.t3 }}>{p.tasks.filter(t=>t.d).length}/{p.tasks.length} tasks</p>
                <i className={`ti ${expanded===p.id?"ti-chevron-up":"ti-chevron-down"}`} style={{ fontSize:11, color:C.t3, marginTop:6, display:"block" }} />
              </div>
            </div>
          </Card>
          {expanded===p.id&&(
            <div style={{ background:C.s3, border:`0.5px solid ${C.ln}`, borderTop:"none",
              borderRadius:`0 0 ${C.rL} ${C.rL}`, padding:"0.875rem 1.25rem" }}>
              {p.tasks.map((t,i)=>(
                <div key={i} onClick={()=>toggleTask(p.id,i)}
                  style={{ display:"flex", alignItems:"center", gap:12, padding:"8px 0",
                    cursor:"pointer", borderBottom:i<p.tasks.length-1?`0.5px solid ${C.ln}`:"none" }}>
                  <div style={{ width:17, height:17, borderRadius:5, border:`1.5px solid ${t.d?C.gr:C.t3}`,
                    background:t.d?C.gr:"transparent", display:"flex", alignItems:"center",
                    justifyContent:"center", flexShrink:0, transition:"all 0.2s" }}>
                    {t.d&&<i className="ti ti-check" style={{ fontSize:10, color:"#000" }} />}
                  </div>
                  <p style={{ margin:0, fontSize:13, color:t.d?C.t3:C.t, textDecoration:t.d?"line-through":"none" }}>{t.t}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  </div>;
}

// ─── FINANCE ─────────────────────────────────────────────────────────────────
function FinancePage({ clients }) {
  const [incomeData, setIncomeData] = useState(INIT_INCOME);
  const [goal,setGoal] = useState(5000);

  const total = incomeData.reduce((a,b)=>a+b.earned,0);
  const thisMonth = incomeData[incomeData.length-1].earned;
  const lastMonth = incomeData[incomeData.length-2].earned;
  const estimate = Math.round(thisMonth*1.08);
  const maxVal = Math.max(...incomeData.map(m=>m.earned));
  const taxAside = Math.round(thisMonth*0.25);
  const pct = Math.round(((thisMonth-lastMonth)/lastMonth)*100);

  const [finCards, setFinCards] = useState([
    { id:1, label:"All Time", value:total, prefix:"$", color:"default", numeric:true },
    { id:2, label:"This Month", value:thisMonth, prefix:"$", sub:curMonth()+" "+new Date().getFullYear(), color:"green", numeric:true },
    { id:3, label:"Projected", value:estimate, prefix:"$", sub:"estimate", color:"blue", numeric:true },
    { id:4, label:"vs Last Month", value:pct, sub:`was $${lastMonth.toLocaleString()}`, suffix:"%", color:pct>=0?"green":"red", numeric:true },
    { id:5, label:"Tax Aside 25%", value:taxAside, prefix:"$", color:"yellow", numeric:true },
    { id:6, label:"Net After Tax", value:thisMonth-taxAside, prefix:"$", color:"acc", numeric:true },
  ]);

  const [clientRevenue, setClientRevenue] = useState(
    clients.filter(c=>c.status==="Active").map((c,i)=>({ id:c.id, name:c.name, rate:c.rate, idx:i }))
  );

  return <div>
    <h2 style={{ margin:"0 0 1.25rem", fontSize:22, fontWeight:700, color:C.t, letterSpacing:"-0.03em" }}>Earnings</h2>
    <StatGrid cards={finCards}
      onUpdateCard={u=>setFinCards(c=>c.map(x=>x.id===u.id?u:x))}
      onDeleteCard={id=>setFinCards(c=>c.filter(x=>x.id!==id))}
      onAddCard={card=>setFinCards(c=>[...c,card])} />

    {/* Goal */}
    <Card style={{ marginBottom:"1rem" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.875rem" }}>
        <SectionLabel>Monthly goal</SectionLabel>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:11, color:C.t3 }}>Target: $</span>
          <FI type="number" value={goal} onChange={e=>setGoal(Number(e.target.value))} style={{ width:90, padding:"4px 8px", fontSize:13 }} />
        </div>
      </div>
      <Bar v={Math.min(Math.round((thisMonth/goal)*100),100)} color={thisMonth>=goal?C.gr:C.acc} />
      <p style={{ margin:"6px 0 0", fontSize:11, color:C.t3 }}>${thisMonth.toLocaleString()} of ${goal.toLocaleString()} — {Math.min(Math.round((thisMonth/goal)*100),100)}%</p>
    </Card>

    {/* Bar chart — editable */}
    <Card style={{ marginBottom:"1rem" }}>
      <SectionLabel>Monthly earnings — click a bar value to edit</SectionLabel>
      <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:140 }}>
        {incomeData.map((m,i)=>{
          const h = Math.round((m.earned/maxVal)*118);
          const isLast = i===incomeData.length-1;
          return <div key={m.month} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
            <EditableText value={m.earned} onChange={v=>setIncomeData(d=>d.map((x,j)=>j===i?{...x,earned:Number(v)}:x))}
              numericOnly prefix="$" style={{ fontSize:9, color:C.t3, fontFamily:C.ff }} />
            <div style={{ width:"100%", height:h, background:isLast?C.acc:"rgba(255,255,255,0.07)",
              borderRadius:"5px 5px 0 0", border:`0.5px solid ${isLast?"rgba(217,95,69,0.4)":C.ln}`,
              transition:"height 0.4s cubic-bezier(0.4,0,0.2,1)" }} />
            <p style={{ margin:0, fontSize:10, color:isLast?C.acc:C.t3, fontWeight:isLast?600:400 }}>{m.month}</p>
          </div>;
        })}
      </div>
    </Card>

    {/* Revenue by client — editable names + rates */}
    <Card>
      <SectionLabel>Revenue by client — click to edit</SectionLabel>
      {clientRevenue.map((cl,i)=>(
        <div key={cl.id} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
          <Av label={cl.name.split(" ").map(w=>w[0]).join("").slice(0,2)} idx={i} size={28} />
          <p style={{ flex:1, margin:0, fontSize:13, color:C.t }}>
            <EditableText value={cl.name} onChange={v=>setClientRevenue(r=>r.map(x=>x.id===cl.id?{...x,name:v}:x))} style={{ fontSize:13, color:C.t }} />
          </p>
          <div style={{ width:90 }}><Bar v={Math.round((cl.rate/1800)*100)} color={C.acc} /></div>
          <p style={{ margin:0, fontSize:12, color:C.t3, minWidth:64, textAlign:"right" }}>
            $<EditableText value={cl.rate} onChange={v=>setClientRevenue(r=>r.map(x=>x.id===cl.id?{...x,rate:Number(v)}:x))} numericOnly style={{ fontSize:12, color:C.t3 }} />/mo
          </p>
        </div>
      ))}
    </Card>
  </div>;
}

// ─── EXPENSES ─────────────────────────────────────────────────────────────────
function ExpensesPage() {
  const [purchases,setPurchases] = useState(INIT_PURCHASES);
  const [balance,setBalance] = useState(4320);
  const [showAdd,setShowAdd] = useState(false);
  const [form,setForm] = useState({ name:"", cat:"Software", amount:"", date:"" });

  const [expCards, setExpCards] = useState([
    { id:1, label:"Current Balance", value:4320, prefix:"$", sub:"Available", color:"green", numeric:true },
    { id:2, label:"Total Expenses", value:INIT_PURCHASES.reduce((a,p)=>a+p.amount,0).toFixed(2), prefix:"$", color:"default", numeric:false },
    { id:3, label:"Recurring / mo", value:INIT_PURCHASES.filter(p=>p.recurring).reduce((a,p)=>a+p.amount,0).toFixed(2), prefix:"$", color:"yellow", numeric:false },
  ]);

  const catColors = { Software:"blue", Music:"purple", Hardware:"yellow", Other:"dim" };

  const add = () => {
    if(!form.name||!form.amount) return;
    const amt = parseFloat(form.amount);
    setPurchases(prev=>[{ id:Date.now(),...form,amount:amt,recurring:false },...prev]);
    setBalance(b=>parseFloat((b-amt).toFixed(2)));
    setForm({ name:"", cat:"Software", amount:"", date:"" });
    setShowAdd(false);
  };

  return <div>
    <h2 style={{ margin:"0 0 1.25rem", fontSize:22, fontWeight:700, color:C.t, letterSpacing:"-0.03em" }}>Expenses & Balance</h2>
    <StatGrid cards={expCards}
      onUpdateCard={u=>setExpCards(c=>c.map(x=>x.id===u.id?u:x))}
      onDeleteCard={id=>setExpCards(c=>c.filter(x=>x.id!==id))}
      onAddCard={card=>setExpCards(c=>[...c,card])} />

    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.875rem" }}>
      <SectionLabel>All purchases</SectionLabel>
      <AppleBtn variant="primary" onClick={()=>setShowAdd(s=>!s)}><i className="ti ti-plus" style={{ fontSize:13 }} />Add expense</AppleBtn>
    </div>

    {showAdd&&(
      <Card style={{ marginBottom:"1rem" }}>
        <SectionLabel>New expense</SectionLabel>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:8 }}>
          <FI placeholder="Name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} />
          <FI placeholder="Amount ($)" type="number" value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))} />
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:"1rem" }}>
          <FS value={form.cat} onChange={e=>setForm(f=>({...f,cat:e.target.value}))}><option>Software</option><option>Music</option><option>Hardware</option><option>Other</option></FS>
          <FI placeholder="Date e.g. May 9" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} />
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <AppleBtn variant="primary" onClick={add}>Save</AppleBtn>
          <AppleBtn variant="ghost" onClick={()=>setShowAdd(false)}>Cancel</AppleBtn>
        </div>
      </Card>
    )}

    <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
      {purchases.map(p=>(
        <Card key={p.id} style={{ padding:"0.875rem 1.1rem", display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:36, height:36, borderRadius:C.r, background:C.s3,
            display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <i className={`ti ${p.cat==="Software"?"ti-device-laptop":p.cat==="Music"?"ti-music":p.cat==="Hardware"?"ti-cpu":"ti-tag"}`}
              style={{ fontSize:15, color:C.t3 }} />
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <p style={{ margin:"0 0 4px", fontSize:13, fontWeight:500, color:C.t }}>
              <EditableText value={p.name} onChange={v=>setPurchases(prev=>prev.map(x=>x.id===p.id?{...x,name:v}:x))} style={{ fontSize:13, fontWeight:500, color:C.t }} />
            </p>
            <div style={{ display:"flex", gap:6 }}>
              <Badge color={catColors[p.cat]||"dim"}>{p.cat}</Badge>
              {p.recurring&&<Badge color="yellow">Recurring</Badge>}
            </div>
          </div>
          <div style={{ textAlign:"right", flexShrink:0, display:"flex", alignItems:"center", gap:12 }}>
            <div>
              <p style={{ margin:0, fontWeight:700, fontSize:14, color:C.re, letterSpacing:"-0.02em" }}>
                −$<EditableText value={p.amount} onChange={v=>setPurchases(prev=>prev.map(x=>x.id===p.id?{...x,amount:Number(v)}:x))} numericOnly style={{ fontSize:14, fontWeight:700, color:C.re }} />
              </p>
              <p style={{ margin:0, fontSize:10, color:C.t3 }}>{p.date}</p>
            </div>
            <button onClick={()=>setPurchases(prev=>prev.filter(x=>x.id!==p.id))}
              style={{ background:"none", border:"none", color:C.t3, cursor:"pointer", fontSize:14,
                opacity:0.4, transition:"opacity 0.15s" }}
              onMouseEnter={e=>e.currentTarget.style.opacity=1}
              onMouseLeave={e=>e.currentTarget.style.opacity=0.4}>
              <i className="ti ti-trash" />
            </button>
          </div>
        </Card>
      ))}
    </div>
  </div>;
}

// ─── CALENDAR ─────────────────────────────────────────────────────────────────
function CalendarPage({ projects }) {
  const [notes,setNotes] = useState({});
  const [editing,setEditing] = useState(null);
  const [draft,setDraft] = useState("");

  const dim = daysInCurMonth();
  const fd = firstDayOfMonth();
  const td = todayNum();
  const monthLabel = nowMonthYear();

  const byDay={};
  projects.forEach(p=>{ const d=parseInt(p.due.split(" ")[1]); if(!isNaN(d)){ if(!byDay[d]) byDay[d]=[]; byDay[d].push(p); } });

  const statusColor = { "In Progress":C.bl,"Review":C.ye,"Completed":C.gr,"On Hold":C.re };
  const cells = [...Array(fd).fill(null),...Array(dim).fill(0).map((_,i)=>i+1)];

  const saveNote = ()=>{ if(draft.trim()){ setNotes(n=>({...n,[editing]:[...(n[editing]||[]),draft.trim()]})); } setEditing(null); setDraft(""); };
  const removeNote = (d,i)=>setNotes(n=>({...n,[d]:n[d].filter((_,j)=>j!==i)}));

  return <div>
    <h2 style={{ margin:"0 0 0.5rem", fontSize:22, fontWeight:700, color:C.t, letterSpacing:"-0.03em" }}>Calendar — {monthLabel}</h2>
    <p style={{ margin:"0 0 1.25rem", fontSize:12, color:C.t3 }}>Click any day to add a reminder</p>

    <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3, marginBottom:3 }}>
      {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d=>(
        <p key={d} style={{ margin:0, fontSize:10, color:C.t3, textAlign:"center", textTransform:"uppercase", letterSpacing:"0.07em", padding:"4px 0" }}>{d}</p>
      ))}
    </div>
    <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3 }}>
      {cells.map((d,i)=>{
        if(d===null) return <div key={i} />;
        const events=byDay[d]||[];
        const dayNotes=notes[d]||[];
        const isToday=d===td;
        const hasContent=events.length>0||dayNotes.length>0;
        return <div key={i} onClick={()=>{ setEditing(d); setDraft(""); }}
          style={{ background:isToday?C.accS:C.s2, border:`0.5px solid ${isToday?"rgba(217,95,69,0.4)":hasContent?C.ln2:C.ln}`,
            borderRadius:C.r, minHeight:72, padding:"6px 8px", cursor:"pointer",
            transition:"all 0.15s" }}
          onMouseEnter={e=>{ e.currentTarget.style.background=isToday?C.accS2:C.s3; }}
          onMouseLeave={e=>{ e.currentTarget.style.background=isToday?C.accS:C.s2; }}>
          <p style={{ margin:"0 0 4px", fontSize:11, fontWeight:isToday?700:400, color:isToday?C.acc:C.t2 }}>{d}</p>
          {events.slice(0,1).map((ev,j)=>(
            <div key={j} style={{ background:statusColor[ev.status], borderRadius:4, padding:"2px 5px", marginBottom:2 }}>
              <p style={{ margin:0, fontSize:9, color:"#000", fontWeight:700, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{ev.client.split(" ")[0]}</p>
            </div>
          ))}
          {dayNotes.map((nt,j)=>(
            <div key={j} style={{ background:"rgba(255,255,255,0.06)", borderRadius:4, padding:"2px 5px", marginBottom:2, display:"flex", alignItems:"center", gap:3 }}>
              <p style={{ margin:0, fontSize:9, color:C.t2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", flex:1 }}>{nt}</p>
              <span onClick={ev=>{ ev.stopPropagation(); removeNote(d,j); }} style={{ fontSize:10, color:C.t3, cursor:"pointer" }}>×</span>
            </div>
          ))}
        </div>;
      })}
    </div>
    <div style={{ marginTop:"1rem", display:"flex", gap:12, flexWrap:"wrap" }}>
      {Object.entries(statusColor).map(([s,col])=>(
        <div key={s} style={{ display:"flex", alignItems:"center", gap:5 }}>
          <div style={{ width:7, height:7, borderRadius:2, background:col }} />
          <p style={{ margin:0, fontSize:10, color:C.t3 }}>{s}</p>
        </div>
      ))}
    </div>

    {editing!==null&&(
      <Overlay onClose={()=>setEditing(null)}>
        <p style={{ margin:"0 0 3px", fontSize:11, color:C.t3, textTransform:"uppercase", letterSpacing:"0.08em" }}>{monthLabel.split(" ")[0]} {editing}</p>
        <p style={{ margin:"0 0 1.25rem", fontSize:17, fontWeight:600, color:C.t }}>Add a reminder</p>
        <FI value={draft} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>e.key==="Enter"&&saveNote()}
          placeholder="e.g. Marcus video, client call…" style={{ marginBottom:10 }} autoFocus />
        {(notes[editing]||[]).length>0&&(
          <div style={{ marginBottom:10 }}>
            {notes[editing].map((nt,i)=>(
              <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"6px 0", borderBottom:`0.5px solid ${C.ln}` }}>
                <p style={{ margin:0, fontSize:12, color:C.t2 }}>{nt}</p>
                <button onClick={()=>removeNote(editing,i)} style={{ background:"none", border:"none", color:C.t3, cursor:"pointer", fontSize:15 }}>×</button>
              </div>
            ))}
          </div>
        )}
        <div style={{ display:"flex", gap:8 }}>
          <AppleBtn variant="primary" onClick={saveNote} style={{ flex:1, justifyContent:"center" }}>Save</AppleBtn>
          <AppleBtn variant="ghost" onClick={()=>setEditing(null)}>Cancel</AppleBtn>
        </div>
      </Overlay>
    )}
  </div>;
}

// ─── TEMPLATES ────────────────────────────────────────────────────────────────
function TemplatesPage({ clients }) {
  const [selected,setSelected] = useState(0);
  const [clientId,setClientId] = useState(clients[0]?.id||1);
  const [customTexts,setCustomTexts] = useState({});
  const [copied,setCopied] = useState(false);

  const client = clients.find(c=>c.id===clientId)||clients[0];
  const tmpl = TEMPLATES[selected];
  const key = `${selected}-${clientId}`;
  const autoFilled = tmpl.body
    .replace(/{name}/g,client?.name||"")
    .replace(/{inv}/g,`INV-${String(clientId).padStart(3,"0")}001`)
    .replace(/{amount}/g,client?.rate||"0")
    .replace(/{date}/g,new Date(Date.now()+14*86400000).toLocaleDateString("en-US",{month:"short",day:"numeric"}));

  const displayText = customTexts[key]!==undefined?customTexts[key]:autoFilled;
  const isCustomized = customTexts[key]!==undefined;

  const copy = ()=>{ navigator.clipboard?.writeText(displayText); setCopied(true); setTimeout(()=>setCopied(false),2000); };

  return <div>
    <h2 style={{ margin:"0 0 1.25rem", fontSize:22, fontWeight:700, color:C.t, letterSpacing:"-0.03em" }}>Message Templates</h2>
    <div style={{ display:"flex", gap:14 }}>
      <div style={{ width:186, flexShrink:0, display:"flex", flexDirection:"column", gap:6 }}>
        {TEMPLATES.map((t,i)=>(
          <button key={i} onClick={()=>setSelected(i)}
            style={{ background:selected===i?C.accS:"rgba(255,255,255,0.02)",
              border:`0.5px solid ${selected===i?"rgba(217,95,69,0.3)":C.ln}`,
              borderRadius:C.r, padding:"11px 13px", cursor:"pointer", textAlign:"left",
              color:selected===i?C.acc:C.t2, fontSize:12, fontWeight:selected===i?600:400,
              transition:"all 0.15s", fontFamily:C.ff }}>{t.label}
          </button>
        ))}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <Card>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem", flexWrap:"wrap", gap:8 }}>
            <p style={{ margin:0, fontSize:14, fontWeight:600, color:C.t, letterSpacing:"-0.01em" }}>{tmpl.label}</p>
            <div style={{ display:"flex", gap:8, alignItems:"center" }}>
              <span style={{ fontSize:11, color:C.t3 }}>Client:</span>
              <FS value={clientId} onChange={e=>setClientId(Number(e.target.value))} style={{ width:"auto", padding:"5px 10px" }}>
                {clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
              </FS>
            </div>
          </div>
          <div style={{ position:"relative", marginBottom:"0.875rem" }}>
            <textarea value={displayText} onChange={e=>setCustomTexts(t=>({...t,[key]:e.target.value}))} rows={6}
              style={{ width:"100%", boxSizing:"border-box", background:C.s3,
                border:`0.5px solid ${isCustomized?"rgba(217,95,69,0.3)":C.ln2}`,
                borderRadius:C.r, color:C.t, fontSize:13, lineHeight:1.7,
                padding:"13px", resize:"vertical", outline:"none", fontFamily:C.ff,
                transition:"border-color 0.2s" }} />
            {isCustomized&&<span style={{ position:"absolute", top:10, right:10, fontSize:9,
              color:C.acc, textTransform:"uppercase", letterSpacing:"0.07em", fontWeight:600 }}>edited</span>}
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <AppleBtn variant="primary" onClick={copy}>
              <i className={`ti ${copied?"ti-check":"ti-copy"}`} style={{ fontSize:13 }} />
              {copied?"Copied!":"Copy message"}
            </AppleBtn>
            {isCustomized&&<AppleBtn variant="ghost" onClick={()=>setCustomTexts(t=>{ const n={...t}; delete n[key]; return n; })}>
              <i className="ti ti-refresh" style={{ fontSize:13 }} />Reset
            </AppleBtn>}
          </div>
          <p style={{ margin:"10px 0 0", fontSize:11, color:C.t3 }}>Click the message to edit · auto-fills client name, invoice & date</p>
        </Card>
      </div>
    </div>
  </div>;
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [page,setPage] = useState("home");
  const [clients,setClients] = useState(INIT_CLIENTS);
  const [projects,setProjects] = useState(INIT_PROJECTS);
  const [allMsgs,setAllMsgs] = useState(INIT_MSGS);
  const [msgClient,setMsgClient] = useState(null);
  const [invoiceClient,setInvoiceClient] = useState(null);

  const [brandName,setBrandName] = useState("EditDesk Pro");
  const [editingBrand,setEditingBrand] = useState(false);
  const [brandDraft,setBrandDraft] = useState("EditDesk Pro");
  const brandRef = useRef();
  const [logoSrc,setLogoSrc] = useState(null);
  const logoInputRef = useRef();

  const handleLogoUpload = e => {
    const file = e.target.files?.[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = ev => setLogoSrc(ev.target.result);
    reader.readAsDataURL(file);
  };

  const startEditBrand = ()=>{ setBrandDraft(brandName); setEditingBrand(true); setTimeout(()=>brandRef.current?.select(),20); };
  const saveBrand = ()=>{ if(brandDraft.trim()) setBrandName(brandDraft.trim()); setEditingBrand(false); };
  const sendMsg = (id,text)=>setAllMsgs(m=>({...m,[id]:[...(m[id]||[]),{from:"me",text,time:"Now"}]}));

  return (
    <div style={{ minHeight:"100vh", background:C.page }}>
      <style>{`
        *{box-sizing:border-box;}
        html,body,#root{background:${C.page};margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:4px;}
        input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;}
      `}</style>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      <div style={{ maxWidth:820, margin:"0 auto", padding:"1.75rem 1.25rem", fontFamily:C.ff, color:C.t }}>

        {/* HEADER */}
        <div style={{ display:"flex", alignItems:"center", gap:13, marginBottom:"1.75rem" }}>
          <div onClick={()=>logoInputRef.current?.click()} title="Click to upload logo"
            style={{ width:38, height:38, borderRadius:C.r, background:logoSrc?"transparent":C.acc,
              overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center",
              flexShrink:0, cursor:"pointer", border:`0.5px solid ${logoSrc?C.ln:C.acc}`,
              boxShadow:logoSrc?"none":"0 4px 12px rgba(217,95,69,0.25)", transition:"all 0.2s" }}>
            {logoSrc
              ? <img src={logoSrc} alt="logo" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
              : <i className="ti ti-video" style={{ fontSize:17, color:"#fff" }} />}
          </div>
          <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoUpload} style={{ display:"none" }} />

          <div>
            {editingBrand
              ? <input ref={brandRef} value={brandDraft} onChange={e=>setBrandDraft(e.target.value)}
                  onBlur={saveBrand} onKeyDown={e=>{ if(e.key==="Enter") saveBrand(); if(e.key==="Escape") setEditingBrand(false); }}
                  style={{ background:"transparent", border:"none", borderBottom:`1px solid ${C.acc}`,
                    color:C.t, fontSize:16, fontWeight:700, outline:"none", fontFamily:C.ff,
                    letterSpacing:"-0.02em", padding:"0 0 1px", width:220 }} />
              : <p onClick={startEditBrand} title="Click to rename"
                  style={{ margin:0, fontSize:16, fontWeight:700, color:C.t, letterSpacing:"-0.025em",
                    cursor:"text", borderBottom:"1px dashed transparent", transition:"border-color 0.15s", display:"inline-block" }}
                  onMouseEnter={e=>e.currentTarget.style.borderBottomColor=C.t3}
                  onMouseLeave={e=>e.currentTarget.style.borderBottomColor="transparent"}>
                  {brandName}
                </p>}
            <p style={{ margin:0, fontSize:11, color:C.t3, letterSpacing:"0.01em" }}>Video editor business hub</p>
          </div>
        </div>

        <Nav page={page} setPage={setPage} />

        {page==="home"      && <HomePage clients={clients} projects={projects} setPage={setPage} />}
        {page==="clients"   && <ClientsPage clients={clients} setClients={setClients} onMsg={setMsgClient} onInvoice={setInvoiceClient} />}
        {page==="projects"  && <ProjectsPage projects={projects} setProjects={setProjects} />}
        {page==="finance"   && <FinancePage clients={clients} />}
        {page==="expenses"  && <ExpensesPage />}
        {page==="calendar"  && <CalendarPage projects={projects} />}
        {page==="templates" && <TemplatesPage clients={clients} />}

        {msgClient&&<MsgModal client={msgClient} msgs={allMsgs[msgClient.id]||[]} onClose={()=>setMsgClient(null)} onSend={sendMsg} />}
        {invoiceClient&&<InvoiceModal client={invoiceClient} project={projects.find(p=>p.client===invoiceClient.name)?.title} onClose={()=>setInvoiceClient(null)} />}
      </div>
    </div>
  );
}
