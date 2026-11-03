
// Re-export of all components inside Voynich UI
export { Button } from './components/rituals/Button';
export { RingPuzzle } from './components/rituals/RingPuzzle';
export { RadialMenu } from './components/rituals/RadialMenu';
export { StrikeButton } from './components/rituals/StrikeButton';
export { ScribeInput } from './components/rituals/ScribeInput';
export { GraduatedScale } from './components/rituals/GraduatedScale';
export { ConfinementCircle } from './components/rituals/ConfinementCircle';
export { Latch } from './components/rituals/Latch';
export type { LatchProps } from './components/rituals/Latch';

export { RefractiveFractal } from './components/phenomena/RefractiveFractal';
export { CinderDissolve } from './components/phenomena/CinderDissolve';
export { LensMagnifier } from './components/phenomena/LensMagnifier';
export { Alembic } from './components/phenomena/Alembic';
export { AuraLantern } from './components/phenomena/AuraLantern';
export { LeyLineScroll } from './components/phenomena/LeyLineScroll';
export { AbyssParallax } from './components/phenomena/AbyssParallax';
export { OuroborosSpinner } from './components/phenomena/OuroborosSpinner';
export { VellumTornSection } from './components/phenomena/VellumTornSection';
/** @deprecated Usa `RingPuzzle.Rete`. */
export { AstrolabeRete } from './components/phenomena/AstrolabeRete';

export { Cryptext } from './components/artifacts/Cryptext';
export { ScratchCard } from './components/artifacts/ScratchCard';
export { WaxSealShatter } from './components/artifacts/WaxSealShatter';
export { PalimpsestText } from './components/artifacts/PalimpsestText';
export { TarotSpreadGrid } from './components/artifacts/TarotSpreadGrid';
export { InvisibleInkBlock } from './components/artifacts/InvisibleInkBlock';
export { ScribeText } from './components/artifacts/ScribeText';
export { IlluminatedDropcap } from './components/artifacts/IlluminatedDropcap';
export { MarginaliaNotes } from './components/artifacts/MarginaliaNotes';
export { Codex, folioOf } from './components/artifacts/Codex';
export type { CodexProps } from './components/artifacts/Codex';
export { Gloss, GlossProvider, useGloss } from './components/artifacts/Gloss';
export type { GlossProps, GlossProviderProps, GlossOptions } from './components/artifacts/Gloss';

// Primitives y utilidades de composición (para construir tus propios componentes)
export { Surface } from './components/primitives/Surface';
export type { SurfaceProps, SurfaceMaterial } from './components/primitives/Surface';
export { Slot } from './lib/Slot';
export { composeRefs, composeHandlers } from './lib/compose';
export { useRingPuzzle } from './components/rituals/useRingPuzzle';
export { useConfinementCircle } from './components/rituals/useConfinementCircle';
export { useRadialMenu } from './components/rituals/useRadialMenu';
export { useWaxSeal } from './components/artifacts/useWaxSeal';
export { useTarotSpread } from './components/artifacts/useTarotSpread';
export { useDissolveProgress } from './components/phenomena/useDissolveProgress';
export { createPartsContext } from './lib/context';
export type { UseRingPuzzleOptions, UseRingPuzzleReturn, RingBehaviorProps } from './components/rituals/useRingPuzzle';
export type { UseConfinementCircleOptions } from './components/rituals/useConfinementCircle';
export type { UseRadialMenuOptions } from './components/rituals/useRadialMenu';
export type { UseWaxSealOptions } from './components/artifacts/useWaxSeal';
export type { UseTarotSpreadOptions, TarotSpreadType } from './components/artifacts/useTarotSpread';
export type { UseDissolveProgressOptions } from './components/phenomena/useDissolveProgress';

// Utilities
export { useReducedMotion, prefersReducedMotion } from './lib/useReducedMotion';

