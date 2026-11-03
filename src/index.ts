
// Re-export of all components inside Voynich UI
export { Button } from './components/rituals/Button';
export { RingPuzzle } from './components/rituals/RingPuzzle';
export { RadialMenu } from './components/rituals/RadialMenu';
export { SacrificialButton } from './components/rituals/SacrificialButton';
export { IncantationInput } from './components/rituals/IncantationInput';
export { FrequencyTuner } from './components/rituals/FrequencyTuner';
export { ConfinementCircle } from './components/rituals/ConfinementCircle';

export { RefractiveFractal } from './components/phenomena/RefractiveFractal';
export { CinderDissolve } from './components/phenomena/CinderDissolve';
export { LensMagnifier } from './components/phenomena/LensMagnifier';
export { HomunculusVessel } from './components/phenomena/HomunculusVessel';
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
export { TypewriterStutter } from './components/artifacts/TypewriterStutter';
export { IlluminatedDropcap } from './components/artifacts/IlluminatedDropcap';
export { MarginaliaNotes } from './components/artifacts/MarginaliaNotes';

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
export type { SacrificialButtonProps } from './components/rituals/SacrificialButton';
export type { IncantationInputProps } from './components/rituals/IncantationInput';
export type { FrequencyTunerProps } from './components/rituals/FrequencyTuner';
export type { ConfinementCircleProps } from './components/rituals/ConfinementCircle';
export type { HomunculusVesselProps } from './components/phenomena/HomunculusVessel';
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
export type { TypewriterStutterProps } from './components/artifacts/TypewriterStutter';
export type { IlluminatedDropcapProps } from './components/artifacts/IlluminatedDropcap';
export type { MarginaliaNotesProps } from './components/artifacts/MarginaliaNotes';

