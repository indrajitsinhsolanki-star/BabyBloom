import { useState, useRef } from "react";

// ─── DATA ──────────────────────────────────────────────────────────────────
const WEEKS_DATA = {
  4:  { size: "Poppy seed",  length: "0.1 cm", weight: "<1g",   dev: "Neural tube forming, tiny heart beginning to beat, cells rapidly dividing into baby's basic structure." },
  5:  { size: "Sesame seed", length: "0.2 cm", weight: "<1g",   dev: "Heart starts beating. Brain, spinal cord, and other organs beginning to form." },
  6:  { size: "Lentil",      length: "0.6 cm", weight: "<1g",   dev: "Facial features forming. Tiny arm and leg buds appear. Heart beats 110 times per minute." },
  7:  { size: "Blueberry",   length: "1.3 cm", weight: "1g",    dev: "Brain growing rapidly. Eyelid folds forming. Tongue begins to develop." },
  8:  { size: "Raspberry",   length: "1.6 cm", weight: "1g",    dev: "Fingers and toes forming. Baby can move, though you can't feel it yet." },
  9:  { size: "Cherry",      length: "2.3 cm", weight: "2g",    dev: "Teeth forming beneath gums. Organs are present and growing. Tail has disappeared." },
  10: { size: "Strawberry",  length: "3.1 cm", weight: "4g",    dev: "Vital organs functioning. Baby can swallow. Fingernails beginning to form." },
  11: { size: "Fig",         length: "4.1 cm", weight: "7g",    dev: "Baby is moving arms and legs. Hiccups possible. Genitals developing." },
  12: { size: "Lime",        length: "5.4 cm", weight: "14g",   dev: "Reflexes developing. Baby can open and close fingers. End of first trimester!" },
  13: { size: "Pea pod",     length: "7.4 cm", weight: "23g",   dev: "Fingerprints forming. Vocal cords developing. Intestines moving to abdomen." },
  14: { size: "Lemon",       length: "8.7 cm", weight: "43g",   dev: "Baby can squint, frown, grimace. Thumb sucking may begin. Hair follicles forming." },
  16: { size: "Avocado",     length: "11.6 cm",weight: "100g",  dev: "Tiny bones hardening. Facial muscles working. Baby may hear sounds." },
  20: { size: "Banana",      length: "16.5 cm",weight: "300g",  dev: "Baby swallowing amniotic fluid. Taste buds forming. Halfway there!" },
  24: { size: "Corn",        length: "30 cm",  weight: "600g",  dev: "Viable outside womb with support. Lungs developing. Face fully formed." },
  28: { size: "Eggplant",    length: "38 cm",  weight: "1kg",   dev: "Third trimester! Brain growing rapidly. Can blink and see light." },
  32: { size: "Squash",      length: "43 cm",  weight: "1.8kg", dev: "Lungs nearly ready. Baby storing fat. Sleeping in cycles." },
  36: { size: "Honeydew",    length: "47 cm",  weight: "2.6kg", dev: "Early term. Most organs ready. Baby getting into birth position." },
  40: { size: "Watermelon",  length: "51 cm",  weight: "3.4kg", dev: "Full term! Baby ready to meet you. All systems go!" },
};

const SYMPTOMS = ["Nausea", "Fatigue", "Heartburn", "Back pain", "Headache", "Swelling", "Mood swings", "Cravings", "Insomnia", "Breast tenderness"];
const MOODS    = ["😊 Happy","😴 Tired","😰 Anxious","🥰 Excited","😢 Emotional","😤 Irritable","😌 Peaceful","🤢 Nauseous"];

// Real Sensor Tower / verified data (flagged as estimates where needed)
const MARKET_DATA = [
  { rank:1,  app:"Flo Health",            dl:"~2M/mo*",  rev:"~$10M/mo*", model:"Freemium sub",    price:"$79.99/yr", note:"Sensor Tower estimate, iOS US only" },
  { rank:2,  app:"BabyCenter",            dl:"~80K/mo*", rev:"Ads (free)",  model:"Ads + Affiliate",price:"Free",      note:"Sensor Tower: 80K downloads/mo iOS US" },
  { rank:3,  app:"What to Expect",        dl:"~28.6K/wk*",rev:"Not reported",model:"Ads",           price:"Free",      note:"Sensor Tower Q3 2024, US peak" },
  { rank:4,  app:"Ovia Health",           dl:"~10M total",rev:"B2B only",   model:"Employer plans", price:"$0 to user",note:"400+ health-plan networks (Mordor)" },
  { rank:5,  app:"Pregnancy+ (Philips)",  dl:"~20M total",rev:"IAP",        model:"Freemium",       price:"$19.99/yr", note:"Market reports estimate; exact not public" },
  { rank:6,  app:"The Bump",              dl:"~10M total",rev:"Ads+Shop",   model:"Affiliate+Ads",  price:"Free",      note:"Market reports estimate" },
  { rank:7,  app:"Sprout Pregnancy",      dl:"~5M total", rev:"Paid DL",    model:"One-time buy",   price:"$4.99",     note:"Market reports estimate" },
  { rank:8,  app:"Glow / Nurture",        dl:"~10M total",rev:"Sub",        model:"Freemium sub",   price:"$49.99/yr", note:"Market reports estimate" },
  { rank:9,  app:"Expectful",             dl:"~1M total", rev:"Sub",        model:"Premium only",   price:"$149.99/yr",note:"No free tier; market reports estimate" },
  { rank:10, app:"Hello Belly",           dl:"~1M total", rev:"IAP",        model:"Freemium+IAP",   price:"$9.99/yr",  note:"Market reports estimate" },
];

