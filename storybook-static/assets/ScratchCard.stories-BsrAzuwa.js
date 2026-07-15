import{j as t}from"./jsx-runtime-u17CrQMm.js";import{r as o}from"./iframe-D5S5KG8a.js";import{c as q}from"./utils-IyxL_b2c.js";import"./preload-helper-PPVm8Dsz.js";const m=o.forwardRef(({width:s=300,height:n=200,coverImage:f="#888",brushSize:h=20,brushHardness:C=1,clearThreshold:S=.5,onComplete:p,children:E,className:A,...O},D)=>{const u=o.useRef(null),P=o.useRef(null),[w,R]=o.useState(!1),[N,y]=o.useState(!1),W=o.useRef(new Set),T=()=>{const e=u.current;if(!e)return;const r=e.getContext("2d",{willReadFrequently:!0});if(r)if(y(!1),W.current.clear(),e.width=s,e.height=n,r.globalCompositeOperation="source-over",f.startsWith("url")){const a=new Image,l=f.match(/url\(['"]?(.*?)['"]?\)/);l&&l[1]&&(a.src=l[1],a.crossOrigin="anonymous",a.onload=()=>{r.drawImage(a,0,0,s,n),z(r)})}else r.fillStyle=f,r.fillRect(0,0,s,n),z(r)},z=e=>{e.globalCompositeOperation="destination-out",e.lineJoin="round",e.lineCap="round",e.lineWidth=h*2};o.useEffect(()=>{T()},[s,n,f]),o.useImperativeHandle(D,()=>({reset:()=>{T()},clear:()=>{const e=u.current;if(!e)return;const r=e.getContext("2d");r&&(r.globalCompositeOperation="destination-out",r.fillRect(0,0,s,n)),y(!0),p&&p()}}));const j=e=>{if(!w||N)return;e.preventDefault();const r=u.current;if(!r)return;const a=r.getContext("2d",{willReadFrequently:!0});if(!a)return;const l=r.getBoundingClientRect();let i,d;if("touches"in e?(i=e.touches[0].clientX-l.left,d=e.touches[0].clientY-l.top):(i=e.clientX-l.left,d=e.clientY-l.top),C<1){const c=a.createRadialGradient(i,d,0,i,d,h);c.addColorStop(0,"rgba(0,0,0,1)"),c.addColorStop(C,"rgba(0,0,0,1)"),c.addColorStop(1,"rgba(0,0,0,0)"),a.fillStyle=c,a.beginPath(),a.arc(i,d,h,0,Math.PI*2),a.fill()}else a.beginPath(),a.arc(i,d,h,0,Math.PI*2),a.fill();S!==null&&Math.random()>.8&&V(a)},V=e=>{if(N)return;const a=e.getImageData(0,0,s,n).data;let l=0;const i=s*n;for(let c=3;c<a.length;c+=16)a[c]===0&&l++;if(l/(i/4)>=S){y(!0);const c=20;let k=0;const M=setInterval(()=>{if(!u.current){clearInterval(M);return}k++,e.globalAlpha=.2,e.fillRect(0,0,s,n),k>=c&&(clearInterval(M),e.globalAlpha=1,e.fillRect(0,0,s,n),p&&p())},16)}},I=e=>{R(!0),j(e)},x=()=>{R(!1)};return o.useEffect(()=>{const e=u.current;if(!e)return;const r=a=>{w&&j(a)};return e.addEventListener("touchmove",r,{passive:!1}),()=>{e.removeEventListener("touchmove",r)}},[w]),t.jsxs("div",{ref:P,className:q("relative overflow-hidden cursor-crosshair select-none touch-none",A),style:{width:s,height:n},...O,children:[t.jsx("div",{className:"absolute inset-0 z-0 select-none pointer-events-none",children:E}),t.jsx("canvas",{ref:u,onMouseDown:I,onMouseUp:x,onMouseLeave:x,onMouseMove:j,onTouchStart:I,onTouchEnd:x,onTouchCancel:x,className:q("absolute inset-0 z-10 transition-opacity duration-500",N?"opacity-0 pointer-events-none":"opacity-100")})]})});m.displayName="ScratchCard";m.__docgenInfo={description:`A classic interactive Scratch-Off card component driven by the Canvas API (\`destination-out\`).
It obscures hidden content and allows users to reveal it by "scratching" with the mouse or touch.

Includes built-in support for auto-revealing when a specific threshold is met.

@example
\`\`\`tsx
<ScratchCard 
  width={400} 
  height={200} 
  coverImage="url(/noisy-texture.jpg)" 
  onComplete={() => alert('You won!')}
>
  <div className="flex bg-gold text-black rounded text-6xl items-center justify-center h-full">
    jackpot!
  </div>
</ScratchCard>
\`\`\``,methods:[{name:"reset",docblock:null,modifiers:[],params:[],returns:null},{name:"clear",docblock:null,modifiers:[],params:[],returns:null}],displayName:"ScratchCard",props:{width:{required:!1,tsType:{name:"number"},description:`The width of the scratch card in pixels.
@default 300`,defaultValue:{value:"300",computed:!1}},height:{required:!1,tsType:{name:"number"},description:`The height of the scratch card in pixels.
@default 200`,defaultValue:{value:"200",computed:!1}},coverImage:{required:!1,tsType:{name:"string"},description:`The image URL, color, or gradient to display as the cover over the scratch card.
@default 'gray'`,defaultValue:{value:"'#888'",computed:!1}},brushSize:{required:!1,tsType:{name:"number"},description:`Brush size in pixels for scratching.
@default 20`,defaultValue:{value:"20",computed:!1}},brushHardness:{required:!1,tsType:{name:"number"},description:`Hardness of the brush (0 to 1). Lower is softer/blurrier.
@default 1`,defaultValue:{value:"1",computed:!1}},clearThreshold:{required:!1,tsType:{name:"union",raw:"number | null",elements:[{name:"number"},{name:"null"}]},description:`Auto-reveal threshold (0 to 1). If the scratched area exceeds this, the entire card is cleared.
Null removes the auto-reveal functionality.
@default 0.5`,defaultValue:{value:"0.5",computed:!1}},onComplete:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Callback triggered when the card has been scratched beyond the clearThreshold."},children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:"The content to reveal underneath the cover."}}};const _={title:"Components/ScratchCard",component:m,parameters:{layout:"centered"},tags:["autodocs"]},b={render:()=>{const[s,n]=o.useState(!1);return t.jsxs("div",{className:"flex flex-col items-center gap-4 p-8 bg-zinc-100 rounded-xl relative",children:[t.jsx("h2",{className:"text-2xl font-bold text-zinc-800",children:"Raspa para ganar"}),t.jsx(m,{width:400,height:200,coverImage:"#9ca3af",brushSize:25,clearThreshold:.5,onComplete:()=>n(!0),className:"rounded-xl shadow-inner border border-zinc-300",children:t.jsxs("div",{className:"w-full h-full bg-gradient-to-br from-yellow-300 to-amber-500 flex items-center justify-center relative overflow-hidden",children:[t.jsx("div",{className:"absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"}),t.jsxs("div",{className:"text-center relative z-10",children:[t.jsx("span",{className:"text-6xl filter drop-shadow-md",children:"💰"}),t.jsx("h3",{className:"text-3xl font-black text-white mt-2 drop-shadow-md",children:"¡$1,000,000!"})]})]})}),s&&t.jsx("p",{className:"text-xl font-bold text-green-600 animate-bounce",children:"¡Felicidades!"})]})}},v={render:()=>t.jsxs("div",{className:"p-12 bg-neutral-950 flex flex-col items-center justify-center rounded-2xl border border-white/5 relative overflow-hidden",children:[t.jsx("div",{className:"absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"}),t.jsx("h2",{className:"text-rose-500/80 font-serif text-xl mb-6 tracking-widest uppercase relative z-10",children:"Despeja la ceniza"}),t.jsx(m,{width:500,height:500,coverImage:"#171717",brushSize:30,brushHardness:.5,clearThreshold:.7,className:"rounded-full shadow-2xl overflow-hidden ring-4 ring-rose-900/30",children:t.jsx("img",{src:"https://images.unsplash.com/photo-1584346893776-3b2d1c68e1ab?q=80&w=1000&auto=format&fit=crop",alt:"Ancient Map",className:"w-full h-full object-cover"})})]})},g={render:()=>{const s=o.useRef(null);return t.jsxs("div",{className:"flex flex-col items-center gap-6 p-8 bg-slate-50 rounded-xl border border-slate-200 shadow-sm",children:[t.jsx(m,{ref:s,width:300,height:300,coverImage:"#3b82f6",brushSize:20,className:"rounded-lg shadow-inner",children:t.jsx("div",{className:"w-full h-full bg-white flex items-center justify-center",children:t.jsx("span",{className:"text-4xl",children:"😎"})})}),t.jsxs("div",{className:"flex gap-4",children:[t.jsx("button",{onClick:()=>s.current?.reset(),className:"px-4 py-2 bg-slate-200 text-slate-800 rounded hover:bg-slate-300 font-medium transition-colors",children:"Resetear / Ocultar"}),t.jsx("button",{onClick:()=>s.current?.clear(),className:"px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium shadow-md transition-colors",children:"Revelar Todo Mágicamente"})]})]})}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [won, setWon] = useState(false);
    return <div className="flex flex-col items-center gap-4 p-8 bg-zinc-100 rounded-xl relative">
        <h2 className="text-2xl font-bold text-zinc-800">Raspa para ganar</h2>
        <ScratchCard width={400} height={200} coverImage="#9ca3af" // Tailwind gray-400 equivalent
      brushSize={25} clearThreshold={0.5} onComplete={() => setWon(true)} className="rounded-xl shadow-inner border border-zinc-300">
          <div className="w-full h-full bg-gradient-to-br from-yellow-300 to-amber-500 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
            <div className="text-center relative z-10">
              <span className="text-6xl filter drop-shadow-md">💰</span>
              <h3 className="text-3xl font-black text-white mt-2 drop-shadow-md">
                ¡$1,000,000!
              </h3>
            </div>
          </div>
        </ScratchCard>

        {won && <p className="text-xl font-bold text-green-600 animate-bounce">
            ¡Felicidades!
          </p>}
      </div>;
  }
}`,...b.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => {
    return <div className="p-12 bg-neutral-950 flex flex-col items-center justify-center rounded-2xl border border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30" />
        <h2 className="text-rose-500/80 font-serif text-xl mb-6 tracking-widest uppercase relative z-10">
          Despeja la ceniza
        </h2>

        <ScratchCard width={500} height={500}
      // Usamos un gris oscuro como 'ceniza'
      coverImage="#171717" brushSize={30} brushHardness={0.5} // Bordes suaves
      clearThreshold={0.7} // Requiere más esfuerzo para limpiar
      className="rounded-full shadow-2xl overflow-hidden ring-4 ring-rose-900/30">
          {/* Un mapa viejo o un fractal debajo */}
          <img src="https://images.unsplash.com/photo-1584346893776-3b2d1c68e1ab?q=80&w=1000&auto=format&fit=crop" alt="Ancient Map" className="w-full h-full object-cover" />
        </ScratchCard>
      </div>;
  }
}`,...v.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => {
    const cardRef = useRef<ScratchCardRef>(null);
    return <div className="flex flex-col items-center gap-6 p-8 bg-slate-50 rounded-xl border border-slate-200 shadow-sm">
        <ScratchCard ref={cardRef} width={300} height={300} coverImage="#3b82f6" // blue-500
      brushSize={20} className="rounded-lg shadow-inner">
          <div className="w-full h-full bg-white flex items-center justify-center">
            <span className="text-4xl">😎</span>
          </div>
        </ScratchCard>

        <div className="flex gap-4">
          <button onClick={() => cardRef.current?.reset()} className="px-4 py-2 bg-slate-200 text-slate-800 rounded hover:bg-slate-300 font-medium transition-colors">
            Resetear / Ocultar
          </button>
          <button onClick={() => cardRef.current?.clear()} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium shadow-md transition-colors">
            Revelar Todo Mágicamente
          </button>
        </div>
      </div>;
  }
}`,...g.parameters?.docs?.source}}};const B=["WinningTicket","ArchaicMapReveal","ControlExterno"];export{v as ArchaicMapReveal,g as ControlExterno,b as WinningTicket,B as __namedExportsOrder,_ as default};
