import{j as e}from"./jsx-runtime-u17CrQMm.js";import{R as q,r as f}from"./iframe-D5S5KG8a.js";import{c as x}from"./utils-IyxL_b2c.js";import"./preload-helper-PPVm8Dsz.js";const t=q.forwardRef(({as:a="div",complexity:r=5,refractionFactor:b=30,frequency:n=.02,seed:g=0,animate:h=!1,speed:v=10,className:y,children:w,style:N,...j},F)=>{const p=`fractal-${f.useId().replace(/:/g,"")}`;return e.jsxs(a,{ref:F,className:x("relative overflow-visible",y),style:{filter:`url(#${p})`,...N},...j,children:[e.jsx("svg",{className:"absolute w-[0px] h-[0px] pointer-events-none -left-[9999px]","aria-hidden":"true",children:e.jsx("defs",{children:e.jsxs("filter",{id:p,x:"-100%",y:"-100%",width:"300%",height:"300%",colorInterpolationFilters:"sRGB",children:[e.jsx("feTurbulence",{type:"fractalNoise",baseFrequency:n,numOctaves:r,seed:g,result:"noise",children:h&&e.jsx("animate",{attributeName:"baseFrequency",values:`${n}; ${Number(n)*1.5}; ${n}`,dur:`${v}s`,repeatCount:"indefinite"})}),e.jsx("feDisplacementMap",{in:"SourceGraphic",in2:"noise",scale:b,xChannelSelector:"R",yChannelSelector:"G",result:"displacement"})]})})}),w]})});t.displayName="RefractiveFractal";t.__docgenInfo={description:`\`RefractiveFractal\`

Un componente envoltura polimórfico que inyecta filtros nativos SVG avanzados (feTurbulence y feDisplacementMap)
a cualquier contenido que le pongas dentro (textos, degradados o imágenes).
Perfecto para crear fluidos abstractos con TailwindCSS, texturas de lienzo al óleo, manchas orgánicas y botones amorfos que reaccionan.

Está construido sobre \`forwardRef\` para tener control del DOM directo.`,methods:[],displayName:"RefractiveFractal",props:{as:{required:!1,tsType:{name:"ReactElementType",raw:"React.ElementType"},description:`Permite inyectar un nodo subyacente personalizado.
Útil para accesibilidad o integración con librerías de enrutamiento/animación.
@default 'div'
@example as="button" // Renderiza una etiqueta boton
@example as={motion.div} // Framer motion wrap`,defaultValue:{value:'"div"',computed:!1}},complexity:{required:!1,tsType:{name:"number"},description:`Determina la resolución y el nivel de detalle matemático del ruido de perlin generado.
@default 5
@range Rango recomendado: 1 (Formas suaves/blandas) a 10 (Texturas rugosas/Mandelbrot pesado)`,defaultValue:{value:"5",computed:!1}},refractionFactor:{required:!1,tsType:{name:"number"},description:`La escala de la distorsión, fuerza con la que la onda "rompe" la silueta del hijo.
Valores altos causan derrames de color y formas abstractas extremas.
@default 30
@range Valores útiles: 0 a 300+`,defaultValue:{value:"30",computed:!1}},frequency:{required:!1,tsType:{name:"union",raw:"string | number",elements:[{name:"string"},{name:"number"}]},description:`Escala de acercamiento a la ecuación generadora fractal.
Un valor bajo crea manchas gigantes; un valor alto crea un granulado apretado o rasguños.
Puedes pasar dos valores en string como "X Y" para crear vetas horizontales/verticales asimétricas.
@default 0.02
@example 0.005 // Distorsión a macro-escala fluida.
@example "0.2 0.001" // Ruido tipo fallo analógico (glitch o madera).`,defaultValue:{value:"0.02",computed:!1}},seed:{required:!1,tsType:{name:"number"},description:`Semilla lógica del random mathizer. Garantiza que obtendrás exactamente
el mismo patrón visual para los mismos valores. O te permite cambiar la identidad si se repite.
@default 0`,defaultValue:{value:"0",computed:!1}},animate:{required:!1,tsType:{name:"boolean"},description:"Define si el fractal debe mutar con el tiempo.\nAl habilitarse, inyecta un tag `<animate>` optimizado por hardware manipulando el atributo `baseFrequency`.\n@default false",defaultValue:{value:"false",computed:!1}},speed:{required:!1,tsType:{name:"number"},description:"Si `animate` está activo, establece la duración (en segundos) de un ciclo respiratorio completo.\n@default 10",defaultValue:{value:"10",computed:!1}}}};const T={title:"Effects/RefractiveFractal",component:t,parameters:{layout:"centered"},tags:["autodocs"]},s={args:{complexity:6,refractionFactor:120,frequency:.015,animate:!0,speed:15},render:a=>e.jsxs("div",{className:"relative w-[500px] h-[500px] flex items-center justify-center bg-slate-950 rounded-3xl overflow-hidden border border-slate-800",children:[e.jsx(t,{...a,className:"absolute inset-0 m-auto w-[350px] h-[350px] bg-gradient-to-tr from-rose-500 via-fuchsia-600 to-indigo-500 rounded-full blur-[20px]"}),e.jsxs("div",{className:"relative z-10 text-center pointer-events-none",children:[e.jsx("h2",{className:"text-4xl font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]",children:"Fluido Dinámico"}),e.jsx("p",{className:"text-slate-300 drop-shadow-md",children:"Patrón derivado tipo Mandelbrot"})]})]})},o={args:{},render:()=>{const[a,r]=f.useState(!1);return e.jsx("div",{className:"p-20 bg-[#0a0a0a] rounded-3xl flex items-center justify-center",children:e.jsxs("button",{className:"relative inline-flex items-center justify-center border-none bg-transparent outline-none cursor-pointer group",onMouseEnter:()=>r(!0),onMouseLeave:()=>r(!1),children:[e.jsx(t,{className:x("absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-700 ease-out",a?"scale-125":"scale-100"),style:{borderRadius:"2rem"},complexity:4,refractionFactor:a?60:15,frequency:.03,animate:!0,speed:2}),e.jsx("span",{className:"relative z-10 px-12 py-5 text-white font-mono font-bold text-xl tracking-[0.2em] pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]",children:"EJECUTAR_SEC"})]})})}},i={args:{complexity:4,refractionFactor:40,frequency:.02,seed:42},render:a=>e.jsx(t,{...a,className:"w-[400px] h-[500px] rounded-2xl overflow-hidden shadow-2xl",children:e.jsx("img",{src:"https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2464",alt:"Abstract",className:"w-full h-full object-cover transition-transform duration-1000 hover:scale-110"})})},l={args:{complexity:10,refractionFactor:200,frequency:"0.2 0.001",animate:!0,speed:5},render:a=>e.jsx(t,{...a,className:"w-[500px] h-[300px] bg-gradient-to-r from-lime-400 to-green-900 rounded-xl"})},c={args:{complexity:3,refractionFactor:12,frequency:.04,animate:!0,speed:3},render:a=>e.jsx("div",{className:"flex items-center justify-center p-24 bg-black rounded-xl",children:e.jsxs(t,{...a,className:"text-center",children:[e.jsx("h1",{className:"text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 w-full inline-block pb-4",children:"LIQUID"}),e.jsx("h1",{className:"text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 mt-[-20px] w-full inline-block",children:"STATE"})]})})},d={args:{complexity:1,refractionFactor:40,frequency:"0.5 0.0001",animate:!0,speed:.5},render:a=>e.jsxs("div",{className:"relative p-12 bg-zinc-950 flex flex-col items-center gap-6 rounded-md border border-zinc-800",children:[e.jsx(t,{...a,children:e.jsx("div",{className:"text-6xl font-mono font-bold text-red-500 tracking-tighter",children:"SYSTEM_FAILURE"})}),e.jsx(t,{...a,refractionFactor:60,frequency:"0.8 0.0001",speed:.2,children:e.jsx("img",{src:"https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2000",className:"w-[400px] h-[250px] object-cover filter grayscale contrast-150"})})]})},m={args:{complexity:8,refractionFactor:15,frequency:.8},render:a=>e.jsxs("div",{className:"relative w-[500px] h-[400px] flex items-center justify-center rounded-2xl overflow-hidden shadow-2xl",children:[e.jsx("img",{src:"https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2000",className:"absolute inset-0 w-full h-full object-cover",alt:"Background"}),e.jsxs("div",{className:"relative z-10 w-[80%] h-[70%] bg-white/10 backdrop-blur-md border border-white/30 rounded-xl flex items-center justify-center overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)]",children:[e.jsx(t,{...a,className:"absolute inset-0 w-[120%] h-[120%] -left-[10%] -top-[10%] opacity-50 backdrop-blur-sm"}),e.jsxs("div",{className:"relative z-20 text-center",children:[e.jsx("h3",{className:"text-2xl text-white font-light tracking-widest drop-shadow-md",children:"FROSTED"}),e.jsx("p",{className:"text-white/70 font-mono text-sm mt-1",children:"G L A S S"})]})]})]})},u={args:{complexity:10,refractionFactor:5,frequency:.15,seed:123,animate:!1},render:a=>e.jsxs("div",{className:"p-16 bg-[#eaddc4] max-w-sm border-[12px] border-[#311b0e] shadow-[inset_0_0_80px_rgba(100,50,20,0.2)] rounded-sm relative overflow-hidden flex flex-col gap-6",children:[e.jsx("div",{className:"absolute inset-0 bg-[radial-gradient(circle,_transparent_30%,_#c6a982_150%)] pointer-events-none mix-blend-multiply opacity-60"}),e.jsxs(t,{...a,className:"relative z-10",children:[e.jsx("h2",{className:"text-5xl font-serif text-[#2a1309] font-bold tracking-tight mb-2",children:"Codex Vol. IV"}),e.jsx("p",{className:"text-xl font-serif text-[#3b1f11] leading-relaxed text-justify opacity-90",children:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor."}),e.jsx("div",{className:"my-6 w-16 h-16 bg-[#781f14] rounded-full mx-auto opacity-80 mix-blend-multiply flex items-center justify-center",children:e.jsx("span",{className:"text-[#eaddc4] text-xs font-serif italic",children:"Secreto"})}),e.jsx("p",{className:"text-lg font-serif text-[#3b1f11] font-bold italic tracking-widest text-center",children:"Incipit Vita Nova"})]})]})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    complexity: 6,
    refractionFactor: 120,
    frequency: 0.015,
    animate: true,
    speed: 15
  },
  render: args => <div className="relative w-[500px] h-[500px] flex items-center justify-center bg-slate-950 rounded-3xl overflow-hidden border border-slate-800">
      <RefractiveFractal {...args}
    // Creamos una bola base con degradados múltiples. El componente la distorsionará hasta el caos.
    className="absolute inset-0 m-auto w-[350px] h-[350px] bg-gradient-to-tr from-rose-500 via-fuchsia-600 to-indigo-500 rounded-full blur-[20px]" />
      <div className="relative z-10 text-center pointer-events-none">
        <h2 className="text-4xl font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
          Fluido Dinámico
        </h2>
        <p className="text-slate-300 drop-shadow-md">
          Patrón derivado tipo Mandelbrot
        </p>
      </div>
    </div>
}`,...s.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {},
  render: () => {
    const [hover, setHover] = useState(false);
    return <div className="p-20 bg-[#0a0a0a] rounded-3xl flex items-center justify-center">
        <button className="relative inline-flex items-center justify-center border-none bg-transparent outline-none cursor-pointer group" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
          {/* Aquí el botón *es* el fractal directamente. Su forma está definida por el ruido */}
          <RefractiveFractal className={cn("absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-700 ease-out", hover ? "scale-125" : "scale-100")} style={{
          borderRadius: "2rem"
        }} complexity={4}
        // Aumentamos el factor considerablemente en hover para que se deforme y rompa sus bordes
        refractionFactor={hover ? 60 : 15} frequency={0.03} animate={true} speed={2} />

          {/* El texto va superpuesto para que sea legible y no sea distorsionado por el filtro SVG */}
          <span className="relative z-10 px-12 py-5 text-white font-mono font-bold text-xl tracking-[0.2em] pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
            EJECUTAR_SEC
          </span>
        </button>
      </div>;
  }
}`,...o.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    complexity: 4,
    refractionFactor: 40,
    frequency: 0.02,
    seed: 42
  },
  render: args => <RefractiveFractal {...args} className="w-[400px] h-[500px] rounded-2xl overflow-hidden shadow-2xl">
      <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2464" alt="Abstract" className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110" />
    </RefractiveFractal>
}`,...i.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    complexity: 10,
    // Máxima complejidad
    refractionFactor: 200,
    // Hiper distorsion
    frequency: "0.2 0.001",
    // Frecuencia asimétrica (estira el ruido vertical u horizontalmente)
    animate: true,
    speed: 5
  },
  render: args => <RefractiveFractal {...args} className="w-[500px] h-[300px] bg-gradient-to-r from-lime-400 to-green-900 rounded-xl" />
}`,...l.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    complexity: 3,
    refractionFactor: 12,
    // Factor bajo para que el texto siga siendo (más o menos) legible
    frequency: 0.04,
    animate: true,
    speed: 3
  },
  render: args => <div className="flex items-center justify-center p-24 bg-black rounded-xl">
      <RefractiveFractal {...args} className="text-center">
        <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 w-full inline-block pb-4">
          LIQUID
        </h1>
        <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 mt-[-20px] w-full inline-block">
          STATE
        </h1>
      </RefractiveFractal>
    </div>
}`,...c.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    complexity: 1,
    // Baja complejidad para que sean bloques sólidos
    refractionFactor: 40,
    frequency: "0.5 0.0001",
    // Frecuencia X altísima y Y bajísima crea líneas horizontales de ruido
    animate: true,
    speed: 0.5 // Muy rápido
  },
  render: args => <div className="relative p-12 bg-zinc-950 flex flex-col items-center gap-6 rounded-md border border-zinc-800">
      <RefractiveFractal {...args}>
        <div className="text-6xl font-mono font-bold text-red-500 tracking-tighter">
          SYSTEM_FAILURE
        </div>
      </RefractiveFractal>
      <RefractiveFractal {...args} refractionFactor={60} frequency={"0.8 0.0001"} speed={0.2}>
        <img src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2000" className="w-[400px] h-[250px] object-cover filter grayscale contrast-150" />
      </RefractiveFractal>
    </div>
}`,...d.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    complexity: 8,
    refractionFactor: 15,
    // Poca refracción, simulando granulado fino del cristal
    frequency: 0.8 // Frecuencia MUY alta para hacer el ruido diminuto
  },
  render: args => <div className="relative w-[500px] h-[400px] flex items-center justify-center rounded-2xl overflow-hidden shadow-2xl">
      {/* Fondo nítido */}
      <img src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2000" className="absolute inset-0 w-full h-full object-cover" alt="Background" />

      {/* El panel de cristal encima */}
      <div className="relative z-10 w-[80%] h-[70%] bg-white/10 backdrop-blur-md border border-white/30 rounded-xl flex items-center justify-center overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        {/* El fractal que se aplica *solamente* al div envolvente simulando la textura física en la superficie del cristal */}
        <RefractiveFractal {...args} className="absolute inset-0 w-[120%] h-[120%] -left-[10%] -top-[10%] opacity-50 backdrop-blur-sm" />

        <div className="relative z-20 text-center">
          <h3 className="text-2xl text-white font-light tracking-widest drop-shadow-md">
            FROSTED
          </h3>
          <p className="text-white/70 font-mono text-sm mt-1">G L A S S</p>
        </div>
      </div>
    </div>
}`,...m.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    complexity: 10,
    // Máxima rugosidad en los bordes
    refractionFactor: 5,
    // Muy poca desviación espacial, solo lo suficiente para comerse los perfiles
    frequency: 0.15,
    // Frecuencia alta para que simule el sangrado microscópico capilar del papel húmedo
    seed: 123,
    animate: false
  },
  render: args => <div className="p-16 bg-[#eaddc4] max-w-sm border-[12px] border-[#311b0e] shadow-[inset_0_0_80px_rgba(100,50,20,0.2)] rounded-sm relative overflow-hidden flex flex-col gap-6">
      {/* Decoloración falsa del papel */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,_transparent_30%,_#c6a982_150%)] pointer-events-none mix-blend-multiply opacity-60" />

      {/* Nuestro componente simulando la sangría de la pluma de un escriba */}
      <RefractiveFractal {...args} className="relative z-10">
        <h2 className="text-5xl font-serif text-[#2a1309] font-bold tracking-tight mb-2">
          Codex Vol. IV
        </h2>
        <p className="text-xl font-serif text-[#3b1f11] leading-relaxed text-justify opacity-90">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui
          mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor
          neque eu tellus rhoncus ut eleifend nibh porttitor.
        </p>

        {/* Un elemento gráfico extra también distorsionado como sello de cera/tinta seca */}
        <div className="my-6 w-16 h-16 bg-[#781f14] rounded-full mx-auto opacity-80 mix-blend-multiply flex items-center justify-center">
          <span className="text-[#eaddc4] text-xs font-serif italic">
            Secreto
          </span>
        </div>

        <p className="text-lg font-serif text-[#3b1f11] font-bold italic tracking-widest text-center">
          Incipit Vita Nova
        </p>
      </RefractiveFractal>
    </div>
}`,...u.parameters?.docs?.source}}};const z=["ManchaFondo","BotonInteractivo","DistorsionImagen","TexturaAlien","TextoLiquido","GlitchEffect","CristalEsmerilado","TintaManuscrito"];export{o as BotonInteractivo,m as CristalEsmerilado,i as DistorsionImagen,d as GlitchEffect,s as ManchaFondo,c as TextoLiquido,l as TexturaAlien,u as TintaManuscrito,z as __namedExportsOrder,T as default};