const STEPS = [
  {
    step:"1", emoji:"🎨", title:"Build the App (You Did This!)",
    color:"#ff6b9d",
    sub:"You already have a working app — BabyBloom. This is the hardest step. Most people never even start. You did. 🎉",
    actions:["Share this app link with 10 friends or family members","Ask them: 'Would you use this? What would make it better?'","Write down every piece of feedback you get"]
  },
  {
    step:"2", emoji:"📲", title:"Put It on the App Store",
    color:"#c2185b",
    sub:"To earn real money, the app must be downloadable by anyone in the world.",
    actions:["Apple App Store: Pay $99/year for an Apple Developer account","Google Play Store: Pay $25 ONE TIME for a developer account","Use React Native or Flutter to convert this web app to mobile (or hire a developer on Fiverr for ~$500–$1000)","Submit the app — takes 1–3 days for approval"]
  },
  {
    step:"3", emoji:"🆓", title:"Launch Free First (Get 1,000 Users)",
    color:"#e91e8c",
    sub:"Never charge money until people love your app. First goal: 1,000 real users.",
    actions:["Post in pregnancy Facebook groups & Reddit (r/pregnant, r/BabyBumps)","Create a simple Instagram or TikTok showing the app","Ask happy users to leave a 5-star review — reviews = more downloads","Do NOT spend money on ads yet. Grow organically first."]
  },
  {
    step:"4", emoji:"💰", title:"Turn on Money (After 1,000 Users)",
    color:"#ad1457",
    sub:"Now you have proof people want it. Add money-making features one by one.",
    actions:[
      "💎 PREMIUM: Charge $3.99/month or $29.99/year for: AI chat, no ads, contraction history export",
      "📦 AFFILIATE: Add a 'Baby Registry' button → link to Amazon. You earn 4–8% of every purchase",
      "📣 ADS (optional): Use Google AdMob. You earn ~$1–5 per 1,000 ad views. Turn off for premium users",
      "🛍️ SPONSORED POSTS: Baby brands (diapers, formula) pay $500–$5,000 to show their product in your app"
    ]
  },
  {
    step:"5", emoji:"📈", title:"Scale to $10,000/month",
    color:"#880e4f",
    sub:"This is where it gets exciting. Here's a simple math example:",
    actions:[
      "10,000 users × 5% pay $29.99/yr = $14,995/yr from subscriptions alone",
      "10,000 users clicking Amazon registry = ~$2,000–5,000/yr in affiliate fees",
      "2 sponsored posts/month from a baby brand = $1,000–2,000/mo",
      "Total possible at 10K users: $3,000–6,000/month 🔥"
    ]
  },
  {
    step:"6", emoji:"🚀", title:"Grow to $1M+ (The Big Dream)",
    color:"#6a1b4d",
    sub:"This is what billion-dollar apps do. You can start this in a few years.",
    actions:[
      "Partner with hospitals or OB clinics — they recommend your app to patients",
      "Sell to employers (companies pay for pregnant employees to use your app)",
      "Add postpartum (after-birth) tracking — keeps users 1+ year instead of 9 months",
      "Expand to India, UAE, Southeast Asia — less competition, huge market"
    ]
  },
];

// ─── HELPERS ───────────────────────────────────────────────────────────────
function getWeekData(week) {
  const keys = Object.keys(WEEKS_DATA).map(Number).sort((a,b)=>a-b);
  let best = keys[0];
  for (const k of keys) { if (k <= week) best = k; }
  return WEEKS_DATA[best];
}
function calcWeek(dueDate) {
  if (!dueDate) return null;
  const due = new Date(dueDate);
  const start = new Date(due); start.setDate(due.getDate()-280);
  const diff = Math.floor((new Date()-start)/(1000*60*60*24*7));
  return Math.max(1,Math.min(42,diff));
}
function calcDaysLeft(dueDate) {
  if (!dueDate) return null;
  return Math.max(0,Math.ceil((new Date(dueDate)-new Date())/(1000*60*60*24)));
}

