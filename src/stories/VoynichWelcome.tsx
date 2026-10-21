import React, { useRef, useMemo, useEffect, useState, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════
   CUSTOM SHADERS — Hand-crafted for the Voynich feel
   ═══════════════════════════════════════════════════ */

const dustVertexShader = `
  attribute float aSize;
  attribute float aAlpha;
  attribute float aPhase;
  uniform float uTime;
  uniform float uPixelRatio;
  varying float vAlpha;

  void main() {
    vec3 pos = position;
    // Organic drift — each particle has unique sinusoidal movement
    float t = uTime * 0.15 + aPhase;
    pos.x += sin(t * 1.3 + pos.y * 0.4) * 0.12;
    pos.y += cos(t * 0.9 + pos.x * 0.3) * 0.08;
    pos.z += sin(t * 0.7 + pos.z * 0.6) * 0.06;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    // Distance-based attenuation
    float dist = -mvPosition.z;
    float depthFade = smoothstep(12.0, 3.0, dist);
    vAlpha = aAlpha * depthFade;

    gl_PointSize = aSize * uPixelRatio * (180.0 / dist);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const dustFragmentShader = `
  varying float vAlpha;
  uniform vec3 uColor;
  uniform vec3 uColorDim;

  void main() {
    // Soft circular gradient with falloff
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float strength = 1.0 - smoothstep(0.0, 0.5, d);
    strength = pow(strength, 1.8);

    // Blend warm to cool based on alpha
    vec3 color = mix(uColorDim, uColor, strength * 0.7 + 0.3);
    gl_FragColor = vec4(color, strength * vAlpha);
  }
`;

/* ═══════════════════════════════════════════════════
   DUST NEBULA — Shader-based particles with glow
   ═══════════════════════════════════════════════════ */
function DustNebula({ count = 900 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null!);

  const { positions, sizes, alphas, phases } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    const al = new Float32Array(count);
    const ph = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Distribute in a soft ellipsoid — denser at center
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.pow(Math.random(), 0.6) * 7;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta) * 1.3;
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.8;
      pos[i * 3 + 2] = r * Math.cos(phi) * 0.5 - 1;

      sz[i] = Math.random() * 3.5 + 0.4;
      al[i] = Math.random() * 0.5 + 0.08;
      ph[i] = Math.random() * Math.PI * 2;
    }
    return { positions: pos, sizes: sz, alphas: al, phases: ph };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uColor: { value: new THREE.Color("#d4aa50") },
      uColorDim: { value: new THREE.Color("#5a3e1a") },
    }),
    []
  );

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} count={count} />
        <bufferAttribute attach="attributes-aAlpha" args={[alphas, 1]} count={count} />
        <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} count={count} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={dustVertexShader}
        fragmentShader={dustFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ═══════════════════════════════════════════════════
   ALCHEMICAL SIGIL — Multi-ring rotating instrument
   ═══════════════════════════════════════════════════ */
function AlchemicalSigil() {
  const outerRef = useRef<THREE.Group>(null!);
  const innerRef = useRef<THREE.Group>(null!);
  const coreRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    outerRef.current.rotation.z = t * 0.04;
    innerRef.current.rotation.z = -t * 0.065;
    coreRef.current.rotation.z = t * 0.09;
    // Subtle tilt breathing
    outerRef.current.rotation.x = Math.sin(t * 0.08) * 0.04;
    outerRef.current.rotation.y = Math.cos(t * 0.06) * 0.03;
  });

  const createRing = (radius: number, segments: number) => {
    const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, Math.PI * 2, false, 0);
    return new THREE.BufferGeometry().setFromPoints(
      curve.getPoints(segments).map((p) => new THREE.Vector3(p.x, p.y, 0))
    );
  };

  const createTicks = (
    innerR: number,
    outerR: number,
    count: number,
    majorEvery: number,
    majorLength: number
  ) => {
    const geos: { geo: THREE.BufferGeometry; major: boolean }[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const isMajor = i % majorEvery === 0;
      const iR = isMajor ? innerR - majorLength : innerR;
      const oR = outerR;
      const geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(Math.cos(angle) * iR, Math.sin(angle) * iR, 0),
        new THREE.Vector3(Math.cos(angle) * oR, Math.sin(angle) * oR, 0),
      ]);
      geos.push({ geo, major: isMajor });
    }
    return geos;
  };

  // Outer ring — astronomical dial
  const outerRing = useMemo(() => createRing(3.2, 256), []);
  const outerRing2 = useMemo(() => createRing(3.35, 256), []);
  const outerTicks = useMemo(() => createTicks(3.2, 3.5, 120, 10, 0.15), []);

  // Inner ring — zodiacal band
  const innerRing = useMemo(() => createRing(2.4, 192), []);
  const innerRing2 = useMemo(() => createRing(2.2, 192), []);
  const innerTicks = useMemo(() => createTicks(2.2, 2.4, 72, 6, 0.1), []);

  // Core — compass rose lines
  const coreLines = useMemo(() => {
    const lines: THREE.BufferGeometry[] = [];
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const len = i % 3 === 0 ? 1.6 : i % 2 === 0 ? 1.2 : 0.8;
      lines.push(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(Math.cos(angle) * len, Math.sin(angle) * len, 0),
        ])
      );
    }
    return lines;
  }, []);

  const coreCircle = useMemo(() => createRing(0.35, 64), []);
  const coreCircle2 = useMemo(() => createRing(1.0, 96), []);

  // Small decorative dots at cardinal points
  const cardinalDots = useMemo(() => {
    return [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle) => {
      return new THREE.Vector3(Math.cos(angle) * 2.8, Math.sin(angle) * 2.8, 0);
    });
  }, []);

  return (
    <group position={[0, 0, -2]}>
      {/* OUTER RING */}
      <group ref={outerRef}>
        <line geometry={outerRing}>
          <lineBasicMaterial color="#7a5c2e" transparent opacity={0.22} />
        </line>
        <line geometry={outerRing2}>
          <lineBasicMaterial color="#6b4f24" transparent opacity={0.12} />
        </line>
        {outerTicks.map(({ geo, major }, i) => (
          <line key={`ot-${i}`} geometry={geo}>
            <lineBasicMaterial
              color={major ? "#a88642" : "#6b4f24"}
              transparent
              opacity={major ? 0.28 : 0.08}
            />
          </line>
        ))}
        {/* Cardinal dots */}
        {cardinalDots.map((pos, i) => (
          <mesh key={`cd-${i}`} position={pos}>
            <circleGeometry args={[0.03, 16]} />
            <meshBasicMaterial color="#a88642" transparent opacity={0.35} />
          </mesh>
        ))}
      </group>

      {/* INNER RING */}
      <group ref={innerRef}>
        <line geometry={innerRing}>
          <lineBasicMaterial color="#8b6a3e" transparent opacity={0.18} />
        </line>
        <line geometry={innerRing2}>
          <lineBasicMaterial color="#6b5530" transparent opacity={0.1} />
        </line>
        {innerTicks.map(({ geo, major }, i) => (
          <line key={`it-${i}`} geometry={geo}>
            <lineBasicMaterial
              color={major ? "#a88642" : "#6b5530"}
              transparent
              opacity={major ? 0.22 : 0.06}
            />
          </line>
        ))}
      </group>

      {/* CORE */}
      <group ref={coreRef}>
        {coreLines.map((geo, i) => (
          <line key={`cl-${i}`} geometry={geo}>
            <lineBasicMaterial
              color="#8b6a3e"
              transparent
              opacity={i % 3 === 0 ? 0.2 : 0.07}
            />
          </line>
        ))}
        <line geometry={coreCircle}>
          <lineBasicMaterial color="#a88642" transparent opacity={0.25} />
        </line>
        <line geometry={coreCircle2}>
          <lineBasicMaterial color="#6b5530" transparent opacity={0.1} />
        </line>
        {/* Center dot */}
        <mesh>
          <circleGeometry args={[0.02, 16]} />
          <meshBasicMaterial color="#c9a95f" transparent opacity={0.4} />
        </mesh>
      </group>
    </group>
  );
}

/* ═══════════════════════════════════════════════════
   SUBTLE MOUSE PARALLAX — Adds depth to the scene
   ═══════════════════════════════════════════════════ */
function MouseParallax() {
  const { camera } = useThree();
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      target.current.x = (e.clientX / window.innerWidth - 0.5) * 0.4;
      target.current.y = -(e.clientY / window.innerHeight - 0.5) * 0.3;
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  useFrame(() => {
    camera.position.x += (target.current.x - camera.position.x) * 0.015;
    camera.position.y += (target.current.y - camera.position.y) * 0.015;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

/* ═══════════════════════════════════════════════════
   SCENE COMPOSITION
   ═══════════════════════════════════════════════════ */
function Scene() {
  return (
    <>
      <color attach="background" args={["#040301"]} />
      <fog attach="fog" args={["#040301", 4, 16]} />
      <DustNebula />
      <AlchemicalSigil />
      <MouseParallax />
    </>
  );
}

/* ═══════════════════════════════════════════════════
   COMPONENT DATA — Sourced from actual project
   ═══════════════════════════════════════════════════ */
const CATEGORIES = [
  {
    title: "Phenomena",
    subtitle: "Visual Effects & Environmental Layers",
    items: [
      "AbyssParallax",
      "AuraLantern",
      "CinderDissolve",
      "HomunculusVessel",
      "LensMagnifier",
      "LeyLineScroll",
      "OuroborosSpinner",
      "RefractiveFractal",
      "VellumTornSection",
    ],
  },
  {
    title: "Rituals",
    subtitle: "Interactive Controls & Input Mechanisms",
    items: [
      "Button",
      "ConfinementCircle",
      "FrequencyTuner",
      "IncantationInput",
      "RadialMenu",
      "RingPuzzle",
      "SacrificialButton",
    ],
  },
  {
    title: "Artifacts",
    subtitle: "Content Displays & Data Revelation",
    items: [
      "Cryptext",
      "IlluminatedDropcap",
      "InvisibleInkBlock",
      "MarginaliaNotes",
      "PalimpsestText",
      "ScratchCard",
      "TarotSpreadGrid",
      "TypewriterStutter",
      "WaxSealShatter",
    ],
  },
];

/* ═══════════════════════════════════════════════════
   ANIMATED TEXT HELPERS
   ═══════════════════════════════════════════════════ */
function FadeIn({
  children,
  delay = 0,
  duration = 1200,
  y = 12,
  style = {},
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  style?: React.CSSProperties;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : `translateY(${y}px)`,
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   CATEGORY CARD COMPONENT
   ═══════════════════════════════════════════════════ */
function CategoryCard({
  cat,
  index,
}: {
  cat: (typeof CATEGORIES)[number];
  index: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <FadeIn delay={900 + index * 150} y={20}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          padding: "1.5rem 1.6rem 1.3rem",
          background: hovered
            ? "rgba(20,14,8,0.85)"
            : "rgba(10,7,4,0.65)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: `1px solid rgba(139,106,62,${hovered ? 0.3 : 0.08})`,
          minWidth: "200px",
          maxWidth: "240px",
          transition:
            "border-color 0.5s ease, background 0.5s ease, box-shadow 0.5s ease",
          cursor: "default",
          position: "relative",
          overflow: "hidden",
          boxShadow: hovered
            ? "0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(201,169,95,0.06)"
            : "0 2px 20px rgba(0,0,0,0.2)",
        }}
      >
        {/* Top accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "10%",
            right: "10%",
            height: "1px",
            background: `linear-gradient(90deg, transparent, rgba(201,169,95,${hovered ? 0.35 : 0.1}), transparent)`,
            transition: "background 0.5s ease",
          }}
        />

        {/* Title row */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            marginBottom: "0.4rem",
          }}
        >
          <span
            style={{
              fontFamily: "'IM Fell English', Georgia, serif",
              fontSize: "1.05rem",
              color: hovered ? "#d4b76a" : "#c8b98a",
              transition: "color 0.4s ease",
              letterSpacing: "0.02em",
            }}
          >
            {cat.title}
          </span>
          <span
            style={{
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              fontSize: "0.6rem",
              color: hovered ? "#7a6b4e" : "#3d2e1a",
              transition: "color 0.4s ease",
              letterSpacing: "0.05em",
            }}
          >
            {String(cat.items.length).padStart(2, "0")}
          </span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontFamily: "'IM Fell English', Georgia, serif",
            fontSize: "0.68rem",
            color: "#5a4d38",
            lineHeight: 1.5,
            marginBottom: "0.9rem",
            fontStyle: "italic",
          }}
        >
          {cat.subtitle}
        </div>

        {/* Thin separator */}
        <div
          style={{
            height: "1px",
            background: `linear-gradient(90deg, rgba(139,106,62,${hovered ? 0.2 : 0.06}), transparent)`,
            marginBottom: "0.7rem",
            transition: "background 0.5s ease",
          }}
        />

        {/* Component list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
          {cat.items.map((item, j) => (
            <span
              key={j}
              style={{
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                fontSize: "0.55rem",
                color: hovered ? "#6b5a3a" : "#3d2e1a",
                letterSpacing: "0.04em",
                transition: `color 0.4s ease ${j * 30}ms`,
                lineHeight: 1.6,
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </FadeIn>
  );
}

/* ═══════════════════════════════════════════════════
   HTML OVERLAY — Layered on top of the Three.js scene
   ═══════════════════════════════════════════════════ */
function Overlay() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 10,
      }}
    >
      {/* ─── Vignette overlay ─── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 45%, transparent 30%, rgba(4,3,1,0.55) 70%, rgba(4,3,1,0.9) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* ─── Content ─── */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Superscript label */}
        <FadeIn delay={200} y={8}>
          <div
            style={{
              fontSize: "0.58rem",
              letterSpacing: "0.55em",
              textTransform: "uppercase",
              color: "#5a4d38",
              marginBottom: "1rem",
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              fontWeight: 400,
            }}
          >
            Component Library
          </div>
        </FadeIn>

        {/* Title */}
        <FadeIn delay={400} y={16} duration={1600}>
          <h1
            style={{
              fontFamily: "'IM Fell English', Georgia, serif",
              fontSize: "4rem",
              fontWeight: 400,
              color: "#c9a95f",
              margin: 0,
              lineHeight: 1.05,
              textShadow:
                "0 0 80px rgba(201,169,95,0.12), 0 0 160px rgba(201,169,95,0.04)",
              textAlign: "center",
              letterSpacing: "0.03em",
            }}
          >
            Voynich UI
          </h1>
        </FadeIn>

        {/* Ornamental divider */}
        <FadeIn delay={650} y={0} duration={2000}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.8rem",
              margin: "1rem 0 1.2rem",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "1px",
                background:
                  "linear-gradient(90deg, transparent, rgba(139,106,62,0.5))",
              }}
            />
            <div
              style={{
                width: "4px",
                height: "4px",
                background: "#8b6a3e",
                borderRadius: "50%",
                opacity: 0.5,
              }}
            />
            <div
              style={{
                width: "40px",
                height: "1px",
                background:
                  "linear-gradient(90deg, rgba(139,106,62,0.5), transparent)",
              }}
            />
          </div>
        </FadeIn>

        {/* Tagline */}
        <FadeIn delay={750}>
          <p
            style={{
              fontFamily: "'IM Fell English', Georgia, serif",
              fontSize: "0.92rem",
              color: "#6b5a3a",
              maxWidth: "420px",
              lineHeight: 1.7,
              margin: "0 auto",
              textAlign: "center",
              fontStyle: "italic",
            }}
          >
            A design system drawn from aged vellum,
            <br />
            alchemical inks, and arcane geometries.
          </p>
        </FadeIn>

        {/* Category cards */}
        <div
          style={{
            display: "flex",
            gap: "1px",
            marginTop: "2.5rem",
            pointerEvents: "auto",
          }}
        >
          {CATEGORIES.map((cat, i) => (
            <CategoryCard key={i} cat={cat} index={i} />
          ))}
        </div>
      </div>

      {/* ─── Bottom metadata bar ─── */}
      <FadeIn delay={1500} y={6} style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1rem 2rem",
            borderTop: "1px solid rgba(139,106,62,0.05)",
          }}
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.5rem",
              color: "#2a1d12",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            React 19 · Tailwind · GSAP · Three.js
          </span>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.5rem",
              color: "#2a1d12",
              letterSpacing: "0.15em",
            }}
          >
            v0.0.1 · 25 Components
          </span>
        </div>
      </FadeIn>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN EXPORT — Full-bleed Three.js welcome page
   ═══════════════════════════════════════════════════ */
export function VoynichWelcome() {
  return (
    <div
      style={{
        position: "relative",
        width: "calc(100% + 4rem)",
        height: "94vh",
        minHeight: "600px",
        background: "#040301",
        overflow: "hidden",
        margin: "-2rem",
      }}
    >
      {/* Three.js canvas */}
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        style={{ position: "absolute", inset: 0 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        dpr={[1, 2]}
      >
        <Scene />
      </Canvas>

      {/* Grain texture overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E")`,
          pointerEvents: "none",
          zIndex: 5,
          mixBlendMode: "overlay",
          opacity: 0.8,
        }}
      />

      {/* HTML overlay */}
      <Overlay />
    </div>
  );
}