// Types and Interfaces
export type { ButtonProps, ButtonRootProps, ButtonVariant } from './components/rituals/Button';
export type { RingPuzzleProps, RingPuzzleRef, RingPuzzleResult, Ring, Ring as RingConfig } from './components/rituals/RingPuzzle';
export type { RefractiveFractalProps } from './components/phenomena/RefractiveFractal';
export type { CinderDissolveProps } from './components/phenomena/CinderDissolve';
export type { CryptextProps, CryptextRef } from './components/artifacts/Cryptext';
export type { RadialMenuProps, RadialMenuItem } from './components/rituals/RadialMenu';
export type { ScratchCardProps, ScratchCardRef } from './components/artifacts/ScratchCard';
export type { LensMagnifierProps, LensMagnifierRef } from './components/phenomena/LensMagnifier';
export type { StrikeButtonProps, StrikeButtonRef } from './components/rituals/StrikeButton';
export type { ScribeInputProps } from './components/rituals/ScribeInput';
export type { GraduatedScaleProps } from './components/rituals/GraduatedScale';
export type { ConfinementCircleProps } from './components/rituals/ConfinementCircle';
export type { AlembicProps, AlembicRef } from './components/phenomena/Alembic';
export type { AuraLanternProps } from './components/phenomena/AuraLantern';
export type { LeyLineScrollProps } from './components/phenomena/LeyLineScroll';
export type { AbyssParallaxProps } from './components/phenomena/AbyssParallax';
export type { OuroborosSpinnerProps } from './components/phenomena/OuroborosSpinner';
export type { VellumTornSectionProps } from './components/phenomena/VellumTornSection';
export type { AstrolabeReteProps } from './components/phenomena/AstrolabeRete';
export type { WaxSealShatterProps } from './components/artifacts/WaxSealShatter';
export type { PalimpsestTextProps } from './components/artifacts/PalimpsestText';
export type { TarotSpreadGridProps, TarotCard } from './components/artifacts/TarotSpreadGrid';
export type { InvisibleInkBlockProps } from './components/artifacts/InvisibleInkBlock';
export type { ScribeTextProps, ScribeTextRef } from './components/artifacts/ScribeText';
export type { IlluminatedDropcapProps } from './components/artifacts/IlluminatedDropcap';
export type { MarginaliaNotesProps } from './components/artifacts/MarginaliaNotes';

// Nombres anteriores, conservados una versión para no romper a nadie.
import { GraduatedScale as _GraduatedScale } from './components/rituals/GraduatedScale';
import { ScribeInput as _ScribeInput } from './components/rituals/ScribeInput';
import { StrikeButton as _StrikeButton } from './components/rituals/StrikeButton';
import { Alembic as _Alembic } from './components/phenomena/Alembic';
import { ScribeText as _ScribeText } from './components/artifacts/ScribeText';
import type { GraduatedScaleProps as _GSP } from './components/rituals/GraduatedScale';
import type { ScribeInputProps as _SIP } from './components/rituals/ScribeInput';
import type { StrikeButtonProps as _SBP, StrikeButtonRef as _SBR } from './components/rituals/StrikeButton';
import type { AlembicProps as _AP, AlembicRef as _AR } from './components/phenomena/Alembic';
import type { ScribeTextProps as _STP, ScribeTextRef as _STR } from './components/artifacts/ScribeText';
/** @deprecated Usa `GraduatedScale`. */ export const FrequencyTuner = _GraduatedScale;
/** @deprecated Usa `ScribeInput`. */ export const IncantationInput = _ScribeInput;
/** @deprecated Usa `StrikeButton`. */ export const SacrificialButton = _StrikeButton;
/** @deprecated Usa `Alembic`. */ export const HomunculusVessel = _Alembic;
/** @deprecated Usa `ScribeText`. */ export const TypewriterStutter = _ScribeText;
/** @deprecated Usa `GraduatedScaleProps`. */ export type FrequencyTunerProps = _GSP;
/** @deprecated Usa `ScribeInputProps`. */ export type IncantationInputProps = _SIP;
/** @deprecated Usa `StrikeButtonProps`. */ export type SacrificialButtonProps = _SBP;
/** @deprecated Usa `StrikeButtonRef`. */ export type SacrificialButtonRef = _SBR;
/** @deprecated Usa `AlembicProps`. */ export type HomunculusVesselProps = _AP;
/** @deprecated Usa `AlembicRef`. */ export type HomunculusVesselRef = _AR;
/** @deprecated Usa `ScribeTextProps`. */ export type TypewriterStutterProps = _STP;
/** @deprecated Usa `ScribeTextRef`. */ export type TypewriterStutterRef = _STR;
