import{j as e}from"./jsx-runtime-u17CrQMm.js";import{r as t}from"./iframe-D5S5KG8a.js";import{c as w}from"./utils-IyxL_b2c.js";import"./preload-helper-PPVm8Dsz.js";const C="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}|:<>?-=[];,./",r=t.forwardRef(({text:a,dictionary:u=C,speed:s=50,delay:d=800,resolvePerFrame:c=1,as:v="span",className:h,...b},y)=>{const[E,x]=t.useState(a),[R,f]=t.useState(!1),g=()=>{f(!0);let m=0;Math.max(a.length/c,d/s);const T=setInterval(()=>{x(j=>{let p="";const N=m-d/s;for(let n=0;n<a.length;n++)n<N*c||a[n]===" "?p+=a[n]:p+=u[Math.floor(Math.random()*u.length)];return p}),m>=a.length/c+d/s&&(clearInterval(T),f(!1),x(a)),m++},s)};return t.useImperativeHandle(y,()=>({scramble:g})),t.useEffect(()=>{g()},[a]),e.jsx(v,{className:w("font-mono",h),...b,children:E})});r.displayName="Cryptext";r.__docgenInfo={description:`\`Cryptext\`

Un componente envoltura polimórfico de texto que muestra una animación de "desencriptado"
matricial. Transiciona desde caracteres aleatorios hasta revelar la información.
Puede ser reiniciado mediante referencias (ref) para interactividad UI.`,methods:[{name:"scramble",docblock:null,modifiers:[],params:[],returns:null}],displayName:"Cryptext",props:{text:{required:!0,tsType:{name:"string"},description:`El texto final a revelar. 
@example "VOYNICH_PROTOCOL"`},dictionary:{required:!1,tsType:{name:"string"},description:`Caracteres que se rotarán al azar durante la fase de encriptación.
@default "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}|:<>?-=[];,./"`,defaultValue:{value:'"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}|:<>?-=[];,./"',computed:!1}},speed:{required:!1,tsType:{name:"number"},description:`Velocidad en milisegundos a la que mutan los caracteres o se actualiza cada frame.
@default 50`,defaultValue:{value:"50",computed:!1}},delay:{required:!1,tsType:{name:"number"},description:`Retraso total (en ms) antes de que el componente empiece a fijar progresivamente las letras correctas.
@default 800`,defaultValue:{value:"800",computed:!1}},resolvePerFrame:{required:!1,tsType:{name:"number"},description:`Cantidad de caracteres reales que se "resuelven" por cada ciclo/frame después del delay inicial.
@default 1`,defaultValue:{value:"1",computed:!1}},as:{required:!1,tsType:{name:"ReactElementType",raw:"React.ElementType"},description:`El elemento o etiqueta HTML subyacente para renderizar.
@default "span"`,defaultValue:{value:'"span"',computed:!1}}}};const S={title:"Components/Cryptext",component:r,parameters:{layout:"centered"},tags:["autodocs"]},l={args:{text:"ACCESS GRANTED.",speed:40,delay:500},render:a=>e.jsx("div",{className:"p-8 bg-black border border-green-900 rounded-md lg:w-[400px]",children:e.jsxs("div",{className:"text-green-500 font-mono text-xl tracking-widest uppercase flex flex-col gap-2",children:[e.jsx("span",{children:"> Root Override"}),e.jsx("span",{children:"> Bypassing firewalls..."}),e.jsx("span",{className:"text-emerald-300 font-bold mt-2",children:e.jsx(r,{...a})})]})})},o={args:{text:"THE TRUTH IS OUT THERE",dictionary:"⍙⍣⍜⍨⍓⍝⍢⍟⍱⍲⍭⍡⍐⍗⍌⍚⍯ᚠᚢᚦᚩᚱᚳᚷᚹᚻᚾᛁᛄ",speed:60,delay:1500,resolvePerFrame:1},render:a=>e.jsxs("div",{className:"p-16 bg-neutral-950 flex flex-col items-center justify-center rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden",children:[e.jsx("div",{className:"absolute inset-0 bg-gradient-radial from-transparent to-black opacity-80"}),e.jsx("span",{className:"relative z-10 text-4xl text-amber-500 font-mono tracking-[0.3em] font-light shadow-amber-500 max-w-xl text-center",children:e.jsx(r,{...a})})]})},i={args:{text:"VOYNICH CODEX"},render:()=>{const a=t.useRef(null);return e.jsxs("div",{className:"p-12 text-center flex flex-col items-center justify-center gap-6 bg-slate-100 rounded-2xl text-slate-800",children:[e.jsx("p",{className:"text-sm text-slate-500",children:"Pasa el ratón por encima del botón"}),e.jsxs("button",{onMouseEnter:()=>a.current?.scramble(),className:"px-8 py-4 bg-slate-900 text-white rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-3",children:[e.jsx("svg",{className:"w-5 h-5 text-indigo-400",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"})}),e.jsx(r,{ref:a,text:"VER EXPEDIENTE SECRETO",delay:0,speed:30,resolvePerFrame:2,className:"font-bold tracking-wide"})]})]})}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    text: "ACCESS GRANTED.",
    speed: 40,
    delay: 500
  },
  render: args => <div className="p-8 bg-black border border-green-900 rounded-md lg:w-[400px]">
      <div className="text-green-500 font-mono text-xl tracking-widest uppercase flex flex-col gap-2">
         <span>&gt; Root Override</span>
         <span>&gt; Bypassing firewalls...</span>
         <span className="text-emerald-300 font-bold mt-2">
            <Cryptext {...args} />
         </span>
      </div>
    </div>
}`,...l.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    text: "THE TRUTH IS OUT THERE",
    dictionary: "⍙⍣⍜⍨⍓⍝⍢⍟⍱⍲⍭⍡⍐⍗⍌⍚⍯ᚠᚢᚦᚩᚱᚳᚷᚹᚻᚾᛁᛄ",
    // Símbolos extraños
    speed: 60,
    delay: 1500,
    // Tardará mucho antes de resolverse
    resolvePerFrame: 1 // Resuelve de a 1 letra para mayor dramatismo
  },
  render: args => <div className="p-16 bg-neutral-950 flex flex-col items-center justify-center rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-transparent to-black opacity-80" />
      <span className="relative z-10 text-4xl text-amber-500 font-mono tracking-[0.3em] font-light shadow-amber-500 max-w-xl text-center">
        <Cryptext {...args} />
      </span>
    </div>
}`,...o.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    text: "VOYNICH CODEX"
  },
  render: () => {
    const cryptexRef = useRef<CryptextRef>(null);
    return <div className="p-12 text-center flex flex-col items-center justify-center gap-6 bg-slate-100 rounded-2xl text-slate-800">
        <p className="text-sm text-slate-500">Pasa el ratón por encima del botón</p>
        
        <button onMouseEnter={() => cryptexRef.current?.scramble()} className="px-8 py-4 bg-slate-900 text-white rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-3">
          <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
          <Cryptext ref={cryptexRef} text="VER EXPEDIENTE SECRETO" delay={0} speed={30} resolvePerFrame={2} // Descripta rápido porque es un botón de UI reactiva
        className="font-bold tracking-wide" />
        </button>
      </div>;
  }
}`,...i.parameters?.docs?.source}}};const q=["DefaultHackerTerminal","RunasAlienigena","DecodificarHover"];export{i as DecodificarHover,l as DefaultHackerTerminal,o as RunasAlienigena,q as __namedExportsOrder,S as default};