const TABS = [
  {icon:"🏠",label:"Home"},
  {icon:"👶",label:"Baby"},
  {icon:"📊",label:"Health"},
  {icon:"📅",label:"Appts"},
  {icon:"📖",label:"Journal"},
  {icon:"📊",label:"Market"},
  {icon:"💰",label:"Earn"},
];

// ─── MAIN APP ──────────────────────────────────────────────────────────────
export default function PregnancyTracker() {
  const [screen,  setScreen]  = useState("onboard");
  const [tab,     setTab]     = useState(0);
  const [profile, setProfile] = useState({name:"",dueDate:"",partnerName:""});
  const [draft,   setDraft]   = useState({name:"",dueDate:"",partnerName:""});

  // health
  const [weight,      setWeight]      = useState([]);
  const [newWeight,   setNewWeight]   = useState("");
  const [kicks,       setKicks]       = useState(0);
  const [kickSessions,setKickSessions]= useState([]);
  const [symptoms,    setSymptoms]    = useState([]);
  const [mood,        setMood]        = useState("");
  const [waterGlasses,setWaterGlasses]= useState(0);

  // contraction
  const [contractionStart,setContractionStart]= useState(null);
  const [contractions,    setContractions]    = useState([]);

  // appointments
  const [appointments,setAppointments]= useState([]);
  const [apptDraft,   setApptDraft]   = useState({title:"",date:"",note:""});
  const [showApptForm,setShowApptForm]= useState(false);

  // journal
  const [journalEntries,setJournalEntries]= useState([]);
  const [journalDraft,  setJournalDraft]  = useState("");

  // AI
  const [aiChat,   setAiChat]   = useState([]);
  const [aiInput,  setAiInput]  = useState("");
  const [aiLoading,setAiLoading]= useState(false);
  const aiRef = useRef(null);

  const week      = calcWeek(profile.dueDate);
  const daysLeft  = calcDaysLeft(profile.dueDate);
  const wd        = week ? getWeekData(week) : null;
  const trimester = week ? (week<=13?1:week<=26?2:3) : null;
  const progress  = week ? Math.min(100,Math.round((week/40)*100)) : 0;

  const sendAI = async () => {
    if (!aiInput.trim() || aiLoading) return;
    const userMsg = aiInput.trim(); setAiInput("");
    setAiChat(c=>[...c,{role:"user",content:userMsg}]);
    setAiLoading(true);
    try {
      const sys = `You are a warm, knowledgeable pregnancy companion AI. The user is ${profile.name||"a mom-to-be"} at ${week||"?"} weeks pregnant (due ${profile.dueDate||"soon"}). Give supportive, medically-grounded but non-diagnostic answers in 2-4 sentences. Always recommend consulting their OB for medical concerns.`;
      const history = aiChat.slice(-8).map(m=>({role:m.role,content:m.content}));
      const res = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:sys,messages:[...history,{role:"user",content:userMsg}]})
      });
      const data = await res.json();
      setAiChat(c=>[...c,{role:"assistant",content:data.content?.[0]?.text||"Please try again 💕"}]);
    } catch { setAiChat(c=>[...c,{role:"assistant",content:"Connection issue — please try again! 💕"}]); }
    setAiLoading(false);
    setTimeout(()=>aiRef.current?.scrollIntoView({behavior:"smooth"}),100);
  };

  if (screen==="onboard") return (
    <div style={S.onboard}>
      <div style={S.onboardCard}>
        <div style={S.onboardEmoji}>🌸</div>
        <h1 style={S.onboardTitle}>BabyBloom</h1>
        <p style={S.onboardSub}>Your AI pregnancy companion — week by week, heartbeat by heartbeat.</p>
        <div style={S.fg}><label style={S.label}>Your Name</label>
          <input style={S.input} placeholder="e.g. Priya" value={draft.name} onChange={e=>setDraft(d=>({...d,name:e.target.value}))}/></div>
        <div style={S.fg}><label style={S.label}>Due Date</label>
          <input style={S.input} type="date" value={draft.dueDate} onChange={e=>setDraft(d=>({...d,dueDate:e.target.value}))}/></div>
        <div style={S.fg}><label style={S.label}>Partner's Name (optional)</label>
          <input style={S.input} placeholder="e.g. Rahul" value={draft.partnerName} onChange={e=>setDraft(d=>({...d,partnerName:e.target.value}))}/></div>
        <button style={S.primaryBtn} onClick={()=>{if(draft.dueDate){setProfile(draft);setScreen("app");}}}>
          Begin My Journey ✨
        </button>
      </div>
    </div>
  );

  return (
    <div style={S.app}>
      {/* Header */}
      <div style={S.header}>
        <div><div style={S.headerTitle}>🌸 BabyBloom</div>
          <div style={S.headerSub}>{profile.name?`Hi, ${profile.name}!`:"Welcome"}</div></div>
        {week && <div style={S.weekBadge}>Week {week}</div>}
      </div>

      {/* Tabs */}
      <div style={S.tabBar}>
        {TABS.map((t,i)=>(
          <button key={i} style={{...S.tabBtn,...(tab===i?S.tabActive:{})}} onClick={()=>setTab(i)}>
            <span style={{fontSize:16}}>{t.icon}</span>
            <span style={S.tabLabel}>{t.label}</span>
          </button>
        ))}
      </div>

      <div style={S.content}>

        {/* ── HOME ── */}
        {tab===0 && <div>
          {/* Progress */}
          <div style={S.card}>
            <div style={S.cardTitle}>Pregnancy Progress</div>
            {week && <>
              <div style={S.row}><span style={S.muted}>Week {week} of 40</span><span style={S.muted}>{daysLeft} days left 💕</span></div>
              <div style={S.pBar}><div style={{...S.pFill,width:`${progress}%`}}/></div>
              <div style={S.tRow}>{[1,2,3].map(t=>(
                <div key={t} style={{...S.tChip,...(trimester===t?S.tActive:{})}}>T{t}{trimester===t&&" ✓"}</div>
              ))}</div>
            </>}
          </div>

          {/* Baby size */}
          {wd && <div style={S.babyCard}>
            <div style={{fontSize:44}}>🍼</div>
            <div>
              <div style={S.muted}>Baby is the size of a</div>
              <div style={{fontSize:22,fontWeight:700,color:"#c2185b"}}>{wd.size}</div>
              <div style={S.muted}>{wd.length} · {wd.weight}</div>
            </div>
          </div>}

          {/* Quick stats */}
          <div style={S.sGrid}>
            <div style={S.sCard}><div style={S.sNum}>{kicks}</div><div style={S.sLabel}>Kicks Today</div>
              <button style={S.tinyBtn} onClick={()=>setKicks(k=>k+1)}>+ Kick</button></div>
            <div style={S.sCard}><div style={S.sNum}>{waterGlasses}</div><div style={S.sLabel}>Water (glasses)</div>
              <button style={S.tinyBtn} onClick={()=>setWaterGlasses(w=>Math.min(12,w+1))}>+ Glass</button></div>
            <div style={S.sCard}><div style={S.sNum}>{symptoms.length}</div><div style={S.sLabel}>Symptoms</div>
              <button style={S.tinyBtn} onClick={()=>setTab(2)}>Log</button></div>
          </div>

          {/* AI Chat */}
          <div style={S.card}>
            <div style={S.cardTitle}>🤖 Ask BabyBloom AI</div>
            <div style={S.chatBox}>
              {aiChat.length===0 && <div style={{color:"#ccc",textAlign:"center",paddingTop:20,fontSize:13}}>Ask me anything about your pregnancy! I'm here 24/7 💕</div>}
              {aiChat.map((m,i)=><div key={i} style={{...S.chatMsg,...(m.role==="user"?S.chatU:S.chatA)}}>{m.content}</div>)}
              {aiLoading && <div style={S.chatA}>Thinking... 🌸</div>}
              <div ref={aiRef}/>
            </div>
            <div style={S.chatRow}>
              <input style={S.chatInput} placeholder="Ask about symptoms, nutrition, development..." value={aiInput}
                onChange={e=>setAiInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendAI()}/>
              <button style={S.sendBtn} onClick={sendAI}>➤</button>
            </div>
          </div>
        </div>}

        {/* ── BABY ── */}
        {tab===1 && wd && <div>
          <div style={S.card}>
            <div style={S.cardTitle}>👶 Week {week} Development</div>
            <div style={S.devGrid}>
              {[["Size",wd.size],["Length",wd.length],["Weight",wd.weight],["Trimester",`T${trimester}`]].map(([l,v])=>(
                <div key={l} style={S.devItem}><span style={S.muted}>{l}</span><span style={{fontSize:16,fontWeight:700,color:"#c2185b"}}>{v}</span></div>
              ))}
            </div>
            <div style={{fontSize:13,color:"#555",lineHeight:1.6,marginTop:8}}>{wd.dev}</div>
          </div>

          {/* Kick counter */}
          <div style={S.card}>
            <div style={S.cardTitle}>👟 Kick Counter</div>
            <div style={{fontSize:72,fontWeight:900,textAlign:"center",color:"#c2185b",lineHeight:1}}>{kicks}</div>
            <div style={{textAlign:"center",color:"#aaa",fontSize:13,marginBottom:16}}>kicks today</div>
            <div style={S.btnRow}>
              <button style={S.primaryBtn} onClick={()=>setKicks(k=>k+1)}>Record Kick 👟</button>
              <button style={S.outlineBtn} onClick={()=>{setKickSessions(s=>[...s,{count:kicks,date:new Date().toLocaleDateString()}]);setKicks(0);}}>Save & Reset</button>
            </div>
            {kickSessions.slice(-3).map((s,i)=><div key={i} style={S.listItem}>{s.date} — {s.count} kicks</div>)}
          </div>

          {/* Contraction timer */}
          <div style={S.card}>
            <div style={S.cardTitle}>⏱️ Contraction Timer</div>
            <button style={{...S.primaryBtn,background:contractionStart?"#ff4757":"#ff6b9d"}} onClick={()=>{
              if(contractionStart){const dur=Math.round((Date.now()-contractionStart)/1000);setContractions(c=>[...c,{time:new Date().toLocaleTimeString(),duration:dur}]);setContractionStart(null);}
              else setContractionStart(Date.now());
            }}>{contractionStart?"⏹ Stop":"▶ Start"} Contraction</button>
            {contractions.slice(-5).map((c,i)=><div key={i} style={S.listItem}>{c.time} — {c.duration}s</div>)}
          </div>
        </div>}

        {/* ── HEALTH ── */}
        {tab===2 && <div>
          <div style={S.card}>
            <div style={S.cardTitle}>😊 Today's Mood</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {MOODS.map(m=><button key={m} style={{...S.moodBtn,...(mood===m?S.moodActive:{})}} onClick={()=>setMood(m)}>{m}</button>)}
            </div>
          </div>
          <div style={S.card}>
            <div style={S.cardTitle}>🩺 Symptom Tracker</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:10}}>
              {SYMPTOMS.map(s=><button key={s} style={{...S.symptomBtn,...(symptoms.includes(s)?S.symptomActive:{})}} onClick={()=>setSymptoms(p=>p.includes(s)?p.filter(x=>x!==s):[...p,s])}>{s}</button>)}
            </div>
            {symptoms.length>0 && <div style={{fontSize:12,color:"#888"}}>Active: {symptoms.join(", ")}</div>}
          </div>
          <div style={S.card}>
            <div style={S.cardTitle}>⚖️ Weight Tracker</div>
            <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:8}}>
              <input style={{...S.input,flex:1}} type="number" placeholder="Weight (kg)" value={newWeight} onChange={e=>setNewWeight(e.target.value)}/>
              <button style={{...S.primaryBtn,flex:"none",padding:"10px 18px"}} onClick={()=>{if(newWeight){setWeight(w=>[...w,{date:new Date().toLocaleDateString(),kg:parseFloat(newWeight)}]);setNewWeight("");}}}>Log</button>
            </div>
            {weight.slice(-5).map((w,i)=><div key={i} style={S.listItem}>{w.date} — {w.kg} kg</div>)}
          </div>
          <div style={S.card}>
            <div style={S.cardTitle}>💧 Hydration (8 glasses/day)</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",justifyContent:"center",marginBottom:8}}>
              {Array.from({length:8}).map((_,i)=>(
                <div key={i} style={{fontSize:28,cursor:"pointer",opacity:i<waterGlasses?1:0.2,transition:"opacity 0.2s"}} onClick={()=>setWaterGlasses(i+1)}>💧</div>
              ))}
            </div>
            <div style={{textAlign:"center",fontSize:13,color:"#888"}}>{waterGlasses}/8 glasses today</div>
          </div>
        </div>}

        {/* ── APPOINTMENTS ── */}
        {tab===3 && <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={S.cardTitle}>📅 Appointments</div>
            <button style={S.outlineBtn} onClick={()=>setShowApptForm(true)}>+ Add</button>
          </div>
          {showApptForm && <div style={S.card}>
            <div style={S.fg}><label style={S.label}>Title</label>
              <input style={S.input} placeholder="e.g. OB Check-up" value={apptDraft.title} onChange={e=>setApptDraft(a=>({...a,title:e.target.value}))}/></div>
            <div style={S.fg}><label style={S.label}>Date & Time</label>
              <input style={S.input} type="datetime-local" value={apptDraft.date} onChange={e=>setApptDraft(a=>({...a,date:e.target.value}))}/></div>
            <div style={S.fg}><label style={S.label}>Notes</label>
              <input style={S.input} placeholder="Notes..." value={apptDraft.note} onChange={e=>setApptDraft(a=>({...a,note:e.target.value}))}/></div>
            <div style={S.btnRow}>
              <button style={S.primaryBtn} onClick={()=>{if(apptDraft.title&&apptDraft.date){setAppointments(a=>[...a,{...apptDraft,id:Date.now()}]);setApptDraft({title:"",date:"",note:""});setShowApptForm(false);}}}>Save</button>
              <button style={S.outlineBtn} onClick={()=>setShowApptForm(false)}>Cancel</button>
            </div>
          </div>}
          {appointments.length===0 && <div style={S.empty}>No appointments yet. Add your first one! 📋</div>}
          {appointments.sort((a,b)=>new Date(a.date)-new Date(b.date)).map((a,i)=>(
            <div key={i} style={{...S.card,borderLeft:"4px solid #ff6b9d"}}>
              <div style={{fontWeight:700,marginBottom:4}}>{a.title}</div>
              <div style={S.muted}>{new Date(a.date).toLocaleString()}</div>
              {a.note&&<div style={{fontSize:12,color:"#aaa",marginTop:4}}>{a.note}</div>}
            </div>
          ))}
          <div style={S.card}>
            <div style={S.cardTitle}>✅ Trimester Checklist</div>
            {["First prenatal visit (8–10 weeks)","Blood tests & genetic screening","Anatomy scan (18–20 weeks)","Glucose tolerance test (24–28 weeks)","Group B strep test (35–37 weeks)","Hospital tour","Birth plan written","Pediatrician chosen"].map((item,i)=>(
              <div key={i} style={{...S.listItem,display:"flex",alignItems:"center",gap:8}}>☐ {item}</div>
            ))}
          </div>
        </div>}

        {/* ── JOURNAL ── */}
        {tab===4 && <div>
          <div style={S.card}>
            <div style={S.cardTitle}>📖 Pregnancy Journal</div>
            <textarea style={S.textarea} placeholder={`Week ${week||"?"} — How are you feeling today?`}
              value={journalDraft} onChange={e=>setJournalDraft(e.target.value)} rows={4}/>
            <button style={S.primaryBtn} onClick={()=>{if(journalDraft.trim()){setJournalEntries(j=>[{text:journalDraft,date:new Date().toLocaleDateString(),week:week||"?"},...j]);setJournalDraft("");}}}>Save Entry 💕</button>
          </div>
          {journalEntries.map((j,i)=>(
            <div key={i} style={S.card}>
              <div style={{fontSize:11,color:"#aaa",marginBottom:6,fontWeight:600}}>Week {j.week} · {j.date}</div>
              <div style={{fontSize:14,color:"#444",lineHeight:1.6}}>{j.text}</div>
            </div>
          ))}
          {journalEntries.length===0 && <div style={S.empty}>Start writing your pregnancy story! 🌸</div>}
        </div>}

        {/* ── MARKET DATA ── */}
        {tab===5 && <div>
          <div style={S.card}>
            <div style={S.cardTitle}>📊 Top 10 Apps — Real Market Data</div>
            <div style={{fontSize:11,color:"#e65100",background:"#fff3e0",borderRadius:8,padding:"8px 10px",marginBottom:12}}>
              ⚠️ <strong>Transparency note:</strong> Numbers marked * are Sensor Tower estimates. "Total" figures are from market research reports. Individual app revenues are rarely disclosed publicly — treat as directional, not exact.
            </div>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:11,minWidth:560}}>
                <thead><tr>
                  {["#","App","Downloads","Revenue","Model","Price","Data Source"].map(h=>(
                    <th key={h} style={{background:"#c2185b",color:"white",padding:"7px 8px",textAlign:"left",fontSize:10,whiteSpace:"nowrap"}}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {MARKET_DATA.map((row,i)=>(
                    <tr key={i} style={{background:i%2===0?"#fff0f5":"white"}}>
                      <td style={S.td}>{row.rank}</td>
                      <td style={{...S.td,fontWeight:700}}>{row.app}</td>
                      <td style={S.td}>{row.dl}</td>
                      <td style={S.td}>{row.rev}</td>
                      <td style={S.td}>{row.model}</td>
                      <td style={S.td}>{row.price}</td>
                      <td style={{...S.td,color:"#999",fontSize:9}}>{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div style={S.card}>
            <div style={S.cardTitle}>🌍 Market Size (Verified)</div>
            {[
              ["Global market 2024","$301M (Straits Research)"],
              ["Projected 2033","$1.38B"],
              ["Growth rate (CAGR)","18.4% per year 🔥"],
              ["Flo: iOS US revenue","~$10M/month (Sensor Tower estimate)"],
              ["BabyCenter: iOS US downloads","~80K/month (Sensor Tower)"],
              ["What to Expect: peak weekly DLs","~28.6K/week (Sensor Tower Q3 2024)"],
              ["Android share","61.5% of all users"],
              ["US market alone by 2030","$730M projected"],
            ].map(([k,v],i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #ffe0ec",fontSize:12}}>
                <span style={{color:"#555"}}>{k}</span><strong style={{color:"#c2185b"}}>{v}</strong>
              </div>
            ))}
          </div>
        </div>}

        {/* ── HOW TO EARN (GRADE 9 GUIDE) ── */}
        {tab===6 && <div>
          <div style={{...S.card,background:"linear-gradient(135deg,#c2185b,#ff6b9d)",color:"white",marginBottom:16}}>
            <div style={{fontSize:20,fontWeight:800,marginBottom:6}}>💰 How to Make Money — Simple Guide</div>
            <div style={{fontSize:13,opacity:0.9,lineHeight:1.5}}>Written for beginners. No confusing words. Just real steps that actually work.</div>
          </div>

          {STEPS.map((s,i)=>(
            <div key={i} style={{...S.card,borderLeft:`5px solid ${s.color}`,marginBottom:14}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                <div style={{fontSize:28}}>{s.emoji}</div>
                <div>
                  <div style={{fontSize:11,fontWeight:700,color:s.color,letterSpacing:1}}>STEP {s.step}</div>
                  <div style={{fontSize:15,fontWeight:800,color:"#333"}}>{s.title}</div>
                </div>
              </div>
              <div style={{fontSize:13,color:"#555",lineHeight:1.6,marginBottom:10,background:"#fef6f9",borderRadius:8,padding:"8px 12px"}}>{s.sub}</div>
              {s.actions.map((a,j)=>(
                <div key={j} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:8}}>
                  <span style={{color:s.color,fontWeight:700,flexShrink:0}}>→</span>
                  <span style={{fontSize:12,color:"#444",lineHeight:1.5}}>{a}</span>
                </div>
              ))}
            </div>
          ))}

          <div style={{...S.card,background:"#1a1a2e",color:"white"}}>
            <div style={{fontSize:16,fontWeight:800,marginBottom:10}}>🧮 Simple Money Math</div>
            {[
              ["100 paying users × $3.99/mo","= $399/month"],
              ["1,000 paying users × $3.99/mo","= $3,990/month"],
              ["5,000 paying users × $3.99/mo","= $19,950/month"],
              ["Affiliate (5K users, 10% buy)","= ~$2,000/month"],
              ["1 sponsor deal","= $500–$5,000 one time"],
            ].map(([k,v],i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid #ffffff20",fontSize:12}}>
                <span style={{opacity:0.8}}>{k}</span><strong style={{color:"#ff6b9d"}}>{v}</strong>
              </div>
            ))}
            <div style={{marginTop:12,fontSize:12,opacity:0.7,lineHeight:1.5}}>
              💡 Flo Health earns ~$10M/month from subscriptions. You don't need that. Even $5,000/month is life-changing for a solopreneur.
            </div>
          </div>

          <div style={{...S.card,borderLeft:"5px solid #ff9800"}}>
            <div style={{fontSize:15,fontWeight:800,color:"#e65100",marginBottom:8}}>⚡ Start Today (Right Now)</div>
            {["Share this app with 5 people in the next 10 minutes","Ask: 'Would you use this app? Rate it 1–10'","If most say 8–10: you have a real product idea!","If most say below 7: ask what's missing and improve"].map((a,i)=>(
              <div key={i} style={{display:"flex",gap:8,marginBottom:8}}>
                <span style={{color:"#ff9800",fontWeight:700}}>{i+1}.</span>
                <span style={{fontSize:12,color:"#444",lineHeight:1.5}}>{a}</span>
              </div>
            ))}
          </div>
        </div>}

      </div>
    </div>
  );
}

// ─── STYLES ────────────────────────────────────────────────────────────────
const S = {
  onboard:{minHeight:"100vh",background:"linear-gradient(135deg,#ffe0ec,#ffd6f0,#e8d5ff)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Georgia,serif",padding:20},
  onboardCard:{background:"white",borderRadius:24,padding:"40px 32px",maxWidth:400,width:"100%",boxShadow:"0 20px 60px rgba(255,107,157,0.25)",textAlign:"center"},
  onboardEmoji:{fontSize:56,marginBottom:8},
  onboardTitle:{fontSize:36,fontWeight:700,color:"#c2185b",margin:"0 0 8px"},
  onboardSub:{color:"#888",marginBottom:28,fontSize:15,lineHeight:1.5},
  app:{minHeight:"100vh",background:"#fef6f9",fontFamily:"'Segoe UI',sans-serif",maxWidth:480,margin:"0 auto"},
  header:{background:"linear-gradient(135deg,#ff6b9d,#c2185b)",color:"white",padding:"20px 20px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"},
  headerTitle:{fontSize:22,fontWeight:700,letterSpacing:-0.5},
  headerSub:{fontSize:13,opacity:0.85,marginTop:2},
  weekBadge:{background:"rgba(255,255,255,0.25)",borderRadius:20,padding:"6px 14px",fontSize:14,fontWeight:600},
  tabBar:{display:"flex",background:"white",borderBottom:"2px solid #ffe0ec",overflowX:"auto"},
  tabBtn:{flex:1,minWidth:46,padding:"8px 2px 6px",border:"none",background:"transparent",cursor:"pointer",fontSize:14,display:"flex",flexDirection:"column",alignItems:"center",gap:2,color:"#aaa"},
  tabLabel:{fontSize:8,fontWeight:600,letterSpacing:0.3},
  tabActive:{color:"#c2185b",borderBottom:"3px solid #c2185b"},
  content:{padding:"14px 14px 80px"},
  card:{background:"white",borderRadius:16,padding:"16px 14px",marginBottom:12,boxShadow:"0 2px 12px rgba(255,107,157,0.1)"},
  cardTitle:{fontSize:15,fontWeight:700,color:"#c2185b",marginBottom:12},
  row:{display:"flex",justifyContent:"space-between",marginBottom:8},
  muted:{fontSize:12,color:"#888"},
  pBar:{height:10,background:"#ffe0ec",borderRadius:8,overflow:"hidden",marginBottom:10},
  pFill:{height:"100%",background:"linear-gradient(90deg,#ff6b9d,#c2185b)",borderRadius:8,transition:"width 0.5s"},
  tRow:{display:"flex",gap:8},
  tChip:{flex:1,textAlign:"center",padding:"6px 0",borderRadius:20,background:"#ffe0ec",fontSize:11,fontWeight:600,color:"#c2185b"},
  tActive:{background:"#c2185b",color:"white"},
  babyCard:{background:"linear-gradient(135deg,#fff0f7,#ffe8f5)",border:"2px solid #ffb3d4",borderRadius:16,padding:16,marginBottom:12,display:"flex",alignItems:"center",gap:16},
  sGrid:{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12},
  sCard:{background:"white",borderRadius:12,padding:"12px 8px",textAlign:"center",boxShadow:"0 2px 8px rgba(255,107,157,0.1)"},
  sNum:{fontSize:26,fontWeight:700,color:"#c2185b"},
  sLabel:{fontSize:9,color:"#888",marginBottom:6},
  tinyBtn:{fontSize:10,padding:"4px 8px",border:"1px solid #ff6b9d",borderRadius:20,background:"transparent",color:"#ff6b9d",cursor:"pointer"},
  chatBox:{background:"#fef6f9",borderRadius:12,padding:10,minHeight:90,maxHeight:180,overflowY:"auto",marginBottom:8},
  chatMsg:{marginBottom:6,padding:"7px 11px",borderRadius:12,fontSize:12,lineHeight:1.5,maxWidth:"85%"},
  chatU:{background:"#ff6b9d",color:"white",marginLeft:"auto",borderBottomRightRadius:4},
  chatA:{background:"white",color:"#444",border:"1px solid #ffe0ec",borderBottomLeftRadius:4},
  chatRow:{display:"flex",gap:8},
  chatInput:{flex:1,border:"1px solid #ffb3d4",borderRadius:24,padding:"8px 14px",fontSize:12,outline:"none"},
  sendBtn:{background:"#c2185b",color:"white",border:"none",borderRadius:24,padding:"8px 14px",cursor:"pointer"},
  devGrid:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10},
  devItem:{background:"#fff0f7",borderRadius:10,padding:"10px 12px",display:"flex",flexDirection:"column",gap:2},
  btnRow:{display:"flex",gap:8,marginBottom:8},
  primaryBtn:{flex:1,background:"#c2185b",color:"white",border:"none",borderRadius:24,padding:"11px 18px",cursor:"pointer",fontWeight:600,fontSize:13},
  outlineBtn:{flex:1,background:"transparent",color:"#c2185b",border:"2px solid #c2185b",borderRadius:24,padding:"11px 18px",cursor:"pointer",fontWeight:600,fontSize:13},
  listItem:{padding:"7px 0",borderBottom:"1px solid #ffe0ec",fontSize:12,color:"#555"},
  moodBtn:{padding:"7px 12px",border:"2px solid #ffe0ec",borderRadius:20,background:"transparent",cursor:"pointer",fontSize:12},
  moodActive:{background:"#ffe0ec",borderColor:"#ff6b9d",fontWeight:600},
  symptomBtn:{padding:"6px 12px",border:"2px solid #ffe0ec",borderRadius:20,background:"transparent",cursor:"pointer",fontSize:11},
  symptomActive:{background:"#ffb3d4",borderColor:"#ff6b9d",color:"#7a0026",fontWeight:600},
  input:{border:"1px solid #ffb3d4",borderRadius:10,padding:"10px 12px",fontSize:13,outline:"none",width:"100%",boxSizing:"border-box"},
  fg:{marginBottom:12},
  label:{display:"block",fontSize:11,color:"#888",marginBottom:4,fontWeight:600},
  empty:{textAlign:"center",color:"#ccc",padding:28,fontSize:13},
  textarea:{width:"100%",border:"1px solid #ffb3d4",borderRadius:10,padding:"10px 12px",fontSize:13,outline:"none",resize:"vertical",marginBottom:10,boxSizing:"border-box",fontFamily:"inherit"},
  td:{padding:"7px 8px",borderBottom:"1px solid #ffe0ec",fontSize:11,verticalAlign:"top"},
};
