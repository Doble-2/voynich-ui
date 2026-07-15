import{j as e}from"./jsx-runtime-u17CrQMm.js";import{r as l}from"./iframe-D5S5KG8a.js";import{c as Y}from"./utils-IyxL_b2c.js";import"./preload-helper-PPVm8Dsz.js";const V=a=>(a%360+360)%360,B=(a,s,d)=>{const o=Math.abs(V(a)-V(s));return o<=d||o>=360-d},h=l.forwardRef(({rings:a,onChange:s,onSolve:d,renderItem:o,size:p=400,className:b,snapTolerance:g=8,showCenterPivot:i=!0,disabled:u=!1},x)=>{const C=l.useRef(null),[y,w]=l.useState(!1),S=()=>a.reduce((t,n)=>({...t,[n.id]:n.initialRotation||0}),{}),$=()=>a.reduce((t,n)=>({...t,[n.id]:n.targetRotation!==void 0?B(n.initialRotation||0,n.targetRotation,g):!1}),{}),[v,_]=l.useState(S),[k,P]=l.useState($),[j,U]=l.useState(null),[q,Q]=l.useState(0),[W,F]=l.useState(0);l.useImperativeHandle(x,()=>({reset:()=>{_(S()),P($()),w(!1)},solve:()=>{const t={...v},n={...k};a.forEach(r=>{r.targetRotation!==void 0&&(t[r.id]=r.targetRotation,n[r.id]=!0)}),_(t),P(n),w(!0),setTimeout(()=>{s?.(n,t),d?.()},0)},setRotation:(t,n)=>{L(t,n)},getRotations:()=>v}));const L=(t,n)=>{const r=a.find(c=>c.id===t);r&&(r.step&&(n=Math.round(n/r.step)*r.step),_(c=>({...c,[t]:n})),r.targetRotation!==void 0&&B(n,r.targetRotation,g)&&(n=r.targetRotation,_(c=>({...c,[t]:n})),P(c=>{const m={...c,[t]:!0};return a.filter(f=>f.targetRotation!==void 0).every(f=>m[f.id])&&!y&&(w(!0),setTimeout(()=>d?.(),0)),setTimeout(()=>s?.(m,{...v,[t]:n}),0),m}),U(null)))},H=(t,n)=>{if(!C.current)return 0;const r=C.current.getBoundingClientRect(),c=r.left+r.width/2,m=r.top+r.height/2;return Math.atan2(n-m,t-c)*(180/Math.PI)},X=(t,n)=>{u||a.find(c=>c.id===n)?.disabled||k[n]||(t.stopPropagation(),t.preventDefault(),U(n),Q(H(t.clientX,t.clientY)),F(v[n]||0))},Z=(t,n)=>{if(u||k[n])return;const r=a.find(z=>z.id===n);if(r?.disabled)return;const c=r?.step||5;let m=0;(t.key==="ArrowRight"||t.key==="ArrowUp")&&(m=c),(t.key==="ArrowLeft"||t.key==="ArrowDown")&&(m=-c),m!==0&&(t.preventDefault(),L(n,(v[n]||0)+m))};l.useEffect(()=>{const t=r=>{if(!j)return;const c=H(r.clientX,r.clientY)-q;L(j,W+c)},n=()=>{j&&(s?.(k,v),U(null))};return j&&(window.addEventListener("pointermove",t),window.addEventListener("pointerup",n)),()=>{window.removeEventListener("pointermove",t),window.removeEventListener("pointerup",n)}},[j,q,W,a,g,k,v]);const K=l.useMemo(()=>[...a].sort((t,n)=>n.radius-t.radius),[a]);return e.jsxs("div",{ref:C,className:Y("relative rounded-full flex items-center justify-center overflow-hidden select-none","bg-background text-foreground border border-border shadow-lg",b),style:{width:p,height:p},children:[i&&e.jsx("div",{className:"absolute left-1/2 top-1/2 w-8 h-8 bg-primary rounded-full -translate-x-1/2 -translate-y-1/2 z-50 shadow-md border-4 border-background pointer-events-none"}),K.map((t,n)=>{const r=v[t.id]||0,c=t.radius*2,m=t.items||[],z=m.length>0?360/m.length:0,f=k[t.id],G=!u&&!t.disabled&&!f;return e.jsxs("div",{role:G?"slider":"presentation","aria-valuemin":0,"aria-valuemax":360,"aria-valuenow":Math.round(V(r)),"aria-label":`Anillo ${t.id}`,tabIndex:G?0:-1,onPointerDown:R=>X(R,t.id),onKeyDown:R=>Z(R,t.id),className:Y("absolute rounded-full border overflow-hidden box-border","border-border bg-secondary/30 text-foreground",f?"cursor-default drop-shadow-md":"cursor-grab active:cursor-grabbing",G&&"hover:border-primary focus:outline-none focus:ring-4 focus:ring-ring transition-shadow",f&&"transition-transform duration-300 ease-out",t.ringClassName),style:{width:c,height:c,left:(p-c)/2,top:(p-c)/2,transform:`rotate(${r}deg)`,borderWidth:t.thickness===t.radius?0:2,borderColor:"inherit",touchAction:"none",backgroundColor:t.bgImage?"transparent":void 0,backgroundImage:t.bgImage?`url(${t.bgImage})`:void 0,backgroundSize:"cover",zIndex:10+n},children:[t.bgContent&&e.jsx("div",{className:"absolute inset-0 w-full h-full pointer-events-none",children:t.bgContent}),!t.hideDividers&&m.map((R,N)=>e.jsx("div",{className:"absolute left-1/2 top-0 w-[2px] bg-border origin-bottom pointer-events-none",style:{height:t.thickness,transform:`translateX(-50%) rotate(${N*z}deg)`,transformOrigin:`50% ${t.radius}px`}},`line-${N}`)),m.map((R,N)=>{const J=N*z;return e.jsx("div",{className:"absolute left-1/2 top-1/2 flex items-center justify-center pointer-events-none",style:{transform:`translate(-50%, -50%) rotate(${J}deg) translateY(-${t.radius-t.thickness/2}px)`,width:t.thickness*1.5,height:t.thickness,textAlign:"center"},children:e.jsx("div",{style:{transform:t.itemOrientation==="upright"?"rotate(0deg)":"rotate(90deg)",opacity:f?1:.85,fontWeight:f?"bold":"normal",fontSize:`${Math.min(t.thickness*.4,32)}px`},children:o?o(R,N,t,f):R})},`item-${N}`)})]},t.id)})]})});h.displayName="RingPuzzle";h.__docgenInfo={description:"",methods:[{name:"reset",docblock:null,modifiers:[],params:[],returns:null},{name:"solve",docblock:null,modifiers:[],params:[],returns:null},{name:"setRotation",docblock:null,modifiers:[],params:[{name:"ringId",optional:!1,type:null},{name:"degrees",optional:!1,type:null}],returns:null},{name:"getRotations",docblock:null,modifiers:[],params:[],returns:null}],displayName:"RingPuzzle",props:{rings:{required:!0,tsType:{name:"Array",elements:[{name:"Ring"}],raw:"Ring[]"},description:""},onChange:{required:!1,tsType:{name:"signature",type:"function",raw:`(
  locked: Record<string, boolean>,
  rotations: Record<string, number>,
) => void`,signature:{arguments:[{type:{name:"Record",elements:[{name:"string"},{name:"boolean"}],raw:"Record<string, boolean>"},name:"locked"},{type:{name:"Record",elements:[{name:"string"},{name:"number"}],raw:"Record<string, number>"},name:"rotations"}],return:{name:"void"}}},description:""},onSolve:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},renderItem:{required:!1,tsType:{name:"signature",type:"function",raw:`(
  item: React.ReactNode,
  index: number,
  ring: Ring,
  isLocked: boolean,
) => React.ReactNode`,signature:{arguments:[{type:{name:"ReactReactNode",raw:"React.ReactNode"},name:"item"},{type:{name:"number"},name:"index"},{type:{name:"Ring"},name:"ring"},{type:{name:"boolean"},name:"isLocked"}],return:{name:"ReactReactNode",raw:"React.ReactNode"}}},description:"Render prop opcional para controlar cómo se dibuja cada item individual (útil para tooltips, 3D, condicionales extras)"},size:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"400",computed:!1}},className:{required:!1,tsType:{name:"string"},description:""},snapTolerance:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"8",computed:!1}},showCenterPivot:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}},disabled:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}}};const re={title:"Components/RingPuzzle",component:h,parameters:{layout:"centered"},tags:["autodocs"]},A={args:{rings:[{id:"outer",radius:180,thickness:60,items:["A","B","C","D","E","F","G","H"],initialRotation:0,targetRotation:0},{id:"inner",radius:120,thickness:60,items:["1","2","3","4","5","6"],initialRotation:45,targetRotation:0}]},render:a=>e.jsx("div",{className:"p-12 w-full flex justify-center bg-background rounded-lg border border-border",children:e.jsx(h,{...a})})},ee=()=>e.jsxs("svg",{viewBox:"0 0 100 100",className:"w-full h-full",style:{fill:"#c05c2a"},children:[e.jsxs("defs",{children:[e.jsxs("radialGradient",{id:"sunGrad",cx:"50%",cy:"50%",r:"50%",children:[e.jsx("stop",{offset:"0%",stopColor:"#ffeba1"}),e.jsx("stop",{offset:"60%",stopColor:"#e2a03f"}),e.jsx("stop",{offset:"100%",stopColor:"#9a4d1a"})]}),e.jsxs("radialGradient",{id:"oceanGrad",cx:"50%",cy:"50%",r:"50%",children:[e.jsx("stop",{offset:"0%",stopColor:"#43b593"}),e.jsx("stop",{offset:"100%",stopColor:"#1e5f80"})]})]}),e.jsx("circle",{cx:"50",cy:"50",r:"50",fill:"url(#sunGrad)"}),Array.from({length:16}).map((a,s)=>e.jsx("polygon",{points:"50,12 56,0 44,0",fill:s%2===0?"#9c341a":"#ca6e28",transform:`rotate(${s*(360/16)} 50 50)`},`ray-${s}`)),e.jsx("circle",{cx:"50",cy:"50",r:"30",fill:"url(#oceanGrad)",stroke:"#4a180b",strokeWidth:"2"}),e.jsxs("g",{transform:"translate(15, 10)",children:[e.jsx("path",{d:"M 30 65 L 50 65 L 45 45 L 35 45 Z",fill:"#2b1a10"}),e.jsx("path",{d:"M 15 60 Q 30 75 55 60 Q 60 55 65 50 L 10 50 Z",fill:"#4a2a1b"}),e.jsx("line",{x1:"25",y1:"50",x2:"25",y2:"25",stroke:"#2b1a10",strokeWidth:"1.5"}),e.jsx("line",{x1:"40",y1:"50",x2:"40",y2:"20",stroke:"#2b1a10",strokeWidth:"1.5"}),e.jsx("line",{x1:"50",y1:"50",x2:"50",y2:"30",stroke:"#2b1a10",strokeWidth:"1.5"}),e.jsx("path",{d:"M 25 30 Q 30 40 25 45",stroke:"#e4d5b7",strokeWidth:"2",fill:"none"}),e.jsx("path",{d:"M 40 25 Q 48 35 40 45",stroke:"#e4d5b7",strokeWidth:"2",fill:"none"})]})]}),M={args:{rings:[]},render:()=>{const[a,s]=l.useState("Gira las constelaciones, mareas y la nave al unísono..."),[d,o]=l.useState(!1),p=(g,i)=>{if(d)return;const u=Object.values(g).filter(Boolean).length;u===1&&s("1/4 Anillos encajados..."),u===2&&s("2/4 Anillos en resonancia..."),u===3&&s("3/4 Muy cerca del alineamiento estelar..."),u===0&&s("Gira las constelaciones, mareas y la nave al unísono...")},b=()=>{o(!0),s("✨ ¡Gran Conjunción! El códice está resuelto. ✨")};return e.jsxs("div",{className:"flex flex-col items-center gap-10 bg-[#0a0d14] border-[12px] border-[#311b0e] p-12 rounded-[100%] shadow-[0_0_80px_rgba(0,0,0,1)] relative w-[800px] h-[800px] justify-center mx-auto scale-[0.85]",children:[e.jsx("div",{className:"absolute inset-0 bg-[radial-gradient(circle,_#211611_0%,_#090503_100%)] opacity-90 pointer-events-none"}),e.jsx(h,{size:650,onChange:p,onSolve:b,snapTolerance:10,disabled:d,showCenterPivot:!1,rings:[{id:"moon-outer",radius:325,thickness:85,items:["🌑","🌒","🌓","🌔","🌕","🌖","🌗","🌘","🌑","🌒","🌓","🌔","🌕","🌖","🌗","🌘"],itemOrientation:"radial",ringClassName:"bg-[#151c24] border-[#d4a362]",bgContent:e.jsx("div",{className:"w-full h-full bg-[radial-gradient(circle,_#1e293b_0%,_#070a10_100%)] opacity-80"}),hideDividers:!0,initialRotation:130,targetRotation:0},{id:"skulls-middle",radius:240,thickness:65,items:["💀","密","💀","地","💀","獄","💀","密","💀","地","💀","獄"],itemOrientation:"radial",ringClassName:"border-[#5e2715]",bgContent:e.jsx("div",{className:"w-full h-full bg-[#9e3a1f] opacity-40 mix-blend-multiply"}),initialRotation:-55,targetRotation:90},{id:"zodiac-inner",radius:175,thickness:45,items:["♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓"],itemOrientation:"upright",hideDividers:!1,step:30,initialRotation:210,targetRotation:180},{id:"sun-core",radius:130,thickness:130,hideDividers:!0,bgContent:e.jsx(ee,{}),initialRotation:45,targetRotation:0}]}),a&&e.jsx("div",{className:`absolute bottom-[-60px] text-2xl font-serif text-center w-full max-w-[600px] z-10 transition-all duration-700 ${d?"text-[#ffefa0] drop-shadow-[0_0_15px_rgba(255,200,100,1)]":"text-[#a27e53]"}`,children:a})]})}},O={args:{rings:[]},render:()=>{const a=l.useRef(null),[s,d]=l.useState(""),[o,p]=l.useState(!1),[b,g]=l.useState(!1),i="VOYNICH",u=[{id:"outer",radius:180,thickness:60,items:["V","X","Y","Z","A","B","C","D"],initialRotation:80,targetRotation:0,ringClassName:"bg-slate-800 text-white border-slate-600"},{id:"middle",radius:120,thickness:60,items:["O","P","Q","R","S","T","U","W"],initialRotation:190,targetRotation:0,ringClassName:"bg-slate-700 text-white border-slate-500"},{id:"inner",radius:60,thickness:60,items:["Y","N","I","C","H","!"],initialRotation:-120,targetRotation:0,ringClassName:"bg-slate-600 text-white border-slate-400"}];return l.useEffect(()=>{s.toUpperCase()===i&&!o&&!b?(g(!0),a.current?.solve()):s.toUpperCase()!==i&&o&&(p(!1),g(!1),a.current?.reset())},[s,o,b]),e.jsxs("div",{className:"flex flex-col items-center gap-8 p-12 w-full max-w-2xl bg-background rounded-xl border border-border shadow-lg font-sans",children:[e.jsxs("div",{className:"text-center space-y-2",children:[e.jsx("h2",{className:"text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400",children:o?"¡Módulo Desbloqueado!":"Portal de Seguridad"}),e.jsx("p",{className:"text-muted-foreground text-sm max-w-sm mx-auto",children:o?"Acceso concedido al sanctum interior.":"Introduce la contraseña o alinea los anillos manualmente para acceder."})]}),e.jsxs("div",{className:"w-full max-w-sm relative",children:[e.jsx("input",{type:"text",value:s,onChange:x=>d(x.target.value),disabled:o||b,placeholder:"Contraseña...",className:"w-full px-4 py-3 rounded-md border-2 border-slate-700 bg-slate-900 text-white text-center font-mono text-xl uppercase tracking-widest focus:outline-none focus:border-blue-500 disabled:opacity-50 transition-colors"}),e.jsx("span",{className:"absolute -bottom-6 left-0 right-0 text-center text-xs text-muted-foreground opacity-50 font-mono",children:"Pista: VOYNICH"})]}),e.jsxs("div",{className:"relative mt-6 transition-all duration-1000 ease-in-out",children:[e.jsx("div",{className:`transition-all duration-1000 ${o?"scale-110 drop-shadow-[0_0_40px_rgba(56,189,248,0.4)]":"scale-100"}`,children:e.jsx(h,{ref:a,size:400,rings:u,disabled:o||b,onSolve:()=>{p(!0),g(!1),s.toUpperCase()!==i&&d(i)}})}),e.jsx("div",{className:`absolute inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-md rounded-full transition-all duration-1000 pointer-events-none custom-transition ${o?"opacity-100 scale-100":"opacity-0 scale-50"}`,children:e.jsxs("div",{className:"text-center p-8 bg-slate-800 text-white rounded-full h-80 w-80 flex flex-col items-center justify-center border-4 border-emerald-500 shadow-2xl transform transition-transform duration-700 delay-300",children:[e.jsx("svg",{className:"w-20 h-20 mb-4 text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"})}),e.jsxs("h3",{className:"font-bold text-2xl tracking-wider mb-2 text-emerald-300",children:["ACCESO",e.jsx("br",{}),"CONCEDIDO"]}),e.jsx("div",{className:"h-1 w-16 bg-emerald-500/50 rounded animate-pulse mt-2"})]})})]})]})}},I={args:{rings:[]},render:()=>{const a=Array.from({length:26},(i,u)=>String.fromCharCode(65+u)),[s,d]=l.useState(0),[o,p]=l.useState("HOLA MUNDO"),b=(i,u)=>{const x=u["cipher-outer"]||0,C=u["cipher-inner"]||0,y=(x-C+360)%360,w=Math.round(y/(360/26))%26;d(w)},g=i=>i.toUpperCase().split("").map(u=>{const x=u.charCodeAt(0);return x>=65&&x<=90?String.fromCharCode((x-65+s)%26+65):u}).join("");return e.jsxs("div",{className:"flex flex-col items-center gap-8 p-12 bg-neutral-900 rounded-xl border border-neutral-700 shadow-2xl text-neutral-100",children:[e.jsxs("div",{className:"text-center space-y-1",children:[e.jsx("h2",{className:"text-2xl font-mono text-amber-500",children:"Cifrador César"}),e.jsxs("p",{className:"text-neutral-400 text-sm",children:["Gira el anillo interior para cambiar la clave (+",s,")"]})]}),e.jsx(h,{size:450,onChange:b,showCenterPivot:!0,rings:[{id:"cipher-outer",radius:200,thickness:50,items:a,itemOrientation:"upright",step:360/26,ringClassName:"bg-neutral-800 text-amber-500 border-neutral-600 font-mono text-xl"},{id:"cipher-inner",radius:150,thickness:50,items:a,itemOrientation:"upright",step:360/26,ringClassName:"bg-amber-700 text-neutral-900 border-neutral-500 font-mono font-bold text-lg",initialRotation:0}]}),e.jsxs("div",{className:"w-full max-w-sm flex flex-col gap-4 bg-neutral-800 p-6 rounded-lg border border-neutral-700",children:[e.jsxs("div",{children:[e.jsx("label",{className:"text-xs text-neutral-500 uppercase tracking-widest block mb-1",children:"Texto Original"}),e.jsx("input",{value:o,onChange:i=>p(i.target.value),className:"w-full bg-neutral-950 text-neutral-200 px-3 py-2 rounded focus:outline-none focus:border-amber-500 border border-transparent font-mono"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"text-xs text-amber-600 uppercase tracking-widest block mb-1",children:"Texto Cifrado"}),e.jsx("div",{className:"w-full bg-amber-950/30 text-amber-500 px-3 py-2 rounded font-mono text-xl tracking-widest border border-amber-900/50",children:g(o)||"..."})]})]})]})}},D={args:{rings:[]},render:()=>{const[a,s]=l.useState(!1),d=["0","1","2","3","4","5","6","7","8","9"];return e.jsxs("div",{className:"flex flex-col items-center gap-6 p-12 bg-zinc-800 rounded-3xl border-8 border-zinc-950 shadow-[inset_0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden",children:[e.jsxs("div",{className:"flex gap-4 bg-zinc-900 px-6 py-3 rounded-t-xl border-t border-x border-zinc-700 shadow-inner",children:[e.jsx("div",{className:`w-4 h-4 rounded-full ${a?"bg-red-950":"bg-red-500 shadow-[0_0_10px_red]"} transition-colors`}),e.jsx("div",{className:`w-4 h-4 rounded-full ${a?"bg-green-500 shadow-[0_0_10px_green]":"bg-green-950"} transition-colors`})]}),e.jsx(h,{size:380,onSolve:()=>s(!0),disabled:a,snapTolerance:18,rings:[{id:"safe-1",radius:160,thickness:50,items:d,itemOrientation:"upright",step:36,targetRotation:252,initialRotation:72,ringClassName:"bg-zinc-300 text-zinc-900 font-bold text-2xl border-4 border-zinc-400 shadow-2xl"},{id:"safe-2",radius:110,thickness:50,items:d,itemOrientation:"upright",step:36,targetRotation:108,initialRotation:288,ringClassName:"bg-zinc-400 text-zinc-950 font-bold text-2xl border-4 border-zinc-500"},{id:"safe-3",radius:60,thickness:50,items:d,itemOrientation:"upright",step:36,targetRotation:324,initialRotation:36,ringClassName:"bg-zinc-500 text-zinc-900 font-bold text-2xl border-4 border-zinc-600"}]}),a&&e.jsx("div",{className:"absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in zoom-in duration-500",children:e.jsx("div",{className:"text-green-400 text-3xl font-mono font-bold uppercase drop-shadow-[0_0_8px_rgba(34,197,94,0.8)] border-2 border-green-500 p-6 rounded-lg bg-green-950/50",children:"Abierto"})})]})}},T={args:{rings:[]},render:()=>{const a=Array.from({length:12},(g,i)=>(i===0?12:i).toString()),s=Array.from({length:12},(g,i)=>(i*5).toString().padStart(2,"0")),d=["AM","PM"],[o,p]=l.useState({h:"12",m:"00",p:"AM"}),b=(g,i)=>{const u=((i.hours||0)%360+360)%360,x=((i.minutes||0)%360+360)%360,C=((i.ampm||0)%360+360)%360,y=Math.round((360-u)/30)%12,w=Math.round((360-x)/30)%12,S=Math.round((360-C)/180)%2;p({h:a[y],m:s[w],p:d[S]})};return e.jsxs("div",{className:"flex flex-col items-center gap-6 p-8 bg-white text-slate-800 rounded-3xl shadow-xl w-96",children:[e.jsxs("div",{className:"text-5xl font-light tabular-nums tracking-tighter",children:[o.h,":",o.m," ",e.jsx("span",{className:"text-xl text-slate-400 ml-1",children:o.p})]}),e.jsx(h,{size:320,onChange:b,showCenterPivot:!1,rings:[{id:"hours",radius:140,thickness:45,items:a,itemOrientation:"upright",step:30,ringClassName:"bg-blue-50 text-blue-900 font-medium border-white/50"},{id:"minutes",radius:95,thickness:45,items:s,itemOrientation:"upright",step:30,ringClassName:"bg-blue-100 text-blue-800 font-medium text-sm border-white/50"},{id:"ampm",radius:50,thickness:50,items:d,itemOrientation:"upright",step:180,ringClassName:"bg-blue-600 text-white font-bold text-xs"}]})]})}},E={args:{rings:[]},render:()=>e.jsxs("div",{className:"flex flex-col items-center gap-6 p-12 bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden relative",children:[e.jsx("h2",{className:"text-xl font-medium text-slate-500",children:"Alinea los colores"}),e.jsx(h,{size:400,showCenterPivot:!1,rings:[{id:"cyan",radius:180,thickness:60,bgContent:e.jsx("div",{className:"absolute top-0 right-0 w-1/2 h-full bg-cyan-400 opacity-80 mix-blend-multiply rounded-r-full"}),hideDividers:!0,ringClassName:"border-transparent bg-transparent"},{id:"magenta",radius:120,thickness:60,bgContent:e.jsx("div",{className:"absolute bottom-0 left-0 w-full h-1/2 bg-fuchsia-500 opacity-80 mix-blend-multiply rounded-b-full"}),hideDividers:!0,ringClassName:"border-transparent bg-transparent",initialRotation:120},{id:"yellow",radius:60,thickness:60,bgContent:e.jsx("div",{className:"absolute top-0 left-0 w-1/2 h-full bg-yellow-400 opacity-80 mix-blend-multiply rounded-l-full"}),hideDividers:!0,ringClassName:"border-transparent bg-transparent",initialRotation:-120}]})]})};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    rings: [{
      id: "outer",
      radius: 180,
      thickness: 60,
      items: ["A", "B", "C", "D", "E", "F", "G", "H"],
      initialRotation: 0,
      targetRotation: 0
    }, {
      id: "inner",
      radius: 120,
      thickness: 60,
      items: ["1", "2", "3", "4", "5", "6"],
      initialRotation: 45,
      targetRotation: 0
    }]
  },
  render: args => <div className="p-12 w-full flex justify-center bg-background rounded-lg border border-border">
      <RingPuzzle {...args} />
    </div>
}`,...A.parameters?.docs?.source}}};M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    rings: []
  },
  render: () => {
    const [message, setMessage] = useState("Gira las constelaciones, mareas y la nave al unísono...");
    const [solved, setSolved] = useState(false);
    const handleChange = (locked: Record<string, boolean>, rotations: Record<string, number>) => {
      if (solved) return;
      const count = Object.values(locked).filter(Boolean).length;
      if (count === 1) setMessage("1/4 Anillos encajados...");
      if (count === 2) setMessage("2/4 Anillos en resonancia...");
      if (count === 3) setMessage("3/4 Muy cerca del alineamiento estelar...");
      if (count === 0) setMessage("Gira las constelaciones, mareas y la nave al unísono...");
    };
    const handleSolve = () => {
      setSolved(true);
      setMessage("✨ ¡Gran Conjunción! El códice está resuelto. ✨");
    };
    return <div className="flex flex-col items-center gap-10 bg-[#0a0d14] border-[12px] border-[#311b0e] p-12 rounded-[100%] shadow-[0_0_80px_rgba(0,0,0,1)] relative w-[800px] h-[800px] justify-center mx-auto scale-[0.85]">
        {/* Fake Wood/Parchment Texture */}
        <div className="absolute inset-0 bg-[radial-gradient(circle,_#211611_0%,_#090503_100%)] opacity-90 pointer-events-none" />

        <RingPuzzle size={650} onChange={handleChange} onSolve={handleSolve} snapTolerance={10} disabled={solved} // Se bloqueará entero una vez resuelto
      showCenterPivot={false} // Quitamos la púa usando el SVG como centro del todo
      rings={[
      // --- TIER 1: Anillo exterior Cósmico (Fases de la luna) ---
      {
        id: "moon-outer",
        radius: 325,
        thickness: 85,
        items: ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘", "🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"],
        itemOrientation: "radial",
        ringClassName: "bg-[#151c24] border-[#d4a362]",
        // Añadiendo gradiente/fondo para imitar un anillo oscuro con lunas
        bgContent: <div className="w-full h-full bg-[radial-gradient(circle,_#1e293b_0%,_#070a10_100%)] opacity-80" />,
        hideDividers: true,
        initialRotation: 130,
        targetRotation: 0
      },
      // --- TIER 2: Anillo Calaveras/Mandalas (Imagen 3) ---
      {
        id: "skulls-middle",
        radius: 240,
        thickness: 65,
        items: ["💀", "密", "💀", "地", "💀", "獄", "💀", "密", "💀", "地", "💀", "獄"],
        itemOrientation: "radial",
        // Texto orientado hacia la circunferencia
        ringClassName: "border-[#5e2715]",
        bgContent: <div className="w-full h-full bg-[#9e3a1f] opacity-40 mix-blend-multiply" />,
        initialRotation: -55,
        targetRotation: 90
      },
      // --- TIER 3: Anillo Códice Zodiacal (Imagen 2) ---
      {
        id: "zodiac-inner",
        radius: 175,
        thickness: 45,
        items: ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"],
        itemOrientation: "upright",
        hideDividers: false,
        step: 30,
        // Gira en encajes dentados de 30°
        initialRotation: 210,
        targetRotation: 180
      },
      // --- TIER 4: Núcleo Sólido (El barco/Sol de la Imagen 3/2) ---
      // Un anillo donde \`thickness\` == \`radius\` se convierte en un disco completo puro
      {
        id: "sun-core",
        radius: 130,
        // Centro macizo
        thickness: 130,
        hideDividers: true,
        bgContent: <SunFaceGraphic />,
        // Renderizamos un SVG a medida que girará como fondo
        initialRotation: 45,
        targetRotation: 0
      }]} />

        {message && <div className={\`absolute bottom-[-60px] text-2xl font-serif text-center w-full max-w-[600px] z-10 transition-all duration-700 \${solved ? "text-[#ffefa0] drop-shadow-[0_0_15px_rgba(255,200,100,1)]" : "text-[#a27e53]"}\`}>
            {message}
          </div>}
      </div>;
  }
}`,...M.parameters?.docs?.source}}};O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    rings: []
  },
  render: () => {
    const puzzleRef = useRef<RingPuzzleRef>(null);
    const [inputValue, setInputValue] = useState("");
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    // Contraseña secreta
    const SECRET_CODE = "VOYNICH";
    const rings = [{
      id: "outer",
      radius: 180,
      thickness: 60,
      items: ["V", "X", "Y", "Z", "A", "B", "C", "D"],
      initialRotation: 80,
      targetRotation: 0,
      ringClassName: "bg-slate-800 text-white border-slate-600"
    }, {
      id: "middle",
      radius: 120,
      thickness: 60,
      items: ["O", "P", "Q", "R", "S", "T", "U", "W"],
      initialRotation: 190,
      targetRotation: 0,
      ringClassName: "bg-slate-700 text-white border-slate-500"
    }, {
      id: "inner",
      radius: 60,
      thickness: 60,
      items: ["Y", "N", "I", "C", "H", "!"],
      initialRotation: -120,
      targetRotation: 0,
      ringClassName: "bg-slate-600 text-white border-slate-400"
    }];
    useEffect(() => {
      // Si el usuario escribe la contraseña correctamente
      if (inputValue.toUpperCase() === SECRET_CODE && !isUnlocked && !isAnimating) {
        setIsAnimating(true);
        // Llama al método imperativo para resolver el puzzle automáticamente con la animación
        puzzleRef.current?.solve();
      } else if (inputValue.toUpperCase() !== SECRET_CODE && isUnlocked) {
        // Reset opcional si borra el texto
        setIsUnlocked(false);
        setIsAnimating(false);
        puzzleRef.current?.reset();
      }
    }, [inputValue, isUnlocked, isAnimating]);
    return <div className="flex flex-col items-center gap-8 p-12 w-full max-w-2xl bg-background rounded-xl border border-border shadow-lg font-sans">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            {isUnlocked ? "¡Módulo Desbloqueado!" : "Portal de Seguridad"}
          </h2>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            {isUnlocked ? "Acceso concedido al sanctum interior." : "Introduce la contraseña o alinea los anillos manualmente para acceder."}
          </p>
        </div>

        <div className="w-full max-w-sm relative">
          <input type="text" value={inputValue} onChange={e => setInputValue(e.target.value)} disabled={isUnlocked || isAnimating} placeholder="Contraseña..." className="w-full px-4 py-3 rounded-md border-2 border-slate-700 bg-slate-900 text-white text-center font-mono text-xl uppercase tracking-widest focus:outline-none focus:border-blue-500 disabled:opacity-50 transition-colors" />
          <span className="absolute -bottom-6 left-0 right-0 text-center text-xs text-muted-foreground opacity-50 font-mono">
            Pista: VOYNICH
          </span>
        </div>

        <div className="relative mt-6 transition-all duration-1000 ease-in-out">
          <div className={\`transition-all duration-1000 \${isUnlocked ? "scale-110 drop-shadow-[0_0_40px_rgba(56,189,248,0.4)]" : "scale-100"}\`}>
            <RingPuzzle ref={puzzleRef} size={400} rings={rings} disabled={isUnlocked || isAnimating} onSolve={() => {
            // Se ejecuta cuando los anillos alcanzan su objetivo (ya sea manual o por auto-solve)
            setIsUnlocked(true);
            setIsAnimating(false);
            // Auto-completa el input si se resolvió manualmente
            if (inputValue.toUpperCase() !== SECRET_CODE) {
              setInputValue(SECRET_CODE);
            }
          }} />
          </div>

          {/* Nuevo Módulo UI que aparece flotando encima */}
          <div className={\`absolute inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-md rounded-full transition-all duration-1000 pointer-events-none custom-transition \${isUnlocked ? "opacity-100 scale-100" : "opacity-0 scale-50"}\`}>
            <div className="text-center p-8 bg-slate-800 text-white rounded-full h-80 w-80 flex flex-col items-center justify-center border-4 border-emerald-500 shadow-2xl transform transition-transform duration-700 delay-300">
              <svg className="w-20 h-20 mb-4 text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="font-bold text-2xl tracking-wider mb-2 text-emerald-300">
                ACCESO
                <br />
                CONCEDIDO
              </h3>
              <div className="h-1 w-16 bg-emerald-500/50 rounded animate-pulse mt-2"></div>
            </div>
          </div>
        </div>
      </div>;
  }
}`,...O.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    rings: []
  },
  render: () => {
    // Generar alfabeto A-Z
    const alphabet = Array.from({
      length: 26
    }, (_, i) => String.fromCharCode(65 + i));
    const [shift, setShift] = useState(0);
    const [message, setMessage] = useState("HOLA MUNDO");
    const handleChange = (_: Record<string, boolean>, rotations: Record<string, number>) => {
      const outer = rotations["cipher-outer"] || 0;
      const inner = rotations["cipher-inner"] || 0;
      // Calcular la diferencia de rotación relativa
      // Cada letra ocupa 360/26 = 13.846 grados
      const diffGrados = (outer - inner + 360) % 360;
      const shiftIndex = Math.round(diffGrados / (360 / 26)) % 26;
      setShift(shiftIndex);
    };
    const encrypt = (text: string) => {
      return text.toUpperCase().split("").map(c => {
        const code = c.charCodeAt(0);
        if (code >= 65 && code <= 90) {
          return String.fromCharCode((code - 65 + shift) % 26 + 65);
        }
        return c;
      }).join("");
    };
    return <div className="flex flex-col items-center gap-8 p-12 bg-neutral-900 rounded-xl border border-neutral-700 shadow-2xl text-neutral-100">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-mono text-amber-500">Cifrador César</h2>
          <p className="text-neutral-400 text-sm">
            Gira el anillo interior para cambiar la clave (+{shift})
          </p>
        </div>

        <RingPuzzle size={450} onChange={handleChange} showCenterPivot={true} rings={[{
        id: "cipher-outer",
        radius: 200,
        thickness: 50,
        items: alphabet,
        itemOrientation: "upright",
        step: 360 / 26,
        ringClassName: "bg-neutral-800 text-amber-500 border-neutral-600 font-mono text-xl"
      }, {
        id: "cipher-inner",
        radius: 150,
        thickness: 50,
        items: alphabet,
        itemOrientation: "upright",
        step: 360 / 26,
        // Snap a las letras exactas
        ringClassName: "bg-amber-700 text-neutral-900 border-neutral-500 font-mono font-bold text-lg",
        initialRotation: 0
      }]} />

        <div className="w-full max-w-sm flex flex-col gap-4 bg-neutral-800 p-6 rounded-lg border border-neutral-700">
          <div>
            <label className="text-xs text-neutral-500 uppercase tracking-widest block mb-1">
              Texto Original
            </label>
            <input value={message} onChange={e => setMessage(e.target.value)} className="w-full bg-neutral-950 text-neutral-200 px-3 py-2 rounded focus:outline-none focus:border-amber-500 border border-transparent font-mono" />
          </div>
          <div>
            <label className="text-xs text-amber-600 uppercase tracking-widest block mb-1">
              Texto Cifrado
            </label>
            <div className="w-full bg-amber-950/30 text-amber-500 px-3 py-2 rounded font-mono text-xl tracking-widest border border-amber-900/50">
              {encrypt(message) || "..."}
            </div>
          </div>
        </div>
      </div>;
  }
}`,...I.parameters?.docs?.source}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    rings: []
  },
  render: () => {
    const [unlocked, setUnlocked] = useState(false);
    // Caja fuerte de 3 combinaciones. 360/10 números = 36 grados por paso
    const digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    return <div className="flex flex-col items-center gap-6 p-12 bg-zinc-800 rounded-3xl border-8 border-zinc-950 shadow-[inset_0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
        {/* Luces led */}
        <div className="flex gap-4 bg-zinc-900 px-6 py-3 rounded-t-xl border-t border-x border-zinc-700 shadow-inner">
          <div className={\`w-4 h-4 rounded-full \${!unlocked ? "bg-red-500 shadow-[0_0_10px_red]" : "bg-red-950"} transition-colors\`} />
          <div className={\`w-4 h-4 rounded-full \${unlocked ? "bg-green-500 shadow-[0_0_10px_green]" : "bg-green-950"} transition-colors\`} />
        </div>

        <RingPuzzle size={380} onSolve={() => setUnlocked(true)} disabled={unlocked} snapTolerance={18} // Más restrictivo
      rings={[{
        id: "safe-1",
        radius: 160,
        thickness: 50,
        items: digits,
        itemOrientation: "upright",
        step: 36,
        // Saltos estrictos de los números
        targetRotation: 36 * 7,
        // Código: 7
        initialRotation: 36 * 2,
        ringClassName: "bg-zinc-300 text-zinc-900 font-bold text-2xl border-4 border-zinc-400 shadow-2xl"
      }, {
        id: "safe-2",
        radius: 110,
        thickness: 50,
        items: digits,
        itemOrientation: "upright",
        step: 36,
        targetRotation: 36 * 3,
        // Código: 3
        initialRotation: 36 * 8,
        ringClassName: "bg-zinc-400 text-zinc-950 font-bold text-2xl border-4 border-zinc-500"
      }, {
        id: "safe-3",
        radius: 60,
        thickness: 50,
        items: digits,
        itemOrientation: "upright",
        step: 36,
        targetRotation: 36 * 9,
        // Código: 9
        initialRotation: 36 * 1,
        ringClassName: "bg-zinc-500 text-zinc-900 font-bold text-2xl border-4 border-zinc-600"
      }]} />

        {unlocked && <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in zoom-in duration-500">
            <div className="text-green-400 text-3xl font-mono font-bold uppercase drop-shadow-[0_0_8px_rgba(34,197,94,0.8)] border-2 border-green-500 p-6 rounded-lg bg-green-950/50">
              Abierto
            </div>
          </div>}
      </div>;
  }
}`,...D.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    rings: []
  },
  render: () => {
    const hours = Array.from({
      length: 12
    }, (_, i) => (i === 0 ? 12 : i).toString());
    const minutes = Array.from({
      length: 12
    }, (_, i) => (i * 5).toString().padStart(2, "0"));
    const ampm = ["AM", "PM"];
    const [time, setTime] = useState({
      h: "12",
      m: "00",
      p: "AM"
    });
    const handleChange = (_: Record<string, boolean>, rotations: Record<string, number>) => {
      // Calcular índices basado en rotación actual (cada hora es 30 grados)
      const hRot = ((rotations["hours"] || 0) % 360 + 360) % 360;
      const mRot = ((rotations["minutes"] || 0) % 360 + 360) % 360;
      const pRot = ((rotations["ampm"] || 0) % 360 + 360) % 360;
      const hIndex = Math.round((360 - hRot) / 30) % 12;
      const mIndex = Math.round((360 - mRot) / 30) % 12;
      const pIndex = Math.round((360 - pRot) / 180) % 2;
      setTime({
        h: hours[hIndex],
        m: minutes[mIndex],
        p: ampm[pIndex]
      });
    };
    return <div className="flex flex-col items-center gap-6 p-8 bg-white text-slate-800 rounded-3xl shadow-xl w-96">
        <div className="text-5xl font-light tabular-nums tracking-tighter">
          {time.h}:{time.m}{" "}
          <span className="text-xl text-slate-400 ml-1">{time.p}</span>
        </div>

        <RingPuzzle size={320} onChange={handleChange} showCenterPivot={false} rings={[{
        id: "hours",
        radius: 140,
        thickness: 45,
        items: hours,
        itemOrientation: "upright",
        step: 30,
        // 360 / 12
        ringClassName: "bg-blue-50 text-blue-900 font-medium border-white/50"
      }, {
        id: "minutes",
        radius: 95,
        thickness: 45,
        items: minutes,
        itemOrientation: "upright",
        step: 30,
        ringClassName: "bg-blue-100 text-blue-800 font-medium text-sm border-white/50"
      }, {
        id: "ampm",
        radius: 50,
        thickness: 50,
        items: ampm,
        itemOrientation: "upright",
        step: 180,
        // Solo dos lados AM/PM
        ringClassName: "bg-blue-600 text-white font-bold text-xs"
      }]} />
      </div>;
  }
}`,...T.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    rings: []
  },
  render: () => {
    return <div className="flex flex-col items-center gap-6 p-12 bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden relative">
        <h2 className="text-xl font-medium text-slate-500">
          Alinea los colores
        </h2>
        {/* Aquí usaremos bgContent y mix-blend-mode */}
        <RingPuzzle size={400} showCenterPivot={false} rings={[{
        id: "cyan",
        radius: 180,
        thickness: 60,
        // Un bloque de cyan que cubre la mitad del anillo
        bgContent: <div className="absolute top-0 right-0 w-1/2 h-full bg-cyan-400 opacity-80 mix-blend-multiply rounded-r-full" />,
        hideDividers: true,
        ringClassName: "border-transparent bg-transparent"
      }, {
        id: "magenta",
        radius: 120,
        thickness: 60,
        bgContent: <div className="absolute bottom-0 left-0 w-full h-1/2 bg-fuchsia-500 opacity-80 mix-blend-multiply rounded-b-full" />,
        hideDividers: true,
        ringClassName: "border-transparent bg-transparent",
        initialRotation: 120
      }, {
        id: "yellow",
        radius: 60,
        thickness: 60,
        bgContent: <div className="absolute top-0 left-0 w-1/2 h-full bg-yellow-400 opacity-80 mix-blend-multiply rounded-l-full" />,
        hideDividers: true,
        ringClassName: "border-transparent bg-transparent",
        initialRotation: -120
      }]} />
      </div>;
  }
}`,...E.parameters?.docs?.source}}};const oe=["Default","AdvancedDynamicRings","TextInputVariant","CaesarCipher","SafeLock","TimePicker","ColorMixer"];export{M as AdvancedDynamicRings,I as CaesarCipher,E as ColorMixer,A as Default,D as SafeLock,O as TextInputVariant,T as TimePicker,oe as __namedExportsOrder,re as default};
