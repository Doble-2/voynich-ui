import{j as e}from"./jsx-runtime-u17CrQMm.js";import{r as c}from"./iframe-D5S5KG8a.js";import{c as x}from"./utils-IyxL_b2c.js";import"./preload-helper-PPVm8Dsz.js";const r=c.forwardRef(({items:n,radius:p=100,centerNode:h,staggerDelay:b=50,startAngle:f=-90,arc:d=360,className:v,...j},y)=>{const[s,o]=c.useState(!1);c.useImperativeHandle(y,()=>({open:()=>o(!0),close:()=>o(!1),toggle:()=>o(a=>!a)}));const M=d===360?d/n.length:d/Math.max(1,n.length-1);return e.jsxs("div",{className:x("relative flex items-center justify-center",v),...j,children:[e.jsx("div",{className:"relative z-20 cursor-pointer",onClick:()=>o(!s),children:h||e.jsx("div",{className:"w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center text-white shadow-xl hover:bg-neutral-700 transition-colors",children:"+"})}),n.map((a,m)=>{const g=(f+m*M)*(Math.PI/180),w=Math.cos(g)*p,k=Math.sin(g)*p;return e.jsx("div",{onClick:()=>{a.onClick?.(),o(!1)},className:x("absolute z-10 origin-center transition-all duration-500 cursor-pointer",s?"opacity-100 scale-100":"opacity-0 scale-50 pointer-events-none"),style:{transform:s?`translate(${w}px, ${k}px)`:"translate(0px, 0px)",transitionDelay:s?`${m*b}ms`:"0ms"},children:e.jsxs("div",{className:"flex flex-col items-center justify-center group",children:[a.icon&&e.jsx("div",{className:"w-10 h-10 bg-neutral-900 rounded-full border border-neutral-700 flex items-center justify-center shadow-lg hover:border-cyan-500 hover:text-cyan-400 hover:scale-110 transition-all text-neutral-300",children:a.icon}),a.label&&e.jsx("div",{className:"absolute top-12 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity text-xs font-mono text-neutral-400 bg-neutral-900 px-2 py-1 rounded",children:a.label})]})},a.id)})]})});r.displayName="RadialMenu";r.__docgenInfo={description:`\`RadialMenu\`

Un menú contextual esférico que despliega opciones alrededor de un punto central.
Utiliza matemáticas euclidianas nativas (Seno y Coseno) para distribuir dinámicamente
un Array de ítems según el ángulo inicial y el arco delimitado, garantizando distribución perfecta
sin importar el número inyectado.`,methods:[{name:"open",docblock:null,modifiers:[],params:[],returns:null},{name:"close",docblock:null,modifiers:[],params:[],returns:null},{name:"toggle",docblock:null,modifiers:[],params:[],returns:null}],displayName:"RadialMenu",props:{items:{required:!0,tsType:{name:"Array",elements:[{name:"RadialMenuItem"}],raw:"RadialMenuItem[]"},description:"Lista de elementos del menú con sus respectivos callbacks, íconos y etiquetas de texto."},radius:{required:!1,tsType:{name:"number"},description:`Distancia en píxeles hacia la cual se desplazarán los botones hijos desde el centro al florecer.
@default 100`,defaultValue:{value:"100",computed:!1}},centerNode:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:`El nodo visual React central (trigger). Puede ser el avatar de un usuario o un botón nativo. 
@default Un botón "+" provisto por defecto si no es sustituido.`},staggerDelay:{required:!1,tsType:{name:"number"},description:`Retraso fraccional (en milisegundos) entre la aparición correlativa de cada ítem (Stagger animation).
@default 50`,defaultValue:{value:"50",computed:!1}},startAngle:{required:!1,tsType:{name:"number"},description:"Ángulo (en grados polares) desde donde el arco o semicírculo de los botones inicializa.\n`0` apunta a la derecha, `-90` arriba, `90` abajo, `180` a la izquierda.\n@default -90",defaultValue:{value:"-90",computed:!1}},arc:{required:!1,tsType:{name:"number"},description:`El arco total (en grados) donde se distribuirán equitativamente los componentes dentro.
@default 360 // Círculo concéntrico completo.
@example 180 // Formará un arco de medio círculo.`,defaultValue:{value:"360",computed:!1}}}};const E={title:"Components/RadialMenu",component:r,parameters:{layout:"centered"},tags:["autodocs"]},N=()=>e.jsx("svg",{fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",strokeWidth:2,children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"})}),_=()=>e.jsx("svg",{fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",strokeWidth:2,children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"})}),C=()=>e.jsx("svg",{fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",strokeWidth:2,children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"})}),A=()=>e.jsx("svg",{fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",strokeWidth:2,children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"})}),S=()=>e.jsxs("svg",{fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",strokeWidth:2,children:[e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M15 12a3 3 0 11-6 0 3 3 0 016 0z"}),e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"})]}),u=[{id:"1",icon:e.jsx(N,{}),label:"Astros"},{id:"2",icon:e.jsx(C,{}),label:"Lunar"},{id:"3",icon:e.jsx(A,{}),label:"Solar"},{id:"4",icon:e.jsx(_,{}),label:"Reliquia"},{id:"5",icon:e.jsx(S,{}),label:"Ojo"}],t={args:{items:u,radius:120,startAngle:0,endAngle:360,staggerDelay:50},render:n=>e.jsxs("div",{className:"h-[400px] w-[400px] flex items-center justify-center p-8 bg-zinc-900 rounded-2xl relative overflow-hidden",children:[e.jsx("div",{className:"absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_0%,_transparent_100%)] mix-blend-screen"}),e.jsx(r,{...n})]})},l={args:{items:u,radius:100,startAngle:180,endAngle:360,staggerDelay:100},render:n=>e.jsx("div",{className:"h-[300px] w-[500px] flex items-end justify-center pb-12 bg-indigo-950 rounded-b-none rounded-t-[1000px] border-t border-indigo-500/30",children:e.jsx(r,{...n,buttonClassName:"bg-indigo-600 text-indigo-50 border-indigo-400/50 hover:bg-indigo-500 hover:scale-110 shadow-[0_0_15px_rgba(79,70,229,0.5)]"})})},i={args:{items:u.slice(0,3),radius:80,startAngle:45,endAngle:135,staggerDelay:80},render:n=>e.jsx("div",{className:"h-[300px] w-[300px] relative border border-slate-200 bg-slate-50 overflow-hidden shadow-inner",children:e.jsx("div",{className:"absolute top-8 left-8",children:e.jsx(r,{...n,buttonClassName:"w-10 h-10 bg-slate-800 text-slate-100 hover:bg-slate-700 shadow-xl"})})})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    items: MYSTIC_ITEMS,
    radius: 120,
    startAngle: 0,
    endAngle: 360,
    // Círculo completo
    staggerDelay: 50 // Animación rápida en cadena
  },
  render: args => <div className="h-[400px] w-[400px] flex items-center justify-center p-8 bg-zinc-900 rounded-2xl relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_0%,_transparent_100%)] mix-blend-screen" />
      <RadialMenu {...args} />
    </div>
}`,...t.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    items: MYSTIC_ITEMS,
    radius: 100,
    startAngle: 180,
    endAngle: 360,
    // Superior (180 a 360 grados en mate de SVG)
    staggerDelay: 100
  },
  render: args => <div className="h-[300px] w-[500px] flex items-end justify-center pb-12 bg-indigo-950 rounded-b-none rounded-t-[1000px] border-t border-indigo-500/30">
      <RadialMenu {...args} buttonClassName="bg-indigo-600 text-indigo-50 border-indigo-400/50 hover:bg-indigo-500 hover:scale-110 shadow-[0_0_15px_rgba(79,70,229,0.5)]" />
    </div>
}`,...l.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    items: MYSTIC_ITEMS.slice(0, 3),
    // Solo 3 items
    radius: 80,
    startAngle: 45,
    endAngle: 135,
    // Un pequeño arco en la esquina inferior
    staggerDelay: 80
  },
  render: args => <div className="h-[300px] w-[300px] relative border border-slate-200 bg-slate-50 overflow-hidden shadow-inner">
       {/* Posicionado en la esquina superior izquierda (Absolute context) */}
       <div className="absolute top-8 left-8">
         <RadialMenu {...args} buttonClassName="w-10 h-10 bg-slate-800 text-slate-100 hover:bg-slate-700 shadow-xl" />
       </div>
    </div>
}`,...i.parameters?.docs?.source}}};const D=["FullCircleMenu","HalfMoonArc","MonoculoOculto"];export{t as FullCircleMenu,l as HalfMoonArc,i as MonoculoOculto,D as __namedExportsOrder,E as default};
