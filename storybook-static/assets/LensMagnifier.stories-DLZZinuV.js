import{j as e}from"./jsx-runtime-u17CrQMm.js";import{r as a,R as k}from"./iframe-D5S5KG8a.js";import{c as T}from"./utils-IyxL_b2c.js";import"./preload-helper-PPVm8Dsz.js";const c=a.forwardRef(({src:n,alt:y="Magnifiable Content",zoomLevel:d=2,lensSize:t=150,lensBorder:v=4,smoothFollowing:m=!0,className:j,...M},L)=>{const h=a.useRef(null),[r,u]=a.useState(!1),[i,w]=a.useState({x:0,y:0}),[b,R]=a.useState({x:0,y:0});a.useImperativeHandle(L,()=>({resetZoom:()=>u(!1)})),k.useEffect(()=>{if(!m||!r)return;let s;const o=()=>{w(l=>{const p=b.x-l.x,_=b.y-l.y;return{x:l.x+p*.15,y:l.y+_*.15}}),s=requestAnimationFrame(o)};return s=requestAnimationFrame(o),()=>cancelAnimationFrame(s)},[b,r,m]);const z=s=>{if(!h.current)return;const o=h.current.getBoundingClientRect(),l=s.clientX-o.left,p=s.clientY-o.top;m?R({x:l,y:p}):w({x:l,y:p}),r||u(!0)},C=()=>{u(!1)},S=a.useMemo(()=>{const s=t/2;return{left:`${i.x-s}px`,top:`${i.y-s}px`,width:`${t}px`,height:`${t}px`,borderWidth:`${v}px`,opacity:r?1:0,transform:r?"scale(1)":"scale(0.8)"}},[i,t,v,r]),I=a.useMemo(()=>{const s=i.x*-d+t/2,o=i.y*-d+t/2;return{width:`calc(100% * ${d})`,height:`calc(100% * ${d})`,transform:`translate(${s}px, ${o}px)`,transition:m?"none":"transform 0.05s linear"}},[i,d,t,m]);return e.jsxs("div",{ref:h,className:T("relative overflow-hidden cursor-none select-none group border border-slate-200 bg-slate-50",j),onMouseMove:z,onMouseLeave:C,onMouseEnter:()=>u(!0),...M,children:[e.jsx("img",{src:n,alt:y,className:"w-full h-full object-cover pointer-events-none transition-opacity duration-300",style:{filter:r?"brightness(0.9) grayscale(20%)":"none"},draggable:!1}),e.jsxs("div",{className:"absolute z-10 rounded-full border-slate-300/50 shadow-2xl transition-all duration-300 ease-out pointer-events-none overflow-hidden bg-white",style:{...S,boxShadow:"0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 0 10px rgba(0,0,0,0.3)"},children:[e.jsx("div",{className:"absolute inset-0 origin-top-left pointer-events-none blur-[0.3px]",children:e.jsx("img",{src:n,alt:"Zoomed",className:"absolute max-w-none pointer-events-none",style:I,draggable:!1})}),e.jsx("div",{className:"absolute inset-0 rounded-full pointer-events-none bg-gradient-to-br from-white/30 via-transparent to-black/10 mix-blend-overlay"}),e.jsx("div",{className:"absolute left-[15%] top-[10%] w-[30%] h-[15%] rounded-[100%] bg-white/20 -rotate-12 pointer-events-none blur-sm"})]})]})});c.displayName="LensMagnifier";c.__docgenInfo={description:`An interactive magnifying glass component that follows the user's cursor to reveal fine details
in an underlying image. Ideal for inspecting maps, codex pages, or intricate diagrams.

Uses standard CSS \`mask-image\` and standard DOM events for cross-browser compat.

@example
\`\`\`tsx
<LensMagnifier 
  src="/voynich-page-12.jpg" 
  zoomLevel={3} 
  lensSize={200}
  className="w-[800px] h-[600px] border shadow-md"
/>
\`\`\``,methods:[{name:"resetZoom",docblock:null,modifiers:[],params:[],returns:null}],displayName:"LensMagnifier",props:{src:{required:!0,tsType:{name:"string"},description:"Source image URL to be magnified."},alt:{required:!1,tsType:{name:"string"},description:`Alt text for the image.
@default "Magnifiable Content"`,defaultValue:{value:'"Magnifiable Content"',computed:!1}},zoomLevel:{required:!1,tsType:{name:"number"},description:`The zoom level. 2 means 200% magnification relative to container size.
@default 2`,defaultValue:{value:"2",computed:!1}},lensSize:{required:!1,tsType:{name:"number"},description:`The diameter of the magnifying glass lens in pixels.
@default 150`,defaultValue:{value:"150",computed:!1}},lensBorder:{required:!1,tsType:{name:"number"},description:`Thickness of the lens border/glass rim in pixels.
@default 4`,defaultValue:{value:"4",computed:!1}},smoothFollowing:{required:!1,tsType:{name:"boolean"},description:`Controls whether the lens follows the cursor precisely or has a subtle spring animation.
@default true`,defaultValue:{value:"true",computed:!1}}}};const O={title:"Components/LensMagnifier",component:c,parameters:{layout:"centered"},tags:["autodocs"]},N="https://upload.wikimedia.org/wikipedia/commons/e/e7/Voynich_Manuscript_%28109%29.jpg",f={args:{src:N,zoomLevel:2,lensSize:180,lensBorder:2,smoothFollowing:!0},render:n=>e.jsxs("div",{className:"flex flex-col gap-4 max-w-3xl",children:[e.jsx("h3",{className:"text-xl font-bold font-serif",children:"Inspecciona el manuscrito"}),e.jsx("p",{className:"text-gray-500",children:"Pasa el ratón sobre la imagen para revelar los detalles botánicos ocultos."}),e.jsx("div",{className:"p-2 bg-white rounded shadow-xl inline-block border border-gray-200",children:e.jsx(c,{...n,className:"w-[600px] h-[400px] rounded-sm object-cover"})})]})},g={args:{src:N,zoomLevel:5,lensSize:120,smoothFollowing:!1},render:n=>e.jsxs("div",{className:"flex flex-col gap-4 p-8 bg-zinc-900 text-zinc-300 rounded relative",children:[e.jsx("div",{className:"absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-rose-500 to-red-600"}),e.jsx("h3",{className:"text-sm font-mono text-rose-500 tracking-widest uppercase",children:">>> MICRO_SCAN_LENS_ACTVO"}),e.jsxs("div",{className:"border-4 border-zinc-800 p-1 relative group",children:[e.jsxs("div",{className:"absolute inset-0 pointer-events-none z-20 flex items-center justify-center opacity-0 group-hover:opacity-30 transition-opacity",children:[e.jsx("div",{className:"w-full h-[1px] bg-red-500 absolute"}),e.jsx("div",{className:"h-full w-[1px] bg-red-500 absolute"}),e.jsx("div",{className:"w-16 h-16 border border-red-500 rounded-full"})]}),e.jsx(c,{...n,className:"w-[400px] h-[400px] bg-black filter contrast-125"})]})]})},x={render:()=>{const n=a.useRef(null);return e.jsxs("div",{className:"flex flex-col gap-6 items-center",children:[e.jsx("button",{onClick:()=>n.current?.resetZoom(),className:"px-4 py-2 bg-emerald-600 text-white rounded shadow hover:bg-emerald-700",children:"Esconder Lente Temporalmente"}),e.jsx(c,{ref:n,src:"https://images.unsplash.com/photo-1544256718-3bcf237f3974?q=80&w=1000&auto=format&fit=crop",zoomLevel:2.5,lensSize:200,className:"w-[500px] h-[300px] rounded-lg shadow-2xl"})]})}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    src: VOYNICH_URL,
    zoomLevel: 2,
    lensSize: 180,
    lensBorder: 2,
    smoothFollowing: true
  },
  render: args => <div className="flex flex-col gap-4 max-w-3xl">
      <h3 className="text-xl font-bold font-serif">Inspecciona el manuscrito</h3>
      <p className="text-gray-500">Pasa el ratón sobre la imagen para revelar los detalles botánicos ocultos.</p>
      
      <div className="p-2 bg-white rounded shadow-xl inline-block border border-gray-200">
        <LensMagnifier {...args} className="w-[600px] h-[400px] rounded-sm object-cover" />
      </div>
    </div>
}`,...f.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    src: VOYNICH_URL,
    zoomLevel: 5,
    // Enorme
    lensSize: 120,
    // Pequeño y concentrado
    smoothFollowing: false // Inmediato sin spring (sentimiento de máquina/hardware)
  },
  render: args => <div className="flex flex-col gap-4 p-8 bg-zinc-900 text-zinc-300 rounded relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-rose-500 to-red-600" />
      <h3 className="text-sm font-mono text-rose-500 tracking-widest uppercase">&gt;&gt;&gt; MICRO_SCAN_LENS_ACTVO</h3>
      
      <div className="border-4 border-zinc-800 p-1 relative group">
         {/* Reticulo simulado */}
         <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center opacity-0 group-hover:opacity-30 transition-opacity">
            <div className="w-full h-[1px] bg-red-500 absolute" />
            <div className="h-full w-[1px] bg-red-500 absolute" />
            <div className="w-16 h-16 border border-red-500 rounded-full" />
         </div>
         
         <LensMagnifier {...args} className="w-[400px] h-[400px] bg-black filter contrast-125" />
      </div>
    </div>
}`,...g.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => {
    const lensRef = useRef<LensMagnifierRef>(null);
    return <div className="flex flex-col gap-6 items-center">
        <button onClick={() => lensRef.current?.resetZoom()} className="px-4 py-2 bg-emerald-600 text-white rounded shadow hover:bg-emerald-700">
          Esconder Lente Temporalmente
        </button>

        <LensMagnifier ref={lensRef} src="https://images.unsplash.com/photo-1544256718-3bcf237f3974?q=80&w=1000&auto=format&fit=crop" zoomLevel={2.5} lensSize={200} className="w-[500px] h-[300px] rounded-lg shadow-2xl" />
      </div>;
  }
}`,...x.parameters?.docs?.source}}};const $=["InspectionMode","DeepMicroscope","ManualResetMode"];export{g as DeepMicroscope,f as InspectionMode,x as ManualResetMode,$ as __namedExportsOrder,O as default};
